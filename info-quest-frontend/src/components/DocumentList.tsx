// import { useState } from 'react';
// import {
//   Table, Row, Col, Modal, Form, Checkbox, Button, Tag,
// } from 'antd';
// import { ExclamationCircleFilled } from '@ant-design/icons';
// import type { CheckboxValueType } from 'antd/es/checkbox/Group';
// import { EditDocumentDTO, Document, Section } from '../types/Types';
// import {
//   useRemoveDocumentMutation,
//   useFetchAllDocumentsQuery,
//   useModifyDocumentMutation,
// } from '../api/documents/index';
// import { useGetSectionsQuery } from '../api/sections';
//
// function DocumentList() {
//   const [useDelete] = useRemoveDocumentMutation();
//   const [useUpdate] = useModifyDocumentMutation();
//   const [selectedDocument, setSelectedDocument] = useState('');
//   const [selectedSections, setSelectedSections] = useState<CheckboxValueType[]>(
//     [],
//   );
//
//   const { data: documents } = useFetchAllDocumentsQuery({
//     refetchOnMountOrArgChange: true,
//   });
//
//   const { data: sections } = useGetSectionsQuery({
//     refetchOnMountOrArgChange: true,
//   });
//
//   const { confirm } = Modal;
//   const CheckBoxGroup = Checkbox.Group;
//   const checkBoxOptions = sections !== undefined && sections.length !== 0
//     ? sections?.map((x) => x.tag)
//     : [];
//
//   const showDeleteConfirm = (id: string) => {
//     confirm({
//       title: 'Are you sure you want to delete this document ?',
//       icon: <ExclamationCircleFilled />,
//       content: 'Deleted files cannot be recovered',
//       onOk() {
//         useDelete(id);
//       },
//     });
//   };
//
//   const handleEdit = (id: string, sectionsParam: string[]) => {
//     setSelectedDocument(id);
//     setSelectedSections(sectionsParam);
//   };
//
//   const dataSource = documents?.map((doc, index) => ({
//     ...doc,
//     key: index,
//   }));
//
//   const columns = [
//     {
//       title: 'Name',
//       dataIndex: 'name',
//       key: 'name',
//     },
//     {
//       title: 'Type',
//       dataIndex: 'type',
//       key: 'type',
//     },
//     {
//       title: 'Size',
//       dataIndex: 'size',
//       key: 'size',
//     },
//     {
//       title: 'Upload date',
//       dataIndex: 'uploadDate',
//       key: 'date',
//     },
//     {
//       title: 'Sections',
//       dataIndex: 'sections',
//       render: (chs: Section[] | undefined) => {
//         if (chs !== undefined) {
//           return (
//             <span>
//               {chs.map((section) => {
//                 const ch2 = sections?.find((obj) => obj.id === section.id);
//                 if (ch2 !== undefined) {
//                   return (
//                     <Tag key={ch2.id}>
//                       {ch2.tag.toUpperCase()}
//                     </Tag>
//                   );
//                 }
//               })}
//             </span>
//           );
//         }
//       },
//     },
//     {
//       title: 'Add section',
//       key: 'addSection',
//       render: (_: object, record: Document) => (
//         <Button
//           onClick={() => {
//             const sectionTags = [];
//             if (record.sections !== undefined) {
//               for (const section of record.sections) {
//                 sectionTags.push(section.tag);
//               }
//             }
//             handleEdit(record.id, sectionTags);
//           }}
//         >
//           Edit
//         </Button>
//       ),
//     },
//     {
//       title: 'Delete',
//       key: 'delete',
//       render: (_: object, record: Document) => (
//         <Button
//           danger
//           onClick={() => {
//             showDeleteConfirm(record.id);
//           }}
//         >
//           Delete
//         </Button>
//       ),
//     },
//   ];
//
//   const handleFormChange = (list: CheckboxValueType[]) => {
//     setSelectedSections(list);
//   };
//
//   const handleFormSubmit = () => {
//     const cats: Section[] = [];
//     for (const x of selectedSections) {
//       const a = sections.find((obj) => obj.tag === x);
//       if (a !== undefined) {
//         cats.push(a);
//       }
//     }
//
//     const doc: EditDocumentDTO = {
//       id: selectedDocument,
//       sections: cats,
//     };
//
//     useUpdate(doc);
//     handleEdit('', []);
//   };
//
//   return (
//     <Row style={{ marginTop: '10px' }}>
//       <Col span={18} offset={3}>
//         <Table
//           dataSource={dataSource}
//           columns={columns}
//           pagination={{ hideOnSinglePage: true, pageSize: 4 }}
//           style={{ overflowX: 'auto' }}
//         />
//       </Col>
//       <Modal
//         open={selectedDocument !== ''}
//         onCancel={() => handleEdit('', [])}
//         onOk={handleFormSubmit}
//         title="Select the wanted sections"
//       >
//         <Form style={{ paddingTop: '10px' }}>
//           <CheckBoxGroup
//             options={checkBoxOptions}
//             value={selectedSections}
//             onChange={handleFormChange}
//             className="div-content-center"
//           />
//         </Form>
//       </Modal>
//     </Row>
//   );
// }
//
// export default DocumentList;

import React, { useState } from 'react';
import {
  Table,
  Row,
  Col,
  Modal,
  Form,
  Checkbox,
  Button,
  Tag,
  message,
  Space,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { Document, EditDocumentDTO, Section } from '../types/Types';
import {
  useRemoveDocumentMutation,
  useFetchAllDocumentsQuery,
  useModifyDocumentMutation,
} from '../api/documents';
import { useGetSectionsQuery } from '../api/sections';
import './DocumentList.css';
import { GrAddCircle } from 'react-icons/gr';
import './Modal.css';

function DocumentList() {
  const [useDelete] = useRemoveDocumentMutation();
  const [useUpdate] = useModifyDocumentMutation();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null,
  );
  const [selectedSections, setSelectedSections] = useState<CheckboxValueType[]>(
    [],
  );

  const { data: documents } = useFetchAllDocumentsQuery({
    refetchOnMountOrArgChange: true,
  });
  const { data: sections } = useGetSectionsQuery({
    refetchOnMountOrArgChange: true,
  });

  const checkBoxOptions = sections?.map((section) => section.tag) || [];

  const confirmDelete = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this document?',
      icon: <ExclamationCircleFilled />,
      content: 'Deleted files cannot be recovered',
      onOk() {
        useDelete(id)
          .unwrap()
          .then(() => {
            message.success('Document has been deleted');
          })
          .catch((error) => {
            console.error('Error deleting document:', error);
            message.error('Failed to delete document');
          });
      },
    });
  };

  const handleEdit = (document: Document) => {
    setSelectedDocument(document);
    setSelectedSections(document.sections?.map((section) => section.tag) || []);
  };

  const renderDeleteButton = (record: Document) => (
    <Button
      id="deleteButton"
      icon={<DeleteOutlined />}
      onClick={() => confirmDelete(record.id)}
    >
      Delete
    </Button>
  );

  const dataSource = documents?.map((doc) => ({ ...doc, key: doc.id }));

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    // { title: 'Type', dataIndex: 'type', key: 'type' },
    // { title: 'Size', dataIndex: 'size', key: 'size' },
    { title: 'Upload date', dataIndex: 'uploadDate', key: 'uploadDate' },
    {
      title: 'Summary', dataIndex: 'summary', key: 'summary', className: 'small-summary',
    },
    {
      title: 'Sections',
      dataIndex: 'sections',
      key: 'sections',
      render: (sections: Section[] | undefined) => (
        <Space wrap>
          {sections?.map((section) => (
            <Tag color="blue" key={section.id}>
              {section.tag.toUpperCase()}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '',
      key: 'edit',
      render: (_: object, record: Document) => (
        <Button
          icon={<GrAddCircle />}
          type="primary"
          onClick={() => handleEdit(record)}
        >

          Section
        </Button>
      ),
    },
    { title: '', key: 'delete', render: renderDeleteButton },
  ];
  // const columns = [
  //   { title: 'Name', dataIndex: 'name', key: 'name' },
  //   { title: 'Type', dataIndex: 'type', key: 'type' },
  //   { title: 'Size', dataIndex: 'size', key: 'size' },
  //   { title: 'Upload date', dataIndex: 'uploadDate', key: 'uploadDate' },
  //   {
  //     title: 'Sections',
  //     dataIndex: 'sections',
  //     key: 'sections',
  //     render: (sections: Section[] | undefined) => (
  //       <span>
  //         {sections?.map((section) => {
  //           const foundSection = sections.find((s) => s.id === section.id);
  //           return (
  //             <Tag key={section.id}>
  //               {section.tag.toUpperCase()}
  //             </Tag>
  //           );
  //         })}
  //       </span>
  //     ),
  //   },
  //   {
  //     title: 'Edit',
  //     key: 'edit',
  //     render: (_: object, record: Document) => (
  //       <Button
  //         onClick={() => handleEdit(record)}
  //       >
  //         Edit
  //       </Button>
  //     ),
  //   },
  //   { title: 'Delete', key: 'delete', render: renderDeleteButton },
  // ];

  const handleFormChange = (list: CheckboxValueType[]) => {
    setSelectedSections(list);
  };

  const handleFormSubmit = () => {
    if (!selectedDocument) return;

    const updatedSections = selectedSections
      .map((tag) => sections.find((section) => section.tag === tag))
      .filter((section) => section !== undefined) as Section[];

    const updatedDocument: EditDocumentDTO = {
      id: selectedDocument.id,
      sections: updatedSections,
    };

    useUpdate(updatedDocument)
      .unwrap()
      .then(() => message.success('Document updated successfully'))
      .catch(() => message.error('Failed to update document'));

    setSelectedDocument(null);
    setSelectedSections([]);
  };

  return (
    <Row style={{ marginTop: '10px' }}>
      <Col span={22} offset={2}>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{ hideOnSinglePage: true, pageSize: 3 }}
          bordered
        />
        <Modal
          open={selectedDocument !== null}
          onCancel={() => setSelectedDocument(null)}
          onOk={handleFormSubmit}
          title="Select the wanted sections"
          icon={<ExclamationCircleFilled />}
        >
          <Form>
            <Checkbox.Group
              options={checkBoxOptions}
              value={selectedSections}
              onChange={handleFormChange}
            />
          </Form>
        </Modal>
      </Col>
    </Row>
  );
}

export default DocumentList;
