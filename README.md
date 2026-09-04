<p align="center">
  <img src="packages/app/public/waffle-icon.png" width="140" alt="WaffleCode Logo" />
</p>

# 🧇 WaffleCode (와플코드)

> **바삭하게 구워내는 AI 코딩 에이전트 & 실시간 스튜디오 프리뷰**  
> AI Studio 스타일의 실시간 미리보기(Live Preview) 기능과 Codex 스타일의 워크 스트림이 결합된 차세대 AI 코딩 도구입니다.

---

### ⚠️ 법적 면책 조항 및 책임의 한계 (Disclaimer of Liability)
> **중요 고지:**  
> **본 소프트웨어(WaffleCode)의 개발자 및 기여자는 본 프로그램을 설치, 실행, 설정, 자율 조작 또는 배포하는 과정에서 발생하는 그 어떠한 직·간접적 손해, 데이터 손실, 시스템 장애, 금전적 손실, 보안 사고 및 제3자의 피해에 대해서도 어떠한 이유나 명목으로도 일체의 법적·도의적 책임을 지지 않습니다.**  
> 모든 시스템 명령어 실행, 파일 수정 및 자율 권한 부여에 따른 결과는 전적으로 사용자 본인의 책임이며, 본 소프트웨어를 사용하는 것은 이에 동의한 것으로 간주됩니다.  
> 자세한 내용은 [**DISCLAIMER.md**](./DISCLAIMER.md) 문서를 확인해 주십시오.

---

### ✨ WaffleCode 핵심 탑재 기능

1. **안티그래비티(Antigravity) 스타일 초기 설정 마법사 & 재설정 지원**
   - 첫 실행 시 면책 조항 필수 동의 ➔ 제미나이 잼스 & 오팔 엔진 선택 ➔ 컴퓨터 자율 조작 권한 ➔ 실시간 프리뷰 환경까지 5단계 마법사 진행
   - 설정 창(`Ctrl + ,`)에서 언제든지 **[🔄 초기 설정 마법사 다시 시작]** 버튼으로 처음부터 재설정 가능
2. **Codex 스타일 💬 챗 (Chat) vs ⚡ 워크 (Work) 탭 분리**
   - 대화형 타임라인(Chat)과 실시간 빌드/테스트 퀵 액션 및 파일 수정 스트림(Work)을 자유롭게 전환
3. **구글 제미나이 잼스 (Gems) & 오팔 (Opal) 탑재**
   - Opal(오팔 자율 에이전트), Gemini 2.5 Pro 코딩 전문가, Flash 초고속, Waffle Vibe 페르소나 실시간 선택
4. **🖥️ 컴퓨터 원격 조작 & 완전 사용자 자율 권한 (Full Autonomy)**
   - 실제 사람이 컴퓨터를 다루듯 확인 창 없이 파일 편집 및 쉘 실행을 자동 수행하는 완전 사용자 모드
   - 스마트폰/태블릿/원격 브라우저에서 포트(4096) 및 보안 토큰으로 WaffleCode 원격 제어 지원
5. **👁️ AI Studio 스타일 실시간 라이브 프리뷰 (Live Preview)**
   - 모바일, 태블릿, 데스크톱 반응형 뷰포트 지원 및 실시간 핫 리로드

---
<p align="center">
  <a href="https://opencode.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://www.npmjs.com/package/opencode-ai"><img alt="npm" src="https://img.shields.io/npm/v/opencode-ai?style=flat-square" /></a>
  <a href="https://github.com/anomalyco/opencode/actions/workflows/publish.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/anomalyco/opencode/publish.yml?style=flat-square&branch=dev" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.vi.md">Tiếng Việt</a>
</p>

[![OpenCode Terminal UI](packages/web/src/assets/lander/screenshot.png)](https://opencode.ai)

---

### Installation

```bash
# YOLO
curl -fsSL https://opencode.ai/install | bash

# Package managers
npm i -g opencode-ai@latest        # or bun/pnpm/yarn
scoop install opencode             # Windows
choco install opencode             # Windows
brew install anomalyco/tap/opencode # macOS and Linux (recommended, always up to date)
brew install opencode              # macOS and Linux (official brew formula, updated less)
sudo pacman -S opencode            # Arch Linux (Stable)
paru -S opencode-bin               # Arch Linux (Latest from AUR)
mise use -g opencode               # Any OS
nix run nixpkgs#opencode           # or github:anomalyco/opencode for latest dev branch
```

> [!TIP]
> Remove versions older than 0.1.x before installing.

### Desktop App (BETA)

OpenCode is also available as a desktop application. Download directly from the [releases page](https://github.com/anomalyco/opencode/releases) or [opencode.ai/download](https://opencode.ai/download).

| Platform              | Download                           |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `opencode-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `opencode-desktop-mac-x64.dmg`     |
| Windows               | `opencode-desktop-windows-x64.exe` |
| Linux                 | `.deb`, `.rpm`, or `.AppImage`     |

```bash
# macOS (Homebrew)
brew install --cask opencode-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/opencode-desktop
```

#### Installation Directory

The install script respects the following priority order for the installation path:

1. `$OPENCODE_INSTALL_DIR` - Custom installation directory
2. `$XDG_BIN_DIR` - XDG Base Directory Specification compliant path
3. `$HOME/bin` - Standard user binary directory (if it exists or can be created)
4. `$HOME/.opencode/bin` - Default fallback

```bash
# Examples
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://opencode.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://opencode.ai/install | bash
```

### Agents

OpenCode includes two built-in agents you can switch between with the `Tab` key.

- **build** - Default, full-access agent for development work
- **plan** - Read-only agent for analysis and code exploration
  - Denies file edits by default
  - Asks permission before running bash commands
  - Ideal for exploring unfamiliar codebases or planning changes

Also included is a **general** subagent for complex searches and multistep tasks.
This is used internally and can be invoked using `@general` in messages.

Learn more about [agents](https://opencode.ai/docs/agents).

### Documentation

For more info on how to configure OpenCode, [**head over to our docs**](https://opencode.ai/docs).

### Contributing

If you're interested in contributing to OpenCode, please read our [contributing docs](./CONTRIBUTING.md) before submitting a pull request.

### Building on OpenCode

If you are working on a project that's related to OpenCode and is using "opencode" as part of its name, for example "opencode-dashboard" or "opencode-mobile", please add a note to your README to clarify that it is not built by the OpenCode team and is not affiliated with us in any way.

---

**Join our community** [Discord](https://discord.gg/opencode) | [X.com](https://x.com/opencode)
