param([Parameter(Mandatory=$true)][string]$Texte,[Parameter(Mandatory=$true)][string]$Sortie)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Speech
$voixSujet8 = New-Object System.Speech.Synthesis.SpeechSynthesizer
try {
 $listeSujet8 = @($voixSujet8.GetInstalledVoices() | Where-Object {$_.Enabled -and $_.VoiceInfo.Culture.Name -like 'fr-*'})
 if ($listeSujet8.Count -eq 0) { throw 'Aucune voix française Windows. Installer une voix française dans Paramètres > Langue et région > Français > Options linguistiques > Voix.' }
 $choixSujet8 = $listeSujet8 | Where-Object {$_.VoiceInfo.Name -eq 'Microsoft Paul'} | Select-Object -First 1
 if ($null -eq $choixSujet8) { $choixSujet8 = $listeSujet8[0] }
 $voixSujet8.SelectVoice($choixSujet8.VoiceInfo.Name)
 $voixSujet8.Rate=0
 $voixSujet8.SetOutputToWaveFile($Sortie)
 $voixSujet8.Speak([IO.File]::ReadAllText($Texte,[Text.Encoding]::UTF8))
} finally { $voixSujet8.Dispose() }
