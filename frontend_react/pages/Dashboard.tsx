import React, { useMemo, useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import SentimentPieChart from '../components/charts/SentimentPieChart';
import TrendsLineChart from '../components/charts/TrendsLineChart';
import PlatformBarChart from '../components/charts/PlatformBarChart';
import { Sentiment, Urgency, FeedbackType, PageProps } from '../types';
import { BellIcon } from '../constants';
import { fetchSummary, fetchFeedback } from '../lib/api';

const Dashboard: React.FC<PageProps> = ({ setPageTitle }) => {
  const [summary, setSummary] = useState<any>(null);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageTitle('Dashboard');

    Promise.all([fetchSummary(), fetchFeedback(200)])
      .then(([summaryData, feedbackData]) => {
        setSummary(summaryData);
        setFeedback(feedbackData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [setPageTitle]);

  if (loading) return <div>Loading...</div>;
  if (!summary) return <div>Failed to load data.</div>;

  const stats = {
    total: summary.total_feedback,
    positive: summary.sentiment_counts?.positive || 0,
    negative: summary.sentiment_counts?.negative || 0,
    neutral: summary.sentiment_counts?.neutral || 0,
    urgent: summary.urgency_counts?.high || 0,
    complaints: summary.feedback_type_counts?.complaint || 0,
    suggestions: summary.feedback_type_counts?.suggestion || 0,
    praises: summary.feedback_type_counts?.praise || 0,
  };

  const sentimentPieData = [
    { name: Sentiment.Positive, value: stats.positive },
    { name: Sentiment.Negative, value: stats.negative },
    { name: Sentiment.Neutral, value: stats.neutral },
  ];

  const trendsData = summary.trends || [];
  const platformData = summary.platform_comparison || [];
  const topUrgentComplaints = feedback
    .filter(item => item.urgency === Urgency.High && item.feedbackType === FeedbackType.Complaint)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Feedback">
          <p className="text-4xl font-bold">{stats.total}</p>
        </Card>
        <Card title="Sentiment Breakdown">
          <div>
            <p>Positive: {stats.positive}</p>
            <p>Negative: {stats.negative}</p>
            <p>Neutral: {stats.neutral}</p>
          </div>
        </Card>
        <Card title="Urgent Issues">
          <p className="text-4xl font-bold text-red-500">{stats.urgent}</p>
        </Card>
        <Card title="Feedback Types">
          <p>Complaints: {stats.complaints}</p>
          <p>Suggestions: {stats.suggestions}</p>
          <p>Praises: {stats.praises}</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Card title="Sentiment Trends Over Time">
            <TrendsLineChart data={trendsData} />
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card title="Sentiment Distribution">
            <SentimentPieChart data={sentimentPieData} />
          </Card>
        </div>
      </div>

      {/* Platform + Urgent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Platform Comparison">
          <PlatformBarChart data={platformData} />
        </Card>
        <Card title="High Urgency Complaints">
          <div>
            {topUrgentComplaints.map(item => (
              <div key={item.id} className="flex items-start space-x-3">
                <BellIcon className="h-5 w-5 text-red-500" />
                <div>
                  <p>{item.product}</p>
                  <p>{item.message}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
