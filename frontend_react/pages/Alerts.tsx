
import React, { useEffect } from 'react';
import Card from '../components/ui/Card';
import { PageProps } from '../types';

const Alerts: React.FC<PageProps> = ({ setPageTitle }) => {
   useEffect(() => {
    setPageTitle('Alerts & Notifications');
  }, [setPageTitle]);

  return (
    <div className="space-y-6">
      <Card title="Alert Filters">
        <div className="flex space-x-4">
          <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option>All Urgencies</option>
            <option>High</option>
            <option>Medium</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option>All Feedback Types</option>
            <option>Complaint</option>
            <option>Suggestion</option>
          </select>
        </div>
      </Card>

       <Card title="High-Priority Alerts">
        <div className="text-center py-12">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Alert Management System</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            A list of high-priority alerts will be displayed here, with options to mark them as resolved and configure notifications.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Alerts;
