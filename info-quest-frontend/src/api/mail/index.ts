import { api } from '../api';

// const getMailQuery = () => 'mail';
// const getPermissionQuery = () => 'permissions';
// const deleteRoleQuery = (id: any) => ({
//   url: `roles/${id}`,
//   method: 'DELETE',
// });
// const createRoleQuery = (role: any) => ({
//   url: 'roles',
//   method: 'POST',
//   body: role,
// });
// const updateRoleQuery = (role: any) => ({
//   url: `roles/${role.id}`,
//   method: 'PATCH',
//   body: role,
// });
const testQuery = (data : any) => ({
  url: 'mail/checkdata',
  method: 'POST',
  body: data,
});

const mailApi = api.injectEndpoints({
  endpoints: (builder) => ({
    testEndpoint: builder.mutation<void, any>({
      query: testQuery,
    }),
  }),
  overrideExisting: false,
  //   endpoints: (builder) => ({
  //     getRoles: builder.query<any, void>({
  //       query: getMailQuery,
  //       providesTags: ['roles'],
  //     }),
  //     getPermissions: builder.query<any, void>({
  //       query: getPermissionQuery,
  //     }),
  //     deleteRole: builder.mutation<void, any>({
  //       query: deleteRoleQuery,
  //       invalidatesTags: ['roles'],
  //     }),
  //     createRole: builder.mutation<void, any>({
  //       query: createRoleQuery,
  //       invalidatesTags: ['roles'],
  //     }),
  //     updateRole: builder.mutation<void, any>({
  //       query: updateRoleQuery,
  //       invalidatesTags: ['roles'],
  //     }),
  //   }),

});

export const {
  useTestEndpointMutation,
//   useGetPermissionsQuery,
//   useDeleteRoleMutation,
//   useCreateRoleMutation,
//   useUpdateRoleMutation,
} = mailApi;

// useGetRolesQuery,
// useCreateRoleMutation,
// useUpdateRoleMutation,
// useGetPermissionsQuery,
