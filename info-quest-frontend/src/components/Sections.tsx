// import React, { useState } from 'react';
// import {
//   Button, Col, Form, Input, Row, Table, message,
// } from 'antd';
// import SectionsList from './SectionsList';
// import { useCreateSectionMutation, useGetSectionsQuery, useUpdateSectionMutation } from '../api/sections';
// import { useGetPermissionsQuery } from '../api/roles';
//
// export default function Sections() {
//   const [form] = Form.useForm();
//   const [isFormVisible, setIsFormVisible] = useState(false);
//   const [editingSection, setEditingSection] = useState(null);
//   const { data: sections } = useGetSectionsQuery({ refetchOnMountOrArgChange: true });
//   const [createSection] = useCreateSectionMutation();
//   const [updateSection] = useUpdateSectionMutation();
//
//   const handleEdit = (section) => {
//     setEditingSection(section);
//     form.setFieldsValue(section);
//     setIsFormVisible(true);
//   };
//
//   const { data: permissions } = useGetPermissionsQuery({
//     refetchOnMountOrArgChange: true,
//   });
//
//   const handleFormSubmit = async (values) => {
//     const sectionData = { ...editingSection, ...values };
//     try {
//       if (sectionData.id) {
//         await updateSection(sectionData);
//         message.success('Section updated successfully');
//       } else {
//         await createSection(sectionData);
//         message.success('Section created successfully');
//       }
//     } catch (error) {
//       message.error('An error occurred');
//     }
//     setIsFormVisible(false);
//     setEditingSection(null);
//     form.resetFields();
//   };
//
//   const columns = SectionsList(handleEdit);
//
//   return (
//     <Row style={{ paddingTop: '20px' }}>
//       <Col span={18} offset={3}>
//         <Button
//           type="primary"
//           onClick={() => {
//             setIsFormVisible(true);
//             setEditingSection(null);
//             form.resetFields();
//           }}
//         >
//           Add New Section
//         </Button>
//
//         {isFormVisible && (
//           <Form
//             form={form}
//             initialValues={{ tag: '', name: '' }}
//             onFinish={handleFormSubmit}
//             style={{ marginTop: '20px' }}
//           >
//             <Form.Item name="tag" rules={[{ required: true, message: 'Please input a tag!' }]}>
//               <Input placeholder="Tag" />
//             </Form.Item>
//             <Form.Item name="name" rules={[{ required: true, message: 'Please input a name!' }]}>
//               <Input placeholder="Name" />
//             </Form.Item>
//             <Button type="primary" htmlType="submit">
//               Submit
//             </Button>
//             <Button onClick={() => setIsFormVisible(false)} style={{ marginLeft: '10px' }}>
//               Cancel
//             </Button>
//           </Form>
//         )}
//
//         <Table
//           dataSource={sections?.map((sec, index) => ({ ...sec, key: index }))}
//           columns={columns}
//           pagination={{ hideOnSinglePage: true, pageSize: 4 }}
//           style={{ marginTop: '20px', overflowX: 'auto' }}
//         />
//       </Col>
//     </Row>
//   );
// }
import React, { useState } from 'react';
import {
  Button, Col, Form, Input, Row, Table, Select, message,
} from 'antd';
import SectionsList from './SectionsList';
import {
  useCreateSectionMutation,
  useGetSectionsQuery,
  useUpdateSectionMutation,
} from '../api/sections';
import { useGetPermissionsQuery } from '../api/roles';
import './Section.css';

const { Option } = Select;
// function removeSectionPrefix(subject) {
//   return subject.replace('Section ', '');
// }

export default function Sections() {
  const [form] = Form.useForm();
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const { data: sections } = useGetSectionsQuery({
    refetchOnMountOrArgChange: true,
  });
  const [createSection] = useCreateSectionMutation();
  const [updateSection] = useUpdateSectionMutation();

  const { data: permissions } = useGetPermissionsQuery({
    refetchOnMountOrArgChange: true,
  });

  const handleEdit = (section) => {
    setEditingSection(section);
    form.setFieldsValue(section);
    setIsFormVisible(true);
  };
  // const handleEdit = (section) => {
  //   setEditingSection(section);
  //   form.setFieldsValue({
  //     ...section,
  //     permissionSubject: removeSectionPrefix(section.permissionSubject),
  //   });
  //   setIsFormVisible(true);
  // };

  const handleFormSubmit = async (values) => {
    const sectionData = { ...editingSection, ...values };
    try {
      if (sectionData.id) {
        await updateSection(sectionData);
        message.success('Section updated successfully');
      } else {
        await createSection(sectionData);
        message.success('Section created successfully');
      }
    } catch (error) {
      message.error('An error occurred');
    }
    // setIsFormVisible(false);
    setEditingSection(null);
    form.resetFields();
  };

  // const handleFormSubmit = async (values) => {
  //   // Adaugă prefixul înapoi la permisiune, dacă este necesar
  //   const sectionData = {
  //     ...editingSection,
  //     ...values,
  //     permissionSubject: `${values.permissionSubject}`,
  //   };
  //
  //   try {
  //     if (sectionData.id) {
  //       await updateSection(sectionData);
  //       message.success('Section updated successfully');
  //     } else {
  //       await createSection(sectionData);
  //       message.success('Section created successfully');
  //     }
  //   } catch (error) {
  //     message.error('An error occurred');
  //   }
  //
  //   form.resetFields();
  //   setEditingSection(null);
  // };

  const option = permissions?.data
    .filter((x) => x.subject[0].match(/Section .+/))
    .map((permission) => (
      <Option value={permission.subject[0]} key={permission.id}>
        {permission.subject[0]}
      </Option>
    ));

  // const option = permissions?.data
  //   .filter((x) => x.subject[0].match(/Section .+/))
  //   .map((permission) => (
  //     <Option value={permission.subject[0]} key={permission.id}>
  //       {removeSectionPrefix(permission.subject[0])}
  //     </Option>
  //   ));

  const columns = SectionsList(handleEdit);
  const resetForm = () => {
    form.setFieldsValue(form.resetFields);
  };
  return (
    <Row style={{ paddingTop: '20px' }}>
      <Col span={18} offset={3}>
        <h3 style={{ marginTop: '0px' }}>Create a new section</h3>

        {isFormVisible && (
          <Form
            form={form}
            initialValues={{ tag: '', name: '' }}
            onFinish={handleFormSubmit}
            style={{ marginTop: '20px' }}
          >
            <Form.Item
              name="tag"
              rules={[{ required: true, message: 'Please input a tag!' }]}
            >
              <Input placeholder="Tag" />
            </Form.Item>
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input a name!' }]}
            >
              <Input placeholder="Name" />
            </Form.Item>
            {/* Adaugă selectorul de permisiuni aici */}
            <Form.Item
              name="permissionSubject"
             // label="Permission"
              rules={[
                { required: true, message: 'Please select a permission!' },
              ]}
            >
              <Select placeholder="Select a permission" allowClear>
                {option}
              </Select>
            </Form.Item>
            <Button
              id="submitButton"
              type="primary"
              htmlType="submit"
              style={{
                float: 'right',
                display: 'inline-block',
                marginTop: '15px',
              }}
            >
              Submit
            </Button>
            <Button
              id="resetButton"
              onClick={() => resetForm()}
              style={{
                float: 'left',
                display: 'inline-block',
                marginTop: '15px',
              }}
            >
              Reset
            </Button>
          </Form>
        )}

        <Table
          dataSource={sections?.map((sec, index) => ({ ...sec, key: index }))}
          columns={columns}
          pagination={{ hideOnSinglePage: true, pageSize: 4 }}
          style={{ marginTop: '20px', overflowX: 'auto' }}
        />
      </Col>
    </Row>
  );
}
