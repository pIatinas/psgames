
import React from 'react';
import { cn } from '@/lib/utils';

interface ImagePlaceholderProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  children?: React.ReactNode;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ 
  src, 
  alt, 
  className, 
  fallbackSrc = `https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=400&fit=crop`,
  children
}) => {
  const [imgSrc, setImgSrc] = React.useState(src || fallbackSrc);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setImgSrc(src || fallbackSrc);
    setHasError(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      <img 
        src={imgSrc}
        alt={alt}
        className="w-full h-full object-cover"
        onError={handleError}
      />
      {children}
    </div>
  );
};

export default ImagePlaceholder;
