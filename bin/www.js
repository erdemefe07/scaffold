const load = require('@config');
const connect = require('@db');

const app = require('@app');
const http = require('http');
const server = http.createServer(app);
server.on('listening', onListening);

function onListening() {
  console.log('listening on', process.env.PORT);
}

async function main() {
  await load();
  await connect();
  server.listen(process.env.PORT);
}
main();
