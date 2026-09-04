#!/usr/bin/env bash
set -e

echo "=================================================="
echo "  🧇 WaffleCode Installer (Official Script)"
echo "  바삭하게 구워내는 AI 코딩 환경 WaffleCode"
echo "=================================================="

OS="$(uname -s)"
ARCH="$(uname -m)"
REPO="gubin0425a-creator/WaffleCode"
VERSION="v1.0.0"

echo "[1/3] 운영체제 감지: $OS ($ARCH)"

case "$OS" in
  Linux*)
    FILE="WaffleCode-1.0.0.AppImage"
    URL="https://github.com/$REPO/releases/download/$VERSION/$FILE"
    DEST="$HOME/.local/bin/wafflecode"
    mkdir -p "$HOME/.local/bin"
    echo "[2/3] $FILE 다운로드 중..."
    curl -fsSL "$URL" -o "$DEST" || {
      echo "⚠️ 릴리스 바이너리가 준비 중입니다. 소스코드로 클론합니다..."
      git clone "https://github.com/$REPO.git" "$HOME/WaffleCode"
      exit 0
    }
    chmod +x "$DEST"
    echo "[3/3] 설치 완료! 터미널에서 'wafflecode'를 실행하세요."
    ;;
  Darwin*)
    FILE="WaffleCode-1.0.0.dmg"
    URL="https://github.com/$REPO/releases/download/$VERSION/$FILE"
    DEST="/tmp/$FILE"
    echo "[2/3] macOS DMG 다운로드 중..."
    curl -fsSL "$URL" -o "$DEST" || {
      echo "⚠️ 릴리스 바이너리가 준비 중입니다. 소스코드로 클론합니다..."
      git clone "https://github.com/$REPO.git" "$HOME/WaffleCode"
      exit 0
    }
    echo "[3/3] DMG 마운트 중..."
    hdiutil attach "$DEST"
    echo "설치 이미지가 열렸습니다. Applications 폴더로 끌어다 놓으세요."
    ;;
  MINGW*|MSYS*|CYGWIN*)
    FILE="WaffleCode-Setup-1.0.0.exe"
    URL="https://github.com/$REPO/raw/main/installer/$FILE"
    DEST="/tmp/$FILE"
    echo "[2/3] Windows 인스톨러 다운로드 중..."
    curl -fsSL "$URL" -o "$DEST"
    echo "[3/3] 설치 프로그램 실행 중..."
    cmd.exe /c "$DEST"
    ;;
  *)
    echo "알 수 없는 운영체제입니다. GitHub 저장소에서 수동 설치해주세요:"
    echo "https://github.com/$REPO"
    exit 1
    ;;
esac
