import React, { useEffect, useState } from 'react';
import { Bell, AlertTriangle, MessageSquare, TrendingUp, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeUrgency, setActiveUrgency] = useState('all');

  // 🔹 Fetch alerts from backend API
  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch('http://localhost:8000/api/alerts');
        const data = await res.json();
        setAlerts(data);
        setFilteredAlerts(data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAlerts();
  }, []);

  // 🔹 Filter alerts by urgency
  const handleFilter = (urgency) => {
    setActiveUrgency(urgency);
    if (urgency === 'all') {
      setFilteredAlerts(alerts);
    } else {
      setFilteredAlerts(
        alerts.filter(
          (alert) => alert.urgency && alert.urgency.toLowerCase().includes(urgency)
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-10 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Alerts Dashboard
            </h1>
            <p className="text-slate-400 mt-2">
              View and monitor real-time sentiment-based alerts from analyzed feedback.
            </p>
          </div>
          <div className="flex space-x-3">
            {['all', 'high', 'medium', 'low'].map((urg) => (
              <button
                key={urg}
                onClick={() => handleFilter(urg)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  activeUrgency === urg
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-pink-500/30'
                    : 'bg-white/10 hover:bg-white/20 text-gray-300'
                }`}
              >
                {urg === 'all' ? 'All Alerts' : `${urg.charAt(0).toUpperCase() + urg.slice(1)} Urgency`}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-purple-400 animate-spin" />
            <p className="ml-3 text-slate-300 text-lg">Loading alerts...</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Alerts</p>
                    <h3 className="text-3xl font-bold mt-2 text-white">{alerts.length}</h3>
                  </div>
                  <Bell className="h-8 w-8 text-purple-400" />
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">High Urgency</p>
                    <h3 className="text-3xl font-bold mt-2 text-white">
                      {alerts.filter((a) => a.urgency?.includes('high')).length}
                    </h3>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Unique Feedback Types</p>
                    <h3 className="text-3xl font-bold mt-2 text-white">
                      {new Set(alerts.map((a) => a.feedback_type)).size}
                    </h3>
                  </div>
                  <MessageSquare className="h-8 w-8 text-pink-400" />
                </div>
              </Card>
            </div>

            {/* Alerts Table */}
            <div className="mt-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-purple-400" /> Recent Alerts
              </h2>

              {filteredAlerts.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No alerts found for this category.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="text-slate-300 text-sm border-b border-white/10">
                        <th className="pb-3">Platform</th>
                        <th className="pb-3">Feedback Type</th>
                        <th className="pb-3">Urgency</th>
                        <th className="pb-3">Details</th>
                        <th className="pb-3">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAlerts.slice(0, 20).map((alert, index) => (
                        <tr
                          key={index}
                          className="hover:bg-white/5 transition-colors text-sm border-b border-white/5"
                        >
                          <td className="py-3 text-white">{alert.platform || 'N/A'}</td>
                          <td className="py-3 text-slate-300 capitalize">{alert.feedback_type || '—'}</td>
                          <td className="py-3">
                            <Badge
                              className={`${
                                alert.urgency?.includes('high')
                                  ? 'bg-red-500/20 text-red-400'
                                  : alert.urgency?.includes('medium')
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-green-500/20 text-green-400'
                              } px-2 py-1 rounded-lg text-xs`}
                            >
                              {alert.urgency || 'Low'}
                            </Badge>
                          </td>
                          <td className="py-3 text-slate-300 max-w-md truncate">
                            {alert.details?.substring(0, 100) || 'No details'}
                          </td>
                          <td className="py-3 text-slate-400 text-xs">
                            {alert.date || 'Recent'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
