import React from 'react';

interface SectionTitleProps {
  text: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ text }) => {
  return <h2 className="section-title">{text}</h2>;
};
