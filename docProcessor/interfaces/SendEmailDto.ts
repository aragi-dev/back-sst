export interface SendEmailDTO {
  email: string,
  mfaSecret?: string,
  userId?: string
}

export interface SendEmailResponseDTO {
  email: string;
  send: boolean;
}