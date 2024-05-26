import React, { useEffect } from 'react';
import {
  Form, Input, DatePicker, Button, message, Modal,
} from 'antd';
import { useSubmitCertificateMutation } from '../api/certificate';

function CertificateForm({ visible, setVisible }) {
  const [form] = Form.useForm();
  const [submitCertificate, {
    isLoading, isSuccess, isError, error,
  }] = useSubmitCertificateMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success('Adeverinta a fost trimisă cu succes!');
      form.resetFields(); // Resetăm câmpurile formularului
      setVisible(false); // Închidem modalul
    }
    if (isError && error) {
      message.error(`Eroare la trimiterea adeverintei: ${error.message}`);
    }
  }, [isSuccess, isError, error]);

  const onFinish = async (values) => {
    try {
      const certificateData = {
        name: values.name,
        startDate: values.date.format('YYYY-MM-DD'),
        purpose: values.purpose,
      };

      await submitCertificate(certificateData);

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
      title="Adeverinta"
      visible={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input placeholder="Introduceți numele dvs." />
        </Form.Item>

        <Form.Item
          name="date"
          label="Data emiterii"
          rules={[{ required: true, message: 'Selectați intervalul!' }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item name="purpose" label="Purpose" rules={[{ required: true }]}>
          <Input placeholder="Introduceți motivul" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Send
        </Button>
      </Form>
    </Modal>
  );
}

export default CertificateForm;
