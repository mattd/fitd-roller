class Roller {
  /**
  * Create popup for roller
  * @return none
  */
  async BitDRollerPopup() {

    const maxDice = game.settings.get("foundryvtt-bitd-roller", "maxDiceCount");
    const defaultDiceCount = (
      game.settings.get("foundryvtt-bitd-roller", "defaultDiceCount")
    );
    const defaultPosition = (
      game.settings.get("foundryvtt-bitd-roller", "defaultPosition")
    );
    const defaultEffect = (
      game.settings.get("foundryvtt-bitd-roller", "defaultEffect")
    );

    new Dialog({
      title: `${game.i18n.localize('BitDRoller.RollTitle')}`,
      content: `
        <h2>${game.i18n.localize('BitDRoller.Roll')}</h2>
        <form>
          <div class="form-group">
            <label>
              ${game.i18n.localize('BitDRoller.RollNumberOfDice')}:
            </label>
            <select id="dice" name="dice">
              ${
                Array(maxDice + 1).fill().map((item, i) => {
                  return `<option value="${i}">${i}d</option>`
                }).join('')
              }
            </select>
            <script>
              $('#dice option[value="${defaultDiceCount}"]').prop(
                "selected", "selected"
              );
            </script>
          </div>
          <div class="form-group">
            <label>${game.i18n.localize('BitDRoller.Action')}:</label>
            <select id="action" name="action">
              <option value=""></option>
              <option value="hunt">
                ${game.i18n.localize('BitDRoller.ActionHunt')}
              </option>
              <option value="study">
                ${game.i18n.localize('BitDRoller.ActionStudy')}
              </option>
              <option value="survey">
                ${game.i18n.localize('BitDRoller.ActionSurvey')}
              </option>
              <option value="tinker">
                ${game.i18n.localize('BitDRoller.ActionTinker')}
              </option>
              <option value="finesse">
                ${game.i18n.localize('BitDRoller.ActionFinesse')}
              </option>
              <option value="prowl">
                ${game.i18n.localize('BitDRoller.ActionProwl')}
              </option>
              <option value="skirmish">
                ${game.i18n.localize('BitDRoller.ActionSkirmish')}
              </option>
              <option value="wreck">
                ${game.i18n.localize('BitDRoller.ActionWreck')}
              </option>
              <option value="attune">
                ${game.i18n.localize('BitDRoller.ActionAttune')}
              </option>
              <option value="command">
                ${game.i18n.localize('BitDRoller.ActionCommand')}
              </option>
              <option value="consort">
                ${game.i18n.localize('BitDRoller.ActionConsort')}
              </option>
              <option value="sway">
                ${game.i18n.localize('BitDRoller.ActionSway')}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>${game.i18n.localize('BitDRoller.Position')}:</label>
            <select id="pos" name="pos">
              <option value="controlled">
                ${game.i18n.localize('BitDRoller.PositionControlled')}
              </option>
              <option value="risky">
                ${game.i18n.localize('BitDRoller.PositionRisky')}
              </option>
              <option value="desperate">
                ${game.i18n.localize('BitDRoller.PositionDesperate')}
              </option>
            </select>
            <script>$('#pos option[value="${defaultPosition}"]').prop(
                "selected", "selected"
              );
            </script>
          </div>
          <div class="form-group">
            <label>${game.i18n.localize('BitDRoller.Effect')}:</label>
            <select id="fx" name="fx">
              <option value="limited">
                ${game.i18n.localize('BitDRoller.EffectLimited')}
              </option>
              <option value="standard">
                ${game.i18n.localize('BitDRoller.EffectStandard')}
              </option>
              <option value="great">
                ${game.i18n.localize('BitDRoller.EffectGreat')}
              </option>
            </select>
            <script>
              $('#fx option[value="${defaultEffect}"]').prop(
                "selected", "selected"
              );
            </script>
          </div>
        </form>
      `,
      buttons: {
        yes: {
          icon: "<i class='fas fa-check'></i>",
          label: game.i18n.localize('BitDRoller.Roll'),
          callback: async (html) => {
            const diceAmount = parseInt(html.find('[name="dice"]')[0].value);
            const actionOptions = html.find('[name="action"]')[0];
            const action = actionOptions[actionOptions.selectedIndex].text;
            const position = html.find('[name="pos"]')[0].value;
            const effect = html.find('[name="fx"]')[0].value;
            await this.BitDRoller(action, diceAmount, position, effect);
          }
        },
        no: {
          icon: "<i class='fas fa-times'></i>",
          label: game.i18n.localize('BitDRoller.Close'),
        },
      },
      default: "yes",
    }).render(true);
  }

  /**
   * Roll Dice.
   * @param {string} attribute arbitrary label for the roll
   * @param {int} diceAmount number of dice to roll
   * @param {string} position position
   * @param {string} effect effect
   */
  async BitDRoller(
    attribute = "",
    diceAmount = 0,
    position = "risky",
    effect = "standard"
  ) {
    let versionParts;
    if (game.version) {
      versionParts = game.version.split('.');
      game.majorVersion = parseInt(versionParts[0]);
      game.minorVersion = parseInt(versionParts[1]);
    } else {
      versionParts = game.data.version.split('.');
      game.majorVersion = parseInt(versionParts[1]);
      game.minorVersion = parseInt(versionParts[2]);
    }

    let zeromode = false;
    if (diceAmount < 0) { diceAmount = 0; }
    if (diceAmount === 0) { zeromode = true; diceAmount = 2; }

    const r = new Roll(`${diceAmount}d6`, {});

    if (game.majorVersion > 7) {
      await r.evaluate({async: true});
    } else {
      r.roll();
    }
    return await this.showChatRollMessage(
      r, zeromode, attribute, position, effect
    );
  }

  /**
   * Shows Chat message.
   *
   * @param {Roll} r array of rolls
   * @param {Boolean} zeromode whether to treat as if 0d
   * @param {string} attribute arbitrary label for the roll
   * @param {string} position position
   * @param {string} effect effect
   */
  async showChatRollMessage(
    r,
    zeromode,
    attribute = "",
    position = "",
    effect = ""
  ) {
    let versionParts;
    if (game.version) {
      versionParts = game.version.split('.');
      game.majorVersion = parseInt(versionParts[0]);
      game.minorVersion = parseInt(versionParts[1]);
    } else {
      versionParts = game.data.version.split('.');
      game.majorVersion = parseInt(versionParts[1]);
      game.minorVersion = parseInt(versionParts[2]);
    }

    const speaker = ChatMessage.getSpeaker();
    let rolls = [];

    rolls = (r.terms)[0].results;

    // Retrieve Roll status.
    let rollStatus = "";

    rollStatus = this.getBitDActionRollStatus(rolls, zeromode);
    let color = game.settings.get("foundryvtt-bitd-roller", "backgroundColor");

    let positionLocalize = '';
    switch (position)
    {
      case 'controlled':
        positionLocalize = 'BitDRoller.PositionControlled';
        break;
      case 'desperate':
        positionLocalize = 'BitDRoller.PositionDesperate';
        break;
      case 'risky':
      default:
        positionLocalize = 'BitDRoller.PositionRisky';
    }

    let effectLocalize = '';
    switch (effect)
    {
      case 'limited':
        effectLocalize = 'BitDRoller.EffectLimited';
        break;
      case 'great':
        effectLocalize = 'BitDRoller.EffectGreat';
        break;
      case 'standard':
      default:
        effectLocalize = 'BitDRoller.EffectStandard';
    }

    const result = await renderTemplate(
      "modules/foundryvtt-bitd-roller/templates/bitd-roll.html",
      {
        rolls,
        rollStatus,
        attribute,
        position,
        positionLocalize,
        effect,
        effectLocalize,
        zeromode,
        color
      }
    );

    const messageData = {
      speaker,
      content: result,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      roll: r
    };

    if (game.majorVersion > 7) {
      return CONFIG.ChatMessage.documentClass.create(messageData, {});
    } else {
      return CONFIG.ChatMessage.entityClass.create(messageData, {});
    }
  }

  /**
   *  Get status of the Roll.
   *  - failure
   *  - partial-success
   *  - success
   *  - critical-success
   * @param {Array} rolls results of dice rolls
   * @param {Boolean} zeromode whether to treat as if 0d
   * @returns {string} success/failure status of roll
   */
  getBitDActionRollStatus(rolls, zeromode = false) {
    let sortedRolls = [];
    // Sort roll values from lowest to highest.
    sortedRolls = rolls.map((i) => i.result).sort();

    let rollStatus = "failure";

    if (sortedRolls[0] === 6 && zeromode) {
      rollStatus = "critical-success";
    } else {
      let useDie;
      let prevUseDie = false;

      if (zeromode) {
        useDie = sortedRolls[0];
      } else {
        useDie = sortedRolls[sortedRolls.length - 1];

        if (sortedRolls.length - 2 >= 0) {
          prevUseDie = sortedRolls[sortedRolls.length - 2];
        }
      }

      if (useDie <= 3) {
         // 1,2,3 = failure
        rollStatus = "failure";
      } else if (useDie === 6) {
        if (prevUseDie && prevUseDie === 6) {
          // 6,6 - critical success
          rollStatus = "critical-success";
        } else {
          // 6 - success
          rollStatus = "success";
        }
      } else {
        // else (4,5) = partial success
        rollStatus = "partial-success";
      }
    }
    return rollStatus;
  }
}

Hooks.once("ready", () => {
  game.bitd-roller = new Roller();
});

// getSceneControlButtons
Hooks.on("renderSceneControls", (app, html) => {
  const diceRoller = $(`
    <li class="scene-control" title="BitD Roller">
      <i class="fas fa-dice"></i>
    </li>
  `);
  diceRoller.on("click", async function () {
    await game.bitd-roller.BitDRollerPopup();
  });
  if (isNewerVersion(game.version, '9.220')) {
    html.children().first().append(diceRoller);
  } else {
    html.append(diceRoller);
  }
});

Hooks.once("init", () => {
  game.settings.register("foundryvtt-bitd-roller", "backgroundColor", {
    "name": game.i18n.localize("BitDRoller.backgroundColorName"),
    "hint": game.i18n.localize("BitDRoller.backgroundColorHint"),
    "scope": "world",
    "config": true,
    "choices": {
      "gray": game.i18n.localize("BitDRoller.backgroundColorGray"),
      "black": game.i18n.localize("BitDRoller.backgroundColorBlack")
    },
    "default": "gray",
    "type": String
  });

  game.settings.register("foundryvtt-bitd-roller", "maxDiceCount", {
    "name": game.i18n.localize("BitDRoller.maxDiceCountName"),
    "hint": game.i18n.localize("BitDRoller.maxDiceCountHint"),
    "scope": "world",
    "config": true,
    "default": 10,
    "type": Number
  });

  game.settings.register("foundryvtt-bitd-roller", "defaultDiceCount", {
    "name": game.i18n.localize("BitDRoller.defaultDiceCountName"),
    "hint": game.i18n.localize("BitDRoller.defaultDiceCountHint"),
    "scope": "world",
    "config": true,
    "default": 2,
    "type": Number
  });

  game.settings.register("foundryvtt-bitd-roller", "defaultPosition", {
    "name": game.i18n.localize("BitDRoller.defaultPositionName"),
    "hint": game.i18n.localize("BitDRoller.defaultPositionHint"),
    "scope": "world",
    "config": true,
    "type": String,
    "choices": {
      "controlled": game.i18n.localize("BitDRoller.PositionControlled"),
      "risky": game.i18n.localize("BitDRoller.PositionRisky"),
      "desperate": game.i18n.localize("BitDRoller.PositionDesperate")
    },
    "default": "risky"
  });

  game.settings.register("foundryvtt-bitd-roller", "defaultEffect", {
    "name": game.i18n.localize("BitDRoller.defaultEffectName"),
    "hint": game.i18n.localize("BitDRoller.defaultEffectHint"),
    "scope": "world",
    "config": true,
    "type": String,
    "choices": {
      "great": game.i18n.localize("BitDRoller.EffectGreat"),
      "standard": game.i18n.localize("BitDRoller.EffectStandard"),
      "limited": game.i18n.localize("BitDRoller.EffectLimited")
    },
    "default": "standard"
  });
});

console.log("BitDRoller | Blades in the Dark Dice Roller loaded");
