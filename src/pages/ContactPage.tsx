import React from 'react';
import ContactForm from '../components/ContactForm';
import ContactInformation from '../components/ContactInformation';
import FollowUs from '../components/FollowUs';
import { useTranslation } from '../hooks/useTranslation';

const ContactPage = () => {
  const { t } = useTranslation();

  const handleFormSubmit = async (formData: any) => {
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    // You can add API call or other submission logic here
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {t('contact.page-title')}
          </h1>
          <p className="text-xl text-gray-300">
            {t('contact.page-subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form Component */}
          <ContactForm onSubmit={handleFormSubmit} />

          {/* Contact Information and Follow Us Components */}
          <div className="space-y-8">
            <ContactInformation />
            <FollowUs />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
