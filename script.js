// ============================================
// CONFIGURACIÓN - CAMBIA ESTE NÚMERO POR EL REAL
// ============================================
const WHATSAPP_NUMBER = "523313990776"

// Estado del carrito
let carrito = []

// Elementos del DOM
const cartSidebar = document.getElementById("cart-sidebar")
const cartOverlay = document.getElementById("cart-overlay")
const cartItems = document.getElementById("cart-items")
const cartCount = document.getElementById("cart-count")
const cartTotal = document.getElementById("cart-total")
const btnEnviar = document.getElementById("btn-enviar")

// ============================================
// FUNCIONES DEL CARRITO
// ============================================

// Toggle carrito (abrir/cerrar)
function toggleCart() {
  cartSidebar.classList.toggle("active")
  cartOverlay.classList.toggle("active")
  document.body.style.overflow = cartSidebar.classList.contains("active") ? "hidden" : ""
}

// Agregar producto al carrito
function agregarAlCarrito(producto, precio) {
  const existente = carrito.find((item) => item.producto === producto)

  if (existente) {
    existente.cantidad++
  } else {
    carrito.push({ producto, precio, cantidad: 1 })
  }

  actualizarCarrito()

  // Feedback visual en el botón
  const btn = document.querySelector(`[data-producto="${producto}"]`)
  if (btn) {
    btn.textContent = "¡Agregado!"
    btn.classList.add("added")
    setTimeout(() => {
      btn.textContent = "Agregar"
      btn.classList.remove("added")
    }, 1000)
  }
}

// Actualizar cantidad de un producto
function actualizarCantidad(producto, cambio) {
  const item = carrito.find((i) => i.producto === producto)
  if (item) {
    item.cantidad += cambio
    if (item.cantidad <= 0) {
      carrito = carrito.filter((i) => i.producto !== producto)
    }
  }
  actualizarCarrito()
}

// Eliminar producto del carrito
function eliminarDelCarrito(producto) {
  carrito = carrito.filter((item) => item.producto !== producto)
  actualizarCarrito()
}

// Vaciar todo el carrito
function vaciarCarrito() {
  carrito = []
  actualizarCarrito()
}

// Actualizar UI del carrito
function actualizarCarrito() {
  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
  const cantidadTotal = carrito.reduce((sum, item) => sum + item.cantidad, 0)

  cartCount.textContent = cantidadTotal
  cartTotal.textContent = `$${total} MXN`
  btnEnviar.disabled = carrito.length === 0

  if (carrito.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="8" cy="21" r="1"></circle>
          <circle cx="19" cy="21" r="1"></circle>
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
        </svg>
        <p>Tu carrito está vacío</p>
        <p>Agrega productos para comenzar</p>
      </div>
    `
  } else {
    cartItems.innerHTML = carrito
      .map(
        (item) => `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.producto}</h4>
          <span class="item-precio">$${item.precio} MXN</span>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="actualizarCantidad('${item.producto}', -1)">−</button>
            <span class="cart-item-qty">${item.cantidad}</span>
            <button class="qty-btn" onclick="actualizarCantidad('${item.producto}', 1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="eliminarDelCarrito('${item.producto}')">&times;</button>
      </div>
    `,
      )
      .join("")
  }
}

// ============================================
// ENVÍO POR WHATSAPP
// ============================================

function enviarPedido() {
  if (carrito.length === 0) return

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0)

  let mensaje = "¡Hola! Me gustaría hacer el siguiente pedido:\n\n"
  carrito.forEach((item) => {
    mensaje += `• ${item.producto} x${item.cantidad} - $${item.precio * item.cantidad} MXN\n`
  })
  mensaje += `\n*Total: $${total} MXN*`
  mensaje += "\n\n¡Gracias!"

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`
  window.open(url, "_blank")
}

// ============================================
// FILTROS DE CATEGORÍA
// ============================================

function filtrarProductos(filtro) {
  document.querySelectorAll(".categoria").forEach((cat) => {
    if (filtro === "todos" || cat.dataset.categoria === filtro) {
      cat.style.display = "block"
    } else {
      cat.style.display = "none"
    }
  })
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  // Botón toggle carrito
  document.getElementById("cart-toggle-btn").addEventListener("click", toggleCart)

  // Botón cerrar carrito
  document.getElementById("cart-close-btn").addEventListener("click", toggleCart)

  // Overlay para cerrar carrito
  cartOverlay.addEventListener("click", toggleCart)

  // Botones de agregar al carrito
  document.querySelectorAll(".agregar-carrito").forEach((btn) => {
    btn.addEventListener("click", () => {
      const producto = btn.dataset.producto
      const precio = Number.parseInt(btn.dataset.precio)
      agregarAlCarrito(producto, precio)
    })
  })

  // Filtros de categoría
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")
      filtrarProductos(btn.dataset.filter)
    })
  })

  // Botón enviar pedido
  btnEnviar.addEventListener("click", enviarPedido)

  // Botón vaciar carrito
  document.getElementById("btn-vaciar").addEventListener("click", vaciarCarrito)

  // Botón WhatsApp de la sección
  document.getElementById("btn-whatsapp-section").addEventListener("click", (e) => {
    e.preventDefault()
    if (carrito.length > 0) {
      enviarPedido()
    } else {
      toggleCart()
    }
  })
})
