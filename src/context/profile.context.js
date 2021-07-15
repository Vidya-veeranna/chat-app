import React, { createContext, useContext, useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { auth, database } from '../misc/Firebase';

export const isOfflineForDatabase = {
  state: 'offline',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const isOnlineForDatabase = {
  state: 'online',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let userRef;
    let userStatusRef;
    const authunsub = auth.onAuthStateChanged(authobj => {
      if (authobj) {
        userStatusRef = database.ref(`/status/${authobj.uid}`);
        userRef = database.ref(`/profiles/${authobj.uid}`);

        userRef.on('value', snap => {
          const { name, createdAt, avatar } = snap.val();
          const data = {
            name,
            createdAt,
            avatar,
            uid: authobj.uid,
            email: authobj.email,
          };
          setProfile(data);
          setIsLoading(false);
        });
        database.ref('.info/connected').on('value', snapshot => {
          if (!!snapshot.val() === false) {
            return;
          }
          userStatusRef
            .onDisconnect()
            .set(isOfflineForDatabase)
            .then(() => {
              userStatusRef.set(isOnlineForDatabase);
            });
        });
      } else {
        if (userRef) {
          userRef.off();
        }
        database.ref('.info/connected').off();
        setProfile(null);
        setIsLoading(false);
      }
    });
    return () => {
      if (userRef) {
        userRef.off();
      }
      authunsub();

      database.ref('.info/connected').off();
    };
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  return useContext(ProfileContext);
};
