import React, { useState, useEffect } from 'react';
import { BookingData } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ShieldAlert, CreditCard, Clock, CheckCircle2 } from 'lucide-react';
import StripePayment from './StripePayment';

interface Props {
  data: BookingData;
  onUpdate: (data: Partial<BookingData>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
}

export default function Checkout({ data, onUpdate, onNext, onBack, onCancel }: Props) {
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds

  useEffect(() => {
    if (timeLeft <= 0) {
      onCancel();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onCancel]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const amount = 85000; // Fixed amount for now

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-start space-x-3">
        <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium text-yellow-800">Reserva temporal activa</h3>
          <p className="text-sm text-yellow-700 mt-1">
            Tu horario está reservado. Tienes <span className="font-bold">{formatTime(timeLeft)}</span> para completar el pago antes de que se libere el cupo.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Resumen de Reserva</h2>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Fecha y Hora</p>
                <p className="font-medium text-gray-900 capitalize">
                  {data.date ? format(data.date, "EEEE, d 'de' MMMM yyyy", { locale: es }) : ''}
                </p>
                <p className="text-gray-700">{data.timeSlot}</p>
                {data.timeNote && <p className="text-xs text-gray-500 mt-1">{data.timeNote}</p>}
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Ubicación</p>
                <p className="font-medium text-gray-900">{data.commune}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Detalles del Servicio</p>
                <p className="font-medium text-gray-900">{data.portions} porciones</p>
                <p className="text-gray-700">{data.burners} quemadores</p>
              </div>

              {data.restrictions && (
                <div>
                  <p className="text-sm text-gray-500">Restricciones</p>
                  <p className="font-medium text-gray-900">{data.restrictions}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 bg-gray-50 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <ShieldAlert className="w-5 h-5 mr-2 text-gray-500" />
            Política de Cancelación
          </h3>
          
          <label className="flex items-start space-x-3 cursor-pointer group">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                checked={data.agreedToPolicy}
                onChange={(e) => onUpdate({ agreedToPolicy: e.target.checked })}
                className="w-5 h-5 border-gray-300 rounded text-brand-600 focus:ring-brand-500 transition-colors cursor-pointer"
              />
            </div>
            <div className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
              He leído y acepto que si la cancelación no se realiza con al menos 48 horas de anticipación, se retendrá el 50% del valor abonado.
            </div>
          </label>
        </div>

        <div className="p-8 bg-white flex flex-col sm:flex-row justify-between items-start gap-8">
          <div className="text-left w-full sm:w-1/3">
            <p className="text-sm text-gray-500">Total a pagar</p>
            <p className="text-3xl font-bold text-gray-900">${amount.toLocaleString('es-CL')}</p>
            <p className="text-xs text-gray-500 mt-1">Pago total requerido para confirmar</p>
            
            <button
              onClick={onBack}
              className="mt-6 px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors w-full border border-gray-200 rounded-xl hover:bg-gray-50"
            >
              Volver
            </button>
          </div>

          <div className="w-full sm:w-2/3">
            <StripePayment amount={amount} onNext={onNext} isAgreed={data.agreedToPolicy} />
          </div>
        </div>
      </div>
    </div>
  );
}
