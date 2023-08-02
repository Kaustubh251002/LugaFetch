import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import PolkaChart from './components/PolkaChart';
import KusamaChart from './components/KusamaChart';

function App() {
  const [activeTab, setActiveTab] = useState('component1'); // Default to the first component

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  return (
    <div className="container mx-auto p-6">
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'component1' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'
          }`}
          onClick={() => handleTabChange('component1')}
        >
          PolkaDot 
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'component2' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'
          }`}
          onClick={() => handleTabChange('component2')}
        >
          KusamaChart
        </button>
      </div>
      {activeTab === 'component1' && <PolkaChart />}
      {activeTab === 'component2' && <KusamaChart />}
    </div>
  );
}

export default App;
