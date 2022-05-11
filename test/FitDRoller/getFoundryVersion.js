const test = require("ava");

const { FitDRoller } = require("../../fitd-roller.js");

const fitdRoller = new FitDRoller();

const currentGame = {
  version: "9.0"
};

const legacyGame = {
  data: {
    version: "0.7.1"
  }
};

test("getFoundryVersion returns the correct version for a current game", t => {
  const version = fitdRoller.getFoundryVersion(currentGame);
  t.deepEqual(version, { major: 9, minor: 0 });
});

test("getFoundryVersion returns the correct version for a legacy game", t => {
  const version = fitdRoller.getFoundryVersion(legacyGame);
  t.deepEqual(version, { major: 7, minor: 1 });
});
