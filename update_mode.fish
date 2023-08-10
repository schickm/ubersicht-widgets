#!/usr/bin/env fish

echo $argv[1] > ~/.skhd_mode
osascript -e 'tell application id "tracesOf.Uebersicht" to refresh widget id "SkhdKeys-jsx"'
