import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/user';

const getRedirectPath = (role) => {
  switch (role) {
    case -1:
      return '/';
    case 1:
    case 2:
      return null;
    default:
      return '/info';
  }
};

export default function PrivateRoute({ children }) {
  const user = useSelector(selectUser);
  const redirectPath = getRedirectPath(user.role);

  if (redirectPath) {
    return <Navigate to={redirectPath} />;
  }

  return children;
}
