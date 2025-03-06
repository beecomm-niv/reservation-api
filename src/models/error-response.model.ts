export class ErrorResponse extends Error {
  public code: number;

  constructor(code: number, message: string) {
    super(message);

    this.code = code;
  }

  public static MissingRequiredParams = () => new ErrorResponse(1000, 'Missing required params');
  public static ItemNotFound = () => new ErrorResponse(1001, 'The requested item is not found');
  public static InvalidParams = () => new ErrorResponse(1002, 'One of the given values is invalid');
}
