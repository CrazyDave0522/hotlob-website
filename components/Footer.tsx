"use client";

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { fetchStores } from '@/lib/store'
import { tryGetQuickLocation } from '@/utils/geolocation'
import { calculateDistance } from '@/utils/distance'
import type { StoreWithDistance } from '@/utils/dishOrdering'
import { StoreSelectionModal } from './StoreSelectionModal'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [stores, setStores] = useState<StoreWithDistance[]>([])

  useEffect(() => {
    const loadStores = async () => {
      try {
        const fetchedStores = await fetchStores()
        const userLocation = await tryGetQuickLocation({ timeoutMs: 2000 })

        const storesWithDistance: StoreWithDistance[] = fetchedStores.map(store => {
          let distance: number | undefined

          if (userLocation && store.latitude && store.longitude) {
            distance = calculateDistance(
              userLocation.lat,
              userLocation.lon,
              store.latitude,
              store.longitude
            )
          }

          return {
            ...store,
            distance
          }
        })

        setStores(storesWithDistance)
      } catch (error) {
        console.error('Failed to load stores:', error)
        setStores([])
      }
    }

    loadStores()
  }, [])

  return (
    <footer className="Footer-root">
      <div className="Footer-inner">
        <div className="Footer-top">
          <Link className="Footer-logoLink" href="/">
            <Image
              src="/images/logo/logo-lg.png"
              alt="Hotlob logo"
              width={170}
              height={140}
              className="Footer-logo"
            />
          </Link>
          <nav className="Footer-legal" aria-label="Footer">
            <Link className="Footer-legalLink" href="/privacy-policy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </Link>
            <Link className="Footer-legalLink" href="/terms-and-conditions" target="_blank" rel="noopener noreferrer">
              Terms &amp; Conditions
            </Link>
            <Link
              className="Footer-legalLink"
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setIsModalOpen(true)
              }}
            >
              Contact Us
            </Link>
          </nav>
        </div>

        <div className="Footer-bottom">
          <span className="Footer-copyright">
            ©{currentYear} by Ocean Food Group Pty Ltd. All Rights Reserved.
          </span>
          <div className="Footer-socialIcons">
            <a
              className="Footer-socialLink"
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
              className="Footer-socialLink"
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
        </div>
      </div>
      <StoreSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStoreSelect={(store) => {
          window.location.href = `mailto:${store.email}`
          setIsModalOpen(false)
        }}
        stores={stores}
      />
    </footer>
  )
}
