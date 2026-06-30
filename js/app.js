// 1. BASE DE DATOS SIMULADA
const baseDeDatosProductos = [
    {
        id: 1,
        categoria: "Electrónica",
        estado: "COMO NUEVO",
        nombre: "Calculadora HP Prime G2",
        precio: 150.00,
        precioTexto: "S/ 150.00",
        imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLKMrmTjAa0tGy2sG-Y2J69xLBPR1jfEEYy1AmhDpG9LlCPAoifiCvudAiujzP3GnQkq-4OKVqYvc7SnCTyJIlkaNFHc1vPCJkuOqaBtDKiTt9qmkApwA3mXVlBdM4Q_5uLQWBOyuto952dqaM07bS3uVjXfdHYEC_xUqj0vrPURWGqjbQsVZqGn2YtkHsXRMKxpvXjsbrjD2gOJ6Aievew_RGfo8liepaiwCLfNHK26_Pqpj8Qy2dH8DsF_U-DvLdya5wndFUhKc",
        descripcion: "Calculadora gráfica avanzada para ingeniería, ideal para estudiantes de la UTP. Incluye pantalla táctil a color de 3.5 pulgadas, procesador de alta velocidad, y soporte para CAS."
    },
    {
        id: 2,
        categoria: "Libros",
        estado: "USADO",
        nombre: "Libro de Cálculo I",
        precio: 35.00,
        precioTexto: "S/ 35.00",
        imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQE2q_Yjl2QsduTZkd4sZE5aoxi0nSYMmtnYg2CA8CUPGgB-k7wfGtnLUx9ry2fybx8m1EZyCAqr3EOVXT4FcYAIW1T-6niM3EAZKpGOMANLYBLvG7d3X8f8GpJDyNrOzhLkeLR8Q1Aix_63NDu8uVH2hbtmNUUiViawY-gf0kNeq8ns1qbs4ViiBLMqvNYXcukQFTt_VLd-ClNITyXI3AiIku7jG7kYQshzyga_ldi8fPlkkSm1UFZTLd2GnQ-356YUlnDFRc2T0",
        descripcion: "Libro clásico de Cálculo I, esencial para los primeros ciclos. Tiene algunos apuntes a lápiz en los márgenes que pueden ser muy útiles."
    },
    {
        id: 3,
        categoria: "Proyectos",
        estado: "NUEVO",
        nombre: "Kit de Arduino Starter",
        precio: 55.00,
        precioTexto: "S/ 55.00",
        imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuBu_U0sia--X6GHb4SsL7Szf5LuRtT2EBmF9Hr_nwUncebDfNMymYP_7ZBQAfYI36Ruu-RSavTsn287GUsECdLk2ebapjxKT47TYcPBZ8qM_y-Hfi2JyyqRm8cv2YkhapnnGCq9fFzYvqXhCD5Y1UXNeQ6dK63z-8VM4dJojyBgkjAD98VIAoj1gkgLpaQPjoOZZuQAyeBOohwBVRIc7dIg7yWy3XHjdfRVY35yPobxYOzwJHSmYDRsj_98NBZAC_4ZpfqEpGxvfPQ",
        descripcion: "Kit inicial completo de Arduino UNO. Totalmente nuevo y sellado. Incluye protoboard, LEDs, resistencias y cables jumper."
    }
];

// 2. INICIALIZACIÓN DE LA PÁGINA
document.addEventListener('DOMContentLoaded', () => {
    actualizarContador();
    actualizarMenuActivo(); // Marcamos el menú según la URL
    
    // Si estamos en la página del carrito
    if (document.getElementById('cart-items')) renderizarCarrito();

    // Lógica para detalle de producto (producto.html)
    const params = new URLSearchParams(window.location.search);
    const idProducto = params.get('id');
    if (idProducto) cargarDetalleProducto(parseInt(idProducto));

    // Lógica para filtrado de catálogo (catalogo.html)
    if (document.getElementById('contenedor-productos')) filtrarCatalogo();
});

// 3. LÓGICA DE DETALLE DE PRODUCTO
function cargarDetalleProducto(id) {
    const productoActual = baseDeDatosProductos.find(prod => prod.id === id);
    if (!productoActual) return;

    if(document.getElementById('prod-titulo')) document.getElementById('prod-titulo').textContent = productoActual.nombre;
    if(document.getElementById('prod-migas-titulo')) document.getElementById('prod-migas-titulo').textContent = productoActual.nombre;
    if(document.getElementById('prod-precio')) document.getElementById('prod-precio').textContent = productoActual.precioTexto;
    if(document.getElementById('prod-categoria')) document.getElementById('prod-categoria').textContent = productoActual.categoria;
    if(document.getElementById('prod-estado')) document.getElementById('prod-estado').textContent = productoActual.estado;
    if(document.getElementById('prod-descripcion')) document.getElementById('prod-descripcion').textContent = productoActual.descripcion;
    
    // Migas de pan de categoría dinámicas
    const migaCat = document.getElementById('prod-migas-categoria');
    if(migaCat) {
        migaCat.textContent = productoActual.categoria;
        migaCat.href = `catalogo.html?categoria=${productoActual.categoria}`;
    }

    const imgElement = document.getElementById('prod-imagen');
    if(imgElement) {
        imgElement.src = productoActual.imagen;
        imgElement.alt = productoActual.nombre;
    }

    const btnCarrito = document.getElementById('btn-agregar-carrito');
    if(btnCarrito) {
        btnCarrito.onclick = () => agregarAlCarrito(`prod-${productoActual.id}`, productoActual.nombre, productoActual.precio, productoActual.categoria, productoActual.imagen);
    }
}

// 4. LÓGICA DE FILTRADO PARA CATÁLOGO
function filtrarCatalogo() {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;

    const params = new URLSearchParams(window.location.search);
    const categoriaFiltro = params.get('categoria');

    const productosMostrar = categoriaFiltro 
        ? baseDeDatosProductos.filter(p => p.categoria === categoriaFiltro)
        : baseDeDatosProductos;

    contenedor.innerHTML = productosMostrar.map(p => `
        <div class="product-card group bg-white border border-outline-variant cursor-pointer p-4 hover:shadow-lg transition-shadow" onclick="window.location.href='producto.html?id=${p.id}'">
            <div class="aspect-[4/3] overflow-hidden relative mb-4">
                <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${p.imagen}" alt="${p.nombre}"/>
            </div>
            <p class="font-label-md text-label-md text-secondary mb-1">${p.categoria}</p>
            <h3 class="font-headline-sm text-headline-sm mb-3">${p.nombre}</h3>
            <span class="font-bold text-primary">${p.precioTexto}</span>
        </div>
    `).join('') || `<p class="p-4 text-secondary">No se encontraron productos.</p>`;
}

// 5. LÓGICA DE INTERFAZ Y CARRITO
function actualizarMenuActivo() {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('categoria');
    document.querySelectorAll('nav a').forEach(enlace => {
        if (cat && enlace.textContent.trim() === cat) {
            enlace.classList.add('text-primary', 'border-b-2', 'border-primary', 'font-bold');
            enlace.classList.remove('text-secondary');
        } else if (!cat && enlace.textContent.trim() === 'Catálogo') {
            enlace.classList.add('text-primary', 'border-b-2', 'border-primary', 'font-bold');
            enlace.classList.remove('text-secondary');
        }
    });
}

function agregarAlCarrito(id, nombre, precio, categoria, imagen) {
    let carrito = JSON.parse(localStorage.getItem('utp_cart')) || [];
    let item = carrito.find(i => i.id === id);
    item ? item.cantidad += 1 : carrito.push({ id, nombre, precio, categoria, imagen, cantidad: 1 });
    localStorage.setItem('utp_cart', JSON.stringify(carrito));
    actualizarContador();
    alert(`¡"${nombre}" añadido al carrito!`);
}

function actualizarContador() {
    let carrito = JSON.parse(localStorage.getItem('utp_cart')) || [];
    document.querySelectorAll('.cart-counter').forEach(el => el.innerText = carrito.reduce((a, b) => a + b.cantidad, 0));
}
function actualizarContador() {
    let carrito = JSON.parse(localStorage.getItem('utp_cart')) || [];
    const countElements = document.querySelectorAll('.cart-counter');
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    
    countElements.forEach(el => {
        el.innerText = totalItems;
    });
}

function renderizarCarrito() {
    let carrito = JSON.parse(localStorage.getItem('utp_cart')) || [];
    const contenedor = document.getElementById('cart-items');
    const emptyState = document.getElementById('empty-cart');
    const summarySection = document.getElementById('order-summary');
    
    if (!contenedor) return;

    if (carrito.length === 0) {
        contenedor.classList.add('hidden');
        emptyState.classList.remove('hidden');
        summarySection.style.opacity = '0.5';
        summarySection.style.pointerEvents = 'none';
        document.getElementById('summary-subtotal').innerText = 'S/ 0.00';
        document.getElementById('summary-total').innerText = 'S/ 0.00';
        return;
    }

    contenedor.classList.remove('hidden');
    emptyState.classList.add('hidden');
    summarySection.style.opacity = '1';
    summarySection.style.pointerEvents = 'auto';
    
    contenedor.innerHTML = '';
    let subtotal = 0;

    carrito.forEach((item, index) => {
        subtotal += (item.precio * item.cantidad);
        contenedor.innerHTML += `
            <div class="item-row bg-surface-container-lowest border border-outline-variant p-4 flex flex-col md:flex-row gap-4 items-center">
                <div class="w-24 h-24 flex-shrink-0 bg-surface-container rounded-lg overflow-hidden border border-outline-variant">
                    <img class="w-full h-full object-contain" src="${item.imagen}" alt="${item.nombre}"/>
                </div>
                <div class="flex-grow text-center md:text-left">
                    <span class="font-label-md text-label-md text-primary uppercase">${item.categoria}</span>
                    <h3 class="font-headline-sm text-headline-sm text-on-surface">${item.nombre}</h3>
                </div>
                <div class="flex flex-row md:flex-col items-center justify-between md:items-end gap-4 w-full md:w-auto">
                    <span class="font-headline-sm text-headline-sm text-on-surface order-1 md:order-none">S/ ${item.precio.toFixed(2)}</span>
                    <div class="flex items-center border border-outline-variant rounded bg-surface order-2 md:order-none">
                        <button class="px-3 py-1 hover:bg-surface-container transition-colors" onclick="cambiarCantidad(${index}, -1)">-</button>
                        <input class="w-10 text-center border-none focus:ring-0 bg-transparent font-label-md" readonly type="number" value="${item.cantidad}"/>
                        <button class="px-3 py-1 hover:bg-surface-container transition-colors" onclick="cambiarCantidad(${index}, 1)">+</button>
                    </div>
                    <button class="text-error font-button text-button hover:underline flex items-center gap-1 order-3 md:order-none" onclick="eliminarItem(${index})">
                        <span class="material-symbols-outlined text-sm">delete</span> Eliminar
                    </button>
                </div>
            </div>
        `;
    });

    document.getElementById('summary-subtotal').innerText = `S/ ${subtotal.toFixed(2)}`;
    document.getElementById('summary-total').innerText = `S/ ${subtotal.toFixed(2)}`;
}

function cambiarCantidad(index, cambio) {
    let carrito = JSON.parse(localStorage.getItem('utp_cart')) || [];
    if (carrito[index].cantidad + cambio > 0) {
        carrito[index].cantidad += cambio;
        localStorage.setItem('utp_cart', JSON.stringify(carrito));
        renderizarCarrito();
        actualizarContador();
    }
}

function eliminarItem(index) {
    let carrito = JSON.parse(localStorage.getItem('utp_cart')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('utp_cart', JSON.stringify(carrito));
    renderizarCarrito();
    actualizarContador();
}

function procesarCompra() {
    alert('¡Gracias por tu solicitud! El vendedor ha sido notificado para coordinar la entrega en el campus.');
    localStorage.removeItem('utp_cart');
    renderizarCarrito();
    actualizarContador();
}
function actualizarMenuActivo() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaActual = urlParams.get('categoria'); // Ejemplo: "Libros"
    
    // Seleccionamos todos los enlaces del nav
    const enlacesMenu = document.querySelectorAll('nav a');
    
    enlacesMenu.forEach(enlace => {
        // Quitamos la clase activa de todos primero
        enlace.classList.remove('text-primary', 'border-b-2', 'border-primary', 'font-bold');
        enlace.classList.add('text-secondary');

        // Si el texto del enlace coincide con la categoría de la URL, lo marcamos
        if (categoriaActual && enlace.textContent.trim() === categoriaActual) {
            enlace.classList.add('text-primary', 'border-b-2', 'border-primary', 'font-bold');
            enlace.classList.remove('text-secondary');
        } else if (!categoriaActual && enlace.textContent.trim() === 'Catálogo') {
            // Si no hay filtro, marcamos "Catálogo" por defecto
            enlace.classList.add('text-primary', 'border-b-2', 'border-primary', 'font-bold');
            enlace.classList.remove('text-secondary');
        }
    });
}

// Llama a esta función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarMenuActivo();
    });