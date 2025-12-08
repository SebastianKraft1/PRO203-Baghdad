import { getStorageRef } from "@/firebaseConfig";
import { getDownloadURL, uploadBytesResumable } from "firebase/storage";

export async function uploadImageToFirebase(uri: string) {
  const fetchResponse = await fetch(uri);
  const blob = await fetchResponse.blob();

  const imageName = uri.split("/").pop()?.split(".")[0] ?? "AnonymtBilde";
  const uploadPath = `images/${imageName}`;
  const ref = getStorageRef(uploadPath);

  try {
    console.log("Starting upload");
    await uploadBytesResumable(ref, blob);

    const url = await getDownloadURL(ref);

    return {
      url,
      path: uploadPath,
    };
  } catch (e) {
    console.error("Error uploading image", e);
    return null;
  }
}
