import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { database } from '../../../misc/Firebase';
import { transformToArrayId } from '../../../misc/Helper';

const Message = () => {
  const { chatId } = useParams();
  const [message, setMessage] = useState(null);

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
  return <div>{message}</div>;
};

export default Message;
