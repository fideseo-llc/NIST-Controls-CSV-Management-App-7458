import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useControls } from '../contexts/ControlsContext';

const { FiEdit3, FiSave, FiX, FiTrash2, FiSearch, FiPlus } = FiIcons;

const ControlEditor = () => {
  const { controls, updateControl, deleteControl } = useControls();
  const [editingControl, setEditingControl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredControls = controls.filter(control =>
    control.controlId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    control.controlName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (control) => {
    setEditingControl({ ...control });
  };

  const handleSave = () => {
    if (editingControl) {
      updateControl(editingControl.controlId, editingControl);
      setEditingControl(null);
    }
  };

  const handleCancel = () => {
    setEditingControl(null);
  };

  const handleDelete = (controlId) => {
    if (window.confirm('Are you sure you want to delete this control?')) {
      deleteControl(controlId);
    }
  };

  const handleInputChange = (field, value) => {
    setEditingControl(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Edit Controls</h3>
          <p className="text-sm text-gray-600">
            Modify existing controls or add new ones
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <SafeIcon icon={FiPlus} className="mr-2 h-4 w-4" />
          Add Control
        </button>
      </div>

      {showAddForm && (
        <AddControlForm 
          onSave={(control) => {
            updateControl(control.controlId, control);
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SafeIcon icon={FiSearch} className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search controls..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredControls.map((control) => (
                <tr key={control.controlId} className="hover:bg-gray-50">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(control)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <SafeIcon icon={FiEdit3} className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(control.controlId)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingControl && (
        <EditControlModal
          control={editingControl}
          onSave={handleSave}
          onCancel={handleCancel}
          onChange={handleInputChange}
        />
      )}
    </div>
  );
};

const AddControlForm = ({ onSave, onCancel }) => {
  const [control, setControl] = useState({
    controlId: '',
    controlName: '',
    family: '',
    class: '',
    controlText: '',
    supplementalGuidance: '',
    relatedControls: '',
    priority: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (control.controlId && control.controlName) {
      onSave(control);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg border border-gray-200"
    >
      <h4 className="text-md font-medium text-gray-900 mb-4">Add New Control</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Control ID *
            </label>
            <input
              type="text"
              required
              value={control.controlId}
              onChange={(e) => setControl(prev => ({ ...prev, controlId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Control Name *
            </label>
            <input
              type="text"
              required
              value={control.controlName}
              onChange={(e) => setControl(prev => ({ ...prev, controlName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Family
            </label>
            <input
              type="text"
              value={control.family}
              onChange={(e) => setControl(prev => ({ ...prev, family: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <input
              type="text"
              value={control.class}
              onChange={(e) => setControl(prev => ({ ...prev, class: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <input
              type="text"
              value={control.priority}
              onChange={(e) => setControl(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Control Text
          </label>
          <textarea
            rows={4}
            value={control.controlText}
            onChange={(e) => setControl(prev => ({ ...prev, controlText: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Add Control
          </button>
        </div>
      </form>
    </motion.div>
  );
};

const EditControlModal = ({ control, onSave, onCancel, onChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Edit Control: {control.controlId}
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Control ID
                </label>
                <input
                  type="text"
                  value={control.controlId}
                  onChange={(e) => onChange('controlId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Control Name
                </label>
                <input
                  type="text"
                  value={control.controlName}
                  onChange={(e) => onChange('controlName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Family
                </label>
                <input
                  type="text"
                  value={control.family}
                  onChange={(e) => onChange('family', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class
                </label>
                <input
                  type="text"
                  value={control.class}
                  onChange={(e) => onChange('class', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <input
                  type="text"
                  value={control.priority}
                  onChange={(e) => onChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Control Text
              </label>
              <textarea
                rows={6}
                value={control.controlText}
                onChange={(e) => onChange('controlText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplemental Guidance
              </label>
              <textarea
                rows={3}
                value={control.supplementalGuidance}
                onChange={(e) => onChange('supplementalGuidance', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Related Controls
              </label>
              <input
                type="text"
                value={control.relatedControls}
                onChange={(e) => onChange('relatedControls', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onCancel}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <SafeIcon icon={FiX} className="mr-2 h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={onSave}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <SafeIcon icon={FiSave} className="mr-2 h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ControlEditor;