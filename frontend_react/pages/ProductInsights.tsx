
import React, { useEffect } from 'react';
import Card from '../components/ui/Card';
import { PageProps } from '../types';

const ProductInsights: React.FC<PageProps> = ({ setPageTitle }) => {
   useEffect(() => {
    setPageTitle('Product Insights');
  }, [setPageTitle]);

  return (
    <div className="space-y-6">
      <Card title="Product Selection">
        <p className="text-gray-600 dark:text-gray-400">Select a product to see detailed insights.</p>
        <select className="mt-4 w-full md:w-1/3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          <option>QuantumLeap CRM</option>
          <option>StellarDocs</option>
          <option>FusionFlow</option>
          <option>NovaPay</option>
        </select>
      </Card>

      <Card title="Coming Soon">
        <div className="text-center py-12">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Deeper Product Insights</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            This section will contain detailed product-specific sentiment breakdowns, trendlines, and recent feedback.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ProductInsights;
