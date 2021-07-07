import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { database } from '../../../misc/Firebase';
import { transformToArrayId } from '../../../misc/Helper';
import MessageItem from './MessageItem';

const Message = () => {
  const { chatId } = useParams();
  const [message, setMessage] = useState(null);

  const isChatEmpty = message && message.length === 0;
  const canShowMessages = message && message.length > 0;
  useEffect(() => {
    const messageRef = database.ref('/messages');

    messageRef
      .orderByChild('roomId')
      .equalTo(chatId)
      .on('value', snap => {
        const data = transformToArrayId(snap.val());
        setMessage(data);
      });
    return () => {
      messageRef.off('value');
    };
  }, [chatId]);
  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <li>No messages let</li>}
      {canShowMessages &&
        message.map(msg => <MessageItem key={msg.id} message={msg} />)}
    </ul>
  );
};

export default Message;
