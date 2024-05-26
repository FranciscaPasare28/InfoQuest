import { useDeleteMeetingMutation } from '../api/meetings';
import './MeetingCard.css'; // Assuming your CSS file is located here

export default function MeetingCard({ meeting, callbackMeetingCards, onDelete }) {
  const [deleteMeeting] = useDeleteMeetingMutation();

  const handleMeetingUpdate = () => {
    callbackMeetingCards(meeting.id, meeting);
  };

  const handleMeetingDelete = async () => {
    try {
      await deleteMeeting(meeting.id).unwrap();
      onDelete(meeting.id); // Notifică componenta părinte că întâlnirea a fost ștearsă
    } catch (error) {
      console.error('Failed to delete meeting:', error);
    }
  };

  return (
    <div className="meeting-card">
      <div className="card-content">
        <span>{meeting.name}</span>
        <br />
        {meeting.startHour}
        {' '}
        -
        {meeting.endHour}
      </div>
      <div className="options">
        <button className="edit-btn" onClick={handleMeetingUpdate}>Edit</button>
        <button className="delete-btn" onClick={handleMeetingDelete}>Delete</button>
      </div>
    </div>
  );
}
