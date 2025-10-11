import { useState } from 'react';
import Header from '../../layout/Header';

const RegisterPage = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    birth: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (form.username.trim().length < 3) newErrors.username = 'Mínimo 3 caracteres.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Email inválido.';
    if (!form.birth) newErrors.birth = 'Selecciona tu fecha.';
    if (form.password.length < 6) newErrors.password = 'Mínimo 6 caracteres.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(false);
    if (!validate()) return;
    // Aquí harías la petición al backend
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <main className="w-full px-8 py-12 flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-bg-secondary p-6 rounded-xl space-y-4"
        >
          <h1 className="text-2xl text-text-primary font-semibold">Regístrate</h1>

          <div>
            <label className="block text-text-secondary mb-1">Usuario</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full bg-bg-primary text-text-primary rounded-lg px-4 py-2 outline-none border border-transparent focus:border-accent-blue"
              placeholder="Su usuario"
            />
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-text-secondary mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-bg-primary text-text-primary rounded-lg px-4 py-2 outline-none border border-transparent focus:border-accent-blue"
              placeholder="Su email"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-text-secondary mb-1">Nacimiento</label>
            <input
              type="date"
              name="birth"
              value={form.birth}
              onChange={handleChange}
              className="w-full bg-bg-primary text-text-primary rounded-lg px-4 py-2 outline-none border border-transparent focus:border-accent-blue"
            />
            {errors.birth && (
              <p className="text-red-400 text-sm mt-1">{errors.birth}</p>
            )}
          </div>

          <div>
            <label className="block text-text-secondary mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-bg-primary text-text-primary rounded-lg px-4 py-2 outline-none border border-transparent focus:border-accent-blue"
              placeholder="Su contraseña"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-accent-blue hover:bg-accent-light-blue text-text-primary font-medium rounded-lg py-2 transition-colors"
          >
            Registrarte
          </button>

          {success && (
            <p className="text-green-400 text-sm mt-2">¡Registro válido! 🎉</p>
          )}
        </form>
      </main>
    </div>
  );
};

export default RegisterPage;


