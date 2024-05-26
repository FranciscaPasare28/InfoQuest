export default function DayComponent({
  day, meetings, isLoading, isError,
}) {
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading meetings</div>;

  const hasMeetings = meetings && meetings.length > 0;
  const dayClasses = `day ${day.isWeekend ? 'weekend' : ''} ${day.isVacation ? 'vacation' : ''} ${hasMeetings ? 'meeting-day' : ''}`;

  return (
    <div className={dayClasses} onClick={() => console.log('Day clicked:', day.dateString)}>
      {day.date}
      {hasMeetings && (
        <ul>
          {meetings.map((meeting) => (
            <li key={meeting.id}>
              {meeting.name}
              {' '}
              at
              {' '}
              {meeting.startHour}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
