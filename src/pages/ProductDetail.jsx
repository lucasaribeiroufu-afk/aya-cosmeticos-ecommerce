// src/pages/ProductDetail.jsx
import { api } from '@/lib/api'; // Importa a central de serviço

// ... dentro do seu componente
useEffect(() => {
  const fetchProductDetail = async () => {
    setLoading(true);
    try {
      // Agora você usa a abstração e não fetch direto ou mocks aqui
      const data = await api.products.get(slug);
      setProduct(data);
    } catch (err) {
      console.error('Erro ao carregar detalhes do produto', err);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  fetchProductDetail();
}, [slug]);
