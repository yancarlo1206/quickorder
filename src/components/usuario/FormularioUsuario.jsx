import { useState, useEffect } from 'react';

export function FormularioUsuario({ usuarioAEditar, onGuardar, onCancelar, guardando }) {
  const initialFormState = {
    nombre: '',
    clave: '',
    estado: true
  };

  const [formData, setFormData] = useState(initialFormState);
  const [mostrarClave, setMostrarClave] = useState(false);

  useEffect(() => {
    if (usuarioAEditar) {
      setFormData({
        nombre: usuarioAEditar.nombre || '',
        clave: usuarioAEditar.clave || '',
        estado: usuarioAEditar.estado !== undefined ? Boolean(usuarioAEditar.estado) : true
      });
    } else {
      setFormData(initialFormState);
    }
  }, [usuarioAEditar]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.clave.trim()) {
      alert('Por favor completa el nombre de usuario y la clave.');
      return;
    }

    const dataToSend = {
      ...formData,
      estado: Boolean(formData.estado === true || formData.estado === 'true' || formData.estado === 1 || formData.estado === '1')
    };

    onGuardar(dataToSend);
  };

  const esEdicion = Boolean(usuarioAEditar);

  return (
    <div
      className="card-form-container"
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
        border: '1px solid #dbeafe',
        boxShadow: '0 12px 28px rgba(15, 23, 42, 0.08)'
      }}
    >
      <div className="form-header" style={{ borderBottom: '1px solid #e2e8f0' }}>
        <h3 className="form-title" style={{ color: '#0f172a' }}>
          {esEdicion ? '✏️ Editar Usuario' : '➕ Registrar Nuevo Usuario'}
        </h3>
        <p className="form-subtitle">
          {esEdicion
            ? 'Modifica las credenciales y estado del usuario seleccionado'
            : 'Ingresa los datos para registrar un usuario de acceso al sistema'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
          {/* Nombre de Usuario */}
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">Nombre de Usuario *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="form-input"
              placeholder="Ej. admin, cajero1, mesero..."
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          {/* Clave */}
          <div className="form-group">
            <label htmlFor="clave" className="form-label">Clave / Contraseña *</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={mostrarClave ? 'text' : 'password'}
                id="clave"
                name="clave"
                className="form-input"
                placeholder="Ingresa la contraseña"
                value={formData.clave}
                onChange={handleChange}
                required
                style={{ width: '100%', paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setMostrarClave(!mostrarClave)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  color: '#64748b'
                }}
                title={mostrarClave ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {mostrarClave ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Estado */}
          <div className="form-group">
            <label htmlFor="estado" className="form-label">Estado de la Cuenta</label>
            <select
              id="estado"
              name="estado"
              className="form-input"
              value={String(formData.estado)}
              onChange={handleChange}
            >
              <option value="true">🟢 Activo (Acceso Permitido)</option>
              <option value="false">⚪ Inactivo (Bloqueado)</option>
            </select>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn-save"
            disabled={guardando}
            style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              boxShadow: '0 10px 18px rgba(2, 132, 199, 0.22)',
              borderRadius: '12px'
            }}
          >
            {guardando ? 'Guardando...' : esEdicion ? 'Actualizar Usuario' : 'Guardar Usuario'}
          </button>
          
          {esEdicion && (
            <button
              type="button"
              className="btn-cancel"
              onClick={onCancelar}
              disabled={guardando}
              style={{ borderRadius: '12px' }}
            >
              Cancelar Edición
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
