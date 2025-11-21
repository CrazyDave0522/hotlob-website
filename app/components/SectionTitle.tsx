interface SectionTitleProps {
  children: string;
  className?: string; // 额外样式
}

export function SectionTitle({ children, className = "" }: SectionTitleProps) {
  return (
    <h2
      className={`font-semibold text-[#1D1E1F] text-center leading-normal uppercase text-[34px] lg:text-[clamp(24px,1.771vw,34px)] mt-10 lg:mt-[min(3.125vw,60px)] mb-[30px] lg:mb-[min(2.083vw,40px)] ${className}`}
    >
      {children}
    </h2>
  );
}