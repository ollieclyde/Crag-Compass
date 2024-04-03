import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Crag } from "../../types/types";

interface PieChartComponentProps {
  crag: Crag;
}
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.35;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.12) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const PieChartComponent: React.FC<PieChartComponentProps> = ({
  crag,
}) => {
  const cragStats = crag.cragStats;
  const COLOURS = ["#339966", "#FFCC00", "#CC3333", "#333333", "#FFF5EE"];

  const cragDifficulty: { name: string; value: number }[] = [
    { name: "beginner", value: cragStats?.beginner ? cragStats?.beginner : 0 },
    { name: "advanced", value: cragStats?.advanced ? cragStats?.advanced : 0 },
    {
      name: "experienced",
      value: cragStats?.experienced ? cragStats?.experienced : 0,
    },
    { name: "expert", value: cragStats?.expert ? cragStats?.expert : 0 },
    { name: "elite", value: cragStats?.elite ? cragStats?.elite : 0 },
  ].filter((item) => item.value > 0);

  if (cragDifficulty.length > 0) {
    return (
      <>
        <ResponsiveContainer width="100%" height="86%">
          <PieChart>
            <Pie
              data={cragDifficulty}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={70}
              fill="#8884d8"
              dataKey="value"
            >
              {cragDifficulty.map((entry, index) => (
                <Cell
                  key={`${entry.name}`}
                  fill={COLOURS[index % COLOURS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <Box
          display="flex"
          height="5%"
          justifyContent="center"
          textAlign="left"
          className="pie-chart-key"
          paddingTop="3px"
        >
          <Text fontSize="sm">
            Routes: {crag.routeCount}
          </Text>
        </Box>
      </>
    );
  } else {
    return null;
  }
};

export default PieChartComponent;
