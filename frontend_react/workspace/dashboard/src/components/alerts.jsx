import { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, MessageSquare, MapPin, TrendingUp, Bell, Users } from 'lucide-react';
import AlertSummaryCards from '../components/AlertSummaryCards';
import AlertsTable from '../components/AlertsTable';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function AlertsPage() {
  const [activeTab, setActiveTab] = useState('all');

  // Mock data for additional components
  const alertAnalytics = {
    avgResponseTime: '2.4 hours',
    resolutionRate: '87%',
    escalationRate: '12%'
  };

  const teamMembers = [
    { name: 'John Doe', role: 'Senior Analyst', alerts: 8, avatar: 'JD' },
    { name: 'Jane Smith', role: 'Support Lead', alerts: 12, avatar: 'JS' },
    { name: 'Mike Johnson', role: 'Developer', alerts: 5, avatar: 'MJ' },
    { name: 'Sarah Wilson', role: 'QA Engineer', alerts: 7, avatar: 'SW' }
  ];

  const aiInsights = [
    'Spike in login-related complaints detected in the last 24 hours',
    'Payment processing issues trending upward on mobile platform',
    'Customer satisfaction improved by 15% after recent UI updates',
    'Response time SLA breach risk identified for high-priority tickets'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Alert Management
          </h1>
          <p className="text-slate-400">Monitor and manage customer sentiment alerts in real-time</p>
        </div>

        <AlertSummaryCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <AlertsTable activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          <div>
            {/* Alert Analytics */}
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <TrendingUp className="h-6 w-6 mr-3" />
                Analytics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Avg Response Time</span>
                  <span className="text-white font-semibold">{alertAnalytics.avgResponseTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Resolution Rate</span>
                  <span className="text-green-400 font-semibold">{alertAnalytics.resolutionRate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Escalation Rate</span>
                  <span className="text-orange-400 font-semibold">{alertAnalytics.escalationRate}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* India Heatmap */}
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <MapPin className="h-6 w-6 mr-3" />
              Regional Alert Distribution
            </h3>
            <div className="bg-white/5 rounded-lg p-4 h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <p className="text-slate-300">Interactive heatmap visualization</p>
                <p className="text-slate-400 text-sm">Showing alert distribution across India</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">Mumbai</span>
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">High</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Delhi</span>
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Medium</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Bangalore</span>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Low</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Chennai</span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Normal</Badge>
              </div>
            </div>
          </Card>

          {/* AI Insights */}
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <MessageSquare className="h-6 w-6 mr-3" />
              AI Insights
            </h3>
            <div className="space-y-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 animate-pulse"></div>
                  <p className="text-slate-300 text-sm">{insight}</p>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              View Detailed Analysis
            </Button>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notification Settings */}
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Bell className="h-6 w-6 mr-3" />
              Notification Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Critical Alerts</p>
                  <p className="text-slate-400 text-sm">Immediate notification for critical issues</p>
                </div>
                <div className="w-12 h-6 bg-green-500 rounded-full p-1">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Email Digest</p>
                  <p className="text-slate-400 text-sm">Daily summary of all alerts</p>
                </div>
                <div className="w-12 h-6 bg-green-500 rounded-full p-1">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">SMS Alerts</p>
                  <p className="text-slate-400 text-sm">Text messages for high priority alerts</p>
                </div>
                <div className="w-12 h-6 bg-slate-600 rounded-full p-1">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Team Overview */}
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Users className="h-6 w-6 mr-3" />
              Team Overview
            </h3>
            <div className="space-y-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {member.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{member.name}</p>
                    <p className="text-slate-400 text-sm">{member.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{member.alerts}</p>
                    <p className="text-slate-400 text-xs">Active alerts</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 !bg-transparent !hover:bg-transparent border-white/20 text-white hover:border-white/40">
              Manage Team
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AlertsPage;