import React, { createContext, ReactNode, useContext, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

interface SocketContextType {
  chatSocket: Socket | undefined;
  queueSocket: Socket | undefined;
  gameSocket: Socket | undefined;
}

const SocketContext = createContext<SocketContextType>({
  chatSocket: undefined,
  queueSocket: undefined,
  gameSocket: undefined,
});

interface SocketProviderProps {
  children: ReactNode;
}

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { data: session } = useSession();
  const [chatSocket, setChatSocket] = React.useState<Socket | undefined>(undefined);
  const [queueSocket, setQueueSocket] = React.useState<Socket | undefined>(undefined);
  const [gameSocket, setGameSocket] = React.useState<Socket | undefined>(undefined);

  useEffect(() => {
    if (!chatSocket && session && session.accessToken) {
      const newChatSocket = io("ws://localhost:8080/chat", {
        transports: ["websocket"],
        auth: {
          token: session.accessToken,
        },
      });

      setChatSocket(newChatSocket);
    }

    if (!queueSocket && session && session.accessToken) {
      const newQueueSocket = io("ws://localhost:8080/queue", {
        transports: ["websocket"],
        auth: {
          token: session.accessToken,
        },
      });

      setQueueSocket(newQueueSocket);
    }

    if (!gameSocket && session && session.accessToken) {
      const newGameSocket = io("ws://localhost:8080/game", {
        transports: ["websocket"],
        auth: {
          token: session.accessToken,
        },
      });

      setGameSocket(newGameSocket);
    }
  }, [session]);

  return (
    <SocketContext.Provider value={{ chatSocket, queueSocket, gameSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export { SocketProvider, useSocket };
