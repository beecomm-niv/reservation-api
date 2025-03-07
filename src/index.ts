import 'express-async-errors';

import run from './server';
import express from 'express';
import dotnev from 'dotenv';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezonde from 'dayjs/plugin/timezone';

dotnev.config();

dayjs.extend(utc);
dayjs.extend(timezonde);
dayjs.tz.setDefault('Asia/Jerusalem');

export const app = express();

run(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('listen to port ' + PORT);
});
