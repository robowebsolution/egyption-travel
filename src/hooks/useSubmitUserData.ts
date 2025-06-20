import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type UserData = {
  name: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  source_page: string; // 'package' or 'experience'
  source_id: string;
  source_name: string;
  people: number;
  date: string;
  price?: number; // سعر الباقة أو التجربة
};

type SubmitResult = {
  success: boolean;
  error?: string;
  data?: any;
};

export const useSubmitUserData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  // التحقق من وجود طلب مكرر
  const checkDuplicateRequest = async (userData: UserData): Promise<{isDuplicate: boolean; existingData?: any}> => {
    const { data, error } = await supabase
      .from('users')
      .select('id, created_at, status')
      .eq('email', userData.email)
      .eq('source_page', userData.source_page)
      .eq('source_id', userData.source_id)
      .eq('date', userData.date)
      .limit(1);
    
    if (error) {
      console.error('Error checking for duplicate request:', error);
      return { isDuplicate: false };
    }
    
    return { 
      isDuplicate: data && data.length > 0,
      existingData: data && data.length > 0 ? data[0] : undefined
    };
  };

  const submitData = async (userData: UserData): Promise<SubmitResult> => {
    setIsLoading(true);
    setResult(null);
    
    try {
      // التحقق من وجود طلب مكرر أولاً
      const { isDuplicate, existingData } = await checkDuplicateRequest(userData);
      if (isDuplicate) {
        // تحسين رسالة الخطأ لتوفير معلومات أكثر تفصيلاً للمستخدم
        const formattedDate = new Date(existingData?.created_at).toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        const statusText = existingData?.status === 'pending' ? 'قيد المراجعة' : 
                          existingData?.status === 'approved' ? 'تمت الموافقة عليه' : 
                          existingData?.status === 'rejected' ? 'تم رفضه' : 'غير معروف';
        
        throw new Error(`لقد قمت بالفعل بإرسال طلب بنفس البريد الإلكتروني لهذه ${userData.source_page === 'package' ? 'الباقة' : 'التجربة'} في نفس التاريخ (${userData.date}).
تم إرسال الطلب السابق في ${formattedDate} وحالته الحالية: ${statusText}.
يرجى اختيار تاريخ آخر أو استخدام بريد إلكتروني مختلف.`);
      }
      
      // 1. إرسال البيانات إلى Supabase
      const { data, error } = await supabase
        .from('users')
        .insert({
          ...userData,
          status: 'pending'
        })
        .select();

      if (error) {
        // معالجة خطأ التكرار بشكل خاص
        if (error.code === '23505' || error.message.includes('duplicate key value')) {
          // في حالة حدوث خطأ تكرار غير متوقع (لم يتم اكتشافه بواسطة checkDuplicateRequest)
          // نقوم بإجراء فحص إضافي للحصول على معلومات أكثر تفصيلاً
          const { isDuplicate, existingData } = await checkDuplicateRequest(userData);
          if (isDuplicate && existingData) {
            const formattedDate = new Date(existingData.created_at).toLocaleDateString('ar-EG', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
            
            const statusText = existingData.status === 'pending' ? 'قيد المراجعة' : 
                              existingData.status === 'approved' ? 'تمت الموافقة عليه' : 
                              existingData.status === 'rejected' ? 'تم رفضه' : 'غير معروف';
            
            throw new Error(`لقد قمت بالفعل بإرسال طلب بنفس البريد الإلكتروني لهذه ${userData.source_page === 'package' ? 'الباقة' : 'التجربة'} في نفس التاريخ (${userData.date}).
تم إرسال الطلب السابق في ${formattedDate} وحالته الحالية: ${statusText}.
يرجى اختيار تاريخ آخر أو استخدام بريد إلكتروني مختلف.`);
          } else {
            throw new Error('لقد قمت بالفعل بإرسال طلب بنفس البريد الإلكتروني لهذه الباقة/التجربة في نفس التاريخ. يرجى اختيار تاريخ آخر أو استخدام بريد إلكتروني مختلف.');
          }
        }
        throw new Error(`خطأ في قاعدة البيانات: ${error.message}`);
      }

      // 2. إرسال البيانات إلى Make.com webhook
      // استبدل الرابط أدناه برابط webhook الخاص بك من Make.com
      const webhookUrl = 'https://hook.us2.make.com/64n7pxfo5nhfvt58k8dh2a9iiv7kjumw';
      
      const makeResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          id: data?.[0]?.id || null,
          created_at: new Date().toISOString(),
        }),
      });

      if (!makeResponse.ok) {
        console.error('Make.com webhook error:', makeResponse.statusText);
        throw new Error(`حدث خطأ أثناء إرسال البيانات إلى نظام المتابعة. الرجاء المحاولة مرة أخرى لاحقًا أو التواصل مع الدعم الفني. (${makeResponse.status}: ${makeResponse.statusText})`);
      }

      const result = {
        success: true,
        data: data?.[0] || null,
      };
      
      setResult(result);
      return result;
    } catch (error) {
      console.error('Error submitting user data:', error);
      
      // تحسين رسائل الخطأ العامة
      let errorMessage = '';
      
      if (error instanceof Error) {
        // إذا كانت رسالة الخطأ تحتوي على نص عربي، نستخدمها كما هي
        if (/[\u0600-\u06FF]/.test(error.message)) {
          errorMessage = error.message;
        } else {
          // ترجمة رسائل الخطأ الشائعة
          if (error.message.includes('network') || error.message.includes('connection')) {
            errorMessage = 'حدث خطأ في الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.';
          } else if (error.message.includes('timeout')) {
            errorMessage = 'انتهت مهلة الاتصال بالخادم. يرجى المحاولة مرة أخرى لاحقًا.';
          } else if (error.message.includes('permission') || error.message.includes('access')) {
            errorMessage = 'ليس لديك صلاحية للقيام بهذه العملية. يرجى تسجيل الدخول أو التواصل مع الدعم الفني.';
          } else {
            errorMessage = `حدث خطأ أثناء إرسال البيانات: ${error.message}`;
          }
        }
      } else {
        errorMessage = 'حدث خطأ غير معروف أثناء إرسال البيانات. يرجى المحاولة مرة أخرى لاحقًا.';
      }
      
      const errorResult = {
        success: false,
        error: errorMessage,
      };
      
      setResult(errorResult);
      return errorResult;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitData,
    isLoading,
    result,
  };
};