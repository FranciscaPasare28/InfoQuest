import { api } from '../api';

const getRolesQuery = () => 'roles';
const getPermissionQuery = () => 'permissions';
const deleteRoleQuery = (id: any) => ({
  url: `roles/${id}`,
  method: 'DELETE',
});
const createRoleQuery = (role: any) => ({
  url: 'roles',
  method: 'POST',
  body: role,
});
const updateRoleQuery = (role: any) => ({
  url: `roles/${role.id}`,
  method: 'PATCH',
  body: role,
});

const rolesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<any, void>({
      query: getRolesQuery,
      providesTags: ['roles'],
    }),
    getPermissions: builder.query<any, void>({
      query: getPermissionQuery,
    }),
    deleteRole: builder.mutation<void, any>({
      query: deleteRoleQuery,
      invalidatesTags: ['roles'],
    }),
    createRole: builder.mutation<void, any>({
      query: createRoleQuery,
      invalidatesTags: ['roles'],
    }),
    updateRole: builder.mutation<void, any>({
      query: updateRoleQuery,
      invalidatesTags: ['roles'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRolesQuery,
  useGetPermissionsQuery,
  useDeleteRoleMutation,
  useCreateRoleMutation,
  useUpdateRoleMutation,
} = rolesApi;

// useGetRolesQuery,
// useCreateRoleMutation,
// useUpdateRoleMutation,
// useGetPermissionsQuery,
