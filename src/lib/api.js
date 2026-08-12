// src/lib/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || ''; // Configure no seu .env

export const api = {
  products: {
    get: async (slug) => {
      // Aqui você coloca a lógica real de fetch
      const response = await fetch(`${API_BASE_URL}/api/products/${slug}`);
      if (!response.ok) throw new Error('Produto não encontrado');
      return response.json();
    }
  }
};
