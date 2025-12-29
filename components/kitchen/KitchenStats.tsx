import { Clock, ChefHat, Package, Activity } from 'lucide-react';
import type { KitchenStats as KitchenStatsType } from '@/lib/services/kitchen.service';

interface KitchenStatsProps {
  stats: KitchenStatsType;
}

export function KitchenStats({ stats }: KitchenStatsProps) {
  const statCards = [
    {
      label: 'Received',
      value: stats.received,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      label: 'Preparing',
      value: stats.preparing,
      icon: ChefHat,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      label: 'Ready',
      value: stats.ready,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      label: 'Active',
      value: stats.active,
      icon: Activity,
      color: 'text-gray-900',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`bg-white rounded-lg border-2 ${stat.borderColor} p-6 transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">{stat.label}</div>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className={`text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}