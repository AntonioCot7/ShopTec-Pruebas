import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ProductService from '../services/ProductService'; 
import CartService from '../services/CartService'; // Importar el servicio CartService

// Importar imágenes
import img1 from '../assets/portada1.png';
import img2 from '../assets/portada2.png';
import img3 from '../assets/portada3.png';
import img4 from '../assets/portada4.png';
import img5 from '../assets/portada5.png';
import img6 from '../assets/portada6.png';
import img7 from '../assets/portada7.png';
import img8 from '../assets/portada8.png';

const PortadaPrincipal = () => {
  const [products, setProducts] = useState([]); // Almacena los productos
  const [page, setPage] = useState(0); // Controla la página de paginación
  const [loading, setLoading] = useState(false); // Controla el estado de carga
  const [cartId, setCartId] = useState(localStorage.getItem('cartId')); // Estado para almacenar el ID del carrito creado
  const [cartDetailId, setCartDetailId] = useState(localStorage.getItem('cartDetailId')); // Estado para almacenar el ID del detalle del carrito
  const [cart, setCart] = useState([]); // Estado para el carrito
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla si el modal está abierto
  const [selectedProduct, setSelectedProduct] = useState(null); // Almacena el producto seleccionado
  const [quantity, setQuantity] = useState(1); // Cantidad de productos

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const newProducts = await ProductService.getAllProducts(page, 6); 
      setProducts((prevProducts) => [...prevProducts, ...newProducts.content]); 
      setPage(page + 1); // Incrementar la página
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
    setLoading(false);
  };

  // Función para crear un carrito y el primer detalle del carrito
  const createCart = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('Por favor inicia sesión antes de crear el carrito.');
        return;
      }

      const cartData = { usuario_id: userId };
      const createdCart = await CartService.createCart(cartData);
      console.log("Carrito creado:", createdCart);

      const newCartId = createdCart._id;
      localStorage.setItem('cartId', newCartId); // Guardar en localStorage
      setCartId(newCartId);

      // Crear el primer detalle del carrito
      const cartDetailData = {
        productos: [],
      };
      const createdCartDetail = await CartService.createCartDetail(cartDetailData);
      console.log("Detalle de carrito creado:", createdCartDetail);

      const newCartDetailId = createdCartDetail._id; // Guardar ID del detalle de carrito
      localStorage.setItem('cartDetailId', newCartDetailId);
      setCartDetailId(newCartDetailId);

      alert("Carrito y detalles creados exitosamente.");
    } catch (error) {
      console.error("Error al crear carrito:", error);
      alert("Hubo un error al crear el carrito.");
    }
  };

  // Función para añadir productos al detalle del carrito existente
  const addToCartDetail = async () => {
    if (!cartDetailId) {
      alert("Primero debes crear un carrito.");
      return;
    }

    try {
      const productData = {
        producto_id: selectedProduct.id,
        cantidad: parseInt(quantity, 10),
        precioUnitario: selectedProduct.precio,
      };

      // Llamar a la función que agrega productos al detalle del carrito existente
      const response = await CartService.addProductToCartDetail(cartDetailId, productData);
      console.log("Producto añadido al carrito existente:", response);

      // Actualizar el estado del carrito
      setCart((prevCart) => [...prevCart, { ...selectedProduct, cantidad: quantity }]);
      alert(`${quantity} unidades de "${selectedProduct.nombre}" han sido añadidas al carrito.`);
      closeModal();
    } catch (error) {
      console.error("Error al añadir producto al carrito:", error);
      alert("Hubo un error al añadir el producto al carrito.");
    }
  };

  // Función para eliminar el carrito y sus detalles
  const deleteCart = async () => {
    try {
      if (!cartId) {
        alert("No hay carrito para eliminar.");
        return;
      }
      // Eliminar detalle del carrito
      await CartService.deleteCartDetail(cartDetailId);
      console.log("Detalle de carrito eliminado");

      // Eliminar carrito
      await CartService.deleteCart(cartId);
      console.log("Carrito eliminado");

      // Limpiar los estados y localStorage
      setCartId(null);
      setCartDetailId(null);
      setCart([]);
      localStorage.removeItem('cartId');
      localStorage.removeItem('cartDetailId');
      alert("Carrito y detalles eliminados correctamente.");
    } catch (error) {
      console.error("Error al eliminar el carrito y sus detalles:", error);
      alert("Hubo un error al eliminar el carrito y sus detalles.");
    }
  };

  // Función para marcar el carrito como pagado
  const markCartAsPaid = async () => {
    try {
      if (!cartId) {
        alert("No hay carrito para realizar el pedido.");
        return;
      }

      const response = await CartService.markCartAsPaid(cartId);
      console.log("Carrito marcado como pagado:", response);
      alert("El pedido ha sido realizado con éxito.");
      setCartId(null);
      setCartDetailId(null);
      setCart([]);
      localStorage.removeItem('cartId');
      localStorage.removeItem('cartDetailId');
      // Aquí podrías limpiar el carrito si lo deseas
    } catch (error) {
      console.error("Error al realizar el pedido:", error);
      alert("Hubo un error al realizar el pedido.");
    }
  };

  // Modal para añadir productos
  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  return (
    <div className="w-screen min-h-screen bg-gray-100">
      {/* Botones para crear carrito, eliminar y realizar pedido */}
      <div className="flex justify-center space-x-4 my-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={createCart}
        >
          Crear Carrito
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={deleteCart}
        >
          Eliminar Carrito
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={markCartAsPaid}
          disabled={!cartId} // Desactivar si no hay carrito
        >
          Realizar Pedido
        </button>
      </div>

      {/* Slider de Portadas */}
      <div className="w-full h-auto">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          className="mySwiper"
        >
          <SwiperSlide><img src={img1} alt="Portada 1" className="w-full h-full object-cover" /></SwiperSlide>
          <SwiperSlide><img src={img2} alt="Portada 2" className="w-full h-full object-cover" /></SwiperSlide>
          <SwiperSlide><img src={img3} alt="Portada 3" className="w-full h-full object-cover" /></SwiperSlide>
          <SwiperSlide><img src={img4} alt="Portada 4" className="w-full h-full object-cover" /></SwiperSlide>
          <SwiperSlide><img src={img5} alt="Portada 5" className="w-full h-full object-cover" /></SwiperSlide>
          <SwiperSlide><img src={img6} alt="Portada 6" className="w-full h-full object-cover" /></SwiperSlide>
          <SwiperSlide><img src={img7} alt="Portada 7" className="w-full h-full object-cover" /></SwiperSlide>
          <SwiperSlide><img src={img8} alt="Portada 8" className="w-full h-full object-cover" /></SwiperSlide>
        </Swiper>
      </div>

      {/* Lista de productos */}
      <div className="container mx-auto py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-2">
        {products.map((product, index) => (
          <div key={`product-${product.id}-${index}`} className="border p-4 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">{product.nombre}</h3>
            <p className="text-gray-700 mb-2">{product.descripcion}</p>
            <p className="text-green-600 font-bold text-lg">S/{product.precio}</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700 transition"
              onClick={() => openModal(product)}
            >
              Añadir al carrito
            </button>
          </div>
        ))}
      </div>

      {loading && <p className="text-center mt-5">Cargando productos...</p>}

      {/* Modal para seleccionar la cantidad */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Selecciona la cantidad</h2>
            <p className="text-lg text-gray-700 mb-4">{selectedProduct?.nombre}</p>
            <input
              type="number"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={addToCartDetail}
              >
                Añadir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mostrar el carrito */}
      <div className="container mx-auto p-4 mt-4 bg-white shadow rounded">
        <h3 className="text-xl font-bold mb-4">Carrito de compras</h3>
        {cart.length > 0 ? (
          <ul>
            {cart.map((item, index) => (
              <li key={index} className="mb-2">
                {item.cantidad} x {item.nombre} - S/{item.precio}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay productos en el carrito.</p>
        )}
      </div>
    </div>
  );
};

export default PortadaPrincipal;
