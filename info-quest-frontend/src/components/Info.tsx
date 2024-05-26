import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { RightOutlined, DeleteOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import {
  Col, Form, Button, Input,
} from 'antd';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { FaHistory } from 'react-icons/fa';
import { Message } from '../types/Types';
import { addMessage, deleteMessages } from '../store/message';
import { selectUser } from '../store/user';
import { toggleVacationButton } from '../store/button';
import { useFetchAllDocumentsQuery } from '../api/documents';
import './Info.css';
import StickyNotesContainer from './StickyNotesContainer';

import {
  useGetNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from '../api/notes';

interface Props {
  messages: Message[];
}

interface JWTToken {
  sub: string;
  iat: number;
  exp: number;
}

export default function Info({ messages }: Props) {
  const messageEndRef = useRef<null | HTMLDivElement>(null);
  const { accessToken } = useSelector(selectUser).tokens;
  const [msg, setMsg] = useState('');
  const dispatch = useDispatch();
  const [showVacationButton, setShowVacationButton] = useState(false);

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    'ws://localhost:3000/messages',
  );
  const navigate = useNavigate();

  const {
    data: notes,
    isLoading: notesLoading,
    error: notesError,
  } = useGetNotesQuery();

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  const { data: documents } = useFetchAllDocumentsQuery({
    refetchOnMountOrArgChange: true,
  });

  const dataSource = documents?.map((doc) => ({ ...doc, key: doc.id }));
  let names = '';
  if (Array.isArray(dataSource) && dataSource.length > 0) {
    names = dataSource.map((element) => element.name);
  }

  const createMessage = (content: string, type: string) => {
    const id = uuidv4();
    const message: Message = { id, content, type };
    return message;
  };

  useEffect(() => {
    if (connectionStatus === 'Open' && messages.length === 0) {
      const message = createMessage(
        'Buna! Aici poti afla mai multe informatii despre proiectele si angajatii din cadrul companiei InfoQuest.',
        'received',
      );
      dispatch(addMessage(message));
    }
  }, [connectionStatus]);

  useEffect(() => {
    if (lastJsonMessage !== null && lastJsonMessage !== 'Vizualizează pagina Concedii') {
      const message = createMessage(lastJsonMessage.toString(), 'received');
      dispatch(addMessage(message));
    }
  }, [lastJsonMessage, dispatch]);

  useEffect(() => {
    if (lastJsonMessage && Array.isArray(lastJsonMessage)) {
      dispatch(deleteMessages()); // Presupunând că vrei să cureți mesajele existente

      lastJsonMessage.forEach((messageHistory) => {
        // Crează un mesaj pentru partea de întrebare și unul pentru răspuns, dacă este necesar
        const message = createMessage(messageHistory.message, 'sent', new Date(messageHistory.timestamp).toLocaleString());
        const response = createMessage(messageHistory.response, 'received', new Date(messageHistory.timestamp).toLocaleString());

        dispatch(addMessage(message));
        if (messageHistory.response) {
          dispatch(addMessage(response));
        }
      });

      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [lastJsonMessage, dispatch]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setMsg(event.target.value);
  }
  function requestHistory() {
    const token: JWTToken = jwtDecode(accessToken);
    sendJsonMessage({
      event: 'loadHistory',
      data: { userId: token.sub },
    });
  }

  function handleSubmit() {
    if (msg === '') {
      return;
    }
    if (connectionStatus !== 'Open') {
      return;
    }
    const message = createMessage(msg, 'sent');
    if (msg.toLowerCase().includes('concediu')) {
      if (names.includes('Concedii.pdf')) {
        const vacationMessage = createMessage('Vizualizează pagina Concedii', 'received');
        dispatch(addMessage(message));
        dispatch(addMessage(vacationMessage));
        dispatch(toggleVacationButton(true));
      } else {
        const vacationMessage = createMessage('Fisierul Concedii.pdf nu este incarcat', 'received');
        dispatch(addMessage(message));
        dispatch(addMessage(vacationMessage));
      }
    } else {
      const token: JWTToken = jwtDecode(accessToken);
      sendJsonMessage({
        event: 'messages',
        data: {
          message: msg,
          userId: token.sub,
        },
      });

      dispatch(addMessage(message));
    }
    setMsg('');
  }

  function handleRefresh() {
    dispatch(deleteMessages());
    dispatch(toggleVacationButton(false));
  }

  return (
    <div className="chat">
      <div className="chat-wrapper">
        <Col className="messages">
          {messages.map((message) => (
            <div className={`message-${message.type}`} key={message.id}>
              <p className="text">{message.content}</p>
            </div>
          ))}
          <div ref={messageEndRef} />
        </Col>
        <Form className="chat-footer">
          <Button onClick={() => handleRefresh()} className="refresh">
            <DeleteOutlined />
          </Button>

          <Input
            placeholder="Type in your message"
            value={msg}
            onChange={(event) => handleChange(event)}
            className="input-style"
          />
          <Button
            htmlType="submit"
            onClick={() => handleSubmit()}
            className="send"
          >
            <RightOutlined />
          </Button>
          <Button onClick={() => requestHistory()} className="request-history">
            <FaHistory />
          </Button>
        </Form>
      </div>
      <div className="sticky-notes-wrapper">
        <StickyNotesContainer />
      </div>
    </div>
  );
}
