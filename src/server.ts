import './database-init';

import { Express } from 'express';
import { ErrorController } from './controllers/error-handler.controller';
import { appRouter } from './routes';

import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';

const run = (app: Express) => {
  app.use(compression());
  app.use(cors());
  app.use(bodyParser.json());

  // TODO: check that its not print logs on production !
  if (process.env.NODE_ENV === 'DEV') {
    app.use(morgan('dev'));
  }

  app.use('/api', appRouter);

  app.use(ErrorController.handle);
};

export default run;
