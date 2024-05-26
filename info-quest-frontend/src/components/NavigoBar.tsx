import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { logout, selectUser } from '../store/user';
import { selectShowVacationButton } from '../store/button';
import './NavigoBar.css';
import LeaveRequestForm from './LeaveRequest';
import { useFetchUserPermissionsQuery } from '../api/users';
import CertificateForm from './Certificate';

export default function NavigoBar() {
  const dispatch = useDispatch();
  const showVacationButton = useSelector(selectShowVacationButton);
  const user = useSelector(selectUser);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [hasCertificatePermission, setHasCertificatePermission] = useState(false);

  // Fetch permissions for the current user
  const { data: permissions } = useFetchUserPermissionsQuery(user.id);

  useEffect(() => {
    // Check if the user does not have permission with ID 8
    if (permissions && !permissions.some((permission) => permission.id === 8) || user.role === 1 || user.role === 2) {
      setHasPermission(true);
    } else {
      setHasPermission(false);
    }
    if (permissions && permissions.some((permission) => permission.id === 8) && !(user.role === 2)) {
      setHasCertificatePermission(true);
    } else {
      setHasCertificatePermission(false);
    }
  }, [permissions]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openModal = (e) => {
    e.preventDefault(); // Prevents the default navigation behavior
    setIsModalVisible(true);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="menu-button" onClick={toggleMenu}>
          <span>Menu</span>
          {' '}
          {/* This will be the menu button */}
        </div>
        {isMenuOpen && (
          <div className="dropdown">
            <Link to="/info" className="navbarLink">Chat</Link>
            <Link to="/profile" className="navbarLink">Profile</Link>
            <Link to="/vacations" className="navbarLink">Calendar</Link>
            {hasPermission && (
            <>
              <a className="navbarLink" href="#" onClick={openModal}>Leave Request</a>
              <LeaveRequestForm visible={isModalVisible} setVisible={setIsModalVisible} />
            </>
            )}
            {hasCertificatePermission && (
            <>
              <a className="navbarLink" href="#" onClick={openModal}>Certificate</a>
              <CertificateForm visible={isModalVisible} setVisible={setIsModalVisible} />
            </>
            )}
            {user.role === 1 || user.role === 2 ? (
              <>
                <Link to="/upload-document" className="navbarLink">Documents</Link>
                <Link to="/sections" className="navbarLink">Sections</Link>
                <Link to="/roles" className="navbarLink">Roles</Link>
                <Link to="/users" className="navbarLink">Users</Link>
              </>
            ) : null}

            {showVacationButton && (
            <Link to="/vacations" className="navbarLink">Days Off</Link>
            )}
          </div>
        )}

        <div className="logout-button" onClick={() => dispatch(logout())}>
          <span>Logout</span>
        </div>
      </div>
    </nav>
  );
}
