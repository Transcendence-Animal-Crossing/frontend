import React, { createContext, ReactNode, useContext, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

interface SocketContextType {
  socket: Socket | undefined;
}

const SocketContext = createContext<SocketContextType>({ socket: undefined });

interface SocketProviderProps {
  children: ReactNode;
}

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { data: session } = useSession();
  const [socket, setSocket] = React.useState<Socket | undefined>(undefined);

  useEffect(() => {
    if (!socket && session && session.accessToken) {
      const newSocket = io("ws://localhost:8080", {
        transports: ["websocket"],
        auth: {
          token: session.accessToken,
        },
      });

      setSocket(newSocket);
    }
  }, [session]);

  return (
    <SocketContext.Provider value={{ socket }}>
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
