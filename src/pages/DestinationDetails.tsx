import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDestinations } from '@/hooks/useDestinations';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const DestinationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: destinations = [], isLoading } = useDestinations();
  const { t } = useLanguage();

  const destination = destinations.find((d) => String(d.id) === String(id));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-xl font-semibold">{t('destination.loading')}</div>
    );
  }

  if (!destination) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h2 className="text-2xl font-bold mb-4">{t('destination.notfound')}</h2>
        <Button onClick={() => navigate(-1)}><ArrowLeft className="mr-2" />{t('destination.back')}</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-egyptian py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button variant="ghost" className="mb-8" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2" />{t('destination.back')}
        </Button>
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <img src={destination.image} alt={destination.name} className="w-full h-64 object-cover" />
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-2 text-pharaoh-700 flex items-center gap-2"><MapPin />{destination.name}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge>{destination.region}</Badge>
              <Badge>{destination.activities?.join(', ')}</Badge>
            </div>
            <p className="text-lg text-muted-foreground mb-6">{destination.description}</p>
            <h2 className="text-2xl font-semibold mb-2 text-pharaoh-600">{t('destination.highlights')}</h2>
            <ul className="list-disc pl-5 space-y-1 mb-6">
              {destination.highlights && destination.highlights.map((h, idx) => (
                <li key={idx}>{h}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;
