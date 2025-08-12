import React from 'react';

/**
 * SimplePage Component
 *
 * Displays information about RadioNudista including:
 * - Company story and mission
 * - Services offered to listeners and artists
 * - Team information
 *
 * Follows glass morphism design pattern with proper content structure
 */
const SimplePage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">


        <div className="space-y-8">
          <div className="glass-card">
              some body content
          </div>


        </div>
      </div>
    </div>
  );
};

export default SimplePage;
