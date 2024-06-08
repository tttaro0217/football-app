import Image from "next/image";

type ImageWithFallbackProps = {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  fallbackSrc?: string;
  className?: string;
};

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  width,
  height,
  fallbackSrc = "/noimage.png",
  className,
}) => {
  return (
    <>
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
        />
      ) : (
        <Image
          src={fallbackSrc}
          alt={alt}
          width={width}
          height={height}
          className={className}
        />
      )}
    </>
  );
};

export default ImageWithFallback;
