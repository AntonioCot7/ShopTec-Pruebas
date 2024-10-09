import React, { useState } from 'react';

const WelcomeModal = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">¡Bienvenido al Panel de Administrador!</h2>
        <p className="mb-6">Aquí podrás gestionar los productos y categorías de la plataforma. Haz clic en "Aceptar" para continuar.</p>
        <button
          onClick={handleClose}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;
