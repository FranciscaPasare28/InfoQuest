import { api } from '../api';

const fetchAllUsersQuery = () => 'users';
const fetchVacationsQuery = () => 'users/vacations';
const fetchUserAbilityQuery = (id) => `users/${id}/ability`;

const patchUserQuery = (user: any) => ({
  url: `users/${user.id}`,
  method: 'PATCH',
  body: user.data,
});

const fetchUserPermissionsQuery = (id) => `users/${id}/permissions`;

const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchAllUsers: builder.query<any, void>({
      query: fetchAllUsersQuery,
      providesTags: ['users'],
    }),
    removeUser: builder.mutation<void, any>({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['users'],
    }),
    patchUser: builder.mutation<void, any>({
      query: patchUserQuery,
      invalidatesTags: ['users'],
    }),
    fetchVacations: builder.query<any, void>({
      query: fetchVacationsQuery,
      // providesTags: ['vacations'],
    }),
    fetchUserAbility: builder.query({
      query: (id) => fetchUserAbilityQuery(id),
    }),
    fetchUserPermissions: builder.query<any, number>({
      query: fetchUserPermissionsQuery,
      providesTags: ['permissions'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchAllUsersQuery,
  useRemoveUserMutation,
  usePatchUserMutation,
  useFetchVacationsQuery,
  useFetchUserAbilityQuery,
  useFetchUserPermissionsQuery,
} = usersApi;

// useGetUsersQuery,
//     usePatchUserMutation,
//     useDeleteUserMutation,
