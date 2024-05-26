// import { useState } from 'react';
// import {
//   Spin, UploadProps, Upload, Row, Col,
// } from 'antd';
// import { InboxOutlined } from '@ant-design/icons';
// import { useUploadDocumentMutation } from '../api/documents/index';
//
// const { Dragger } = Upload;
//
// interface Response {
//   data: {
//     statusCode: number;
//     message: string;
//     error: string;
//   };
//   status: string;
// }
//
// function UploadDocument() {
//   const [useCreate] = useUploadDocumentMutation();
//   const [loading, setIsLoading] = useState(false);
//   const [uploaded, setUploaded] = useState(0);
//   // 0 not uploaded, 1 uploaded successfully, 2 error
//   const [errorMessage, setErrorMessage] = useState('');
//
//   const handleSucces = () => {
//     setIsLoading(false);
//     setUploaded(1);
//   };
//
//   const handleError = (err: Response) => {
//     setErrorMessage(err.data.message);
//     setIsLoading(false);
//     setUploaded(2);
//   };
//
//   const handleTransform = async (file: File) => {
//     const formData = new FormData();
//     formData.append('file', file, file.name);
//
//     setIsLoading(true);
//     useCreate(formData)
//       .unwrap()
//       .then(() => handleSucces())
//       .catch((err) => handleError(err));
//   };
//
//   const props: UploadProps = {
//     name: 'file',
//     maxCount: 1,
//     accept: '.pdf',
//     showUploadList: false,
//     beforeUpload(file) {
//       setUploaded(0);
//       setIsLoading(true);
//       handleTransform(file);
//       return false;
//     },
//   };
//
//   return (
//     <Row style={{ paddingTop: '90px' }}>
//       <Col span={18} offset={3}>
//         {!loading ? (
//           <Dragger {...props} className="dragger">
//             <p className="ant-upload-drag-icon">
//               <InboxOutlined />
//             </p>
//             <p className="ant-upload-text">
//               Click or drag file to this area to upload
//             </p>
//             <p className="ant-upload-hint">
//               Support for a single upload. File must be of type pdf.
//             </p>
//           </Dragger>
//         ) : (
//           <div className="spin-div">
//             <Spin size="large" />
//           </div>
//         )}
//         {uploaded === 1 && (
//           <div className="message message-success">
//             <p>File has been uploaded successfully</p>
//           </div>
//         )}
//         {uploaded === 2 && (
//           <div className="message message-error">
//             <p>There was an error when uploading the file</p>
//             <p>{errorMessage}</p>
//           </div>
//         )}
//       </Col>
//     </Row>
//   );
// }
//
// export default UploadDocument;

import { useEffect, useState } from 'react';
import {
  Spin, UploadProps, Upload, Row, Col, Alert,
} from 'antd';
import { CloudUploadOutlined, InboxOutlined } from '@ant-design/icons';
import { useUploadDocumentMutation } from '../api/documents/index';

const { Dragger } = Upload;

interface UploadState {
  loading: boolean;
  uploaded: number; // 0: not uploaded, 1: uploaded successfully, 2: error
  errorMessage: string;
}

function UploadDocument() {
  const [useCreate] = useUploadDocumentMutation();
  const [state, setState] = useState<UploadState>({
    loading: false,
    uploaded: 0,
    errorMessage: '',
  });

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file, file.name);

    setState({ ...state, loading: true });

    try {
      await useCreate(formData).unwrap();
      setState({ ...state, loading: false, uploaded: 1 });
    } catch (err) {
      setState({
        ...state,
        loading: false,
        uploaded: 2,
        errorMessage: err.data.message,
      });
    }
  };
  useEffect(() => {
    if (state.uploaded === 1) {
      const timer = setTimeout(() => {
        setState((s) => ({ ...s, uploaded: 0 }));
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [state.uploaded]);

  const uploadProps = {
    name: 'file',
    maxCount: 1,
    accept: '.pdf',
    showUploadList: false,
    beforeUpload(file) {
      setState({ ...state, uploaded: 0 });
      handleUpload(file);
      return false;
    },
  };

  return (
    <Row style={{ paddingTop: '2px', paddingBottom: '2px' }}>
      <Col span={15} offset={5}>
        {!state.loading ? (
          <div>
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined
                  style={{ color: '#40a9ff', fontSize: '35px' }}
                />
              </p>
              <p className="ant-upload-text">Click to upload</p>
              <p className="ant-upload-hint">Only PDF.</p>
            </Dragger>
          </div>
        ) : (
          <div style={{ textAlign: 'center', paddingTop: '20px' }}>
            <Spin size="large" />
          </div>
        )}
        {state.uploaded === 1 && (
          <Alert
            message="Success"
            description="File has been uploaded successfully."
            type="success"
            showIcon
            style={{ marginTop: '20px' }}
          />
        )}
        {state.uploaded === 2 && (
          <Alert
            message="Error"
            description={`There was an error when uploading the file: ${state.errorMessage}`}
            type="error"
            showIcon
            style={{ marginTop: '20px' }}
          />
        )}
      </Col>
    </Row>
  );
}

export default UploadDocument;
