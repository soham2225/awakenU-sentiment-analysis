// Enhanced mock data for Hybrid Sentiment Analysis System

// Sentiment metrics data
export const sentimentMetrics = {
  totalFeedback: 200,
  positive: 62,
  negative: 63,
  neutral: 75,
  highPriorityItems: 37
};

// Sentiment trends over time data
export const sentimentTrendsData = [
  { date: 'Aug 22', positive: 3, negative: 3, neutral: 2 },
  { date: 'Aug 23', positive: 2, negative: 3, neutral: 3 },
  { date: 'Aug 24', positive: 3, negative: 2, neutral: 6 },
  { date: 'Aug 25', positive: 3, negative: 2, neutral: 4 },
  { date: 'Aug 26', positive: 2, negative: 2, neutral: 1 },
  { date: 'Aug 27', positive: 1, negative: 2, neutral: 6 },
  { date: 'Aug 28', positive: 2, negative: 1, neutral: 1 }
];

// Sentiment distribution pie chart data
export const sentimentDistributionData = [
  { name: 'Positive', value: 62, color: '#10B981' },
  { name: 'Negative', value: 63, color: '#EF4444' },
  { name: 'Neutral', value: 75, color: '#F59E0B' }
];

// Platform comparison data
export const platformComparisonData = [
  { platform: 'Reddit', positive: 15, negative: 15, neutral: 15 },
  { platform: 'Email', positive: 8, negative: 8, neutral: 12 },
  { platform: 'YouTube', positive: 12, negative: 12, neutral: 10 },
  { platform: 'Twitter', positive: 10, negative: 10, neutral: 12 },
  { platform: 'Website', positive: 8, negative: 8, neutral: 15 }
];

// High urgency complaints
export const highUrgencyComplaints = [
  {
    id: 1,
    company: 'NovaPay',
    message: "I've been on hold for over an hour. This is the worst customer service I have ever experienced",
    timestamp: '2 hours ago',
    severity: 'critical'
  },
  {
    id: 2,
    company: 'FusionFlow',
    message: 'The latest update is full of bugs. My app crashes every time I try to open it. Please fix this!',
    timestamp: '3 hours ago',
    severity: 'high'
  },
  {
    id: 3,
    company: 'QuantumLeap CRM',
    message: "I've been on hold for over an hour. This is the worst customer service I have ever experienced",
    timestamp: '4 hours ago',
    severity: 'critical'
  },
  {
    id: 4,
    company: 'StellarDocs',
    message: 'The latest update is full of bugs. My app crashes every time I try to open it. Please fix this!',
    timestamp: '5 hours ago',
    severity: 'high'
  }
];

// Feedback explorer data
export const feedbackData = [
  {
    id: 1,
    date: '8/28/2025',
    platform: 'Reddit',
    sender: 'client_xyz@corp.com',
    product: 'NovaPay',
    sentiment: 'Neutral',
    urgency: 'Medium',
    message: 'The payment process could be more streamlined'
  },
  {
    id: 2,
    date: '8/28/2025',
    platform: 'Reddit',
    sender: 'test_user@domain.net',
    product: 'NovaPay',
    sentiment: 'Positive',
    urgency: 'Low',
    message: 'Great service, very satisfied with the experience'
  },
  {
    id: 3,
    date: '8/28/2025',
    platform: 'Email',
    sender: 'user123@example.com',
    product: 'NovaPay',
    sentiment: 'Neutral',
    urgency: 'Medium',
    message: 'Average experience, room for improvement'
  },
  {
    id: 4,
    date: '8/28/2025',
    platform: 'YouTube',
    sender: 'feedback@service.org',
    product: 'NovaPay',
    sentiment: 'Positive',
    urgency: 'Low',
    message: 'Excellent product features and support'
  },
  {
    id: 5,
    date: '8/28/2025',
    platform: 'Reddit',
    sender: 'user123@example.com',
    product: 'StellarDocs',
    sentiment: 'Negative',
    urgency: 'Medium',
    message: 'Encountered several bugs in the latest version'
  },
  {
    id: 6,
    date: '8/28/2025',
    platform: 'Reddit',
    sender: 'test_user@domain.net',
    product: 'StellarDocs',
    sentiment: 'Negative',
    urgency: 'Medium',
    message: 'Performance issues need to be addressed'
  },
  {
    id: 7,
    date: '8/28/2025',
    platform: 'Reddit',
    sender: 'client_xyz@corp.com',
    product: 'QuantumLeap CRM',
    sentiment: 'Positive',
    urgency: 'Low',
    message: 'Very helpful CRM system for our business'
  },
  {
    id: 8,
    date: '8/28/2025',
    platform: 'Website',
    sender: 'test_user@domain.net',
    product: 'NovaPay',
    sentiment: 'Positive',
    urgency: 'Low',
    message: 'Smooth payment processing experience'
  }
];

// Stats cards data for sentiment analysis
export const sentimentStats = [
  {
    title: 'Total Feedback',
    value: '200',
    subtitle: 'Across all platforms',
    change: '+12.5%',
    trend: 'up',
    icon: 'MessageSquare',
    bgColor: 'bg-blue-500'
  },
  {
    title: 'Positive Sentiment',
    value: '62',
    subtitle: '31% of total',
    change: '+5.2%',
    trend: 'up',
    icon: 'ThumbsUp',
    bgColor: 'bg-green-500'
  },
  {
    title: 'Negative Sentiment',
    value: '63',
    subtitle: '31.5% of total',
    change: '-2.1%',
    trend: 'down',
    icon: 'ThumbsDown',
    bgColor: 'bg-red-500'
  },
  {
    title: 'High Priority',
    value: '37',
    subtitle: 'Urgent items',
    change: '+8.3%',
    trend: 'up',
    icon: 'AlertTriangle',
    bgColor: 'bg-orange-500'
  }
];

export const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6'];