'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Button } from './Button'
import StoreSelectionModal from './StoreSelectionModal'
import { fetchStores } from '@/lib/store'
import type { Store } from '@/types/store'
import { tryGetQuickLocation } from '@/utils/geolocation'
import { findClosestStore } from '@/utils/distance'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'See Our Food', href: '/see-our-food' },
  { label: 'Catering', href: '/catering' },
  { label: 'Our Locations', href: '/locations' },
  { label: 'Hotlob News', href: '/hotlob-news' }
]

export function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false)
  const [stores, setStores] = useState<Store[]>([])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  // Scroll lock when overlay is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  // Fetch stores on mount
  useEffect(() => {
    let mounted = true
    fetchStores().then((data) => {
      if (!mounted) return
      setStores(data || [])
    })
    return () => { mounted = false }
  }, [])

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isMenuOpen])

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

        {/* Desktop Navigation */}
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

        {/* Desktop Actions */}
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
          <Button className="Header-ctaButton" onClick={async () => {
            try {
              const loc = await tryGetQuickLocation({ timeoutMs: 2000 })
              if (loc && stores.length > 0) {
                const closest = findClosestStore(loc, stores)
                if (closest) {
                  window.open(closest.uber_url, '_blank')
                  return
                }
              }
              } catch {
                // ignore and fallback to modal
              }
            setIsStoreModalOpen(true)
          }}>Order Online</Button>
        </div>

        {/* Mobile Hamburger Icon */}
        <button
          className="Header-hamburger"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          role="button"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div
          className="Header-overlay"
          onClick={closeMenu}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <nav className="Header-overlayNav" onClick={(e) => e.stopPropagation()}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`Header-overlayNavLink${isActive ? ' Header-overlayNavLink--active' : ''}`}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}

      <StoreSelectionModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
        onStoreSelect={(store: Store) => {
          window.open(store.uber_url, '_blank')
          setIsStoreModalOpen(false)
        }}
        stores={stores}
      />
    </header>
  )
}
