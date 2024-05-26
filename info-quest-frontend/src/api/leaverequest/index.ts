import { api } from '../api';

const getLeaveRequestQuery = () => (leaveRequest: any) => ({
  url: 'leave-request',
  method: 'POST',
  body: leaveRequest,
});

const leaveRequestApi = api.injectEndpoints({
  endpoints: (builder) => ({
    submitLeaveRequest: builder.mutation({
      query: getLeaveRequestQuery(),
    }),
  }),
});

export const { useSubmitLeaveRequestMutation } = leaveRequestApi;
