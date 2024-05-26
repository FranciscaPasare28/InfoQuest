import { api } from '../api';

const getNotesQuery = () => 'notes';
const deleteNoteQuery = (id: any) => ({
  url: `notes/${id}`,
  method: 'DELETE',
});
const createNoteQuery = (note: any) => ({
  url: 'notes',
  method: 'POST',
  body: note,
});
const updateNoteQuery = (note) => ({
  url: `notes/${note.id}`,
  method: 'PATCH',
  body: note,
});

const notesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query<any, void>({
      query: getNotesQuery,
      providesTags: ['notes'],
    }),
    deleteNote: builder.mutation<void, any>({
      query: deleteNoteQuery,
      invalidatesTags: ['notes'],
    }),
    createNote: builder.mutation<void, any>({
      query: createNoteQuery,
      invalidatesTags: ['notes'],
    }),
    updateNote: builder.mutation<void, any>({
      query: updateNoteQuery,
      invalidatesTags: ['notes'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNotesQuery,
  useDeleteNoteMutation,
  useCreateNoteMutation,
  useUpdateNoteMutation,
} = notesApi;
