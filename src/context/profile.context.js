import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, database } from '../misc/Firebase';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let userRef;
    const authunsub = auth.onAuthStateChanged(authobj => {
      if (authobj) {
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
      } else {
        if (userRef) {
          userRef.off();
        }
        setProfile(null);
        setIsLoading(false);
      }
    });
    return () => {
      if (userRef) {
        userRef.off();
      }
      authunsub();
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
