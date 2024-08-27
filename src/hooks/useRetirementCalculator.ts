import * as React from "react";

import { getRetirementAge } from "../lib";

interface UseRetirementCalculatorProps {}

interface UseRetirementCalculator {
  setRawConfig: (rawConfig: string) => void;
  error?: string;
  retirementAge?: string;
  data: { age: number; uv: number; pv: number }[];
}

export const useRetirementCalculator = (
  props: UseRetirementCalculatorProps,
): UseRetirementCalculator => {
  const [rawConfig, setRawConfig] = React.useState<string | undefined>();
  const [error, setError] = React.useState<string | undefined>();
  const [retirementAge, setRetirementAge] = React.useState<
    string | undefined
  >();
  const [data, setData] = React.useState<
    { age: number; uv: number; pv: number }[]
  >([]);

  React.useEffect(() => {
    setError(undefined);
    if (!rawConfig) {
      return;
    }

    try {
      const parsedConfig = JSON.parse(rawConfig);
      const result = getRetirementAge(parsedConfig);
      setRetirementAge(result.retirementAge?.toString() ?? "No!");
      console.log("qsw", result);
      setData(
        result.potsOfMoneyOverTime.map((potOfMoney) => ({
          age: potOfMoney.age,
          uv: Math.round(potOfMoney.potsOfMoney[0].amount) / 1000000,
          pv: Math.round(potOfMoney.potsOfMoney[1].amount) / 1000000,
        })),
      );
    } catch (error) {
      console.log(error);
      setError("invalid json");
    }
  }, [rawConfig]);

  return { setRawConfig, error, retirementAge, data };
};
