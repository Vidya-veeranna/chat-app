import React from 'react';
import TimeAgo from 'timeago-react';
import { useHover, useMediaQuery } from '../../../misc/custom-hook';
import { auth } from '../../../misc/Firebase';
import PresenceDot from '../../PresenceDot';
import ProfileAvatar from '../../ProfileAvatar';
import IconBtnControl from './IconBtnControl';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';

const MessageItem = ({ message, handleLike, handleDelete }) => {
  const { author, createdAt, text, likes, likeCount } = message;
  const isMobile = useMediaQuery('(max-width: 992px)');
  const canShowIcons = isMobile;
  // || isHovered;

  const { selfRef, isHovered } = useHover();

  const isLike = likes && Object.keys(likes).includes(auth.currentUser.uid);
  return (
    <li
      className={`padded mb-1 cursor-pointer ${isHovered ? 'bg-black-02' : ''}`}
      ref={selfRef}
    >
      <div className="d-flex align-items-center font-bolder mb-1">
        <PresenceDot uid={author.uid} />
        <ProfileAvatar
          src={author.avatar}
          name={author.name}
          className="ml-1"
          size="xs"
        />
        <ProfileInfoBtnModal
          profile={author}
          appearance="link"
          className="p-0 ml-1 text-black"
        />
        <TimeAgo
          datetime={createdAt}
          className="font-normal text-black-45 ml-2"
        />
        <IconBtnControl
          {...IconBtnControl(isLike ? { color: 'red' } : {})}
          isvisible={canShowIcons}
          iconName="heart"
          tooltip="Like this message"
          onClick={() => handleLike(message.id)}
          badgeContent={likeCount}
        />
        {isAuthor && (
          <IconBtnControl
            isvisible={canShowIcons}
            iconName="close"
            tooltip="Delete this message"
            onClick={() => handleDelete(message.id)}
          />
        )}
      </div>
      <div>
        <span className="word-breal-all">{text}</span>
      </div>
    </li>
  );
};

export default MessageItem;
