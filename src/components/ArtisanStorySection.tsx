import React from 'react';
import { Compass, Sparkles, Feather, Shield } from 'lucide-react';

export const ArtisanStorySection: React.FC = () => {
  return (
    <section id="story-section" className="py-20 bg-[#F3F1EA] border-b border-[#E7E3D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Heading */}
        <div className="max-w-2xl mb-14">
          <div className="flex items-center gap-2 text-xs text-[#7A766C] tracking-widest uppercase mb-3 font-mono">
            <span>Material Provenance</span>
            <span aria-hidden="true">·</span>
            <span>Atelier Philosophy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#1C1A17] tracking-tight leading-[1.15] [text-wrap:balance]">
            Crafted for permanence, quiet resonance, and mindful living.
          </h2>
          <p className="text-sm sm:text-base text-[#5D5950] font-light leading-relaxed mt-4">
            We reject the transient cadence of fast manufacturing. Every vessel, armchair, and luminaire in our catalog is engineered to endure across generations, gaining depth and character as natural patinas evolve.
          </p>
        </div>

        {/* 3 Editorial Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-[#FAF9F5] border border-[#E7E3D8] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 border border-[#D5CFC2] flex items-center justify-center text-[#1C1A17] mb-5">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="text-base font-serif font-semibold text-[#1C1A17] mb-2">
                01. Honed Monolithic Stone
              </h3>
              <p className="text-xs text-[#5D5950] leading-relaxed">
                Extracted from heritage quarries in Tivoli and Mashiko. Unfilled porous travertine and volcanic stoneware celebrate natural geological variation and tactile warmth.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#EFECE4] text-[11px] text-[#7A766C] font-mono uppercase">
              100% Zero Synthetic Binders
            </div>
          </div>

          <div className="p-6 bg-[#FAF9F5] border border-[#E7E3D8] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 border border-[#D5CFC2] flex items-center justify-center text-[#1C1A17] mb-5">
                <Feather className="w-4 h-4" />
              </div>
              <h3 className="text-base font-serif font-semibold text-[#1C1A17] mb-2">
                02. Certified European Oak
              </h3>
              <p className="text-xs text-[#5D5950] leading-relaxed">
                Every furniture component is machined from slow-grown Nordic white oak. Hand-sanded and sealed with breathable, food-grade organic hardwax oils.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#EFECE4] text-[11px] text-[#7A766C] font-mono uppercase">
              FSC® Certified Forestry
            </div>
          </div>

          <div className="p-6 bg-[#FAF9F5] border border-[#E7E3D8] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 border border-[#D5CFC2] flex items-center justify-center text-[#1C1A17] mb-5">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="text-base font-serif font-semibold text-[#1C1A17] mb-2">
                03. Solid Spun Brass & Bronze
              </h3>
              <p className="text-xs text-[#5D5950] leading-relaxed">
                Spun by master metalworkers into precision optical reflectors. Never plated with synthetic veneers—our raw brass surfaces breathe, age, and preserve history.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#EFECE4] text-[11px] text-[#7A766C] font-mono uppercase">
              Archival Longevity Rating
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
