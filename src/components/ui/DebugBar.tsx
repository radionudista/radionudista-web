'use client';
import React, { useState } from 'react';
import { useDebug } from '../../contexts/DebugContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';
import { isDebugMode } from '@/config/env';

const DebugBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { debugInfo } = useDebug();

  if (!isDebugMode()) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-red-900/90 backdrop-blur-sm text-white transition-all duration-300 ease-in-out z-[9999]`}
      style={{ height: isOpen ? '200px' : '20px' }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-[20px] text-center text-xs font-bold uppercase tracking-wider"
      >
        Debug Bar
      </button>
      {isOpen && (
        <div className="p-2 overflow-y-auto h-[calc(200px-20px)] bg-black/80">
          <Accordion type="single" collapsible className="w-full">
            {Object.entries(debugInfo).map(([componentName, data]) => (
              <AccordionItem value={componentName} key={componentName} className="border-b-gray-700">
                <AccordionTrigger className="text-sm font-semibold text-yellow-400 hover:text-yellow-300">
                  {componentName}
                </AccordionTrigger>
                <AccordionContent className="bg-gray-900/50 p-2 rounded-md">
                  <pre className="text-xs whitespace-pre-wrap text-green-400">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default DebugBar;
