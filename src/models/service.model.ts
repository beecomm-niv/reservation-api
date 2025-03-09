import { ACCESS } from './jwt-payload.model';

export interface Service {
  name: string;
  accessKeyId: string;
  accessSecretKey: string;
  access: ACCESS[];
}
