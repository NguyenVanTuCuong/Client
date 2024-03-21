import React, { memo } from "react";
import Dropzone from "react-dropzone";
import { Image } from "@nextui-org/react";
import { FileUpIcon } from "lucide-react";

interface FileDropzoneProps {
    imageFile: File | null, 
    onDrop: (files: Array<File>) => void
}

export const FileDropzone = memo(
  (props: FileDropzoneProps) => {
    const { imageFile, onDrop } = props
    return (
      <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps({className: "w-full"})}>
            <input {...getInputProps()} />
            {imageFile ? (
              <Image
                src={URL.createObjectURL(imageFile)}
                classNames={{
                  wrapper:
                    "aspect-square overflow-hidden grid place-content-center w-full",
                }}
              />
            ) : (
              <div className="aspect-square w-full grid place-items-center rounded-large border-1">
                <FileUpIcon className="w-12 h-12 text-foreground-500" />
              </div>
            )}
          </div>
        )}
      </Dropzone>
    );
  }
);
