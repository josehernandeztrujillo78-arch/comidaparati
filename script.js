document.addEventListener('DOMContentLoaded', () => {
  const carrito = [];

  const itemsCarrito = document.getElementById('items-carrito');
  const totalCarrito = document.querySelector('.carrito-total');
  const botonVaciar = document.querySelector('.carrito-vaciar');
  const btnWhatsapp = document.getElementById('btn-whatsapp');

  function actualizarCarrito() {
    itemsCarrito.innerHTML = '';
    let total = 0;

    carrito.forEach((item, index) => {
      const subtotal = item.precio * item.cantidad;
      total += subtotal;

      const div = document.createElement('div');
      div.classList.add('carrito-item');
      div.style.display = 'flex';
      div.style.alignItems = 'center';
      div.style.justifyContent = 'space-between';
      div.style.marginBottom = '5px';

      // Imagen
      const img = document.createElement('img');
      img.src = item.img;
      img.alt = item.nombre;
      img.style.width = '40px';
      img.style.height = '40px';
      img.style.objectFit = 'cover';
      img.style.marginRight = '10px';
      img.style.borderRadius = '5px';

      // Nombre, cantidad, subtotal
      const info = document.createElement('div');
      info.style.flexGrow = '1';
      info.innerHTML = `
        <strong>${item.nombre}</strong><br>
        Cantidad: ${item.cantidad} - Subtotal: $${subtotal} MXN
      `;

      // Controles de cantidad
      const controles = document.createElement('div');
      controles.style.display = 'flex';
      controles.style.gap = '5px';
      controles.innerHTML = `
        <button class="btn-menos" data-index="${index}">−</button>
        <button class="btn-mas" data-index="${index}">+</button>
        <button class="btn-eliminar" data-index="${index}">🗑️</button>
      `;

      // Estilos básicos de botones
      controles.querySelectorAll('button').forEach(btn => {
        btn.style.padding = '4px 8px';
        btn.style.border = 'none';
        btn.style.borderRadius = '3px';
        btn.style.cursor = 'pointer';
        btn.style.fontWeight = 'bold';
        btn.style.backgroundColor = '#ccc';
      });

      div.appendChild(img);
      div.appendChild(info);
      div.appendChild(controles);
      itemsCarrito.appendChild(div);
    });

    totalCarrito.textContent = 'Total: $' + total + ' MXN';

    // Mensaje WhatsApp
    if (carrito.length > 0) {
      let mensaje = carrito.map(p => `${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad} MXN`).join('%0A');
      btnWhatsapp.href = `https://wa.me/524446410096?text=Hola, quisiera ordenar:%0A${mensaje}%0ATotal: $${total} MXN`;
    } else {
      btnWhatsapp.href = '#';
    }

    // Agregar eventos a botones de cantidad
    document.querySelectorAll('.btn-mas').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        carrito[index].cantidad++;
        actualizarCarrito();
      });
    });

    document.querySelectorAll('.btn-menos').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        if (carrito[index].cantidad > 1) {
          carrito[index].cantidad--;
        } else {
          carrito.splice(index, 1);
        }
        actualizarCarrito();
      });
    });

    document.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        carrito.splice(index, 1);
        actualizarCarrito();
      });
    });
  }

  function agregarAlCarrito(nombre, precio, img) {
    const itemExistente = carrito.find(item => item.nombre === nombre);
    if (itemExistente) {
      itemExistente.cantidad++;
    } else {
      carrito.push({ nombre, precio, img, cantidad: 1 });
    }
    actualizarCarrito();
  }

  // Botones "Agregar al carrito"
  document.querySelectorAll('.agregar-carrito').forEach(button => {
    button.addEventListener('click', () => {
      const nombre = button.dataset.producto;
      const precio = parseFloat(button.dataset.precio);
      const img = button.closest('.producto').querySelector('img').src;

      agregarAlCarrito(nombre, precio, img);
    });
  });

  // Vaciar carrito
  botonVaciar.addEventListener('click', () => {
    carrito.length = 0;
    actualizarCarrito();
  });
});
