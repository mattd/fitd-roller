import { FitDRoller } from './fitd-roller.js';

Hooks.once("ready", () => {
  game.fitdRoller = new FitDRoller();
});

Hooks.on("renderSceneControls", (app, html) => {
  const diceRoller = $(`
    <li class="scene-control" title="FitD Roller">
      <i class="fas fa-dice"></i>
    </li>
  `);
  diceRoller.on("click", async function () {
    await game.fitdRoller.showRoller();
  });
  if (isNewerVersion(game.version, '9.220')) {
    html.children().first().append(diceRoller);
  } else {
    html.append(diceRoller);
  }
});

Hooks.once("setup", () => {
  const defaultActions = [
    'Hunt',
    'Study',
    'Survey',
    'Tinker',
    'Finesse',
    'Prowl',
    'Skirmish',
    'Wreck',
    'Attune',
    'Command',
    'Consort',
    'Sway'
  ];

  game.settings.register("fitd-roller", "backgroundColor", {
    "name": game.i18n.localize("FitDRoller.backgroundColorName"),
    "hint": game.i18n.localize("FitDRoller.backgroundColorHint"),
    "scope": "world",
    "config": true,
    "choices": {
      "gray": game.i18n.localize("FitDRoller.backgroundColorGray"),
      "black": game.i18n.localize("FitDRoller.backgroundColorBlack")
    },
    "default": "gray",
    "type": String
  });

  game.settings.register("fitd-roller", "maxDiceCount", {
    "name": game.i18n.localize("FitDRoller.maxDiceCountName"),
    "hint": game.i18n.localize("FitDRoller.maxDiceCountHint"),
    "scope": "world",
    "config": true,
    "default": 10,
    "type": Number
  });

  game.settings.register("fitd-roller", "defaultDiceCount", {
    "name": game.i18n.localize("FitDRoller.defaultDiceCountName"),
    "hint": game.i18n.localize("FitDRoller.defaultDiceCountHint"),
    "scope": "world",
    "config": true,
    "default": 2,
    "type": Number
  });

  game.settings.register("fitd-roller", "actions", {
    "name": game.i18n.localize("FitDRoller.actionsName"),
    "hint": game.i18n.localize("FitDRoller.actionsHint"),
    "scope": "world",
    "config": true,
    "type": String,
    "default": defaultActions.map(item => {
      return game.i18n.localize(`FitDRoller.DefaultAction${item}`)
    }).join(',')
  });

  game.settings.register("fitd-roller", "defaultPosition", {
    "name": game.i18n.localize("FitDRoller.defaultPositionName"),
    "hint": game.i18n.localize("FitDRoller.defaultPositionHint"),
    "scope": "world",
    "config": true,
    "type": String,
    "choices": {
      "controlled": game.i18n.localize("FitDRoller.PositionControlled"),
      "risky": game.i18n.localize("FitDRoller.PositionRisky"),
      "desperate": game.i18n.localize("FitDRoller.PositionDesperate")
    },
    "default": "risky"
  });

  game.settings.register("fitd-roller", "defaultEffect", {
    "name": game.i18n.localize("FitDRoller.defaultEffectName"),
    "hint": game.i18n.localize("FitDRoller.defaultEffectHint"),
    "scope": "world",
    "config": true,
    "type": String,
    "choices": {
      "great": game.i18n.localize("FitDRoller.EffectGreat"),
      "standard": game.i18n.localize("FitDRoller.EffectStandard"),
      "limited": game.i18n.localize("FitDRoller.EffectLimited")
    },
    "default": "standard"
  });
});

console.log("FitDRoller | Blades in the Dark Dice Roller loaded");
