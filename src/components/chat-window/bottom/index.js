import React, { useCallback, useState } from 'react';
import { Alert, Icon, Input, InputGroup } from 'rsuite';
import firebase from 'firebase/app';
import { useParams } from 'react-router';
import { useProfile } from '../../../context/profile.context';
import { database } from '../../../misc/Firebase';

function assembleMessage(profile, chatId) {
  return {
    roomId: chatId,
    author: {
      name: profile.name,
      uid: profile.uid,
      createdAt: profile.createdAt,
      ...(profile.avatar ? { avatar: profile.avatar } : {}),
    },
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    likeCount: 0,
  };
}
const Bottom = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { chatId } = useParams();
  const { profile } = useProfile();

  const onInputChange = useCallback(value => {
    setInput(value);
  }, []);
  const onSendClick = async () => {
    if (input.trim() === '') {
      return;
    }
    const messageData = assembleMessage(profile, chatId);
    messageData.text = input;

    const updates = {};
    const messageId = database.ref('messages').push().key;
    updates[`/messages/${messageId}`] = messageData;
    updates[`/rooms/${chatId}/lastMessage`] = {
      ...messageData,
      msgId: messageId,
    };

    setIsLoading(true);
    try {
      await database.ref().update(updates);
      setInput('');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Alert.error(error.message);
    }
  };

  const onKeyDown = ev => {
    if (ev.keyCode === 13) {
      ev.preventDefault();
      onSendClick();
    }
  };
  return (
    <div>
      <InputGroup>
        <Input
          placeholder="write a new message here....."
          value={input}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
        />
        <InputGroup.Button
          color="blue"
          appearance="primary"
          onClick={onSendClick}
          disabled={isLoading}
        >
          <Icon icon="send" />
        </InputGroup.Button>
      </InputGroup>
    </div>
  );
};

export default Bottom;
