const https = require('https');

const apiUrl = 'https://polkadot.api.subscan.io/api/scan/staking/validator/bond_stat'; // Replace with the API endpoint URL
const intervalInMinutes = 5;
const headers = {
    'Content-Type': 'application/json',
    'X-API-Key': '72eef0f30f3c401685bdb4dd40ff46a3' // YOUR API KEY
};
const requestData = {
    "stash": "1vTaLKEyj2Wn9xEkUGixBkVXJAd4pzDgXzz9CuVjhVqhHRQ" // LUGANODES STASH VALUE
};

function makeApiCall() {
    const options = {
        method: 'POST',
        headers: headers
    };

    const req = https.request(apiUrl, options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            const extractedData = JSON.parse(data).data.list.map(entry => {
                return {
                    era: entry.era,
                    total_bond: entry.total_bond
                };
            });
            console.log('REFINED:', extractedData);
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
            return dataTrace;
        });
    });

    req.on('error', (error) => {
        console.error('Error making the API request:', error);
    });

    req.write(JSON.stringify(requestData));
    req.end();
}


makeApiCall();

setInterval(makeApiCall, intervalInMinutes * 60 * 1000);
