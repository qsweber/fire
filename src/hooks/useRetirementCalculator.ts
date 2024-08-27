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
      setRetirementAge(result.age?.toString() ?? "No!");
      console.log("qsw", result);
      setData(
        result.potsOfMoney?.map((potOfMoney) => ({
          age: potOfMoney.age,
          uv: potOfMoney.potsOfMoney[0].amount,
          pv: potOfMoney.potsOfMoney[1].amount,
        })),
      );
    } catch {
      setError("invalid json");
    }
  }, [rawConfig]);

  return { setRawConfig, error, retirementAge, data };
};
