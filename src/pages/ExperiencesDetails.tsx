import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExperiences } from '@/hooks/useExperiences';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Calendar, Star, Mail, User, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSubmitUserData } from '@/hooks/useSubmitUserData';
import { formatUSD } from '@/lib/currency';
import { usePricingTiers } from '@/hooks/usePricingTiers';
import PriceTable from '@/components/pricing/PriceTable';

const ExperiencesDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: experiences = [], isLoading } = useExperiences();
  const { t } = useLanguage();
  const { submitData, isLoading: isSubmitting, result } = useSubmitUserData();
  // نموذج الحجز
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    people: 1,
  });
  const [success, setSuccess] = useState(false);

  const exp = experiences.find((e) => String(e.id) === String(id));
  const { data: tiers = [] } = usePricingTiers({ experienceId: exp?.id });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-xl font-semibold">{t('experience.loading')}</div>
    );
  }

  if (!exp) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h2 className="text-2xl font-bold mb-4">{t('experience.notfound')}</h2>
        <Button onClick={() => navigate(-1)}><ArrowLeft className="mr-2" />{t('experience.back')}</Button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!exp) return;
    
    // استخراج السعر من النص (مثال: "500 $" -> 500)
    const priceText = exp.price;
    const priceMatch = priceText.match(/\d+/);
    const price = priceMatch ? Number(priceMatch[0]) : 0;
    
    const userData = {
      ...form,
      source_page: 'experience',
      source_id: exp.id,
      source_name: exp.title,
      people: Number(form.people),
      price: price, // إضافة السعر
    };
    
    const result = await submitData(userData);
    if (result.success) {
      setSuccess(true);
      // إعادة تعيين النموذج
      setForm({
        name: '',
        email: '',
        phone: '',
        date: '',
        people: 1,
      });
    } else {
      // عرض رسالة الخطأ في واجهة المستخدم بدلاً من استخدام alert
      // سيتم عرض الخطأ من خلال حالة result في النموذج
    }
  };

  return (
    <div className="min-h-screen bg-gradient-egyptian py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <Button variant="ghost" className="mb-8" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2" />{t('experience.back')}
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* معرض الصور */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-xl overflow-hidden flex flex-col">
            <img src={exp.image} alt={exp.title} className="w-full h-80 object-cover rounded-t-xl" />
            <div className="p-8 flex-1 flex flex-col">
              <h1 className="text-3xl font-bold mb-2 text-pharaoh-700">{exp.title}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-pharaoh-50 text-pharaoh-700"><Calendar className="inline w-4 h-4 ml-1" /> {exp.duration}</Badge>
                <Badge className="bg-pharaoh-100 text-pharaoh-800 font-bold text-lg px-4 py-2">{t('price.startFrom')} {formatUSD(exp.price)}</Badge>
              </div>
              <p className="text-base text-gray-600 mb-6 leading-relaxed">{exp.description}</p>
              <h2 className="text-xl font-semibold mb-2 text-pharaoh-600">{t('experience.highlights')}</h2>
              <ul className="list-disc pl-5 space-y-1 mb-6 text-gray-700">
                {exp.highlights && exp.highlights.map((h, idx) => (
                  <li key={idx}>{h}</li>
                ))}
              </ul>
              {/* Price Table */}
              {tiers && tiers.length > 0 && (
                <PriceTable tiers={tiers} />
              )}

              <div className="bg-gray-50 rounded-lg p-4 mt-auto">
                <h3 className="font-semibold text-pharaoh-700 mb-2">{t('package.cancellationPolicyTitle')}</h3>
                <p className="text-sm text-gray-500">{t('package.cancellationPolicy')}</p>
              </div>
            </div>
          </div>
          {/* نموذج الحجز */}
          <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col justify-center">
            <div className="mb-4 text-center">
              <span className="inline-block bg-pharaoh-100 text-pharaoh-800 font-bold text-xl rounded-lg px-6 py-2 shadow">{t('price.startFrom')} {formatUSD(exp.price)}</span>
            </div>
            {success ? (
              <div className="text-center text-green-600 font-semibold text-lg py-10">
                {t('package.success')}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                          {result.error || t('experience.errorSubmitting')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block mb-1 font-medium text-pharaoh-700" htmlFor="name">
                    <User className="inline w-4 h-4 mr-1" />{t('package.fullName')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="input border-2 border-pharaoh-200 shadow-sm bg-white text-base px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pharaoh-400 focus:border-pharaoh-600 transition-all"
                    placeholder={t('package.fullNamePlaceholder')}
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-pharaoh-700" htmlFor="email">
                    <Mail className="inline w-4 h-4 mr-1" />{t('package.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="input border-2 border-pharaoh-200 shadow-sm bg-white text-base px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pharaoh-400 focus:border-pharaoh-600 transition-all"
                    placeholder={t('package.emailPlaceholder')}
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-pharaoh-700" htmlFor="phone">
                    <Phone className="inline w-4 h-4 mr-1" />{t('package.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="input border-2 border-pharaoh-200 shadow-sm bg-white text-base px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pharaoh-400 focus:border-pharaoh-600 transition-all"
                    placeholder={t('package.phonePlaceholder')}
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-pharaoh-700" htmlFor="date">
                    <Calendar className="inline w-4 h-4 mr-1" />{t('package.date')}
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className="input border-2 border-pharaoh-200 shadow-sm bg-white text-base px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pharaoh-400 focus:border-pharaoh-600 transition-all"
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-pharaoh-700" htmlFor="people">
                    <Users className="inline w-4 h-4 mr-1" />{t('package.people')}
                  </label>
                  <input
                    type="number"
                    id="people"
                    name="people"
                    className="input border-2 border-pharaoh-200 shadow-sm bg-white text-base px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pharaoh-400 focus:border-pharaoh-600 transition-all"
                    min={1}
                    value={form.people}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full mt-4" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('package.submitting') || 'Submitting...' : t('package.submit')}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperiencesDetails;
