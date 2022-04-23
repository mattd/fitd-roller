# Blades in the Dark Roller

A dice roller for Blades in the Dark games in FoundryVTT, based on code by Megastruktur.

## Usage

This module adds a roll icon at the bottom of the taskbar. Pick your dice pool, action, position, effect - and roll!

There are module settings for controlling:

* the max number of dice
* the default number of dice initially selected
* the default position initially selected
* the default effect initially selected

Alternatively, you can set up macros and skip the popup UI altogether. (Thanks to Thune#3566 for this idea and the idea for the entire module!)

`game.bitdroller.BitDRoller("attribute", dice, "position", "effect")`

* `attribute`: any string of your choosing (defaults to "")
* `dice`: total number of dice to roll (defaults to 0)
* `position`: either controlled, risky, or desperate (defaults to risky if you enter anything else)
* `effect`: either great, standard, or limited (defaults to standard if you enter anything else)

Based on concepts from Blades in the Dark (found at http://www.bladesinthedark.com/), product of One Seven Design, developed and authored by John Harper, and licensed for use under the Creative Commons Attribution 3.0 Unported license (http://creativecommons.org/licenses/by/3.0/).
