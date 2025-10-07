import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const UserMenu = () => {
  const { user, logout } = useAuth();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex items-center space-x-3 hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors duration-200">
          <div className="w-10 h-10 bg-accent-blue rounded-full flex items-center justify-center">
            <span className="text-text-primary text-lg font-medium">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-lg text-text-secondary">
            Hola, {user?.name}
          </span>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-gray-700 text-text-primary' : 'text-text-secondary'
                  } group flex w-full items-center px-4 py-2 text-sm transition-colors duration-200`}
                >
                  Mi Perfil
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={logout}
                  className={`${
                    active ? 'bg-gray-700 text-text-primary' : 'text-text-secondary'
                  } group flex w-full items-center px-4 py-2 text-sm transition-colors duration-200`}
                >
                  Cerrar Sesión
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default UserMenu;
