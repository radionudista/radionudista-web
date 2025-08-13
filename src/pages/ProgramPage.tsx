

import React, { useMemo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import contentIndex from '../contentIndex.json';
import { env } from '../config/env';
import { useLocation } from 'react-router-dom';

const ProgramPage = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  // Determine current language from path (e.g., /es/slug)
  const supportedLangs = env.SUPPORTED_LANGUAGES;
  const getCurrentLang = (pathname: string, supportedLangs: string[]): string => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length > 0 && supportedLangs.includes(parts[0])) return parts[0];
    return supportedLangs[0]; // fallback
  };
  const currentLang = getCurrentLang(location.pathname, supportedLangs);

  // Build showList dynamically from contentIndex.json
  const showList = useMemo(() => {
    // Flatten all content entries for currentLang
    const shows = Object.values(contentIndex)
      .map(entry => entry[currentLang])
      .filter(Boolean)
      .filter(entry => entry.component === 'ProgramPage' && (entry.public === true || entry.public === 'true'));
    // Sort by program_order (required for ProgramPage)
    return shows.sort((a, b) => (a.program_order ?? 9999) - (b.program_order ?? 9999));
  }, [currentLang]);

  return (
    <div className='container mx-auto px-6 py-12'>
      <div className=" max-w-4xl mx-auto">
        <div className="flex flex-col">

          {/*<div className="glass-card">
            <h3 className="text-2xl font-bold text-white mb-8">Send us a Message</h3>
            <FormButton type="submit" fullWidth>
                Send Message
              </FormButton>
          </div>*/}

          {showList.map((show, index) => (
            <div key={`show_${index}`} className="glass-card mb-8" >
              <div className="flex sm:flex-row flex-col mb-[0.5rem]">
                <div className="show-name flex-[1_1_0] sm:mb-[0] mb-[1rem] text-white">
                  <h3 className="text-2xl font-bold text-white mb-4">{show.title}</h3>
                  <p className="text-white mb-[2rem] text-justify">{show.description}</p>
                  <p className='mb-3'> <b>conducido por:</b> {
                    Array.isArray(show.talent) && show.talent.map((t, i) => (
                      show.talent.length === i + 1 ? <span key={`talent_${i}`}>{t} ({show.social?.[i]}) </span> : <><span key={`talent_${i}`}>{t} ({show.social?.[i]})</span><span> - </span></>
                    ))
                  }</p>
                  <p className="text-white">{show.schedule}</p>
                </div>
                <div className="show-time flex-[1_1_0] flex flex-col items-center justify-center sm:mb-[0] mb-[1rem] text-white">
                  <img 
                    src={`/images/logos/${show.logo}`}
                    style={{width: isMobile ? '100%' : '200px'}}
                  />
                </div>
              </div>
            </div>
          ))}
          
        </div>
      </div>
    </div>
  );
};

export default ProgramPage;
