import { NavLink, Outlet } from 'react-router-dom';

export function AppShell() {
  return (
    <div style={styles.shell}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>🌳 家系図</div>
        <nav style={styles.nav}>
          <NavLink
            to="/people"
            style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}
          >
            👥 人物
          </NavLink>
          <NavLink
            to="/tree"
            style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}
          >
            🌿 家系図
          </NavLink>
        </nav>
      </aside>
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  shell: { display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif' },
  sidebar: {
    width: 200,
    background: '#1e293b',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    flexShrink: 0,
  },
  logo: {
    padding: '20px 16px',
    fontSize: 18,
    fontWeight: 700,
    borderBottom: '1px solid #334155',
  },
  nav: { display: 'flex', flexDirection: 'column', gap: 4, padding: '12px 8px' },
  link: {
    display: 'block',
    padding: '10px 12px',
    color: '#94a3b8',
    textDecoration: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
  },
  activeLink: {
    background: '#334155',
    color: 'white',
  },
  main: { flex: 1, overflow: 'hidden', background: '#f9fafb' },
};
