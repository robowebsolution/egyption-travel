import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePackages } from '@/hooks/usePackages';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Users, Mail, User, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSubmitUserData } from '@/hooks/useSubmitUserData';

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: packages = [], isLoading } = usePackages();
  const { t } = useLanguage();
  const { submitData, isLoading: isSubmitting, result } = useSubmitUserData();
  // نموذج الحجز (جميع الهوكس بالأعلى)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    people: 1,
  });
  const [success, setSuccess] = useState(false);

  const pkg = packages.find((p) => String(p.id) === String(id));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-xl font-semibold">{t('package.loading')}</div>
    );
  }

  if (!pkg) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h2 className="text-2xl font-bold mb-4">{t('package.notfound')}</h2>
        <Button onClick={() => navigate(-1)}><ArrowLeft className="mr-2" />{t('package.back')}</Button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pkg) return;
    
    // استخراج السعر من النص (مثال: "500 ج.م" -> 500)
    const priceText = pkg.price;
    const priceMatch = priceText.match(/\d+/);
    const price = priceMatch ? Number(priceMatch[0]) : 0;
    
    const userData = {
      ...form,
      source_page: 'package',
      source_id: pkg.id,
      source_name: pkg.title,
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
          <ArrowLeft className="mr-2" />{t('package.back')}
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* معرض الصور */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-xl overflow-hidden flex flex-col">
            <img src={pkg.image} alt={pkg.title} className="w-full h-80 object-cover rounded-t-xl" />
            <div className="p-8 flex-1 flex flex-col">
              <h1 className="text-3xl font-bold mb-2 text-pharaoh-700">{pkg.title}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-pharaoh-50 text-pharaoh-700"><Calendar className="inline w-4 h-4 ml-1" /> {pkg.duration}</Badge>
                <Badge className="bg-pharaoh-50 text-pharaoh-700"><Users className="inline w-4 h-4 ml-1" /> {pkg.groupSize}</Badge>
                <Badge className="bg-pharaoh-50 text-pharaoh-700">⭐ {pkg.rating}</Badge>
                <Badge className="bg-pharaoh-100 text-pharaoh-800 font-bold">{pkg.price}</Badge>
              </div>
              <p className="text-base text-gray-600 mb-6 leading-relaxed">{pkg.description}</p>
              <h2 className="text-xl font-semibold mb-2 text-pharaoh-600">{t('package.highlights')}</h2>
              <ul className="list-disc pl-5 space-y-1 mb-6 text-gray-700">
                {pkg.highlights && pkg.highlights.map((h, idx) => (
                  <li key={idx}>{h}</li>
                ))}
              </ul>
              <div className="bg-gray-50 rounded-lg p-4 mt-auto">
                <h3 className="font-semibold text-pharaoh-700 mb-2">{t('package.cancellationPolicyTitle')}</h3>
                <p className="text-sm text-gray-500">{t('package.cancellationPolicy')}</p>
              </div>
            </div>
          </div>
          {/* نموذج الحجز */}
          <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-6 text-pharaoh-700 text-center">{t('package.bookNow')}</h2>
            {success ? (
              <div className="text-green-600 text-center font-semibold">
                {t('package.success')}
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
                          {result.error || t('package.errorSubmitting')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm mb-1 font-medium text-pharaoh-700">{t('package.fullName')}</label>
                  <div className="relative">
                    <input type="text" name="name" required value={form.name} onChange={handleChange} className="w-full pl-10 py-2 border-2 border-gray-300 rounded-lg bg-white placeholder-gray-500 text-gray-900 focus:border-pharaoh-500 focus:ring-2 focus:ring-pharaoh-100 shadow-sm transition-all duration-150" placeholder={t('package.fullNamePlaceholder')} />
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-pharaoh-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1 font-medium text-pharaoh-700">{t('package.email')}</label>
                  <div className="relative">
                    <input type="email" name="email" required value={form.email} onChange={handleChange} className="w-full pl-10 py-2 border-2 border-gray-300 rounded-lg bg-white placeholder-gray-500 text-gray-900 focus:border-pharaoh-500 focus:ring-2 focus:ring-pharaoh-100 shadow-sm transition-all duration-150" placeholder={t('package.emailPlaceholder')} />
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-pharaoh-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1 font-medium text-pharaoh-700">{t('package.phone')}</label>
                  <div className="relative">
                    <input type="tel" name="phone" required value={form.phone} onChange={handleChange} className="w-full pl-10 py-2 border-2 border-gray-300 rounded-lg bg-white placeholder-gray-500 text-gray-900 focus:border-pharaoh-500 focus:ring-2 focus:ring-pharaoh-100 shadow-sm transition-all duration-150" placeholder={t('package.phonePlaceholder')} />
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-pharaoh-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1 font-medium text-pharaoh-700">{t('package.date')}</label>
                  <div className="relative">
                    <input type="date" name="date" required value={form.date} onChange={handleChange} className="w-full pl-10 py-2 border-2 border-gray-300 rounded-lg bg-white placeholder-gray-500 text-gray-900 focus:border-pharaoh-500 focus:ring-2 focus:ring-pharaoh-100 shadow-sm transition-all duration-150" placeholder={t('package.datePlaceholder')} />
                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-pharaoh-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1 font-medium text-pharaoh-700">{t('package.people')}</label>
                  <div className="relative">
                    <input type="number" name="people" min={1} max={20} required value={form.people} onChange={handleChange} className="w-full pl-10 py-2 border-2 border-gray-300 rounded-lg bg-white placeholder-gray-500 text-gray-900 focus:border-pharaoh-500 focus:ring-2 focus:ring-pharaoh-100 shadow-sm transition-all duration-150" placeholder={t('package.peoplePlaceholder')} />
                    <Users className="absolute left-3 top-2.5 w-4 h-4 text-pharaoh-400" />
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="bg-pharaoh-600 hover:bg-pharaoh-700 w-full text-lg mt-2" 
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

export default PackageDetails;
