import * as React from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from 'react-i18next';
interface PatreonButtonProps {
  /**
   * Additional CSS classes for the button
   */
  className?: string;

  /**
   * Custom text to display alongside the Patreon icon
   */
  text?: string;

  /**
   * Custom Patreon URL (optional, defaults to the provided URL)
   */
  href?: string;

  /**
   * Custom positioning styles (optional)
   */
  style?: React.CSSProperties;

  /**
   * Whether to show the button in absolute positioning mode
   */
  absolute?: boolean;
}

/**
 * PatreonButton Component
 *
 * Single Responsibility: Renders a styled Patreon support button
 * Open/Closed: Extensible through props without modification
 * Interface Segregation: Clean props interface for customization
 * Dependency Inversion: Uses utility functions for styling
 *
 * Features:
 * - Customizable text content
 * - Configurable positioning
 * - Consistent glass styling
 * - Accessibility support
 * - TypeScript safety
 */
const PatreonButton = React.forwardRef<
  HTMLAnchorElement,
  PatreonButtonProps
>(({
  className,
  text = "apoyanos",
  href = "https://www.patreon.com/profile/creators?u=170209343",
  style,
  absolute = true,
  ...props
}, ref) => {
  const defaultStyle: React.CSSProperties = absolute ? {
    position: 'absolute',
    right: 0,
    margin: '0 3rem'
  } : {};
  const { t } = useTranslation();
  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "social-icon glass-card flex justify-center items-center",
        !absolute && "relative", // Add relative positioning when not absolute
        className
      )}
      style={{ ...defaultStyle, ...style }}
      aria-label={`Support us on Patreon - ${t(`navigation.${text}`)}`}
      {...props}
    >
      <div className="w-6 h-6 mr-3">
        <svg
          version="1.1"
          id="patreon-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1080 1080"
          width="100%"
          height="100%"
          xmlSpace="preserve"
          aria-hidden="true"
        >
          <path
            fill="rgba(255, 255, 255, 0.7)"
            d="M1033.05,324.45c-0.19-137.9-107.59-250.92-233.6-291.7
              c-156.48-50.64-362.86-43.3-512.28,27.2C106.07,145.41,49.18,332.61,47.06,519.31
              c-1.74,153.5,13.58,557.79,241.62,560.67c169.44,2.15,194.67-216.18,273.07-321.33
              c55.78-74.81,127.6-95.94,216.01-117.82C929.71,603.22,1033.27,483.3,1033.05,324.45z"
          />
        </svg>
      </div>
      <p>{t(`navigation.${text}`)}</p>
    </a>
  );
});

PatreonButton.displayName = "PatreonButton";

export { PatreonButton };
