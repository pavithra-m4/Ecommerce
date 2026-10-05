import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Eye } from 'lucide-react';
import { Product, CurrencyConfig } from '../types/store';
import { formatPrice } from '../utils/format';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currency: CurrencyConfig;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  onSelectProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = searchTerm.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.materials.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-20 p-4"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#1C1A17]/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-[#FAF9F5] w-full max-w-2xl border border-[#E7E3D8] shadow-2xl z-10 overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E7E3D8] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#7A766C]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search lamps, vessels, seating, walnut audio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base text-[#1C1A17] placeholder:text-[#9E9A90] focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-[#7A766C] hover:text-[#1C1A17] px-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-[#55524B] hover:text-[#1C1A17] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-4 sm:p-6">
          {searchTerm.trim() === '' ? (
            <div>
              <p className="text-xs uppercase tracking-wider text-[#7A766C] mb-3 font-semibold">Suggested Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Sculptural Lamp', 'Stoneware Vessel', 'Lounge Armchair', 'Travertine Table', 'Walnut Audio'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchTerm(term)}
                    className="px-3 py-1.5 bg-[#F3F1EA] hover:bg-[#EAE6DD] text-xs text-[#4A4742] transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10">
              <p className="font-serif text-lg text-[#1C1A17]">No pieces matching &ldquo;{searchTerm}&rdquo;</p>
              <p className="text-xs text-[#7A766C] mt-1">Try exploring by material like brass, travertine, or oak.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-[#7A766C] uppercase tracking-wider font-semibold">
                Found {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
              </p>
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectProduct(item);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 bg-white hover:bg-[#F5F2EA] border border-[#E7E3D8] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt=""
                      className="w-12 h-12 object-cover bg-[#EAE6DD]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-widest text-[#7A766C] font-mono">{item.categoryLabel}</p>
                      <h4 className="text-sm font-serif font-medium text-[#1C1A17] group-hover:underline truncate">
                        {item.name}
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="font-mono tabular-nums text-xs font-semibold text-[#1C1A17]">
                      {formatPrice(item.price, currency)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#8E8A80] group-hover:text-[#1C1A17] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
