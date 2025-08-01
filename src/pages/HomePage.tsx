import React from 'react';
import RadioPlayerSection from '../components/RadioPlayerSection';

const HomePage = () => {
  return (
    <div
      className="flex items-center justify-center px-6"
      style={{
        minHeight: 'calc(100vh - 160px)', // Account for top nav + bottom space
        paddingTop: '80px', // Top nav height
        paddingBottom: '80px' // Equal bottom spacing
      }}
    >
      <div className="w-full max-w-2xl">
        {/* Radio Player Section - Equal spacing from top and bottom bars */}
        <RadioPlayerSection
          showTitle={false}
        />
      </div>
    </div>
  );
};

export default HomePage;
