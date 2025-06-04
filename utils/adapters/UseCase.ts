export interface UseCase<T> {
  statusCode: number;
  message: string;
  data: T;
}