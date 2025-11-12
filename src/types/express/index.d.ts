import express from 'express';
import { JwtPayload } from '../../models/jwt-payload.model';
import { Log } from '../../models/log.model';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      log?: Log;
    }
  }
}
