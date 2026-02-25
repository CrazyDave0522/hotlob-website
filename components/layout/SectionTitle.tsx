import React from 'react';

interface SectionTitleProps {
  text: string;
  subtitle?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ text, subtitle }) => {
  return (
    <div className="section-title-wrapper">
      <h2 className="section-title">{text}</h2>
      {subtitle ? <p className="section-title-subtitle">{subtitle}</p> : null}
    </div>
  );
};
