import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  setAccessToken,
  setRefreshToken,
  logout,
  setRole, setId,
} from '../store/user';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000',
  prepareHeaders: (headers, { getState }) => {
    const base = (getState() as any).users.tokens;
    let token = base.accessToken;

    const isRefreshAction = headers.get('is-refresh-action');
    if (isRefreshAction === 'true') {
      token = base.refreshToken;
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
      headers.set('Access-Control-Allow-Origin', '*');
    }
    return headers;
  },
});

async function reauthenticate(api) {
  const refreshResult = await baseQuery(
    {
      url: '/auth/refresh',
      method: 'POST',
      headers: { 'is-refresh-action': 'true' },
    },
    api,
  );

  if (!refreshResult.data) {
    api.dispatch(logout());
    return null;
  }

  api.dispatch(setAccessToken(refreshResult.data.accessToken));
  api.dispatch(setRefreshToken(refreshResult.data.refreshToken));

  const profileResult = await baseQuery(
    { url: 'profile', method: 'GET' },
    api,
  );

  if (profileResult.data) {
    api.dispatch(setRole(profileResult.data.role.id));
    api.dispatch(setId(profileResult.data.id));
  }

  return refreshResult.data.accessToken;
}

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const newAccessToken = await reauthenticate(api);
    if (newAccessToken) {
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ['sections', 'documents', 'roles', 'users'],
});
