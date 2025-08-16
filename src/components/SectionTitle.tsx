import React from 'react';
interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}
const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  className
}) => {
  const words = title.split(' ');
  const formattedTitle = <>
      {words[0] || ''} {words[1] ? <span className="font-bold">{words[1]}</span> : null}
      {words.slice(2).length ? ' ' + words.slice(2).join(' ') : ''}
    </>;
  return <div className={`text-left ${className || ''}`}>
      <h2 className="text-2xl font-light text-pink-600 md:text-3xl">{formattedTitle}</h2>
      
    </div>;
};
export default SectionTitle;