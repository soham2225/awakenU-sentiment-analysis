import React from 'react';
import StatsCard from './StatsCard';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';
import BarChart from './charts/BarChart';
import { sentimentStats, sentimentTrendsData, sentimentDistributionData, platformComparisonData, highUrgencyComplaints } from '../data/mockData';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Monitor sentiment analysis across all platforms</p>
        </div>
        <div className="flex items-center space-x-3">
          <select className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sentimentStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Trends */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Sentiment Trends Over Time</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-400">Negative</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-400">Neutral</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-400">Positive</span>
              </div>
            </div>
          </div>
          <LineChart data={sentimentTrendsData} />
        </div>

        {/* Sentiment Distribution */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Sentiment Distribution</h3>
          <PieChart data={sentimentDistributionData} />
        </div>
      </div>

      {/* Platform Comparison and High Urgency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Comparison */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Platform Comparison</h3>
          <BarChart data={platformComparisonData} />
        </div>

        {/* High Urgency Complaints */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">High Urgency Complaints</h3>
            <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
              {highUrgencyComplaints.length} Active
            </span>
          </div>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {highUrgencyComplaints.map((complaint) => (
              <div key={complaint.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      complaint.severity === 'critical' ? 'bg-red-500' : 'bg-orange-500'
                    } animate-pulse`}></div>
                    <div>
                      <h4 className="font-medium text-white">{complaint.company}</h4>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">{complaint.message}</p>
                      <p className="text-xs text-gray-500 mt-2">{complaint.timestamp}</p>
                    </div>
                  </div>
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-white">New positive feedback received from Reddit</p>
              <p className="text-xs text-gray-400">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-white">High priority complaint flagged for NovaPay</p>
              <p className="text-xs text-gray-400">5 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-white">Weekly sentiment report generated</p>
              <p className="text-xs text-gray-400">1 hour ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;