export function Banner() {
    return (
        <section className="hero-banner">
            <div className="banner-copy">
                <div className="banner-badge">🔥 Menú Rápido & Delicioso</div>
                <h1 className="banner-title">Pide tus Platillos Favoritos al Instante</h1>
                <p className="banner-subtitle">
                    Explora nuestro menú seleccionado, ingredientes frescos y entrega rápida a tu mesa o domicilio.
                </p>
                <div className="banner-highlights" aria-label="Beneficios del servicio">
                    <span><strong>15 min</strong> entrega promedio</span>
                    <span><strong>4.9/5</strong> clientes felices</span>
                </div>
            </div>

            <div className="banner-visual" aria-hidden="true">
                <div className="banner-glow"></div>
                <span className="floating-emoji floating-emoji-one">🥑</span>
                <span className="floating-emoji floating-emoji-two">🍅</span>
                <div className="dish-shadow"></div>
                <div className="dish">
                    <div className="dish-food">🍔</div>
                </div>
                <div className="visual-label">
                    <span className="visual-label-dot"></span>
                    <span>Recién preparado</span>
                </div>
            </div>
        </section>
    );
}