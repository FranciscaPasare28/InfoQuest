// import { api } from '../api';
//
// const authenticationApi = api.injectEndpoints({
//   endpoints: (builder) => ({
//     fetchUserProfile: builder.query<any, void>({
//       query: () => 'profile',
//     }),
//     loginUserWithGoogle: builder.query<any, void>({
//       query: (params: any) => ({
//         url: 'auth/google-login',
//         params,
//       }),
//       onError: (error) => {
//         console.error('Error during Google login:', error);
//       },
//     }),
//   }),
//   overrideExisting: false,
// });
//
// export const {
//   useFetchUserProfileQuery,
//   useLazyFetchUserProfileQuery,
//   useLazyLoginUserWithGoogleQuery,
//   useLoginUserWithGoogleQuery,
// } = authenticationApi;
//
// // useGetProfileQuery,
// //     useLazyGetProfileQuery,
// //     useLazyFetchAuthTokensQuery,
// //     useFetchAuthTokensQuery,
import { api } from '../api';

type UserProfileResponse = any;
type GoogleLoginParams = any;

const PROFILE_ENDPOINT = 'profile';
const GOOGLE_LOGIN_ENDPOINT = 'auth/google-login';

const authenticationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchUserProfile: builder.query<UserProfileResponse, void>({
      query: () => PROFILE_ENDPOINT,
    }),
    loginUserWithGoogle: builder.query<UserProfileResponse, GoogleLoginParams>({
      query: (params) => ({
        url: GOOGLE_LOGIN_ENDPOINT,
        params,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchUserProfileQuery,
  useLazyFetchUserProfileQuery,
  useLazyLoginUserWithGoogleQuery,
  useLoginUserWithGoogleQuery,
} = authenticationApi;
