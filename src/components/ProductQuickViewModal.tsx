import React, { useState, useEffect } from 'react';
import { X, Star, Check, Shield, Truck, RotateCcw, ChevronDown, Plus, Minus, Heart } from 'lucide-react';
import { Product, CurrencyConfig, ProductReview } from '../types/store';
import { formatPrice } from '../utils/format';

interface ProductQuickViewModalProps {
  product: Product | null;
  currency: CurrencyConfig;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, variant: { [key: string]: string }, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddReview: (productId: string, review: Omit<ProductReview, 'id' | 'date'>) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  currency,
  isOpen,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  onAddReview,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'shipping' | 'reviews'>('details');

  // Review form states
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setQuantity(1);
      setActiveTab('details');
      setReviewSubmitted(false);

      // Initialize default variants
      const defaults: { [key: string]: string } = {};
      product.variants?.forEach((v) => {
        const firstInStock = v.options.find((o) => o.inStock) || v.options[0];
        if (firstInStock) {
          defaults[v.name] = firstInStock.label;
        }
      });
      setSelectedVariants(defaults);
    }
  }, [product]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;
    onAddReview(product.id, {
      author: newAuthor.trim(),
      rating: newRating,
      comment: newComment.trim(),
      verified: true,
    });
    setNewAuthor('');
    setNewComment('');
    setReviewSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#1C1A17]/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Modal Container */}
      <div className="relative bg-[#FAF9F5] w-full max-w-4xl max-h-[92vh] overflow-y-auto border border-[#E7E3D8] shadow-2xl z-10 flex flex-col my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#4A4742] hover:text-[#1C1A17] bg-[#FAF9F5]/90 rounded-none border border-[#E7E3D8] transition-colors cursor-pointer"
          aria-label="Close product preview"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 min-h-0">
          {/* Left Column: Image Gallery (Contiguous Layout) */}
          <div className="md:col-span-6 p-6 sm:p-8 bg-[#F3F1EA] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E7E3D8]">
            <div className="relative aspect-[4/3] w-full bg-[#E8E4DA] overflow-hidden border border-[#E7E3D8]">
              <img
                src={selectedImage || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
                referrerPolicy="no-referrer"
              />
              {product.isLimited && (
                <div className="absolute top-3 left-3 bg-[#1C1A17] text-[#FAF9F5] text-[10px] tracking-widest uppercase font-mono px-2 py-0.5">
                  Limited Batch
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {product.gallery.length > 1 && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                {product.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-16 h-12 shrink-0 border overflow-hidden transition-all ${
                      selectedImage === img
                        ? 'border-[#1C1A17] ring-1 ring-[#1C1A17]'
                        : 'border-[#D5CFC2] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

            {/* Provenance note */}
            <div className="mt-6 pt-4 border-t border-[#E2DDD3] text-[11px] text-[#736F66] flex items-center justify-between">
              <span>Origin: {product.origin}</span>
              <span className="font-mono uppercase">{product.leadTime}</span>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between text-xs text-[#7A766C] mb-2">
                <span className="tracking-widest uppercase text-[11px] font-medium">{product.categoryLabel}</span>
                <span className="text-[#3E6B48] font-mono text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3E6B48]" />
                  In Stock ({product.stockCount} units available)
                </span>
              </div>

              {/* Title */}
              <h2 id="product-modal-title" className="text-2xl sm:text-3xl font-serif text-[#1C1A17] tracking-tight leading-tight">
                {product.name}
              </h2>

              {/* Rating and Price Row */}
              <div className="flex items-center justify-between mt-3 pb-4 border-b border-[#E7E3D8]">
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-[#1C1A17]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-[#1C1A17] text-[#1C1A17]'
                            : 'text-[#C5BFB2]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-mono tabular-nums text-[#1C1A17]">{product.rating}</span>
                  <span className="text-xs text-[#8E8A80]">({product.reviews.length} reviews)</span>
                </div>

                <div className="flex items-baseline gap-2">
                  {product.originalPrice && (
                    <span className="text-xs text-[#8E8A80] line-through font-mono tabular-nums">
                      {formatPrice(product.originalPrice, currency)}
                    </span>
                  )}
                  <span className="text-xl font-serif font-semibold font-mono tabular-nums text-[#1C1A17]">
                    {formatPrice(product.price, currency)}
                  </span>
                </div>
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-[#55524B] leading-relaxed mt-4 font-light">
                {product.description}
              </p>

              {/* Variant Selectors */}
              {product.variants?.map((variant) => (
                <div key={variant.name} className="mt-5">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="tracking-wide uppercase text-[11px] font-semibold text-[#1C1A17]">
                      {variant.name}:
                    </span>
                    <span className="text-[#7A766C] font-mono text-[11px]">
                      {selectedVariants[variant.name] || 'Select'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {variant.options.map((opt) => {
                      const isSelected = selectedVariants[variant.name] === opt.label;
                      return (
                        <button
                          key={opt.value}
                          disabled={!opt.inStock}
                          onClick={() => {
                            setSelectedVariants({ ...selectedVariants, [variant.name]: opt.label });
                          }}
                          className={`px-3 py-1.5 text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                            !opt.inStock
                              ? 'opacity-40 line-through cursor-not-allowed border-[#D5CFC2] bg-[#EAE6DD]'
                              : isSelected
                              ? 'border-[#1C1A17] bg-[#1C1A17] text-[#FAF9F5]'
                              : 'border-[#D5CFC2] text-[#4A4742] hover:border-[#1C1A17] bg-white'
                          }`}
                        >
                          {opt.hex && (
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                              style={{ backgroundColor: opt.hex }}
                            />
                          )}
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Quantity Stepper + Add To Bag Action */}
              <div className="mt-6 flex items-stretch gap-3">
                <div className="flex items-center border border-[#D5CFC2] bg-white px-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 text-[#55524B] hover:text-[#1C1A17] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-mono tabular-nums text-[#1C1A17]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    className="p-1.5 text-[#55524B] hover:text-[#1C1A17] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    onAddToCart(product, selectedVariants, quantity);
                    onClose();
                  }}
                  className="flex-1 py-3.5 px-6 bg-[#1C1A17] hover:bg-[#2F2C27] text-[#FAF9F5] text-xs uppercase tracking-widest font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Add to Bag</span>
                  <span>·</span>
                  <span className="font-mono tabular-nums">{formatPrice(product.price * quantity, currency)}</span>
                </button>

                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-3.5 border transition-colors cursor-pointer ${
                    isWishlisted
                      ? 'border-[#1C1A17] bg-[#1C1A17] text-[#FAF9F5]'
                      : 'border-[#D5CFC2] bg-white text-[#4A4742] hover:border-[#1C1A17]'
                  }`}
                  aria-label="Wishlist this piece"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Informational Tabs Accordion */}
              <div className="mt-8 border-t border-[#E7E3D8]">
                <div className="flex items-center gap-4 border-b border-[#E7E3D8] text-xs font-medium tracking-wider uppercase text-[#736F66]">
                  {(['details', 'materials', 'shipping', 'reviews'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-3 relative transition-colors cursor-pointer ${
                        activeTab === tab ? 'text-[#1C1A17] font-semibold' : 'hover:text-[#1C1A17]'
                      }`}
                    >
                      {tab === 'reviews' ? `Reviews (${product.reviews.length})` : tab}
                      {activeTab === tab && (
                        <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#1C1A17]" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="py-4 text-xs text-[#55524B] leading-relaxed min-h-[90px]">
                  {activeTab === 'details' && (
                    <div className="space-y-2">
                      <p><strong className="text-[#1C1A17]">Dimensions:</strong> {product.dimensions}</p>
                      <p><strong className="text-[#1C1A17]">Lead Time:</strong> {product.leadTime}</p>
                      <p><strong className="text-[#1C1A17]">Workshop Origin:</strong> {product.origin}</p>
                    </div>
                  )}

                  {activeTab === 'materials' && (
                    <div className="space-y-2">
                      <p><strong className="text-[#1C1A17]">Material Composition:</strong> {product.materials}</p>
                      <p>All woods are harvested from certified sustainable European forests. Metals are sealed against oxidation with organic beeswax.</p>
                    </div>
                  )}

                  {activeTab === 'shipping' && (
                    <div className="space-y-2">
                      <p><strong className="text-[#1C1A17]">Complimentary Delivery:</strong> On all orders above $250. Delivered via insured carbon-neutral express courier.</p>
                      <p><strong className="text-[#1C1A17]">30-Day In-Home Trial:</strong> Keep it in your space. If it does not resonate, return in original packaging for a full refund.</p>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-4">
                      {/* Review List */}
                      <div className="max-h-40 overflow-y-auto space-y-3 pr-2">
                        {product.reviews.map((rev) => (
                          <div key={rev.id} className="pb-2 border-b border-[#EFECE4]">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-semibold text-[#1C1A17]">{rev.author}</span>
                              <span className="text-[#8E8A80] font-mono">{rev.date}</span>
                            </div>
                            <div className="flex items-center gap-1 my-1 text-[#1C1A17]">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-2.5 h-2.5 ${i < rev.rating ? 'fill-[#1C1A17]' : 'text-slate-200'}`}
                                />
                              ))}
                            </div>
                            <p className="text-xs text-[#636056]">{rev.comment}</p>
                          </div>
                        ))}
                      </div>

                      {/* Add Review Form */}
                      {reviewSubmitted ? (
                        <div className="p-3 bg-[#EBF2EB] text-[#294B2E] text-xs">
                          Thank you. Your verified collector review has been published.
                        </div>
                      ) : (
                        <form onSubmit={handleReviewSubmit} className="pt-2 border-t border-[#E7E3D8] space-y-2">
                          <p className="text-[11px] font-semibold text-[#1C1A17] uppercase tracking-wider">Leave a Review</p>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              required
                              placeholder="Your Name"
                              value={newAuthor}
                              onChange={(e) => setNewAuthor(e.target.value)}
                              className="px-2.5 py-1.5 bg-white border border-[#D5CFC2] text-xs text-[#1C1A17] focus:outline-none focus:border-[#1C1A17]"
                            />
                            <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#D5CFC2]">
                              <span className="text-[11px] text-[#7A766C]">Stars:</span>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  type="button"
                                  key={star}
                                  onClick={() => setNewRating(star)}
                                  className="text-[#1C1A17]"
                                >
                                  <Star
                                    className={`w-3.5 h-3.5 ${
                                      star <= newRating ? 'fill-[#1C1A17]' : 'text-slate-300'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <textarea
                            required
                            rows={2}
                            placeholder="Share your thoughts on craftsmanship and materiality..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-[#D5CFC2] text-xs text-[#1C1A17] focus:outline-none focus:border-[#1C1A17]"
                          />
                          <button
                            type="submit"
                            className="px-4 py-1.5 bg-[#1C1A17] text-[#FAF9F5] text-[11px] uppercase tracking-wider font-medium hover:bg-[#2F2C27] cursor-pointer"
                          >
                            Submit Review
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
