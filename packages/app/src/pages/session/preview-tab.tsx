import { createEffect, createMemo, createSignal, For, onCleanup, Show, Switch, Match, type JSX } from "solid-js"
import { Icon } from "@opencode-ai/ui/icon"
import { useSDK } from "@/context/sdk"
import type { SnapshotFileDiff, VcsFileDiff } from "@opencode-ai/sdk/v2"
import type { FileDiffInfo } from "@opencode-ai/client/promise"

type ReviewDiff = FileDiffInfo | SnapshotFileDiff | VcsFileDiff

export interface SessionPreviewTabProps {
  diffs?: () => ReviewDiff[]
  activeDiff?: string
  projectDirectory?: () => string | undefined
  onSwitchToReview?: () => void
}

type ViewportMode = "desktop" | "tablet" | "mobile"
type PreviewMode = "file" | "server"

export function SessionPreviewTab(props: SessionPreviewTabProps) {
  const sdk = useSDK()

  // State
  const [mode, setMode] = createSignal<PreviewMode>("file")
  const [viewport, setViewport] = createSignal<ViewportMode>("desktop")
  const [splitView, setSplitView] = createSignal<boolean>(false)
  const [serverUrl, setServerUrl] = createSignal<string>("http://localhost:5173")
  const [serverInput, setServerInput] = createSignal<string>("http://localhost:5173")
  const [selectedFile, setSelectedFile] = createSignal<string>("")
  const [fileContent, setFileContent] = createSignal<string>("")
  const [loading, setLoading] = createSignal<boolean>(false)
  const [error, setError] = createSignal<string | null>(null)
  const [refreshKey, setRefreshKey] = createSignal<number>(0)
  const [consoleLogs, setConsoleLogs] = createSignal<{ type: "log" | "error" | "warn"; msg: string; time: string }[]>([])
  const [showConsole, setShowConsole] = createSignal<boolean>(false)

  let iframeRef: HTMLIFrameElement | undefined

  // Extract modified files list from diffs
  const changedFiles = createMemo(() => {
    const list = props.diffs ? props.diffs() : []
    const files: string[] = []
    for (const d of list) {
      if (typeof d.file === "string" && !files.includes(d.file)) {
        files.push(d.file)
      }
    }
    return files
  })

  // Filter previewable files (html, svg, md, htm, xml, js, jsx, ts, tsx, css)
  const previewableFiles = createMemo(() => {
    const files = changedFiles()
    const isWebFile = (f: string) => /\.(html|htm|svg|md|jsx|tsx|vue|svelte|css|js|json)$/i.test(f)
    return files.filter(isWebFile)
  })

  // Auto-select first previewable file when diffs change or when mounted
  createEffect(() => {
    const list = previewableFiles()
    const current = selectedFile()
    if (!current || !list.includes(current)) {
      if (list.length > 0) {
        // Prioritize HTML files
        const html = list.find((f) => /\.(html|htm)$/i.test(f))
        setSelectedFile(html ?? list[0])
      } else if (changedFiles().length > 0) {
        setSelectedFile(changedFiles()[0])
      } else if (!current) {
        setSelectedFile("index.html")
      }
    }
  })

  // Re-fetch file content whenever selectedFile or refreshKey changes
  createEffect(() => {
    const filePath = selectedFile()
    refreshKey() // track reload trigger
    if (!filePath || mode() !== "file") return

    setLoading(true)
    setError(null)

    sdk()
      .client.file.read({ path: filePath })
      .then((res) => {
        const text = typeof res.data === "string" ? res.data : ""
        setFileContent(text)
        setLoading(false)
      })
      .catch((err) => {
        console.debug("[preview-tab] file read failed", err)
        setError(`파일을 읽을 수 없습니다: ${filePath}`)
        setLoading(false)
      })
  })

  // Auto-reload on diff changes
  createEffect(() => {
    if (props.diffs) {
      const diffList = props.diffs()
      if (diffList.length > 0) {
        // Increment refreshKey to trigger re-render
        setRefreshKey((k) => k + 1)
      }
    }
  })

  // Listen to message from iframe for console log capturing
  const handleIframeMessage = (event: MessageEvent) => {
    if (event.data && event.data.__opencode_preview_log) {
      const { type, args } = event.data
      const now = new Date().toLocaleTimeString()
      setConsoleLogs((prev) => [
        ...prev.slice(-49), // keep last 50
        { type: type || "log", msg: args.join(" "), time: now },
      ])
    }
  }

  window.addEventListener("message", handleIframeMessage)
  onCleanup(() => {
    window.removeEventListener("message", handleIframeMessage)
  })

  // Prepare iframe HTML bundle with console capture script
  const bundledHtml = createMemo(() => {
    const raw = fileContent()
    const file = selectedFile()

    if (file.endsWith(".svg")) {
      return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><style>body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#0d0d0e;color:#fff;}</style></head>
<body>${raw}</body>
</html>`
    }

    if (file.endsWith(".md")) {
      const escaped = raw
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
      return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; padding: 2rem; max-width: 800px; margin: 0 auto; color: #e4e4e7; background: #18181b; }
h1, h2, h3 { color: #fafafa; border-bottom: 1px solid #27272a; padding-bottom: 0.3em; }
code { background: #27272a; padding: 0.2em 0.4em; border-radius: 4px; font-size: 85%; font-family: monospace; }
pre { background: #09090b; padding: 1rem; border-radius: 6px; overflow-x: auto; border: 1px solid #27272a; }
a { color: #60a5fa; }
table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
th, td { border: 1px solid #27272a; padding: 8px 12px; }
th { background: #27272a; }
</style>
</head>
<body>
<pre>${escaped}</pre>
</body>
</html>`
    }

    const consoleInterceptor = `
<script>
(function() {
  function sendLog(type, args) {
    try {
      window.parent.postMessage({
        __opencode_preview_log: true,
        type: type,
        args: Array.from(args).map(function(a) {
          try { return typeof a === 'object' ? JSON.stringify(a) : String(a); } catch(e) { return String(a); }
        })
      }, '*');
    } catch(e) {}
  }
  var origLog = console.log, origErr = console.error, origWarn = console.warn;
  console.log = function() { sendLog('log', arguments); origLog.apply(console, arguments); };
  console.error = function() { sendLog('error', arguments); origErr.apply(console, arguments); };
  console.warn = function() { sendLog('warn', arguments); origWarn.apply(console, arguments); };
  window.onerror = function(msg, url, line) {
    sendLog('error', [msg + ' (' + url + ':' + line + ')']);
  };
})();
</script>`

    if (raw.includes("<head>")) {
      return raw.replace("<head>", `<head>${consoleInterceptor}`)
    }
    return consoleInterceptor + raw
  })

  const openInNewTab = () => {
    if (mode() === "server") {
      window.open(serverUrl(), "_blank")
    } else {
      const blob = new Blob([fileContent()], { type: "text/html" })
      const blobUrl = URL.createObjectURL(blob)
      window.open(blobUrl, "_blank")
    }
  }

  return (
    <div class="flex flex-col size-full min-h-0 bg-zinc-950 text-zinc-100 select-none overflow-hidden">
      {/* ── Toolbar ────────────────────────────────────────── */}
      <div class="h-11 px-3 border-b border-zinc-800/80 bg-zinc-900/70 flex items-center justify-between gap-2 shrink-0">
        {/* Left: Mode toggle & Target Selector */}
        <div class="flex items-center gap-1.5 min-w-0">
          <div class="flex bg-zinc-800/80 p-0.5 rounded-md text-xs font-medium border border-zinc-700/50">
            <button
              type="button"
              onClick={() => setMode("file")}
              class="px-2.5 py-1 rounded transition-colors"
              classList={{
                "bg-zinc-700 text-white shadow-sm": mode() === "file",
                "text-zinc-400 hover:text-zinc-200": mode() !== "file",
              }}
            >
              📄 파일
            </button>
            <button
              type="button"
              onClick={() => setMode("server")}
              class="px-2.5 py-1 rounded transition-colors"
              classList={{
                "bg-zinc-700 text-white shadow-sm": mode() === "server",
                "text-zinc-400 hover:text-zinc-200": mode() !== "server",
              }}
            >
              🌐 서버
            </button>
          </div>

          <Show
            when={mode() === "file"}
            fallback={
              <div class="flex items-center gap-1">
                <input
                  type="text"
                  value={serverInput()}
                  onInput={(e) => setServerInput(e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setServerUrl(serverInput())
                  }}
                  placeholder="http://localhost:5173"
                  class="h-7 px-2.5 text-xs bg-zinc-950 border border-zinc-700/70 rounded text-zinc-200 focus:outline-none focus:border-blue-500 w-44"
                />
                <button
                  type="button"
                  onClick={() => setServerUrl(serverInput())}
                  class="h-7 px-2 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors"
                >
                  연결
                </button>
                <div class="flex items-center gap-0.5 ml-1">
                  <For each={["5173", "3000", "8080"]}>
                    {(port) => (
                      <button
                        type="button"
                        onClick={() => {
                          const url = `http://localhost:${port}`
                          setServerInput(url)
                          setServerUrl(url)
                        }}
                        class="text-[10px] px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded"
                      >
                        :{port}
                      </button>
                    )}
                  </For>
                </div>
              </div>
            }
          >
            <div class="relative flex items-center">
              <select
                value={selectedFile()}
                onChange={(e) => setSelectedFile(e.currentTarget.value)}
                class="h-7 pl-2.5 pr-7 text-xs bg-zinc-950 border border-zinc-700/70 rounded text-zinc-200 focus:outline-none focus:border-blue-500 appearance-none max-w-[200px] truncate"
              >
                <Show when={previewableFiles().length === 0}>
                  <option value={selectedFile() || "index.html"}>{selectedFile() || "index.html"}</option>
                </Show>
                <For each={previewableFiles()}>
                  {(f) => (
                    <option value={f}>
                      {f} {changedFiles().includes(f) ? "•" : ""}
                    </option>
                  )}
                </For>
              </select>
              <div class="pointer-events-none absolute right-2 text-zinc-400">
                <Icon name="chevron-down" size="small" />
              </div>
            </div>
          </Show>

          <div class="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-[11px] font-medium shrink-0">
            <span class="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </div>
        </div>

        {/* Center: Device Viewport Controls */}
        <div class="flex items-center bg-zinc-800/80 p-0.5 rounded-md border border-zinc-700/50">
          <button
            type="button"
            title="데스크톱 (100%)"
            onClick={() => setViewport("desktop")}
            class="px-2 py-1 text-xs rounded transition-colors flex items-center gap-1"
            classList={{
              "bg-zinc-700 text-white font-medium": viewport() === "desktop",
              "text-zinc-400 hover:text-zinc-200": viewport() !== "desktop",
            }}
          >
            🖥️ <span class="hidden sm:inline">데스크톱</span>
          </button>
          <button
            type="button"
            title="태블릿 (768px)"
            onClick={() => setViewport("tablet")}
            class="px-2 py-1 text-xs rounded transition-colors flex items-center gap-1"
            classList={{
              "bg-zinc-700 text-white font-medium": viewport() === "tablet",
              "text-zinc-400 hover:text-zinc-200": viewport() !== "tablet",
            }}
          >
            💻 <span class="hidden sm:inline">태블릿</span>
          </button>
          <button
            type="button"
            title="모바일 (375px)"
            onClick={() => setViewport("mobile")}
            class="px-2 py-1 text-xs rounded transition-colors flex items-center gap-1"
            classList={{
              "bg-zinc-700 text-white font-medium": viewport() === "mobile",
              "text-zinc-400 hover:text-zinc-200": viewport() !== "mobile",
            }}
          >
            📱 <span class="hidden sm:inline">모바일</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div class="flex items-center gap-1 shrink-0">
          <button
            type="button"
            title={splitView() ? "전체 미리보기로 전환" : "코드와 나란히 분할 보기"}
            onClick={() => setSplitView((v) => !v)}
            class="h-7 px-2 rounded text-xs border border-zinc-700/60 transition-colors flex items-center gap-1"
            classList={{
              "bg-blue-600/30 border-blue-500/60 text-blue-300": splitView(),
              "bg-zinc-800 text-zinc-300 hover:bg-zinc-700": !splitView(),
            }}
          >
            ◫ <span class="hidden md:inline">분할</span>
          </button>

          <button
            type="button"
            title="새로고침"
            onClick={() => setRefreshKey((k) => k + 1)}
            class="size-7 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/60 text-zinc-300 flex items-center justify-center transition-colors text-xs"
          >
            ⟳
          </button>

          <button
            type="button"
            title="새 브라우저 탭에서 열기"
            onClick={openInNewTab}
            class="size-7 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/60 text-zinc-300 flex items-center justify-center transition-colors text-xs"
          >
            ↗
          </button>

          <button
            type="button"
            title="콘솔 로그"
            onClick={() => setShowConsole((v) => !v)}
            class="h-7 px-2 rounded text-xs border border-zinc-700/60 flex items-center gap-1 transition-colors"
            classList={{
              "bg-zinc-700 text-white": showConsole(),
              "bg-zinc-800 text-zinc-400 hover:bg-zinc-700": !showConsole(),
            }}
          >
            🪵 {consoleLogs().length > 0 && <span class="text-[10px] text-amber-400 font-bold">{consoleLogs().length}</span>}
          </button>
        </div>
      </div>

      {/* ── Main Canvas (Split or Single) ────────────────── */}
      <div class="flex-1 min-h-0 relative flex overflow-hidden bg-zinc-950">
        <Show when={splitView()}>
          <div class="w-1/2 h-full border-r border-zinc-800 flex flex-col bg-zinc-900/60 overflow-hidden shrink-0">
            <div class="h-8 px-3 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between text-xs text-zinc-400">
              <span class="font-mono truncate">{selectedFile()}</span>
              <span class="text-[11px] text-zinc-500">코드 뷰</span>
            </div>
            <div class="flex-1 overflow-auto p-3 font-mono text-xs text-zinc-200 whitespace-pre leading-relaxed select-text">
              {fileContent() || "내용이 비어 있습니다."}
            </div>
          </div>
        </Show>

        <div class="flex-1 h-full min-h-0 flex flex-col items-center justify-center p-2 sm:p-4 overflow-auto bg-zinc-950/80">
          <Show when={error()}>
            <div class="p-6 max-w-md bg-zinc-900 border border-red-900/50 rounded-xl text-center shadow-2xl">
              <div class="text-3xl mb-2">⚠️</div>
              <div class="text-sm font-semibold text-red-400 mb-1">미리보기를 불러올 수 없습니다</div>
              <div class="text-xs text-zinc-400 mb-4">{error()}</div>
              <button
                type="button"
                onClick={() => setRefreshKey((k) => k + 1)}
                class="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-md transition-colors"
              >
                다시 시도
              </button>
            </div>
          </Show>

          <Show when={!error()}>
            <div
              class="transition-all duration-300 ease-out flex flex-col items-center justify-center overflow-hidden"
              classList={{
                "size-full": viewport() === "desktop",
                "w-[768px] h-[95%] max-w-full rounded-xl border border-zinc-700 shadow-2xl bg-white":
                  viewport() === "tablet",
                "w-[375px] h-[680px] max-w-full rounded-[40px] border-[8px] border-zinc-800 shadow-2xl bg-white relative":
                  viewport() === "mobile",
              }}
            >
              <Show when={viewport() === "mobile"}>
                <div class="w-28 h-4 bg-zinc-800 rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                  <div class="size-2 rounded-full bg-zinc-900 mr-2" />
                  <div class="w-6 h-1 rounded-full bg-zinc-900" />
                </div>
              </Show>

              <iframe
                ref={iframeRef}
                key={`${refreshKey()}-${mode()}-${selectedFile()}-${serverUrl()}`}
                src={mode() === "server" ? serverUrl() : undefined}
                srcdoc={mode() === "file" ? bundledHtml() : undefined}
                sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
                class="size-full border-0 bg-white"
                title="AI Studio Live Preview"
              />
            </div>
          </Show>
        </div>
      </div>

      {/* ── Console Drawer ─────────────────────────────────── */}
      <Show when={showConsole()}>
        <div class="h-44 border-t border-zinc-800 bg-zinc-900 flex flex-col shrink-0 font-mono text-xs">
          <div class="h-7 px-3 bg-zinc-800/80 border-b border-zinc-700/50 flex items-center justify-between text-zinc-300 select-none">
            <span class="font-semibold text-[11px] flex items-center gap-1.5">
              <span>🖥️ 콘솔 로그</span>
              <span class="text-zinc-500 font-normal">({consoleLogs().length})</span>
            </span>
            <div class="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setConsoleLogs([])}
                class="text-[11px] text-zinc-400 hover:text-zinc-200"
              >
                지우기
              </button>
              <button
                type="button"
                onClick={() => setShowConsole(false)}
                class="text-zinc-400 hover:text-zinc-200 text-xs"
              >
                ✕
              </button>
            </div>
          </div>
          <div class="flex-1 overflow-auto p-2 space-y-1 select-text">
            <Show when={consoleLogs().length === 0}>
              <div class="text-zinc-500 italic px-1">기록된 콘솔 출력이 없습니다.</div>
            </Show>
            <For each={consoleLogs()}>
              {(log) => (
                <div
                  class="px-2 py-0.5 rounded flex items-start gap-2 text-[11px]"
                  classList={{
                    "text-red-400 bg-red-950/30": log.type === "error",
                    "text-amber-400 bg-amber-950/30": log.type === "warn",
                    "text-zinc-300": log.type === "log",
                  }}
                >
                  <span class="text-zinc-500 text-[10px] shrink-0 select-none">{log.time}</span>
                  <span class="shrink-0 font-bold">[{log.type.toUpperCase()}]</span>
                  <span class="break-all font-mono">{log.msg}</span>
                </div>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  )
}
