'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function PrivacyPage() {
    const { t, language } = useTranslation();

    const sections = language === 'ar' ? [
        { title: 'جمع المعلومات', content: 'نجمع المعلومات التي تقدمها مباشرة عند إنشاء حساب أو استخدام خدماتنا، بما في ذلك اسم المستخدم والبريد الإلكتروني ومحتوى المحادثات.' },
        { title: 'استخدام المعلومات', content: 'نستخدم معلوماتك لتقديم الخدمة وتحسينها، بما في ذلك الإجابة على أسئلتك القانونية وتخصيص تجربتك وتحليل أنماط الاستخدام لتحسين جودة الخدمة.' },
        { title: 'حماية البيانات', content: 'نستخدم تدابير أمنية تقنية وتنظيمية لحماية بياناتك الشخصية من الوصول غير المصرح به أو الكشف أو التعديل أو الإتلاف.' },
        { title: 'مشاركة البيانات', content: 'لا نبيع أو نشارك بياناتك الشخصية مع أطراف ثالثة لأغراض تسويقية. قد نشارك البيانات فقط مع مقدمي الخدمات الذين يساعدوننا في تشغيل المنصة.' },
        { title: 'ملفات تعريف الارتباط', content: 'نستخدم ملفات تعريف الارتباط وتقنيات مشابهة لتحسين تجربتك وجمع معلومات حول كيفية استخدام المنصة.' },
        { title: 'حقوقك', content: 'يحق لك الوصول إلى بياناتك الشخصية وتصحيحها وحذفها. يمكنك أيضاً طلب نقل بياناتك أو الاعتراض على معالجتها في أي وقت.' },
        { title: 'الاحتفاظ بالبيانات', content: 'نحتفظ ببياناتك طوال فترة نشاط حسابك. بعد حذف الحساب، نحذف بياناتك الشخصية خلال 30 يوماً.' },
        { title: 'التعديلات', content: 'قد نحدث سياسة الخصوصية هذه من وقت لآخر. سنخطرك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار على المنصة.' },
    ] : [
        { title: 'Information Collection', content: 'We collect information you provide directly when creating an account or using our services, including username, email, and conversation content.' },
        { title: 'Use of Information', content: 'We use your information to provide and improve the service, including answering your legal questions, personalizing your experience, and analyzing usage patterns.' },
        { title: 'Data Protection', content: 'We use technical and organizational security measures to protect your personal data from unauthorized access, disclosure, modification, or destruction.' },
        { title: 'Data Sharing', content: 'We do not sell or share your personal data with third parties for marketing purposes. We may share data only with service providers that help us operate the platform.' },
        { title: 'Cookies', content: 'We use cookies and similar technologies to improve your experience and collect information about how the platform is used.' },
        { title: 'Your Rights', content: 'You have the right to access, correct, and delete your personal data. You can also request data portability or object to processing at any time.' },
        { title: 'Data Retention', content: 'We retain your data for the duration of your active account. After account deletion, your personal data will be deleted within 30 days.' },
        { title: 'Changes', content: 'We may update this privacy policy from time to time. We will notify you of any material changes via email or platform notification.' },
    ];

    return (
        <div className="min-h-screen bg-bg-primary">
            <Navbar />
            <main className="pt-24 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <div className="text-5xl mb-4">🔒</div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gradient-gold mb-3">{t.privacy.title}</h1>
                    <p className="text-xs text-text-light">{t.privacy.lastUpdated}: 2026-03-01</p>
                </div>

                <div className="space-y-6">
                    {sections.map((s, i) => (
                        <div key={i}>
                            <h2 className="text-base font-bold text-text-primary mb-2 flex items-center gap-2">
                                <span className="text-teal text-sm">{i + 1}.</span> {s.title}
                            </h2>
                            <p className="text-sm text-text-light leading-relaxed ps-5">{s.content}</p>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
