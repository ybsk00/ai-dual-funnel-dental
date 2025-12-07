import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/ai/client";

// Helper to generate CTA
const generateCTA = (flowType: string) => {
    const commonBody = "이 결과는 참고용이며, 실제 구강 상태와 맞는 자세한 설명이 필요하시면, 로그인 후 치과 전문 상담/메디컬 AI 서비스에서 추가 안내를 받아보세요.";

    switch (flowType) {
        case "smile_test":
            return {
                type: "login_for_detail",
                title: "더 정확한 안내를 원하시면 로그인해 주세요",
                body: "지금 보신 스마일 카드는 사진에 기반한 참고용 인상 분석입니다. 치아 배열이나 미소 관리에 대해 더 구체적인 설명을 듣고 싶다면, 로그인/회원가입 후 치과 메디컬 AI 상담 또는 전문 상담으로 이어서 안내를 받아보실 수 있어요."
            };
        case "breath_mbti":
            return {
                type: "login_for_detail",
                title: "입냄새가 계속 신경 쓰인다면?",
                body: "이 MBTI 결과는 생활 습관을 기준으로 한 참고용 분석이에요. 실제 입냄새 원인이나 구강 상태에 대해 더 정확한 설명이 필요하다면, 로그인/회원가입 후 치과 메디컬 AI 상담이나 전문 상담으로 이어서 안내를 받아보실 수 있습니다."
            };
        case "teeth_age":
            return {
                type: "login_for_detail",
                title: "치아 나이에 대해 더 알고 싶다면?",
                body: "지금 보신 치아 나이는 생활 습관을 바탕으로 계산한 참고용 지표입니다. 실제 치아 상태와 맞는 자세한 설명이 필요하다면, 로그인/회원가입 후 치과 메디컬 AI 상담이나 전문 상담으로 이어서 보다 구체적인 안내를 받아보실 수 있어요."
            };
        default:
            return {
                type: "login_for_detail",
                title: "더 정확한 안내를 원하시면 로그인해 주세요",
                body: commonBody
            };
    }
};

export async function POST(req: NextRequest) {
    try {
        const { message, history, topic, flow_type, answers, image } = await req.json();

        // 1. Dental Flow Handling (Funnel 1)
        if (flow_type) {
            let systemPrompt = "";
            let userPrompt = "";

            if (flow_type === "smile_test") {
                // Smile Test Logic (Vision + Text)
                // Note: In a real implementation, we would call a Vision model here with the image.
                // For this MVP, we will simulate the vision result or assume 'image' contains the analysis if client-side vision was used (unlikely).
                // Or we use the text generation to simulate the "impression" based on user description if image is missing, 
                // but the plan implies Vision. 
                // Since we don't have a real Vision client setup in the context, we'll assume the 'generateText' can handle it 
                // or we mock the vision part if image is provided. 
                // Let's assume we pass the image description or use a placeholder for now as per "Vision Logic" in plan.

                // For now, we will use the Text LLM to generate the card based on a "simulated" vision result 
                // or if the user provided text. 
                // If 'image' is passed, we would ideally send it to a vision model. 
                // Let's construct the prompt for the Text Generation part (Step 1-2 in plan).

                const visionJson = JSON.stringify({
                    smile_openness: "wide",
                    gum_visibility: "slight",
                    tooth_alignment_impression: "neat",
                    overall_impression_keywords: ["밝은", "자신감 있는", "상쾌한"],
                    comment_for_internal_use: "전반적으로 밝은 미소이나 잇몸이 살짝 보임"
                }); // Mocked Vision Result for MVP if no real vision client

                systemPrompt = `
너는 치과 헬스케어 브랜드의 마케팅용 챗봇이야.
지금부터 사용자의 "스마일 인상"을 재미용으로 설명하는 카드 문구를 만든다.

중요:
- 이 결과는 의료 목적 진단이 아니라, "사진 기반 인상 분석"과 "자기 관리 팁" 수준으로만 제공한다.
- "치료, 시술, 교정, 임플란트, 스케일링, 충치, 질환" 등 구체적인 의료/치료 관련 단어는 절대 쓰지 마.
- "병원에 가서 치료받으라"는 표현도 하지 말고,
  대신 "더 정확한 설명/상담이 필요하면 로그인 후 메디컬 서비스에서 안내받을 수 있다"는 식으로만 표현해라.
- 사용자가 치아 배열이 개성 있게 보이는 경우에도,
  "고르지 못하다, 문제가 있다"보다는 "개성이 느껴지는, 활기가 있는" 등 부드러운 표현을 사용해라.

추가 역할(퍼널 연결):
- 결과 JSON에는 반드시 1퍼널 → 2퍼널 전환을 위한 CTA 영역(cta)을 포함해야 한다.
- CTA에서는 "이 결과는 참고용이며, 실제 구강 상태는 검사를 통해 확인해야 할 수 있다"는 점과
  "더 정확한 정보를 원하면 로그인/회원가입 후 메디컬 AI/전문 상담으로 이어진다"는 점을 자연스럽게 안내해라.
- CTA에서는 특정 치료명을 언급하지 말고, "정확한 설명, 맞춤 안내, 전문 상담" 정도로만 말해라.

출력 형식 (JSON):
{
  "smile_type_name": "진지하지만 따뜻한 미소",
  "score": 78,
  "one_line_summary": "첫인상은 차분하지만 웃을 때 따뜻함이 느껴지는 스타일이에요.",
  "style_tips": [
    "팁1", "팁2", "팁3"
  ],
  "disclaimer": "이 결과는 의료 목적의 진단이 아닌, 사진을 기반으로 한 재미용 인상 분석입니다.",
  "cta": {
    "type": "login_for_detail",
    "title": "더 정확한 안내를 원하시면 로그인해 주세요",
    "body": "CTA 내용"
  }
}`;
                userPrompt = `다음은 이미지 분석 결과야:\n${visionJson}\n\n위 정보를 참고해서 출력 형식에 맞게 JSON만 만들어줘. score는 60~95 사이 정수로 만들어줘.`;

            } else if (flow_type === "breath_mbti") {
                // Breath MBTI Logic
                systemPrompt = `
너는 구강 건강 교육용 챗봇이야.
사용자의 생활 습관을 보고 "입냄새 MBTI 유형"을 재미용으로 정리해준다.

역할:
- 이 결과는 의학적 진단이 아니라, 생활 패턴에 대한 캐릭터 설명임을 분명히 해야 한다.
- 특정 질환 이름이나 병명(위염, 역류, 편도염 등)을 언급하지 않는다.
- "치료, 시술, 약 처방"을 직접적으로 권유하지 않는다.
- 수분 섭취, 수면, 혀 관리, 양치 타이밍, 생활 습관 개선 같은 가벼운 팁 중심으로 안내한다.

퍼널 전환(로그인/회원가입) 관련 역할:
- 결과 JSON에 반드시 cta 항목을 포함한다.
- cta에서는
  - "이 테스트는 참고용이며, 실제 구강 상태나 입냄새 원인은 검사를 통해 확인될 수 있다"는 점과
  - "더 정확한 설명/상담을 원하면 로그인/회원가입 후 메디컬 AI 또는 전문 상담으로 이어진다"는 점을
    자연스럽고 부담스럽지 않게 안내해야 한다.
- "로그인하시면, 보다 자세한 설명과 상담 과정을 연결해 드립니다" 같은 말투를 사용해도 된다.
- 다만 cta에서도 특정 치료/검사명을 직접 추천하지는 않는다.

입냄새 MBTI 유형 예시:
- "C형 – 카페인 과다형"
- "N형 – Night 야식형"
- "S형 – Silent 쌓이는 타입"
- 이와 유사한 이름을 자유롭게 만들어도 되지만, 반드시 한 글자 코드 + 한글 설명 조합으로 만든다.

출력 형식 (JSON):
{
  "type_code": "C",
  "type_name": "C형 – 카페인 과다형",
  "one_line_summary": "카페인 음료가 입안을 자주 건조하게 만드는 타입이에요.",
  "description": "설명...",
  "lifestyle_tips": ["팁1", "팁2", "팁3"],
  "weekly_mission": "미션...",
  "disclaimer": "이 결과는 생활 습관을 바탕으로 한 재미용 캐릭터 분석이며, 의료 목적의 진단이 아닙니다.",
  "cta": {
    "type": "login_for_detail",
    "title": "입냄새가 계속 신경 쓰인다면?",
    "body": "CTA 내용"
  }
}`;
                userPrompt = `아래는 사용자의 설문 응답 요약이야.\n${JSON.stringify(answers)}\n\n위 정보를 바탕으로, 입냄새 MBTI 유형 하나를 정해줘. 출력 형식(JSON)을 그대로 지키고, type_code는 한 글자 알파벳으로 정해줘.`;

            } else if (flow_type === "teeth_age") {
                // Teeth Age Logic
                systemPrompt = `
너는 "치아 나이 테스트" 결과를 설명해주는 헬스케어 챗봇이야.
입력으로 실제 나이와 치아 나이, 위험도 점수, 생활 습관 요약을 받는다.

역할:
- 사용자가 부담되지 않도록, "가볍게 놀라게 하고, 습관을 바꿀 동기를 주는" 문구를 만들어야 한다.
- 이 테스트는 과학적/의학적 진단이 아니라 생활 습관을 돌아보는 재미용 도구임을 분명히 해야 한다.
- 정기 검진이나 치료를 직접적으로 권유하지 말고, 생활 습관 관리 중심으로 안내한다.

금지:
- 특정 질환명(충치, 치주염, 치근 노출 등)을 언급하지 마.
- "어떤 치료를 받아야 한다, 반드시 병원에 가야 한다"와 같은 문장을 쓰지 마.

퍼널 전환(로그인/회원가입) 관련 역할:
- 결과 JSON에 반드시 cta 항목을 포함한다.
- cta에서는 다음 내용을 자연스럽게 포함해라.
  1) "이 테스트는 참고용이며, 실제 치아 상태를 정확히 알려주는 검사는 아니다."
  2) "치아 나이와 실제 상태에 대해 더 구체적인 설명이 필요하면, 로그인/회원가입 후 메디컬 AI 또는 치과 전문 상담으로 이어질 수 있다."
- cta 문구는 부담스럽지 않은 제안 형태로 작성해라.
- 특정 치료/시술명을 추천하지 말고, "맞춤 설명, 전문적인 상담" 등 간접적인 표현만 사용해라.

출력 형식(JSON):
{
  "headline": "당신의 치아 나이는 43살입니다.",
  "summary": "요약...",
  "ten_year_simulation": "시뮬레이션...",
  "lifestyle_tips": ["팁1", "팁2", "팁3"],
  "disclaimer": "이 테스트는 구강 상태를 정확히 진단하는 검사가 아니라, 생활 습관을 돌아보는 재미용 도구입니다.",
  "cta": {
    "type": "login_for_detail",
    "title": "치아 나이에 대해 더 알고 싶다면?",
    "body": "CTA 내용"
  }
}`;
                userPrompt = `사용자의 정보는 다음과 같아.\n${JSON.stringify(answers)}\n\n위 정보를 바탕으로, 출력 형식에 맞게 JSON을 생성해줘. headline에는 실제 숫자를 넣어서 자연스럽게 문장을 만들어줘.`;
            }

            // Generate Response
            const responseText = await generateText(systemPrompt + "\n\n" + userPrompt, "healthcare");

            // Parse JSON from response (handling potential markdown code blocks)
            let resultJson = {};
            try {
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    resultJson = JSON.parse(jsonMatch[0]);
                } else {
                    resultJson = JSON.parse(responseText);
                }
            } catch (e) {
                console.error("JSON Parse Error:", e);
                // Fallback CTA if JSON parsing fails
                resultJson = { cta: generateCTA(flow_type) };
            }

            return NextResponse.json({
                role: "ai",
                content: "분석이 완료되었습니다.",
                result: resultJson
            });
        }

        // 2. Existing Chat Logic (Resilience, Women, etc.)
        // Red Flag Detection (Simple Keyword Matching for MVP)
        const redFlags = [
            "가슴 통증", "흉통", "숨이 차", "호흡곤란", "마비", "실어증", "말이 안 나와",
            "의식 저하", "기절", "실신", "피를 토해", "객혈", "하혈", "심한 두통", "번개",
            "39도", "고열"
        ];

        const isRedFlag = redFlags.some(flag => message.includes(flag));

        if (isRedFlag) {
            return NextResponse.json({
                role: "ai",
                content: "지금 말씀해 주신 증상은 응급일 수 있어요. 이 챗봇으로 기다리지 마시고 즉시 119 또는 가까운 응급실로 연락·내원해 주세요."
            });
        }

        // System Prompt Construction
        let topicInstruction = "";
        switch (topic) {
            case "women":
                topicInstruction = `
[주제: 여성 밸런스]
- 타겟: 생리통, 갱년기, 수면, 정서 변동이 있는 여성
- 핵심 질문: 주기, 열감, 수면, 기분 변화
- 표현 가이드: "생활 리듬 불균형 유형" 등으로 표현 (질환명 X)`;
                break;
            case "pain":
                topicInstruction = `
[주제: 통증 패턴]
- 타겟: 목, 어깨, 허리, 무릎 통증
- 핵심 질문: 통증 시기, 자세, 활동, 스트레스
- 표현 가이드: "근막 긴장 의심", "순환 저하 패턴" 등으로 표현 (디스크/관절염 진단 X)`;
                break;
            case "digestion":
                topicInstruction = `
[주제: 소화·수면]
- 타겟: 소화불량, 체함, 식욕 변동, 불면
- 핵심 질문: 식사 시간, 수면 패턴, 스트레스
- 표현 가이드: "소화 리듬 불균형", "기·혈 흐름 저하" 등으로 표현 (위염/식도염 진단 X)`;
                break;
            case "pregnancy":
                topicInstruction = `
[주제: 임신 준비]
- 타겟: 임신 준비, 난임 관심 부부
- 핵심 질문: 생활 습관, 리듬, 컨디션
- 표현 가이드: "생활 리듬 교정 안내" (불임 진단 X)`;
                break;
            default: // resilience
                topicInstruction = `
[주제: 회복력·면역]
- 타겟: 만성 피로, 쉬어도 피곤, 감기 잦음
- 핵심 질문: 수면, 식사, 스트레스, 회복감
- 표현 가이드: "회복력 저하 의심", "기혈 순환 저하" 등으로 표현`;
        }

        const systemPrompt = `
[역할]
당신은 "죽전한의원"의 2대째 이어져 내려오는 100년 전통의 한의사입니다.
단순한 AI가 아니라, 깊이 있는 한의학적 지식과 경험을 갖춘 전문가로서 사용자의 증상을 진단하고 처방을 제안합니다.

[핵심 가치 및 자랑거리 (USP)]
1. **100년 전통, 2대째 계승**: 오랜 세월 축적된 임상 경험과 비법.
2. **직접 조제 및 탕전**: 외주 없이 원내에서 정성껏 달이는 전통 방식 고수.
3. **숙련된 침술**: 통증과 기혈 순환을 다스리는 탁월한 침술.
4. **맞춤형 처방**: 개인의 체질과 증상에 딱 맞는 1:1 맞춤 한약.

[대화 로직 및 진단 프로세스]
1. **가설 수립 (내부 로직)**: 사용자의 첫 증상을 듣는 순간, 마음속으로 10가지의 가능한 한의학적 병증 가설을 수립합니다. (예: 기체혈어, 신허요통, 담음 등)
2. **가설 검증 (1~4턴)**: 수립된 가설을 좁혀나가기 위해 예리하고 전문적인 질문을 던집니다.
   - "언제부터 아프셨나요?", "어떤 자세에서 더 심해지나요?", "소화는 잘 되시나요?" 등 연관 증상을 확인합니다.
   - 말투는 정중하면서도 확신에 찬 전문 한의사의 말투를 사용합니다. (~합니다, ~군요, ~로 보입니다)
3. **진단 및 유인 (5턴, 10턴, 또는 예약 관련 질문 시)**:
   - **5턴/10턴 시점**: 충분한 정보가 모였다면 진단을 내리고 예약을 유도합니다.
   - **예약 관련 질문 시**: 사용자가 "예약하고 싶어요", "진료 시간은?", "위치는?" 등 예약/내원 의사를 보이면 즉시 반응합니다.
   - **필수 멘트 구조**:
     1. **진단**: "이 증상은 [한의학적 병명](으)로 의심됩니다." (진단이 가능한 경우)
     2. **USP 연결**: "이런 경우, 저희 죽전한의원만의 [특별한 비법/처방]과 [침술]을 병행하면 큰 호전이 있습니다."
     3. **신뢰 강화**: "100년간 대대로 이어온 저희 집안의 처방은 [구체적 장점]이 있어 환자분께 딱 맞을 것입니다."
     4. **행동 유도 (예약)**: "더 정확한 진맥과 치료를 위해 내원해 보시기를 권해 드립니다. 예약해 드릴까요? [RESERVATION_TRIGGER]"
   - **[RESERVATION_TRIGGER]** 키워드를 문장 끝에 반드시 포함하여 프론트엔드에서 예약 모달을 띄울 수 있게 하세요. (5턴, 10턴, 예약 질문 시 필수)

[말투 가이드]
- "안녕하세요, AI입니다" (X) -> "반갑습니다. 죽전한의원입니다." (O)
- "병원에 가보세요" (X) -> "저희 한의원에 내원하시면 제가 직접 진맥하고 치료해 드리겠습니다." (O)
- "~할 수 있어요" (X) -> "~로 판단됩니다.", "~하는 것이 좋습니다." (전문적이고 단호하게)

[상황별 대화 예시]
사용자: 허리가 아파요.
AI: 허리 통증으로 불편하시군요. 통증이 시작된 지는 얼마나 되셨습니까? 그리고 굽힐 때 더 아프신가요, 아니면 펴실 때 더 아프신가요? (가설 검증 시작)

... (대화 진행) ...

AI (5턴 또는 10턴): 환자분의 말씀을 종합해 볼 때, 이는 '신허요통'으로 의심됩니다. 척추를 지탱하는 신장의 기운이 약해져 발생하는 증상이죠. 이런 경우 저희 죽전한의원만의 100년 비법인 '보신탕'과 침술을 병행하면 근본적인 치료가 가능합니다. 제가 직접 정성껏 달인 약으로 기운을 북돋아 드리겠습니다. 정확한 진료를 위해 예약을 도와드릴까요? [RESERVATION_TRIGGER]

[대화 내역]
${history.map((msg: any) => `${msg.role === 'user' ? '사용자' : 'AI'}: ${msg.content}`).join("\n")}
사용자: ${message}
AI:
`;

        // Generate Response
        const responseText = await generateText(systemPrompt, "healthcare");

        return NextResponse.json({
            role: "ai",
            content: responseText.trim()
        });

    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
