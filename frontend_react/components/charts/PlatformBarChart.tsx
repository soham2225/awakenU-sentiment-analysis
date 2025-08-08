
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../hooks/useTheme';
import { SENTIMENT_COLORS } from '../../constants';

interface PlatformBarChartProps {
  data: any[];
}

const PlatformBarChart: React.FC<PlatformBarChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const tickColor = theme === 'dark' ? '#9ca3af' : '#4b5563';
  const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb';

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="name" stroke={tickColor} />
        <YAxis stroke={tickColor} />
        <Tooltip
          contentStyle={{
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
          }}
        />
        <Legend wrapperStyle={{ color: tickColor }} />
        <Bar dataKey="Positive" stackId="a" fill={SENTIMENT_COLORS.Positive} />
        <Bar dataKey="Neutral" stackId="a" fill={SENTIMENT_COLORS.Neutral} />
        <Bar dataKey="Negative" stackId="a" fill={SENTIMENT_COLORS.Negative} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PlatformBarChart;
