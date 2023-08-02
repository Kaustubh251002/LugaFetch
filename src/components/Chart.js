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

const Chart = () => {
  const [dataTrace, setDataTrace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const makeApiCall = async () => {
    try {
      const response = await axios.post(apiUrl, requestData, {headers});
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
        marker: { size: 6 },
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
      <h1>Era vs Total Bond Plot</h1>
      <Plot
        data={[dataTrace]}
        layout={ {width: 320, height: 240, title: 'A Fancy Plot', xaxis: { title: 'Era' }, yaxis: { title: 'Total Bond' },} }
      />
    </div>
  );
};

export default Chart;
