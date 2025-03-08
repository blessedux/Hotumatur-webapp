'use client';

import { useState } from 'react';

export default function TranslationDebug() {
    const [text, setText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [translationType, setTranslationType] = useState<'text' | 'html'>('text');
    const [logs, setLogs] = useState<string[]>([]);

    async function handleTranslate() {
        if (!text) return;

        setLoading(true);
        setError(null);
        setLogs([]);

        try {
            addLog('Sending translation request...');
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    [translationType]: text,
                    type: translationType,
                    targetLang: 'en',
                    sourceLang: 'es'
                })
            });

            addLog(`Response status: ${response.status}`);

            if (!response.ok) {
                const errorText = await response.text();
                addLog(`Error response: ${errorText}`);
                throw new Error(`Translation failed: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            addLog('Translation response received');

            if (data.result) {
                setTranslatedText(data.result);
                addLog('Translation successful');
            } else {
                addLog('Translation response did not contain result');
                throw new Error('Translation response did not contain result');
            }
        } catch (err) {
            const errorMessage = (err as Error).message;
            setError(errorMessage);
            addLog(`Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    }

    function addLog(message: string) {
        setLogs(prev => [...prev, `[${new Date().toISOString()}] ${message}`]);
    }

    return (
        <div className="p-4 border rounded-lg bg-gray-50 max-w-lg mx-auto my-8">
            <h2 className="text-xl font-bold mb-4">Translation Debug</h2>

            <div className="mb-4">
                <div className="flex gap-4 mb-2">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="translationType"
                            checked={translationType === 'text'}
                            onChange={() => setTranslationType('text')}
                            className="mr-2"
                        />
                        Text
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="translationType"
                            checked={translationType === 'html'}
                            onChange={() => setTranslationType('html')}
                            className="mr-2"
                        />
                        HTML
                    </label>
                </div>

                <label className="block mb-2">Spanish {translationType === 'html' ? 'HTML' : 'Text'}:</label>
                <textarea
                    className="w-full p-2 border rounded"
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={`Enter Spanish ${translationType === 'html' ? 'HTML' : 'text'} to translate`}
                />
            </div>

            <button
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                onClick={handleTranslate}
                disabled={!text || loading}
            >
                {loading ? 'Translating...' : 'Translate to English'}
            </button>

            {error && (
                <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
                    Error: {error}
                </div>
            )}

            {translatedText && (
                <div className="mt-4">
                    <label className="block mb-2">English Translation:</label>
                    <div className="p-2 border rounded bg-white">
                        {translationType === 'html' ? (
                            <div dangerouslySetInnerHTML={{ __html: translatedText }} />
                        ) : (
                            translatedText
                        )}
                    </div>
                </div>
            )}

            <div className="mt-4">
                <h3 className="font-bold mb-2">Logs:</h3>
                <div className="p-2 border rounded bg-black text-green-400 font-mono text-xs h-40 overflow-y-auto">
                    {logs.map((log, index) => (
                        <div key={index}>{log}</div>
                    ))}
                </div>
            </div>
        </div>
    );
} 