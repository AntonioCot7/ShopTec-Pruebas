import React, { useState, useEffect } from 'react';
import OrchestratorService from '../services/OrchestratorService';
import ProductService from '../services/ProductService';
import { useParams } from 'react-router-dom';  // Importar para obtener el id desde la URL

const CrearCategoria = () => {
  const { id: adminId } = useParams(); // Obtener el adminId desde la URL
  const [categoryData, setCategoryData] = useState({
    nombre: '',
    descripcion: ''
  });
  const [categorias, setCategorias] = useState([]);
  const [page, setPage] = useState(0); // Controla la página de paginación
  const [size] = useState(10); // Tamaño de la página

  useEffect(() => {
    // Cargar categorías existentes
    fetchCategorias();
  }, [page]); // Dependencia en page para paginación

  const fetchCategorias = async () => {
    try {
      const data = await ProductService.getAllCategories(page, size); // Paginación dinámica
      setCategorias(data.content); // Actualizar con las categorías recibidas
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Agregar el adminId a los datos de la categoría antes de enviarlo
      const newCategoryData = { ...categoryData, adminId }; 
      await OrchestratorService.createCategory(newCategoryData);
      alert('Categoría creada exitosamente');
      setCategoryData({
        nombre: '',
        descripcion: ''
      });
      setPage(0); // Reiniciar a la primera página después de crear
      fetchCategorias(); // Volver a cargar la lista de categorías
    } catch (error) {
      console.error('Error al crear categoría:', error);
    }
  };

  const handleDelete = async (categoriaId) => {
    try {
      await OrchestratorService.createProduct({ adminId, categoriaId });
      alert('Categoría eliminada exitosamente');
      fetchCategorias(); // Volver a cargar categorías después de eliminar
    } catch (error) {
      console.error('Error al eliminar la categoría:', error);
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
      <div className="p-4 bg-white shadow-lg rounded-lg max-h-96 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Categorías Creadas</h2>
        <ul>
          {categorias.map((categoria) => (
            <li key={categoria.id} className="flex justify-between items-center border-b py-2">
              {categoria.nombre}
              <button
                onClick={() => handleDelete(categoria.id)}
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

export default CrearCategoria;
