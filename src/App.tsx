import React, { useState } from 'react';
import { BookingData } from './types';
import PreBookingForm from './components/PreBookingForm';
import CalendarSelection from './components/CalendarSelection';
import Checkout from './components/Checkout';
import Success from './components/Success';

const initialData: BookingData = {
  portions: 0,
  burners: 0,
  restrictions: '',
  commune: '',
  date: null,
  timeSlot: null,
  timeNote: null,
  agreedToPolicy: false,
};

export default function App() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<BookingData>(initialData);

  const [showTimeoutModal, setShowTimeoutModal] = useState(false);

  const updateData = (newData: Partial<BookingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);
  const reset = () => {
    setData(initialData);
    setStep(1);
  };

  const cancelReservation = () => {
    setShowTimeoutModal(true);
    setData(prev => ({ ...prev, date: null, timeSlot: null, timeNote: null, agreedToPolicy: false }));
    setStep(2); // Go back to calendar
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="https://saboresdemama.com/wp-content/uploads/2025/06/Logo-sabores-de-mama.jpg" 
              alt="Sabores de Mamá Logo" 
              className="w-10 h-10 rounded-full object-cover border border-gray-100"
              referrerPolicy="no-referrer"
            />
            <span className="text-xl font-bold text-gray-900 tracking-tight">Sabores de Mamá</span>
          </div>

          {step < 4 && (
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-500">
              <span className={step >= 1 ? 'text-brand-600' : ''}>Detalles</span>
              <span className="text-gray-300">/</span>
              <span className={step >= 2 ? 'text-brand-600' : ''}>Fecha</span>
              <span className="text-gray-300">/</span>
              <span className={step >= 3 ? 'text-brand-600' : ''}>Pago</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="transition-all duration-300 ease-in-out">
          {step === 1 && (
            <PreBookingForm data={data} onUpdate={updateData} onNext={nextStep} />
          )}
          {step === 2 && (
            <CalendarSelection data={data} onUpdate={updateData} onNext={nextStep} onBack={prevStep} />
          )}
          {step === 3 && (
            <Checkout data={data} onUpdate={updateData} onNext={nextStep} onBack={prevStep} onCancel={cancelReservation} />
          )}
          {step === 4 && (
            <Success data={data} onReset={reset} />
          )}
        </div>
      </main>

      {showTimeoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tiempo expirado</h3>
            <p className="text-gray-600 mb-6">El tiempo de reserva ha expirado. El cupo ha sido liberado.</p>
            <button
              onClick={() => setShowTimeoutModal(false)}
              className="w-full py-2 px-4 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
