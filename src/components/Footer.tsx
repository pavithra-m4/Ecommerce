import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { ProductCategory } from '../types/store';

interface FooterProps {
  onSelectCategory: (cat: ProductCategory) => void;
  onOpenStory: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenStory }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#1C1A17] text-[#FAF9F5] border-t border-[#33302B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#2C2925]">
          
          {/* Brand & Newsletter Column (Left 5) */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-serif text-2xl font-semibold tracking-[0.2em] uppercase block">
              ATELIER LUMEN
            </span>
            <p className="text-xs text-[#A8A499] max-w-sm leading-relaxed font-light">
              Purveyors of timeless design objects, monolithic stone tables, artisanal ceramics, and architectural luminaires.
            </p>

            <div className="pt-4">
              <p className="text-xs uppercase tracking-wider font-semibold text-[#FAF9F5] mb-2">
                Join the Atelier Gazette
              </p>
              <p className="text-xs text-[#8E8A80] mb-3">
                Subscribers receive preview access to limited artisan kiln batches and studio journals.
              </p>

              {subscribed ? (
                <div className="p-3 bg-[#2A2723] border border-[#3E3A34] text-xs text-[#D4AF37] flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Welcome to the circle. A confirmation letter has been dispatched.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-md">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3 py-2.5 bg-[#25221E] border border-[#3E3A34] text-xs text-[#FAF9F5] placeholder:text-[#6E6A61] focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#FAF9F5] text-[#1C1A17] text-xs uppercase tracking-wider font-semibold hover:bg-[#EAE6DD] transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Links Column (Center 3) */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs uppercase tracking-widest font-semibold text-[#FAF9F5]">Catalog</p>
            <ul className="space-y-2 text-xs text-[#A8A499]">
              <li>
                <button
                  onClick={() => onSelectCategory('all')}
                  className="hover:text-[#FAF9F5] transition-colors cursor-pointer"
                >
                  Full Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('lighting')}
                  className="hover:text-[#FAF9F5] transition-colors cursor-pointer"
                >
                  Sculptural Lighting
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('furniture')}
                  className="hover:text-[#FAF9F5] transition-colors cursor-pointer"
                >
                  Architectural Furniture
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('ceramics')}
                  className="hover:text-[#FAF9F5] transition-colors cursor-pointer"
                >
                  Stoneware & Vessels
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('audio')}
                  className="hover:text-[#FAF9F5] transition-colors cursor-pointer"
                >
                  Audio & Acoustic Monitors
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('textiles')}
                  className="hover:text-[#FAF9F5] transition-colors cursor-pointer"
                >
                  Highland Alpaca Textiles
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care Column (Center 2) */}
          <div className="md:col-span-2 space-y-3">
            <p className="text-xs uppercase tracking-widest font-semibold text-[#FAF9F5]">Client Care</p>
            <ul className="space-y-2 text-xs text-[#A8A499]">
              <li>
                <span className="hover:text-[#FAF9F5] transition-colors cursor-pointer">White-Glove Courier</span>
              </li>
              <li>
                <span className="hover:text-[#FAF9F5] transition-colors cursor-pointer">30-Day In-Home Trial</span>
              </li>
              <li>
                <span className="hover:text-[#FAF9F5] transition-colors cursor-pointer">10-Year Guarantee</span>
              </li>
              <li>
                <span className="hover:text-[#FAF9F5] transition-colors cursor-pointer">Material Care Guides</span>
              </li>
              <li>
                <span className="hover:text-[#FAF9F5] transition-colors cursor-pointer">Trade & Hospitality</span>
              </li>
            </ul>
          </div>

          {/* Atelier Studios Column (Right 2) */}
          <div className="md:col-span-2 space-y-3">
            <p className="text-xs uppercase tracking-widest font-semibold text-[#FAF9F5]">Locations</p>
            <div className="text-xs text-[#A8A499] space-y-3">
              <div>
                <p className="text-[#FAF9F5] font-medium">Kyoto Studio</p>
                <p className="text-[11px] text-[#7A766C]">Kamigyo-ku, Kyoto</p>
              </div>
              <div>
                <p className="text-[#FAF9F5] font-medium">Copenhagen Atelier</p>
                <p className="text-[11px] text-[#7A766C]">Bredgade 28, Indre By</p>
              </div>
              <div>
                <p className="text-[#FAF9F5] font-medium">New York Gallery</p>
                <p className="text-[11px] text-[#7A766C]">SoHo, Manhattan</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Subtle Trust */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#7A766C] gap-4">
          <p>© {new Date().getFullYear()} ATELIER LUMEN. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#FAF9F5] transition-colors cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-[#FAF9F5] transition-colors cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-[#FAF9F5] transition-colors cursor-pointer">Certificate of Authenticity</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
