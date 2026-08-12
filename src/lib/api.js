// src/lib/api.js

// Ajuste a URL base conforme o seu ambiente
const API_BASE_URL = import.meta.env.VITE_API_URL || ''; 

export const api = {
  products: {
    get: async (slug) => {
      // Exemplo de fetch genérico. Se o endpoint retornar erro, ele cai no catch do seu componente.
      const response = await fetch(`${API_BASE_URL}/api/products/${slug}`);
      if (!response.ok) throw new Error('Falha ao buscar produto');
      return response.json();
    }
  }
};
