import { api } from '../api';

const createMeeting = (data: any) => ({
  url: 'meeting/create',
  method: 'POST',
  body: data,
});

const getMeetingsByDay = (day: string) => ({
  url: `meeting/getMeetingsByDay/${day}`,
  method: 'GET',
});

const updateMeeting = (meeting: any) => ({
  url: `meeting/update/${meeting.id}`,
  method: 'PUT',
  body: meeting,
});

const deleteMeeting = (id: number) => ({
  url: `meeting/delete/${id}`,
  method: 'DELETE',
});

const getAllMeetings = () => ({
  url: 'meeting/getAllMeetings',
  method: 'GET',
});

const meetingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createMeeting: builder.mutation<void, any>({
      query: createMeeting,
    }),
    getMeetingsByDay: builder.mutation<any[], string>({
      query: getMeetingsByDay,
    }),
    updateMeeting: builder.mutation<void, any>({
      query: updateMeeting,
    }),
    deleteMeeting: builder.mutation<void, number>({
      query: deleteMeeting,
    }),
    getAllMeetings: builder.query<any[], void>({
      query: getAllMeetings,
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateMeetingMutation,
  useGetMeetingsByDayMutation,
  useUpdateMeetingMutation,
  useDeleteMeetingMutation,
  useGetAllMeetingsQuery,
} = meetingApi;
