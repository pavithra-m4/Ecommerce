import React from 'react';
import { CheckCircle2, Package, Truck, Calendar, Printer, ArrowRight, ExternalLink } from 'lucide-react';
import { Order, CurrencyConfig } from '../types/store';
import { formatPrice } from '../utils/format';

interface OrderConfirmationModalProps {
  order: Order | null;
  currency: CurrencyConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  currency,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-success-title"
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#1C1A17]/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-[#FAF9F5] w-full max-w-2xl border border-[#E7E3D8] shadow-2xl z-10 overflow-hidden my-auto p-6 sm:p-10 flex flex-col">
        {/* Celebration Header */}
        <div className="text-center pb-6 border-b border-[#E7E3D8]">
          <div className="w-14 h-14 bg-[#1C1A17] text-[#FAF9F5] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <CheckCircle2 className="w-8 h-8 text-[#D4AF37]" />
          </div>

          <p className="text-xs uppercase tracking-widest text-[#7A766C] mb-1 font-mono">
            Order Confirmed · Preparing Shipment
          </p>
          <h2 id="order-success-title" className="text-3xl font-serif text-[#1C1A17]">
            Thank you, {order.shippingInfo.fullName.split(' ')[0]}
          </h2>
          <p className="text-xs text-[#5D5950] mt-2 max-w-md mx-auto leading-relaxed">
            Your piece is registered with the atelier master registry. A formal invoice and dispatch manifest have been sent to <strong>{order.shippingInfo.email}</strong>.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="my-6 bg-[#F3F1EA] p-5 border border-[#E7E3D8] space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-[#7A766C] uppercase tracking-wider block">Order Reference</span>
              <span className="font-mono font-semibold text-[#1C1A17] text-sm">{order.id}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#7A766C] uppercase tracking-wider block">Estimated Delivery</span>
              <span className="font-medium text-[#1C1A17]">{order.estimatedDelivery}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#7A766C] uppercase tracking-wider block">Tracking ID</span>
              <span className="font-mono text-[#1C1A17]">{order.trackingNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#7A766C] uppercase tracking-wider block">Payment</span>
              <span className="uppercase text-[11px] font-mono text-[#1C1A17]">{order.paymentMethod}</span>
            </div>
          </div>

          {/* Simulated Tracking Stepper */}
          <div className="pt-4 border-t border-[#DDD7CA]">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-[#1C1A17] mb-3">Live Transit Timeline</p>
            <div className="relative flex items-center justify-between text-[11px] text-[#7A766C]">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-[#1C1A17] ring-4 ring-[#1C1A17]/20" />
                <span className="mt-1 font-semibold text-[#1C1A17]">Confirmed</span>
              </div>
              <div className="flex-1 h-[2px] bg-[#1C1A17]" />
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-[#1C1A17]" />
                <span className="mt-1 text-[#1C1A17]">Atelier Prep</span>
              </div>
              <div className="flex-1 h-[2px] bg-[#DDD7CA]" />
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#DDD7CA]" />
                <span className="mt-1">Courier Dispatch</span>
              </div>
              <div className="flex-1 h-[2px] bg-[#DDD7CA]" />
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#DDD7CA]" />
                <span className="mt-1">Delivered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Itemized Receipt Summary */}
        <div className="space-y-3 mb-6">
          <p className="text-xs uppercase tracking-wider font-semibold text-[#1C1A17]">Purchased Items ({order.items.length})</p>
          <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-xs pb-2 border-b border-[#EFECE4]">
                <div className="flex items-center gap-2">
                  <img src={item.product.image} alt="" className="w-9 h-9 object-cover bg-white border border-[#D5CFC2]" />
                  <div>
                    <span className="font-medium text-[#1C1A17]">{item.product.name}</span>
                    <span className="text-[#7A766C] ml-1.5 font-mono text-[11px]">× {item.quantity}</span>
                  </div>
                </div>
                <span className="font-mono tabular-nums text-[#1C1A17]">
                  {formatPrice(item.unitPrice * item.quantity, currency)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-between text-sm font-semibold text-[#1C1A17] border-t border-[#E7E3D8]">
            <span>Total Paid</span>
            <span className="font-mono tabular-nums">{formatPrice(order.total, currency)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-5 py-3 border border-[#D5CFC2] hover:border-[#1C1A17] text-xs uppercase tracking-wider font-medium text-[#1C1A17] flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 w-full py-3 bg-[#1C1A17] hover:bg-[#2F2C27] text-[#FAF9F5] text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
          >
            <span>Return to Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
