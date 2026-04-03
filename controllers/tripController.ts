import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  Timestamp,
  query,
  orderBy,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const tripController = {
  createTrip: async (name: string, totalDays: number, quotePerPerson: number) => {
    const tripData = {
      name,
      totalDays,
      quotePerPerson,
      createdAt: Timestamp.now().toMillis()
    };
    const docRef = await addDoc(collection(db, "trips"), tripData);
    return { id: docRef.id, ...tripData };
  },

  getTrips: async () => {
    const q = query(collection(db, "trips"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  getTripById: async (tripId: string) => {
    const docRef = doc(db, "trips", tripId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  deleteTrip: async (tripId: string) => {
    // Cascade delete all related members and expenses before deleting the trip document.
    const membersQuery = query(collection(db, "members"), where("tripId", "==", tripId));
    const expensesQuery = query(collection(db, "expenses"), where("tripId", "==", tripId));

    const [membersSnapshot, expensesSnapshot] = await Promise.all([
      getDocs(membersQuery),
      getDocs(expensesQuery),
    ]);

    const refsToDelete = [
      ...membersSnapshot.docs.map((d) => d.ref),
      ...expensesSnapshot.docs.map((d) => d.ref),
      doc(db, "trips", tripId),
    ];

    // Firestore batches allow max 500 writes per batch.
    for (let i = 0; i < refsToDelete.length; i += 500) {
      const batch = writeBatch(db);
      const chunk = refsToDelete.slice(i, i + 500);
      chunk.forEach((ref) => batch.delete(ref));
      await batch.commit();
    }
  },

  updateTrip: async (tripId: string, data: Record<string, unknown>) => {
    const tripRef = doc(db, "trips", tripId);
    await updateDoc(tripRef, data);
    return { success: true };
  }
};
