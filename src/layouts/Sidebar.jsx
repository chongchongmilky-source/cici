import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

const nav = [
  { to: '/', label: 'Tổng quan', icon: '⬡', exact: true },
  { to: '/tasks', label: 'Công việc', icon: '◈', color: '#5b73ff' },
  { to: '/bugs', label: 'Bug tracker', icon: '◉', color: '#ff6b6b' },
  { to: '/learn', label: 'Ôn luyện', icon: '◆', color: '#43d9ad' },
]

const css = `
.sb {
  width: var(--sidebar-w);
  min-width: var(--sidebar-w);
  background: var(--bg2);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 20px 12px;
  gap: 2px;
  height: 100%;
  position: relative;
}
.sb-logo {
  padding: 6px 10px 20px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.sb-logo-tag {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--accent);
  letter-spacing: 2px;
  text-transform: uppercase;
}
.sb-logo-name {
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.3px;
}
.sb-divider {
  height: 1px;
  background: var(--border);
  margin: 8px 0 12px;
}
.sb-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: var(--radius-sm);
  color: var(--text2);
  font-size: 13.5px;
  font-weight: 500;
  transition: all var(--transition);
  text-decoration: none;
  position: relative;
}
.sb-link:hover { background: var(--bg3); color: var(--text); }
.sb-link.active { background: var(--bg3); color: var(--text); }
.sb-link.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px; bottom: 4px;
  width: 2px;
  border-radius: 2px;
  background: var(--link-color, var(--accent));
}
.sb-icon {
  width: 20px;
  text-align: center;
  font-size: 14px;
  color: var(--link-color, var(--text3));
}
.sb-link.active .sb-icon { color: var(--link-color, var(--accent)); }
.sb-bottom { margin-top: auto; }
.sb-settings {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: var(--radius-sm);
  color: var(--text3);
  font-size: 13px;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  transition: all var(--transition);
  text-decoration: none;
}
.sb-settings:hover { background: var(--bg3); color: var(--text2); }
.sb-user {
  margin-top: 8px;
  padding: 8px 10px;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text3);
  border-top: 1px solid var(--border);
  word-break: break-all;
  line-height: 1.4;
}

/* Nút đóng - chỉ hiện trên mobile */
.sb-close-mobile {
  display: none;
  position: absolute;
  top: 16px;
  right: 16px;
  background: var(--bg3);
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--text2);
  width: 32px;
  height: 32px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
}
.sb-close-mobile:hover {
  background: var(--border);
  color: var(--text);
}

@media (max-width: 768px) {
  .sb-close-mobile {
    display: flex;
  }
  .sb-logo {
    padding-right: 40px;
  }
}
`

export default function Sidebar({ onClose }) {
  const { user, signOut } = useAuth()

  const handleClose = () => {
    if (onClose) onClose()
  }

  const handleNavClick = () => {
    // Tự động đóng menu sau khi chuyển trang (trên mobile)
    if (window.innerWidth <= 768 && onClose) {
      onClose()
    }
  }

  return (
    <>
      <style>{css}</style>
      <aside className="sb">
        {/* Nút đóng cho mobile */}
        <button className="sb-close-mobile" onClick={handleClose}>
          ✕
        </button>
        
        <div className="sb-logo">
          <span className="sb-logo-tag">QLCV</span>
          <span className="sb-logo-name">Workspace</span>
        </div>
        <div className="sb-divider" />
        
        {nav.map(n => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.exact}
            className={({ isActive }) => 'sb-link' + (isActive ? ' active' : '')}
            style={{ '--link-color': n.color }}
            onClick={handleNavClick}
          >
            <span className="sb-icon">{n.icon}</span>
            {n.label}
          </NavLink>
        ))}
        
        <div className="sb-bottom">
          <NavLink 
            to="/settings" 
            className={({ isActive }) => 'sb-settings' + (isActive ? ' active' : '')}
            onClick={handleNavClick}
          >
            <span style={{ fontSize: 14 }}>⚙</span> Cài đặt
          </NavLink>
          <button 
            className="sb-settings" 
            onClick={() => {
              signOut()
              if (onClose) onClose()
            }}
          >
            <span style={{ fontSize: 14 }}>↩</span> Đăng xuất
          </button>
          <div className="sb-user">{user?.email}</div>
        </div>
      </aside>
    </>
  )
}
