import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router';
import { Alert } from 'rsuite';
import { auth, database } from '../../../misc/Firebase';
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

  const handleLike = useCallback(async msgId => {
    const { uid } = auth.currentUser;
    const messageRef = database.ref(`/messages/${msgId}`);

    let alertMsg;

    await messageRef.transaction(msg => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          msg.likeCount -= 1;
          msg.likes[uid] = null;
          alertMsg = 'Like removed';
        } else {
          msg.likeCount += 1;
          if (!msg.likes) {
            msg.likes = {};
          }
          msg.likes[uid] = true;
          alertMsg = 'Like added';
        }
      }

      return msg;
    });
    Alert.info(alertMsg, 4000);
  }, []);

  const handleDelete = useCallback(
    async msgId => {
      // eslint-disable-next-line no-alert
      if (!window.confirm('Delete this message?')) {
        return;
      }
      const isLast = message[message.length - 1].id === msgId;
      const updates = {};
      updates[`/messages/${msgId}`] = null;
      if (isLast && message.length > 1) {
        updates[`/rooms/${chatId}/lastMessage`] = {
          ...message[message.length - 2],
          msgIdd: message[message.length - 2].id,
        };
      }
      if (isLast && message.length === 1) {
        updates[`/rooms/${chatId}/lastMessage`] = null;
      }
      try {
        await database.ref().update(updates);
        Alert.info('Message has been deleted');
      } catch (error) {
        Alert.info(error.message);
      }
    },
    [chatId, message]
  );
  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <li>No messages let</li>}
      {canShowMessages &&
        message.map(msg => (
          <MessageItem
            key={msg.id}
            message={msg}
            handleLike={handleLike}
            handleDelete={handleDelete}
          />
        ))}
    </ul>
  );
};

export default Message;
