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
  return <div className={`mb-6 text-left ${className || ''}`}>
      <h2 className="text-2xl font-light mb-2 text-pink-600 md:text-3xl mt-5 lg:pt-5 ">{formattedTitle}</h2>
      {subtitle}
    </div>;
};
export default SectionTitle;