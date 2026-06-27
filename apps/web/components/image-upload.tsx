"use client";

import { useState, useRef } from "react";
import { uploadImage } from "@/lib/api";

interface ImageUploadProps {
  token: string;
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ token, value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);

    try {
      const result = await uploadImage(token, file);
      onChange(result.url);
    } catch {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-xl border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-foreground disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Choose Image"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-red-500 hover:text-red-600 transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      {value && (
        <div className="overflow-hidden rounded-xl border border-border">
          <img
            src={value}
            alt="Cover preview"
            className="w-full max-h-64 object-cover"
          />
        </div>
      )}
    </div>
  );
}
