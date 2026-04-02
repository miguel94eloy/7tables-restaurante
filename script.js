// ===== INICIALIZACIÓN DEL MAPA PARA LOCATION.HTML =====
let mapaRestaurante = null;
let mapaInicializadoLocation = false;

function inicializarMapaLocation() {
    console.log('🗺️ Inicializando mapa de ubicación...');
    
    const mapaContainer = document.getElementById('mapa-restaurante');
    
    if (!mapaContainer) {
        console.log('❌ Contenedor del mapa no encontrado');
        return;
    }
    
    // Limpiar contenedor
    mapaContainer.innerHTML = '';
    
    // Forzar visibilidad y tamaño
    mapaContainer.style.display = 'block';
    mapaContainer.style.visibility = 'visible';
    mapaContainer.style.height = '500px';
    mapaContainer.style.width = '100%';
    mapaContainer.style.position = 'relative';
    mapaContainer.style.overflow = 'hidden';
    
    // Coordenadas del restaurante (Miami Beach)
    const restauranteLat = 25.7915;
    const restauranteLng = -80.1300;
    
    // Dirección inventada
    const direccion = '123 Ocean Drive, Miami Beach, FL 33139';
    const nombreRestaurante = '7 Tables on the Beach';
    
    try {
        // Delay para asegurar renderizado
        setTimeout(() => {
            // Verificar dimensiones
            if (mapaContainer.offsetHeight === 0 || mapaContainer.offsetWidth === 0) {
                console.warn('Contenedor sin dimensiones válidas, forzando...');
                mapaContainer.style.height = '500px';
                mapaContainer.style.width = '100%';
                void mapaContainer.offsetHeight;
            }
            
            // Crear mapa
            mapaRestaurante = L.map('mapa-restaurante').setView([restauranteLat, restauranteLng], 15);
            
            // Capa de tiles (mismo estilo que Familia Market)
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; CartoDB',
                subdomains: 'abcd',
                maxZoom: 19,
                minZoom: 12
            }).addTo(mapaRestaurante);
            
            // Icono rojo estilo Google Maps (idéntico a Familia Market)
            const iconoRestaurante = L.divIcon({
                html: `<div style="background-color: #ea4335; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3); position: relative; cursor: pointer;">
                         <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg); width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
                       </div>`,
                className: 'icono-restaurante-mapa',
                iconSize: [24, 24],
                iconAnchor: [12, 24],
                popupAnchor: [0, -24]
            });
            
            // Agregar marcador
            const marker = L.marker([restauranteLat, restauranteLng], { icon: iconoRestaurante }).addTo(mapaRestaurante);
            
            // Popup con información
            marker.bindPopup(`
                <div style="padding: 12px; font-family: 'Inter', sans-serif; min-width: 220px;">
                    <h3 style="margin: 0 0 8px 0; color: #1a4d6b; font-size: 15px; font-weight: 700;">${nombreRestaurante}</h3>
                    <p style="margin: 0 0 5px 0; font-size: 13px; color: #666;">📍 ${direccion}</p>
                    <p style="margin: 0; font-size: 12px; color: #999;">🌊 Frente al mar</p>
                    <a href="https://maps.google.com/?q=${restauranteLat},${restauranteLng}" target="_blank" style="display: inline-block; margin-top: 10px; background: #1a4d6b; color: white; padding: 6px 12px; border-radius: 20px; text-decoration: none; font-size: 12px; font-weight: 500;">📱 Ver en Google Maps</a>
                </div>
            `).openPopup();
            
            // Forzar redimensionado
            const forceResize = () => {
                setTimeout(() => {
                    if (mapaRestaurante && typeof mapaRestaurante.invalidateSize === 'function') {
                        mapaRestaurante.invalidateSize(true);
                        console.log('✅ Mapa redimensionado correctamente');
                    }
                }, 150);
            };
            
            // Múltiples redimensionados estratégicos
            [100, 300, 500, 800, 1200].forEach(delay => {
                setTimeout(forceResize, delay);
            });
            
            // Evento de redimensionado de ventana
            let resizeTimeout;
            window.addEventListener('resize', function() {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(forceResize, 300);
            });
            
            mapaRestaurante.whenReady(function() {
                console.log('✅ Mapa de ubicación completamente cargado');
                mapaInicializadoLocation = true;
            });
            
        }, 400);
        
    } catch (error) {
        console.error('❌ Error cargando mapa:', error);
        mapaContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666; background: #f8f9fa; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <div style="font-size: 3rem; margin-bottom: 15px;">🗺️</div>
                <h3 style="margin-bottom: 15px; color: #1a4d6b;">Error al cargar el mapa</h3>
                <p>📍 Nuestra dirección: 123 Ocean Drive, Miami Beach, FL 33139</p>
                <p>📞 Llámanos: +1 (305) 555-0123</p>
            </div>
        `;
    }
}

// ===== EFECTO SCROLL TIPO "PIANO KEYS" PARA MENÚ =====
function initScrollReveal() {
    const blocks = document.querySelectorAll('.menu-block');
    
    if (blocks.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    blocks.forEach(block => {
        observer.observe(block);
    });
}

// Si ya existe DOMContentLoaded, agregar dentro, si no, crear uno nuevo
if (typeof window.initScrollRevealAdded === 'undefined') {
    window.initScrollRevealAdded = true;
    
    // Verificar si ya hay un DOMContentLoaded existente
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initScrollReveal();
        });
    } else {
        // DOM ya cargado
        initScrollReveal();
    }
}

// Inicializar mapa cuando el DOM esté listo y estemos en location.html
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('mapa-restaurante')) {
        console.log('📍 Página de ubicación detectada, inicializando mapa...');
        inicializarMapaLocation();
    }
});