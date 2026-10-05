import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, Menu, X, ChevronDown } from 'lucide-react';
import { CurrencyCode, ProductCategory } from '../types/store';
import { CURRENCIES } from '../data/products';

interface HeaderProps {
  currentCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  currency: CurrencyCode;
  onChangeCurrency: (curr: CurrencyCode) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onScrollToStory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  currency,
  onChangeCurrency,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onScrollToStory,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const navLinks: { label: string; cat?: ProductCategory; isStory?: boolean }[] = [
    { label: 'Collection', cat: 'all' },
    { label: 'Lighting', cat: 'lighting' },
    { label: 'Furniture', cat: 'furniture' },
    { label: 'Ceramics', cat: 'ceramics' },
    { label: 'Ethos', isStory: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E7E3D8] transition-colors">
      {/* Slim top notice - promotional restraint (under 36px) */}
      <div className="bg-[#1C1A17] text-[#FAF9F5] text-[11px] py-1.5 px-4 text-center tracking-widest uppercase font-medium flex items-center justify-center gap-2">
        <span>Complimentary Express Courier on Orders over $250</span>
        <span aria-hidden="true" className="opacity-40">·</span>
        <span className="hidden sm:inline text-[#D4AF37]">Spring 2026 Release</span>
      </div>

      {/* Main Top Bar Contract: Exactly 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#1C1A17] p-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1C1A17]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xl sm:text-2xl font-serif tracking-[0.2em] font-semibold text-[#1C1A17] uppercase hover:opacity-85 transition-opacity whitespace-nowrap"
          >
            ATELIER LUMEN
          </a>
        </div>

        {/* Zone 2: 4-6 clean text navigation links with subtle underline */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] tracking-wider uppercase font-medium text-[#4A4742]">
          {navLinks.map((item) => {
            const isActive = !item.isStory && currentCategory === item.cat;
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.isStory) {
                    onScrollToStory();
                  } else if (item.cat) {
                    onSelectCategory(item.cat);
                    const catalogEl = document.getElementById('catalog-section');
                    if (catalogEl) {
                      catalogEl.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
                className={`relative py-1 transition-colors hover:text-[#1C1A17] whitespace-nowrap cursor-pointer ${
                  isActive ? 'text-[#1C1A17] font-semibold' : ''
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#1C1A17]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-1.5 text-[#4A4742] hover:text-[#1C1A17] transition-colors cursor-pointer"
            aria-label="Search collection"
            title="Search products"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Currency Switcher */}
          <div className="relative">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-1 text-xs tracking-wider font-medium text-[#4A4742] hover:text-[#1C1A17] py-1 px-1.5 transition-colors cursor-pointer"
              aria-label="Select currency"
            >
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-[#FAF9F5] border border-[#E7E3D8] shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      onChangeCurrency(c);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#F3F1EA] transition-colors ${
                      currency === c ? 'font-semibold text-[#1C1A17]' : 'text-[#656157]'
                    }`}
                  >
                    <span>{c}</span>
                    <span className="text-[#8E8A80]">{CURRENCIES[c].symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="relative p-1.5 text-[#4A4742] hover:text-[#1C1A17] transition-colors cursor-pointer"
            aria-label={`Wishlist with ${wishlistCount} saved items`}
            title="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1C1A17] text-[#FAF9F5] text-[10px] font-mono rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag Trigger */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3 py-2 bg-[#1C1A17] text-[#FAF9F5] hover:bg-[#2F2C27] transition-colors text-xs font-medium cursor-pointer"
            aria-label={`Shopping bag with ${cartCount} items`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline tracking-wider uppercase text-[11px]">Bag</span>
            <span className="font-mono text-[11px] tabular-nums bg-[#FAF9F5]/20 px-1.5 py-0.5 rounded-none">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF9F5] border-b border-[#E7E3D8] px-6 py-5 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-4 text-sm font-medium tracking-wide uppercase text-[#292622]">
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (item.isStory) {
                    onScrollToStory();
                  } else if (item.cat) {
                    onSelectCategory(item.cat);
                    const catalogEl = document.getElementById('catalog-section');
                    if (catalogEl) {
                      catalogEl.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
                className="text-left py-1 hover:text-[#D4AF37] transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
