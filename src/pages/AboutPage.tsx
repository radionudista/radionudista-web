import React from 'react';

/**
 * AboutPage Component
 *
 * Displays information about RadioNudista including:
 * - Company story and mission
 * - Services offered to listeners and artists
 * - Team information
 *
 * Follows glass morphism design pattern with proper content structure
 */
const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About RadioNudista
          </h1>
        </div>

        <div className="space-y-8">
          <div className="glass-card">
            <h3 className="text-2xl font-bold text-white mb-6">Our Story</h3>
            <p className="text-gray-200 leading-relaxed">
              RadioNudista was born from a passion for music and the desire to create a platform
              where artists and listeners could connect without boundaries. We believe in the power
              of music to unite people across cultures and continents.
            </p>
          </div>

          <div className="glass-card">
            <h3 className="text-2xl font-bold text-white mb-6">Our Mission</h3>
            <p className="text-gray-200 leading-relaxed">
              To provide a platform for emerging and established artists to showcase their talent
              while delivering an exceptional listening experience to our global audience. We're
              committed to promoting diversity in music and supporting independent artists.
            </p>
          </div>

          <div className="glass-card">
            <h3 className="text-2xl font-bold text-white mb-6">What We Offer</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-blue-300 mb-3">For Listeners</h4>
                <ul className="text-gray-200 space-y-1">
                  <li>• 24/7 live streaming</li>
                  <li>• Diverse music genres</li>
                  <li>• High-quality audio</li>
                  <li>• Interactive community</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-blue-300 mb-3">For Artists</h4>
                <ul className="text-gray-200 space-y-1">
                  <li>• Showcase platform</li>
                  <li>• Global audience reach</li>
                  <li>• Promotional opportunities</li>
                  <li>• Community support</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <h3 className="text-2xl font-bold text-white mb-6">Join Our Community</h3>
            <p className="text-gray-200 leading-relaxed">
              Whether you're a music lover looking for your next favorite song or an artist
              ready to share your talent with the world, RadioNudista welcomes you to join
              our growing community of music enthusiasts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
