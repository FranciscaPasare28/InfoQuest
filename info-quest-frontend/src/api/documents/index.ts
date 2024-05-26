// import { api } from '../api';
//
// const documentsApi = api.injectEndpoints({
//   endpoints: (builder) => ({
//     fetchAllDocuments: builder.query<any, void>({
//       query: () => 'documents/all',
//       providesTags: ['documents'],
//     }),
//     removeDocument: builder.mutation<void, any>({
//       query: (id) => ({
//         url: `documents/${id}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['documents'],
//     }),
//     uploadDocument: builder.mutation<void, any>({
//       query: (document) => ({
//         url: 'documents/upload',
//         method: 'POST',
//         body: document,
//       }),
//       invalidatesTags: ['documents'],
//     }),
//     modifyDocument: builder.mutation<void, any>({
//       query: (document) => ({
//         url: `documents/${document.id}`,
//         method: 'PUT',
//         // body: document.chapters,
//       }),
//       invalidatesTags: ['documents'],
//     }),
//   }),
//   overrideExisting: false,
// });
//
// export const {
//   useFetchAllDocumentsQuery,
//   useRemoveDocumentMutation,
//   useUploadDocumentMutation,
//   useModifyDocumentMutation,
// } = documentsApi;
//
// // useGetDocumentsQuery,
// //     useDeleteDocumentMutation,
// //     useCreateDocumentMutation,
// // useUpdateDocumentMutation,

import { api } from '../api';

const fetchAllDocumentsQuery = () => 'documents/all';
const removeDocumentQuery = (id: any) => ({
  url: `documents/${id}`,
  method: 'DELETE',
});
const uploadDocumentQuery = (document: any) => ({
  url: 'documents/upload',
  method: 'POST',
  body: document,
});
const modifyDocumentQuery = (document: any) => ({
  url: `documents/${document.id}`,
  method: 'PUT',
  body: document.sections,
});

const documentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchAllDocuments: builder.query<any, void>({
      query: fetchAllDocumentsQuery,
      providesTags: ['documents'],
    }),
    removeDocument: builder.mutation<void, any>({
      query: removeDocumentQuery,
      invalidatesTags: ['documents'],
    }),
    uploadDocument: builder.mutation<void, any>({
      query: uploadDocumentQuery,
      invalidatesTags: ['documents'],
    }),
    modifyDocument: builder.mutation<void, any>({
      query: modifyDocumentQuery,
      invalidatesTags: ['documents'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchAllDocumentsQuery,
  useRemoveDocumentMutation,
  useUploadDocumentMutation,
  useModifyDocumentMutation,
} = documentsApi;

// useGetDocumentsQuery,
//     useDeleteDocumentMutation,
//     useCreateDocumentMutation,
//     useUpdateDocumentMutation,
