import React from 'react';
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@uploadthing/react";
import Image from 'next/image';
import { Button } from '@/shadcn-components/ui/button';
import { XIcon } from 'lucide-react';
import { useSnackbar } from 'notistack';

interface imageUploadProps {
    onChange: (url: string) => void;
    value: string;
    // endpoint: "postImage"
    endpoint: "imageUploader"
}

const ImageUploader = ({ endpoint, onChange, value }: imageUploadProps) => {


    const { enqueueSnackbar } = useSnackbar();

    if (value) {
        return (
            <div className="relative">
                <Image
                    src={value}
                    alt="Upload"
                    width={300}
                    height={160}
                    className="rounded-md w-full h-full object-cover"
                />
                <Button
                    onClick={() => onChange("")}
                    className="absolute top-0 right-0 bg-red-500 rounded-full shadow-sm p-2"
                    type="button"
                    variant="destructive"
                    size="sm"
                >
                    <XIcon className="h-4 w-10 text-white" />
                </Button>
            </div>
        );
    }

    return (
        <div className="mx-auto p-2">
            <UploadDropzone<OurFileRouter, "imageUploader">
                endpoint={endpoint} // The name of the FileRouter you defined in your core.ts
                onClientUploadComplete={(res) => {
                    // Do something with the response
                    console.log("Files: ", res);
                    enqueueSnackbar('Image uploaded successfully! Now save the profile to apply changes.',
                        {
                            variant: 'success',
                            autoHideDuration: 5000
                        }
                    )
                    if (res && res[0]?.url) {
                        onChange(res[0].url);
                    }
                }}
                onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                }}
            // onUploadBegin={(name) => {
            //     // Do something once upload begins
            //     console.log("Uploading: ", name);
            // }}
            // onDrop={(acceptedFiles) => {
            //     // Do something with the accepted files
            //     console.log("Accepted files: ", acceptedFiles);
            // }}
            />
        </div>
    );
};

export default ImageUploader;