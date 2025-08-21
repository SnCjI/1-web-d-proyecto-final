import { Link, useLocation } from 'react-router-dom'

const Header = () => {
  const location = useLocation()
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/" className="logo">
          🎬 Movie Explorer
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/" className={isActive('/')}>
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/search" className={isActive('/search')}>
              Buscar
            </Link>
          </li>
          <li>
            <Link to="/favorites" className={isActive('/favorites')}>
              Favoritos
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header