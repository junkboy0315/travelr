const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const http = require('http');
const morgan = require('morgan');

const setupDummyData = require('./src/utils/setupDummyData');

// start server
const app = express();

// middlewares
app.use(morgan('combined')); // logs accesses
app.use(bodyParser.json({ type: '*/*' })); // parses any requests into json
app.use(cors());

// Routes
const router = require('./router');
router(app);

const port = 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on: ', port);
