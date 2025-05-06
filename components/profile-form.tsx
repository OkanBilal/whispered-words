"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/text-area";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const profileFormSchema = z.object({
  full_name: z
    .string()
    .min(2, {
      message: "Full name must be at least 2 characters.",
    })
    .max(30, {
      message: "Full name must not be longer than 30 characters.",
    }),
  bio: z
    .string()
    .max(160, {
      message: "Bio must not be longer than 160 characters.",
    })
    .optional(),
  website: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .or(z.literal(""))
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type ProfileProps = {
  initialData?: any;
  userId: string;
  userEmail?: string;
  userName?: string;
};

export function ProfileForm({ initialData, userId, userEmail, userName }: ProfileProps) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
    defaultValues: {
      full_name: userName || initialData?.name?.replace(/^"|"$/g, '') || initialData?.full_name || "",
      bio: initialData?.bio || "",
      website: initialData?.website || "",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    try {
      // Keep the full_name value from the form defaults
      const { error } = await supabase.from("profiles").upsert({
        id: userId,
        full_name: userName || initialData?.name?.replace(/^"|"$/g, '') || initialData?.full_name || "",
        bio: data.bio,
        website: data.website,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw error;
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-6">
          <FormLabel className="text-white">Email</FormLabel>
          <Input
            type="email"
            value={userEmail || ""}
            disabled
            className="bg-black opacity-50 text-white border-slate-700 border-2 cursor-not-allowed mt-1 focus:outline-none focus:ring-0 focus:ring-offset-0"
          />
          <FormDescription className="text-gray-400 mt-1">
            Your email address cannot be changed.
          </FormDescription>
        </div>

        <div className="mb-6">
          <FormLabel className="text-white">Full Name</FormLabel>
          <Input
            type="text"
            value={userName || initialData?.name?.replace(/^"|"$/g, '') || initialData?.full_name || ""}
            disabled
            className="bg-black opacity-50 text-white border-slate-700 border-2 cursor-not-allowed mt-1 focus:outline-none focus:ring-0 focus:ring-offset-0"
          />
          <FormDescription className="text-gray-400 mt-1">
            Your name is synced from your authentication provider.
          </FormDescription>
        </div>
      </form>
    </Form>
  );
}
