import React from 'react';
import { Heart, Plus, Eye, Star } from 'lucide-react';
import { Product, CurrencyConfig } from '../types/store';
import { formatPrice } from '../utils/format';

interface ProductCardProps {
  product: Product;
  currency: CurrencyConfig;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onQuickAdd,
}) => {
  return (
    <article className="group flex flex-col bg-[#FAF9F5] border border-[#E7E3D8] hover:border-[#1C1A17] transition-all duration-300 relative">
      {/* Visual Slot (Aspect 4:3) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F3F1EA]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.parentElement?.querySelector('.card-fallback');
            if (fallback) fallback.classList.remove('hidden');
          }}
        />

        {/* Fallback container */}
        <div className="card-fallback hidden absolute inset-0 bg-[#E8E4DA] flex flex-col items-center justify-center p-4 text-center">
          <span className="text-xs uppercase tracking-wider text-[#736F66]">{product.categoryLabel}</span>
          <p className="font-serif text-sm text-[#1C1A17] mt-1">{product.name}</p>
        </div>

        {/* Quiet Subtle Badge (Max 1, unboxed text or minimal strip, no candy pill) */}
        {product.isLimited ? (
          <div className="absolute top-3 left-3 bg-[#1C1A17] text-[#FAF9F5] text-[10px] tracking-widest uppercase font-mono px-2 py-0.5">
            Limited Batch
          </div>
        ) : product.isNew ? (
          <div className="absolute top-3 left-3 bg-[#FAF9F5] text-[#1C1A17] border border-[#E7E3D8] text-[10px] tracking-widest uppercase font-mono px-2 py-0.5">
            Spring 26
          </div>
        ) : null}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all cursor-pointer ${
            isWishlisted
              ? 'bg-[#1C1A17] text-[#FAF9F5]'
              : 'bg-[#FAF9F5]/90 text-[#4A4742] hover:text-[#1C1A17] hover:bg-white shadow-sm'
          }`}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Quick Actions Bar */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onQuickView(product)}
            className="flex-1 py-2 px-3 bg-[#FAF9F5]/95 hover:bg-white text-[#1C1A17] text-[11px] font-medium tracking-wider uppercase border border-[#E7E3D8] flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
          <button
            onClick={() => onQuickAdd(product)}
            className="py-2 px-3 bg-[#1C1A17] hover:bg-[#2F2C27] text-[#FAF9F5] text-[11px] font-medium tracking-wider uppercase flex items-center justify-center shadow-sm transition-colors cursor-pointer"
            aria-label={`Quick add ${product.name} to bag`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content & Metadata Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Category & Rating: Unboxed text metadata */}
          <div className="flex items-center justify-between text-xs text-[#7A766C] mb-1.5">
            <span className="tracking-widest uppercase text-[11px] font-medium">{product.categoryLabel}</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-[#1C1A17] text-[#1C1A17]" />
              <span className="font-mono text-[11px] tabular-nums text-[#1C1A17] font-medium">{product.rating}</span>
              <span className="text-[10px] text-[#8E8A80]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h2
            onClick={() => onQuickView(product)}
            className="text-base font-serif font-medium text-[#1C1A17] tracking-tight hover:underline cursor-pointer line-clamp-1"
          >
            {product.name}
          </h2>

          <p className="text-xs text-[#636056] line-clamp-1 mt-1 font-light">
            {product.tagline}
          </p>
        </div>

        {/* Footer info: Variant swatches + Price */}
        <div className="pt-3 border-t border-[#EFECE4] flex items-center justify-between">
          {/* Swatches preview if variants exist */}
          <div className="flex items-center gap-1.5">
            {product.variants?.[0]?.options ? (
              product.variants[0].options.slice(0, 3).map((opt) => (
                <span
                  key={opt.value}
                  className="w-2.5 h-2.5 rounded-full border border-[#D5CFC2]"
                  style={{ backgroundColor: opt.hex || '#CCCCCC' }}
                  title={opt.label}
                />
              ))
            ) : (
              <span className="text-[11px] text-[#8E8A80] font-mono uppercase">{product.origin.split(',')[0]}</span>
            )}
          </div>

          {/* Price with tabular numerals */}
          <div className="flex items-center gap-2">
            {product.originalPrice && (
              <span className="text-xs text-[#9E9A90] line-through font-mono tabular-nums">
                {formatPrice(product.originalPrice, currency)}
              </span>
            )}
            <span className="text-sm font-semibold font-mono tabular-nums text-[#1C1A17]">
              {formatPrice(product.price, currency)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
