/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, Search, Check, Sparkles, Filter, X } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { SearchModal } from './components/SearchModal';
import { ArtisanStorySection } from './components/ArtisanStorySection';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { INITIAL_PRODUCTS, CURRENCIES } from './data/products';
import { Product, ProductCategory, CurrencyCode, CartItem, Order, ProductReview } from './types/store';

export default function App() {
  // Products state (allows appending new reviews)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('atelier_lumen_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Currency
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>(() => {
    return (localStorage.getItem('atelier_lumen_currency') as CurrencyCode) || 'USD';
  });
  const currentCurrency = CURRENCIES[currencyCode] || CURRENCIES.USD;

  // Navigation & Category Filter
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(2000);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('atelier_lumen_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      // Seed with 1 curated item so the cart feels alive
      {
        id: 'cart-init-1',
        productId: 'prod-lamp-01',
        product: INITIAL_PRODUCTS[0],
        selectedVariant: { Finish: 'Brushed Brass', 'Dimmer Style': 'Analog Rotary' },
        quantity: 1,
        unitPrice: 380,
      },
    ];
  });

  // Promo Code State
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [fixedDiscount, setFixedDiscount] = useState<number>(0);

  // Wishlist State
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('atelier_lumen_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [INITIAL_PRODUCTS[1]]; // Seed Sora Lounge Chair in wishlist
  });

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message?: string, type: 'success' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('atelier_lumen_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('atelier_lumen_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('atelier_lumen_currency', currencyCode);
  }, [currencyCode]);

  useEffect(() => {
    localStorage.setItem('atelier_lumen_products', JSON.stringify(products));
  }, [products]);

  // Handlers for cart
  const handleAddToCart = (product: Product, variant: { [key: string]: string }, quantity: number) => {
    const variantKey = Object.entries(variant)
      .map(([k, v]) => `${k}:${v}`)
      .sort()
      .join('|');
    const existingIndex = cart.findIndex(
      (item) =>
        item.productId === product.id &&
        Object.entries(item.selectedVariant)
          .map(([k, v]) => `${k}:${v}`)
          .sort()
          .join('|') === variantKey
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
    } else {
      const newItem: CartItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        productId: product.id,
        product,
        selectedVariant: variant,
        quantity,
        unitPrice: product.price,
      };
      setCart([...cart, newItem]);
    }

    addToast('Added to Shopping Bag', `${product.name} (Qty: ${quantity})`);
  };

  const handleQuickAdd = (product: Product) => {
    // Default variants
    const defaults: { [key: string]: string } = {};
    product.variants?.forEach((v) => {
      const opt = v.options.find((o) => o.inStock) || v.options[0];
      if (opt) defaults[v.name] = opt.label;
    });
    handleAddToCart(product, defaults, 1);
  };

  const handleUpdateCartQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveCartItem(itemId);
      return;
    }
    setCart(cart.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)));
  };

  const handleRemoveCartItem = (itemId: string) => {
    const item = cart.find((i) => i.id === itemId);
    setCart(cart.filter((i) => i.id !== itemId));
    if (item) {
      addToast('Item Removed', `${item.product.name} was removed from your bag.`, 'info');
    }
  };

  // Promo code validation
  const handleApplyPromoCode = (code: string) => {
    const upper = code.trim().toUpperCase();
    if (upper === 'WELCOME10') {
      setPromoCode(upper);
      setDiscountPercent(10);
      setFixedDiscount(0);
      addToast('Promo Code Applied', '10% atelier collector discount activated.');
      return { success: true, message: '10% Collector Discount applied' };
    }
    if (upper === 'SPRING' || upper === 'SPRING26') {
      setPromoCode(upper);
      setDiscountPercent(0);
      setFixedDiscount(50);
      addToast('Promo Code Applied', '$50 seasonal credit applied.');
      return { success: true, message: '$50 Spring Release credit applied' };
    }
    if (upper === 'LUMEN') {
      setPromoCode(upper);
      setDiscountPercent(15);
      setFixedDiscount(0);
      addToast('Promo Code Applied', '15% Archival patron discount applied.');
      return { success: true, message: '15% Patron Discount applied' };
    }
    return { success: false, message: 'Invalid or expired promotional code. Try WELCOME10 or SPRING' };
  };

  // Wishlist toggle
  const handleToggleWishlist = (product: Product) => {
    const exists = wishlist.some((p) => p.id === product.id);
    if (exists) {
      setWishlist(wishlist.filter((p) => p.id !== product.id));
      addToast('Removed from Saved Pieces', product.name, 'info');
    } else {
      setWishlist([...wishlist, product]);
      addToast('Saved to Architectural Registry', product.name);
    }
  };

  const handleMoveWishlistToCart = (product: Product) => {
    handleQuickAdd(product);
    setWishlist(wishlist.filter((p) => p.id !== product.id));
  };

  // Add review to product
  const handleAddReview = (productId: string, newReview: Omit<ProductReview, 'id' | 'date'>) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const rev: ProductReview = {
            ...newReview,
            id: `rev-${Date.now()}`,
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          };
          const allReviews = [rev, ...prod.reviews];
          const avgRating = Number(
            (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(2)
          );
          return {
            ...prod,
            reviews: allReviews,
            reviewCount: allReviews.length,
            rating: avgRating,
          };
        }
        return prod;
      })
    );
    addToast('Review Published', 'Thank you for documenting your impressions.');
  };

  // Order placed
  const handleOrderPlaced = (order: Order) => {
    setCart([]);
    setPromoCode('');
    setDiscountPercent(0);
    setFixedDiscount(0);
    setConfirmedOrder(order);
    addToast('Order Confirmed', `Order ${order.id} received. White-glove courier dispatch scheduled.`);
  };

  // Filtered & sorted catalog
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        if (inStockOnly && !p.inStock) return false;
        if (p.price > maxPriceFilter) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        return 0; // featured
      });
  }, [products, selectedCategory, inStockOnly, maxPriceFilter, sortBy]);

  const categories: { key: ProductCategory; label: string }[] = [
    { key: 'all', label: 'All Pieces' },
    { key: 'lighting', label: 'Lighting' },
    { key: 'furniture', label: 'Furniture' },
    { key: 'ceramics', label: 'Ceramics' },
    { key: 'audio', label: 'Audio & Tech' },
    { key: 'textiles', label: 'Textiles' },
  ];

  const totalCartItemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#1C1A17] font-sans">
      {/* Top Bar Navigation (Strict 3-zone Top Bar Contract) */}
      <Header
        currentCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const catalogEl = document.getElementById('catalog-section');
          if (catalogEl) {
            catalogEl.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        currency={currencyCode}
        onChangeCurrency={(c) => {
          setCurrencyCode(c);
          addToast('Currency Updated', `Displaying values in ${c} (${CURRENCIES[c].symbol})`, 'info');
        }}
        cartCount={totalCartItemCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onScrollToStory={() => {
          const storyEl = document.getElementById('story-section');
          if (storyEl) {
            storyEl.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      <main className="flex-1">
        {/* Campaign Hero with Adjacency Proof Strip */}
        <Hero
          onExploreClick={() => {
            const catalogEl = document.getElementById('catalog-section');
            if (catalogEl) {
              catalogEl.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          onStoryClick={() => {
            const storyEl = document.getElementById('story-section');
            if (storyEl) {
              storyEl.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />

        {/* Featured Catalog Section */}
        <section id="catalog-section" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E7E3D8]">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#7A766C] tracking-widest uppercase mb-2 font-mono">
                <span>Curated Catalog</span>
                <span aria-hidden="true">·</span>
                <span>{filteredProducts.length} Editions</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#1C1A17] tracking-tight">
                {selectedCategory === 'all' ? 'All Architectural Pieces' : categories.find(c => c.key === selectedCategory)?.label}
              </h2>
            </div>

            {/* Interactive Filter Tabs / Segmented Controls (allowed button elements) */}
            <div className="flex items-center flex-wrap gap-1.5 p-1 bg-[#F3F1EA] border border-[#E7E3D8]">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat.key
                      ? 'bg-[#1C1A17] text-[#FAF9F5] shadow-xs'
                      : 'text-[#55524B] hover:text-[#1C1A17] hover:bg-[#EAE6DD]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-Filter Controls Bar: Sort, Price Range, In-Stock, Search shortcut */}
          <div className="py-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#EFECE4] text-xs">
            
            <div className="flex items-center gap-4">
              {/* Filter Panel Toggle */}
              <button
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                className={`flex items-center gap-1.5 px-3 py-1.5 border transition-colors cursor-pointer ${
                  showFiltersPanel || inStockOnly || maxPriceFilter < 2000
                    ? 'border-[#1C1A17] bg-[#1C1A17] text-[#FAF9F5]'
                    : 'border-[#D5CFC2] bg-white text-[#4A4742] hover:border-[#1C1A17]'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wider text-[11px] font-medium">Refine</span>
                {(inStockOnly || maxPriceFilter < 2000) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                )}
              </button>

              {/* In-Stock Fast Toggle */}
              <button
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 border transition-colors cursor-pointer ${
                  inStockOnly
                    ? 'border-[#1C1A17] bg-[#F5F2EA] text-[#1C1A17] font-semibold'
                    : 'border-[#D5CFC2] bg-white text-[#5D5950] hover:border-[#1C1A17]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${inStockOnly ? 'bg-[#3E6B48]' : 'bg-[#D5CFC2]'}`} />
                <span>In Stock Only</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[#7A766C] uppercase tracking-wider text-[11px]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-[#D5CFC2] text-xs text-[#1C1A17] px-3 py-1.5 focus:outline-none focus:border-[#1C1A17] cursor-pointer"
              >
                <option value="featured">Curated (Featured)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Releases</option>
              </select>
            </div>

          </div>

          {/* Collapsible Refine Filter Drawer / Bar */}
          {showFiltersPanel && (
            <div className="p-4 sm:p-5 bg-[#F3F1EA] border border-[#E7E3D8] my-4 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Price Slider */}
                <div className="w-full sm:w-80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="uppercase tracking-wider font-semibold text-[#1C1A17]">Max Price</span>
                    <span className="font-mono tabular-nums text-[#1C1A17] font-semibold">
                      Up to ${maxPriceFilter} USD
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="50"
                    value={maxPriceFilter}
                    onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                    className="w-full accent-[#1C1A17] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#7A766C] font-mono mt-1">
                    <span>$100</span>
                    <span>$2,000+</span>
                  </div>
                </div>

                {/* Reset Filters */}
                <div className="flex items-center gap-3">
                  {(inStockOnly || maxPriceFilter < 2000 || selectedCategory !== 'all') && (
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setInStockOnly(false);
                        setMaxPriceFilter(2000);
                      }}
                      className="text-xs text-[#1C1A17] hover:underline font-medium cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  )}
                  <button
                    onClick={() => setShowFiltersPanel(false)}
                    className="p-1 text-[#656157] hover:text-[#1C1A17]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3-Column Product Grid (generous gap-6 to gap-8 per retail rules) */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-[#F3F1EA] border border-[#E7E3D8] mt-8">
              <p className="font-serif text-2xl text-[#1C1A17]">No pieces match your selected filters</p>
              <p className="text-xs text-[#7A766C] mt-2">Try adjusting price thresholds or clearing category filters.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setInStockOnly(false);
                  setMaxPriceFilter(2000);
                }}
                className="mt-6 px-6 py-2.5 bg-[#1C1A17] text-[#FAF9F5] text-xs uppercase tracking-widest font-medium hover:bg-[#2F2C27] cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={currentCurrency}
                  isWishlisted={wishlist.some((p) => p.id === product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onQuickView={(p) => setQuickViewProduct(p)}
                  onQuickAdd={handleQuickAdd}
                />
              ))}
            </div>
          )}

        </section>

        {/* Brand Ethos & Provenance Section */}
        <ArtisanStorySection />
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const catalogEl = document.getElementById('catalog-section');
          if (catalogEl) {
            catalogEl.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onOpenStory={() => {
          const storyEl = document.getElementById('story-section');
          if (storyEl) {
            storyEl.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Product Detail / Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        currency={currentCurrency}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={Boolean(quickViewProduct && wishlist.some((p) => p.id === quickViewProduct.id))}
        onToggleWishlist={handleToggleWishlist}
        onAddReview={handleAddReview}
      />

      {/* Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        currency={currentCurrency}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        promoCode={promoCode}
        onApplyPromoCode={handleApplyPromoCode}
        discountPercent={discountPercent}
        fixedDiscount={fixedDiscount}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlist}
        currency={currentCurrency}
        onRemoveFromWishlist={handleToggleWishlist}
        onMoveToCart={handleMoveWishlistToCart}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        currency={currentCurrency}
        onSelectProduct={(p) => setQuickViewProduct(p)}
      />

      {/* Full Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        currency={currentCurrency}
        discountPercent={discountPercent}
        fixedDiscount={fixedDiscount}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Order Confirmation & Tracker Modal */}
      <OrderConfirmationModal
        order={confirmedOrder}
        currency={currentCurrency}
        isOpen={Boolean(confirmedOrder)}
        onClose={() => setConfirmedOrder(null)}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
