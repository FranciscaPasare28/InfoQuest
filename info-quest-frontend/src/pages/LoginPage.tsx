import { useGoogleLogin } from '@react-oauth/google';
import './LoginPage.css';

export default function LoginPage() {
  const login = useGoogleLogin({
    flow: 'auth-code',
    redirect_uri: 'http://localhost:3001/google-callback',
    ux_mode: 'redirect',
  });
  return (
    <div id="loginPageBackground">
      <img src="/src/pages/logo.png" style={{ width: '220px', height: '200px' }} />

      <div className="loginBorder">
        <h1 id="loginPrompt">Welcome at InfoQuest</h1>
        <div id="googleAuthProvider">
          <button id="loginButton" onClick={() => login()} type="button">
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
