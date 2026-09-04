using System;
using System.Drawing;
using System.IO;
using System.Threading;
using System.Windows.Forms;
using Microsoft.Win32;

namespace WaffleCodeInstaller
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new InstallerForm());
        }
    }

    public class InstallerForm : Form
    {
        private ProgressBar progressBar;
        private Label lblStatus;
        private CheckBox chkDisclaimer;
        private CheckBox chkShortcut;
        private CheckBox chkProtocol;
        private Button btnInstall;
        private Label lblHeader;
        private Label lblSub;

        public InstallerForm()
        {
            this.Text = "WaffleCode v1.0.0 설치 프로그램 (Setup)";
            this.Size = new Size(520, 420);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.BackColor = Color.FromArgb(247, 247, 244);

            lblHeader = new Label
            {
                Text = "🧇 WaffleCode v1.0.0",
                Font = new Font("Segoe UI", 18, FontStyle.Bold),
                ForeColor = Color.FromArgb(245, 78, 0),
                Location = new Point(24, 20),
                AutoSize = true
            };
            this.Controls.Add(lblHeader);

            lblSub = new Label
            {
                Text = "바삭하게 구워내는 AI 코딩 환경 설치를 시작합니다.",
                Font = new Font("Segoe UI", 10, FontStyle.Regular),
                ForeColor = Color.FromArgb(74, 73, 66),
                Location = new Point(26, 56),
                AutoSize = true
            };
            this.Controls.Add(lblSub);

            Panel line = new Panel
            {
                Location = new Point(24, 88),
                Size = new Size(456, 1),
                BackColor = Color.FromArgb(228, 228, 222)
            };
            this.Controls.Add(line);

            TextBox txtDisclaimer = new TextBox
            {
                Location = new Point(24, 100),
                Size = new Size(456, 90),
                Multiline = true,
                ReadOnly = true,
                ScrollBars = ScrollBars.Vertical,
                Font = new Font("Segoe UI", 8.5f),
                BackColor = Color.FromArgb(255, 255, 255),
                Text = "[법적 면책 조항 (Limitation of Liability)]\r\n" +
                       "개발자 및 기여자는 본 프로그램(WaffleCode)의 다운로드, 설치, 실행, 시스템 명령어 자율 수행, 원격 제어 및 수정·배포로 인해 발생하는 그 어떠한 직·간접적 손해, 데이터 유실, 시스템 장애, 금전적 손실, 보안 사고에 대해서도 일체의 법적·도의적 책임을 지지 않습니다.\r\n" +
                       "모든 실행 권한 부여와 결과는 전적으로 사용자 본인의 책임입니다. (MIT License)"
            };
            this.Controls.Add(txtDisclaimer);

            chkDisclaimer = new CheckBox
            {
                Text = "위 법적 면책 조항 및 책임의 한계에 전적으로 동의합니다. (필수)",
                Location = new Point(24, 200),
                AutoSize = true,
                Font = new Font("Segoe UI", 9, FontStyle.Bold),
                ForeColor = Color.FromArgb(38, 37, 30),
                Checked = true
            };
            chkDisclaimer.CheckedChanged += (s, e) => { btnInstall.Enabled = chkDisclaimer.Checked; };
            this.Controls.Add(chkDisclaimer);

            chkShortcut = new CheckBox
            {
                Text = "바탕화면에 WaffleCode 바로가기 생성",
                Location = new Point(24, 230),
                AutoSize = true,
                Font = new Font("Segoe UI", 9),
                Checked = true
            };
            this.Controls.Add(chkShortcut);

            chkProtocol = new CheckBox
            {
                Text = "wafflecode:// 프로토콜 등록 (GitHub '와플코드로 열기' 연동)",
                Location = new Point(24, 255),
                AutoSize = true,
                Font = new Font("Segoe UI", 9),
                Checked = true
            };
            this.Controls.Add(chkProtocol);

            progressBar = new ProgressBar
            {
                Location = new Point(24, 290),
                Size = new Size(456, 20),
                Visible = false
            };
            this.Controls.Add(progressBar);

            lblStatus = new Label
            {
                Location = new Point(24, 318),
                Size = new Size(456, 20),
                Font = new Font("Segoe UI", 8.5f),
                ForeColor = Color.FromArgb(120, 119, 112),
                Text = "설치 준비 완료 - [지금 설치] 버튼을 눌러주세요."
            };
            this.Controls.Add(lblStatus);

            btnInstall = new Button
            {
                Text = "지금 설치하기 (Install)",
                Location = new Point(310, 335),
                Size = new Size(170, 36),
                BackColor = Color.FromArgb(245, 78, 0),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Font = new Font("Segoe UI", 9.5f, FontStyle.Bold),
                Cursor = Cursors.Hand
            };
            btnInstall.FlatAppearance.BorderSize = 0;
            btnInstall.Click += StartInstallation;
            this.Controls.Add(btnInstall);
        }

        private void StartInstallation(object sender, EventArgs e)
        {
            if (!chkDisclaimer.Checked)
            {
                MessageBox.Show("면책 조항에 동의하셔야 설치를 진행할 수 있습니다.", "알림", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            btnInstall.Enabled = false;
            chkDisclaimer.Enabled = false;
            chkShortcut.Enabled = false;
            chkProtocol.Enabled = false;
            progressBar.Visible = true;
            progressBar.Style = ProgressBarStyle.Marquee;

            Thread worker = new Thread(DoInstall);
            worker.IsBackground = true;
            worker.Start();
        }

        private void DoInstall()
        {
            try
            {
                UpdateStatus("설치 파일 추출 및 배포 중...");
                string localApp = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
                string installDir = Path.Combine(localApp, "Programs", "WaffleCode");
                if (!Directory.Exists(installDir)) Directory.CreateDirectory(installDir);

                string targetExe = Path.Combine(installDir, "WaffleCode.exe");
                string targetIco = Path.Combine(installDir, "icon.ico");

                try
                {
                    using (Stream s = System.Reflection.Assembly.GetExecutingAssembly().GetManifestResourceStream("WaffleCode.exe"))
                    {
                        if (s != null)
                        {
                            using (FileStream fs = new FileStream(targetExe, FileMode.Create))
                            {
                                s.CopyTo(fs);
                            }
                        }
                    }
                    using (Stream s = System.Reflection.Assembly.GetExecutingAssembly().GetManifestResourceStream("icon.ico"))
                    {
                        if (s != null)
                        {
                            using (FileStream fs = new FileStream(targetIco, FileMode.Create))
                            {
                                s.CopyTo(fs);
                            }
                        }
                    }
                }
                catch { }

                Thread.Sleep(500);

                if (chkProtocol.Checked)
                {
                    UpdateStatus("wafflecode:// 프로토콜 레지스트리 등록 중...");
                    RegisterProtocol(installDir);
                }

                Thread.Sleep(400);

                if (chkShortcut.Checked)
                {
                    UpdateStatus("바탕화면 및 시작 메뉴 바로가기 생성 중...");
                    CreateShortcuts(installDir);
                }

                Thread.Sleep(500);
                UpdateStatus("설치가 성공적으로 완료되었습니다! ✓");

                this.Invoke((MethodInvoker)delegate
                {
                    progressBar.Style = ProgressBarStyle.Continuous;
                    progressBar.Value = 100;
                    btnInstall.Text = "WaffleCode 실행하기";
                    btnInstall.BackColor = Color.FromArgb(46, 125, 50);
                    btnInstall.Enabled = true;
                    btnInstall.Click -= StartInstallation;
                    btnInstall.Click += (s, e) =>
                    {
                        try { System.Diagnostics.Process.Start(targetExe); } catch { }
                        this.Close();
                    };
                    MessageBox.Show("WaffleCode v1.0.0 설치가 완료되었습니다!\n\n바탕화면에 'WaffleCode' 바로가기가 생성되었습니다.", "설치 완료", MessageBoxButtons.OK, MessageBoxIcon.Information);
                });
            }
            catch (Exception ex)
            {
                this.Invoke((MethodInvoker)delegate
                {
                    progressBar.Visible = false;
                    btnInstall.Enabled = true;
                    MessageBox.Show("설치 중 오류가 발생했습니다: " + ex.Message, "오류", MessageBoxButtons.OK, MessageBoxIcon.Error);
                });
            }
        }

        private void UpdateStatus(string text)
        {
            this.Invoke((MethodInvoker)delegate { lblStatus.Text = text; });
        }

        private void RegisterProtocol(string installDir)
        {
            string appPath = Path.Combine(installDir, "WaffleCode.exe");
            using (RegistryKey key = Registry.CurrentUser.CreateSubKey(@"Software\Classes\wafflecode"))
            {
                key.SetValue("", "URL:WaffleCode Protocol");
                key.SetValue("URL Protocol", "");
                using (RegistryKey defaultIcon = key.CreateSubKey("DefaultIcon"))
                {
                    defaultIcon.SetValue("", appPath + ",1");
                }
                using (RegistryKey shell = key.CreateSubKey(@"shell\open\command"))
                {
                    shell.SetValue("", "\"" + appPath + "\" \"%1\"");
                }
            }
        }

        private void CreateShortcuts(string installDir)
        {
            string desktop = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
            string startMenu = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.StartMenu), "Programs");
            string appPath = Path.Combine(installDir, "WaffleCode.exe");

            string script = string.Format(
                "Set oWS = WScript.CreateObject(\"WScript.Shell\")\r\n" +
                "Set oLink = oWS.CreateShortcut(\"{0}\")\r\n" +
                "oLink.TargetPath = \"{1}\"\r\n" +
                "oLink.WorkingDirectory = \"{2}\"\r\n" +
                "oLink.IconLocation = \"{1},0\"\r\n" +
                "oLink.Description = \"WaffleCode AI Coding Assistant\"\r\n" +
                "oLink.Save\r\n",
                Path.Combine(desktop, "WaffleCode.lnk"), appPath, installDir);

            string vbs = Path.Combine(Path.GetTempPath(), "create_shortcut.vbs");
            File.WriteAllText(vbs, script);
            try
            {
                System.Diagnostics.Process.Start("cscript.exe", "//Nologo \"" + vbs + "\"").WaitForExit();
            }
            finally
            {
                if (File.Exists(vbs)) File.Delete(vbs);
            }
        }
    }
}
