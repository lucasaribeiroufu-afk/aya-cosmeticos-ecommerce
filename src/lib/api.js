// src/lib/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const api = {
  products: {
    get: async (slug) => {
      const response = await fetch(`${API_BASE_URL}/api/products/${slug}`);
      if (!response.ok) throw new Error('Produto não encontrado');
      return response.json();
    }
  },
  shop: {
    getCatalog: async () => {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/products?active=true&sort=-created_date&limit=60`),
        fetch(`${API_BASE_URL}/api/categories?sort=-sort_order&limit=50`)
      ]);

      if (!productsRes.ok || !categoriesRes.ok) {
        throw new Error('Falha na resposta da API');
      }

      const [products, categories] = await Promise.all([
        productsRes.json(),
        categoriesRes.json()
      ]);

      return {
        products: Array.isArray(products) ? products : [],
        categories: Array.isArray(categories) ? categories : []
      };
    }
  },
  auth: {
    register: async (userData) => {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!response.ok) throw new Error('Erro ao criar conta');
      return response.json();
    },
    resetPassword: async (token, password) => {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      if (!response.ok) throw new Error('Erro ao redefinir a senha');
      return response.json();
    }
  }
};
