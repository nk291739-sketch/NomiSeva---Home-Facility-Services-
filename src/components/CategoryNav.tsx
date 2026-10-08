import React from 'react';
import { 
  Sparkles, 
  Wind, 
  Zap, 
  Wrench, 
  Brush, 
  Home 
} from 'lucide-react';
import { CATEGORIES_LIST } from '../data/servicesData';

interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  lang: 'en' | 'hi';
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  lang,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wind':
        return <Wind className="w-4 h-4" />;
      case 'Zap':
        return <Zap className="w-4 h-4" />;
      case 'Wrench':
        return <Wrench className="w-4 h-4" />;
      case 'Brush':
        return <Brush className="w-4 h-4" />;
      case 'Home':
        return <Home className="w-4 h-4" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white border-b border-neutral-200 py-3 sticky top-16 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1">
          {CATEGORIES_LIST.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 whitespace-nowrap ${
                  isSelected
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 hover:text-neutral-900'
                }`}
              >
                <span className={isSelected ? 'text-white' : 'text-neutral-500'}>
                  {getIcon(cat.icon)}
                </span>
                <span>{lang === 'hi' ? cat.labelHi : cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
