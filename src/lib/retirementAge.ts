interface GetRetirementAgeArgs {
  currentAge: number;
  desiredRetirementSpending: number;
  potsOfMoney: {
    eligibleAge: number;
    amount: number;
    annualAddition: number;
  }[];
  expectedReturnsByAge: { age: number; return: number }[];
  lifeExpectancyAge: number;
}

export const getRetirementAge = (args: GetRetirementAgeArgs) => {
  let ageToTest = args.currentAge;
  while (ageToTest <= args.lifeExpectancyAge) {
    const result = canIRetire(args, ageToTest);
    if (result) {
      return `Yes, at ${ageToTest}`;
    }
    ageToTest += 1;
  }

  return "No";
};

export const canIRetire = (
  args: GetRetirementAgeArgs,
  desiredRetirementAge: number,
) => {
  let age = args.currentAge;
  while (age < args.lifeExpectancyAge) {
    const expectedReturn =
      args.expectedReturnsByAge.find(
        (expectedReturn) => age > expectedReturn.age,
      )?.return ?? 1;
    if (age < desiredRetirementAge) {
      // still earning money
      args.potsOfMoney.forEach((potOfMoney) => {
        potOfMoney.amount += potOfMoney.annualAddition;
      });
    } else {
      // you are retired!
      let amountToWithdraw = args.desiredRetirementSpending;
      args.potsOfMoney.forEach((potOfMoney) => {
        if (!amountToWithdraw) {
          // you already got all of the money you need, no need to touch this pot
          return;
        }

        if (age < potOfMoney.eligibleAge) {
          // can't touch this yet
          return;
        }

        if (potOfMoney.amount >= amountToWithdraw) {
          // you got the full amount
          potOfMoney.amount -= amountToWithdraw;
          amountToWithdraw = 0;
        } else {
          // draw this account to 0 and keep looking
          amountToWithdraw -= potOfMoney.amount;
          potOfMoney.amount = 0;
        }
      });

      if (amountToWithdraw > 0) {
        // sorry you can't retire
        return false;
      }
    }

    args.potsOfMoney.forEach((potOfMoney) => {
      potOfMoney.amount *= expectedReturn; // TODO: do this below as well
    });

    age += 1;
  }

  return true;
};
