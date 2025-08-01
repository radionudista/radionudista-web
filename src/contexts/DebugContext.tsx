import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface DebugInfo {
  [key: string]: any;
}

interface DebugContextType {
  debugInfo: DebugInfo;
  setDebugInfo: (componentName: string, data: any) => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export const useDebug = () => {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
};

interface DebugProviderProps {
  children: ReactNode;
}

export const DebugProvider: React.FC<DebugProviderProps> = ({ children }) => {
  const [debugInfo, setDebugInfoState] = useState<DebugInfo>({});

  const setDebugInfo = useCallback((componentName: string, data: any) => {
    setDebugInfoState(prev => ({
      ...prev,
      [componentName]: data,
    }));
  }, []);

  return (
    <DebugContext.Provider value={{ debugInfo, setDebugInfo }}>
      {children}
    </DebugContext.Provider>
  );
};
