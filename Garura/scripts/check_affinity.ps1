
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class Win32 {
    [DllImport("user32.dll")]
    public static extern bool EnumWindows(EnumWindowsProc enumProc, IntPtr lParam);
    [DllImport("user32.dll")]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool IsWindowVisible(IntPtr hWnd);
    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool GetWindowDisplayAffinity(IntPtr hWnd, out uint pdwAffinity);
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);
    public const uint WDA_EXCLUDEFROMCAPTURE = 0x00000011;
}
"@


$foundProtectedWindow = $false
$enumCallback = {
    param($hWnd, $lParam)
    if ([Win32]::IsWindowVisible($hWnd)) {
        $affinity = 0
        [Win32]::GetWindowDisplayAffinity($hWnd, [ref]$affinity) | Out-Null
        if ($affinity -eq [Win32]::WDA_EXCLUDEFROMCAPTURE) {
            $script:foundProtectedWindow = $true
            return $false
        }
    }
    return $true 
}

$null = [Win32]::EnumWindows($enumCallback, [IntPtr]::Zero)
Write-Output $foundProtectedWindow.ToString().ToLower()