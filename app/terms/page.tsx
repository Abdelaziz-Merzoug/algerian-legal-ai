'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function TermsPage() {
    const { t, language } = useTranslation();

    const sections = language === 'ar' ? [
        { title: 'قبول الشروط', content: 'باستخدام منصة المستشار القانوني الجزائري، فإنك توافق على هذه الشروط والأحكام. إذا لم تو��فق، يرجى عدم استخدام المنصة.' },
        { title: 'طبيعة الخدمة', content: 'تقدم المنصة استشارات قانونية إرشادية مبنية على النصوص القانونية الجزائرية باستخدام الذكاء الاصطناعي. الإجابات المقدمة ليست بديلاً عن الاستشارة القانونية المتخصصة.' },
        { title: 'حسابات المستخدمين', content: 'أنت مسؤول عن الحفاظ على سرية معلومات حسابك وعن جميع الأنشطة التي تتم تحت حسابك. يجب أن تكون المعلومات المقدمة صحيحة ودقيقة.' },
        { title: 'الاستخدام المقبول', content: 'يجب استخدام المنصة لأغراض قانونية فقط. يُحظر: إساءة استخدام الخدمة، محاولة اختراق النظام، نشر محتوى ضار، أو استخدام المنصة لأغراض غير قانونية.' },
        { title: 'إخلاء المسؤولية', content: 'لا تضمن المنصة دقة أو اكتمال المعلومات المقدمة. نحن غير مسؤولين عن أي قرارات تتخذها بناءً على المعلومات المقدمة من المنصة.' },
        { title: 'الملكية الفكرية', content: 'جميع حقوق الملكية الفكرية للمنصة وتصميمها وكودها ومحتواها تعود لنا. النصوص القانونية المقدمة هي ملكية عامة للجمهورية الجزائرية.' },
        { title: 'تعليق الخدمة', content: 'نحتفظ بالحق في تعليق أو إنهاء وصولك إلى المنصة في أي وقت ولأي سبب، بما في ذلك انتهاك هذه الشروط.' },
        { title: 'القانون المطبق', content: 'تخضع هذه الشروط للقانون الجزائري. أي نزاعات تنشأ فيما يتعلق باستخدام المنصة تخضع لاختصاص المحاكم الجزائرية.' },
        { title: 'تعديل الشروط', content: 'نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطارك بأي تغييرات جوهرية. استمرارك في استخدام المنصة بعد التعديل يعني قبولك للشروط الجديدة.' },
    ] : [
        { title: 'Acceptance of Terms', content: 'By using the Algerian Legal AI platform, you agree to these terms and conditions. If you do not agree, please do not use the platform.' },
        { title: 'Nature of Service', content: 'The platform provides advisory legal consultations based on Algerian legal texts using artificial intelligence. Answers provided are not a substitute for professional legal advice.' },
        { title: 'User Accounts', content: 'You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. Information provided must be accurate.' },
        { title: 'Acceptable Use', content: 'The platform must be used for legal purposes only. Prohibited: misusing the service, attempting to hack the system, posting harmful content, or using the platform for illegal purposes.' },
        { title: 'Disclaimer', content: 'The platform does not guarantee the accuracy or completeness of information provided. We are not responsible for any decisions you make based on platform information.' },
        { title: 'Intellectual Property', content: 'All intellectual property rights for the platform, its design, code, and content belong to us. Legal texts provided are public property of the Algerian Republic.' },
        { title: 'Service Suspension', content: 'We reserve the right to suspend or terminate your access to the platform at any time and for any reason, including violation of these terms.' },
        { title: 'Applicable Law', content: 'These terms are governed by Algerian law. Any disputes arising from use of the platform are subject to the jurisdiction of Algerian courts.' },
        { title: 'Changes to Terms', content: 'We reserve the right to modify these terms at any time. You will be notified of material changes. Continued use after modification signifies acceptance of new terms.' },
    ];

    return (
        <div className="min-h-screen bg-bg-primary">
            <Navbar />
            <main className="pt-24 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <div className="text-5xl mb-4">📜</div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gradient-gold mb-3">{t.terms.title}</h1>
                    <p className="text-xs text-text-light">{t.terms.lastUpdated}: 2026-03-01</p>
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
