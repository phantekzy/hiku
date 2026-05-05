import { Request, Response, NextFunction } from "express";
export interface AppError extends Error {
    statusCode?: number;
}
export declare const errorHandler: (err: AppError, _req: Request, res: Response, _next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map