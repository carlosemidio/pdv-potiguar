import React from 'react';

type ImageProps = {
  src?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
};

const Image: React.FC<ImageProps> = ({ src, alt = '', width, height, className }) => (
  <>
    {src ? (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    ) : (
      <div className={`flex items-center justify-center bg-gray-400 dark:bg-gray-800 rounded-md ${className}`}>
        <p className='text-center text-white-800 dark:text-gray-400'>Sem imagem</p>
      </div>
    )}
  </>
);

export default Image;
