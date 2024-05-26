import { api } from '../api';

const getCertificateQuery = () => (certificate: any) => ({
  url: 'certificate',
  method: 'POST',
  body: certificate,
});

const certificateApi = api.injectEndpoints({
  endpoints: (builder) => ({
    submitCertificate: builder.mutation({
      query: getCertificateQuery(),
    }),
  }),
});

export const { useSubmitCertificateMutation } = certificateApi;
