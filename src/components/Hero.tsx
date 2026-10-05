import React from 'react';
import { ArrowDown, ArrowUpRight, ShieldCheck, Sparkles, Truck, RefreshCw } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onStoryClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onStoryClick }) => {
  return (
    <section className="relative bg-[#FAF9F5] border-b border-[#E7E3D8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Editorial Content */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Quiet 1-line text kicker - Zero-pill discipline */}
            <div className="flex items-center gap-2 text-xs text-[#8E8A80] tracking-widest uppercase mb-4">
              <span>Spring Atelier Release</span>
              <span aria-hidden="true">·</span>
              <span>Edition of 2026</span>
            </div>

            {/* Display Headline with balanced text wrap */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#1C1A17] tracking-tight leading-[1.08] mb-6 [text-wrap:balance]">
              Objects shaped by silence, permanence & natural light.
            </h1>

            <p className="text-base sm:text-lg text-[#5D5950] font-light leading-relaxed max-w-xl mb-8">
              A curated anthology of sculptural lighting, architectural seating, and hand-thrown stoneware ceramics. Designed for spaces of quiet clarity.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 bg-[#1C1A17] text-[#FAF9F5] hover:bg-[#2F2C27] text-xs uppercase tracking-widest font-medium transition-all flex items-center gap-2 cursor-pointer group"
              >
                <span>Explore Catalog</span>
                <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={onStoryClick}
                className="px-6 py-3.5 border border-[#D5CFC2] text-[#1C1A17] hover:border-[#1C1A17] text-xs uppercase tracking-widest font-medium transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Read Design Ethos</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Micro editorial proof */}
            <div className="mt-10 pt-6 border-t border-[#E7E3D8] flex items-center gap-6 text-xs text-[#78746B]">
              <div>
                <span className="font-serif text-lg text-[#1C1A17] block leading-none font-semibold">100%</span>
                <span className="text-[11px] tracking-wide mt-1 block">Certified Natural Sourcing</span>
              </div>
              <div className="w-[1px] h-8 bg-[#E7E3D8]" />
              <div>
                <span className="font-serif text-lg text-[#1C1A17] block leading-none font-semibold">10-Year</span>
                <span className="text-[11px] tracking-wide mt-1 block">Structural Integrity Guarantee</span>
              </div>
              <div className="w-[1px] h-8 bg-[#E7E3D8]" />
              <div>
                <span className="font-serif text-lg text-[#1C1A17] block leading-none font-semibold">Kyoto & Nordic</span>
                <span className="text-[11px] tracking-wide mt-1 block">Artisan Master Workshops</span>
              </div>
            </div>
          </div>

          {/* Cinematic Visual Anchor */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[16/9] lg:aspect-[4/3] w-full overflow-hidden bg-[#EAE6DD] border border-[#E7E3D8] group">
              <img
                src="/src/assets/images/hero_modern_interior_1791181560540.jpg"
                alt="Contemporary architectural interior with travertine coffee table and natural lighting"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback container in case of asset load anomaly
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.image-fallback');
                  if (fallback) fallback.classList.remove('hidden');
                }}
              />
              {/* Fallback container */}
              <div className="image-fallback hidden absolute inset-0 bg-[#E3DFD5] flex flex-col items-center justify-center p-8 text-center">
                <Sparkles className="w-8 h-8 text-[#8E8A80] mb-3" />
                <p className="font-serif text-xl text-[#1C1A17]">ATELIER LUMEN</p>
                <p className="text-xs text-[#78746B] mt-1">Interior Architectural Collection</p>
              </div>

              {/* Caption pill-free overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#1C1A17]/80 via-[#1C1A17]/30 to-transparent p-5 text-[#FAF9F5] flex items-end justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-[#E7E3D8]">Featured Interior</p>
                  <p className="text-sm font-serif font-light text-[#FAF9F5]">The Residence at Tivoli · Spring Installation</p>
                </div>
                <span className="text-[11px] font-mono text-[#D4AF37] tracking-wider">01 / ARCHIVAL</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Claim-to-Proof Adjacency Ribbon */}
      <div className="bg-[#F3F1EA] border-t border-[#E7E3D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-[#4A4742]">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#1C1A17] shrink-0" />
              <span>Complimentary worldwide courier over $250</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#1C1A17] shrink-0" />
              <span>Authenticity certificate with each piece</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-[#1C1A17] shrink-0" />
              <span>30-day in-home trial & easy returns</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#1C1A17] shrink-0" />
              <span>Carbon neutral white-glove logistics</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
