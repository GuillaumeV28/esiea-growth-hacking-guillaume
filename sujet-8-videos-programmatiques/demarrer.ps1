$ErrorActionPreference='Stop'
Set-Location -LiteralPath $PSScriptRoot
$pythonSujet8=$null
$pySujet8=Get-Command py -ErrorAction SilentlyContinue
if($pySujet8){$pythonSujet8=(& $pySujet8.Source -3 -c 'import sys; print(sys.executable)' 2>$null)}
if(-not $pythonSujet8){
 $codexPythonSujet8=Get-ChildItem -Path 'C:\Program Files\WindowsApps\OpenAI.CodexPrimaryRuntime*\dependencies\python\python.exe' -ErrorAction SilentlyContinue | Sort-Object FullName -Descending | Select-Object -First 1
 if($codexPythonSujet8){$pythonSujet8=$codexPythonSujet8.FullName}
}
if(-not $pythonSujet8){Write-Host 'Installer Python 3.11 ou plus depuis https://www.python.org/downloads/windows/ puis relancer.';exit 1}
if(-not(Test-Path -LiteralPath '.venv\Scripts\python.exe')){
 & $pythonSujet8 -m venv .venv
 if($LASTEXITCODE -ne 0){throw 'Installation Python impossible.'}
 & '.\.venv\Scripts\python.exe' -m pip install -r requirements.txt
 if($LASTEXITCODE -ne 0){throw 'Installation des composants impossible. Vérifier Internet.'}
}
if(-not(Test-Path -LiteralPath 'configuration_privee.json')){Write-Host 'Depuis le tableau : Vidéos IA > Connexions privées > Télécharger la connexion du moteur. Placer configuration_privee.json dans ce dossier.';exit 1}
& '.\.venv\Scripts\python.exe' -X utf8 moteur.py
