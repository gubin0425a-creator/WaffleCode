// ==UserScript==
// @name         WaffleCode for GitHub (와플코드로 열기)
// @namespace    https://github.com/gubin0425a-creator/WaffleCode
// @version      1.0.0
// @description  GitHub 저장소의 <> Code 메뉴 및 페이지 상단에 '와플코드로 열기 (Open in WaffleCode)' 버튼을 추가합니다.
// @author       WaffleCode Team
// @match        https://github.com/*/*
// @icon         https://raw.githubusercontent.com/gubin0425a-creator/WaffleCode/main/packages/app/public/waffle-icon.png
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  function getRepoUrl() {
    const match = window.location.pathname.match(/^\/([^\/]+)\/([^\/]+)/);
    if (!match) return null;
    return `https://github.com/${match[1]}/${match[2]}.git`;
  }

  function injectWaffleCodeOption() {
    const repoUrl = getRepoUrl();
    if (!repoUrl) return;

    if (document.querySelector('.wafflecode-injected')) return;

    const listItems = document.querySelectorAll('li, a, button');
    let vsCodeAnchor = null;

    for (const el of listItems) {
      const text = el.textContent || '';
      const href = el.getAttribute('href') || '';
      if (
        text.includes('Visual Studio') ||
        text.includes('Visual Studio로 열기') ||
        text.includes('Open in Visual Studio') ||
        href.startsWith('vscode://')
      ) {
        vsCodeAnchor = el.closest('li') || el;
        break;
      }
    }

    if (vsCodeAnchor && !document.querySelector('.wafflecode-clone-item')) {
      const parent = vsCodeAnchor.parentElement;
      if (parent) {
        const waffleLi = document.createElement('li');
        waffleLi.className = vsCodeAnchor.className + ' wafflecode-clone-item';
        waffleLi.style.cursor = 'pointer';

        const waffleLink = document.createElement('a');
        waffleLink.className = (vsCodeAnchor.querySelector('a')?.className || 'd-flex flex-items-center color-fg-default text-bold no-underline p-2') + ' wafflecode-injected';
        waffleLink.href = `wafflecode://clone?url=${encodeURIComponent(repoUrl)}`;
        waffleLink.style.display = 'flex';
        waffleLink.style.alignItems = 'center';
        waffleLink.style.gap = '8px';
        waffleLink.style.padding = '8px 12px';
        waffleLink.style.borderRadius = '6px';
        waffleLink.style.textDecoration = 'none';

        waffleLink.innerHTML = `
          <span style="font-size: 16px; line-height: 1;">🧇</span>
          <span style="font-weight: 600; color: #f54e00;">와플코드로 열기</span>
        `;

        waffleLi.appendChild(waffleLink);
        vsCodeAnchor.insertAdjacentElement('afterend', waffleLi);
      }
    }

    if (!document.querySelector('#wafflecode-action-button')) {
      const codeButton = document.querySelector('get-repo, button[data-testid="get-repo-button"], [data-action="click:get-repo#trigger"]')?.closest('.d-flex') ||
                         document.querySelector('#code-button')?.parentElement;

      if (codeButton && codeButton.parentElement) {
        const waffleBtn = document.createElement('a');
        waffleBtn.id = 'wafflecode-action-button';
        waffleBtn.href = `wafflecode://clone?url=${encodeURIComponent(repoUrl)}`;
        waffleBtn.className = 'btn btn-sm text-bold ml-2';
        waffleBtn.style.backgroundColor = '#f54e00';
        waffleBtn.style.color = '#ffffff';
        waffleBtn.style.borderColor = '#d04200';
        waffleBtn.style.display = 'inline-flex';
        waffleBtn.style.alignItems = 'center';
        waffleBtn.style.gap = '6px';
        waffleBtn.style.borderRadius = '6px';
        waffleBtn.style.padding = '4px 10px';
        waffleBtn.style.textDecoration = 'none';
        waffleBtn.innerHTML = `<span>🧇</span><span>와플코드로 열기</span>`;

        codeButton.parentElement.insertBefore(waffleBtn, codeButton);
      }
    }
  }

  const observer = new MutationObserver(() => {
    injectWaffleCodeOption();
  });

  observer.observe(document.body, { childList: true, subtree: true });
  injectWaffleCodeOption();
})();
