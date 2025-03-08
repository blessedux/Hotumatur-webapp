import TranslationDebug from '@/components/TranslationDebug';

export default function TranslationTestPage() {
    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center">Translation Test Page</h1>
            <p className="text-center mb-8">
                Use this page to test the translation service. Enter Spanish text below and see it translated to English.
            </p>

            <TranslationDebug />

            <div className="mt-12 p-4 border rounded-lg bg-blue-50">
                <h2 className="text-xl font-bold mb-4">How it works</h2>
                <p className="mb-4">
                    This page uses our new translation service to translate text from Spanish to English.
                    The translation is done using the <code>@vitalets/google-translate-api</code> library.
                </p>
                <p className="mb-4">
                    The translation service is implemented in <code>src/services/translation.service.ts</code> and
                    exposed via an API endpoint at <code>/api/translate</code>.
                </p>
                <p>
                    The same service is used to translate product content in the TourContent component.
                </p>
            </div>
        </div>
    );
} 