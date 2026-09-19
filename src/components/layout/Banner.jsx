import { Flame, Clock, ShieldCheck, Sparkles } from 'lucide-react';

export function Banner() {
  return (
    <section className="hero-banner-modern">
      <div className="banner-content">
        <div className="banner-pill-badge">
          <Flame size={14} className="badge-icon-fire" />
          <span>¡Sabores Únicos & Entrega Inmediata!</span>
        </div>
        <h1 className="banner-main-title">
          Pide tus Platillos Favoritos <span className="title-gradient">al Instante</span>
        </h1>
        <p className="banner-desc">
          Explora nuestro menú seleccionado, preparado con ingredientes frescos y con el servicio más rápido para tu mesa o domicilio.
        </p>

        <div className="banner-features-grid">
          <div className="feature-pill">
            <Clock size={16} />
            <span>Preparación en 15-20 min</span>
          </div>
          <div className="feature-pill">
            <ShieldCheck size={16} />
            <span>100% Calidad Garantizada</span>
          </div>
          <div className="feature-pill">
            <Sparkles size={16} />
            <span>Pedidos directos a WhatsApp</span>
          </div>
        </div>
      </div>
    </section>
  );
}