import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Eye, ChevronLeft, ChevronRight, X, Calendar, MessageSquare, AlertTriangle, Globe, User } from 'lucide-react';
import { useFeedbackData } from '../hooks/useApiData';

const FeedbackExplorer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: feedbackData, loading, error } = useFeedbackData(500); // Fetch more data for filtering

  // Helper function to get username/sender name
  const getUserName = (item) => {
    return item.username || item.sender || item.author || item.user || item.name || item.user_name || item.sender_name || 'Anonymous';
  };

  // Filter and search logic
  const filteredData = useMemo(() => {
    if (!feedbackData) return [];

    return feedbackData.filter(item => {
      const userName = getUserName(item);
      const matchesSearch = !searchTerm || 
        (item.message && item.message.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.cleaned_body && item.cleaned_body.toLowerCase().includes(searchTerm.toLowerCase())) ||
        userName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSentiment = sentimentFilter === 'all' || 
        (item.sentiment && item.sentiment.toLowerCase() === sentimentFilter.toLowerCase());
      
      const matchesUrgency = urgencyFilter === 'all' || 
        (item.urgency && item.urgency.toLowerCase() === urgencyFilter.toLowerCase());
      
      const matchesPlatform = platformFilter === 'all' || 
        (item.platform && item.platform.toLowerCase() === platformFilter.toLowerCase());

      return matchesSearch && matchesSentiment && matchesUrgency && matchesPlatform;
    });
  }, [feedbackData, searchTerm, sentimentFilter, urgencyFilter, platformFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Get unique values for filters
  const uniqueValues = useMemo(() => {
    if (!feedbackData) return { sentiments: [], urgencies: [], platforms: [] };

    return {
      sentiments: [...new Set(feedbackData.map(item => item.sentiment).filter(Boolean))],
      urgencies: [...new Set(feedbackData.map(item => item.urgency).filter(Boolean))],
      platforms: [...new Set(feedbackData.map(item => item.platform).filter(Boolean))]
    };
  }, [feedbackData]);

  const getSentimentBadge = (sentiment) => {
    const colors = {
      positive: 'bg-green-500/20 text-green-400 border-green-500/30',
      negative: 'bg-red-500/20 text-red-400 border-red-500/30',
      neutral: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
    return colors[sentiment?.toLowerCase()] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getUrgencyBadge = (urgency) => {
    const colors = {
      high: 'bg-red-500/20 text-red-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      low: 'bg-green-500/20 text-green-400'
    };
    return colors[urgency?.toLowerCase()] || 'bg-gray-500/20 text-gray-400';
  };

  const openDetailsModal = (feedback) => {
    setSelectedFeedback(feedback);
    setIsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setSelectedFeedback(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-white">Loading feedback data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-300">
        <h3 className="font-semibold mb-2">Error Loading Feedback</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Feedback Explorer</h1>
          <p className="text-gray-300 mt-1">Analyze and filter customer feedback</p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Download className="h-4 w-4" />
          <span>Export Results</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search feedback, username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Sentiment Filter */}
          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Sentiments</option>
            {uniqueValues.sentiments.map(sentiment => (
              <option key={sentiment} value={sentiment} className="bg-gray-800">
                {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
              </option>
            ))}
          </select>

          {/* Urgency Filter */}
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Urgencies</option>
            {uniqueValues.urgencies.map(urgency => (
              <option key={urgency} value={urgency} className="bg-gray-800">
                {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
              </option>
            ))}
          </select>

          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Platforms</option>
            {uniqueValues.platforms.map(platform => (
              <option key={platform} value={platform} className="bg-gray-800">
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
          <span>Showing {filteredData.length} of {feedbackData?.length || 0} results</span>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Active filters: {[sentimentFilter, urgencyFilter, platformFilter].filter(f => f !== 'all').length}</span>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Sentiment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Urgency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {paginatedData.map((item, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-white">
                          {getUserName(item)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white max-w-xs">
                      <p className="truncate">
                        {item.message || item.cleaned_body || 'No message available'}
                      </p>
                      {item.feedback_type && (
                        <p className="text-xs text-gray-400 mt-1">
                          Type: {item.feedback_type}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getSentimentBadge(item.sentiment)}`}>
                      {item.sentiment || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getUrgencyBadge(item.urgency)}`}>
                      {item.urgency || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {item.platform || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {item.date || 'Unknown'}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => openDetailsModal(item)}
                      className="text-blue-400 hover:text-blue-300 transition-colors p-1 hover:bg-blue-500/20 rounded"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white/5 px-6 py-3 border-t border-white/20">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-300">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 text-sm rounded ${
                          currentPage === page
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {isModalOpen && selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-white/20 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Feedback from {getUserName(selectedFeedback)}
                  </h3>
                  <p className="text-sm text-gray-300">Detailed feedback information</p>
                </div>
              </div>
              <button
                onClick={closeDetailsModal}
                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* User Information */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  User Information
                </h4>
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium text-white">
                      {getUserName(selectedFeedback)}
                    </p>
                    <p className="text-sm text-gray-400">
                      Feedback Provider
                    </p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </h4>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white leading-relaxed">
                    {selectedFeedback.message || selectedFeedback.cleaned_body || 'No message available'}
                  </p>
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sentiment */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Sentiment</h4>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getSentimentBadge(selectedFeedback.sentiment)}`}>
                    {selectedFeedback.sentiment || 'Unknown'}
                  </span>
                </div>

                {/* Urgency */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Urgency
                  </h4>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getUrgencyBadge(selectedFeedback.urgency)}`}>
                    {selectedFeedback.urgency || 'Unknown'}
                  </span>
                </div>

                {/* Platform */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    Platform
                  </h4>
                  <p className="text-white bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                    {selectedFeedback.platform || 'Unknown'}
                  </p>
                </div>

                {/* Date */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Date
                  </h4>
                  <p className="text-white bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                    {selectedFeedback.date || 'Unknown'}
                  </p>
                </div>
              </div>

              {/* Additional Fields */}
              {selectedFeedback.feedback_type && (
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Feedback Type</h4>
                  <p className="text-white bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                    {selectedFeedback.feedback_type}
                  </p>
                </div>
              )}

              {selectedFeedback.action_recommended && (
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Recommended Action</h4>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-blue-300">
                      {selectedFeedback.action_recommended}
                    </p>
                  </div>
                </div>
              )}

              {/* Raw Data (for debugging) */}
              {Object.keys(selectedFeedback).length > 6 && (
                <details className="mt-4">
                  <summary className="text-sm font-medium text-gray-300 cursor-pointer hover:text-white">
                    View Raw Data
                  </summary>
                  <div className="mt-2 bg-gray-900/50 rounded-lg p-4 border border-white/10">
                    <pre className="text-xs text-gray-400 overflow-x-auto">
                      {JSON.stringify(selectedFeedback, null, 2)}
                    </pre>
                  </div>
                </details>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end p-6 border-t border-white/20 space-x-3">
              <button
                onClick={closeDetailsModal}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Close
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                Take Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackExplorer;