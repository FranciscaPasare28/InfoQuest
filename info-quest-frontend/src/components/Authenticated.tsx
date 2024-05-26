import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectUser } from '../store/user';

const getRedirectPathForAuthenticated = (role) => {
  if (role === -1) {
    return '/';
  }
  return null;
};

export default function Authenticated({ children }) {
  const user = useSelector(selectUser);
  // console.log(user);
  const redirectPath = getRedirectPathForAuthenticated(user.role);

  if (redirectPath) {
    return <Navigate to={redirectPath} />;
  }

  return children;
}
