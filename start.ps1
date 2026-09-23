param(
    [ValidateRange(1, 65535)][int]$Port = 8000,
    [string]$ListenAddress = '127.0.0.1'
)
$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
$phpExecutable = $env:PHP_BINARY
if (-not $phpExecutable) {
    $localPhp = Join-Path $projectRoot '.tools\php\php.exe'
    if (Test-Path -LiteralPath $localPhp) { $phpExecutable = $localPhp }
    else {
        $phpCommand = Get-Command php -ErrorAction SilentlyContinue
        if ($phpCommand) { $phpExecutable = $phpCommand.Source }
        elseif (Test-Path -LiteralPath 'C:\xampp\php\php.exe') { $phpExecutable = 'C:\xampp\php\php.exe' }
        else { throw 'PHP not found. Install PHP 8 with pdo_sqlite, or set PHP_BINARY to php.exe.' }
    }
}
Push-Location -LiteralPath $projectRoot
try {
    $phpModules = & $phpExecutable -m
    if ($LASTEXITCODE -ne 0 -or $phpModules -notcontains 'pdo_sqlite') { throw 'Enable pdo_sqlite in php.ini.' }
    & $phpExecutable seed.php
    if ($LASTEXITCODE -ne 0) { throw 'Database initialization failed.' }
    Write-Host "AI Sana: http://${ListenAddress}:$Port/  (Ctrl+C to stop)"
    & $phpExecutable -S "${ListenAddress}:$Port" -t $projectRoot (Join-Path $projectRoot 'router.php')
    if ($LASTEXITCODE -ne 0) { throw 'PHP server stopped with an error. Check whether the port is already in use.' }
}
finally { Pop-Location }
