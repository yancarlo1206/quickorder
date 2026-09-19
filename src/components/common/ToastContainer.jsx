import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast, confirmDialog } = useToast();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="toast-icon success" size={20} />;
      case 'error':
        return <AlertCircle className="toast-icon error" size={20} />;
      case 'warning':
        return <AlertTriangle className="toast-icon warning" size={20} />;
      default:
        return <Info className="toast-icon info" size={20} />;
    }
  };

  return (
    <>
      {/* Lista de Toasts flotantes */}
      <aside aria-label="Notificaciones" className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-card toast-${toast.type}`}>
            <div className="toast-body">
              {getIcon(toast.type)}
              <span className="toast-message">{toast.message}</span>
            </div>
            <button
              className="toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Cerrar notificación"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </aside>

      {/* Modal de confirmación moderno */}
      {confirmDialog && (
        <div className="modal-backdrop" onClick={confirmDialog.onCancel}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon-wrapper">
              {confirmDialog.isDestructive ? (
                <AlertTriangle className="confirm-icon destructive" size={32} />
              ) : (
                <Info className="confirm-icon" size={32} />
              )}
            </div>
            <h3 className="confirm-title">{confirmDialog.title}</h3>
            {confirmDialog.message && (
              <p className="confirm-message">{confirmDialog.message}</p>
            )}
            <div className="confirm-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={confirmDialog.onCancel}
              >
                {confirmDialog.cancelText || 'Cancelar'}
              </button>
              <button
                type="button"
                className={`btn-confirm ${confirmDialog.isDestructive ? 'destructive' : 'primary'}`}
                onClick={confirmDialog.onConfirm}
              >
                {confirmDialog.confirmText || 'Aceptar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
