import React from 'react';
import { X, Trash2, ShoppingBag, Heart } from 'lucide-react';
import { Product, CurrencyConfig } from '../types/store';
import { formatPrice } from '../utils/format';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  currency: CurrencyConfig;
  onRemoveFromWishlist: (product: Product) => void;
  onMoveToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onRemoveFromWishlist,
  onMoveToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wishlist-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#1C1A17]/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F5] border-l border-[#E7E3D8] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-[#E7E3D8] flex items-center justify-between bg-[#FAF9F5]">
            <div className="flex items-baseline gap-2">
              <h2 id="wishlist-drawer-title" className="text-xl font-serif text-[#1C1A17] font-medium tracking-tight">
                Saved Pieces
              </h2>
              <span className="text-xs text-[#7A766C] font-mono tabular-nums">
                ({items.length} {items.length === 1 ? 'item' : 'items'})
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#55524B] hover:text-[#1C1A17] transition-colors cursor-pointer"
              aria-label="Close wishlist"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-12 h-12 rounded-full border border-[#D5CFC2] flex items-center justify-center text-[#8E8A80] mb-4">
                  <Heart className="w-5 h-5" />
                </div>
                <p className="font-serif text-lg text-[#1C1A17]">No saved items</p>
                <p className="text-xs text-[#7A766C] mt-1 max-w-xs leading-relaxed">
                  Click the heart icon on any piece to save it to your personal architectural registry.
                </p>
              </div>
            ) : (
              items.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 pb-4 border-b border-[#EFECE4] items-start"
                >
                  <div className="w-20 h-20 shrink-0 bg-[#EFECE4] border border-[#E7E3D8] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between h-20">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-serif font-medium text-[#1C1A17] truncate">
                        {product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveFromWishlist(product)}
                        className="text-[#9E9A90] hover:text-[#B33E3E] transition-colors p-0.5"
                        aria-label={`Remove ${product.name} from wishlist`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs font-semibold font-mono tabular-nums text-[#1C1A17]">
                        {formatPrice(product.price, currency)}
                      </span>

                      <button
                        onClick={() => {
                          onMoveToCart(product);
                        }}
                        className="px-3 py-1 bg-[#1C1A17] text-[#FAF9F5] hover:bg-[#2F2C27] text-[11px] uppercase tracking-wider font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
