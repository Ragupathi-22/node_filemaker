const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// configure environmental file
dotenv.config({ path: path.join(__dirname, '../config', 'config.env') });

const { getToken } = require('../utils/filemakerAuth');
const {recordNotFound,internalServerError,messageFailed}=require('../utils/constants');

const FILEMAKER_BASE_URL = `https://${process.env.FILEMAKER_SERVER}/fmi/data/vLatest/databases/${process.env.DATABASE_NAME}/layouts/${process.env.LAYOUT_NAME}`;

async function getFileMakerData(req, res) {
  try {
    const token = await getToken();

    const response = await axios.get(`${FILEMAKER_BASE_URL}/records`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    res.writeHead(response.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response.data));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
     "messages": messageFailed, title: err.message
    }));
  }
}

async function getFileMakerRecordById(req, res) {
  try {
    const token = await getToken();
    const { recordId } = req.params;

    if (!recordId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({"messages": messageFailed, title: 'Record ID is required' }));
    }

    const response = await axios.get(`${FILEMAKER_BASE_URL}/records/${recordId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });


    res.writeHead(response.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response.data));
  } catch (err) {
    if (err.response && err.response.status === 404) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(recordNotFound);
    }

    console.error('Error fetching record:', err.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(internalServerError);
  }
}


module.exports = { getFileMakerData, getFileMakerRecordById };
