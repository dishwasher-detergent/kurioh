export interface Response {
  success: boolean;
  message: string;
}

export interface Result<T> extends Response {
  data?: T;
}

export interface DocumentList<T> {
  documents: T[];
  total: number;
}

export interface AuthResponse extends Response {
  redirect?: string;
}
