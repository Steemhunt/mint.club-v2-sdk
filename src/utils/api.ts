import ky from 'ky';

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

export const api = baseFetcher.extend({
  prefixUrl: 'https://mint.club/api',
  timeout: 60_000, // 1 min timeout
});
