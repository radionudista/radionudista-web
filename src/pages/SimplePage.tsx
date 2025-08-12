import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet-async';

interface SimplePageProps {
  title: string;
  markdown: string;
  meta?: Record<string, any>;
}

const SimplePage: React.FC<SimplePageProps> = ({ title, markdown, meta }) => {
  return (
    <div className="container mx-auto px-6 py-12">
      <Helmet>
        <title>{title}</title>
        {meta?.description && <meta name="description" content={meta.description} />}
        {/* Add more SEO tags as needed */}
      </Helmet>
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          <div className="glass-card">
            <h3 className="text-2xl font-bold text-white mb-6">{title}</h3>
            <div className="prose prose-invert max-w-none text-gray-200 text-justify">
              <ReactMarkdown >{markdown}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplePage;
