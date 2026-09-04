Set ws = CreateObject("WScript.Shell")
desktop = ws.SpecialFolders("Desktop")
Set sc = ws.CreateShortcut(desktop & "\WaffleCode.lnk")
sc.TargetPath = ws.ExpandEnvironmentStrings("%LocalAppData%\Programs\WaffleCode\WaffleCode.exe")
sc.WorkingDirectory = ws.ExpandEnvironmentStrings("%LocalAppData%\Programs\WaffleCode")
sc.IconLocation = ws.ExpandEnvironmentStrings("%LocalAppData%\Programs\WaffleCode\WaffleCode.exe,0")
sc.Description = "WaffleCode AI Coding Editor"
sc.Save
