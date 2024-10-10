import React, { useState, useEffect } from 'react';
import OrchestratorService from '../services/OrchestratorService';
import ProductService from '../services/ProductService';
import { useParams } from 'react-router-dom';

const CrearProducto = () => {
  const { id: adminId } = useParams();
  const [productData, setProductData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoriaId: ''
  });

  const [productos, setProductos] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  useEffect(() => {
    // Cargar productos existentes
    fetchProductos();
  }, [page]);

  const fetchProductos = async () => {
    try {
      const data = await ProductService.getAllProducts(page, size); // Paginación dinámica
      setProductos(data.content); // Actualizar con las categorías recibidas
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newProductoData = { ...productData, adminId }; 
      await OrchestratorService.createProduct(newProductoData);
      alert('Producto creado exitosamente');
      setProductData({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoriaId: ''
      });
      setPage(0);
      fetchProductos();  // Volver a cargar la lista de productos
    } catch (error) {
      console.error('Error al crear producto:', error);
    }
  };

  const handleDelete = async (productoId) => {
    try {
      await OrchestratorService.deleteProduct({ adminId, productoId });
      alert('Producto eliminado exitosamente');
      fetchProductos();
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Formulario para crear producto */}
      <form onSubmit={handleSubmit} className="p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">Crear Producto</h2>
        <input 
          type="text" 
          placeholder="Nombre del Producto" 
          value={productData.nombre} 
          onChange={(e) => setProductData({ ...productData, nombre: e.target.value })} 
          className="mb-4 px-4 py-2 border rounded w-full"
        />
        <textarea 
          placeholder="Descripción" 
          value={productData.descripcion} 
          onChange={(e) => setProductData({ ...productData, descripcion: e.target.value })} 
          className="mb-4 px-4 py-2 border rounded w-full"
        />
        <input 
          type="number" 
          placeholder="Precio" 
          value={productData.precio} 
          onChange={(e) => setProductData({ ...productData, precio: e.target.value })} 
          className="mb-4 px-4 py-2 border rounded w-full"
        />
        <input 
          type="number" 
          placeholder="Stock" 
          value={productData.stock} 
          onChange={(e) => setProductData({ ...productData, stock: e.target.value })} 
          className="mb-4 px-4 py-2 border rounded w-full"
        />
        <input 
          type="number" 
          placeholder="Categoría ID" 
          value={productData.categoriaId} 
          onChange={(e) => setProductData({ ...productData, categoriaId: e.target.value })} 
          className="mb-4 px-4 py-2 border rounded w-full"
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Crear Producto
        </button>
      </form>

      {/* Lista de productos */}
      <div className="p-4 bg-white shadow-lg rounded-lg max-h-96 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Productos Creados</h2>
        <ul>
          {productos.map((producto) => (
            <li key={producto.id} className="flex justify-between items-center border-b py-2">
              {producto.nombre}
              <button
                onClick={() => handleDelete(producto.id)}
                className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded">
                Eliminar
              </button>
            </li>
          ))}
        </ul>
        {/* Botones de paginación */}
        <div className="flex justify-between mt-4">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
            Anterior
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrearProducto;
