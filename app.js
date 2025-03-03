const http = require('http');
const dotenv = require('dotenv');
const path = require('path');
const { filemakerRouter } = require('./routes/filemakerRoutes');

// Configure environmental variables
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });
const PORT = process.env.PORT || 80;

// Include log file 
const logEvents = require('./utils/logEvents');
const EventEmitter = require('events');

class Emitter extends EventEmitter {};
const myEmitter = new Emitter();
myEmitter.on('log', (message, logName) => { logEvents(message, logName) });

const server = http.createServer((req, res) => {
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt');

    //  Handle CORS Headers for all requests
    res.setHeader('Access-Control-Allow-Origin', '*,http://cwptraining.ntplstaging.com');  
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); 
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');  

    // Handle OPTIONS preflight request properly
    if (req.method === 'OPTIONS') {
        res.writeHead(204); 
        res.end();
        return;
    }

    // Pass request to actual routes
    filemakerRouter(req, res);
});

server.listen(PORT, (err) => {
    if (err) console.log(`Error while running server ${err}`);
    else console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV}`);
});
