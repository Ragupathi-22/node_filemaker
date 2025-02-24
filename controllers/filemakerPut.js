const axios = require('axios');
const { getToken } = require('../utils/filemakerAuth');
const { messageFailed, recordNotFound, messageSuccess } = require('../utils/constants');

const FILEMAKER_BASE_URL = `https://${process.env.FILEMAKER_SERVER}/fmi/data/vLatest/databases/${process.env.DATABASE_NAME}/layouts/${process.env.LAYOUT_NAME}`;

async function putFileMakerData(req, res) {
  try {
    const token = await getToken();
    const recordId = req.url.split('/').pop(); // Extract record ID from URL

    if (!recordId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Record ID is required' }));
    }

    let requestBody = '';
    req.on('data', (chunk) => {
      requestBody += chunk;
    });

    req.on('end', async () => {
      try {
        const updateData = JSON.parse(requestBody); // Parse request body
    
        const response = await axios.patch(
          `${FILEMAKER_BASE_URL}/records/${recordId}`,
          { fieldData: updateData }, // FileMaker expects fieldData
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
    
        res.writeHead(response.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ messages:messageSuccess,title: 'Record updated successfully' }));
      } catch (err) {
        console.error("Error updating FileMaker record:", err.response ? err.response.data : err.message); // Log full error
    
        if (err.response && err.response.status === 404) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(recordNotFound);
        }
    
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ messages :messageFailed, title: err.message }));
      }
    });
    
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ messages: messageFailed, title: err.message }));
  }
}

module.exports = {
  putFileMakerData,
};
