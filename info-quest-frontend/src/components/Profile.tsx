import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/user';
import { useLazyFetchUserProfileQuery } from '../api/auth';
import './Profile.css';
import Avatar from './Avatar';
import { useFetchUserPermissionsQuery } from '../api/users';

export default function Profile() {
  const user = useSelector(selectUser);
  const [fetchProfile, { data: profile, isError }] = useLazyFetchUserProfileQuery();
  const { data: permissions } = useFetchUserPermissionsQuery(user.id);
  console.log(permissions);
  const subjectsArray = permissions.map((permission) => permission.subject[0]);

  useEffect(() => {
    if (user) {
      fetchProfile(user.id);
    }
  }, [user, fetchProfile]);
  // console.log(profile.email);
  // const { data: ability, error, isLoading } = useFetchUserAbilityQuery(user.id);
  // console.log(ability);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA'); // Canadian format: yyyy-mm-dd
  };

  if (isError) return <div>Error loading profile</div>;

  return (
    <div className="profile-container">
      {profile && (
        <div>
          <Avatar size={120} color="#007bff" />
          <p>
            <strong>Name:</strong>
            {' '}
            {profile.name}
          </p>
          <p>
            <strong>Email:</strong>
            {' '}
            {profile.email}
          </p>
          <p>
            <strong>Role:</strong>
            {' '}
            {profile.role.name}
          </p>
          <p>
            <strong>Permissions:</strong>
            {subjectsArray.map((subject) => (
              <div key={subject}>{subject}</div>
            ))}
          </p>

          <p>
            <strong>Registration Date:</strong>
            {' '}
            {formatDate(profile.createdAt)}
          </p>
        </div>
      )}
    </div>
  );
}
