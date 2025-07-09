
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Search, Filter } from 'lucide-react';
import { useDestinations } from '@/hooks/useDestinations';
import { Link } from 'react-router-dom';

const Destinations = () => {
  const { data: destinations = [], isLoading, isError, error } = useDestinations();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState('all');

  const regions = [
    { value: 'all', label: 'All Regions' },
    { value: 'Red Sea', label: 'Red Sea' },
    { value: 'Western Desert', label: 'Western Desert' },
    { value: 'Upper Egypt', label: 'Upper Egypt' },
    { value: 'Mediterranean Coast', label: 'Mediterranean Coast' },
    { value: 'Middle Egypt', label: 'Middle Egypt' }
  ];

  const activities = [
    { value: 'all', label: 'All Activities' },
    { value: 'beach', label: 'Beach & Water' },
    { value: 'desert', label: 'Desert Adventure' },
    { value: 'cultural', label: 'Cultural Sites' },
    { value: 'historical', label: 'Historical Tours' },
    { value: 'diving', label: 'Diving & Snorkeling' },
    { value: 'adventure', label: 'Adventure Sports' }
  ];

  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         destination.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || destination.region === selectedRegion;
    const matchesActivity = selectedActivity === 'all' || destination.activities.includes(selectedActivity);
    
    return matchesSearch && matchesRegion && matchesActivity;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-egyptian flex items-center justify-center">
        <div className="text-center">Loading destinations...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-egyptian">
      {/* Header */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-12 bg-pharaoh-400" />
              <span className="text-pharaoh-600 font-medium tracking-wider text-sm uppercase">
                Explore Egypt
              </span>
              <div className="h-px w-12 bg-pharaoh-400" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient-gold">
              All Destinations
            </h1>
            <p className="text-lg text-muted-foreground">
              From pristine Red Sea coastlines to mystical desert oases, discover Egypt's most captivating locations
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-pharaoh-600" />
              <h3 className="text-lg font-semibold">Filter Destinations</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search destinations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(region => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity" />
                </SelectTrigger>
                <SelectContent>
                  {activities.map(activity => (
                    <SelectItem key={activity.value} value={activity.value}>
                      {activity.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredDestinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
              >
                <Link to={`/destinations-trips/${destination.id}`}>
                  <Card className="overflow-hidden group cursor-pointer bg-card/70 backdrop-blur-sm border-border/50 hover:shadow-2xl transition-all duration-500 h-full">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
                      
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pharaoh-500/90 text-white text-xs font-medium">
                          <MapPin className="w-3 h-3" />
                          {destination.region}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-pharaoh-600 transition-colors">
                        {destination.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 flex-1">
                        {destination.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {destination.highlights.slice(0, 4).map((highlight, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            <div className="w-1.5 h-1.5 bg-pharaoh-400 rounded-full" />
                            <span className="text-muted-foreground">{highlight}</span>
                          </div>
                        ))}
                      </div>

                      <Button className="w-full group/btn">
                        استكشف {destination.name}
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {filteredDestinations.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground">No destinations found matching your criteria.</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Destinations;
