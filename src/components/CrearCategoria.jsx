import React, { useState, useEffect } from 'react';
import OrchestratorService from '../services/OrchestratorService';
import ProductService from '../services/ProductService';

const CrearCategoria = () => {
  const [categoryData, setCategoryData] = useState({
    nombre: '',
    descripcion: ''
  });

  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    // Cargar categorías existentes
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const data = await ProductService.getAllCategories(1, 6); // Cambia la paginación si es necesario
      setCategorias(data.content);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await OrchestratorService.createCategory(categoryData);
      alert('Categoría creada exitosamente');
      setCategoryData({
        nombre: '',
        descripcion: ''
      });
      fetchCategorias(); // Volver a cargar la lista de categorías
    } catch (error) {
      console.error('Error al crear categoría:', error);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Formulario para crear categoría */}
      <form onSubmit={handleSubmit} className="p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">Crear Categoría</h2>
        <input 
          type="text" 
          placeholder="Nombre de la Categoría" 
          value={categoryData.nombre} 
          onChange={(e) => setCategoryData({ ...categoryData, nombre: e.target.value })} 
          className="mb-4 px-4 py-2 border rounded w-full"
        />
        <textarea 
          placeholder="Descripción" 
          value={categoryData.descripcion} 
          onChange={(e) => setCategoryData({ ...categoryData, descripcion: e.target.value })} 
          className="mb-4 px-4 py-2 border rounded w-full"
        />
        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Crear Categoría
        </button>
      </form>

      {/* Lista de categorías */}
      <div className="p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">Categorías Creadas</h2>
        <ul>
          {categorias.map((categoria) => (
            <li key={categoria.id} className="border-b py-2">
              {categoria.nombre}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CrearCategoria;
