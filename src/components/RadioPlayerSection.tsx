import React from 'react';
import RadioPlayer from './RadioPlayer';

interface RadioPlayerSectionProps {
  className?: string;
  showTitle?: boolean;
  title?: string;
  description?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * RadioPlayerSection Component
 * 
 * Follows Single Responsibility Principle:
 * - Only responsible for rendering the radio player section with optional title and description
 * 
 * Follows Open/Closed Principle:
 * - Open for extension through props
 * - Closed for modification of core functionality
 * 
 * Follows DRY Principle:
 * - Reusable component that can be used anywhere in the application
 * - Encapsulates the radio player with consistent styling
 */
const RadioPlayerSection: React.FC<RadioPlayerSectionProps> = ({
  className = '',
  showTitle = true,
  title = 'Live Radio Stream',
  description = 'Listen to the best music selection 24/7',
  size = 'large'
}) => {
  return (
    <section className={`${className}`}>
      {showTitle && (
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      )}
      
      <RadioPlayer 
        className="mb-8" 
        showTitle={false} 
        size={size} 
      />
    </section>
  );
};

export default RadioPlayerSection;
