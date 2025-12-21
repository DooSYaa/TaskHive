import React, { createContext, useContext, useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAuth } from './AuthContext';

const SignalRContext = createContext(null);

export const useSignalR = () => useContext(SignalRContext);

export const SignalRProvider = ({ children }) => {
  const [connection, setConnection] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.token) {
      setConnection(null);
      return;
    }
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5292/hubs/chat', {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    newConnection
      .start()
      .then(() => {
        console.log('SignalR connected!');
        setConnection(newConnection);
      })
      .catch(error => console.error('SignalR connection error: ', error));

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, [user?.token]);
  return (
    <SignalRContext.Provider value={{ connection }}>
      {children}
    </SignalRContext.Provider>
  );
};
