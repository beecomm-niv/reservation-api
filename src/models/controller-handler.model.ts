import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from './api-response.model';

export type ControllerHandler<T> = (req: Request, res: Response<ApiResponse<T>>, next: NextFunction) => Promise<void>;
export type ControllerErrorHandler = (err: any, req: Request, res: Response<ApiResponse<null>>, next: NextFunction) => void;
