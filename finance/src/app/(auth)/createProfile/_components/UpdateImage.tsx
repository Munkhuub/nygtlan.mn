import { Button } from "@/components/ui/button";
import axios from "axios";
import { CameraIcon, XIcon } from "lucide-react";
import { useState } from "react";

const UPLOAD_PRESET = "buy-me-coffee";
const CLOUD_NAME = "dpbmpprw5";

type UpdateImageProps = {
  defaultValue?: string;
  onChange: (imageUrl: string) => void;
};
type CloudinaryUploadResponse = {
  secure_url: string;
};

export const UpdateImage = ({ defaultValue, onChange }: UpdateImageProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    defaultValue || null
  );

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

  return (
    <div className="relative w-40 h-40">
      <label className="cursor-pointer block w-full h-full">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
          disabled={isUploading}
        />
        {previewUrl ? (
          <img
            src={previewUrl}
            className="w-40 h-40 object-cover rounded-full border border-gray-300"
            alt="Profile preview"
          />
        ) : (
          <div className="w-40 h-40 flex items-center justify-center rounded-full border border-dashed border-gray-300 ">
            <CameraIcon className="w-5 h-5 text-gray-500" />
          </div>
        )}
      </label>

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
        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center text-xs text-white">
          Uploading...
        </div>
      )}
    </div>
  );
};
