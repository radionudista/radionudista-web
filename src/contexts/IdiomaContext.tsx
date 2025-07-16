
import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

type IdiomaContextType = string

interface IdiomaProviderType {
    lang:IdiomaContextType
    setLang:(data:IdiomaContextType)=>void;
}

const IdiomaContext = createContext<IdiomaProviderType | undefined>(undefined);

export const IdiomaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [lang, setLang] = useState<IdiomaContextType>('es');

    return (
        <IdiomaContext.Provider value={{ lang, setLang }}>
        {children}
        </IdiomaContext.Provider>
    );

};

export const useIdioma = () => {
  const context = useContext(IdiomaContext);
  if (!context) {
    throw new Error('useIdioma debe usarse dentro de un IdiomaProvider  ');
  }
  return context;
};
