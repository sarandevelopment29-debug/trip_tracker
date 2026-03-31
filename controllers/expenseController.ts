import {
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type ExpenseInput = {
  title: string;
  amount: number;
  category: string;
  date: string;
  paidBy: string;
};

export const expenseController = {
  addExpense: async (tripId: string, expenseData: ExpenseInput) => {
    const data = {
      tripId,
      ...expenseData,
      createdAt: Timestamp.now().toMillis(),
    };
    // Employs a flat root collection "expenses"
    const docRef = await addDoc(collection(db, "expenses"), data);
    return { id: docRef.id, ...data };
  },

  getExpensesByTrip: async (tripId: string) => {
    const q = query(collection(db, "expenses"), where("tripId", "==", tripId));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<ExpenseInput, never> & { createdAt: number; tripId: string }),
    }));

    // JS sort by explicit integer to avoid missing complex composite indexed queries in Firestore MVP
    return data.sort((a, b) => b.createdAt - a.createdAt);
  },

  updateExpense: async (expenseId: string, expenseData: ExpenseInput) => {
    await updateDoc(doc(db, "expenses", expenseId), expenseData);
    return { success: true };
  },

  deleteExpense: async (expenseId: string) => {
    await deleteDoc(doc(db, "expenses", expenseId));
    return { success: true };
  },
};
