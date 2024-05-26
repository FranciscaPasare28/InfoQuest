// import React, { useEffect } from 'react';
// import { Button, Modal, message } from 'antd';
// import {
//   DeleteOutlined,
//   EditOutlined,
//   ExclamationCircleFilled,
// } from '@ant-design/icons';
// import { Section } from '../types/Types';
// import { useDeleteSectionMutation } from '../api/sections';
//
// function EditButton({ record, onEdit }) {
//   return (
//     <Button
//       type="primary"
//       icon={<EditOutlined />}
//       onClick={() => onEdit(record)}
//     >
//       Edit
//     </Button>
//   );
// }
//
// function DeleteButton({ record, onDelete }) {
//   return (
//     <Button
//       danger
//       icon={<DeleteOutlined />}
//       onClick={() => onDelete(record.id)}
//     >
//       Delete
//     </Button>
//   );
// }
//
// export default function SectionsList(handleEdit: (record: Section) => void) {
//   const [useDelete, { isLoading: isDeleting, isSuccess }] = useDeleteSectionMutation();
//   const { confirm } = Modal;
//
//   useEffect(() => {
//     if (isSuccess) {
//       message.success('Section deleted successfully');
//     }
//   }, [isDeleting, isSuccess]);
//
//   const showDeleteConfirm = (id: number) => {
//     confirm({
//       title: 'Are you sure you want to delete this section?',
//       icon: <ExclamationCircleFilled />,
//       content: 'Deleted sections cannot be recovered',
//       onOk() {
//         useDelete(id);
//       },
//     });
//   };
//
//   return [
//     {
//       title: 'Tag',
//       dataIndex: 'tag',
//       key: 'tag',
//     },
//     {
//       title: 'Name',
//       dataIndex: 'name',
//       key: 'name',
//     },
//     {
//       title: 'Permission',
//       dataIndex: 'permissionSubject',
//       key: 'permissionSubject',
//     },
//     {
//       title: 'Edit',
//       key: 'edit',
//       render: (_: object, record: Section) => (
//         <EditButton record={record} onEdit={handleEdit} />
//       ),
//     },
//     {
//       title: 'Delete',
//       key: 'delete',
//       render: (_: object, record: Section) => (
//         <DeleteButton record={record} onDelete={showDeleteConfirm} />
//       ),
//     },
//   ];
// }
import React, { useEffect } from 'react';
import { Button, Modal, message } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons';
import { Section } from '../types/Types';
import { useDeleteSectionMutation } from '../api/sections';
import './Section.css';

function EditButton({ record, onEdit }) {
  return (
    <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(record)}>
      Edit
    </Button>
  );
}

function DeleteButton({ record, onDelete }) {
  return (
    <Button id="deleteButton" icon={<DeleteOutlined />} onClick={() => onDelete(record.id)}>
      Delete
    </Button>
  );
}

const deleteSection = (useDelete) => (id) => {
  Modal.confirm({
    title: 'Are you sure you want to delete this section?',
    icon: <ExclamationCircleFilled />,
    content: 'Deleted sections cannot be recovered',
    onOk: () => useDelete(id),
  });
};

export default function SectionsList(handleEdit) {
  const [useDelete, { isLoading: isDeleting, isSuccess }] = useDeleteSectionMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success('Section deleted successfully');
    }
  }, [isDeleting, isSuccess]);

  const onDelete = deleteSection(useDelete);

  const columns = [
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Permission',
      dataIndex: 'permissionSubject',
      key: 'permissionSubject',
    },
    {
      title: 'Edit',
      key: 'edit',
      render: (text, record) => <EditButton record={record} onEdit={handleEdit} />,
    },
    {
      title: 'Delete',
      key: 'delete',
      render: (text, record) => <DeleteButton record={record} onDelete={onDelete} />,
    },
  ];

  return columns;
}
