
import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, className }) => {
  return (
    <div className={`mb-6 text-left ${className || ''}`}>
      <h2 className="text-2xl md:text-3xl font-bold mb-2 text-pink-500">{title}</h2>
      {subtitle && <p className="text-sm md:text-base text-muted-foreground">{subtitle}</p>}
    </div>
  );
};

export default SectionTitle;
