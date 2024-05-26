import React, { useState } from 'react';
import {
  Col,
  Form,
  Input,
  Row,
  Button,
  message,
  Table,
  Modal,
  Checkbox,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useSelector } from 'react-redux';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons';
import {
  useCreateRoleMutation,
  useGetPermissionsQuery,
  useGetRolesQuery,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from '../api/roles';
import { Role } from '../types/Types';
import { selectUser } from '../store/user';
import './Section.css';

function DeleteButton({ record, onDelete, disabled }) {
  return (
    <Button
      id="deleteButton"
      icon={<DeleteOutlined />}
      disabled={disabled}
      onClick={() => onDelete(record.id)}
    >
      Delete
    </Button>
  );
}

function EditButton({ record, onEdit, disabled }) {
  return (
    <Button
      type="primary"
      icon={<EditOutlined />}
      disabled={disabled}
      onClick={() => onEdit(record)}
    >
      Edit
    </Button>
  );
}

export default function NewRole() {
  const [form] = useForm();
  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();
  const { confirm } = Modal;
  const user = useSelector(selectUser);
  const isSuperAdmin = user.role === 1;

  const showDeleteConfirm = (id) => {
    confirm({
      title: 'Are you sure you want to delete this section?',
      icon: <ExclamationCircleFilled />,
      content: 'Deleted sections cannot be recovered',
      onOk() {
        deleteRole(id)
          .unwrap()
          .then(() => message.success('Role deleted successfully!'))
          .catch(() => message.error('Failed to delete role'));
      },
    });
  };

  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const { data: roles } = useGetRolesQuery({ refetchOnMountOrArgChange: true });
  const { data: permissions } = useGetPermissionsQuery({
    refetchOnMountOrArgChange: true,
  });

  const CheckBoxGroup = Checkbox.Group;

  const checkBoxOptions = permissions && permissions.data.length
    ? permissions.data
      .filter((x) => x.subject[0].match(/Section .+/))
      .map((x) => x.subject[0])
    : [];

  const dataSource = roles?.data.slice(3).map((doc, index) => ({
    ...doc,
    key: index,
  }));

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Created at',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      render: (perms) => {
        if (perms) {
          return perms.map((x) => (
            <p key={x.id} style={{ margin: '2px' }}>
              {x.subject[0]}
            </p>
          ));
        }
        return null;
      },
    },
    {
      title: 'Edit',
      key: 'edit',
      render: (_, record) => (
        <EditButton
          record={record}
          onEdit={handleEdit}
          disabled={!isSuperAdmin}
        />
      ),
    },
    {
      title: 'Delete',
      key: 'delete',
      render: (_, record) => (
        <DeleteButton
          record={record}
          onDelete={() => showDeleteConfirm(record.id)}
          disabled={!isSuperAdmin}
        />
      ),
    },
  ];

  const handleFormChange = (list) => {
    setSelectedPermissions(list);
  };

  const handleEdit = (role) => {
    const fields = form.getFieldsValue();
    fields.id = role.id;
    fields.name = role.name;
    setSelectedPermissions(
      role.permissions.map((perm) => perm.subject[0].replace('Section ', '')),
    );
    form.setFieldsValue(fields);
  };

  const resetForm = () => {
    form.resetFields();
    setSelectedPermissions([]);
  };

  const handleSubmit = (values) => {
    message.config({ top: 75 });

    const newRole = {
      name: values.name,
      permissions: selectedPermissions.map((x) => permissions.data.find((perm) => perm.subject[0] === x)),
    };

    if (!values.id) {
      createRole(newRole)
        .unwrap()
        .then(() => {
          message.success('Role added successfully!');
          form.resetFields();
        })
        .catch(() => message.error('Role is already registered!'));
    } else {
      updateRole({ ...newRole, id: values.id })
        .unwrap()
        .then(() => {
          message.success('Role updated successfully!');
        })
        .catch(() => message.error('Failed to update role'));
    }

    resetForm();
  };

  return (
    <Row style={{ paddingTop: '90px' }}>
      <Col span={18} offset={3}>
        {isSuperAdmin && (
          <>
            <h3>Create a new role</h3>
            <Form autoComplete="off" onFinish={handleSubmit} form={form}>
              <Form.Item name="id" hidden>
                <Input name="id" />
              </Form.Item>
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Please enter a name',
                  },
                  { whitespace: true },
                  { min: 3, max: 20 },
                ]}
                hasFeedback
              >
                <Input placeholder="Enter name" name="name" />
              </Form.Item>
              <h4>Select permissions</h4>
              <CheckBoxGroup
                options={checkBoxOptions}
                value={selectedPermissions}
                onChange={handleFormChange}
                className="div-content-center"
              />
              <Button
                id="resetButton"
                onClick={resetForm}
                style={{
                  float: 'left',
                  display: 'inline-block',
                  marginTop: '15px',
                }}
              >
                Reset
              </Button>
              <Button
                id="submitButton"
                htmlType="submit"
                style={{
                  float: 'right',
                  display: 'inline-block',
                  marginTop: '15px',
                }}
              >
                Submit
              </Button>
            </Form>
          </>
        )}
      </Col>
      <Col span={18} offset={3} style={{ marginTop: 50 }}>
        {!isSuperAdmin && (<h3>Roles</h3>)}
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{ hideOnSinglePage: true, pageSize: 4 }}
          style={{ overflowX: 'auto' }}
        />
      </Col>
    </Row>
  );
}
