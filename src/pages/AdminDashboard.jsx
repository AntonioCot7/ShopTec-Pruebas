import React, { useState } from 'react';
import CrearProducto from '../components/CrearProducto';
import CrearCategoria from '../components/CrearCategoria';
import WelcomeModal from '../components/WelcomeModal';

const AdminDashboard = () => {
  const [view, setView] = useState('producto');  // Vista por defecto en 'producto'

  return (
    <div>
      <WelcomeModal /> {/* Mostrar modal de bienvenida */}
      
      {/* Navegación entre Crear Producto y Crear Categoría */}
      <div className="bg-gradient-to-br from-gray-300 to-gray-500 py-8">
        <div className="container mx-auto flex justify-center space-x-6">
          <button 
            className={`py-2 px-4 rounded ${view === 'producto' ? 'bg-blue-500 text-white' : 'bg-white'}`} 
            onClick={() => setView('producto')}
          >
            Crear Producto
          </button>
          <button 
            className={`py-2 px-4 rounded ${view === 'categoria' ? 'bg-green-500 text-white' : 'bg-white'}`} 
            onClick={() => setView('categoria')}
          >
            Crear Categoría
          </button>
        </div>
      </div>

      {/* Contenido de acuerdo a la vista seleccionada */}
      <div className="container mx-auto py-8">
        {view === 'producto' && <CrearProducto />}
        {view === 'categoria' && <CrearCategoria />}
      </div>
    </div>
  );
};

export default AdminDashboard;
