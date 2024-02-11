export function simplifyBalances(balances: any) {
  let simplifiedBalances = {};
  let positiveBalances = {};
  let negativeBalances = <any>[];

  // Separate positive and negative balances
  Object.entries(balances).forEach(([userId, balance]) => {
    if ((balance as any) > 0) {
      (positiveBalances as any)[userId] = balance;
    } else if ((balance as any) < 0) {
      negativeBalances.push({ userId, balance });
    }
  });

  // Sort negative balances in ascending order
  negativeBalances.sort((a: any, b: any) => a.balance - b.balance);

  // Match positive and negative balances to settle debts
  for (let [payer, amount] of Object.entries(positiveBalances) as any) {
    while (amount > 0) {
      let debtor = negativeBalances.pop();
      if (!debtor) break;

      let settleAmount = Math.min(amount, Math.abs(debtor.balance));
      amount = amount - settleAmount;
      debtor.balance = debtor.balance + settleAmount;

      // Update simplified balances
      if ((simplifiedBalances as any)[payer]) {
        (simplifiedBalances as any)[payer][debtor.userId] = settleAmount;
      } else {
        (simplifiedBalances as any)[payer] = {
          [debtor.userId]: settleAmount,
        };
      }

      // If debtor still owes, push it back to the negative balances array
      if (debtor.balance < 0) {
        negativeBalances.push(debtor);
      }
    }
  }

  return simplifiedBalances;
}
