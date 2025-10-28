import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Header from '../../layout/Header';
import perfilService from '../../../services/perfilService';

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [cambiandoPassword, setCambiandoPassword] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  
  // Estados para edición de perfil
  const [formData, setFormData] = useState({
    nombre_completo: '',
    email: '',
    telefono: '',
  });
  
  // Estados para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    password_actual: '',
    password_nueva: '',
    password_confirmar: ''
  });
  
  // Estado para la imagen de perfil
  const [imagenPerfil, setImagenPerfil] = useState(null);
  const [previsualizacion, setPrevisualizacion] = useState(null);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    setLoading(true);
    const result = await perfilService.obtenerPerfil();
    if (result.success) {
      setPerfil(result.data);
      setFormData({
        nombre_completo: result.data.nombre_completo || '',
        email: result.data.email || '',
        telefono: result.data.telefono || '',
      });
      if (result.data.foto_perfil) {
        setPrevisualizacion(result.data.foto_perfil);
      }
    } else {
      mostrarMensaje('error', result.message);
    }
    setLoading(false);
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImagenChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        mostrarMensaje('error', 'La imagen no debe superar los 2MB');
        return;
      }
      
      // Validar tipo
      if (!file.type.startsWith('image/')) {
        mostrarMensaje('error', 'Solo se permiten archivos de imagen');
        return;
      }
      
      setImagenPerfil(file);
      
      // Crear previsualización
      const reader = new FileReader();
      reader.onloadend = () => {
        setPrevisualizacion(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const guardarCambios = async () => {
    setLoading(true);
    
    try {
      // Si hay una imagen nueva, convertirla a base64
      let datosActualizar = { ...formData };
      
      if (imagenPerfil) {
        const imagenBase64 = await perfilService.convertirImagenABase64(imagenPerfil);
        datosActualizar.foto_perfil = imagenBase64;
      }
      
      const result = await perfilService.actualizarPerfil(datosActualizar);
      
      if (result.success) {
        mostrarMensaje('success', 'Perfil actualizado exitosamente');
        setEditando(false);
        setImagenPerfil(null);
        await cargarPerfil();
        
        // Actualizar el contexto de autenticación con los nuevos datos
        updateUser({
          ...user,
          ...result.data.usuario
        });
        
        // Actualizar localStorage también
        localStorage.setItem('bustracksv:user', JSON.stringify({
          ...user,
          ...result.data.usuario
        }));
      } else {
        mostrarMensaje('error', result.message);
      }
    } catch (error) {
      mostrarMensaje('error', 'Error al guardar los cambios');
    }
    
    setLoading(false);
  };

  const cambiarPassword = async () => {
    // Validaciones
    if (!passwordData.password_actual || !passwordData.password_nueva || !passwordData.password_confirmar) {
      mostrarMensaje('error', 'Todos los campos son requeridos');
      return;
    }
    
    if (passwordData.password_nueva !== passwordData.password_confirmar) {
      mostrarMensaje('error', 'Las contraseñas nuevas no coinciden');
      return;
    }
    
    if (passwordData.password_nueva.length < 6) {
      mostrarMensaje('error', 'La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    
    const result = await perfilService.cambiarPassword(
      passwordData.password_actual,
      passwordData.password_nueva
    );
    
    if (result.success) {
      mostrarMensaje('success', 'Contraseña actualizada exitosamente');
      setCambiandoPassword(false);
      setPasswordData({
        password_actual: '',
        password_nueva: '',
        password_confirmar: ''
      });
    } else {
      mostrarMensaje('error', result.message);
    }
    
    setLoading(false);
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setImagenPerfil(null);
    if (perfil) {
      setFormData({
        nombre_completo: perfil.nombre_completo || '',
        email: perfil.email || '',
        telefono: perfil.telefono || '',
      });
      setPrevisualizacion(perfil.foto_perfil || null);
    }
  };

  if (loading && !perfil) {
    return (
      <div className="min-h-screen bg-[#0b0f1a]">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-white text-xl">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white">
      <Header />
      
      <main className="px-8 mt-10 pb-16 max-w-4xl mx-auto">
        {/* Título */}
        <h1 className="text-4xl sm:text-[44px] font-semibold">Mi Perfil</h1>
        <div className="mt-3 h-[10px] w-40 rounded-full bg-[#6aaee0]" />

        {/* Mensaje de éxito/error */}
        {mensaje.texto && (
          <div className={`mt-6 p-4 rounded-lg ${
            mensaje.tipo === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
          }`}>
            {mensaje.texto}
          </div>
        )}

        {/* Foto de perfil */}
        <div className="mt-8 flex flex-col items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-accent-blue flex items-center justify-center overflow-hidden border-4 border-[#1e263b]">
              {previsualizacion ? (
                <img 
                  src={previsualizacion} 
                  alt="Foto de perfil" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-5xl font-bold">
                  {user?.usuario?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            {editando && (
              <label className="absolute bottom-0 right-0 bg-[#6aaee0] hover:bg-[#5a9ed0] rounded-full p-2 cursor-pointer transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagenChange}
                  className="hidden"
                />
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>
            )}
          </div>
          
          <h2 className="mt-4 text-2xl font-semibold">{perfil?.usuario}</h2>
          <p className="text-gray-400">
            Miembro desde {perfil?.fecha_creacion ? new Date(perfil.fecha_creacion).toLocaleDateString() : 'N/A'}
          </p>
        </div>

        {/* Información del perfil */}
        <div className="mt-10 bg-[#1e263b]/90 rounded-xl p-8 border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold">Información Personal</h3>
            {!editando && (
              <button
                onClick={() => setEditando(true)}
                className="px-4 py-2 bg-[#6aaee0] hover:bg-[#5a9ed0] rounded-lg transition-colors"
              >
                Editar Perfil
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Nombre completo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre Completo
              </label>
              {editando ? (
                <input
                  type="text"
                  name="nombre_completo"
                  value={formData.nombre_completo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-[#0b0f1a] border border-gray-600 rounded-lg focus:outline-none focus:border-[#6aaee0] text-white"
                  placeholder="Ingresa tu nombre completo"
                />
              ) : (
                <p className="text-lg">{perfil?.nombre_completo || 'No especificado'}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Correo Electrónico
              </label>
              {editando ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-[#0b0f1a] border border-gray-600 rounded-lg focus:outline-none focus:border-[#6aaee0] text-white"
                  placeholder="correo@ejemplo.com"
                />
              ) : (
                <p className="text-lg">{perfil?.email || 'No especificado'}</p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Teléfono
              </label>
              {editando ? (
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-[#0b0f1a] border border-gray-600 rounded-lg focus:outline-none focus:border-[#6aaee0] text-white"
                  placeholder="0000-0000"
                />
              ) : (
                <p className="text-lg">{perfil?.telefono || 'No especificado'}</p>
              )}
            </div>

            {/* Usuario */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Usuario
              </label>
              <p className="text-lg text-gray-400">{perfil?.usuario} (No se puede cambiar)</p>
            </div>
          </div>

          {/* Botones de acción */}
          {editando && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={guardarCambios}
                disabled={loading}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button
                onClick={cancelarEdicion}
                disabled={loading}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* Sección de cambiar contraseña */}
        <div className="mt-6 bg-[#1e263b]/90 rounded-xl p-8 border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold">Seguridad</h3>
            {!cambiandoPassword && (
              <button
                onClick={() => setCambiandoPassword(true)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
              >
                Cambiar Contraseña
              </button>
            )}
          </div>

          {cambiandoPassword && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  name="password_actual"
                  value={passwordData.password_actual}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 bg-[#0b0f1a] border border-gray-600 rounded-lg focus:outline-none focus:border-[#6aaee0] text-white"
                  placeholder="Ingresa tu contraseña actual"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  name="password_nueva"
                  value={passwordData.password_nueva}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 bg-[#0b0f1a] border border-gray-600 rounded-lg focus:outline-none focus:border-[#6aaee0] text-white"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  name="password_confirmar"
                  value={passwordData.password_confirmar}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 bg-[#0b0f1a] border border-gray-600 rounded-lg focus:outline-none focus:border-[#6aaee0] text-white"
                  placeholder="Confirma tu nueva contraseña"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cambiarPassword}
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                </button>
                <button
                  onClick={() => {
                    setCambiandoPassword(false);
                    setPasswordData({
                      password_actual: '',
                      password_nueva: '',
                      password_confirmar: ''
                    });
                  }}
                  disabled={loading}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {!cambiandoPassword && (
            <p className="text-gray-400">
              Última actualización de contraseña: {perfil?.ultimo_acceso ? new Date(perfil.ultimo_acceso).toLocaleDateString() : 'N/A'}
            </p>
          )}
        </div>

        {/* Botón de cerrar sesión */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={logout}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-lg font-semibold"
          >
            Cerrar Sesión
          </button>
        </div>
      </main>
    </div>
  );
}

