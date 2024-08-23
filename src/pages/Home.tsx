import * as React from "react";

import { Section } from "../components/Section";
import { getRetirementAge } from "../lib";

export const Home = () => {
  const [config, setConfig] = React.useState<string | undefined>();
  const [parsedConfig, setParsedConfig] = React.useState<any | undefined>();
  const [error, setError] = React.useState<string | undefined>();

  React.useEffect(() => {
    setError(undefined);
    setParsedConfig(undefined);
    if (!config) {
      return;
    }
    try {
      setParsedConfig(JSON.parse(config));
    } catch {
      setError("invalid json");
    }
  }, [config]);

  return (
    <div>
      <h1>Enter Config Below!</h1>
      <Section>
        <div>
          <textarea onChange={(event) => setConfig(event.target.value)} />
        </div>
        {error ? error : parsedConfig ? getRetirementAge(parsedConfig) : ""}
      </Section>
    </div>
  );
};
