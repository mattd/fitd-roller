const test = require("ava");

const { FitDRoller } = require("../../fitd-roller.js");

const fitdRoller = new FitDRoller();

test("correctly handles multi-die critical success", t => {
  const rolls = [{result: 6}, {result: 2}, {result: 6}];
  t.is(fitdRoller.getRollOutcome(rolls), 'critical-success');
});

test("does not grant critical success in zeroMode", t=> {
  const rolls = [{result: 6}, {result: 6}];
  t.is(fitdRoller.getRollOutcome(rolls, true), 'success');
});

test("correctly handles single die success", t => {
  const rolls = [{result: 6}];
  t.is(fitdRoller.getRollOutcome(rolls), 'success');
});

test("correctly handles single die partial success", t => {
  let rolls = [{result: 4}];
  t.is(fitdRoller.getRollOutcome(rolls), 'partial-success');
  rolls = [{result: 5}];
  t.is(fitdRoller.getRollOutcome(rolls), 'partial-success');
});

test("correctly handles single die failure", t => {
  let rolls = [{result: 1}];
  t.is(fitdRoller.getRollOutcome(rolls), 'failure');
  rolls = [{result: 2}];
  t.is(fitdRoller.getRollOutcome(rolls), 'failure');
  rolls = [{result: 3}];
  t.is(fitdRoller.getRollOutcome(rolls), 'failure');
});

test("correctly handles multi-die success", t => {
  const rolls = [{result: 1}, {result: 6}];
  t.is(fitdRoller.getRollOutcome(rolls), 'success');
});

test("correctly handles multi-die partial success", t => {
  let rolls = [{result: 1}, {result: 4}];
  t.is(fitdRoller.getRollOutcome(rolls), 'partial-success');
  rolls = [{result: 1}, {result: 5}];
  t.is(fitdRoller.getRollOutcome(rolls), 'partial-success');
});

test("correctly handles multi-die failure", t => {
  let rolls = [{result: 1}, {result: 3}];
  t.is(fitdRoller.getRollOutcome(rolls), 'failure');
  rolls = [{result: 1}, {result: 2}];
  t.is(fitdRoller.getRollOutcome(rolls), 'failure');
  rolls = [{result: 1}, {result: 1}];
  t.is(fitdRoller.getRollOutcome(rolls), 'failure');
});
