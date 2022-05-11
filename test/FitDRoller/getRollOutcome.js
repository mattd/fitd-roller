const test = require("ava");

const { FitDRoller } = require("../../fitd-roller.js");

const fitdRoller = new FitDRoller();

test("handles multi-dice critical success", t => {
  const rolls = [{result: 6}, {result: 2}, {result: 6}];
  t.is(fitdRoller.getRollOutcome(rolls), 'critical-success');
});

test("does not grant critical success in zeroMode", t=> {
  const rolls = [{result: 6}, {result: 6}];
  t.is(fitdRoller.getRollOutcome(rolls, true), 'success');
});
