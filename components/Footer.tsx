import Image from 'next/image'
import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

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
            <Link className="Footer-legalLink" href="#">
              Privacy Policy
            </Link>
            <Link className="Footer-legalLink" href="#">
              Terms &amp; Conditions
            </Link>
            <Link className="Footer-legalLink" href="#">
              Contact Us
            </Link>
          </nav>
        </div>

        <div className="Footer-separator" aria-hidden="true" />

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
    </footer>
  )
}
