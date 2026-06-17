import { createServer } from './server';

const server = createServer();
console.log(`server running on port ${server.port}`);
