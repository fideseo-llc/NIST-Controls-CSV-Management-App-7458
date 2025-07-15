import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useControls } from '../contexts/ControlsContext';
import SearchBar from '../components/SearchBar';
import ControlCard from '../components/ControlCard';
import FilterPanel from '../components/FilterPanel';

const { FiFilter, FiX } = FiIcons;

const SearchPage = () => {
  const { filteredControls } = useControls();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    family: '',
    class: '',
    priority: ''
  });

  const applyFilters = (controls) => {
    return controls.filter(control => {
      if (filters.family && control.family !== filters.family) return false;
      if (filters.class && control.class !== filters.class) return false;
      if (filters.priority && control.priority !== filters.priority) return false;
      return true;
    });
  };

  const displayedControls = applyFilters(filteredControls);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Search NIST 800-53 Rev 5 Controls
        </h1>
        <p className="text-gray-600 mb-6">
          Search and explore security controls from the NIST 800-53 Rev 5 catalog
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SafeIcon icon={showFilters ? FiX : FiFilter} className="mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <FilterPanel filters={filters} setFilters={setFilters} />
          </motion.div>
        )}
      </motion.div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {displayedControls.length} control{displayedControls.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid gap-6">
        {displayedControls.length > 0 ? (
          displayedControls.map((control, index) => (
            <motion.div
              key={control.controlId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ControlCard control={control} />
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <SafeIcon icon={FiIcons.FiSearch} className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No controls found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters, or upload a CSV file in the admin panel.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;