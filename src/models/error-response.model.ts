export class ErrorResponse extends Error {
  public code: number;

  constructor(code: number, message: string) {
    super(message);

    this.code = code;
  }

  public static AccessDenied = () => new ErrorResponse(401, 'Access denied');
  public static MissingRequiredParams = () => new ErrorResponse(1000, 'Missing required params');
  public static ItemNotFound = () => new ErrorResponse(1001, 'The requested item was not found');
  public static InvalidParams = () => new ErrorResponse(1002, 'One of the given values is invalid');
  public static SignatureDoesNotMatch = () => new ErrorResponse(1003, 'The request signature we calculated does not match the signature you provided. Check your key and signing method');
  public static AuthorizationError = () => new ErrorResponse(1004, 'Authorization error');
  public static BadEmailOrPassword = () => new ErrorResponse(1005, 'Invalid email or password');
  public static EmailAlradyExist = () => new ErrorResponse(1006, 'Email already exists');
  public static InvalidExpression = () => new ErrorResponse(1007, 'Invalid expression');
  public static FaildToHandleNewSync = (message: string) => new ErrorResponse(1008, 'Faild to handle new sync. message: ' + message);
  public static InvalidTablesRequest = () => new ErrorResponse(1009, 'Invalid tables request');
  public static InvalidExpectedDate = () => new ErrorResponse(1010, 'Invalid expected date');
}
