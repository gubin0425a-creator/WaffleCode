import { createSignal, Show, type Component } from "solid-js"

export const SettingsComputerControl: Component = () => {
  // Autonomy modes: "full" (완전 사용자) | "safe" (안전 자율) | "ask" (매번 확인)
  const [autonomyMode, setAutonomyMode] = createSignal<"full" | "safe" | "ask">("full")
  const [remoteEnabled, setRemoteEnabled] = createSignal<boolean>(true)
  const [remotePort, setRemotePort] = createSignal<string>("4096")
  const [remoteHost, setRemoteHost] = createSignal<string>("0.0.0.0")
  const [guiAutomation, setGuiAutomation] = createSignal<boolean>(true)
  const [unrestrictedShell, setUnrestrictedShell] = createSignal<boolean>(true)
  const [autoApproveFile, setAutoApproveFile] = createSignal<boolean>(true)
  const [remoteToken, setRemoteToken] = createSignal<string>("waffle-remote-" + Math.random().toString(36).substring(2, 10))
  const [copied, setCopied] = createSignal(false)

  const copyToken = () => {
    navigator.clipboard.writeText(remoteToken())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div class="flex flex-col gap-6 p-6 max-w-2xl text-zinc-100 overflow-y-auto">
      {/* Header */}
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold flex items-center gap-2">
            <span>🖥️ 컴퓨터 원격 조작 & 자율 권한 설정</span>
            <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Active
            </span>
          </h2>
          <p class="text-xs text-zinc-400 mt-1 leading-relaxed">
            AI 에이전트가 사용자를 대신하여 컴퓨터를 직접 조작하고, 원격 브라우저나 외부 기기에서 WaffleCode를 제어할 수 있는 권한을 설정합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("waffle:open-onboarding"))}
          class="h-8 px-3.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
        >
          <span>🔄</span>
          <span>초기 설정 마법사 다시 시작</span>
        </button>
      </div>

      {/* ⚠️ 법적 책임 부인 및 면책 고지 배너 */}
      <div class="p-4 rounded-2xl border border-red-500/40 bg-red-950/20 text-xs text-zinc-300 space-y-2">
        <div class="font-bold text-red-400 flex items-center gap-1.5 text-xs">
          <span>⚠️</span>
          <span>법적 책임 부인 및 완전 면책 고지 (Limitation of Liability)</span>
        </div>
        <p class="text-[11px] leading-relaxed text-zinc-300">
          <strong>개발자 및 기여자는 본 프로그램(WaffleCode)의 사용, 실행, 자율 조작 또는 원격 제어로 인해 발생하는 그 어떠한 직·간접적 손해, 데이터 유실, 시스템 고장, 과금, 보안 사고 및 제3자 피해에 대해서도 어떠한 이유나 명목으로도 일체의 책임을 지지 않습니다.</strong> 모든 권한 부여와 코드/명령어 실행에 따른 결과는 전적으로 사용자 본인의 책임입니다.
        </p>
      </div>

      <div class="h-px bg-zinc-800" />

      {/* 1. 에이전트 자율 실행 모드 */}
      <div class="flex flex-col gap-3">
        <label class="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
          🤖 에이전트 실행 권한 모드
        </label>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* 완전 사용자 모드 */}
          <button
            type="button"
            onClick={() => {
              setAutonomyMode("full")
              setGuiAutomation(true)
              setUnrestrictedShell(true)
              setAutoApproveFile(true)
            }}
            class="p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between"
            classList={{
              "border-amber-500/80 bg-amber-500/10 shadow-lg shadow-amber-500/5": autonomyMode() === "full",
              "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700": autonomyMode() !== "full",
            }}
          >
            <div>
              <div class="text-lg mb-1">🚀</div>
              <div class="text-sm font-bold text-amber-300">완전 사용자 모드</div>
              <p class="text-[11px] text-zinc-400 mt-1 leading-snug">
                실제 사용자가 하는 것처럼 확인 없이 터미널 실행, 파일 편집, GUI 조작을 완전 자율로 수행합니다.
              </p>
            </div>
            <Show when={autonomyMode() === "full"}>
              <span class="text-[10px] text-amber-400 font-bold mt-2 flex items-center gap-1">
                ✓ 현재 활성화됨
              </span>
            </Show>
          </button>

          {/* 안전 자율 모드 */}
          <button
            type="button"
            onClick={() => {
              setAutonomyMode("safe")
              setGuiAutomation(true)
              setUnrestrictedShell(false)
              setAutoApproveFile(true)
            }}
            class="p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between"
            classList={{
              "border-blue-500/80 bg-blue-500/10 shadow-lg shadow-blue-500/5": autonomyMode() === "safe",
              "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700": autonomyMode() !== "safe",
            }}
          >
            <div>
              <div class="text-lg mb-1">🛡️</div>
              <div class="text-sm font-bold text-blue-300">안전 자율 모드</div>
              <p class="text-[11px] text-zinc-400 mt-1 leading-snug">
                일반적인 코드 작성 및 조회는 자동 승인하고, 위험한 쉘 명령어 실행 시에만 확인을 요청합니다.
              </p>
            </div>
            <Show when={autonomyMode() === "safe"}>
              <span class="text-[10px] text-blue-400 font-bold mt-2 flex items-center gap-1">
                ✓ 현재 활성화됨
              </span>
            </Show>
          </button>

          {/* 매번 확인 모드 */}
          <button
            type="button"
            onClick={() => {
              setAutonomyMode("ask")
              setGuiAutomation(false)
              setUnrestrictedShell(false)
              setAutoApproveFile(false)
            }}
            class="p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between"
            classList={{
              "border-zinc-600 bg-zinc-800/40": autonomyMode() === "ask",
              "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700": autonomyMode() !== "ask",
            }}
          >
            <div>
              <div class="text-lg mb-1">🔒</div>
              <div class="text-sm font-bold text-zinc-300">수동 확인 모드</div>
              <p class="text-[11px] text-zinc-400 mt-1 leading-snug">
                모든 파일 수정과 터미널 명령어 실행 전에 사용자의 명시적인 승인을 거칩니다.
              </p>
            </div>
            <Show when={autonomyMode() === "ask"}>
              <span class="text-[10px] text-zinc-400 font-bold mt-2 flex items-center gap-1">
                ✓ 현재 활성화됨
              </span>
            </Show>
          </button>
        </div>
      </div>

      <div class="h-px bg-zinc-800" />

      {/* 2. 세부 컴퓨터 조작 권한 토글 */}
      <div class="flex flex-col gap-3">
        <label class="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
          ⚙️ 세부 권한 제어
        </label>

        <div class="space-y-2">
          {/* GUI & 컴퓨터 조작 */}
          <div class="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
            <div>
              <div class="text-xs font-semibold text-zinc-200">마우스/키보드 GUI 자율 조작 (Computer Use)</div>
              <div class="text-[11px] text-zinc-400">화면 스크린샷 분석 및 브라우저/애플리케이션 인터랙션 허용</div>
            </div>
            <input
              type="checkbox"
              checked={guiAutomation()}
              onChange={(e) => setGuiAutomation(e.currentTarget.checked)}
              class="size-4 accent-amber-500 cursor-pointer"
            />
          </div>

          {/* 터미널 무제한 실행 */}
          <div class="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
            <div>
              <div class="text-xs font-semibold text-zinc-200">터미널 명령어 무제한 자동 실행</div>
              <div class="text-[11px] text-zinc-400">패키지 설치, 빌드, 파일 명령어를 멈춤 없이 즉시 실행</div>
            </div>
            <input
              type="checkbox"
              checked={unrestrictedShell()}
              onChange={(e) => setUnrestrictedShell(e.currentTarget.checked)}
              class="size-4 accent-amber-500 cursor-pointer"
            />
          </div>

          {/* 파일 자동 수정 */}
          <div class="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
            <div>
              <div class="text-xs font-semibold text-zinc-200">파일 시스템 직접 쓰기/수정 자동 승인</div>
              <div class="text-[11px] text-zinc-400">코드 생성 및 변경사항을 작업 공간에 즉시 반영</div>
            </div>
            <input
              type="checkbox"
              checked={autoApproveFile()}
              onChange={(e) => setAutoApproveFile(e.currentTarget.checked)}
              class="size-4 accent-amber-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div class="h-px bg-zinc-800" />

      {/* 3. 원격 접속 & 외부 제어 서버 */}
      <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <label class="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            🌐 원격 조작 서버 (Remote Access)
          </label>
          <div class="flex items-center gap-2">
            <span class="text-xs text-zinc-400">{remoteEnabled() ? "원격 접속 활성" : "로컬 전용"}</span>
            <input
              type="checkbox"
              checked={remoteEnabled()}
              onChange={(e) => setRemoteEnabled(e.currentTarget.checked)}
              class="size-4 accent-purple-500 cursor-pointer"
            />
          </div>
        </div>

        <div class="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-[11px] text-zinc-400 block mb-1">원격 바인딩 주소</label>
              <input
                type="text"
                value={remoteHost()}
                onInput={(e) => setRemoteHost(e.currentTarget.value)}
                class="w-full h-8 px-2.5 text-xs bg-zinc-950 border border-zinc-700/70 rounded text-zinc-200 font-mono"
              />
            </div>
            <div>
              <label class="text-[11px] text-zinc-400 block mb-1">포트 번호</label>
              <input
                type="text"
                value={remotePort()}
                onInput={(e) => setRemotePort(e.currentTarget.value)}
                class="w-full h-8 px-2.5 text-xs bg-zinc-950 border border-zinc-700/70 rounded text-zinc-200 font-mono"
              />
            </div>
          </div>

          <div>
            <label class="text-[11px] text-zinc-400 block mb-1">원격 보안 인증 토큰 (Security Token)</label>
            <div class="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={remoteToken()}
                class="flex-1 h-8 px-2.5 text-xs bg-zinc-950 border border-zinc-700/70 rounded text-purple-300 font-mono"
              />
              <button
                type="button"
                onClick={copyToken}
                class="h-8 px-3 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded font-medium border border-zinc-700 transition-colors"
              >
                {copied() ? "복사됨! ✓" : "토큰 복사"}
              </button>
            </div>
          </div>

          <p class="text-[11px] text-zinc-500 leading-relaxed">
            원격 기기(노트북, 태블릿, 모바일 브라우저)에서 <code class="text-purple-400 font-mono">http://[내PC-IP]:{remotePort()}</code>에 접속 후 위 토큰을 입력하면 WaffleCode를 언제 어디서나 원격으로 제어할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
}
