'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface StatItem {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  index?: number;
}

const QuickStatsCard = ({ title, value, icon: Icon, index = 0 }: StatItem) => {
  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1 + index * 0.1 }}
    >
      <Card className="h-1/3 p-2 justify-end flex items-end">
        <CardContent className="p-1 gap-2 flex items-center w-full">
          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
            <Icon className="w-5 h-5 text-teal-600" />
          </div>
          <div className="flex items-start px-1 justify-end flex-col">
            <p className="text-xs text-gray-600">{title}</p>
            <p className="font-semibold text-2xl">{value}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuickStatsCard;
