import { api } from '../api';

const getSectionsQuery = () => 'sections/all';
const deleteSectionQuery = (id: any) => ({
  url: `sections/${id}`,
  method: 'DELETE',
});
const createSectionQuery = (section: any) => ({
  url: 'sections',
  method: 'POST',
  body: { ...section },
});
const updateSectionQuery = (section: any) => ({
  url: `sections/${section.id}`,
  method: 'PUT',
  body: { ...section },
});

const sectionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSections: builder.query<any, void>({
      query: getSectionsQuery,
      providesTags: ['sections'],
    }),
    deleteSection: builder.mutation<void, any>({
      query: deleteSectionQuery,
      invalidatesTags: ['sections'],
    }),
    createSection: builder.mutation<void, any>({
      query: createSectionQuery,
      invalidatesTags: ['sections'],
    }),
    updateSection: builder.mutation<void, any>({
      query: updateSectionQuery,
      invalidatesTags: ['sections'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSectionsQuery,
  useDeleteSectionMutation,
  useCreateSectionMutation,
  useUpdateSectionMutation,
} = sectionsApi;
