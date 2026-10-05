import { CurrencyConfig } from '../types/store';

export function formatPrice(amountInUSD: number, currency: CurrencyConfig): string {
  const converted = amountInUSD * currency.rate;
  if (currency.code === 'JPY') {
    return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
  }
  return `${currency.symbol}${converted.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function calculateCartTotals(
  items: { unitPrice: number; quantity: number }[],
  promoCodeDiscountPercent: number = 0,
  promoFixedDiscount: number = 0
) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const percentageDiscount = (subtotal * promoCodeDiscountPercent) / 100;
  const totalDiscount = Math.min(subtotal, percentageDiscount + promoFixedDiscount);
  const discountedSubtotal = Math.max(0, subtotal - totalDiscount);
  // Free shipping over $250
  const shippingThreshold = 250;
  const isFreeShipping = subtotal >= shippingThreshold || items.length === 0;
  const shippingCost = isFreeShipping ? 0 : 25;
  const tax = Number((discountedSubtotal * 0.08).toFixed(2));
  const total = discountedSubtotal + shippingCost + tax;

  return {
    subtotal,
    discount: totalDiscount,
    discountedSubtotal,
    shippingThreshold,
    amountNeededForFreeShipping: Math.max(0, shippingThreshold - subtotal),
    shippingCost,
    tax,
    total,
  };
}
