import React, { useState } from 'react';
import { BookingData, COMMUNES } from '../types';
import { AlertCircle } from 'lucide-react';

interface Props {
  data: BookingData;
  onUpdate: (data: Partial<BookingData>) => void;
  onNext: () => void;
}

export default function PreBookingForm({ data, onUpdate, onNext }: Props) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.burners < 3) {
      setError("Lo sentimos, para garantizar la calidad y los tiempos del servicio, se requiere un mínimo de 3 quemadores. El servicio no puede realizarse.");
      return;
    }
    setError(null);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Detalles del Servicio</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ¿Para cuántas porciones necesitas el servicio?
          </label>
          <select
            required
            value={data.portions || ''}
            onChange={(e) => onUpdate({ portions: Number(e.target.value) })}
            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 p-3 bg-gray-50 border"
          >
            <option value="" disabled>Selecciona una opción</option>
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} {num === 1 ? 'porción' : 'porciones'}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ¿Con cuántos quemadores cuenta tu cocina?
          </label>
          <select
            required
            value={data.burners || ''}
            onChange={(e) => {
              onUpdate({ burners: Number(e.target.value) });
              if (Number(e.target.value) >= 3) {
                setError(null);
              }
            }}
            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 p-3 bg-gray-50 border"
          >
            <option value="" disabled>Selecciona una opción</option>
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num} {num === 1 ? 'quemador' : 'quemadores'}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="p-4 bg-red-50 rounded-xl flex items-start space-x-3 text-red-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ¿Tienes alguna restricción alimentaria o algún alimento que no consumas?
          </label>
          <textarea
            value={data.restrictions}
            onChange={(e) => onUpdate({ restrictions: e.target.value })}
            placeholder="Ej: Alergia al maní, vegetariano, etc."
            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 p-3 bg-gray-50 border min-h-[100px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Selecciona tu comuna
          </label>
          <select
            required
            value={data.commune}
            onChange={(e) => onUpdate({ commune: e.target.value, date: null, timeSlot: null })}
            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 p-3 bg-gray-50 border"
          >
            <option value="" disabled>Selecciona una comuna</option>
            {COMMUNES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={!!error || !data.portions || !data.burners || !data.commune}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Continuar al Calendario
      </button>
    </form>
  );
}
