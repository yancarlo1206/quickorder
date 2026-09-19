import { useState, useEffect } from 'react';
import defaultBanner from '../../assets/banner.jpg';

export function Banner({ src = defaultBanner, alt = "Promoción de comida rápida QuickOrder" }) {
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
        setImgSrc(src || defaultBanner);
    }, [src]);

    return (
        <section className="hero-banner">
            <img
                src={imgSrc}
                alt={alt}
                className="hero-banner-img"
                onError={() => {
                    if (imgSrc !== defaultBanner) {
                        setImgSrc(defaultBanner);
                    }
                }}
            />
        </section>
    );
}