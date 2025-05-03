"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/icons";

interface AvatarUploadProps {
  userId: string;
  url?: string;
  onUpload?: (url: string) => void;
}

export function AvatarUpload({ userId, url, onUpload }: AvatarUploadProps) {
  const supabase = createClient();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) {
      setAvatarUrl(url);
    } else {
      downloadImage();
    }
  }, [url]);

  async function downloadImage() {
    try {
      if (!userId) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", userId)
        .single();

      if (profile?.avatar_url) {
        const { data } = await supabase.storage
          .from("avatars")
          .download(profile.avatar_url);
          
        if (data) {
          const url = URL.createObjectURL(data);
          setAvatarUrl(url);
        }
      }
    } catch (error) {
      console.error("Error downloading image: ", error);
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = await supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      if (urlData) {
        const avatarUrl = urlData.publicUrl;
        
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ avatar_url: filePath })
          .eq("id", userId);

        if (updateError) {
          throw updateError;
        }

        setAvatarUrl(avatarUrl);
        if (onUpload) onUpload(avatarUrl);
        toast.success("Avatar updated successfully!");
      }
    } catch (error) {
      console.error("Error uploading avatar: ", error);
      toast.error("Error uploading avatar");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-24 w-24">
        <Avatar className="h-24 w-24 border-2 border-gray-700">
          <AvatarImage src={avatarUrl || undefined} alt="Avatar" />
          <AvatarFallback className="bg-gray-700 text-xl text-white">
            {userId && userId[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
            <Loader className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="avatar-upload" className="cursor-pointer">
          {/* <Button 
            variant="outline" 
            className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Change Avatar"}
          </Button> */}
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={uploadAvatar}
          className="hidden"
          disabled={uploading}
        />
      </div>
    </div>
  );
}
