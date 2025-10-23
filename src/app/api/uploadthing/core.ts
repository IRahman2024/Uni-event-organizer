import { stackServerApp } from "@/stack/server";
import { th } from "date-fns/locale";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// const auth = (req: Request) => ({ id }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
    })
        // Set permissions and file types for this FileRoute
        .middleware(async ({ req }) => {
            // This code runs on your server before upload
            const user = await stackServerApp.getUser();
            console.log('user: ',user);
            

            // If you throw, the user will not be able to upload
            if (!user) throw new UploadThingError("Unauthorized");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            try {
                // This code RUNS ON YOUR SERVER after upload
                console.log("Upload complete for userId:", metadata.userId);

                console.log("file url", file.ufsUrl);

                return { uploadedBy: metadata.userId };
            } catch (error) {
                console.log("error in upload!");
                throw error;
            }

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
