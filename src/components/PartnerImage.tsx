"use client";
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface PartnerImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
}

export default function PartnerImage({ src, alt, className, fill, sizes, style }: PartnerImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (imageError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className || ''}`} style={style}>
        <div className="text-center p-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-gray-500 text-2xl">🏢</span>
          </div>
          <p className="text-sm text-gray-500">{alt}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className={`absolute inset-0 flex items-center justify-center bg-gray-50 ${className || ''}`}>
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
          </motion.div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        className={className}
        style={style}
        onError={handleError}
        onLoad={handleLoad}
        priority={false}
      />
    </>
  );
}
