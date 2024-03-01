import ky from 'ky';
import { API_URL } from '../constants/links';

export class ApiError {
  status: number;
  message: string;

  constructor({ status, message }: { status: number; message: string }) {
    this.status = status;
    this.message = message || 'An unexpected error occurred';
  }
}

export const baseFetcher = ky.extend({
  hooks: {
    afterResponse: [
      async (request, options, response) => {
        const data = await response.json();
        const { ok, status } = response;

        if (ok) {
          return data;
        }

        const { message = 'An error occurred while fetching the data.' } = data;

        throw new ApiError({ status, message });
      },
    ],
  },
});

// all the api requests made through this are local api calls
export const api = baseFetcher.extend({
  prefixUrl: API_URL,
  timeout: 60_000, // 1 min timeout
});
