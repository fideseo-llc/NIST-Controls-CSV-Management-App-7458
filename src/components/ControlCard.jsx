import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiChevronDown, FiChevronUp, FiTag, FiShield } = FiIcons;

const ControlCard = ({ control }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getBadgeColor = (type) => {
    const colors = {
      'Technical': 'bg-blue-100 text-blue-800',
      'Operational': 'bg-green-100 text-green-800',
      'Management': 'bg-purple-100 text-purple-800',
      'LOW': 'bg-yellow-100 text-yellow-800',
      'MODERATE': 'bg-orange-100 text-orange-800',
      'HIGH': 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <SafeIcon icon={FiShield} className="text-primary-600 mr-3 text-xl" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {control.controlId}
              </h3>
              <p className="text-sm text-gray-600">{control.controlName}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {control.family && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(control.family)}`}>
                <SafeIcon icon={FiTag} className="mr-1 h-3 w-3" />
                {control.family}
              </span>
            )}
            {control.class && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(control.class)}`}>
                {control.class}
              </span>
            )}
            {control.priority && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(control.priority)}`}>
                {control.priority}
              </span>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-700 mb-4">
          {isExpanded ? (
            <div className="whitespace-pre-wrap">{control.controlText}</div>
          ) : (
            <div className="line-clamp-3">
              {control.controlText?.substring(0, 200)}
              {control.controlText?.length > 200 && '...'}
            </div>
          )}
        </div>

        {control.controlText && control.controlText.length > 200 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {isExpanded ? (
              <>
                <span>Show less</span>
                <SafeIcon icon={FiChevronUp} className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                <span>Show more</span>
                <SafeIcon icon={FiChevronDown} className="ml-1 h-4 w-4" />
              </>
            )}
          </button>
        )}

        {(control.supplementalGuidance || control.relatedControls) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {control.supplementalGuidance && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Supplemental Guidance</h4>
                  <p className="text-gray-600">{control.supplementalGuidance}</p>
                </div>
              )}
              {control.relatedControls && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Related Controls</h4>
                  <p className="text-gray-600">{control.relatedControls}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ControlCard;