import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useControls } from '../contexts/ControlsContext';

const { FiSearch } = FiIcons;

const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useControls();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SafeIcon icon={FiSearch} className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search controls by ID, name, or content..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
      />
    </motion.div>
  );
};

export default SearchBar;