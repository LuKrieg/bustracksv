import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UserMenu from './UserMenu';

const Header = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-bg-primary mx-8">
      <div className="w-full px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/logo_full.png" 
              alt="BusTrackSV" 
              className="h-16 w-auto"
            />
          </Link>

          {/* Navigation Links - Centered */}
          <nav className="hidden md:flex items-center gap-16 absolute left-1/2 transform -translate-x-1/2">
            {user ? (
              // Authenticated user navigation
              <>
                <Link
                  to="/dashboard"
                  className={`text-lg font-medium transition-colors duration-200 ${
                    isActive('/dashboard')
                      ? 'text-accent-blue'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/map"
                  className={`text-lg font-medium transition-colors duration-200 ${
                    isActive('/map')
                      ? 'text-accent-blue'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Mapa
                </Link>
              </>
            ) : (
              // Public navigation
              <>
                <Link
                  to="/"
                  className={`text-lg font-medium transition-colors duration-200 ${
                    isActive('/')
                      ? 'text-accent-light-blue'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Explora
                </Link>
                <Link
                  to="/features"
                  className={`text-lg font-medium transition-colors duration-200 ${
                    isActive('/features')
                      ? 'text-accent-light-blue'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Características
                </Link>
                <Link
                  to="/about"
                  className={`text-lg font-medium transition-colors duration-200 ${
                    isActive('/about')
                      ? 'text-accent-light-blue'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Quienes somos
                </Link>
              </>
            )}
          </nav>

          {/* User Actions - Right aligned */}
          <div className="flex items-center gap-8">
            {user ? (
              // Authenticated user actions
              <UserMenu />
            ) : (
              // Public user actions
              <>
                <Link
                  to="/login"
                  className="text-lg text-text-secondary hover:text-text-primary transition-colors duration-200"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-accent-blue text-text-primary px-8 py-2 rounded-lg text-lg font-medium hover:bg-accent-light-blue transition-colors duration-200"
                >
                  Empezar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
