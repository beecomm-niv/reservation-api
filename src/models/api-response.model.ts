export class ApiResponse<T> {
  result: boolean;
  code: number;
  data: T;
  message?: string;

  private constructor(result: boolean, data: T, code: number, message?: string) {
    this.result = result;
    this.code = code;
    this.data = data;
    this.message = message;
  }

  public static success = <T>(data: T): ApiResponse<T> => new ApiResponse<T>(true, data, 200);

  public static error = (code: number, message: string): ApiResponse<null> => new ApiResponse<null>(false, null, code, message);
}
