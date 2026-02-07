'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './Button'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'See Our Food', href: '/see-our-food' },
  { label: 'Catering', href: '/catering' },
  { label: 'Our Locations', href: '/locations' },
  { label: 'Hotlob News', href: '/hotlob-news' }
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="Header-root">
      <div className="Header-inner">
        <Link className="Header-logoLink" href="/">
          <Image
            src="/images/logo/logo-lg.png"
            alt="Hotlob logo"
            width={170}
            height={140}
            className="Header-logo"
          />
        </Link>

        <nav className="Header-nav" aria-label="Primary">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`Header-navLink${isActive ? ' Header-navLink--active' : ''}`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="Header-actions">
          <div className="Header-socialIcons">
            <a
              className="Header-socialLink"
              href="https://www.facebook.com/hotlob/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Hotlob on Facebook"
            >
              <Image
                src="/images/icons/fb.svg"
                alt="Facebook"
                width={24}
                height={24}
              />
            </a>
            <a
              className="Header-socialLink"
              href="https://www.instagram.com/hotlobaustralia/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Hotlob on Instagram"
            >
              <Image
                src="/images/icons/ins.svg"
                alt="Instagram"
                width={24}
                height={24}
              />
            </a>
          </div>
          <Button className="Header-ctaButton">Order Online</Button>
        </div>
      </div>
    </header>
  )
}
