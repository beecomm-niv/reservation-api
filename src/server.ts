import { Express } from 'express';
import { ErrorController } from './controllers/error-handler.controller';
import { appRouter } from './routes';

import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';

const run = (app: Express) => {
  app.use(compression());
  app.use(cors());
  app.use(bodyParser.json());

  app.use('/api', appRouter);

  app.use(ErrorController.handle);
};

export default run;
