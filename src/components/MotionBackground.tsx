import React from 'react';

export const MotionBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-black">
      {/* Subtle radial ambient atmosphere - strictly minimalist without floating objects or emojis */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.02)_0%,_transparent_70%)]" />
    </div>
  );
};
