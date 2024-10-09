import React, { useState, useEffect } from 'react';
import OrchestratorService from '../services/OrchestratorService';
import ProductService from '../services/ProductService';

const CrearProducto = () => {
  const [productData, setProductData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoriaId: ''
  });

  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Cargar productos existentes
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const data = await ProductService.getAllProducts(1, 6); 
      console.log(data); // Verificar si está recibiendo los productos
      setProductos(data.content);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await OrchestratorService.createProduct(productData);
      alert('Producto creado exitosamente');
      setProductData({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoriaId: ''
      });
      fetchProductos(); // Volver a cargar la lista de productos
    } catch (error) {
      console.error('Error al crear producto:', error);
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
      <div className="p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">Productos Creados</h2>
        <ul>
          {productos.map((producto) => (
            <li key={producto.id} className="border-b py-2">
              {producto.nombre} - S/{producto.precio}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CrearProducto;
