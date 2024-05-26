import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { createRoot } from 'react-dom/client';
import { store, persistor } from './store/index';
import App from './App';

function AppWrapper() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider clientId="148579626391-jct6kkcoug1pjqm712m0pkeko37ah190.apps.googleusercontent.com">
          <App />
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  );
}

const appRootElement = document.getElementById('root');
const appRoot = createRoot(appRootElement);
appRoot.render(<AppWrapper />);
