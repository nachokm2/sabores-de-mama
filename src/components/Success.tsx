import React from 'react';
import { BookingData } from '../types';
import { CheckCircle2, Mail, Calendar as CalendarIcon } from 'lucide-react';

interface Props {
  data: BookingData;
  onReset: () => void;
}

export default function Success({ data, onReset }: Props) {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-600" />
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        ¡Tu servicio ha sido agendado con éxito!
      </h2>

      <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left space-y-4">
        <div className="flex items-start space-x-3">
          <CalendarIcon className="w-5 h-5 text-brand-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900">Reserva Confirmada</p>
            <p className="text-sm text-gray-600 mt-1">
              Tu pago ha sido procesado correctamente. El cupo está asegurado.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Mail className="w-5 h-5 text-brand-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900">Siguientes Pasos</p>
            <p className="text-sm text-gray-600 mt-1">
              Desde ya puedes elegir los platos deseados. De todas formas, el viernes previo al servicio nos pondremos en contacto contigo para confirmar los detalles.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onReset}
        className="px-8 py-3 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors shadow-sm"
      >
        Volver al inicio
      </button>
    </div>
  );
}
