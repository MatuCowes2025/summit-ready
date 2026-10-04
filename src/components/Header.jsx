import { Link } from 'react-router-dom'
import northFaceLogo from '../assets/north face logo.png'

function Header() {
  return (
    <header>
      <div className="header-brand">
  <h2>SUMMIT READY</h2>

  <div className="brand-divider"></div>

  <img
    src={northFaceLogo}
    alt="The North Face"
    className="north-face-logo"
  />
</div>

      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/como-jugar">Cómo jugar</Link>
        <Link to="/ranking">Ranking</Link>
      </nav>
    </header>
  );
}

export default Header;