import React, { createContext, useContext, useState, useEffect } from 'react';
import Fuse from 'fuse.js';

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

  // Load controls from localStorage on mount
  useEffect(() => {
    const savedControls = localStorage.getItem('nistControls');
    if (savedControls) {
      const parsedControls = JSON.parse(savedControls);
      setControls(parsedControls);
      setFilteredControls(parsedControls);
    }
  }, []);

  // Handle search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredControls(controls);
    } else if (fuse) {
      const results = fuse.search(searchTerm);
      setFilteredControls(results.map(result => result.item));
    }
  }, [searchTerm, controls, fuse]);

  const updateControls = (newControls) => {
    setControls(newControls);
    localStorage.setItem('nistControls', JSON.stringify(newControls));
  };

  const updateControl = (controlId, updatedControl) => {
    const updatedControls = controls.map(control =>
      control.controlId === controlId ? { ...control, ...updatedControl } : control
    );
    updateControls(updatedControls);
  };

  const deleteControl = (controlId) => {
    const updatedControls = controls.filter(control => control.controlId !== controlId);
    updateControls(updatedControls);
  };

  const value = {
    controls,
    filteredControls,
    searchTerm,
    setSearchTerm,
    updateControls,
    updateControl,
    deleteControl
  };

  return (
    <ControlsContext.Provider value={value}>
      {children}
    </ControlsContext.Provider>
  );
};