import { Section } from "../components/Section";
import { useRetirementCalculator } from "../hooks/useRetirementCalculator";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const Home = () => {
  const { setRawConfig, error, retirementAge, data } = useRetirementCalculator(
    {},
  );

  return (
    <div>
      <h1>Enter Config Below!</h1>
      <Section>
        <div>
          <textarea onChange={(event) => setRawConfig(event.target.value)} />
        </div>
        {error ?? retirementAge}
      </Section>
      <Section style={{ height: "500px" }}>
        <ResponsiveContainer>
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="age" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pv"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </Section>
    </div>
  );
};
