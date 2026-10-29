import { Link } from 'react-router-dom'
import { useContent } from '../lib/useContent.js'
import SocialIcons from './SocialIcons.jsx'

export default function Footer() {
  const { contact } = useContent()
  return (
    <footer className="site-footer">
      <div className="wrap footer-top">
        <div>
          <div className="brand brand-light">
            <span className="monogram">DM</span>
            <span className="brand-name">
              Hon. Duncan
              <br />
              Maina Mathenge
            </span>
          </div>
          <p className="footer-blurb">Member of Parliament for Nyeri Town, 13th Parliament of Kenya.</p>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <Link to="/about">About</Link>
          <Link to="/parliament">Parliament</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/news">News</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <div className="footer-contact">
          <span>{contact.parliament}</span>
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          <SocialIcons links={contact.social} className="social-light" />
        </div>
      </div>
      <div className="footer-bar">
        <div className="wrap footer-bar-in">
          <span>© Hon. Duncan Maina Mathenge, MP for Nyeri Town</span>
          <span>Built by SpenceTec and Logistics Limited</span>
        </div>
      </div>
    </footer>
  )
}
