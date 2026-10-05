import React, { useState } from 'react';
import { X, ShieldCheck, Lock, CreditCard, Banknote, Truck, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { CartItem, CurrencyConfig, Order } from '../types/store';
import { formatPrice, calculateCartTotals } from '../utils/format';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyConfig;
  discountPercent: number;
  fixedDiscount: number;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  discountPercent,
  fixedDiscount,
  onOrderPlaced,
}) => {
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('Elena Rostova');
  const [email, setEmail] = useState('elena.rostova@designstudio.org');
  const [phone, setPhone] = useState('+1 (555) 389-2910');
  const [address, setAddress] = useState('442 Bleeker Street, Apt 4B');
  const [city, setCity] = useState('New York');
  const [state, setState] = useState('NY');
  const [postalCode, setPostalCode] = useState('10014');
  const [country, setCountry] = useState('United States');

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'wallet'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('883');

  if (!isOpen) return null;

  const baseTotals = calculateCartTotals(items, discountPercent, fixedDiscount);
  const expressSurcharge = shippingMethod === 'express' ? 35 : 0;
  const finalShippingCost = baseTotals.shippingCost + expressSurcharge;
  const finalTotal = baseTotals.discountedSubtotal + finalShippingCost + baseTotals.tax;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !address || !city || !postalCode) return;
    setStep('payment');
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const orderId = `AL-${Math.floor(10000 + Math.random() * 90000)}`;
      const trackingNumber = `TRK-${Math.floor(100000000 + Math.random() * 900000000)}`;
      const deliveryDays = shippingMethod === 'express' ? 2 : 4;
      const deliveryDate = new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      const newOrder: Order = {
        id: orderId,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        items: [...items],
        subtotal: baseTotals.subtotal,
        discount: baseTotals.discount,
        shippingCost: finalShippingCost,
        tax: baseTotals.tax,
        total: finalTotal,
        shippingInfo: {
          fullName,
          email,
          phone,
          address,
          city,
          state,
          postalCode,
          country,
        },
        deliveryMethod: shippingMethod === 'express' ? 'Priority White-Glove Air' : 'Insured Ground Courier',
        paymentMethod,
        status: 'confirmed',
        trackingNumber,
        estimatedDelivery: deliveryDate,
      };

      setIsSubmitting(false);
      onOrderPlaced(newOrder);
      onClose();
    }, 900);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#1C1A17]/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-[#FAF9F5] w-full max-w-4xl border border-[#E7E3D8] shadow-2xl z-10 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#E7E3D8] flex items-center justify-between bg-[#FAF9F5]">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg sm:text-xl font-semibold tracking-wider uppercase text-[#1C1A17]">
              Atelier Lumen
            </span>
            <span className="text-[#A09C92]">/</span>
            <span className="text-xs uppercase tracking-widest text-[#7A766C]">
              {step === 'shipping' ? '01. Shipping Details' : '02. Payment & Verification'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#55524B] hover:text-[#1C1A17] transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto min-h-0 flex-1">
          {/* Main Form (Left 7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
            
            {step === 'shipping' ? (
              <form onSubmit={handleProceedToPayment} className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold tracking-wider uppercase text-[#1C1A17] mb-1">
                    Customer Information
                  </h3>
                  <p className="text-xs text-[#7A766C] mb-3">Order receipts and dispatch notices will be sent to this email.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#4A4742] mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#D5CFC2] text-xs text-[#1C1A17] focus:outline-none focus:border-[#1C1A17]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#4A4742] mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#D5CFC2] text-xs text-[#1C1A17] focus:outline-none focus:border-[#1C1A17]"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-[11px] uppercase tracking-wider text-[#4A4742] mb-1">Phone Number (For Courier SMS)</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#D5CFC2] text-xs text-[#1C1A17] focus:outline-none focus:border-[#1C1A17]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EFECE4]">
                  <h3 className="text-sm font-semibold tracking-wider uppercase text-[#1C1A17] mb-3">
                    Delivery Address
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#4A4742] mb-1">Street Address</label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#D5CFC2] text-xs text-[#1C1A17] focus:outline-none focus:border-[#1C1A17]"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#4A4742] mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#D5CFC2] text-xs text-[#1C1A17] focus:outline-none focus:border-[#1C1A17]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#4A4742] mb-1">State / Region</label>
                        <input
                          type="text"
                          required
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#D5CFC2] text-xs text-[#1C1A17] focus:outline-none focus:border-[#1C1A17]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#4A4742] mb-1">Postal Code</label>
                        <input
                          type="text"
                          required
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#D5CFC2] text-xs text-[#1C1A17] focus:outline-none focus:border-[#1C1A17]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#4A4742] mb-1">Country</label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#D5CFC2] text-xs text-[#1C1A17] focus:outline-none focus:border-[#1C1A17]"
                      >
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Japan">Japan</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EFECE4]">
                  <h3 className="text-sm font-semibold tracking-wider uppercase text-[#1C1A17] mb-3">
                    Shipping Method
                  </h3>
                  
                  <div className="space-y-2">
                    <label
                      onClick={() => setShippingMethod('standard')}
                      className={`flex items-center justify-between p-3 border cursor-pointer transition-colors ${
                        shippingMethod === 'standard'
                          ? 'border-[#1C1A17] bg-[#F5F2EA]'
                          : 'border-[#D5CFC2] bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={shippingMethod === 'standard'}
                          onChange={() => setShippingMethod('standard')}
                          className="accent-[#1C1A17]"
                        />
                        <div>
                          <p className="text-xs font-semibold text-[#1C1A17]">Insured Ground Courier (3–5 Business Days)</p>
                          <p className="text-[11px] text-[#7A766C]">Carbon neutral transit with real-time tracking</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono tabular-nums text-[#1C1A17]">
                        {baseTotals.shippingCost === 0 ? 'Complimentary' : formatPrice(baseTotals.shippingCost, currency)}
                      </span>
                    </label>

                    <label
                      onClick={() => setShippingMethod('express')}
                      className={`flex items-center justify-between p-3 border cursor-pointer transition-colors ${
                        shippingMethod === 'express'
                          ? 'border-[#1C1A17] bg-[#F5F2EA]'
                          : 'border-[#D5CFC2] bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={shippingMethod === 'express'}
                          onChange={() => setShippingMethod('express')}
                          className="accent-[#1C1A17]"
                        />
                        <div>
                          <p className="text-xs font-semibold text-[#1C1A17]">Priority White-Glove Air Express (1–2 Days)</p>
                          <p className="text-[11px] text-[#7A766C]">Dedicated atelier courier and room placement</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono tabular-nums text-[#1C1A17]">
                        +{formatPrice(35, currency)}
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#1C1A17] hover:bg-[#2F2C27] text-[#FAF9F5] text-xs uppercase tracking-widest font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleCompleteOrder} className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold tracking-wider uppercase text-[#1C1A17]">
                      Payment Selection
                    </h3>
                    <button
                      type="button"
                      onClick={() => setStep('shipping')}
                      className="text-xs text-[#7A766C] hover:text-[#1C1A17] flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Back to Address</span>
                    </button>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`py-3 px-2 border flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'border-[#1C1A17] bg-[#1C1A17] text-[#FAF9F5]'
                          : 'border-[#D5CFC2] bg-white text-[#4A4742]'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span className="text-[11px] uppercase tracking-wider font-medium">Credit Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`py-3 px-2 border flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'border-[#1C1A17] bg-[#1C1A17] text-[#FAF9F5]'
                          : 'border-[#D5CFC2] bg-white text-[#4A4742]'
                      }`}
                    >
                      <Banknote className="w-4 h-4" />
                      <span className="text-[11px] uppercase tracking-wider font-medium">Cash on Delivery</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('wallet')}
                      className={`py-3 px-2 border flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        paymentMethod === 'wallet'
                          ? 'border-[#1C1A17] bg-[#1C1A17] text-[#FAF9F5]'
                          : 'border-[#D5CFC2] bg-white text-[#4A4742]'
                      }`}
                    >
                      <Lock className="w-4 h-4" />
                      <span className="text-[11px] uppercase tracking-wider font-medium">Express Pay</span>
                    </button>
                  </div>

                  {/* Card Form */}
                  {paymentMethod === 'card' && (
                    <div className="p-4 bg-white border border-[#D5CFC2] space-y-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#4A4742] mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#D5CFC2] text-xs text-[#1C1A17] focus:outline-none focus:border-[#1C1A17]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#4A4742] mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#D5CFC2] text-xs text-[#1C1A17] font-mono focus:outline-none focus:border-[#1C1A17]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#4A4742] mb-1">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            required
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#D5CFC2] text-xs text-[#1C1A17] font-mono focus:outline-none focus:border-[#1C1A17]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#4A4742] mb-1">
                            CVV / CVC
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            required
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#D5CFC2] text-xs text-[#1C1A17] font-mono focus:outline-none focus:border-[#1C1A17]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cash on Delivery option with verification compliance */}
                  {paymentMethod === 'cod' && (
                    <div className="p-4 bg-[#F5F2EA] border border-[#D5CFC2] space-y-2">
                      <p className="text-xs font-semibold text-[#1C1A17] flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-[#2F613B]" />
                        Cash on Delivery Verified
                      </p>
                      <p className="text-xs text-[#5D5950] leading-relaxed">
                        Pay in cash or debit upon physical inspection at your address. An SMS verification code will be dispatched to <strong>{phone}</strong> before arrival.
                      </p>
                      <div className="pt-2 text-[11px] text-[#7A766C]">
                        Free delivery applied. Total payable on delivery: <strong className="font-mono text-[#1C1A17]">{formatPrice(finalTotal, currency)}</strong>
                      </div>
                    </div>
                  )}

                  {/* Wallet option */}
                  {paymentMethod === 'wallet' && (
                    <div className="p-4 bg-white border border-[#D5CFC2] text-center space-y-2">
                      <p className="text-xs text-[#55524B]">One-touch biometric payment with your authorized device passkey.</p>
                      <div className="inline-block px-4 py-2 bg-black text-white text-xs font-mono">
                         Pay / G Pay Ready
                      </div>
                    </div>
                  )}
                </div>

                {/* Security trust badge */}
                <div className="flex items-center gap-2 text-xs text-[#7A766C] pt-2">
                  <ShieldCheck className="w-4 h-4 text-[#1C1A17]" />
                  <span>256-bit encrypted checkout with buyer authenticity protection</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#1C1A17] hover:bg-[#2F2C27] text-[#FAF9F5] text-xs uppercase tracking-widest font-medium transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Securing Order at Atelier...</span>
                  ) : (
                    <>
                      <span>Complete Purchase</span>
                      <span>·</span>
                      <span className="font-mono tabular-nums">{formatPrice(finalTotal, currency)}</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

          {/* Order Summary Sidebar (Right 5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-[#F3F1EA] border-t lg:border-t-0 lg:border-l border-[#E7E3D8] flex flex-col justify-between">
            <div>
              <h3 className="text-xs uppercase tracking-widest font-semibold text-[#1C1A17] mb-4">
                Order Summary ({items.length})
              </h3>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-2 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs items-center">
                    <img
                      src={item.product.image}
                      alt=""
                      className="w-12 h-12 object-cover bg-white border border-[#D5CFC2] shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1C1A17] truncate">{item.product.name}</p>
                      <p className="text-[11px] text-[#7A766C] font-mono">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-mono tabular-nums font-medium text-[#1C1A17]">
                      {formatPrice(item.unitPrice * item.quantity, currency)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2 text-xs text-[#5D5950] border-t border-[#DDD7CA] pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-[#1C1A17]">
                    {formatPrice(baseTotals.subtotal, currency)}
                  </span>
                </div>

                {baseTotals.discount > 0 && (
                  <div className="flex justify-between text-[#2F613B]">
                    <span>Savings</span>
                    <span className="font-mono tabular-nums">
                      -{formatPrice(baseTotals.discount, currency)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Courier Transit</span>
                  <span className="font-mono tabular-nums text-[#1C1A17]">
                    {finalShippingCost === 0 ? 'Complimentary' : formatPrice(finalShippingCost, currency)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-mono tabular-nums text-[#1C1A17]">
                    {formatPrice(baseTotals.tax, currency)}
                  </span>
                </div>

                <div className="flex justify-between pt-3 border-t border-[#DDD7CA] text-sm font-semibold text-[#1C1A17]">
                  <span className="font-serif">Total Due</span>
                  <span className="font-mono tabular-nums text-base">
                    {formatPrice(finalTotal, currency)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#DDD7CA] text-[11px] text-[#7A766C] flex items-center justify-between">
              <span>Atelier Guarantee</span>
              <span>30-Day Returns</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
