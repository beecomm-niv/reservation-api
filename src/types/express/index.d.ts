import express from 'express';
import { JwtPayload } from '../../models/jwt-payload.model';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      logPayload?: any;
    }
  }
}
