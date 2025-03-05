export class ErrorResponse extends Error {
  public code: number;

  constructor(code: number, message: string) {
    super(message);

    this.code = code;
  }

  public static MissingRequiredParams = () => new ErrorResponse(1000, 'Missing required params');
  public static MissingSync = () => new ErrorResponse(1001, 'The requested sync is not found');
}
