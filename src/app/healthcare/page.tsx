import { Suspense } from "react";
import HealthcareMenu from "@/components/healthcare/HealthcareMenu";

export default function HealthcarePage() {
    return (
        <div className="min-h-screen bg-traditional-bg p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2 font-serif">AI 헬스케어 라운지</h1>
                    <p className="text-slate-600">재미있는 AI 테스트로 나의 구강 건강을 체크해보세요!</p>
                </header>

                <Suspense fallback={<div>로딩중...</div>}>
                    <HealthcareMenu />
                </Suspense>
            </div>
        </div>
    );
}
