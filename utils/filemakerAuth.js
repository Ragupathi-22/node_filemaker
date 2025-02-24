const https = require('https');

async function getToken() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: process.env.FILEMAKER_SERVER,
      path: `/fmi/data/vLatest/databases/${process.env.DATABASE_NAME}/sessions`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${process.env.FILEMAKER_USERNAME}:${process.env.FILEMAKER_PASSWORD}`).toString('base64')}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 200) {
          const parsedData = JSON.parse(data);
          resolve(parsedData.response.token);
        } else {
          reject(`Failed to get token: ${res.statusCode} - ${res.statusMessage}`);
        }
      });
    });

    req.on('error', (err) => reject(`Error: ${err.message}`));
    req.end();
  });
}

module.exports = { getToken };
