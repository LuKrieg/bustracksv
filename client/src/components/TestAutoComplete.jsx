import { useState, useEffect } from 'react';
import routeService from '../services/routeService';

export default function TestAutoComplete() {
  const [paradas, setParadas] = useState([]);
  const [input, setInput] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    cargarParadas();
  }, []);

  const cargarParadas = async () => {
    console.log('🔄 Cargando paradas...');
    const result = await routeService.getParadas();
    if (result.success) {
      console.log('✅ Paradas cargadas:', result.data.length);
      setParadas(result.data);
    } else {
      console.error('❌ Error al cargar paradas:', result.message);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    console.log('🔍 Escribiendo:', value);

    if (value.length > 0) {
      const filtradas = paradas.filter(p =>
        p.nombre.toLowerCase().includes(value.toLowerCase())
      );
      console.log('✅ Filtradas:', filtradas.length);
      setSugerencias(filtradas.slice(0, 10));
      setMostrar(true);
    } else {
      setSugerencias([]);
      setMostrar(false);
    }
  };

  const handleFocus = () => {
    console.log('👆 Click en campo');
    console.log('📊 Paradas disponibles:', paradas.length);
    
    if (paradas.length > 0 && input === '') {
      const populares = paradas
        .filter(p => p.tipo === 'Terminal' || p.tipo === 'TransferHub')
        .slice(0, 8);
      console.log('⭐ Mostrando populares:', populares.length);
      setSugerencias(populares);
      setMostrar(true);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#1a1a2e', minHeight: '100vh', color: 'white' }}>
      <h1>🧪 Test de Autocompletado</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#16213e', borderRadius: '8px' }}>
        <p><strong>Estado:</strong></p>
        <ul>
          <li>Paradas cargadas: {paradas.length}</li>
          <li>Input actual: "{input}"</li>
          <li>Sugerencias disponibles: {sugerencias.length}</li>
          <li>Mostrar menú: {mostrar ? 'SÍ' : 'NO'}</li>
        </ul>
      </div>

      <div style={{ position: 'relative', maxWidth: '500px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Buscar Parada:
        </label>
        <input
          type="text"
          value={input}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={() => setTimeout(() => setMostrar(false), 200)}
          placeholder="Escribe o haz click..."
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '2px solid #0f3460',
            backgroundColor: '#16213e',
            color: 'white'
          }}
        />

        {mostrar && sugerencias.length > 0 && (
          <div style={{
            position: 'absolute',
            width: '100%',
            marginTop: '4px',
            backgroundColor: '#16213e',
            border: '2px solid #0f3460',
            borderRadius: '8px',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 1000
          }}>
            {input === '' && (
              <div style={{
                padding: '8px 12px',
                backgroundColor: '#0f3460',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#64ffda'
              }}>
                ⭐ Paradas Populares
              </div>
            )}
            {sugerencias.map((parada) => (
              <button
                key={parada.id}
                onClick={() => {
                  setInput(parada.nombre);
                  setMostrar(false);
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid #0f3460',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#0f3460'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                  {parada.nombre}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {parada.direccion || parada.zona}
                </div>
                {parada.tipo && (
                  <div style={{ fontSize: '11px', color: '#64ffda', marginTop: '4px' }}>
                    {parada.tipo === 'Terminal' ? '🚏 Terminal' :
                     parada.tipo === 'TransferHub' ? '🔄 Hub' : '📍 Parada'}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#16213e', borderRadius: '8px' }}>
        <h3>📋 Instrucciones:</h3>
        <ol>
          <li>Abre la consola del navegador (F12)</li>
          <li>Haz click en el campo de arriba</li>
          <li>Deberías ver mensajes en la consola</li>
          <li>Escribe algo (ej: "terminal", "universidad")</li>
          <li>Deberían aparecer sugerencias</li>
        </ol>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button
          onClick={cargarParadas}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0f3460',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          🔄 Recargar Paradas
        </button>
      </div>

      {paradas.length > 0 && (
        <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#16213e', borderRadius: '8px' }}>
          <h3>✅ Primeras 5 Paradas Cargadas:</h3>
          <ul>
            {paradas.slice(0, 5).map(p => (
              <li key={p.id}>{p.nombre} - {p.zona}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


