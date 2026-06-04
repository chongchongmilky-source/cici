import Sidebar from './Sidebar.jsx'

const styles = `
.layout { display: flex; height: 100vh; overflow: hidden; }
.layout-main { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
.layout-content { flex: 1; padding: 28px 32px; max-width: 1200px; width: 100%; }

@media (max-width: 768px) {
  .layout-content { padding: 16px; }
}
`

export default function RootLayout({ children }) {
  return (
    <>
      <style>{styles}</style>
      <div className="layout">
        <Sidebar />
        <main className="layout-main">
          <div className="layout-content">
            {children}
          </div>
        </main>
      </div>
    </>
  )
}
