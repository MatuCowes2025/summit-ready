
import { NavLink } from 'react-router-dom'
import northFaceLogo from '../assets/north face logo.png'

function Header() {
  return (
    <header className="sr-header">
      <div className="header-brand">
        <h2>SUMMIT READY</h2>

        <div className="brand-divider" />

        <img
          src={northFaceLogo}
          alt="The North Face"
          className="north-face-logo"
        />
      </div>

      <nav aria-label="Navegación principal">
        <NavLink to="/" end>
          Inicio
        </NavLink>

        <NavLink to="/como-jugar">
          Cómo jugar
        </NavLink>

        <NavLink to="/mi-trayectoria">
          Mi trayectoria
        </NavLink>
      </nav>
    </header>
  )
}

export default Header
