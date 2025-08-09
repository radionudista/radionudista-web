import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import SocialMediaLinks from './ui/SocialMediaLinks';

interface FollowUsProps {
  className?: string;
}

/**
 * FollowUs Component
 *
 * Follows Single Responsibility Principle:
 * - Only responsible for displaying social media follow section
 *
 * Follows Open/Closed Principle:
 * - Open for extension through props
 * - Closed for modification of core functionality
 *
 * Follows DRY Principle:
 * - Reuses existing SocialMediaLinks component
 */
const FollowUs: React.FC<FollowUsProps> = ({
  className = ''
}) => {
  return (
    <Card className={`glass-card !bg-transparent backdrop-blur-[15px] !border-white/15 ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">
          Follow Us
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 text-sm mb-6">
          Stay connected with us on social media for the latest updates, music, and behind-the-scenes content.
        </p>
        <SocialMediaLinks />
      </CardContent>
    </Card>
  );
};

export default FollowUs;
