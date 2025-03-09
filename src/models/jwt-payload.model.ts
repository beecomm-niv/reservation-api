export type USER_ROLE = 'super_admin' | 'admin' | 'user' | 'service';
export type ACCESS = '*' | 'sync';

export interface JwtPayload {
  id: string;
  access: ACCESS[];
  role: USER_ROLE;
}
