import Image from "next/image";

interface SectionTitleProps {
  children: string;
  className?: string; // 额外样式
  icon?: {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
  };
}

export function SectionTitle({ children, className = "", icon }: SectionTitleProps) {
  if (icon) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <Image
          src={icon.src}
          alt={icon.alt || ""}
          width={icon.width || 40}
          height={icon.height || 40}
        />
        <h2 className="font-semibold text-[#1D1E1F] leading-normal uppercase text-[34px] lg:text-[clamp(24px,1.771vw,34px)] m-0">
          {children}
        </h2>
      </div>
    );
  }

  return (
    <h2
      className={`font-semibold text-[#1D1E1F] text-center leading-normal uppercase text-[34px] lg:text-[clamp(24px,1.771vw,34px)] mt-10 lg:mt-[min(3.125vw,60px)] mb-[30px] lg:mb-[min(2.083vw,40px)] ${className}`}
    >
      {children}
    </h2>
  );
}