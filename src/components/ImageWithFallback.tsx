import Image from "next/image";

type ImageWithFallbackProps = {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  fallbackSrc?: string;
};

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  width,
  height,
  fallbackSrc = "/noimage.png", // デフォルトのフォールバック画像を設定
}) => {
  return (
    <>
      {src ? (
        <Image src={src} alt={alt} width={width} height={height} />
      ) : (
        <Image src={fallbackSrc} alt={alt} width={width} height={height} />
      )}
    </>
  );
};

export default ImageWithFallback;
