import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import InfoPage from './pages/InfoPage';
import CallbackPage from './pages/CallbackPage';
import UploadPage from './pages/UploadPage';
import PrivateRoute from './components/PrivateRoute';
import S_AdminPage from './pages/S_AdminPage';
import SectionsPage from './pages/SectionsPage';
import Authenticated from './components/Authenticated';
import NewRole from './components/NewRole';
import NewRolePage from './pages/NewRolePage';
import UsersPage from './pages/UsersPage';
import CalendarPage from './pages/CalendarPage';
import { toggleVacationButton } from './store/button';
import ProfilePage from './pages/ProfilePage';
import LeaveRequest from './components/LeaveRequest';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(toggleVacationButton(false));
  }, [dispatch]);
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/info"
            element={(
              <Authenticated>
                <InfoPage />
              </Authenticated>
            )}
          />
          <Route path="/google-callback" element={<CallbackPage />} />
          <Route
            path="/upload-document"
            element={(
              <PrivateRoute>
                <S_AdminPage />
              </PrivateRoute>
            )}
          />
          <Route
            path="/sections"
            element={(
              <PrivateRoute>
                <SectionsPage />
              </PrivateRoute>
            )}
          />
          <Route
            path="/users"
            element={(
              <PrivateRoute>
                <UsersPage />
              </PrivateRoute>
                  )}
          />
          <Route
            path="/vacations"
            element={(
              <Authenticated>
                <CalendarPage />
              </Authenticated>
                )}
          />
          <Route
            path="/roles"
            element={(
              <PrivateRoute>
                <NewRolePage />
              </PrivateRoute>
                 )}
          />
          <Route
            path="/profile"
            element={(
              <Authenticated>
                <ProfilePage />
              </Authenticated>
            )}
          />
          <Route
            path="/leave"
            element={(
              <Authenticated>
                <LeaveRequest />
              </Authenticated>
                )}
          />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
