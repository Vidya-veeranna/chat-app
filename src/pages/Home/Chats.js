import React from 'react';
import { useParams } from 'react-router';
import { Loader } from 'rsuite';
import Bottom from '../../components/chat-window/bottom';
import Message from '../../components/chat-window/message';
import Top from '../../components/chat-window/top';
import { CurrentRoomProvider } from '../../context/current.room.context';
import { useRooms } from '../../context/rooms.context';

const Chats = () => {
  const { chatId } = useParams();
  const rooms = useRooms();
  if (!rooms) {
    return <Loader center vertical size="md" content="Loading" speed="slow" />;
  }

  const currentRoom = rooms.find(room => room.id === chatId);

  if (!currentRoom) {
    return <h6 className="text-center mt-page">Chat {chatId} not found</h6>;
  }

  const { name, description } = currentRoom;
  const currentRoomData = {
    name,
    description,
  };
  return (
    <CurrentRoomProvider data={currentRoomData}>
      <div className="chat-top">
        <Top />
      </div>
      <div className="chat-middle">
        <Message />
      </div>
      <div className="chat-bottom">
        <Bottom />
      </div>
    </CurrentRoomProvider>
  );
};

export default Chats;
