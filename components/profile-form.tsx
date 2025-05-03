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
};

export function ProfileForm({ initialData, userId }: ProfileProps) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
    defaultValues: {
      full_name: initialData?.full_name || "",
      bio: initialData?.bio || "",
      website: initialData?.website || "",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: userId,
        ...data,
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
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Full Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="bg-black opacity-50 text-white border-slate-700 border-2 "
                />
              </FormControl>
              <FormDescription className="text-gray-400">
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className=" bg-white hover:bg-neutral-200 text-black  rounded-md px-1 py-2 sm:px-3 sm:py-2 border border-gray-800 text-sm font-semibold transition-all duration-200"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update profile"}
        </Button>
      </form>
    </Form>
  );
}
