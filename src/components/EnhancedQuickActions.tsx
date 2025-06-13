
import React from 'react';
import { Plus, TrendingUp, MapPin, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EnhancedQuickActions = () => {
  const navigate = useNavigate();
  
  const actions = [
    { 
      icon: Plus, 
      label: 'Add Crop', 
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => navigate('/add-crop')
    },
    { 
      icon: TrendingUp, 
      label: 'Predict Price', 
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => navigate('/predict-price')
    },
    { 
      icon: MapPin, 
      label: 'Find Mandi', 
      color: 'bg-orange-500 hover:bg-orange-600',
      onClick: () => navigate('/find-mandi')
    },
    { 
      icon: History, 
      label: 'History', 
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => navigate('/history')
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className={`${action.color} text-white p-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95`}
        >
          <action.icon className="w-6 h-6 mx-auto mb-2" />
          <span className="text-sm font-medium">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default EnhancedQuickActions;
