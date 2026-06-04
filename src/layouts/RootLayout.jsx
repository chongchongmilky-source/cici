import { useState } from 'react'
import Sidebar from './Sidebar.jsx'

const styles = `
/* Layout chính */
.layout { display: flex; height: 100vh; overflow: hidden; }
.layout-main { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
.layout-content { flex: 1; padding: 28px 32px; max-width: 1200px; width: 100%; }

/* Header cho mobile */
.mobile-header {
  display: none;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg2, #1e1e2f);
  border-bottom: 1px solid var(--border, #2a2a3a);
  position: sticky;
  top: 0;
  z-index: 999;
}
.hamburger {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text, #e0e0e0);
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mobile-logo {
  font-weight: 700;
  font-size: 18px;
  font-family: var(--mono, monospace);
}
.mobile-logo small {
  font-size: 11px;
  color: var(--accent, #5b73ff);
  letter-spacing: 1px;
}

/* Overlay mờ khi mở menu */
.overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  z-index: 998;
}
.overlay.show { display: block; }

/* RESPONSIVE: Điện thoại */
@media (max-width: 768px) {
  .layout-content { padding: 16px; }
  
  /* Ẩn sidebar gốc, thay bằng bản di động */
  .desktop-sidebar {
    display: none;
  }
  
  /* Sidebar di động trượt từ trái */
  .mobile-sidebar {
    position: fixed;
    top: 0;
    left: -280px;
    width: 280px;
    height: 100%;
    z-index: 1000;
    transition: left 0.3s ease;
    overflow-y: auto;
  }
  .mobile-sidebar.open {
    left: 0;
  }
  
  /* Hiển thị header mobile */
  .mobile-header {
    display: flex;
  }
}

/* DESKTOP: ẩn các thành phần mobile */
@media (min-width: 769px) {
  .mobile-only {
    display: none !important;
  }
}
`

export default function RootLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <style>{styles}</style>
      
      {/* Header chỉ hiển thị trên mobile */}
      <div className="mobile-header mobile-only">
        <button className="hamburger" onClick={() => setMenuOpen(true)}>
          ☰
        </button>
        <div className="mobile-logo">
          QLCV <small>Workspace</small>
        </div>
      </div>

      {/* Lớp phủ tối */}
      <div 
        className={`overlay ${menuOpen ? 'show' : ''}`} 
        onClick={() => setMenuOpen(false)}
      />

      {/* Sidebar cho mobile (ẩn/hiện khi bấm hamburger) */}
      <div className={`mobile-sidebar ${menuOpen ? 'open' : ''}`}>
        <Sidebar onClose={() => setMenuOpen(false)} />
      </div>

      {/* Layout chính */}
      <div className="layout">
        {/* Sidebar cho desktop (giữ nguyên bản gốc) */}
        <div className="desktop-sidebar">
          <Sidebar />
        </div>
        
        {/* Nội dung chính */}
        <main className="layout-main">
          <div className="layout-content">
            {children}
          </div>
        </main>
      </div>
    </>
  )
}
