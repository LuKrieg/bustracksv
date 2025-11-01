import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Header from '../../layout/Header';
import perfilService from '../../../services/perfilService';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    usuario: '',
    nombre_completo: '',
    email: '',
    telefono: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Estados para cambio de contraseña
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    password_actual: '',
    password_nueva: '',
    password_confirmar: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    actual: false,
    nueva: false,
    confirmar: false,
  });

  // Estados para foto de perfil
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [previsualizacionFoto, setPrevisualizacionFoto] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const result = await perfilService.getPerfil();
      if (result.success) {
        setProfile(result.data);
        setFormData({
          usuario: result.data.usuario || '',
          nombre_completo: result.data.nombre_completo || '',
          email: result.data.email || '',
          telefono: result.data.telefono || '',
        });
        // Cargar foto de perfil si existe
        if (result.data.foto_perfil) {
          setFotoPerfil(result.data.foto_perfil);
          setPrevisualizacionFoto(result.data.foto_perfil);
        }
      } else {
        setMessage({ type: 'error', text: 'Error al cargar perfil' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al cargar perfil' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejar cambio de foto de perfil
  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Por favor selecciona una imagen válida' });
      return;
    }

    // Validar tamaño (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'La imagen no debe superar 2MB' });
      return;
    }

    try {
      setMessage({ type: '', text: '' });
      
      // Convertir a base64
      const base64 = await perfilService.convertirImagenABase64(file);
      setFotoPerfil(base64);
      setPrevisualizacionFoto(base64);
      
      // Guardar automáticamente la foto de perfil
      setLoading(true);
      const result = await perfilService.updatePerfil({ foto_perfil: base64 });
      
      if (result.success) {
        setMessage({ type: 'success', text: '¡Foto de perfil guardada exitosamente!' });
        
        // Actualizar foto de perfil guardada
        const updatedProfile = result.data.usuario;
        if (updatedProfile.foto_perfil) {
          setFotoPerfil(updatedProfile.foto_perfil);
          setPrevisualizacionFoto(updatedProfile.foto_perfil);
        }
        
        // Actualizar el usuario en el contexto para que se refleje en el header
        updateUser({
          ...user,
          foto_perfil: updatedProfile.foto_perfil,
        });
        
        // Actualizar profile local
        setProfile({
          ...profile,
          foto_perfil: updatedProfile.foto_perfil
        });
        
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Error al guardar foto de perfil' });
      }
    } catch (error) {
      console.error('Error al procesar imagen:', error);
      setMessage({ type: 'error', text: 'Error al procesar la imagen' });
    } finally {
      setLoading(false);
    }
  };

  // Eliminar foto de perfil
  const handleEliminarFoto = async () => {
    try {
      setMessage({ type: '', text: '' });
      setLoading(true);
      
      // Guardar automáticamente eliminando la foto
      const result = await perfilService.updatePerfil({ foto_perfil: null });
      
      if (result.success) {
        setMessage({ type: 'success', text: '¡Foto de perfil eliminada exitosamente!' });
        
        setFotoPerfil(null);
        setPrevisualizacionFoto(null);
        
        // Actualizar el usuario en el contexto
        updateUser({
          ...user,
          foto_perfil: null,
        });
        
        // Actualizar profile local
        setProfile({
          ...profile,
          foto_perfil: null
        });
        
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Error al eliminar foto de perfil' });
      }
    } catch (error) {
      console.error('Error al eliminar foto:', error);
      setMessage({ type: 'error', text: 'Error al eliminar la foto de perfil' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // NO incluir foto de perfil porque ya se guarda automáticamente
      const result = await perfilService.updatePerfil(formData);
      
      if (result.success) {
        setMessage({ type: 'success', text: '¡Perfil actualizado exitosamente!' });
        const updatedProfile = result.data.usuario;
        setProfile(updatedProfile);
        
        // Actualizar el usuario en el contexto para que se refleje en el header
        updateUser({
          ...user,
          usuario: updatedProfile.usuario,
          nombre_completo: updatedProfile.nombre_completo,
          email: updatedProfile.email,
        });
        
        setEditing(false);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Error al actualizar perfil' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al actualizar perfil' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Manejar cambios en los campos de contraseña
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Alternar visibilidad de contraseñas
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Cambiar contraseña
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validar que las contraseñas nuevas coincidan
    if (passwordData.password_nueva !== passwordData.password_confirmar) {
      setMessage({ type: 'error', text: 'Las contraseñas nuevas no coinciden' });
      return;
    }

    // Validar longitud mínima
    if (passwordData.password_nueva.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    setLoading(true);

    try {
      const result = await perfilService.cambiarPassword(
        passwordData.password_actual,
        passwordData.password_nueva
      );

      if (result.success) {
        setMessage({ type: 'success', text: '¡Contraseña cambiada exitosamente!' });
        setPasswordData({
          password_actual: '',
          password_nueva: '',
          password_confirmar: '',
        });
        setShowPasswordSection(false);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Error al cambiar contraseña' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al cambiar contraseña' });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_50%_100%,#1b2250_0%,#0b0f24_60%,#060816_100%)]">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md rounded-2xl shadow-xl p-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
              <p className="text-slate-400 mt-4">Cargando perfil...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_50%_100%,#1b2250_0%,#0b0f24_60%,#060816_100%)]">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md rounded-2xl shadow-xl p-8">
          <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Mi Perfil</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Cerrar Sesión
            </button>
          </div>

          {message.text && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.type === 'success' 
                ? 'bg-green-600/20 border border-green-500/30 text-green-300' 
                : 'bg-red-600/20 border border-red-500/30 text-red-300'
            }`}>
              {message.text}
            </div>
          )}

          {/* Sección de Foto de Perfil */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-sky-500 to-purple-500 flex items-center justify-center border-4 border-white/20 shadow-xl">
                {previsualizacionFoto ? (
                  <img 
                    src={previsualizacionFoto} 
                    alt="Foto de perfil" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl font-bold text-white">
                    {profile?.usuario?.charAt(0).toUpperCase() || '?'}
                  </span>
                )}
              </div>
              
              {/* Botón para cambiar foto */}
              <label 
                htmlFor="foto-input" 
                className="absolute bottom-0 right-0 w-10 h-10 bg-sky-600 hover:bg-sky-700 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <input
                  id="foto-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFotoChange}
                  className="hidden"
                />
              </label>

              {/* Botón para eliminar foto */}
              {previsualizacionFoto && (
                <button
                  onClick={handleEliminarFoto}
                  className="absolute top-0 right-0 w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-lg transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-3">Máximo 2MB • JPG, PNG, GIF</p>
          </div>

          <div className="bg-gradient-to-br from-sky-600/20 to-purple-600/20 rounded-2xl p-6 border-2 border-sky-500/30">
            {!editing ? (
              // Vista de lectura
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Usuario</label>
                  <div className="text-lg text-white font-semibold">{profile?.usuario || user?.usuario || 'N/A'}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Nombre Completo</label>
                  <div className="text-lg text-white">{profile?.nombre_completo || 'No especificado'}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                  <div className="text-lg text-white">{profile?.email || 'No especificado'}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Teléfono</label>
                  <div className="text-lg text-white">{profile?.telefono || 'No especificado'}</div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => setEditing(true)}
                    className="flex-1 px-4 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition"
                  >
                    Editar Perfil
                  </button>
                  <button
                    onClick={() => navigate('/map')}
                    className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition"
                  >
                    Ver Mapa
                  </button>
                </div>
              </div>
            ) : (
              // Vista de edición
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Nombre de Usuario
                  </label>
                  <input
                    type="text"
                    name="usuario"
                    value={formData.usuario}
                    onChange={handleInputChange}
                    className="w-full h-11 px-4 rounded-xl border-2 border-white/20 bg-[#141a35] text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none transition"
                    placeholder="Tu nombre de usuario"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    name="nombre_completo"
                    value={formData.nombre_completo}
                    onChange={handleInputChange}
                    className="w-full h-11 px-4 rounded-xl border-2 border-white/20 bg-[#141a35] text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none transition"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full h-11 px-4 rounded-xl border-2 border-white/20 bg-[#141a35] text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none transition"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="w-full h-11 px-4 rounded-xl border-2 border-white/20 bg-[#141a35] text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none transition"
                    placeholder="1234-5678"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        usuario: profile?.usuario || '',
                        nombre_completo: profile?.nombre_completo || '',
                        email: profile?.email || '',
                        telefono: profile?.telefono || '',
                      });
                      // Restaurar foto original
                      if (profile?.foto_perfil) {
                        setFotoPerfil(profile.foto_perfil);
                        setPrevisualizacionFoto(profile.foto_perfil);
                      } else {
                        setFotoPerfil(null);
                        setPrevisualizacionFoto(null);
                      }
                    }}
                    className="flex-1 px-4 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-xl transition"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Información adicional */}
          {profile && (
            <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-sm font-semibold text-slate-300 mb-2">Información de la cuenta</h3>
              <div className="text-xs text-slate-400 space-y-1">
                <p>Cuenta creada: {profile.fecha_creacion ? (() => {
                  try {
                    let date;
                    if (typeof profile.fecha_creacion === 'string') {
                      const dateStr = profile.fecha_creacion.replace('T', ' ');
                      const [datePart, timePart] = dateStr.split(' ');
                      const [year, month, day] = datePart.split('-').map(Number);
                      const [hour = 0, minute = 0, second = 0] = timePart ? timePart.split(':').map(Number) : [0, 0, 0];
                      date = new Date(Date.UTC(year, month - 1, day, hour + 6, minute, second));
                    } else {
                      date = new Date(profile.fecha_creacion);
                    }
                    return new Intl.DateTimeFormat('es-SV', {
                      timeZone: 'America/El_Salvador',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    }).format(date);
                  } catch {
                    return 'N/A';
                  }
                })() : 'N/A'}</p>
                <p>Último acceso: {profile.ultimo_acceso ? (() => {
                  try {
                    let date;
                    if (typeof profile.ultimo_acceso === 'string') {
                      const dateStr = profile.ultimo_acceso.replace('T', ' ');
                      const [datePart, timePart] = dateStr.split(' ');
                      const [year, month, day] = datePart.split('-').map(Number);
                      const [hour = 0, minute = 0, second = 0] = timePart ? timePart.split(':').map(Number) : [0, 0, 0];
                      date = new Date(Date.UTC(year, month - 1, day, hour + 6, minute, second));
                    } else {
                      date = new Date(profile.ultimo_acceso);
                    }
                    return new Intl.DateTimeFormat('es-SV', {
                      timeZone: 'America/El_Salvador',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    }).format(date);
                  } catch {
                    return 'N/A';
                  }
                })() : 'N/A'}</p>
              </div>
            </div>
          )}

          {/* Sección de Cambio de Contraseña */}
          <div className="mt-6">
            <button
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition"
            >
              <span className="text-slate-200 font-semibold">Cambiar Contraseña</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 text-slate-400 transition-transform ${showPasswordSection ? 'rotate-180' : ''}`}
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {showPasswordSection && (
              <div className="mt-4 p-6 bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-2xl border-2 border-orange-500/30">
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Contraseña Actual
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.actual ? "text" : "password"}
                        name="password_actual"
                        value={passwordData.password_actual}
                        onChange={handlePasswordChange}
                        className="w-full h-11 px-4 pr-12 rounded-xl border-2 border-white/20 bg-[#141a35] text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none transition"
                        placeholder="Tu contraseña actual"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('actual')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                      >
                        {showPasswords.actual ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Contraseña Nueva
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.nueva ? "text" : "password"}
                        name="password_nueva"
                        value={passwordData.password_nueva}
                        onChange={handlePasswordChange}
                        className="w-full h-11 px-4 pr-12 rounded-xl border-2 border-white/20 bg-[#141a35] text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none transition"
                        placeholder="Tu nueva contraseña"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('nueva')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                      >
                        {showPasswords.nueva ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Mínimo 6 caracteres</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Confirmar Contraseña Nueva
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirmar ? "text" : "password"}
                        name="password_confirmar"
                        value={passwordData.password_confirmar}
                        onChange={handlePasswordChange}
                        className="w-full h-11 px-4 pr-12 rounded-xl border-2 border-white/20 bg-[#141a35] text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none transition"
                        placeholder="Confirma tu nueva contraseña"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirmar')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                      >
                        {showPasswords.confirmar ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordSection(false);
                        setPasswordData({
                          password_actual: '',
                          password_nueva: '',
                          password_confirmar: '',
                        });
                      }}
                      className="flex-1 px-4 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-xl transition"
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

