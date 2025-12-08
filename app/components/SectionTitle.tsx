interface SectionTitleProps {
  children: string;
  className?: string; // extra styles
}

export function SectionTitle({ children, className = "" }: SectionTitleProps) {
  return (
    <h2 className={`section-title-text section-title-title-margin ${className}`}>
      {children}
    </h2>
  );
}