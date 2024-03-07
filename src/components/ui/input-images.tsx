import React from "react";
import { useCallback, type ChangeEvent } from "react";
import { UploadCloudIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/classes";
import { resizeImage } from "@/utils/images";

interface Image {
  preview: string;
  file: File;
}

interface InputImagesProps {
  value: Image[];
  onImagesChange: React.Dispatch<
    React.SetStateAction<
      {
        preview: string;
        file: File;
      }[]
    >
  >;
  onChangeFilesLength: (length: number) => boolean;
}

export const InputImages = (props: InputImagesProps) => {
  const { value: images, onImagesChange, onChangeFilesLength } = props;

  const onChangePicture = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const res = onChangeFilesLength(event.target.files.length);
        if (!res) return;
        for (const file of event.target.files) {
          if (file) {
            if (file.size / 1024 / 1024 > 5) {
              toast(
                `${event.target.files.length > 1 ? "Un des fichiers est" : "Fichier"} trop volumineux (max 5MB)`
              );
            } else {
              resizeImage(file, 1200, 620, ({ file, dataURL }) => {
                onImagesChange((prev) => [...prev, { file, preview: dataURL }]);
              });
            }
          }
        }
        event.currentTarget.value = "";
      }
    },
    [onChangeFilesLength, onImagesChange]
  );

  const handleRemove = (index: number) => {
    onImagesChange((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="relative overflow-hidden rounded-lg border shadow-sm">
      <input
        id="image-upload"
        name="image"
        type="file"
        multiple
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          onChangePicture(e);
        }}
      />
      {images.length === 0 ? (
        <label
          htmlFor="image-upload"
          className="group flex h-36 cursor-pointer flex-col items-center justify-center bg-card"
        >
          <UploadCloudIcon className="transition duration-300 group-hover:scale-110" />
          <p className="mt-2 text-center text-sm">Ajouter des images</p>
          {/* <p className="text-xs text-muted-foreground">ou faire glisser-déposer</p> */}
        </label>
      ) : (
        <label
          htmlFor="image-upload"
          className={cn(
            buttonVariants({ size: "sm" }),
            "absolute left-2 top-2 z-30 cursor-pointer bg-gray-100 text-black hover:bg-gray-200"
          )}
        >
          Ajouter des images
        </label>
      )}
      {images.map((image, index) => (
        <div key={index} className="relative h-36 border">
          <button
            className={cn(
              buttonVariants({ variant: "outline", size: "icon-sm" }),
              "absolute right-4 top-4 z-30 bg-gray-100 text-black hover:bg-gray-200"
            )}
            onClick={() => {
              handleRemove(index);
            }}
          >
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <img src={image.preview} alt="preview" className="h-full w-full object-cover" />
        </div>
      ))}
    </div>
  );
};
