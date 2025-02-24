const axios = require('axios');
const { getToken } = require('../utils/filemakerAuth');
const { messageFailed, messageSuccess ,recordNotFound} = require('../utils/constants');
const dotenv = require('dotenv');
const path = require('path');
const { title } = require('process');

// configure environmental file
dotenv.config({ path: path.join(__dirname, '../config', 'config.env') });

const FILEMAKER_BASE_URL = `https://${process.env.FILEMAKER_SERVER}/fmi/data/vLatest/databases/${process.env.DATABASE_NAME}/layouts/${process.env.LAYOUT_NAME}`;

async function deleteFileMakerData(req, res) {
  try {
    const token = await getToken();
    const recordId = req.url.split('/').pop(); // Extracting record ID from URL

    if (!recordId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ title: 'Record ID is required',messages:messageFailed }));
    }
    const response = await axios.delete(`${FILEMAKER_BASE_URL}/records/${recordId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.writeHead(response.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({title:'Record deleted successfully',messages:messageSuccess }));
  } catch (err) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(recordNotFound);
  }
}

module.exports = {
  deleteFileMakerData,
};
