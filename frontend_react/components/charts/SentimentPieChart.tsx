
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../hooks/useTheme';
import { SENTIMENT_COLORS } from '../../constants';
import { Sentiment } from '../../types';

interface SentimentPieChartProps {
  data: { name: Sentiment; value: number }[];
}

const SentimentPieChart: React.FC<SentimentPieChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const tickColor = theme === 'dark' ? '#9ca3af' : '#4b5563';

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={SENTIMENT_COLORS[entry.name]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
          }}
        />
        <Legend iconSize={10} wrapperStyle={{ color: tickColor }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SentimentPieChart;
