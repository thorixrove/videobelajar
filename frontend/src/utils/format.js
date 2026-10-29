// 300000 -> "Rp 300K"
export const formatPrice = (value) =>
  value >= 1000 ? `Rp ${Math.round(value / 1000)}K` : `Rp ${value}`;
