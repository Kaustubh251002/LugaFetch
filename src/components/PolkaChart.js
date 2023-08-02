import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

const apiUrl = 'https://polkadot.api.subscan.io/api/scan/staking/validator/bond_stat'; // Replace with the API endpoint URL

const headers = {
  'Content-Type': 'application/json',
  'X-API-Key': '72eef0f30f3c401685bdb4dd40ff46a3' // YOUR API KEY
};
const requestData = {
  "stash": "1vTaLKEyj2Wn9xEkUGixBkVXJAd4pzDgXzz9CuVjhVqhHRQ" // LUGANODES STASH VALUE
};




const PolkaChart = () => {
  const [dataTrace, setDataTrace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [csvData, setCSVData] = useState(null);

  const handleDownload = () => {
    const csvContent = "era,total_bond\n" + dataTrace.x.join(",") + "\n" + dataTrace.y.join(",");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'polkadot-data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const makeApiCall = async () => {
    try {
      const response = await axios.post(apiUrl, requestData, { headers });
      const data = response.data.data.list;

      // Process data and create the dataTrace object here
      const extractedData = data.map(entry => ({
        era: entry.era,
        total_bond: parseInt(entry.total_bond)
      }));
      const eras = extractedData.map(entry => entry.era);
      const totalBonds = extractedData.map(entry => entry.total_bond);

      const dataTrace = {
        x: eras,
        y: totalBonds,
        type: 'scatter',
        mode: 'lines+markers',
        marker: {
          color: 'rgb(52, 152, 219)', // Set a custom color for markers
          size: 12, // Adjust marker size
          line: {
            color: 'white', // Set the border color of markers
            width: 2, // Adjust marker border width
          },
        },
        line: { shape: 'linear' },
      };

      setDataTrace(dataTrace);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    makeApiCall();
  }, []); // Run the API call once when the component mounts

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Plot
        data={[dataTrace]}
        layout={{
        width: 1000, height: 645, title: 'POLKADOT', xaxis: { title: 'Era', titlefont: { family: 'Roboto', size: 16 }, }, yaxis: { title: 'Total Bond', titlefont: { family: 'Roboto', size: 16 }, }, hovermode: 'closest',
          hoverlabel: { font: { family: 'Roboto', size: 14} }, // Customize hover label font
          legend: {
            x: 0.8, // Adjust the legend's x position
            y: 1.0, // Adjust the legend's y position
            font: { family: 'Roboto', size: 12 }, // Customize legend font
          },
        }}
      />
      <button onClick={handleDownload} className='px-4 py-2 rounded bg-blue-600 text-white'>Download CSV</button>
      {csvData && (
        <a href={csvData} download="polkadot-data.csv" style={{ display: 'none' }}>
          Download
        </a>
      )}
    </div>
  );
};

export default PolkaChart;
