import { collection, doc, addDoc, getDocs, deleteDoc, getDoc, Timestamp, query, orderBy, updateDoc } from "firebase/firestore";
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
    await deleteDoc(doc(db, "trips", tripId));
  },

  updateTrip: async (tripId: string, data: any) => {
    const tripRef = doc(db, "trips", tripId);
    await updateDoc(tripRef, data);
    return { success: true };
  }
};
