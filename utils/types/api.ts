import { Resource } from "@utils/enums/Resource";

type ResourceTypeMap = {
  [Resource.DB_PROCESSOR]: { value: string };
  [Resource.EMAIL_SENDER]: { value: string };
  [Resource.BUCKET_IMG_QR]: { value: string };
  [Resource.PRE_AUTH]: { value: string };
};

export type LambdaContextFromNeeds<T extends Resource[]> = {
  stage: string;
} & {
  [K in T[number]]: ResourceTypeMap[K];
};

export interface ApiRoute<T extends Resource[]> {
  method: string;
  path: string;
  needs: T;
  lambda: (props: LambdaContextFromNeeds<T>) => any;
} 
