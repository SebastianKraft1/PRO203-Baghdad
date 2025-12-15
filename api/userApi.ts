/*
  Denne filen har ansvaret for å opprette, hente og oppdatere brukerprofil
  i Firestore (users-collection)
*/

import { db } from "@/firebaseConfig";
import { UserData } from "@/types/user";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// Lager en ny brukerprofil i Firestore når man registrerer seg første gang
export async function createUserProfile(userId: string, user: UserData) {
  try {
    await setDoc(doc(db, "users", userId), user);
    console.log("Document written with ID: ", userId);
  } catch (e) {
    console.log("Error creating user profile", e);
  }
}

// Henter brukerprofilen for innlogget bruker
export async function getUserProfile(userId: string) {
  try {
    const querySnapshot = await getDoc(doc(db, "users", userId));
    if (!querySnapshot.exists()) {
      console.log("No such document!");
      return null;
    }
    const user = querySnapshot.data() as UserData;
    console.log("Successfully fetched user: ", user);
    return user;
  } catch (e) {
    console.log("Error getting user profile", e);
    return null;
  }
}

// Oppdaterer brukerprofil
export async function updateUserProfile(userId: string, fields: any) {
  try {
    await updateDoc(doc(db, "users", userId), fields);
    console.log("User profile updated: ", userId, fields);
  } catch (e) {
    console.log("Error updating user profile", e);
  }
}

// Oppdaterer profilbilde
export async function updateUserProfileImage(
  userId: string,
  profileImage: string,
  profileImagePath: string
) {
  try {
    await updateDoc(doc(db, "users", userId), {
      profileImage,
      profileImagePath,
    });
    console.log("Profile image updated for:", userId);
  } catch (e) {
    console.error("Error updating profile image:", e);
  }
}

// Oppdaterer antall registrerte barn for bruker
export async function updateRegisteredChildren(userId: string, count: number) {
  try {
    await updateDoc(doc(db, "users", userId), {
      registeredChildren: count,
    });
    console.log("Registered children updated for:", userId);
  } catch (e) {
    console.error("Error updating registered children", e);
  }
}
