import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useControls } from '../contexts/ControlsContext';

const { FiUpload, FiFile, FiCheck, FiX, FiAlertCircle } = FiIcons;

const CSVUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { updateControls } = useControls();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type !== 'text/csv') {
      setUploadStatus({
        type: 'error',
        message: 'Please upload a CSV file'
      });
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const controls = results.data
            .filter(row => row.controlId && row.controlId.trim())
            .map(row => ({
              controlId: row.controlId?.trim() || '',
              controlName: row.controlName?.trim() || '',
              family: row.family?.trim() || '',
              class: row.class?.trim() || '',
              controlText: row.controlText?.trim() || '',
              supplementalGuidance: row.supplementalGuidance?.trim() || '',
              relatedControls: row.relatedControls?.trim() || '',
              priority: row.priority?.trim() || ''
            }));

          setPreview(controls.slice(0, 5));
          setUploadStatus({
            type: 'success',
            message: `Successfully parsed ${controls.length} controls`
          });

          // Auto-upload after successful parsing
          setTimeout(() => {
            updateControls(controls);
            setUploadStatus({
              type: 'success',
              message: `Successfully uploaded ${controls.length} controls to the database`
            });
          }, 1000);

        } catch (error) {
          setUploadStatus({
            type: 'error',
            message: 'Error parsing CSV file: ' + error.message
          });
        } finally {
          setUploading(false);
        }
      },
      error: (error) => {
        setUploadStatus({
          type: 'error',
          message: 'Error reading CSV file: ' + error.message
        });
        setUploading(false);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Upload CSV File</h3>
        <p className="text-sm text-gray-600">
          Upload a CSV file containing NIST 800-53 Rev 5 controls. The file should have columns for:
          controlId, controlName, family, class, controlText, supplementalGuidance, relatedControls, priority
        </p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        <div className="space-y-4">
          <SafeIcon 
            icon={FiUpload} 
            className={`mx-auto h-12 w-12 ${
              dragActive ? 'text-primary-600' : 'text-gray-400'
            }`}
          />
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {dragActive ? 'Drop your CSV file here' : 'Upload CSV file'}
            </p>
            <p className="text-sm text-gray-600">
              Drag and drop or click to select a file
            </p>
          </div>
          
          {!uploading && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <SafeIcon icon={FiFile} className="mr-2 h-4 w-4" />
              Select File
            </button>
          )}
          
          {uploading && (
            <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
              Processing...
            </div>
          )}
        </div>
      </div>

      {uploadStatus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-md ${
            uploadStatus.type === 'success'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex items-center">
            <SafeIcon 
              icon={uploadStatus.type === 'success' ? FiCheck : FiX} 
              className={`h-5 w-5 mr-2 ${
                uploadStatus.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}
            />
            <span className={`text-sm font-medium ${
              uploadStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {uploadStatus.message}
            </span>
          </div>
        </motion.div>
      )}

      {preview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-lg p-4"
        >
          <h4 className="text-md font-medium text-gray-900 mb-3">Preview (First 5 controls)</h4>
          <div className="space-y-2">
            {preview.map((control, index) => (
              <div key={index} className="bg-white p-3 rounded border text-sm">
                <div className="font-medium text-gray-900">{control.controlId} - {control.controlName}</div>
                <div className="text-gray-600 text-xs mt-1">
                  Family: {control.family} | Class: {control.class} | Priority: {control.priority}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <SafeIcon icon={FiAlertCircle} className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">CSV Format Requirements:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Header row must include: controlId, controlName, family, class, controlText</li>
              <li>Optional columns: supplementalGuidance, relatedControls, priority</li>
              <li>controlId is required and must be unique</li>
              <li>File must be in CSV format with proper encoding</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVUpload;