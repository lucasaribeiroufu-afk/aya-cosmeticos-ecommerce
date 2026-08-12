export function calculateShipping(cep, subtotal = 0) {
  const cleanCep = (cep || '').replace(/\D/g, '');

  // Validação básica de CEP (8 dígitos)
  if (cleanCep.length !== 8) {
    throw new Error('CEP inválido. Insira 8 dígitos.');
  }

  // Regra de Frete Grátis para compras acima de R$ 250,00
  if (subtotal >= 250) {
    return { price: 0, service: 'Frete Grátis', deadline: '3 a 5 dias úteis' };
  }

  // Simulação baseada no primeiro dígito do CEP (Regiões do Brasil)
  const firstDigit = cleanCep.charAt(0);

  // Sudeste (ex: SP, RJ, MG - CEPs iniciados de 0 a 3)
  if (['0', '1', '2', '3'].includes(firstDigit)) {
    return { price: 20.00, service: 'SEDEX / Standard', deadline: '2 a 4 dias úteis' };
  } 
  
  // Demais regiões
  return { price: 35.00, service: 'PAC / Encomenda', deadline: '6 a 10 dias úteis' };
}
