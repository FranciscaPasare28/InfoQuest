import React, { useState } from 'react';
import {
  Table, Row, Col, Select, Form, Button, Modal, message,
} from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useFetchAllUsersQuery, usePatchUserMutation, useRemoveUserMutation } from '../api/users';
import { useGetRolesQuery } from '../api/roles';
import { selectUser } from '../store/user';

const { Option } = Select;
const { confirm } = Modal;

function ViewUsers() {
  const [patchUser] = usePatchUserMutation();
  const [removeUser] = useRemoveUserMutation(); // Hook-ul de ștergere
  const [roleState, setRoleState] = useState('User');
  const { data: users } = useFetchAllUsersQuery({ refetchOnMountOrArgChange: true });
  const { data: roles } = useGetRolesQuery({ refetchOnMountOrArgChange: true });
  const user = useSelector(selectUser);
  const option = roles?.data.slice(1).map((role) => (
    <Option value={role.id} key={role.id}>
      {role.name}
    </Option>
  ));
  const isSuperAdmin = user.role === 1;

  const dataSource = users?.data.slice(1).map(({
    id, name, role, email,
  }) => ({
    name,
    email,
    Role: role.name,
    id,
  }));
  const showUpdateConfirm = (user) => {
    const body = {
      id: user.id,
      data: {
        name: user.name,
        email: user.email,
        password: null,
        isActive: true,
        roleId: roleState,
      },
    };

    confirm({
      title: 'Are you sure you want to update the role ?',
      icon: <ExclamationCircleFilled />,
      onOk() {
        patchUser(body);
        message.config({ top: 100 });
        message.success('Role updated successfully!', 2);
      },
    });
  };

  const showDeleteConfirm = (user) => {
    console.log('Trying to delete user with ID:', roleState); // Verifică dacă ID-ul este corect
    confirm({
      title: 'Are you sure you want to delete this user?',
      icon: <ExclamationCircleFilled />,
      onOk() {
        removeUser(user.id) // Aici trimite doar user.id direct
          .then(() => {
            message.success('User deleted successfully!', 2);
          })
          .catch((error) => {
            console.error('Failed to delete user:', error);
            message.error(`Failed to delete user: ${error.message}`);
          });
      },
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Role',
      dataIndex: 'Role',
      key: 'Role',
      render: (_, record) => (
        <RoleSelector
          defaultValue={record.Role}
          onSelect={(value) => setRoleState(value)}
          options={option}
          disabled={!isSuperAdmin}
        />
      ),
    },
    {
      title: 'Update',
      key: 'update',
      render: (_, record) => (
        <UpdateButton onClick={() => showUpdateConfirm(record)} disabled={!isSuperAdmin} />
      ),
    },
    {
      title: 'Delete',
      key: 'delete',
      render: (_, record) => (
        <Button danger onClick={() => showDeleteConfirm(record)} disabled={!isSuperAdmin}>Delete</Button>
      ),
    },
  ];

  return (
    <div className="usersWrapper" style={{ alignSelf: 'center', paddingTop: '90px' }}>
      <Row>
        <Col span={18} offset={3}>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={{ hideOnSinglePage: true, pageSize: 4 }}
            style={{ overflowX: 'auto' }}
          />
        </Col>
      </Row>
    </div>
  );
}

function RoleSelector({ defaultValue, onSelect, options }) {
  return (
    <Form>
      <Select defaultValue={defaultValue} style={{ width: 200 }} onChange={onSelect}>
        {options}
      </Select>
    </Form>
  );
}

function UpdateButton({ onClick, disabled }) {
  return <Button onClick={onClick} disabled={disabled}>Update</Button>;
}

export default ViewUsers;
