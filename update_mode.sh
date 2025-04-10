#!/usr/bin/env sh

echo "$1,$2" >~/.skhd_mode
borders active_color="0xff$2" &
osascript -e 'tell application id "tracesOf.Uebersicht" to refresh widget id "SkhdKeys-jsx"'
