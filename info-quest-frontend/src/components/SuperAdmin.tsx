import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectUser } from '../store/user';

function SuperAdmin({ kids }) {
  const user = useSelector(selectUser);

  const isAdmin = user.role === 1;

  if (!isAdmin || !kids) {
    return <Navigate to="/info" />;
  }
}

export default SuperAdmin;
