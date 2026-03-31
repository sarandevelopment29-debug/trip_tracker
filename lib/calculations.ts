export interface Member {
  id: string;
  name: string;
  upfrontPaid: number;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  paidBy: string; // memberId
  createdAt: number; // or number (timestamp)
}

export interface Settlement {
  memberId: string;
  name: string;
  upfrontPaid: number;
  pendingQuote: number;
  finalBalance: number; // positive = get return, negative = need to pay
}

export interface TripSummary {
  totalUpfront: number;
  totalExpense: number;
  availableBalance: number;
  perPerson: number;
  settlements: Settlement[];
}

export function calculateTripSummary(members: Member[], expenses: Expense[], quotePerPerson: number): TripSummary {
  const totalUpfront = members.reduce((sum, m) => sum + Number(m.upfrontPaid || 0), 0);
  const totalExpense = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const totalMembers = members.length;
  const perPerson = totalMembers > 0 ? totalExpense / totalMembers : 0;
  const availableBalance = totalUpfront - totalExpense;

  const settlements: Settlement[] = members.map(member => {
    const upfrontPaid = Number(member.upfrontPaid) || 0;
    const pendingQuote = Math.max(0, quotePerPerson - upfrontPaid);
    const finalBalance = upfrontPaid - perPerson;

    return {
      memberId: member.id,
      name: member.name,
      upfrontPaid,
      pendingQuote,
      finalBalance,
    };
  });

  return {
    totalUpfront,
    totalExpense,
    availableBalance,
    perPerson,
    settlements,
  };
}
