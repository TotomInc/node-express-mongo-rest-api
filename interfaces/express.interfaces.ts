/**
 * Generic payload for an API error.
 */
export interface APIError {
  name: string;
  message: string;
  status: number;
  stack?: string;
}
