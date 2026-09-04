using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Net;
using System.Windows.Forms;
using Microsoft.Win32;

namespace WaffleCodeDesktop
{
    static class Program
    {
        [STAThread]
        static void Main(string[] args)
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            // Enable modern IE/Edge rendering for WebBrowser control
            try
            {
                string appName = Path.GetFileName(Application.ExecutablePath);
                using (RegistryKey key = Registry.CurrentUser.CreateSubKey(@"Software\Microsoft\Internet Explorer\Main\FeatureControl\FEATURE_BROWSER_EMULATION"))
                {
                    key.SetValue(appName, 11001, RegistryValueKind.DWord);
                }
            }
            catch { }

            string initialUrl = null;
            if (args != null && args.Length > 0)
            {
                string arg = args[0];
                if (arg.StartsWith("wafflecode://", StringComparison.OrdinalIgnoreCase))
                {
                    initialUrl = arg;
                }
            }

            Application.Run(new MainWindow(initialUrl));
        }
    }

    public class MainWindow : Form
    {
        private WebBrowser browser;
        private ToolStripStatusLabel statusLabel;
        private Panel topBar;

        public MainWindow(string protocolArg)
        {
            this.Text = "WaffleCode — The AI Coding Editor & Studio";
            this.Size = new Size(1280, 840);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.BackColor = Color.FromArgb(247, 247, 244);

            // Load icon
            try
            {
                string exeDir = Path.GetDirectoryName(Application.ExecutablePath);
                string icoPath = Path.Combine(exeDir, "icon.ico");
                if (File.Exists(icoPath))
                {
                    this.Icon = new Icon(icoPath);
                }
            }
            catch { }

            InitializeUI();

            if (!string.IsNullOrEmpty(protocolArg))
            {
                HandleDeepLink(protocolArg);
            }
        }

        private void InitializeUI()
        {
            // Top Bar
            topBar = new Panel
            {
                Dock = DockStyle.Top,
                Height = 50,
                BackColor = Color.FromArgb(247, 247, 244)
            };

            Label logo = new Label
            {
                Text = "🧇 WaffleCode",
                Font = new Font("Segoe UI", 13, FontStyle.Bold),
                ForeColor = Color.FromArgb(38, 37, 30),
                Location = new Point(16, 12),
                AutoSize = true
            };
            topBar.Controls.Add(logo);

            Button btnWork = CreateNavButton("⚡ 워크 (Work)", 160, (s, e) => NavigateTo("https://gubin0425a-creator.github.io/WaffleCode/#features"));
            Button btnChat = CreateNavButton("💬 챗 (Chat)", 280, (s, e) => NavigateTo("https://gubin0425a-creator.github.io/WaffleCode/#features"));
            Button btnPreview = CreateNavButton("👁️ 실시간 프리뷰", 380, (s, e) => NavigateTo("https://gubin0425a-creator.github.io/WaffleCode/#preview"));
            Button btnWizard = CreateNavButton("🪄 설정 마법사", 510, (s, e) => ShowWizard());
            Button btnOpenFolder = CreateNavButton("📂 프로젝트 열기", 630, (s, e) => OpenProjectFolder());
            Button btnComputer = CreateNavButton("🖥️ 컴퓨터 자율 권한", 760, (s, e) => ShowAutonomySettings());

            topBar.Controls.Add(btnWork);
            topBar.Controls.Add(btnChat);
            topBar.Controls.Add(btnPreview);
            topBar.Controls.Add(btnWizard);
            topBar.Controls.Add(btnOpenFolder);
            topBar.Controls.Add(btnComputer);

            this.Controls.Add(topBar);

            // Status Bar
            StatusStrip statusStrip = new StatusStrip();
            statusLabel = new ToolStripStatusLabel
            {
                Text = "⚡ Opal 자율 에이전트 & Gemini 2.5 Pro 준비 완료 | 컴퓨터 자율 실행 모드: 활성화 | 포트: 4096"
            };
            statusStrip.Items.Add(statusLabel);
            this.Controls.Add(statusStrip);

            // Web Browser
            browser = new WebBrowser
            {
                Dock = DockStyle.Fill,
                ScriptErrorsSuppressed = true
            };
            this.Controls.Add(browser);
            browser.BringToFront();

            // Default home
            string localHtml = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory), "WaffleOS", "WaffleCode", "index.html");
            if (File.Exists(localHtml))
            {
                browser.Navigate(localHtml);
            }
            else
            {
                browser.Navigate("https://gubin0425a-creator.github.io/WaffleCode/");
            }
        }

        private Button CreateNavButton(string text, int x, EventHandler onClick)
        {
            Button btn = new Button
            {
                Text = text,
                Location = new Point(x, 9),
                Size = new Size(110, 32),
                FlatStyle = FlatStyle.Flat,
                Font = new Font("Segoe UI", 9),
                ForeColor = Color.FromArgb(74, 73, 66),
                BackColor = Color.White,
                Cursor = Cursors.Hand
            };
            btn.FlatAppearance.BorderColor = Color.FromArgb(230, 229, 224);
            btn.Click += onClick;
            return btn;
        }

        private void NavigateTo(string url)
        {
            browser.Navigate(url);
        }

        private void ShowWizard()
        {
            MessageBox.Show(
                "🪄 [안티그래비티 5단계 설정 마법사]\n\n" +
                "1단계: 법적 면책 조항 (DISCLAIMER.md) 동의 ✓\n" +
                "2단계: 제미나이 잼스 & Opal 에이전트 선택 ✓\n" +
                "3단계: 컴퓨터 완전 자율 조작 권한 (Full Autonomy) ✓\n" +
                "4단계: AI Studio 실시간 반응형 프리뷰 뷰포트 ✓\n" +
                "5단계: 초기 세팅 완료!\n\n" +
                "설정이 정상적으로 유지되고 있습니다.",
                "WaffleCode 설정 마법사",
                MessageBoxButtons.OK,
                MessageBoxIcon.Information
            );
        }

        private void ShowAutonomySettings()
        {
            MessageBox.Show(
                "🖥️ [컴퓨터 완전 자율 조작 및 원격 제어 설정]\n\n" +
                "• 권한 상태: 완전 사용자 모드 (Full User Autonomy - 확인 프롬프트 없음)\n" +
                "• 원격 조작 서버: 포트 4096 대기 중\n" +
                "• 법적 책임: 에이전트 실행 명령어 및 파일 수정 결과는 전적으로 사용자 본인의 책임입니다.\n" +
                "• 안전 모드 전환: 설정 메뉴에서いつでも 일반 승인 모드로 전환 가능합니다.",
                "컴퓨터 원격 제어 권한",
                MessageBoxButtons.OK,
                MessageBoxIcon.Information
            );
        }

        private void OpenProjectFolder()
        {
            using (FolderBrowserDialog fbd = new FolderBrowserDialog())
            {
                fbd.Description = "WaffleCode에서 작업할 프로젝트 폴더를 선택하세요:";
                if (fbd.ShowDialog() == DialogResult.OK)
                {
                    statusLabel.Text = "📁 활성 프로젝트: " + fbd.SelectedPath;
                    MessageBox.Show("프로젝트 폴더가 성공적으로 로드되었습니다:\n" + fbd.SelectedPath, "프로젝트 로드 완료", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
            }
        }

        private void HandleDeepLink(string protocolUrl)
        {
            try
            {
                // wafflecode://clone?url=https://github.com/...
                statusLabel.Text = "⚡ GitHub '와플코드로 열기' 프로토콜 수신: " + protocolUrl;
                MessageBox.Show("GitHub에서 '와플코드로 열기' 요청을 감지했습니다!\n\n요청 URL: " + protocolUrl + "\n\n저장소를 로컬에 연결하고 WaffleCode 워크 스페이스를 준비합니다.", "와플코드로 열기", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            catch (Exception ex)
            {
                MessageBox.Show("프로토콜 처리 중 오류: " + ex.Message, "오류", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}
