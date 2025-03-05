import 'express-async-errors';

import run from './server';
import express from 'express';
import dotnev from 'dotenv';

dotnev.config();

export const app = express();

run(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('listen to port ' + PORT);
});
