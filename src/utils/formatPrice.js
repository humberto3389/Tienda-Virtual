/**
 * Formatea un número como precio en Soles Peruanos (PEN)
 * Resultado: "S/ 1,299.00"
 * @param {number} amount - El valor a formatear
 * @returns {string}
 */
export const formatPrice = (amount) => {
  if (amount == null || isNaN(amount)) return 'S/ 0.00';
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Calcula el precio con descuento aplicado
 * @param {number} price - Precio original
 * @param {number} discount - Porcentaje de descuento (0-100)
 * @returns {number}
 */
export const discountedPrice = (price, discount) => {
  if (!discount || discount <= 0) return price;
  return price * (1 - discount / 100);
};
