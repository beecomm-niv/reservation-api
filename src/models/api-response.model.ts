export class ApiResponse<T> {
  result: boolean;
  code: number;
  value: T;
  message?: string;

  private constructor(result: boolean, value: T, code: number, message?: string) {
    this.result = result;
    this.code = code;
    this.value = value;
    this.message = message;
  }

  public static success = <T>(value: T): ApiResponse<T> => new ApiResponse<T>(true, value, 200);

  public static error = (code: number, message: string): ApiResponse<null> => new ApiResponse<null>(false, null, code, message);
}
