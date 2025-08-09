import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FooterSocialLinkProps {
  url: string;
  ariaLabel: string;
  icon?: LucideIcon;
  svgPath?: string;
  className?: string;
}

/**
 * FooterSocialLink Component - Reusable social media link component
 * Single Responsibility: Renders a single social media link with icon
 * Open/Closed: Extensible through props without modification
 * Interface Segregation: Clean props interface for different icon types
 */
const FooterSocialLink: React.FC<FooterSocialLinkProps> = ({
  url,
  ariaLabel,
  icon: Icon,
  svgPath,
  className = "social-icon"
}) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
    >
      {Icon ? (
        <Icon className="w-6 h-6" />
      ) : svgPath ? (
        <svg
          className="w-6 h-6"
          viewBox="0 0 80 97.8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={svgPath}
            fill="rgba(255, 255, 255, 0.7)"
          />
        </svg>
      ) : null}
    </a>
  );
};

export default FooterSocialLink;
