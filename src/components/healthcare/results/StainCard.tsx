"use client";

import Link from "next/link";

type StainCardProps = {
    result: {
        risk_level: string; // 'Low', 'Moderate', 'High'
        risk_score: number;
        summary: string;
        prevention_tips: string[];
        disclaimer: string;
        cta: {
            title: string;
            body: string;
        };
    };
    isLoggedIn: boolean;
};

export default function StainCard({ result, isLoggedIn }: StainCardProps) {
    const getRiskColor = (level: string) => {
        switch (level.toLowerCase()) {
            case 'high': return 'text-red-500 bg-red-50 border-red-100';
            case 'moderate': return 'text-orange-500 bg-orange-50 border-orange-100';
            default: return 'text-green-500 bg-green-50 border-green-100';
        }
    };

    const riskColorClass = getRiskColor(result.risk_level);

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 max-w-sm mx-auto my-4">
            <div className={`p-6 text-center ${riskColorClass.replace('text-', 'bg-').replace('bg-', 'bg-opacity-10 ')}`}>
                <div className="inline-block px-3 py-1 bg-white/50 backdrop-blur-sm text-slate-600 text-xs font-bold rounded-full mb-2">
                    커피 착색 카드
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">착색 위험도</h3>
                <div className={`text-4xl font-black mb-2 ${riskColorClass.split(' ')[0]}`}>{result.risk_level}</div>
                <p className="text-slate-600 text-sm">{result.summary}</p>
            </div>

            <div className="p-6 space-y-4">
                <div>
                    <h4 className="font-bold text-slate-700 mb-2 text-sm">🛡️ 착색 방지 팁</h4>
                    <ul className="space-y-2">
                        {result.prevention_tips.map((tip, idx) => (
                            <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                                <span className="text-stone-500 mt-0.5">•</span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CTA Section */}
                <div className="border-t border-slate-100 pt-4 mt-4">
                    <h4 className="font-bold text-slate-800 mb-1 text-sm">{result.cta.title}</h4>
                    <p className="text-xs text-slate-500 mb-3 leading-relaxed">{result.cta.body}</p>

                    {isLoggedIn ? (
                        <Link
                            href={`/medical/chat?source=stain_risk&context=${encodeURIComponent(result.risk_level)}`}
                            className="block w-full py-3 bg-blue-600 text-white text-center rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
                        >
                            전문 상담 이어가기
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="block w-full py-3 bg-slate-800 text-white text-center rounded-xl font-bold text-sm hover:bg-slate-900 transition-colors"
                        >
                            로그인하고 자세히 보기
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
