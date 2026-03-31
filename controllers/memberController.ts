import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const memberController = {
  addMember: async (tripId: string, name: string) => {
    const memberData = {
      tripId,
      name,
      upfrontPaid: 0 // Default start
    };
    // Employs a flat root collection "members"
    const docRef = await addDoc(collection(db, "members"), memberData);
    return { id: docRef.id, ...memberData };
  },

  getMembersByTrip: async (tripId: string) => {
    const q = query(collection(db, "members"), where("tripId", "==", tripId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  updateContribution: async (memberId: string, upfrontPaid: number) => {
    const memberRef = doc(db, "members", memberId);
    await updateDoc(memberRef, { upfrontPaid });
    return { success: true };
  },

  deleteMember: async (memberId: string) => {
    await deleteDoc(doc(db, "members", memberId));
    return { success: true };
  }
};
