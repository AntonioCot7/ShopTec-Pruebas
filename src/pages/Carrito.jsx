import React, { useState, useEffect } from 'react';
import CartService from '../services/CartService'; // Asegúrate de que el servicio esté bien importado

const Carrito = () => {
  const [carritos, setCarritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId'); // Obtener el userId desde localStorage

  useEffect(() => {
    const fetchCarritos = async () => {
      try {
        if (userId) {
          console.log(userId)
          const carritosData = await CartService.getCartsByUser(userId); // Obtener carritos por userId
          setCarritos(carritosData);
        } else {
          console.error('No se encontró el ID de usuario');
        }
      } catch (error) {
        console.error('Error al obtener los carritos del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarritos();
  }, [userId]);

  if (loading) {
    return <p>Cargando carritos...</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Tus Carritos</h1>
      {carritos.length > 0 ? (
        <ul>
          {carritos.map((carrito) => (
            <li key={carrito._id} className="border p-4 rounded mb-4">
              <h2 className="text-xl">Carrito #{carrito._id}</h2>
              <p>Usuario ID: {carrito.usuario_id}</p>
              <p>Detalle Carrito ID: {carrito.carritoDetalle_id}</p>
              <p>Estado: {carrito.estado}</p>
              <p>Fecha: {new Date(carrito.fecha).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes carritos.</p>
      )}
    </div>
  );
};

export default Carrito;
