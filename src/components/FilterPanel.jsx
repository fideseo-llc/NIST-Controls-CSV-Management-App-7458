import React from 'react';
import { motion } from 'framer-motion';
import { useControls } from '../contexts/ControlsContext';

const FilterPanel = ({ filters, setFilters }) => {
  const { controls } = useControls();

  const families = [...new Set(controls.map(c => c.family))].filter(Boolean).sort();
  const classes = [...new Set(controls.map(c => c.class))].filter(Boolean).sort();
  const priorities = [...new Set(controls.map(c => c.priority))].filter(Boolean).sort();

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      family: '',
      class: '',
      priority: ''
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-4 rounded-lg border border-gray-200"
    >
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Family
          </label>
          <select
            value={filters.family}
            onChange={(e) => handleFilterChange('family', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="">All Families</option>
            {families.map(family => (
              <option key={family} value={family}>{family}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class
          </label>
          <select
            value={filters.class}
            onChange={(e) => handleFilterChange('class', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="">All Classes</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="">All Priorities</option>
            {priorities.map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </div>

        <button
          onClick={clearFilters}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </motion.div>
  );
};

export default FilterPanel;