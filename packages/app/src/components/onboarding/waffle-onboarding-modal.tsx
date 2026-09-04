import { createSignal, onMount, onCleanup, Show, For, type Component } from "solid-js"
import { useGems } from "@/context/gems"

export const WaffleOnboardingModal: Component = () => {
  const { gems, setGem } = useGems()

  const [open, setOpen] = createSignal(false)
  const [step, setStep] = createSignal<number>(1)

  // Step 1: Disclaimer Agreement
  const [disclaimerAgreed, setDisclaimerAgreed] = createSignal(false)

  // Step 2: Gemini / Opal Selection & API Key
  const [selectedGemId, setSelectedGemId] = createSignal<string>("opal")
  const [geminiApiKey, setGeminiApiKey] = createSignal<string>("")

  // Step 3: Autonomy & Computer Control
  const [autonomyMode, setAutonomyMode] = createSignal<"full" | "safe">("full")
  const [remoteAccessEnabled, setRemoteAccessEnabled] = createSignal(true)

  // Step 4: Preview & Vibe Environment
  const [livePreviewEnabled, setLivePreviewEnabled] = createSignal(true)
  const [hotReloadEnabled, setHotReloadEnabled] = createSignal(true)

  onMount(() => {
    // Check if initial onboarding has been completed
    const completed = localStorage.getItem("waffle_onboarding_completed")
    if (!completed) {
      setOpen(true)
      setStep(1)
    }

    const handleOpen = () => {
      setStep(1)
      setOpen(true)
    }

    window.addEventListener("waffle:open-onboarding", handleOpen)
    onCleanup(() => {
      window.removeEventListener("waffle:open-onboarding", handleOpen)
    })
  })

  const completeSetup = () => {
    localStorage.setItem("waffle_onboarding_completed", "true")
    localStorage.setItem("waffle_disclaimer_agreed", "true")
    localStorage.setItem("waffle_autonomy_mode", autonomyMode())
    localStorage.setItem("waffle_remote_enabled", remoteAccessEnabled() ? "true" : "false")
    localStorage.setItem("waffle_live_preview", livePreviewEnabled() ? "true" : "false")
    localStorage.setItem("waffle_hot_reload", hotReloadEnabled() ? "true" : "false")
    if (geminiApiKey().trim()) {
      localStorage.setItem("waffle_gemini_api_key", geminiApiKey().trim())
    }
    setGem(selectedGemId())
    setOpen(false)
  }

  return (
    <Show when={open()}>
      <div class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none">
        <div class="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* ── Top Glow Header ────────────────────────────────────────── */}
          <div class="p-5 border-b border-zinc-800 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-zinc-900/40 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl shadow-inner">
                🧇
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h1 class="text-base font-bold text-zinc-100">WaffleCode 초기 설정 마법사</h1>
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                    Antigravity Setup
                  </span>
                </div>
                <p class="text-xs text-zinc-400">환경 설정 및 권한, 면책 조항 동의 단계 (Step {step()} / 5)</p>
              </div>
            </div>

            {/* Step Dots */}
            <div class="flex items-center gap-1.5">
              <For each={[1, 2, 3, 4, 5]}>
                {(s) => (
                  <div
                    class="h-2 rounded-full transition-all"
                    classList={{
                      "w-6 bg-amber-400": step() === s,
                      "w-2 bg-amber-400/40": step() > s,
                      "w-2 bg-zinc-800": step() < s,
                    }}
                  />
                )}
              </For>
            </div>
          </div>

          {/* ── Body Content by Step ──────────────────────────────────── */}
          <div class="flex-1 overflow-y-auto p-6 space-y-5">
            {/* ── STEP 1: 면책 조항 및 책임 부인 ────────────────────────── */}
            <Show when={step() === 1}>
              <div class="space-y-4">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">⚖️</span>
                  <div>
                    <h2 class="text-base font-bold text-red-400">필수 동의: 법적 면책 조항 및 책임 부인</h2>
                    <p class="text-xs text-zinc-400">
                      WaffleCode를 이용하기 전 아래의 책임 한계 고지 사항을 반드시 확인해 주십시오.
                    </p>
                  </div>
                </div>

                <div class="p-4 rounded-2xl border border-red-500/30 bg-red-950/20 text-xs text-zinc-300 space-y-3 font-sans leading-relaxed max-h-56 overflow-y-auto">
                  <div class="font-bold text-red-300 flex items-center gap-1.5">
                    <span>⚠️</span>
                    <span>개발자 및 기여자 완전 면책 고지 (Limitation of Liability)</span>
                  </div>
                  <p>
                    <strong>1. 무책임의 원칙:</strong> 본 소프트웨어(WaffleCode)는 인공지능(AI) 기반 코드 생성, 시스템 자동화 및 컴퓨터 제어 보조 프로그램입니다. 
                    <strong>
                      개발자 및 배포자(이하 &quot;제공자&quot;)는 사용자가 본 프로그램을 설치, 실행, 설정, 조작하거나 제3자에게 배포하는 과정에서 발생하는 그 어떠한 직·간접적 손해, 데이터 유실, 시스템 오류, 파일 파손, 금전적 손실, 계정 정지, 법적 분쟁 및 불이익에 대해서도 어떠한 이유나 사유를 불문하고 일체의 법적·도의적 책임을 부담하지 않습니다.
                    </strong>
                  </p>
                  <p>
                    <strong>2. 완전한 사용자 책임:</strong> 인공지능 에이전트가 실행하는 모든 쉘 명령어, 파일 수정 및 삭제, 터미널 실행, 원격 접속 허용 및 컴퓨터 조작의 실행 권한을 부여하고 그 결과를 승인한 주체는 전적으로 사용자 본인이며, 모든 결과와 위험은 사용자가 단독으로 감수합니다.
                  </p>
                  <p>
                    <strong>3. 제3자 피해 부인:</strong> 사용자의 프로그램 운용으로 인해 발생한 타인 또는 제3자에 대한 어떠한 피해나 법적 분쟁에 대해서도 제공자는 어떠한 책임도 지지 않습니다.
                  </p>
                  <p class="text-[11px] text-zinc-400 border-t border-red-900/40 pt-2">
                    본 조항은 대한민국 법률 및 관계 법령이 허용하는 최대한의 범위 내에서 유효하며, 이에 동의하지 않는 경우 본 프로그램을 사용할 수 없습니다.
                  </p>
                </div>

                {/* 동의 체크박스 */}
                <label class="flex items-start gap-3 p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-900 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={disclaimerAgreed()}
                    onChange={(e) => setDisclaimerAgreed(e.currentTarget.checked)}
                    class="mt-0.5 size-4 rounded accent-amber-500 cursor-pointer"
                  />
                  <span class="text-xs text-zinc-200 font-medium leading-snug">
                    위 면책 조항 및 책임 부인 사항을 충분히 이해하였으며, <strong class="text-amber-400">어떠한 사유나 피해로도 개발자에게 책임을 묻지 않고 모든 결과를 본인의 책임 하에 실행함</strong>에 명시적으로 동의합니다.
                  </span>
                </label>
              </div>
            </Show>

            {/* ── STEP 2: Gemini & Opal AI 엔진 선택 ───────────────────── */}
            <Show when={step() === 2}>
              <div class="space-y-4">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">💎</span>
                  <div>
                    <h2 class="text-base font-bold text-zinc-100">제미나이 잼스(Gems) & 오팔(Opal) 엔진 구성</h2>
                    <p class="text-xs text-zinc-400">작업을 수행할 기본 AI 에이전트 페르소나를 선택하세요.</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <For each={gems}>
                    {(gem) => {
                      const isSelected = () => gem.id === selectedGemId()
                      return (
                        <button
                          type="button"
                          onClick={() => setSelectedGemId(gem.id)}
                          class="p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between"
                          classList={{
                            "border-amber-500/80 bg-amber-500/10 shadow-md": isSelected(),
                            "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700": !isSelected(),
                          }}
                        >
                          <div>
                            <div class="flex items-center justify-between">
                              <span class="text-2xl">{gem.icon}</span>
                              <Show when={gem.badge}>
                                <span
                                  class="text-[9px] px-1.5 py-0.5 rounded-full font-semibold text-white"
                                  style={{ "background-color": gem.accentColor }}
                                >
                                  {gem.badge}
                                </span>
                              </Show>
                            </div>
                            <div class="text-xs font-bold text-zinc-100 mt-2">{gem.name}</div>
                            <div class="text-[11px] text-zinc-400 mt-1 leading-snug">{gem.description}</div>
                          </div>
                          <Show when={isSelected()}>
                            <div class="text-[10px] text-amber-400 font-bold mt-2">✓ 기본 선택됨</div>
                          </Show>
                        </button>
                      )
                    }}
                  </For>
                </div>

                <div class="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-1.5">
                  <label class="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                    <span>🔑 Google Gemini API Key (선택 사항)</span>
                    <span class="text-[10px] text-zinc-500">생략 시 내장 기본 설정 사용</span>
                  </label>
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={geminiApiKey()}
                    onInput={(e) => setGeminiApiKey(e.currentTarget.value)}
                    class="w-full px-3 py-2 text-xs rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </Show>

            {/* ── STEP 3: 컴퓨터 원격 & 자율 조작 권한 ──────────────────── */}
            <Show when={step() === 3}>
              <div class="space-y-4">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">🖥️</span>
                  <div>
                    <h2 class="text-base font-bold text-zinc-100">컴퓨터 원격 & 에이전트 자율 조작 권한</h2>
                    <p class="text-xs text-zinc-400">
                      안티그래비티처럼 실제 사용자가 조작하듯 에이전트가 시스템을 다룰 수 있도록 권한을 구성합니다.
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 완전 사용자 모드 */}
                  <button
                    type="button"
                    onClick={() => setAutonomyMode("full")}
                    class="p-4 rounded-2xl border text-left transition-all flex flex-col justify-between"
                    classList={{
                      "border-amber-500/80 bg-amber-500/10 shadow-lg": autonomyMode() === "full",
                      "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700": autonomyMode() !== "full",
                    }}
                  >
                    <div>
                      <div class="text-2xl mb-1">🚀</div>
                      <div class="text-xs font-bold text-amber-300">완전 사용자 모드 (권장)</div>
                      <p class="text-[11px] text-zinc-400 mt-1 leading-snug">
                        실제 사람이 작업하듯 확인 프롬프트 없이 파일 편집, 터미널 쉘 실행, 빌드/테스트를 완전 자율로 수행합니다.
                      </p>
                    </div>
                    <Show when={autonomyMode() === "full"}>
                      <span class="text-[10px] text-amber-400 font-bold mt-2.5">✓ 활성화됨</span>
                    </Show>
                  </button>

                  {/* 안전 자율 모드 */}
                  <button
                    type="button"
                    onClick={() => setAutonomyMode("safe")}
                    class="p-4 rounded-2xl border text-left transition-all flex flex-col justify-between"
                    classList={{
                      "border-blue-500/80 bg-blue-500/10 shadow-lg": autonomyMode() === "safe",
                      "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700": autonomyMode() !== "safe",
                    }}
                  >
                    <div>
                      <div class="text-2xl mb-1">🛡️</div>
                      <div class="text-xs font-bold text-blue-300">안전 자율 모드</div>
                      <p class="text-[11px] text-zinc-400 mt-1 leading-snug">
                        일반 코드 작성 및 읽기는 자동 승인하되, 시스템 파괴적 쉘 명령어 실행 시에만 확인을 요청합니다.
                      </p>
                    </div>
                    <Show when={autonomyMode() === "safe"}>
                      <span class="text-[10px] text-blue-400 font-bold mt-2.5">✓ 활성화됨</span>
                    </Show>
                  </button>
                </div>

                {/* 원격 접속 토글 */}
                <div class="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
                  <div>
                    <div class="text-xs font-semibold text-zinc-200">🌐 외부 기기 및 브라우저 원격 조작 허용</div>
                    <div class="text-[11px] text-zinc-400 mt-0.5">
                      스마트폰, 태블릿 또는 외부 브라우저에서 포트(4096)로 WaffleCode에 접속하여 작업 가능
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={remoteAccessEnabled()}
                    onChange={(e) => setRemoteAccessEnabled(e.currentTarget.checked)}
                    class="size-5 rounded accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            </Show>

            {/* ── STEP 4: AI 스튜디오 실시간 프리뷰 설정 ────────────────── */}
            <Show when={step() === 4}>
              <div class="space-y-4">
                <div class="flex items-center gap-2">
                  <span class="text-2xl">👁️</span>
                  <div>
                    <h2 class="text-base font-bold text-zinc-100">AI 스튜디오 실시간 프리뷰 & 바이브 환경</h2>
                    <p class="text-xs text-zinc-400">
                      수정한 웹앱 및 컴포넌트를 사이드 패널에서 즉시 확인하는 프리뷰 환경을 설정합니다.
                    </p>
                  </div>
                </div>

                <div class="space-y-3">
                  <div class="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
                    <div>
                      <div class="text-xs font-semibold text-zinc-200">📱 멀티 디바이스 반응형 뷰 (모바일/태블릿/데스크톱)</div>
                      <div class="text-[11px] text-zinc-400 mt-0.5">
                        실시간 프리뷰 창에서 기기 프레임별 반응형 레이아웃 테스트 지원
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={livePreviewEnabled()}
                      onChange={(e) => setLivePreviewEnabled(e.currentTarget.checked)}
                      class="size-5 rounded accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div class="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
                    <div>
                      <div class="text-xs font-semibold text-zinc-200">⚡ 코드 변경 시 즉시 핫 리로드 (Hot Reload)</div>
                      <div class="text-[11px] text-zinc-400 mt-0.5">
                        에이전트가 코드를 수정하거나 사용자가 입력할 때 프리뷰 화면 자동 갱신
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={hotReloadEnabled()}
                      onChange={(e) => setHotReloadEnabled(e.currentTarget.checked)}
                      class="size-5 rounded accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div class="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-amber-200/90 leading-relaxed">
                    💡 <strong>바이브 코딩 팁:</strong> 세션 화면 상단의 <code>[⚡ 워크 (Work)]</code> 탭을 클릭하면 Codex 스타일의 빌드/테스트 퀵 액션과 실시간 프리뷰를 바로 실행할 수 있습니다.
                  </div>
                </div>
              </div>
            </Show>

            {/* ── STEP 5: 세팅 완료 & 요약 ──────────────────────────────── */}
            <Show when={step() === 5}>
              <div class="space-y-4 text-center py-2">
                <div class="size-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl mx-auto shadow-xl animate-bounce">
                  🧇
                </div>
                <div>
                  <h2 class="text-lg font-bold text-zinc-100">WaffleCode 설정이 완료되었습니다!</h2>
                  <p class="text-xs text-zinc-400 mt-1">
                    모든 환경 설정과 면책 동의가 완료되었습니다. 이제 자유롭게 바이브 코딩을 즐기세요.
                  </p>
                </div>

                <div class="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 text-left text-xs space-y-2.5">
                  <div class="font-semibold text-zinc-300 border-b border-zinc-800 pb-1.5 flex items-center justify-between">
                    <span>📋 설정 요약</span>
                    <span class="text-[10px] text-emerald-400">Ready</span>
                  </div>
                  <div class="flex justify-between text-zinc-400">
                    <span>면책 조항 동의:</span>
                    <span class="text-emerald-400 font-semibold">동의 완료 (책임 부인 명시)</span>
                  </div>
                  <div class="flex justify-between text-zinc-400">
                    <span>기본 AI 에이전트:</span>
                    <span class="text-zinc-200 font-semibold">{gems.find((g) => g.id === selectedGemId())?.name}</span>
                  </div>
                  <div class="flex justify-between text-zinc-400">
                    <span>에이전트 권한:</span>
                    <span class="text-amber-300 font-semibold">
                      {autonomyMode() === "full" ? "🚀 완전 사용자 모드 (자율 실행)" : "🛡️ 안전 자율 모드"}
                    </span>
                  </div>
                  <div class="flex justify-between text-zinc-400">
                    <span>원격 제어 서버:</span>
                    <span class="text-zinc-200">{remoteAccessEnabled() ? "포트 4096 활성화" : "비활성화"}</span>
                  </div>
                  <div class="flex justify-between text-zinc-400">
                    <span>AI Studio 프리뷰:</span>
                    <span class="text-blue-400 font-semibold">활성화 (핫 리로드 적용)</span>
                  </div>
                </div>

                <div class="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-left text-[11px] text-zinc-400 leading-relaxed">
                  🔄 <strong>다시 세팅 안내:</strong> 설정 창(<kbd class="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px]">Ctrl + ,</kbd>)의 <strong>[🖥️ 컴퓨터 원격 & 자율 조작]</strong> 탭에서 언제든지 <strong class="text-zinc-200">[초기 설정 마법사 다시 시작]</strong>을 눌러 처음부터 재설정할 수 있습니다.
                </div>
              </div>
            </Show>
          </div>

          {/* ── Footer Navigation Buttons ─────────────────────────────── */}
          <div class="p-4 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
            <Show
              when={step() > 1}
              fallback={<div class="text-[11px] text-zinc-500">1단계 동의 후 다음으로 진행할 수 있습니다.</div>}
            >
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                class="px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-200 text-xs font-semibold hover:bg-zinc-700 transition-colors"
              >
                이전 단계
              </button>
            </Show>

            <div class="flex items-center gap-2">
              <Show when={step() < 5}>
                <button
                  type="button"
                  disabled={step() === 1 && !disclaimerAgreed()}
                  onClick={() => setStep((s) => Math.min(5, s + 1))}
                  class="px-5 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md"
                >
                  다음 단계 →
                </button>
              </Show>

              <Show when={step() === 5}>
                <button
                  type="button"
                  onClick={completeSetup}
                  class="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-zinc-950 font-black text-xs hover:opacity-95 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
                >
                  <span>와플코드 시작하기 🧇</span>
                </button>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </Show>
  )
}
