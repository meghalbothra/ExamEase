import React from 'react';
import * as Icons from 'lucide-react';

interface SubjectCardProps {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof Icons;
  color: string;
  selected: boolean;
  onSelect: () => void;
}

export function SubjectCard({
  name,
  description,
  icon,
  color,
  selected,
  onSelect
}: SubjectCardProps) {
  const Icon = Icons[icon];

  const colorClasses = {
    violet: {
      icon: 'text-violet-600 bg-violet-100',
      selected: 'border-violet-400 bg-violet-100'
    },
    yellow: {
      icon: 'text-amber-600 bg-amber-100',
      selected: 'border-amber-400 bg-amber-100'
    },
    blue: {
      icon: 'text-blue-600 bg-blue-100',
      selected: 'border-blue-400 bg-blue-100'
    },
    green: {
      icon: 'text-emerald-600 bg-emerald-100',
      selected: 'border-emerald-400 bg-emerald-100'
    }
  };

  const currentColor = colorClasses[color as keyof typeof colorClasses];

  return (
    <button
      onClick={onSelect}
      className={`
        w-full h-40 rounded-xl transition-all duration-300
        border-2 shadow-sm
        ${selected 
          ? `${currentColor.selected} shadow-lg`
          : 'bg-white border-gray-100 hover:border-violet-300 hover:bg-violet-50 hover:shadow-md'
        }
      `}
    >
      <div className="flex items-start gap-4 p-6 h-full">
        <div className={`
          p-3 rounded-xl transition-transform duration-300
          ${selected ? currentColor.icon : 'bg-purple-200 text-gray-600'}
          group-hover:scale-105
        `}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-left flex-1">
          <h3 className={`
            font-semibold text-lg mb-2
            ${selected ? 'text-gray-800' : 'text-gray-700'}
          `}>
            {name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}