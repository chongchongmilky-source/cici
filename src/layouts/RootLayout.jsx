import { useState } from 'react'
import Sidebar from './Sidebar.jsx'

const styles = `
.layout { display: flex; height: 100vh; overflow: hidden; }
.layout-main { flex: 1; overflow-y: auto; display: flex; flex-direction: column; min-width: 0; }
.layout-content { flex: 1; padding: 28px 32px; max-width: 100%; width: 100%; }

.mobile-header {
  display: none;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg2);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
  flex-shrink: 0;
}
.hamburger {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: var(--text);
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: background var(--transition);
}
.hamburger:hover { background: var(--bg3); }
.mobile-logo {
  font-weight: 800;
  font-size: 16px;
}
.mobile-logo-tag {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--accent);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-right: 6px;
}

.overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 200;
  backdrop-filter: blur(2px);
}
.overlay.show { display: block; }

.mobile-sidebar {
  display: none;
}

@media (max-width: 768px) {
  .layout-content { padding: 16px 14px; }

  .desktop-sidebar { display: none; }

  .mobile-header { display: flex; }

  .mobile-sidebar {
    display: block;
    position: fixed;
    top: 0;
    left: -290px;
    width: 260px;
    height: 100%;
    z-index: 300;
    transition: left 0.28s cubic-bezier(0.4,0,0.2,1);
    overflow-y: auto;
  }
  .mobile-sidebar.open { left: 0; }

  .layout { height: auto; overflow: visible; }
  .layout-main { height: calc(100dvh - 49px); overflow-y: auto; }
}

@media (min-width: 769px) {
  .mobile-only { display: none !important; }
  .mobile-sidebar { display: none !important; }
}
`

export default function RootLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <style>{styles}</style>

      <div className="overlay" style={menuOpen ? {display:'block'} : {}} onClick={() => setMenuOpen(false)} />

      <div className={`mobile-sidebar ${menuOpen ? 'open' : ''}`}>
        <Sidebar onClose={() => setMenuOpen(false)} />
      </div>

      <div className="layout">
        <div className="desktop-sidebar">
          <Sidebar />
        </div>

        <main className="layout-main">
          <div className="mobile-header mobile-only">
            <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Mở menu">
              ☰
            </button>
            <div className="mobile-logo">
              <span className="mobile-logo-tag">QLCV</span>Workspace
            </div>
          </div>
          <div className="layout-content">
            {children}
          </div>
        </main>
      </div>
    </>
  )
}
