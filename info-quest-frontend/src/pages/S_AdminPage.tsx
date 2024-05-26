import NavigoBar from '../components/NavigoBar';
import UploadDocument from '../components/UploadDocument';
import DocumentList from '../components/DocumentList';

export default function S_AdminPage() {
  return (
    <div>
      <NavigoBar />
      <UploadDocument />
      <DocumentList />
    </div>
  );
}
