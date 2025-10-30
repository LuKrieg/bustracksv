import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Header from '../../layout/Header';
import ContentBox from '../../layout/ContentBox';
import perfilService from '../../../services/perfilService';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre_completo: '',
    email: '',
    telefono: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

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
          nombre_completo: result.data.nombre_completo || '',
          email: result.data.email || '',
          telefono: result.data.telefono || '',
        });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await perfilService.updatePerfil(formData);
      if (result.success) {
        setMessage({ type: 'success', text: '¡Perfil actualizado exitosamente!' });
        setProfile(result.data.usuario);
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

  if (loading && !profile) {
    return (
      <>
        <Header />
        <ContentBox>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
            <p className="text-slate-400 mt-4">Cargando perfil...</p>
          </div>
        </ContentBox>
      </>
    );
  }

  return (
    <>
      <Header />
      <ContentBox>
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
                        nombre_completo: profile?.nombre_completo || '',
                        email: profile?.email || '',
                        telefono: profile?.telefono || '',
                      });
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
                <p>Cuenta creada: {profile.fecha_creacion ? new Date(profile.fecha_creacion).toLocaleDateString('es-SV') : 'N/A'}</p>
                <p>Último acceso: {profile.ultimo_acceso ? new Date(profile.ultimo_acceso).toLocaleDateString('es-SV') : 'N/A'}</p>
              </div>
            </div>
          )}
        </div>
      </ContentBox>
    </>
  );
}

