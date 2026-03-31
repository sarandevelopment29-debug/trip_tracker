import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc, Timestamp, query, orderBy, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function createTrip(name: string, totalDays: number) {
  const tripData = {
    name,
    totalDays,
    createdAt: Timestamp.now().toMillis() // Using absolute timestamps for serializable returns via Server Actions
  };
  const docRef = await addDoc(collection(db, "trips"), tripData);
  return docRef.id;
}

export async function getTrips() {
  const q = query(collection(db, "trips"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getTrip(tripId: string) {
  const docRef = doc(db, "trips", tripId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

export async function deleteTrip(tripId: string) {
  await deleteDoc(doc(db, "trips", tripId));
}

export async function addMember(tripId: string, name: string) {
  const memberData = {
    name,
    contributionAmount: 0
  };
  const docRef = await addDoc(collection(db, `trips/${tripId}/members`), memberData);
  return docRef.id;
}

export async function updateContribution(tripId: string, memberId: string, amount: number) {
  const memberRef = doc(db, `trips/${tripId}/members`, memberId);
  await updateDoc(memberRef, {
    contributionAmount: amount
  });
}

export async function getMembers(tripId: string) {
  const querySnapshot = await getDocs(collection(db, `trips/${tripId}/members`));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addExpense(tripId: string, expenseData: { title: string, amount: number, category: string, day: number, paidBy: string }) {
  const data = {
    ...expenseData,
    createdAt: Timestamp.now().toMillis()
  };
  const docRef = await addDoc(collection(db, `trips/${tripId}/expenses`), data);
  return docRef.id;
}

export async function deleteExpense(tripId: string, expenseId: string) {
  await deleteDoc(doc(db, `trips/${tripId}/expenses`, expenseId));
}

export async function getExpenses(tripId: string) {
  const q = query(collection(db, `trips/${tripId}/expenses`), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
