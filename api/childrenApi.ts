import { db } from "@/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

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

export async function updateChild(userId: string, childId: string, data: any) {
  try {
    const ref = doc(db, "users", userId, "children", childId);
    await updateDoc(ref, data);
    console.log("Child updated:", childId);
  } catch (e) {
    console.error("Error updating child:", e);
  }
}

export async function deleteChild(userId: string, childId: string) {
  try {
    const ref = doc(db, "users", userId, "children", childId);
    await deleteDoc(ref);
    console.log("Child deleted:", childId);
  } catch (e) {
    console.error("Error deleting child:", e);
  }
}

export async function checkInChild(userId: string, childId: string) {
  try {
    await updateChild(userId, childId, {
      isCheckedIn: true,
      status: "Innsjekket",
      checkInTime: new Date().toISOString(),
    });
    console.log("Child checked in:", childId);
  } catch (e) {
    console.error("Error checking in child:", e);
  }
}

export async function checkOutChild(userId: string, childId: string) {
  try {
    await updateChild(userId, childId, {
      isCheckedIn: false,
      status: "Hentet",
      checkOutTime: new Date().toISOString(),
    });
    console.log("Child checked out:", childId);
  } catch (e) {
    console.error("Error checking out child:", e);
  }
}

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
