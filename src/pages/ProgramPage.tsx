

import React, { useMemo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import contentIndex from '../contentIndex.json';
import { env } from '../config/env';
import { useLocation } from 'react-router-dom';
import ProgramPlayer from '../components/ProgramPlayer';
import ReactMarkdown from 'react-markdown';

interface ShowData {
  id: string;
  title: string;
  description: string;
  audio_source?: string;
  schedule?: string;
  talent?: string[];
  social?: string[];
  logo?: string;
  program_order?: number;
}

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


  // Build showList dynamically from contentIndex.json (with audio_source from index)
  const showListRaw = useMemo(() => {
    const shows = Object.values(contentIndex)
      .map(entry => entry[currentLang])
      .filter(Boolean)
      .filter(entry => entry.component === 'ProgramPage' && (entry.public === true || entry.public === 'true'));
    return shows.sort((a, b) => (a.program_order ?? 9999) - (b.program_order ?? 9999));
  }, [currentLang]);

  // Process show list with content from contentIndex (loaded at build time)
  const showList = useMemo(() => {
    return showListRaw.map(show => ({
      ...show,
      description: (show as any).content || '', // Content from markdown body (loaded at build time)
      audio_source: (show as unknown).audio_source || ''
    }));
  }, [showListRaw]);

  return (
    <div className='container mx-auto px-6 py-12'>
      <div className=" max-w-4xl mx-auto">
        <div className="flex flex-col">

          {showList.map((show, index) => (
            <div key={show.id} className="glass-card mb-8" >
              <div className="flex sm:flex-row flex-col mb-[0.5rem]">
                <div className="show-name flex-[2_2_0] sm:mb-[0] mb-[1rem] text-white sm:pr-6">
                  <h3 className="text-3xl font-bold text-white mb-6">{show.title}</h3>

                  {/* Full Program Description */}
                  <div className="text-white mb-6 text-justify prose prose-invert max-w-none">
                    <ReactMarkdown>{show.description}</ReactMarkdown>
                  </div>

                  {/* Program Details */}
                  <div className="mb-6">
                    <p className='mb-3 text-white'>
                      <b>conducido por:</b> {
                        Array.isArray(show.talent) && show.talent.map((t, i) => (
                          show.talent.length === i + 1 ? <span key={`talent_${i}`}>{t} ({show.social?.[i]}) </span> : <><span key={`talent_${i}`}>{t} ({show.social?.[i]})</span><span> - </span></>
                        ))
                      }
                    </p>
                    <p className="text-white mb-4">
                      {show.schedule}
                    </p>
                  </div>

                  {/* Program Player */}
                  <div className="mt-6">
                    <ProgramPlayer
                      programId={show.id}
                      audioSource={show.audio_source || ''}
                      title={show.title}
                    />
                  </div>
                </div>
                <div className="show-time flex-[1_1_0] flex flex-col items-center justify-start sm:mb-[0] mb-[1rem] text-white">
                  <img
                    src={`/images/logos/${show.logo}`}
                    alt={`${show.title} logo`}
                    className="w-full max-w-sm rounded-lg shadow-lg"
                    style={{ width: isMobile ? '100%' : '300px' }}
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
