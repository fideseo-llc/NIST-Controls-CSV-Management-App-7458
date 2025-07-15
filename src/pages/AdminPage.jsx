import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';
import { useControls } from '../contexts/ControlsContext';
import CSVUpload from '../components/CSVUpload';
import ControlEditor from '../components/ControlEditor';

const { FiUpload, FiEdit3, FiDatabase } = FiIcons;

const AdminPage = () => {
  const { isAuthenticated } = useAuth();
  const { controls } = useControls();
  const [activeTab, setActiveTab] = useState('upload');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const tabs = [
    { id: 'upload', label: 'CSV Upload', icon: FiUpload },
    { id: 'edit', label: 'Edit Controls', icon: FiEdit3 },
    { id: 'stats', label: 'Statistics', icon: FiDatabase }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upload':
        return <CSVUpload />;
      case 'edit':
        return <ControlEditor />;
      case 'stats':
        return <StatsPanel />;
      default:
        return <CSVUpload />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Administration Panel
        </h1>
        <p className="text-gray-600">
          Manage NIST 800-53 Rev 5 controls and upload CSV files
        </p>
      </motion.div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <SafeIcon icon={tab.icon} className="mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

const StatsPanel = () => {
  const { controls } = useControls();

  const stats = {
    totalControls: controls.length,
    families: [...new Set(controls.map(c => c.family))].length,
    classes: [...new Set(controls.map(c => c.class))].length,
    priorities: [...new Set(controls.map(c => c.priority))].length
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Database Statistics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-primary-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-primary-600">{stats.totalControls}</div>
          <div className="text-sm text-gray-600">Total Controls</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.families}</div>
          <div className="text-sm text-gray-600">Control Families</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.classes}</div>
          <div className="text-sm text-gray-600">Control Classes</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{stats.priorities}</div>
          <div className="text-sm text-gray-600">Priority Levels</div>
        </div>
      </div>

      {controls.length > 0 && (
        <div className="mt-8">
          <h4 className="text-md font-medium text-gray-900 mb-4">Sample Controls</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Control ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Family
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {controls.slice(0, 5).map((control) => (
                  <tr key={control.controlId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {control.controlId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {control.controlName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {control.family}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {control.class}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;