// import { useSearchParams } from 'react-router-dom';
// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { setAccessToken, setRefreshToken, setRole } from '../store/user';
// import {
//   useLazyLoginUserWithGoogleQuery,
//   useLazyFetchUserProfileQuery,
// } from '../api/auth';
//
// export default function CallbackPage() {
//   const dispatch = useDispatch();
//   const [fetchTokens] = useLazyLoginUserWithGoogleQuery();
//   const [fetchProfile] = useLazyFetchUserProfileQuery();
//
//   const [urlSearchParams] = useSearchParams();
//
//   useEffect(() => {
//     const queryParams: any = {};
//
//     for (const [key, value] of urlSearchParams.entries()) {
//       queryParams[key] = value;
//     }
//
//     const getTokens = async () => {
//       const tokens = await fetchTokens(queryParams).unwrap();
//       dispatch(setAccessToken(tokens.accessToken));
//       dispatch(setRefreshToken(tokens.refreshToken));
//       await fetchProfile()
//         .unwrap()
//         .then((fullfilled) => {
//           /// console.log(fullfilled.id);
//           dispatch(setRole(fullfilled.role.id));
//           window.location.href = 'http://localhost:3001/info';
//           // console.log(fullfilled);
//         });
//     };
//
//     getTokens();
//   }, [urlSearchParams, dispatch, fetchTokens]);
//
//   return null;
// }

import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  setAccessToken, setRefreshToken, setRole, setId,
} from '../store/user';
import {
  useLazyLoginUserWithGoogleQuery,
  useLazyFetchUserProfileQuery,
} from '../api/auth';

export default function CallbackPage() {
  const dispatch = useDispatch();
  const [fetchTokens] = useLazyLoginUserWithGoogleQuery();
  const [fetchProfile] = useLazyFetchUserProfileQuery();
  const [urlSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = Object.fromEntries(urlSearchParams.entries());

    async function handleLogin() {
      try {
        const tokens = await fetchTokens(queryParams).unwrap();
        dispatch(setAccessToken(tokens.accessToken));
        dispatch(setRefreshToken(tokens.refreshToken));

        const profile = await fetchProfile().unwrap();
        dispatch(setRole(profile.role.id));
        dispatch(setId(profile.id));
        // console.log(profile);
        navigate('/info');
      } catch (error) {
        // console.error('Error during login process:', error);
        alert('This account has been deleted. Please contact the admin for more details.');
        navigate('/login');
      }
    }

    handleLogin();
  }, [urlSearchParams, dispatch, fetchTokens, fetchProfile, navigate]);

  return null;
}
