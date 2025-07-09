import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTrips } from '@/hooks/useTrips';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const DestinationTrips = () => {
  const { destinationId } = useParams<{ destinationId: string }>();
  const { data: trips = [], isLoading, isError, error } = useTrips(destinationId);

  if (isLoading) return (
  <div className="flex flex-col items-center justify-center min-h-[300px]">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
    <span className="text-lg font-medium text-muted-foreground">جاري تحميل الرحلات...</span>
  </div>
);
if (isError) return (
  <div className="flex flex-col items-center justify-center min-h-[300px]">
    <span className="text-destructive text-lg font-semibold mb-2">حدث خطأ أثناء تحميل الرحلات</span>
    <span className="text-muted-foreground">{error?.message || 'تعذر تحميل الرحلات.'}</span>
  </div>
);

return (
  <div className="max-w-6xl mx-auto py-10 px-4">
    <h2 className="text-3xl font-bold mb-8 text-center text-primary">الرحلات المتاحة</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      <TooltipProvider>
        {trips.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground text-xl py-16">لا توجد رحلات متاحة لهذه الوجهة.</div>
        )}
        {trips.map((trip, idx) => (
          <motion.div
            key={trip.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.5, type: 'spring' }}
            whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(16, 185, 129, 0.12)' }}
          >
            <Link to={`/trips/${trip.id}`} className="block focus:outline-none group">
              <Card className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col">
                <div className="relative">
                  <img
  src={trip.image_url || 'https://placehold.co/600x400?text=No+Image'}
  alt={trip.name}
  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-lg bg-gray-100"
  onError={e => {
    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
  }}
/>
                </div>
                <CardHeader className="flex-1">
                  <h3 className="text-xl font-semibold text-primary mb-2 truncate" title={trip.name}>{trip.name}</h3>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-2">
                  <p className="text-muted-foreground line-clamp-2 mb-2">{trip.description}</p>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-bold">السعر:</span>
                    <span className="text-green-600 font-semibold">{trip.price} $</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="font-bold">التواريخ:</span>
                    <span className="text-muted-foreground">{trip.start_date} - {trip.end_date}</span>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="link" className="text-emerald-700 font-bold p-0 h-auto self-end">
                        تفاصيل الرحلة <span aria-hidden>→</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      اضغط لعرض تفاصيل الرحلة وحجزها
                    </TooltipContent>
                  </Tooltip>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </TooltipProvider>
    </div>
  </div>
);
};

export default DestinationTrips;

