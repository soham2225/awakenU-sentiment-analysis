import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, MessageSquare, Download, Activity } from 'lucide-react';
import StatsCard from './StatsCard';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';
import BarChart from './charts/BarChart';
import { useSummaryData, useAlertsData } from '../hooks/useApiData';

const Dashboard = () => {
  const { data: summaryData, loading: summaryLoading, error: summaryError } = useSummaryData();
  const { data: alertsData, loading: alertsLoading } = useAlertsData('high');

  // Loading state
  if (summaryLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-white">Loading dashboard data...</span>
      </div>
    );
  }

  // Error state
  if (summaryError) {
    return (
      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-300">
        <h3 className="font-semibold mb-2">Error Loading Dashboard</h3>
        <p>{summaryError}</p>
        <p className="text-sm mt-2">Please ensure your backend API is running on http://localhost:8000</p>
      </div>
    );
  }

  // Default values if no data
  const summary = summaryData || {
    total_feedback: 0,
    sentiment_counts: { positive: 0, negative: 0, neutral: 0 },
    urgency_counts: {},
    platform_comparison: [],
    trends: []
  };

  const highUrgencyCount = Object.entries(summary.urgency_counts)
    .filter(([key]) => key.toLowerCase().includes('high'))
    .reduce((sum, [, count]) => sum + count, 0);

  const stats = [
    {
      title: 'Total Feedback',
      value: summary.total_feedback.toLocaleString(),
      icon: MessageSquare,
      color: 'blue',
      trend: '+12%'
    },
    {
      title: 'Positive Sentiment',
      value: summary.sentiment_counts.positive.toLocaleString(),
      icon: TrendingUp,
      color: 'green',
      trend: '+8%'
    },
    {
      title: 'Negative Sentiment',
      value: summary.sentiment_counts.negative.toLocaleString(),
      icon: AlertTriangle,
      color: 'red',
      trend: '-3%'
    },
    {
      title: 'High Priority',
      value: highUrgencyCount.toLocaleString(),
      icon: BarChart3,
      color: 'orange',
      trend: '+15%'
    }
  ];

  // Prepare chart data
  const sentimentData = [
    { name: 'Positive', value: summary.sentiment_counts.positive, color: '#10B981' },
    { name: 'Negative', value: summary.sentiment_counts.negative, color: '#EF4444' },
    { name: 'Neutral', value: summary.sentiment_counts.neutral, color: '#F59E0B' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-300 mt-1">Real-time sentiment analysis overview</p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Download className="h-4 w-4" />
          <span>Export Data</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Trends */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">Sentiment Trends Over Time</h3>
          <LineChart data={summary.trends} />
        </div>

        {/* Sentiment Distribution */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">Sentiment Distribution</h3>
          <PieChart data={sentimentData} />
        </div>
      </div>

      {/* Platform Comparison and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Comparison */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">Platform Comparison</h3>
          <BarChart data={summary.platform_comparison} />
        </div>

        {/* High Urgency Complaints */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">High Urgency Complaints</h3>
          <div className="space-y-3">
            {alertsLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-gray-300">Loading alerts...</span>
              </div>
            ) : (
              alertsData?.slice(0, 5).map((alert, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 animate-pulse"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">
                      {alert.platform || 'Unknown Platform'} - {alert.feedback_type || 'General'}
                    </p>
                    <p className="text-gray-300 text-xs mt-1">
                      {alert.details ? alert.details.substring(0, 100) + '...' : 'No details available'}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">
                        {alert.urgency || 'High'}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {alert.date || 'Recent'}
                      </span>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-gray-400 text-sm text-center py-4">
                  No high urgency alerts found
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-300">Data analysis completed for {summary.total_feedback} feedback items</span>
            <span className="text-gray-400 ml-auto">Just now</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-300">Dashboard refreshed with latest data</span>
            <span className="text-gray-400 ml-auto">2 min ago</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-300">{highUrgencyCount} high priority alerts detected</span>
            <span className="text-gray-400 ml-auto">5 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;