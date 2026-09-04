import { createSignal, createMemo, createContext, useContext, type JSX, type ParentComponent } from "solid-js"

export interface Gem {
  id: string
  name: string
  icon: string
  badge?: string
  description: string
  prompt: string
  accentColor: string
}

export const BUILTIN_GEMS: Gem[] = [
  {
    id: "default",
    name: "WaffleCode 기본",
    icon: "🧇",
    description: "균형 잡힌 풀스택 AI 코딩 에이전트",
    prompt: "당신은 WaffleCode AI입니다. 신속하고 정확하게 사용자의 요구사항을 코드로 구현합니다.",
    accentColor: "#f59e0b",
  },
  {
    id: "opal",
    name: "Gemini Opal (오팔)",
    icon: "🔮",
    badge: "Google DeepMind",
    description: "멀티모달 시각 분석, GUI 자동화 및 자율 워크플로우에 특화된 차세대 에이전트",
    prompt:
      "당신은 Google DeepMind 기술 기반의 Gemini Opal 멀티모달 자율 에이전트입니다. 코드뿐만 아니라 UI 레이아웃, 시각적 요소, 컴퓨터 원격 제어 및 사용자 인터랙션을 깊이 분석하여 최적의 인터페이스와 동작을 완성합니다.",
    accentColor: "#8b5cf6",
  },
  {
    id: "vibe",
    name: "바이브 코더 (Vibe Coder)",
    icon: "⚡",
    badge: "Fast UI",
    description: "생각나는 아이디어를 실시간 프리뷰와 함께 즉시 코드로 뽑아내는 초고속 모드",
    prompt:
      "당신은 바이브 코딩(Vibe Coding) 마스터입니다. 군더더기 없는 빠른 속도로 프로토타입을 구축하고, 실시간 프리뷰(Live Preview)에서 바로 동작 가능한 완성도 높은 UI/UX를 신속하게 구현합니다.",
    accentColor: "#ec4899",
  },
  {
    id: "hunter",
    name: "버그 헌터 (Bug Hunter)",
    icon: "🔍",
    badge: "Debug",
    description: "런타임 에러, 메모리 누수, 빌드 실패 및 숨은 버그를 집요하게 추적하고 해결",
    prompt:
      "당신은 시니어 디버깅 스페셜리스트 버그 헌터입니다. 로그, 스택 트레이스, 엣지 케이스를 철저히 검증하고 근본적인 원인을 파악하여 견고한 버그 픽스를 제공합니다.",
    accentColor: "#ef4444",
  },
  {
    id: "architect",
    name: "풀스택 아키텍트 (Architect)",
    icon: "🏛️",
    badge: "Design",
    description: "대규모 시스템 설계, DB 스키마, 마이크로서비스 및 클라우드 인프라 최적화",
    prompt:
      "당신은 수석 소프트웨어 아키텍트입니다. 확장성 높은 아키텍처 패턴, 클린 코드, 견고한 데이터 모델링 및 보안 베스트 프랙티스를 바탕으로 프로젝트를 설계합니다.",
    accentColor: "#3b82f6",
  },
]

interface GemsContextType {
  gems: Gem[]
  activeGemId: () => string
  activeGem: () => Gem
  setGem: (id: string) => void
}

const GemsContext = createContext<GemsContextType>()

export const GemsProvider: ParentComponent = (props) => {
  const [activeGemId, setActiveGemId] = createSignal<string>("opal") // default to Opal

  const activeGem = createMemo(() => {
    return BUILTIN_GEMS.find((g) => g.id === activeGemId()) || BUILTIN_GEMS[0]
  })

  const setGem = (id: string) => {
    if (BUILTIN_GEMS.some((g) => g.id === id)) {
      setActiveGemId(id)
    }
  }

  return (
    <GemsContext.Provider
      value={{
        gems: BUILTIN_GEMS,
        activeGemId,
        activeGem,
        setGem,
      }}
    >
      {props.children}
    </GemsContext.Provider>
  )
}

export function useGems() {
  const context = useContext(GemsContext)
  if (!context) {
    // Fallback if rendered outside provider
    const [id, setId] = createSignal("opal")
    return {
      gems: BUILTIN_GEMS,
      activeGemId: id,
      activeGem: () => BUILTIN_GEMS.find((g) => g.id === id()) || BUILTIN_GEMS[0],
      setGem: setId,
    }
  }
  return context
}
