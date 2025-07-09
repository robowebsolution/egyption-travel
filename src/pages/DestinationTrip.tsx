import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Users, Mail, User, Phone, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSubmitUserData } from '@/hooks/useSubmitUserData';
import { useTrip } from '@/hooks/useTrip';

// English static data for Egypt Travel
const DEFAULT_INCLUSIONS = [
  'Hotel pick-up and drop-off',
  'All transfers in air-conditioned vehicle',
  'Lunch',
  'Entrance fees to the Egyptian Museum',
  'Entrance to the Pyramids Plateau and the Sphinx',
  'Certified Egyptologist guide',
  'Travel insurance',
];
const DEFAULT_EXCLUSIONS = [
  'Entrance to get inside any of the Pyramids themselves',
  'Drinks during lunch',
];
const DEFAULT_MEETING_POINT = 'Please meet Egypt Travel representative at your hotel lobby.';
const DEFAULT_THINGS_TO_REMEMBER = [
  'Bring your passport, wear comfortable clothes, and bring your hat, sunglasses, water, camera, and money for shopping and tipping.',
  'Entrance fees to get inside the pyramids (Cheops, Mykerinos, or Kefren) are not included. Tickets are limited and must be purchased on site.',
  'Arrange a take-away breakfast box with your hotel reception one day before the tour date.',
  'If your accommodation includes dinner, coordinate with your hotel reception to provide a late dinner at your room upon return.',
  'Leave your accommodation and contact details during the booking process.',
  'Egypt Travel team will contact you 24 hours prior to the tour date to reconfirm the pickup time and location.',
  'For assistance, contact us at 00201006015368 or excursions.booking@egypttravel.com',
  'Tour duration is approximately 18 hours and may change due to operational reasons.',
  'This tour is available in English, German, Italian, and Arabic.',
];
const DEFAULT_CANCELLATION_POLICY = 'Receive a 100% refund if you cancel up to 24 hours before the experience begins.';

const DestinationTrip = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { submitData, isLoading: isSubmitting, result } = useSubmitUserData();
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', people: 1 });
  const [success, setSuccess] = useState(false);

  const { data: trip, isLoading } = useTrip(tripId);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-xl font-semibold">جاري تحميل الرحلة...</div>;
  }

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h2 className="text-2xl font-bold mb-4">لم يتم العثور على الرحلة</h2>
        <Button onClick={() => navigate(-1)}><ArrowLeft className="mr-2" />رجوع</Button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trip) return;
    const price = trip.price;
    const userData = {
      ...form,
      source_page: 'trip',
      source_id: trip.id,
      source_name: trip.name,
      people: Number(form.people),
      price: price,
    };
    const result = await submitData(userData);
    if (result.success) {
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', date: '', people: 1 });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-egyptian py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <Button variant="ghost" className="mb-8" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2" />Back
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-xl overflow-hidden flex flex-col">
            <img src={trip.image_url} alt={trip.name} className="w-full h-80 object-cover rounded-t-xl" />
            <div className="p-8 flex-1 flex flex-col">
              <h1 className="text-3xl font-bold mb-2 text-pharaoh-700">{trip.name}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-pharaoh-50 text-pharaoh-700"><Calendar className="inline w-4 h-4 ml-1" /> {trip.start_date} - {trip.end_date}</Badge>
                <Badge className="bg-pharaoh-100 text-pharaoh-800 font-bold text-lg px-4 py-2">{trip.price} <span className="text-base">$</span></Badge>
              </div>
              <p className="text-base text-gray-600 mb-6 leading-relaxed">{trip.description}</p>

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-pharaoh-700 mb-2">Inclusions</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {(trip.inclusions && trip.inclusions.length > 0 ? trip.inclusions : DEFAULT_INCLUSIONS).map((inc: string, idx: number) => (
                      <li key={idx}>{inc}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-pharaoh-700 mb-2">Exclusions</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {(trip.exclusions && trip.exclusions.length > 0 ? trip.exclusions : DEFAULT_EXCLUSIONS).map((exc: string, idx: number) => (
                      <li key={idx}>{exc}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Meeting Point */}
              <div className="mb-6">
                <h3 className="font-semibold text-pharaoh-700 mb-2">Meeting Point</h3>
                <p className="text-gray-700">{trip.meeting_point || DEFAULT_MEETING_POINT}</p>
              </div>

              {/* Things to Remember */}
              <div className="mb-6">
                <h3 className="font-semibold text-pharaoh-700 mb-2">Things to Remember</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {(trip.things_to_remember && trip.things_to_remember.length > 0 ? trip.things_to_remember : DEFAULT_THINGS_TO_REMEMBER).map((thing: string, idx: number) => (
                    <li key={idx}>{thing}</li>
                  ))}
                </ul>
              </div>

              {/* Cancellation Policy */}
              <div className="bg-gray-50 rounded-lg p-4 mt-auto">
                <h3 className="font-semibold text-pharaoh-700 mb-2">Cancellation Policy</h3>
                <p className="text-sm text-gray-500">{trip.cancellation_policy || DEFAULT_CANCELLATION_POLICY}</p>
              </div>
            </div>
          </div>
          {/* Booking Sidebar */}
          <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col justify-center sticky top-8 h-fit max-h-[680px] min-w-[320px] md:min-w-[340px] md:max-w-[360px] overflow-y-auto self-start">
            <h2 className="text-2xl font-bold mb-4 text-pharaoh-700 text-center">Book This Trip</h2>
            <div className="mb-4 text-center">
              <span className="inline-block bg-pharaoh-100 text-pharaoh-800 font-bold text-xl rounded-lg px-6 py-2 shadow">{trip.price} <span className="text-base">$</span></span>
            </div>
            {success ? (
              <div className="text-green-600 text-center font-semibold">
                Booking successful!
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                {result && !result.success && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="mr-3">
                        <p className="text-sm font-medium">
                          {result.error || 'Something went wrong. Please try again.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm mb-1 font-medium text-pharaoh-700">Full Name</label>
                    <div className="relative">
                      <input type="text" name="name" required value={form.name} onChange={handleChange} className="w-full pl-10 py-2 border-2 border-gray-300 rounded-lg bg-white placeholder-gray-500 text-gray-900 focus:border-pharaoh-500 focus:ring-2 focus:ring-pharaoh-100 shadow-sm transition-all duration-150" placeholder="Full Name" />
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-pharaoh-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1 font-medium text-pharaoh-700">Email</label>
                    <div className="relative">
                      <input type="email" name="email" required value={form.email} onChange={handleChange} className="w-full pl-10 py-2 border-2 border-gray-300 rounded-lg bg-white placeholder-gray-500 text-gray-900 focus:border-pharaoh-500 focus:ring-2 focus:ring-pharaoh-100 shadow-sm transition-all duration-150" placeholder="Email" />
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-pharaoh-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1 font-medium text-pharaoh-700">Phone</label>
                    <div className="relative">
                      <input type="tel" name="phone" required value={form.phone} onChange={handleChange} className="w-full pl-10 py-2 border-2 border-gray-300 rounded-lg bg-white placeholder-gray-500 text-gray-900 focus:border-pharaoh-500 focus:ring-2 focus:ring-pharaoh-100 shadow-sm transition-all duration-150" placeholder="Phone" />
                      <Phone className="absolute left-3 top-2.5 w-4 h-4 text-pharaoh-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1 font-medium text-pharaoh-700">Date</label>
                    <div className="relative">
                      <input type="date" name="date" required value={form.date} onChange={handleChange} className="w-full pl-10 py-2 border-2 border-gray-300 rounded-lg bg-white placeholder-gray-500 text-gray-900 focus:border-pharaoh-500 focus:ring-2 focus:ring-pharaoh-100 shadow-sm transition-all duration-150" placeholder="Date" />
                      <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-pharaoh-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1 font-medium text-pharaoh-700">People</label>
                    <div className="relative">
                      <input type="number" name="people" min={1} max={20} required value={form.people} onChange={handleChange} className="w-full pl-10 py-2 border-2 border-gray-300 rounded-lg bg-white placeholder-gray-500 text-gray-900 focus:border-pharaoh-500 focus:ring-2 focus:ring-pharaoh-100 shadow-sm transition-all duration-150" placeholder="People" />
                      <Users className="absolute left-3 top-2.5 w-4 h-4 text-pharaoh-400" />
                    </div>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="bg-pharaoh-600 hover:bg-pharaoh-700 w-full text-lg mt-2" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Booking...' : 'Book Now'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationTrip;
