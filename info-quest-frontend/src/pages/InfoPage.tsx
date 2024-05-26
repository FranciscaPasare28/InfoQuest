import { useSelector } from 'react-redux';
import NavigoBar from '../components/NavigoBar';
import { selectMessages } from '../store/message';
import Info from '../components/Info';

export default function InfoPage() {
  const messages = useSelector(selectMessages);

  return (
    <div>
      <NavigoBar />
      <Info messages={messages} />
    </div>
  );
}
