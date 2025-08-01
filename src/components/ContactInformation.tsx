import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { CONTACT_INFORMATION } from '../constants/contactInfo';

interface ContactInformationProps {
  className?: string;
}

/**
 * ContactInformation Component
 *
 * Follows Single Responsibility Principle:
 * - Only responsible for displaying contact information
 *
 * Follows Open/Closed Principle:
 * - Open for extension through props
 * - Closed for modification of core display functionality
 */
const ContactInformation: React.FC<ContactInformationProps> = ({
  className = ''
}) => {
  return (
    <Card className={`glass-card !bg-transparent backdrop-blur-[15px] !border-white/15 ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start space-x-4">
          <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-white font-semibold">Address</h4>
            <p className="text-gray-300 text-sm">
              {CONTACT_INFORMATION.address}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <Phone className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-white font-semibold">Phone</h4>
            <p className="text-gray-300 text-sm">
              {CONTACT_INFORMATION.phone}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <Mail className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-white font-semibold">Email</h4>
            <p className="text-gray-300 text-sm">
              {CONTACT_INFORMATION.email}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <Clock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-white font-semibold">Business Hours</h4>
            <p className="text-gray-300 text-sm">
              {CONTACT_INFORMATION.hours}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInformation;
