
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  runTransaction,
  doc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const projectsCollection = collection(db, "projects");

// VALIDATION
function validateProject(name, description = "") {
  const cleanName = name.trim();
  const cleanDescription = description.trim();

  if (cleanName.length < 3 || cleanName.length > 80) {
    throw new Error("Project name must be 3–80 characters.");
  }

  if (cleanDescription.length > 1000) {
    throw new Error("Description cannot exceed 1000 characters.");
  }

  return {
    name: cleanName,
    description: cleanDescription,
  };
}

// CREATE PROJECT
export async function createProject(userId, name, description = "") {
  if (!userId) {
    throw new Error("You must be signed in.");
  }

  const data = validateProject(name, description);

  const result = await addDoc(projectsCollection, {
    ...data,
    ownerId: userId,
    memberIds: [userId],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return result.id;
}

// GET USER PROJECTS
export async function getUserProjects(userId) {
  if (!userId) {
    throw new Error("You must be signed in.");
  }

  const projectsQuery = query(
    projectsCollection,
    where("memberIds", "array-contains", userId)
  );

  const snapshot = await getDocs(projectsQuery);

  return snapshot.docs
    .map((project) => ({
      id: project.id,
      ...project.data(),
    }))
    .sort((a, b) => {
      const first = a.createdAt?.toMillis?.() || 0;
      const second = b.createdAt?.toMillis?.() || 0;

      return second - first;
    });
}

// GET SINGLE PROJECT
export async function getProject(projectId) {
  const snapshot = await getDoc(
    doc(db, "projects", projectId)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

// UPDATE PROJECT
export async function updateProject(
  projectId,
  name,
  description = ""
) {
  const data = validateProject(name, description);

  await updateDoc(doc(db, "projects", projectId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProject(projectId) {
  const projectRef = doc(db, "projects", projectId);

  const tasksSnapshot = await getDocs(
    collection(db, "projects", projectId, "tasks")
  );

  if (!tasksSnapshot.empty) {
    throw new Error(
      "Cannot delete a project that contains tasks."
    );
  }

  await runTransaction(db, async (transaction) => {
    const projectSnapshot = await transaction.get(projectRef);

    if (!projectSnapshot.exists()) {
      throw new Error("Project not found.");
    }

    transaction.delete(projectRef);
  });
}