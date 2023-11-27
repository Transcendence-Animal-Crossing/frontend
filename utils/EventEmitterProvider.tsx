import React, { createContext, ReactNode, useContext } from 'react';
import { EventEmitter } from 'events';

interface EventEmitterContextType {
  emitter: EventEmitter;
}

const EventEmitterContext = createContext<EventEmitterContextType>({ emitter: new EventEmitter() });

interface EventEmitterProviderProps {
  children: ReactNode;
}

const EventEmitterProvider: React.FC<EventEmitterProviderProps> = ({ children }) => {
  const emitterInstance = new EventEmitter();

  return (
    <EventEmitterContext.Provider value={{ emitter: emitterInstance }}>
      {children}
    </EventEmitterContext.Provider>
  );
};

const useEventEmitter = () => {
  const context = useContext(EventEmitterContext);
  if (!context) {
    throw new Error('useEventEmitter must be used within an EventEmitterProvider');
  }
  return context.emitter;
};

export { EventEmitterProvider, useEventEmitter };
