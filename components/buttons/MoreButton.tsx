'use client';

import Link from 'next/link';

interface MoreButtonProps {
  href: string;
}

export function MoreButton({ href }: MoreButtonProps) {
  return (
    <Link href={href} className="more-button">
      <div className="more-button__circle">
        <div className="more-button__arrow" aria-hidden="true" />
      </div>
      <span className="more-button__label">More</span>
    </Link>
  );
}
