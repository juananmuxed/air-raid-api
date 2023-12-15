import { configDotenv } from 'dotenv';

import { Server } from '@server/Api';

configDotenv();

const app = new Server();

app.listen();
