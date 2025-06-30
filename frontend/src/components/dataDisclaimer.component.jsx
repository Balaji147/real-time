import React from 'react';

export default function DisclaimerPopup({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Disclaimer</h2>
        <p className="mb-6">
          The data shown may be inaccurate or delayed. Please verify before making any decisions.
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Close
        </button>
      </div>
    </div>
  );
}
