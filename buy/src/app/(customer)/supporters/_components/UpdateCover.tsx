import { Button } from "@/components/ui/button";
import axios from "axios";
import { CameraIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";

const UPLOAD_PRESET = "buy-me-coffee";
const CLOUD_NAME = "dpbmpprw5";

type UpdateImageProps = {
  defaultValue?: string;
  onChange: (imageUrl: string) => void;
};
type CloudinaryUploadResponse = {
  secure_url: string;
};

export const UpdateCover = ({ defaultValue, onChange }: UpdateImageProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    defaultValue || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    setIsUploading(true);
    try {
      const uploadedUrl = await uploadImage(file);
      if (uploadedUrl) {
        onChange(uploadedUrl);
      }
    } catch (error) {
      console.error("Image upload failed", error);
      setPreviewUrl(defaultValue || null);
    } finally {
      setIsUploading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await axios.post<CloudinaryUploadResponse>(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.secure_url;
  };

  const handleClear = () => {
    setPreviewUrl(null);
    onChange("");
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="relative w-full h-[319px] bg-[#F4F4F5]">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageChange}
        disabled={isUploading}
      />

      {previewUrl ? (
        <img
          src={previewUrl}
          className="w-full h-full object-cover"
          alt="Profile preview"
        />
      ) : (
        <div className="w-full h-full bg-[#F4F4F5] flex items-center justify-center">
          <Button onClick={openFileDialog} className="flex gap-2">
            <CameraIcon />
            <p>Add a cover image</p>
          </Button>
        </div>
      )}

      {previewUrl && !isUploading && (
        <Button
          type="button"
          onClick={handleClear}
          size="icon"
          variant="ghost"
          className="absolute -top-1 -right-1 rounded-full bg-white text-gray-500 hover:bg-gray-200 size-5 p-0"
        >
          <XIcon className="w-3 h-3" />
        </Button>
      )}

      {isUploading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-xs text-white">
          Uploading...
        </div>
      )}
    </div>
  );
};
