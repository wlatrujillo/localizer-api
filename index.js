const http = require('http');
const express = require('express');
const app = express();

require('./startup/routes')(app);

const server = http.createServer(app);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
