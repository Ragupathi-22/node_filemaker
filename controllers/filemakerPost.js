const axios = require('axios');
const { getToken } = require('../utils/filemakerAuth');
const { validatePostData } = require('../utils/validateData');
const { messageFailed } = require('../utils/constants');

async function postFileMakerData(req, res) {
  try {
    const token = await getToken();

    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    console.log('token ' + token + '\n\n' + body);
    req.on('end', async () => {
      try {
        const parsedBody = JSON.parse(body);

        // Validate the incoming data
        const { isValid, errors } = validatePostData(parsedBody);
        if (!isValid) {
          res.statusCode = 400;
          res.end(JSON.stringify({
            title: 'Validation failed' + errors, "messages": messageFailed
          }));
          return;
        }

        // Axios request configuration
        const url = `https://${process.env.FILEMAKER_SERVER}/fmi/data/vLatest/databases/${process.env.DATABASE_NAME}/layouts/${process.env.LAYOUT_NAME}/records`;

        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };

        // Send POST request with axios
        const response = await axios.post(url, parsedBody, { headers });

        // Respond with the API response
        res.writeHead(response.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response.data));
      } catch (error) {
        console.error('Error in Axios request:', error.message);
        res.statusCode = error.response?.status || 500;
        res.end(
          JSON.stringify({
            "messages": messageFailed,
            title: error.response?.data || error.message,
          })
        );
      }
    });
  } catch (err) {
    console.error('Error in postFileMakerData:', err.message);
    res.statusCode = 500;
    res.end(JSON.stringify({
      title: err.message, "messages": messageFailed
    }));
  }
}

module.exports = { postFileMakerData };
