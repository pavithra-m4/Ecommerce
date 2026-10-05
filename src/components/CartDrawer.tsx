import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Sparkles, Tag, Check } from 'lucide-react';
import { CartItem, CurrencyConfig } from '../types/store';
import { formatPrice, calculateCartTotals } from '../utils/format';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyConfig;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedToCheckout: () => void;
  promoCode: string;
  onApplyPromoCode: (code: string) => { success: boolean; message: string };
  discountPercent: number;
  fixedDiscount: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  promoCode,
  onApplyPromoCode,
  discountPercent,
  fixedDiscount,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const totals = calculateCartTotals(items, discountPercent, fixedDiscount);
  const totalItemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = onApplyPromoCode(couponInput.trim().toUpperCase());
    setCouponFeedback(res);
  };

  const shippingProgress = Math.min(100, (totals.subtotal / totals.shippingThreshold) * 100);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#1C1A17]/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F5] border-l border-[#E7E3D8] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-[#E7E3D8] flex items-center justify-between bg-[#FAF9F5]">
            <div className="flex items-baseline gap-2">
              <h2 id="cart-drawer-title" className="text-xl font-serif text-[#1C1A17] font-medium tracking-tight">
                Shopping Bag
              </h2>
              <span className="text-xs text-[#7A766C] font-mono tabular-nums">
                ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#55524B] hover:text-[#1C1A17] transition-colors cursor-pointer"
              aria-label="Close bag drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Ribbon */}
          <div className="bg-[#F3F1EA] px-5 py-3 border-b border-[#E7E3D8]">
            <div className="flex items-center justify-between text-xs text-[#4A4742] mb-1.5">
              {totals.amountNeededForFreeShipping > 0 ? (
                <span>
                  Add <strong className="font-mono text-[#1C1A17]">{formatPrice(totals.amountNeededForFreeShipping, currency)}</strong> more for complimentary courier
                </span>
              ) : (
                <span className="text-[#2F613B] font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Unlocked: Complimentary Worldwide Express Delivery
                </span>
              )}
            </div>
            <div className="w-full bg-[#DDD7CA] h-1.5 overflow-hidden">
              <div
                className="bg-[#1C1A17] h-full transition-all duration-300"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-12 h-12 rounded-full border border-[#D5CFC2] flex items-center justify-center text-[#8E8A80] mb-4">
                  <Tag className="w-5 h-5" />
                </div>
                <p className="font-serif text-lg text-[#1C1A17]">Your bag is empty</p>
                <p className="text-xs text-[#7A766C] mt-1 max-w-xs leading-relaxed">
                  Discover our collection of handcrafted lighting, seating, and stoneware vessels.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-2.5 bg-[#1C1A17] text-[#FAF9F5] text-xs uppercase tracking-widest font-medium hover:bg-[#2F2C27] transition-colors cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-4 border-b border-[#EFECE4] items-start group"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 shrink-0 bg-[#EFECE4] border border-[#E7E3D8] overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-20">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-serif font-medium text-[#1C1A17] truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#9E9A90] hover:text-[#B33E3E] transition-colors p-0.5 cursor-pointer"
                          aria-label={`Remove ${item.product.name} from bag`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant tags */}
                      {item.selectedVariant && Object.keys(item.selectedVariant).length > 0 && (
                        <p className="text-[11px] text-[#7A766C] mt-0.5 font-light">
                          {Object.entries(item.selectedVariant)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(' · ')}
                        </p>
                      )}
                    </div>

                    {/* Stepper + Subtotal */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center border border-[#D5CFC2] bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-[#656157] hover:text-[#1C1A17]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-mono tabular-nums text-[#1C1A17]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-[#656157] hover:text-[#1C1A17]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-semibold font-mono tabular-nums text-[#1C1A17]">
                        {formatPrice(item.unitPrice * item.quantity, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#E7E3D8] bg-[#FAF9F5] space-y-4">
              {/* Promo code form */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. WELCOME10, SPRING)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-[#D5CFC2] text-xs text-[#1C1A17] uppercase tracking-wider focus:outline-none focus:border-[#1C1A17]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#FAF9F5] hover:bg-[#F3F1EA] text-[#1C1A17] border border-[#1C1A17] text-xs uppercase tracking-wider font-medium cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponFeedback && (
                  <p
                    className={`text-[11px] ${
                      couponFeedback.success ? 'text-[#2F613B]' : 'text-[#B33E3E]'
                    }`}
                  >
                    {couponFeedback.message}
                  </p>
                )}
                {promoCode && (
                  <div className="flex items-center justify-between text-xs bg-[#F3F1EA] px-2.5 py-1 text-[#2F613B]">
                    <span>Applied Code: {promoCode}</span>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#5D5950] border-t border-[#EFECE4] pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-[#1C1A17]">
                    {formatPrice(totals.subtotal, currency)}
                  </span>
                </div>

                {totals.discount > 0 && (
                  <div className="flex justify-between text-[#2F613B]">
                    <span>Promotional Savings</span>
                    <span className="font-mono tabular-nums">
                      -{formatPrice(totals.discount, currency)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Insured Express Courier</span>
                  <span className="font-mono tabular-nums text-[#1C1A17]">
                    {totals.shippingCost === 0 ? 'Complimentary' : formatPrice(totals.shippingCost, currency)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-mono tabular-nums text-[#1C1A17]">
                    {formatPrice(totals.tax, currency)}
                  </span>
                </div>

                <div className="flex justify-between pt-2 border-t border-[#E7E3D8] text-sm font-semibold text-[#1C1A17]">
                  <span className="font-serif">Estimated Total</span>
                  <span className="font-mono tabular-nums text-base">
                    {formatPrice(totals.total, currency)}
                  </span>
                </div>
              </div>

              {/* Checkout Action */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-4 bg-[#1C1A17] hover:bg-[#2F2C27] text-[#FAF9F5] text-xs uppercase tracking-widest font-medium transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-[#8E8A80] tracking-wide">
                Insured worldwide transit · 30-day effortless returns
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
