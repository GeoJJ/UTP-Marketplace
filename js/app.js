
const API_URL = 'http://localhost:8082/api/products';

async function obtenerProductosDesdeAPI() {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error('Error al conectar con la base de datos');
        return await respuesta.json();
    } catch (error) {
        console.error("Error al obtener productos:", error);
        return [];
    }
}

async function guardarProductoEnAPI(nuevoProducto) {
    try {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoProducto)
        });
        return respuesta.ok;
    } catch (error) {
        console.error("Error al guardar producto:", error);
        return false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarContador();
    actualizarMenuActivo();
    
    
    if (document.getElementById('cart-items')) renderizarCarrito();
    if (document.getElementById('contenedor-productos')) filtrarCatalogo();
    if (document.getElementById('contenedor-destacados')) cargarDestacados(); 

    const params = new URLSearchParams(window.location.search);
    const idProducto = params.get('id');
    if (idProducto) cargarDetalleProducto(parseInt(idProducto));

    
    const formAdmin = document.getElementById('form-admin');
    if (formAdmin) formAdmin.onsubmit = manejarEnvioAdmin;
});

async function cargarDestacados() {
    const contenedor = document.getElementById('contenedor-destacados');
    if (!contenedor) return;

    const productos = await obtenerProductosDesdeAPI();
    const destacados = productos.slice(0, 3);

    contenedor.innerHTML = destacados.map(p => `
        <div class="product-card group bg-white border border-outline-variant cursor-pointer p-4 hover:shadow-lg transition-shadow" onclick="window.location.href='producto.html?id=${p.id}'">
            <div class="aspect-[4/3] overflow-hidden relative mb-4">
                <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${p.imageUrl}" alt="${p.name}"/>
                <div class="absolute top-3 left-3 bg-primary text-white font-label-md text-label-md px-2 py-1 uppercase">${p.status}</div>
            </div>
            <p class="font-label-md text-label-md text-secondary mb-1 uppercase">${p.category}</p>
            <h3 class="font-headline-sm text-headline-sm mb-3 truncate">${p.name}</h3>
            <span class="font-bold text-primary">S/ ${p.price.toFixed(2)}</span>
        </div>
    `).join('') || `<p class="p-4 text-secondary">No hay productos destacados.</p>`;
}

async function filtrarCatalogo() {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;

    const productos = await obtenerProductosDesdeAPI();
    const params = new URLSearchParams(window.location.search);
    const categoriaFiltro = params.get('categoria');

    const productosMostrar = categoriaFiltro 
        ? productos.filter(p => p.category === categoriaFiltro)
        : productos;

    contenedor.innerHTML = productosMostrar.map(p => `
        <div class="product-card group bg-white border border-outline-variant cursor-pointer p-4 hover:shadow-lg transition-shadow" onclick="window.location.href='producto.html?id=${p.id}'">
            <div class="aspect-[4/3] overflow-hidden relative mb-4">
                <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${p.imageUrl}" alt="${p.name}"/>
            </div>
            <p class="font-label-md text-label-md text-secondary mb-1 uppercase">${p.category}</p>
            <h3 class="font-headline-sm text-headline-sm mb-3 truncate">${p.name}</h3>
            <span class="font-bold text-primary">S/ ${p.price.toFixed(2)}</span>
        </div>
    `).join('') || `<p class="p-4 text-secondary">No hay productos en la base de datos.</p>`;
}

async function cargarDetalleProducto(id) {
    const productos = await obtenerProductosDesdeAPI();
    const p = productos.find(prod => prod.id === id);
    if (!p) return;

    if(document.getElementById('prod-titulo')) document.getElementById('prod-titulo').textContent = p.name;
    if(document.getElementById('prod-migas-titulo')) document.getElementById('prod-migas-titulo').textContent = p.name;
    if(document.getElementById('prod-precio')) document.getElementById('prod-precio').textContent = `S/ ${p.price.toFixed(2)}`;
    if(document.getElementById('prod-categoria')) document.getElementById('prod-categoria').textContent = p.category;
    if(document.getElementById('prod-estado')) document.getElementById('prod-estado').textContent = p.status;
    if(document.getElementById('prod-descripcion')) document.getElementById('prod-descripcion').textContent = p.description;
    
    const migaCat = document.getElementById('prod-migas-categoria');
    if(migaCat) {
        migaCat.textContent = p.category;
        migaCat.href = `catalogo.html?categoria=${p.category}`;
    }

    const imgElement = document.getElementById('prod-imagen');
    if(imgElement) {
        imgElement.src = p.imageUrl;
        imgElement.alt = p.name;
    }

    const btnCarrito = document.getElementById('btn-agregar-carrito');
    if(btnCarrito) {
        btnCarrito.onclick = () => agregarAlCarrito(p.id, p.name, p.price, p.category, p.imageUrl);
    }
}

async function manejarEnvioAdmin(event) {
    event.preventDefault();
    const nuevoProducto = {
        name: document.getElementById('p-nombre').value,
        price: parseFloat(document.getElementById('p-precio').value),
        category: document.getElementById('p-cat').value,
        status: document.getElementById('p-estado').value,
        imageUrl: document.getElementById('p-img').value,
        description: document.getElementById('p-desc').value
    };

    const exito = await guardarProductoEnAPI(nuevoProducto);
    if (exito) {
        alert('Producto agregado exitosamente a la base de datos.');
        event.target.reset();
    } else {
        alert('Error al agregar el producto.');
    }
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
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    document.querySelectorAll('.cart-counter').forEach(el => el.innerText = totalItems);
}

function renderizarCarrito() {
    let carrito = JSON.parse(localStorage.getItem('utp_cart')) || [];
    const contenedor = document.getElementById('cart-items');
    const emptyState = document.getElementById('empty-cart');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotal = document.getElementById('summary-total');
    const summarySection = document.getElementById('order-summary');
    
    if (!contenedor) return;

    if (carrito.length === 0) {
        contenedor.classList.add('hidden');
        if (emptyState) emptyState.classList.remove('hidden');
        if (summarySection) {
            summarySection.style.opacity = '0.5';
            summarySection.style.pointerEvents = 'none';
        }
        if (summarySubtotal) summarySubtotal.innerText = 'S/ 0.00';
        if (summaryTotal) summaryTotal.innerText = 'S/ 0.00';
        return;
    }

    
    contenedor.classList.remove('hidden');
    if (emptyState) emptyState.classList.add('hidden');
    if (summarySection) {
        summarySection.style.opacity = '1';
        summarySection.style.pointerEvents = 'auto';
    }

    let subtotal = 0;

    
    contenedor.innerHTML = carrito.map((item, index) => {
        subtotal += (item.precio * item.cantidad);
        return `
        <div class="item-row border p-4 flex items-center bg-white rounded shadow-sm mb-4">
            <img class="w-16 h-16 object-cover rounded" src="${item.imagen}"/>
            <div class="ml-4 flex-grow">
                <h3 class="font-bold text-on-surface">${item.nombre}</h3>
                <span class="text-primary font-semibold">S/ ${item.precio.toFixed(2)}</span>
            </div>
            <div class="flex items-center gap-4">
                <span class="text-secondary text-sm">Cant: ${item.cantidad}</span>
                <button class="text-error font-bold text-sm hover:underline" onclick="eliminarItem(${index})">Eliminar</button>
            </div>
        </div>
        `;
    }).join('');

    
    if (summarySubtotal) summarySubtotal.innerText = `S/ ${subtotal.toFixed(2)}`;
    if (summaryTotal) summaryTotal.innerText = `S/ ${subtotal.toFixed(2)}`;
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
    if(document.getElementById('empty-cart')) {
        document.getElementById('empty-cart').classList.remove('hidden');
        document.getElementById('cart-items').classList.add('hidden');
    }
}

function actualizarMenuActivo() {
    const cat = new URLSearchParams(window.location.search).get('categoria');
    document.querySelectorAll('nav a').forEach(enlace => {
        enlace.classList.remove('text-primary', 'border-b-2', 'border-primary', 'font-bold');
        if (cat && enlace.textContent.trim() === cat) {
            enlace.classList.add('text-primary', 'border-b-2', 'border-primary', 'font-bold');
        }
    });
}
async function cargarDestacados(pagina = 1) {
    const contenedor = document.getElementById('contenedor-destacados');
    const contenedorPaginacion = document.getElementById('paginacion-destacados');
    if (!contenedor) return;

    
    let productos = await obtenerProductosDesdeAPI();
    productos = productos.reverse(); 

    
    const itemsPorPagina = 3;
    const totalPaginas = Math.ceil(productos.length / itemsPorPagina);
    
    
    const inicio = (pagina - 1) * itemsPorPagina;
    const fin = inicio + itemsPorPagina;
    const destacados = productos.slice(inicio, fin);

    
    contenedor.innerHTML = destacados.map(p => `
        <div class="product-card group bg-white border border-outline-variant cursor-pointer p-4 hover:shadow-lg transition-shadow" onclick="window.location.href='producto.html?id=${p.id}'">
            <div class="aspect-[4/3] overflow-hidden relative mb-4">
                <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${p.imageUrl}" alt="${p.name}"/>
                <div class="absolute top-3 left-3 bg-primary text-white font-label-md text-label-md px-2 py-1 uppercase">${p.status}</div>
            </div>
            <p class="font-label-md text-label-md text-secondary mb-1 uppercase">${p.category}</p>
            <h3 class="font-headline-sm text-headline-sm mb-3 truncate">${p.name}</h3>
            <span class="font-bold text-primary">S/ ${p.price.toFixed(2)}</span>
        </div>
    `).join('') || `<p class="p-4 text-secondary">No hay productos destacados.</p>`;

    
    if (contenedorPaginacion && totalPaginas > 1) {
        let botonesHTML = '';
        for (let i = 1; i <= totalPaginas; i++) {
            
            const clasesBoton = i === pagina 
                ? 'bg-primary text-white border-primary' 
                : 'bg-white text-secondary border-outline-variant hover:border-primary'; 
            
            botonesHTML += `<button onclick="cargarDestacados(${i})" class="w-10 h-10 flex items-center justify-center border rounded transition-colors font-bold ${clasesBoton}">${i}</button>`;
        }
        contenedorPaginacion.innerHTML = botonesHTML;
    } else if (contenedorPaginacion) {
        
        contenedorPaginacion.innerHTML = '';
    }
}
