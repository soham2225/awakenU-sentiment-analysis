import React, { useState, useMemo, useEffect } from 'react';
import Table, { Column } from '../components/ui/Table';
import { FeedbackItem, Sentiment, Urgency, Platform, PageProps } from '../types';
import { PLATFORM_ICONS } from '../constants';
import { fetchFeedback } from '../lib/api';

const SentimentBadge: React.FC<{ sentiment: Sentiment }> = ({ sentiment }) => {
  const colorClasses = {
    [Sentiment.Positive]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [Sentiment.Negative]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    [Sentiment.Neutral]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  };
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses[sentiment]}`}>
      {sentiment}
    </span>
  );
};

const UrgencyBadge: React.FC<{ urgency: Urgency }> = ({ urgency }) => {
  const colorClasses = {
    [Urgency.High]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    [Urgency.Medium]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    [Urgency.Low]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  };
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses[urgency]}`}>
      {urgency}
    </span>
  );
};

const FeedbackExplorer: React.FC<PageProps> = ({ setPageTitle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<Sentiment | 'all'>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<Urgency | 'all'>('all');
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<FeedbackItem | null>(null);
  const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageTitle('Feedback Explorer');
    fetchFeedback(500)
      .then(data => {
        setFeedbackData(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [setPageTitle]);

  const filteredData = useMemo(() => {
    return feedbackData.filter(item => {
      const searchMatch =
        item.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product?.toLowerCase().includes(searchTerm.toLowerCase());

      const sentimentMatch = sentimentFilter === 'all' || item.sentiment === sentimentFilter;
      const urgencyMatch = urgencyFilter === 'all' || item.urgency === urgencyFilter;
      const platformMatch = platformFilter === 'all' || item.platform === platformFilter;

      return searchMatch && sentimentMatch && urgencyMatch && platformMatch;
    });
  }, [searchTerm, sentimentFilter, urgencyFilter, platformFilter, feedbackData]);

  const columns: Column<FeedbackItem>[] = [
    { header: 'Date', accessor: 'date', render: item => new Date(item.date).toLocaleDateString() },
    {
      header: 'Platform',
      accessor: 'platform',
      render: item => (
        <div className="flex items-center space-x-2">
          {PLATFORM_ICONS[item.platform]}
          {item.platform}
        </div>
      ),
    },
    { header: 'Sender', accessor: 'sender' },
    { header: 'Product', accessor: 'product' },
    { header: 'Sentiment', accessor: 'sentiment', render: item => <SentimentBadge sentiment={item.sentiment} /> },
    { header: 'Urgency', accessor: 'urgency', render: item => <UrgencyBadge urgency={item.urgency} /> },
    { header: 'Actions', accessor: 'id', render: () => <button className="text-blue-600 dark:text-blue-400 hover:underline">Details</button> },
  ];

  const closePanel = () => setSelectedItem(null);

  if (loading) return <div className="p-4">Loading feedback...</div>;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
          />
          <select value={sentimentFilter} onChange={e => setSentimentFilter(e.target.value as any)} className="w-full px-3 py-2 border rounded-md">
            <option value="all">All Sentiments</option>
            {Object.values(Sentiment).map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select value={urgencyFilter} onChange={e => setUrgencyFilter(e.target.value as any)} className="w-full px-3 py-2 border rounded-md">
            <option value="all">All Urgencies</option>
            {Object.values(Urgency).map(u => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          <select value={platformFilter} onChange={e => setPlatformFilter(e.target.value as any)} className="w-full px-3 py-2 border rounded-md">
            <option value="all">All Platforms</option>
            {Object.values(Platform).map(p => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <Table columns={columns} data={filteredData} onRowClick={setSelectedItem} />

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-1/3 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          selectedItem ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedItem && (
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold">Feedback Details</h3>
              <button onClick={closePanel} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                &times;
              </button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Message</h4>
                <p className="mt-1">{selectedItem.message}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Sentiment</h4>
                  <p className="mt-1">
                    <SentimentBadge sentiment={selectedItem.sentiment} />
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Confidence</h4>
                  <p className="mt-1 font-mono">{(selectedItem.confidence * 100).toFixed(2)}%</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Sender</h4>
                  <p className="mt-1">{selectedItem.sender}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Product</h4>
                  <p className="mt-1">{selectedItem.product}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Tags</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedItem.tags?.map(tag => (
                    <span key={tag} className="px-2 py-1 text-xs rounded-md bg-gray-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t">
              <button onClick={closePanel} className="w-full px-4 py-2 rounded-md bg-blue-600 text-white">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      {selectedItem && <div onClick={closePanel} className="fixed inset-0 bg-black/30 z-[-1]"></div>}
    </div>
  );
};

export default FeedbackExplorer;
