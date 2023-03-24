import React, { useState, useEffect, useContext } from "react";

const OnlineStatusContext = React.createContext(true);

export const OnlineStatusProvider: React.FC = ({ children }) => {
  const [onlineStatus, setOnlineStatus] = useState(window.navigator.onLine);

  useEffect(() => {
    window.addEventListener("online", () => {
      setOnlineStatus(window.navigator.onLine);
    });
    window.addEventListener("offline", () => {
      setOnlineStatus(window.navigator.onLine);
    });

    return () => {
      window.removeEventListener("online", () => {
        setOnlineStatus(window.navigator.onLine);
      });
      window.removeEventListener("offline", () => {
        setOnlineStatus(window.navigator.onLine);
      });
    };
  }, []);

  return (
    <OnlineStatusContext.Provider value={onlineStatus}>
      {children}
    </OnlineStatusContext.Provider>
  );
};

export const useOnlineStatus = () => {
  const store = useContext(OnlineStatusContext);
  return store;
};