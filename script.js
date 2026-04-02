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

// ============================================
// PROTECCIÓN AVANZADA - ANTI CLONACIÓN Y NOTIFICACIONES
// DOMINIO CORREGIDO PARA GITHUB PAGES
// ============================================

(function() {
    // 1. BLOQUEAR HERRAMIENTAS DE DESARROLLADOR
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12') {
            e.preventDefault();
            notificarIntento('F12 - Herramientas de desarrollador');
            return false;
        }
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            notificarIntento('Ctrl+Shift+I - Inspeccionar elemento');
            return false;
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
            e.preventDefault();
            notificarIntento('Ctrl+U - Ver código fuente');
            return false;
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            notificarIntento('Ctrl+S - Guardar página');
            return false;
        }
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            notificarIntento('Ctrl+Shift+C - Inspeccionar elemento');
            return false;
        }
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
            e.preventDefault();
            notificarIntento('Ctrl+Shift+J - Consola');
            return false;
        }
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'K') {
            e.preventDefault();
            notificarIntento('Ctrl+Shift+K - Consola');
            return false;
        }
    });

    // 2. BLOQUEAR CLIC DERECHO
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        notificarIntento('Clic derecho');
        return false;
    });

    // 3. DETECTAR HERRAMIENTAS DE DESARROLLADOR
    let devToolsOpen = false;
    const element = new Image();
    Object.defineProperty(element, 'id', {
        get: function() {
            devToolsOpen = true;
            notificarIntento('Herramientas de desarrollador abiertas');
            return '';
        }
    });
    
    setInterval(function() {
        devToolsOpen = false;
        console.log(element);
        console.clear();
        if (devToolsOpen) {
            notificarIntento('Consola abierta');
        }
    }, 1000);

    // 4. BLOQUEAR COPIA Y CORTE
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        notificarIntento('Intento de copiar contenido');
        alert('❌ Contenido protegido. No está permitido copiar información de este sitio.');
        return false;
    });

    document.addEventListener('cut', function(e) {
        e.preventDefault();
        notificarIntento('Intento de cortar contenido');
        return false;
    });

    // 5. BLOQUEAR IMPRESIÓN
    window.matchMedia('print').addListener(function(mql) {
        if (mql.matches) {
            notificarIntento('Intento de imprimir página');
            alert('❌ No está permitido imprimir esta página.');
        }
    });

    // 6. NOTIFICAR SELECCIONES LARGAS
    document.addEventListener('selectstart', function(e) {
        setTimeout(function() {
            const selection = window.getSelection().toString();
            if (selection.length > 50) {
                notificarIntento('Selección larga de texto - posible copia');
            }
        }, 100);
    });

    // 7. VERIFICACIÓN POR DOMINIO - CORREGIDO PARA GITHUB PAGES
    const dominiosPermitidos = [
        'localhost',
        '127.0.0.1',
        'miguel94eloy.github.io',   // ✅ Tu dominio de GitHub Pages
        '7tables-restaurante.com'    // Si compras dominio propio en el futuro
    ];
    
    const dominioActual = window.location.hostname;
    const esDominioValido = dominiosPermitidos.some(dominio => dominioActual === dominio || dominioActual.includes(dominio));
    
    if (!esDominioValido && dominioActual !== '' && !dominioActual.includes('file://')) {
        // Limpiar la página y mostrar mensaje de clonación
        document.body.innerHTML = `
            <div style="text-align:center;padding:100px 20px;font-family:Arial,sans-serif;min-height:100vh;background:#f5f5f5;">
                <div style="max-width:500px;margin:0 auto;background:white;border-radius:20px;padding:40px;box-shadow:0 10px 30px rgba(0,0,0,0.1);">
                    <div style="font-size:4rem;margin-bottom:20px;">⚠️</div>
                    <h2 style="color:#e74c3c;margin-bottom:15px;">Sitio no autorizado</h2>
                    <p style="color:#666;margin-bottom:20px;">Este contenido está protegido por derechos de autor.</p>
                    <p style="color:#999;font-size:0.9rem;">Visite el sitio oficial en:</p>
                    <p style="color:#3498db;font-weight:bold;">miguel94eloy.github.io/7tables-restaurante</p>
                </div>
            </div>
        `;
        console.warn('⚠️ Dominio no autorizado:', dominioActual);
        throw new Error('Dominio no autorizado');
    }

    // 8. FUNCIÓN PARA NOTIFICAR INTENTOS
    function notificarIntento(accion) {
        const timestamp = new Date().toISOString();
        const info = {
            accion: accion,
            timestamp: timestamp,
            url: window.location.href,
            userAgent: navigator.userAgent,
            dominio: window.location.hostname
        };
        
        console.warn('🔒 Intento detectado:', info);
        
        // Guardar en localStorage
        let intentos = localStorage.getItem('seguridad_intentos');
        if (intentos) {
            intentos = JSON.parse(intentos);
            intentos.push(info);
            if (intentos.length > 50) intentos.shift();
        } else {
            intentos = [info];
        }
        localStorage.setItem('seguridad_intentos', JSON.stringify(intentos));
        
        // Mostrar alerta para acciones críticas
        if (accion.includes('F12') || accion.includes('Consola') || accion.includes('Herramientas') || accion.includes('copiar')) {
            mostrarAlertaSeguridad();
        }
    }
    
    // 9. MOSTRAR ALERTA NO INTRUSIVA
    let alertaTimeout = null;
    function mostrarAlertaSeguridad() {
        if (document.querySelector('.alerta-seguridad')) return;
        
        const alerta = document.createElement('div');
        alerta.className = 'alerta-seguridad';
        alerta.innerHTML = `
            <div style="position:fixed;bottom:20px;right:20px;background:#e74c3c;color:white;padding:12px 20px;border-radius:8px;font-size:14px;z-index:99999;box-shadow:0 4px 12px rgba(0,0,0,0.2);font-family:monospace;">
                🚫 Acceso restringido - Contenido protegido
            </div>
        `;
        document.body.appendChild(alerta);
        
        if (alertaTimeout) clearTimeout(alertaTimeout);
        alertaTimeout = setTimeout(() => {
            if (alerta && alerta.remove) alerta.remove();
        }, 3000);
    }
    
    console.log('✅ Sistema de protección activado - Dominio permitido:', dominioActual);
})();

// Inicializar mapa cuando el DOM esté listo y estemos en location.html
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('mapa-restaurante')) {
        console.log('📍 Página de ubicación detectada, inicializando mapa...');
        inicializarMapaLocation();
    }
});
