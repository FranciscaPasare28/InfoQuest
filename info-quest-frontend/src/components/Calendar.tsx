import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useFetchUserPermissionsQuery, useFetchVacationsQuery } from '../api/users';
import { selectUser } from '../store/user';
import { useLazyFetchUserProfileQuery } from '../api/auth';
import './Calendar.css';
import {
  useCreateMeetingMutation,
  useGetMeetingsByDayMutation,
  useGetAllMeetingsQuery,
  useUpdateMeetingMutation,
} from '../api/meetings';
import MeetingCard from './MeetingCard';

function CalendarMonth({ monthName, days }) {
  const weekDays = ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du'];
  return (
    <div className="month">
      <h3>{monthName}</h3>
      <div className="weekDays">
        {weekDays.map((day) => (
          <div key={day} className="weekDay">{day}</div>
        ))}
      </div>
      <div className="daysGrid">
        {days.map((day, index) => (
          <div
            key={index}
            className={`day ${day.isWeekend ? 'weekend' : ''} ${day.isVacation ? 'vacation' : ''} ${day.isHoliday ? 'holiday' : ''} ${day.hasMeeting ? 'meeting-day' : ''}`}
            onClick={() => (day.onClick ? day.onClick() : null)}
          >
            {day.date}
          </div>
        ))}
      </div>
    </div>
  );
}

function Modal({
  show, onClose, children, currentDay, canManageMeetings, refreshMeetings,
}) {
  if (!show) {
    return null;
  }

  const placeholderMeeting = {
    name: 'placeholder',
    id: 0,
    startHour: 'placeholder',
    endHour: 'placeholder',
    meetingDay: 'placeholder',
    meetingPermissionId: 0,
  };

  const [getMeetingsByDay] = useGetMeetingsByDayMutation();
  const [meetings, setMeetings] = useState([]);
  const [isEditing, setIsEditing] = useState(0);
  const [meetingToUpdate, setMeetingToUpdate] = useState(placeholderMeeting);

  useEffect(() => {
    const getMeetings = async () => {
      const response = await getMeetingsByDay(currentDay).unwrap();
      setMeetings(response);
    };

    if (show) {
      getMeetings();
    }
  }, [show, currentDay, getMeetingsByDay]);

  const handleDeleteMeeting = (meetingId) => {
    setMeetings((currentMeetings) => currentMeetings.filter((meeting) => meeting.id !== meetingId));
  };

  const [createMeeting] = useCreateMeetingMutation();
  const [updateMeeting] = useUpdateMeetingMutation();

  const [meetingName, setMeetingName] = useState('');
  const [meetingStartHour, setMeetingStartHour] = useState('');
  const [meetingEndHour, setMeetingEndHour] = useState('');
  const [permission, setPermission] = useState('fe');

  const callbackMeetingCards = (id, meeting) => {
    setIsEditing(id);
    setMeetingToUpdate(meeting);
  };

  useEffect(() => {
    if (isEditing) {
      setMeetingName(meetingToUpdate.name);
      setMeetingStartHour(meetingToUpdate.startHour);
      setMeetingEndHour(meetingToUpdate.endHour);
      setPermission(meetingToUpdate.meetingPermissionId); // Asigurați-vă că această valoare este corect mapată
    } else {
      // Resetare formular pentru creare întâlnire nouă
      setMeetingName('');
      setMeetingStartHour('');
      setMeetingEndHour('');
      setPermission('fe'); // sau orice altă valoare default
    }
  }, [isEditing, meetingToUpdate]);

  const handleMeetingForm = async function () {
    if (!canManageMeetings) {
      alert('Nu aveți permisiunile necesare pentru a modifica întâlnirile.');
      return;
    }
    const getMeetingPermission = () => {
      switch (permission) {
        case 'fe':
          return 7;
        case 'be':
          return 8;
        case 'pm':
          return 9;
        default:
          return null;
      }
    };

    const meetingDetails = {
      name: meetingName,
      startHour: meetingStartHour,
      endHour: meetingEndHour,
      meetingDay: currentDay,
      meetingPermissionId: getMeetingPermission(),
    };

    if (!isEditing) {
      const newMeeting = await createMeeting(meetingDetails).unwrap();
      setMeetings([...meetings, newMeeting]);
    } else {
      const updatedMeeting = await updateMeeting({ id: isEditing, ...meetingDetails }).unwrap();
      setMeetings(meetings.map((meeting) => (meeting.id === isEditing ? updatedMeeting : meeting)));
      setIsEditing(0);
      setMeetingToUpdate(placeholderMeeting);
    }

    refreshMeetings();
  };

  return (
    <div className="modal-wrapper" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditing ? 'Editează întâlnirea' : 'Creează o întâlnire nouă'}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="modal-grid">
            <div className="meeting-form">
              <div className="form-group">
                <label>Numele întâlnirii:</label>
                <input
                  type="text"
                  placeholder="Nume întâlnire..."
                  value={meetingName}
                  onChange={(event) => { setMeetingName(event.target.value); }}
                />
              </div>
              <div className="form-group">
                <label>Ora de începere:</label>
                <input
                  type="time"
                  value={meetingStartHour}
                  onChange={(event) => { setMeetingStartHour(event.target.value); }}
                />
              </div>
              <div className="form-group">
                <label>Ora de sfârșit:</label>
                <input
                  type="time"
                  value={meetingEndHour}
                  onChange={(event) => { setMeetingEndHour(event.target.value); }}
                />
              </div>
              <div className="form-group">
                <label>Persoane notificate:</label>
                <select value={permission} onChange={(event) => { setPermission(event.target.value); }}>
                  <option value="fe">Teacher</option>
                  <option value="be">Student</option>
                  <option value="pm">Secretary</option>
                </select>
              </div>
              <button className="action-btn" onClick={handleMeetingForm}>Trimite</button>
            </div>
            <div className="meeting-list">
              <h4>Întâlniri existente</h4>
              {meetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  callbackMeetingCards={(id, meeting) => {
                    setIsEditing(id);
                    setMeetingToUpdate(meeting);
                  }}
                  onDelete={handleDeleteMeeting}
                />
              ))}
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function ErrorModal({ isOpen, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}

function Calendar() {
  const { data: usersVacationData, isLoading, error } = useFetchVacationsQuery();
  const holidays = [
    { date: '2024-01-01', name: 'Anul Nou' },
    { date: '2024-01-02', name: 'Anul Nou' },
    { date: '2024-01-06', name: 'Boboteaza' },
    { date: '2024-01-07', name: 'Sfantul Ioan Botezatorul' },
    { date: '2024-01-24', name: 'Ziua Unirii Principatelor Române' },
    { date: '2024-05-01', name: 'Ziua Muncii' },
    { date: '2024-05-03', name: 'Vinerea Mare' },
    { date: '2024-05-05', name: 'Pastele' },
    { date: '2024-05-06', name: 'Pastele' },
    { date: '2024-06-01', name: 'Ziua Copilului' },
    { date: '2024-06-23', name: 'Rusalii' },
    { date: '2024-06-24', name: 'Rusalii' },
    { date: '2024-08-15', name: 'Adormirea Maicii Domnului' },
    { date: '2024-11-30', name: 'Sfantul Andrei' },
    { date: '2024-12-01', name: 'Ziua Națională a României' },
    { date: '2024-12-25', name: 'Craciunul' },
    { date: '2024-12-26', name: 'Craciunul' },
  ];
  const [fetchProfile, { data: profile }] = useLazyFetchUserProfileQuery();
  const user = useSelector(selectUser);
  const [currentDay, setCurrentDay] = useState('');
  const { data: permissions } = useFetchUserPermissionsQuery(user.id);
  const [meetingDays, setMeetingDays] = useState({});

  useEffect(() => {
    if (user) {
      fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  const hasPermission8 = permissions?.some((permission) => permission.id === 8);

  const currentUser = useSelector(selectUser);
  const [calendarData, setCalendarData] = useState([]);
  const [vacationMapping, setVacationMapping] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { data: meetingsData, refetch: refetchMeetings } = useGetAllMeetingsQuery(); // Fetch all meetings

  const generateCalendar = useCallback((year, vacationDays, meetings) => {
    const calendar = [];
    const dayNames = ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du'];

    const meetingsMap = meetings?.reduce((acc, meeting) => {
      const date = meeting.meetingDay.split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(meeting);
      return acc;
    }, {});

    for (let month = 0; month < 12; month++) {
      const days = [];
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      let firstDayOfMonth = new Date(year, month, 1).getDay();
      firstDayOfMonth = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

      for (let i = 0; i < firstDayOfMonth; i++) {
        days.push({
          date: '', dayName: '', isWeekend: false, isVacation: false,
        });
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const currentDay = new Date(year, month, day);
        const dayOfWeek = currentDay.getDay();
        const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const isVacation = vacationMapping.hasOwnProperty(dateString);
        const isHoliday = holidays.some((holiday) => holiday.date === dateString);
        const holidayName = isHoliday ? holidays.find((holiday) => holiday.date === dateString).name : '';
        const hasMeeting = !!meetingsMap?.[dateString];

        days.push({
          date: day.toString(),
          dayName: dayNames[(dayOfWeek + 6) % 7],
          isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
          isVacation,
          dateString,
          isHoliday,
          holidayName,
          hasMeeting,
        });
      }
      calendar.push({
        monthName: new Date(year, month).toLocaleString('ro-RO', { month: 'long' }),
        days,
      });
    }

    return calendar;
  }, [vacationMapping, holidays]);

  useEffect(() => {
    if (usersVacationData && meetingsData) {
      const mapping = {};

      if (currentUser.role === 1 || currentUser.role === 2) {
        usersVacationData.forEach((user) => {
          user.vacationDays?.forEach((day) => {
            if (!mapping[day]) {
              mapping[day] = [];
            }
            mapping[day].push(user.name);
          });
        });
      } else if (profile?.email) {
        const currentUserVacations = usersVacationData?.find((vacationUser) => vacationUser.email === profile.email);
        currentUserVacations?.vacationDays?.forEach((day) => {
          if (!mapping[day]) {
            mapping[day] = [currentUserVacations.name];
          } else if (!mapping[day].includes(currentUserVacations.name)) {
            mapping[day].push(currentUserVacations.name);
          }
        });
      }

      setVacationMapping(mapping);

      const year = new Date().getFullYear();
      const calendar = generateCalendar(year, Object.keys(mapping), meetingsData);
      setCalendarData(calendar);
    }
  }, [usersVacationData, meetingsData, currentUser, profile, generateCalendar]);

  const handleDayClick = (dateString, holidayName) => {
    if (holidayName) {
      setErrorMessage(`Sărbătoare: ${holidayName}`);
      setShowErrorModal(true);
    } else if (hasPermission8 && !(user.role == 2)) {
      setErrorMessage('Nu aveți permisiunile necesare pentru a adăuga întâlniri.');
      setShowErrorModal(true);
    } else {
      setCurrentDay(dateString);
      if (vacationMapping[dateString]) {
        setModalContent(`Utilizatorii în concediu: ${vacationMapping[dateString].join(', ')}`);
      } else {
        setModalContent(null);
      }
      setShowModal(true);
    }
  };

  if (isLoading) return <div>Se încarcă...</div>;
  if (error) {
    return (
      <div>
        Eroare la încărcare:
        {error.toString()}
      </div>
    );
  }

  return (
    <div className="container">
      <h3>Calendar 2024</h3>
      <div className="calendar">
        {calendarData.map((month, index) => (
          <CalendarMonth
            key={index}
            monthName={month.monthName}
            days={month.days.map((day) => ({
              ...day,
              isVacation: vacationMapping[day.dateString],
              onClick: () => handleDayClick(day.dateString, day.holidayName),
            }))}
          />
        ))}
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          currentDay={currentDay}
          canManageMeetings={!hasPermission8}
          refreshMeetings={refetchMeetings}
        >
          <p>{modalContent}</p>
        </Modal>
        <ErrorModal
          isOpen={showErrorModal}
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      </div>
    </div>
  );
}

export default Calendar;
