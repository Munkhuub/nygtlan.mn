import { Button } from "@/components/ui/button";
import axios from "axios";
import { CameraIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

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
  const [hasChanges, setHasChanges] = useState(false);
  const [originalUrl, setOriginalUrl] = useState<string | null>(
    defaultValue || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(defaultValue || null);
    setOriginalUrl(defaultValue || null);
    setHasChanges(false);
  }, [defaultValue]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setHasChanges(true);

    setIsUploading(true);
    try {
      const uploadedUrl = await uploadImage(file);
      if (uploadedUrl) {
        URL.revokeObjectURL(localUrl);
        setPreviewUrl(uploadedUrl);

        onChange(uploadedUrl);
        setOriginalUrl(uploadedUrl);
        setHasChanges(false);
      }
    } catch (error) {
      console.error("Image upload failed", error);
      URL.revokeObjectURL(localUrl);
      setPreviewUrl(originalUrl);
      setHasChanges(false);
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

  const handleSave = () => {
    if (previewUrl) {
      onChange(previewUrl);
      setOriginalUrl(previewUrl);
    }
    setHasChanges(false);
  };

  const handleCancel = () => {
    setPreviewUrl(originalUrl);
    setHasChanges(false);
  };

  const handleClear = () => {
    setPreviewUrl(null);
    setHasChanges(true);
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageError = () => {
    console.error("Image failed to load:", previewUrl);
    setPreviewUrl(null);
  };

  return (
    //cover
    <div className="relative w-full h-[200px] sm:h-[319px] bg-[#F4F4F5]">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageChange}
        disabled={isUploading}
      />

      {previewUrl ? (
        <>
          <Image
            src={previewUrl}
            className="w-full h-full object-cover"
            alt="Profile preview"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={handleImageError}
          />

          <Button
            onClick={openFileDialog}
            size="sm"
            variant="secondary"
            className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-white/80 hover:bg-white text-gray-700 backdrop-blur-sm px-2 py-1"
            disabled={isUploading}
          >
            <CameraIcon className="size-3 sm:size-4 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">Change Cover</span>
          </Button>
        </>
      ) : (
        <div className="w-full h-full bg-[#F4F4F5] flex items-center justify-center">
          <Button
            onClick={openFileDialog}
            className="flex gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <CameraIcon className="size-4 sm:size-5" />
            <p>Add a cover image</p>
          </Button>
        </div>
      )}

      {hasChanges && !isUploading && (
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-1 sm:gap-2 flex-col sm:flex-row">
          <Button
            onClick={handleCancel}
            size="sm"
            variant="outline"
            className="bg-white/80 hover:bg-white text-gray-700 backdrop-blur-sm px-2 py-1 text-xs sm:text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-xs sm:text-sm"
          >
            Save
          </Button>
        </div>
      )}

      {previewUrl && !hasChanges && !isUploading && (
        <Button
          type="button"
          onClick={handleClear}
          size="icon"
          variant="ghost"
          className="absolute top-2 sm:top-4 right-2 sm:right-4 rounded-full bg-white/80 hover:bg-white text-gray-500 size-6 sm:size-8 p-0 backdrop-blur-sm"
        >
          <XIcon className="size-3 sm:size-4" />
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
