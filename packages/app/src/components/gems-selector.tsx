import { createSignal, For, Show, onCleanup, type Component } from "solid-js"
import { useGems, type Gem } from "@/context/gems"

export const GemsSelector: Component = () => {
  const { gems, activeGem, setGem } = useGems()
  const [open, setOpen] = createSignal(false)
  let containerRef: HTMLDivElement | undefined

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef && !containerRef.contains(e.target as Node)) {
      setOpen(false)
    }
  }

  window.addEventListener("click", handleClickOutside)
  onCleanup(() => {
    window.removeEventListener("click", handleClickOutside)
  })

  return (
    <div ref={containerRef} class="relative inline-block text-left select-none">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        class="h-7 px-2.5 rounded-full border flex items-center gap-1.5 text-xs font-medium transition-all shadow-sm"
        style={{
          "background-color": `${activeGem().accentColor}18`,
          "border-color": `${activeGem().accentColor}55`,
          color: activeGem().accentColor,
        }}
      >
        <span class="text-sm">{activeGem().icon}</span>
        <span class="font-semibold">{activeGem().name}</span>
        <Show when={activeGem().badge}>
          <span class="text-[9px] px-1.5 py-0.2 rounded-full bg-white/10 border border-white/20">
            {activeGem().badge}
          </span>
        </Show>
        <span class="text-[10px] opacity-70">▾</span>
      </button>

      {/* Dropdown Menu */}
      <Show when={open()}>
        <div class="absolute left-0 top-full mt-1.5 w-72 p-1.5 rounded-xl border border-zinc-700/70 bg-zinc-900/95 backdrop-blur-md shadow-2xl z-50 flex flex-col gap-1">
          <div class="px-2 py-1 text-[11px] font-semibold text-zinc-400 border-b border-zinc-800 flex items-center justify-between">
            <span>💎 재미나이 잼스 & 오팔 (Gems)</span>
            <span class="text-[9px] text-purple-400 font-mono">Gemini Powered</span>
          </div>

          <div class="max-h-80 overflow-y-auto space-y-1 py-1">
            <For each={gems}>
              {(gem) => {
                const isSelected = () => gem.id === activeGem().id
                return (
                  <button
                    type="button"
                    onClick={() => {
                      setGem(gem.id)
                      setOpen(false)
                    }}
                    class="w-full text-left p-2 rounded-lg transition-colors flex items-start gap-2.5"
                    classList={{
                      "bg-zinc-800/80 border border-zinc-700/60 shadow-sm": isSelected(),
                      "hover:bg-zinc-800/40 border border-transparent": !isSelected(),
                    }}
                  >
                    <span class="text-xl shrink-0 mt-0.5">{gem.icon}</span>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-1.5">
                        <span class="text-xs font-semibold text-zinc-100">{gem.name}</span>
                        <Show when={gem.badge}>
                          <span
                            class="text-[9px] px-1 py-0.2 rounded font-medium text-white"
                            style={{ "background-color": gem.accentColor }}
                          >
                            {gem.badge}
                          </span>
                        </Show>
                      </div>
                      <div class="text-[11px] text-zinc-400 leading-snug mt-0.5 line-clamp-2">
                        {gem.description}
                      </div>
                    </div>
                  </button>
                )
              }}
            </For>
          </div>
        </div>
      </Show>
    </div>
  )
}
