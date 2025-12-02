import Image from "next/image";

interface SectionTitleProps {
  children: string;
  className?: string; // extra styles
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
      <div className={`flex items-center justify-center gap-4 section-title-title-margin-icon ${className}`}>
        <Image
          src={icon.src}
          alt={icon.alt || ""}
          width={icon.width || 40}
          height={icon.height || 40}
        />
        <h2 className="section-title-text" style={{ marginTop: 0, marginBottom: 0 }}>
          {children}
        </h2>
      </div>
    );
  }

  return (
    <h2 className={`section-title-text section-title-title-margin ${className}`}>
      {children}
    </h2>
  );
}