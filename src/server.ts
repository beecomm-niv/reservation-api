import { Express } from 'express';
import { ErrorController } from './controllers/error-handler.controller';
import { appRouter } from './routes';

import bodyParser from 'body-parser';
import cors from 'cors';

const run = (app: Express) => {
  app.use(cors());
  app.use(bodyParser.json());

  app.use('/api', appRouter);

  app.use(ErrorController.handle);
};

export default run;
