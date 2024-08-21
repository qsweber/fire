import * as _ from "lodash";

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
    const result = canIRetire(_.cloneDeep(args), ageToTest);
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
  let potsOfMoney = [...args.potsOfMoney];
  while (age <= args.lifeExpectancyAge) {
    const expectedReturn =
      args.expectedReturnsByAge.find(
        (expectedReturn) => age > expectedReturn.age,
      )?.return ?? 1;
    if (age < desiredRetirementAge) {
      // still earning money
      potsOfMoney.forEach((potOfMoney) => {
        potOfMoney.amount += potOfMoney.annualAddition;
      });
    } else {
      // you are retired!
      let amountToWithdraw = args.desiredRetirementSpending;
      potsOfMoney.forEach((potOfMoney) => {
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

    potsOfMoney.forEach((potOfMoney) => {
      potOfMoney.amount *= expectedReturn; // TODO: do this below as well
    });

    console.log(age, expectedReturn, JSON.stringify(potsOfMoney));

    age += 1;
  }

  return true;
};
