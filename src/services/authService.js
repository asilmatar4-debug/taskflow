
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

export async function registerUser(name, email, password) {
  const displayName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (displayName.length < 2) {
    throw new Error("Name must contain at least 2 characters.");
  }

  const credential = await createUserWithEmailAndPassword(
    auth,
    normalizedEmail,
    password
  );

  const user = credential.user;

  await updateProfile(user, { displayName });

  await setDoc(doc(db, "users", user.uid), {
    displayName,
    email: normalizedEmail,
    createdAt: serverTimestamp(),
  });

  return user;
}

export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(
    auth,
    email.trim().toLowerCase(),
    password
  );

  return credential.user;
}

export async function logoutUser() {
  await signOut(auth);
}
