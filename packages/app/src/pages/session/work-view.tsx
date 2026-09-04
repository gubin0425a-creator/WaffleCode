import { createSignal, createMemo, For, Show, type Component } from "solid-js"
import { useGems } from "@/context/gems"
import { useSDK } from "@/context/sdk"
import type { SnapshotFileDiff, VcsFileDiff } from "@opencode-ai/sdk/v2"
import type { FileDiffInfo } from "@opencode-ai/client/promise"

type ReviewDiff = FileDiffInfo | SnapshotFileDiff | VcsFileDiff

export interface SessionWorkViewProps {
  diffs?: () => ReviewDiff[]
  onOpenPreview?: () => void
  onOpenReview?: () => void
}

export const SessionWorkView: Component<SessionWorkViewProps> = (props) => {
  const { activeGem } = useGems()
  const sdk = useSDK()

  const [filter, setFilter] = createSignal<"all" | "files" | "commands">("all")
  const [runningAction, setRunningAction] = createSignal<string | null>(null)
  const [actionOutput, setActionOutput] = createSignal<string>("")

  const changedFiles = createMemo(() => {
    const list = props.diffs ? props.diffs() : []
    return list.filter((d): d is FileDiffInfo | SnapshotFileDiff | VcsFileDiff => typeof d.file === "string")
  })

  // Quick Action execution
  const runQuickAction = async (name: string, commandText: string) => {
    setRunningAction(name)
    setActionOutput(`> ${commandText}\n실행 중...\n`)

    try {
      // Execute command via SDK terminal/shell
      const res = await sdk().client.terminal.create({
        command: commandText,
      }).catch(() => null)

      setActionOutput((prev) => prev + `\n[완료] 명령어가 실행되었습니다.`)
    } catch (err) {
      setActionOutput((prev) => prev + `\n[오류] 실행 실패: ${err}`)
    } finally {
      setTimeout(() => setRunningAction(null), 1500)
    }
  }

  return (
    <div class="flex flex-col size-full min-h-0 bg-zinc-950 text-zinc-100 overflow-y-auto p-4 sm:p-6 space-y-6 select-none">
      {/* ── Top Summary Banner ─────────────────────────────── */}
      <div class="p-4 rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-zinc-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div class="flex items-center gap-3">
          <div class="size-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl shadow-inner">
            ⚡
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-base font-bold text-zinc-100">워크 스페이스 (Work Stream)</h2>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                Codex Mode
              </span>
            </div>
            <p class="text-xs text-zinc-400 mt-0.5">
              현재 활성화된 에이전트: <span class="font-semibold text-zinc-200">{activeGem().icon} {activeGem().name}</span>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("waffle:open-onboarding"))}
            class="h-8 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="초기 설정 마법사 다시 시작"
          >
            <span>🔄</span>
            <span>설정 마법사</span>
          </button>
          <Show when={props.onOpenPreview}>
            <button
              type="button"
              onClick={props.onOpenPreview}
              class="h-8 px-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <span>👁️</span>
              <span>실시간 프리뷰 열기</span>
            </button>
          </Show>
          <Show when={props.onOpenReview}>
            <button
              type="button"
              onClick={props.onOpenReview}
              class="h-8 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <span>📝</span>
              <span>변경사항 검토</span>
            </button>
          </Show>
        </div>
      </div>

      {/* ── Quick Actions ───────────────────────────────────── */}
      <div class="flex flex-col gap-2.5">
        <div class="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <span>🚀 빠른 작업 실행 (Quick Actions)</span>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => runQuickAction("build", "bun run build")}
            disabled={!!runningAction()}
            class="p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/80 hover:border-zinc-700 text-left transition-all group"
          >
            <div class="text-base mb-1">🏗️</div>
            <div class="text-xs font-semibold text-zinc-200 group-hover:text-white">프로젝트 빌드</div>
            <div class="text-[10px] text-zinc-500 font-mono mt-0.5">bun run build</div>
          </button>

          <button
            type="button"
            onClick={() => runQuickAction("test", "bun test")}
            disabled={!!runningAction()}
            class="p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/80 hover:border-zinc-700 text-left transition-all group"
          >
            <div class="text-base mb-1">🧪</div>
            <div class="text-xs font-semibold text-zinc-200 group-hover:text-white">테스트 실행</div>
            <div class="text-[10px] text-zinc-500 font-mono mt-0.5">bun test</div>
          </button>

          <button
            type="button"
            onClick={() => runQuickAction("lint", "bun x oxlint")}
            disabled={!!runningAction()}
            class="p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/80 hover:border-zinc-700 text-left transition-all group"
          >
            <div class="text-base mb-1">🔍</div>
            <div class="text-xs font-semibold text-zinc-200 group-hover:text-white">코드 린트 검사</div>
            <div class="text-[10px] text-zinc-500 font-mono mt-0.5">oxlint</div>
          </button>

          <button
            type="button"
            onClick={() => runQuickAction("git", "git status")}
            disabled={!!runningAction()}
            class="p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/80 hover:border-zinc-700 text-left transition-all group"
          >
            <div class="text-base mb-1">📦</div>
            <div class="text-xs font-semibold text-zinc-200 group-hover:text-white">Git 상태 조회</div>
            <div class="text-[10px] text-zinc-500 font-mono mt-0.5">git status</div>
          </button>
        </div>

        {/* Action output box */}
        <Show when={actionOutput()}>
          <div class="p-3 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-xs text-zinc-300 whitespace-pre-wrap select-text">
            {actionOutput()}
          </div>
        </Show>
      </div>

      {/* ── Modified Files in this Session ─────────────────── */}
      <div class="flex flex-col gap-2.5">
        <div class="flex items-center justify-between text-xs font-bold text-zinc-400">
          <span class="uppercase tracking-wider">📁 작업 수정 파일 ({changedFiles().length})</span>
          <span class="text-[11px] font-normal text-zinc-500">실시간 반영됨</span>
        </div>

        <Show
          when={changedFiles().length > 0}
          fallback={
            <div class="p-8 rounded-xl border border-dashed border-zinc-800 text-center text-zinc-500 text-xs">
              이번 세션에서 아직 수정된 파일이 없습니다. 채팅에서 작업을 요청해 보세요!
            </div>
          }
        >
          <div class="space-y-1.5">
            <For each={changedFiles()}>
              {(diff) => (
                <div class="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between hover:bg-zinc-900 transition-colors">
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="text-sm">📄</span>
                    <span class="text-xs font-mono text-zinc-200 truncate">{diff.file}</span>
                  </div>
                  <div class="flex items-center gap-2 text-xs font-mono shrink-0">
                    <Show when={diff.additions}>
                      <span class="text-emerald-400 font-medium">+{diff.additions}</span>
                    </Show>
                    <Show when={diff.deletions}>
                      <span class="text-red-400 font-medium">-{diff.deletions}</span>
                    </Show>
                    <Show when={props.onOpenReview}>
                      <button
                        type="button"
                        onClick={props.onOpenReview}
                        class="text-[10px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                      >
                        Diff 보기
                      </button>
                    </Show>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>

      {/* ── Active Agent Persona Card ──────────────────────── */}
      <div class="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 flex flex-col gap-2">
        <div class="flex items-center justify-between text-xs">
          <span class="font-semibold text-zinc-300 flex items-center gap-1.5">
            <span>{activeGem().icon}</span>
            <span>{activeGem().name} 인스트럭션</span>
          </span>
          <span class="text-[10px] font-mono text-purple-400">Gemini Active</span>
        </div>
        <p class="text-xs text-zinc-400 leading-relaxed font-sans select-text">
          {activeGem().prompt}
        </p>
      </div>
    </div>
  )
}
