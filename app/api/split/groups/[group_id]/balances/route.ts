import startDb from "@/lib/db";
import ExpenseModel from "@/models/Expense";
import PaidByModel from "@/models/PaidBy";
import SplitAmongModel from "@/models/SplitAmong";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../auth/[...nextauth]/authOptions";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }
  await startDb();
  let expenses = await ExpenseModel.find({});
  let paidBy = await PaidByModel.find({});
  let splitAmong = await SplitAmongModel.find({});

  const balances = {};
  splitAmong.forEach((split) => {
    const userId = split.user;
    const amount = split.amount;

    balances[String(userId)] = (balances[String(userId)] || 0) - amount;
  });

  paidBy.forEach((payment) => {
    const userId = payment.user;
    const amount = payment.amount;

    balances[String(userId)] = (balances[String(userId)] || 0) + amount;
  });

  function simplifyBalances(balances) {
    let simplifiedBalances = {};
    let positiveBalances = {};
    let negativeBalances = [];

    // Separate positive and negative balances
    Object.entries(balances).forEach(([userId, balance]) => {
      if (balance > 0) {
        positiveBalances[userId] = balance;
      } else if (balance < 0) {
        negativeBalances.push({ userId, balance });
      }
    });

    // Sort negative balances in ascending order
    negativeBalances.sort((a, b) => a.balance - b.balance);

    // Match positive and negative balances to settle debts
    for (let [payer, amount] of Object.entries(positiveBalances)) {
      while (amount > 0) {
        let debtor = negativeBalances.pop();
        if (!debtor) break;

        let settleAmount = Math.min(amount, Math.abs(debtor.balance));
        amount = amount - settleAmount;
        debtor.balance = debtor.balance + settleAmount;

        // Update simplified balances
        if (simplifiedBalances[payer]) {
          simplifiedBalances[payer][debtor.userId] = settleAmount;
        } else {
          simplifiedBalances[payer] = { [debtor.userId]: settleAmount };
        }

        // If debtor still owes, push it back to the negative balances array
        if (debtor.balance < 0) {
          negativeBalances.push(debtor);
        }
      }
    }

    return simplifiedBalances;
  }

  const simplifiedTransactions = simplifyBalances(balances);

  return NextResponse.json(
    { simplifiedTransactions, expenses, paidBy, splitAmong },
    { status: 200 }
  );
};
