/* 
  Denne filen er ansvarlig for all Firestore-kommunikasjon knyttet til barn
  Det vil si opprettelse, henting, oppdatering og inn/utsjekk.
*/

import { db } from "@/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

// Oppretter et nytt barn under en spesifikk bruker
export async function createChild(userId: string, child: any) {
  try {
    const ref = collection(db, "users", userId, "children");
    const docRef = await addDoc(ref, {
      ...child,
      isCheckedIn: false,
      status: "Hentet",
      createdAt: new Date().toISOString(),
    });

    console.log("Child created with ID:", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error creating child:", e);
    return null;
  }
}

// Henter alle barn som er registret på brukeren
export async function getChildren(userId: string) {
  try {
    const ref = collection(db, "users", userId, "children");
    const snapshot = await getDocs(ref);

    const children = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    console.log("Fetched children:", children);
    return children;
  } catch (e) {
    console.error("Error fetching children:", e);
    return [];
  }
}

// Oppdaterer informasjonen om et barn
export async function updateChild(userId: string, childId: string, data: any) {
  try {
    const ref = doc(db, "users", userId, "children", childId);
    await updateDoc(ref, data);
    console.log("Child updated:", childId);
  } catch (e) {
    console.error("Error updating child:", e);
  }
}

// Sletter et barn fra databasen
export async function deleteChild(userId: string, childId: string) {
  try {
    const ref = doc(db, "users", userId, "children", childId);
    await deleteDoc(ref);
    console.log("Child deleted:", childId);
  } catch (e) {
    console.error("Error deleting child:", e);
  }
}

// Sjekker et barn inn og oppdaterer historikken
export async function checkInChild(userId: string, childId: string) {
  try {
    const now = new Date().toISOString();

    const ref = doc(db, "users", userId, "children", childId);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) return;

    const data = snapshot.data();
    const updatedHistory = [...(data.checkInHistory ?? []), now];

    await updateChild(userId, childId, {
      isCheckedIn: true,
      status: "Innsjekket",
      checkInTime: now,
      checkInHistory: updatedHistory,
    });
    console.log("Child checked in:", childId);
  } catch (e) {
    console.error("Error checking in child:", e);
  }
}

// Sjekker et barn ut og oppdaterer historikken
export async function checkOutChild(userId: string, childId: string) {
  try {
    const now = new Date().toISOString();

    const ref = doc(db, "users", userId, "children", childId);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) return;

    const data = snapshot.data();
    const updatedHistory = [...(data.checkInHistory ?? []), now];

    await updateChild(userId, childId, {
      isCheckedIn: false,
      status: "Hentet",
      checkOutTime: new Date().toISOString(),
      checkOutHistory: updatedHistory,
    });
    console.log("Child checked out:", childId);
  } catch (e) {
    console.error("Error checking out child:", e);
  }
}

// Lytter på endringer i sanntid for barn som er tilknyttet en bruker
export function listenToChildren(userId: string, callback: Function) {
  try {
    const ref = collection(db, "users", userId, "children");

    return onSnapshot(ref, (snapshot) => {
      const children = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      callback(children);
    });
  } catch (e) {
    console.error("Error listening to children:", e);
    return () => {};
  }
}
