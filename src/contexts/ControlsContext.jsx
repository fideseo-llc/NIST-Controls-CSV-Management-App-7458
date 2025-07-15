import React, { createContext, useContext, useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { fetchControls, createControl, updateControl as updateControlApi, deleteControl as deleteControlApi } from '../lib/api';

const ControlsContext = createContext();

export const useControls = () => {
  const context = useContext(ControlsContext);
  if (!context) {
    throw new Error('useControls must be used within a ControlsProvider');
  }
  return context;
};

export const ControlsProvider = ({ children }) => {
  const [controls, setControls] = useState([]);
  const [filteredControls, setFilteredControls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fuse, setFuse] = useState(null);

  // Initialize Fuse.js for fuzzy search
  useEffect(() => {
    if (controls.length > 0) {
      const fuseOptions = {
        keys: [
          { name: 'controlId', weight: 0.3 },
          { name: 'controlName', weight: 0.3 },
          { name: 'controlText', weight: 0.2 },
          { name: 'family', weight: 0.1 },
          { name: 'class', weight: 0.1 }
        ],
        threshold: 0.3,
        includeScore: true
      };
      setFuse(new Fuse(controls, fuseOptions));
    }
  }, [controls]);

  // Load controls from API
  useEffect(() => {
    loadControls();
  }, []);

  const loadControls = async () => {
    try {
      setLoading(true);
      const data = await fetchControls();
      setControls(data);
      setFilteredControls(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredControls(controls);
    } else if (fuse) {
      const results = fuse.search(searchTerm);
      setFilteredControls(results.map(result => result.item));
    }
  }, [searchTerm, controls, fuse]);

  const updateControls = async (newControls) => {
    try {
      await Promise.all(newControls.map(control => createControl(control)));
      await loadControls();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateControl = async (controlId, updatedControl) => {
    try {
      await updateControlApi(controlId, updatedControl);
      await loadControls();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteControl = async (controlId) => {
    try {
      await deleteControlApi(controlId);
      await loadControls();
    } catch (err) {
      setError(err.message);
    }
  };

  const value = {
    controls,
    filteredControls,
    searchTerm,
    setSearchTerm,
    updateControls,
    updateControl,
    deleteControl,
    loading,
    error
  };

  return (
    <ControlsContext.Provider value={value}>
      {children}
    </ControlsContext.Provider>
  );
};