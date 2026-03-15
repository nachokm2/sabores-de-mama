import React, { useState } from 'react';
import { BookingData } from '../types';
import { getAvailableDays, getAvailableTimes } from '../utils';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isBefore, startOfDay, getDay, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, Info } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
  data: BookingData;
  onUpdate: (data: Partial<BookingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function CalendarSelection({ data, onUpdate, onNext, onBack }: Props) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const today = startOfDay(new Date());

  const availableDaysOfWeek = getAvailableDays(data.commune);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(addMonths(currentMonth, -1));

  const isDayAvailable = (date: Date) => {
    if (isBefore(date, today)) return false;
    return availableDaysOfWeek.includes(getDay(date));
  };

  const handleDateSelect = (date: Date) => {
    if (isDayAvailable(date)) {
      onUpdate({ date, timeSlot: null, timeNote: null });
    }
  };

  const availableTimes = data.date ? getAvailableTimes(data.commune, data.date) : [];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="grid md:grid-cols-2">
        {/* Calendar Section */}
        <div className="p-8 border-b md:border-b-0 md:border-r border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Selecciona una fecha
            </h2>
            <div className="flex space-x-2">
              <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="text-center mb-6 text-lg font-medium text-gray-800 capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: getDay(startOfMonth(currentMonth)) }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2" />
            ))}
            
            {daysInMonth.map(date => {
              const isAvailable = isDayAvailable(date);
              const isSelected = data.date && isSameDay(date, data.date);
              
              return (
                <button
                  key={date.toString()}
                  onClick={() => handleDateSelect(date)}
                  disabled={!isAvailable}
                  className={clsx(
                    "aspect-square p-2 flex items-center justify-center rounded-full text-sm transition-all",
                    !isAvailable && "text-gray-300 cursor-not-allowed",
                    isAvailable && !isSelected && "text-gray-700 hover:bg-brand-50 hover:text-brand-600",
                    isSelected && "bg-brand-600 text-white font-medium shadow-md"
                  )}
                >
                  {format(date, 'd')}
                </button>
              );
            })}
          </div>
          
          <div className="mt-8">
            <p className="text-sm text-gray-500 flex items-center">
              <Info className="w-4 h-4 mr-2" />
              Mostrando disponibilidad para <span className="font-semibold ml-1">{data.commune}</span>
            </p>
          </div>
        </div>

        {/* Time Selection Section */}
        <div className="p-8 bg-gray-50/50">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Horarios disponibles
          </h2>

          {!data.date ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 pb-12">
              <Clock className="w-12 h-12 mb-4 opacity-20" />
              <p>Selecciona una fecha en el calendario</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mb-6">
                <p className="text-sm font-medium text-brand-600 capitalize">
                  {format(data.date, "EEEE, d 'de' MMMM", { locale: es })}
                </p>
              </div>

              {availableTimes.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay horarios disponibles para este día.</p>
              ) : (
                <div className="space-y-3">
                  {availableTimes.map((slot, idx) => (
                    <button
                      key={idx}
                      onClick={() => onUpdate({ timeSlot: slot.time, timeNote: slot.note })}
                      className={clsx(
                        "w-full text-left p-4 rounded-xl border transition-all",
                        data.timeSlot === slot.time
                          ? "border-brand-600 bg-brand-50 ring-1 ring-brand-600"
                          : "border-gray-200 bg-white hover:border-brand-300 hover:shadow-sm"
                      )}
                    >
                      <div className="font-medium text-gray-900">{slot.time}</div>
                      {slot.note && (
                        <div className="text-sm text-gray-500 mt-1">{slot.note}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center">
        <button
          onClick={onBack}
          className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Volver
        </button>
        <button
          onClick={onNext}
          disabled={!data.date || !data.timeSlot}
          className="px-8 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          Confirmar Horario
        </button>
      </div>
    </div>
  );
}
