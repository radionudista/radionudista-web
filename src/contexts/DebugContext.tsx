import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';

interface DebugInfo {
  [key: string]: any;
}

interface DebugContextType {
  debugInfo: DebugInfo;
  setDebugInfo: (componentName: string, data: any) => void;
  clearDebugInfo: (componentName?: string) => void;
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

  const clearDebugInfo = useCallback((componentName?: string) => {
    if (!componentName) {
      setDebugInfoState({});
      return;
    }
    setDebugInfoState(prev => {
      const next = { ...prev };
      delete next[componentName];
      return next;
    });
  }, []);

  const contextValue = useMemo(
    () => ({ debugInfo, setDebugInfo, clearDebugInfo }),
    [debugInfo, setDebugInfo, clearDebugInfo]
  );

  return (
    <DebugContext.Provider value={contextValue}>{children}</DebugContext.Provider>
  );
};
