interface PotOfMoney {
  name: string;
  eligibleAge: number;
  amount: number;
  annualAddition: number;
}

export interface GetRetirementAgeArgs {
  currentAge: number;
  desiredRetirementSpending: number;
  potsOfMoney: PotOfMoney[];
  expectedReturnsByAge: { age: number; return: number }[];
  lifeExpectancyAge: number;
}

export const getRetirementAge = (args: GetRetirementAgeArgs) => {
  const agesToTest = Array(args.lifeExpectancyAge - args.currentAge)
    .fill(0)
    .map((_val, index) => index + args.currentAge);

  for (const ageToTest of agesToTest) {
    const result = canIRetire(args, ageToTest);
    if (result.result) {
      return {
        retirementAge: ageToTest,
        potsOfMoneyOverTime: result.potsOfMoneyOverTime,
      };
    }
  }

  return {
    retirementAge: undefined,
    potsOfMoneyOverTime: [],
  };
};

export const canIRetire = (
  args: GetRetirementAgeArgs,
  desiredRetirementAge: number,
): {
  result: boolean;
  potsOfMoneyOverTime: {
    age: number;
    potsOfMoney: PotOfMoney[];
  }[];
} => {
  const agesToSimulate = Array(args.lifeExpectancyAge - args.currentAge + 1)
    .fill(0)
    .map((_val, index) => index + args.currentAge);

  let canRetire = true;

  const potsOfMoneyOverTime = agesToSimulate.reduce<
    {
      age: number;
      potsOfMoney: PotOfMoney[];
    }[]
  >(
    (prev, ageToSimulate) => {
      const expectedReturn =
        args.expectedReturnsByAge
          .filter((expectedReturn) => ageToSimulate >= expectedReturn.age)
          .slice(-1)[0]?.return ?? 1;

      const latest = prev.slice(-1)[0];

      if (ageToSimulate < desiredRetirementAge) {
        return [
          ...prev,
          {
            age: ageToSimulate,
            potsOfMoney: latest.potsOfMoney.map((potOfMoney) => ({
              ...potOfMoney,
              amount:
                potOfMoney.amount * expectedReturn + potOfMoney.annualAddition,
            })),
          },
        ];
      } else {
        let amountToWithdraw = args.desiredRetirementSpending;

        const newPots = [
          ...prev,
          {
            age: ageToSimulate,
            potsOfMoney: latest.potsOfMoney.map((potOfMoney) => {
              if (
                ageToSimulate < potOfMoney.eligibleAge ||
                amountToWithdraw === 0
              ) {
                return {
                  ...potOfMoney,
                  amount: potOfMoney.amount * expectedReturn,
                };
              }

              if (potOfMoney.amount >= amountToWithdraw) {
                const newAmount = potOfMoney.amount - amountToWithdraw;
                amountToWithdraw = 0;
                return {
                  ...potOfMoney,
                  amount: newAmount * expectedReturn,
                };
              } else {
                amountToWithdraw -= potOfMoney.amount;
                return {
                  ...potOfMoney,
                  amount: 0,
                };
              }
            }),
          },
        ];

        if (amountToWithdraw > 0) {
          canRetire = false;
        }

        return newPots;
      }
    },
    [
      {
        age: args.currentAge,
        potsOfMoney: args.potsOfMoney.map((potOfMoney) => ({
          ...potOfMoney,
        })),
      },
    ],
  );

  return {
    result: canRetire,
    potsOfMoneyOverTime,
  };
};
