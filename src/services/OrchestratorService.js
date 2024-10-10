import axios from 'axios';

const API_URL = 'http://ldservidor-2021035466.us-east-1.elb.amazonaws.com:4000'; // URL base de la API

const OrchestratorService = {
  // Obtener mensaje de bienvenida
  getWelcomeMessage: async () => {
    try {
      const response = await axios.get(`${API_URL}/`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el mensaje de bienvenida:', error);
      throw error;
    }
  },

  // Crear una nueva categoría
  createCategory: async (categoryData) => {
    try {
      const response = await axios.post(`${API_URL}/api/orquestador/categorias`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error al crear la categoría:', error);
      throw error;
    }
  },

  // Crear un nuevo producto
  createProduct: async (productData) => {
    try {
      const response = await axios.post(`${API_URL}/api/orquestador/producto`, productData);
      return response.data;
    } catch (error) {
      console.error('Error al crear el producto:', error);
      throw error;
    }
  },

  // Eliminar una categoría
  deleteCategory: async (categoryData) => {
    try {
      const response = await axios.delete(`${API_URL}/api/orquestador/categoria/eliminar`, {
        data: categoryData
      });
      return response.data;
    } catch (error) {
      console.error('Error al eliminar la categoría:', error);
      throw error;
    }
  },

  // Eliminar un producto
  deleteProduct: async (productData) => {
    try {
      const response = await axios.delete(`${API_URL}/api/orquestador/producto/eliminar`, {
        data: productData
      });
      return response.data;
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      throw error;
    }
  },
};

export default OrchestratorService;
