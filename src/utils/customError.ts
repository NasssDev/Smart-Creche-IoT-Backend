import STATUS_CODES from 'http-status-codes';

class CustomError extends Error {
   public error: [string, ...string[]];
   public statusCode: any;
   public data: any;
   public code: any;

   constructor(error, statusCode?: any, data?: any, code?: any) {
      // Pass remaining arguments (including vendor specific ones) to parent constructor
      super();

      // Maintains proper stack trace for where our error was thrown (only available on V8)
      if (Error.captureStackTrace) {
         Error.captureStackTrace(this, CustomError);
      }

      this.name = 'CustomError';

      this.error = Array.isArray(error) ? (error as [string, ...string[]]) : [error as string];
      this.statusCode = statusCode || STATUS_CODES.PRECONDITION_FAILED;
      this.data = data || {};
   }
}

export default CustomError;
