// import React, { useState } from 'react';
// import {
//   Form, Input, DatePicker, Button, message, Modal,
// } from 'antd';
//
// function LeaveRequestForm({ visible, setVisible }) {
//   const [form] = Form.useForm();
//
//   const onFinish = async (values) => {
//     try {
//       // Realizăm o cerere POST către server
//       const response = await fetch('http://localhost:3000/leave-request', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: values.name,
//           startDate: values.dates[0].format('YYYY-MM-DD'),
//           endDate: values.dates[1].format('YYYY-MM-DD'),
//         }),
//       });
//
//       // Gestionăm răspunsul de la server
//       if (!response.ok) throw new Error('Failed to send request');
//       message.success('Cererea de concediu a fost trimisă cu succes!');
//       form.resetFields(); // Resetăm câmpurile formularului
//       setVisible(false); // Închidem modalul
//     } catch (error) {
//       message.error(`Eroare la trimiterea cererii: ${error.message}`);
//     }
//   };
//
//   const handleCancel = () => setVisible(false);
//
//   return (
//     <Modal
//       title="Cerere de Concediu"
//       open={visible} // Schimbat `visible` în `open`
//       onCancel={handleCancel}
//       footer={null}
//     >
//       <Form form={form} onFinish={onFinish} layout="vertical">
//         <Form.Item name="name" label="Nume" rules={[{ required: true }]}>
//           <Input placeholder="Introduceți numele dvs." />
//         </Form.Item>
//         <Form.Item
//           name="dates"
//           label="Interval concediu"
//           rules={[{ required: true, message: 'Selectați intervalul!' }]}
//         >
//           <DatePicker.RangePicker format="YYYY-MM-DD" />
//         </Form.Item>
//         <Button type="primary" htmlType="submit">
//           Trimite Cerere
//         </Button>
//       </Form>
//     </Modal>
//   );
// }
//
// export default LeaveRequestForm;
import React, { useEffect } from 'react';
import {
  Form, Input, DatePicker, Button, message, Modal,
} from 'antd';
import { useSubmitLeaveRequestMutation } from '../api/leaverequest';

function LeaveRequestForm({ visible, setVisible }) {
  const [form] = Form.useForm();
  const [submitLeaveRequest, {
    isLoading, isSuccess, isError, error,
  }] = useSubmitLeaveRequestMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success('Cererea de concediu a fost trimisă cu succes!');
      form.resetFields(); // Resetăm câmpurile formularului
      setVisible(false); // Închidem modalul
    }
    if (isError && error) {
      message.error(`Eroare la trimiterea cererii: ${error.message}`);
    }
  }, [isSuccess, isError, error]);

  const onFinish = async (values) => {
    try {
      const leaveRequestData = {
        name: values.name,
        startDate: values.dates[0].format('YYYY-MM-DD'),
        endDate: values.dates[1].format('YYYY-MM-DD'),
      };

      await submitLeaveRequest(leaveRequestData);

      if (isSuccess) {
        message.success('Cererea de concediu a fost trimisă cu succes!');
        form.resetFields();
        setVisible(false);
      }
    } catch (error) {
      message.error(`Eroare la trimiterea cererii: ${error.message}`);
    }
  };

  const handleCancel = () => setVisible(false);

  return (
    <Modal
      title="Cerere de Concediu"
      visible={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input placeholder="Introduceți numele dvs." />
        </Form.Item>
        <Form.Item
          name="dates"
          label="Interval"
          rules={[{ required: true, message: 'Selectați intervalul!' }]}
        >
          <DatePicker.RangePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Send
        </Button>
      </Form>
    </Modal>
  );
}

export default LeaveRequestForm;
