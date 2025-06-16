type ApiResponse<T = unknown, U = unknown> = {
  statusCode: number;
  message: string;
  data?: T;
  error?: U;
};

export default function response<T = unknown, U = unknown>({
  statusCode,
  message,
  data,
  error,
}: ApiResponse<T, U>) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, data, error }, null, 2),
  };
}
