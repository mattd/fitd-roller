import test from 'ava';

import { FitDRoller } from "../../module/scripts/fitd-roller.mjs";

const fitdRoller = new FitDRoller();

test("correctly handles multi-die critical success", t => {
  const roll = [{result: 6}, {result: 2}, {result: 6}];
  t.is(fitdRoller.getRollOutcome(roll), 'critical-success');
});

test("correctly handles zero die success", t=> {
  const roll = [{result: 6}, {result: 6}];
  t.is(fitdRoller.getRollOutcome(roll, true), 'success');
});

test("correctly handles zero die partial success", t => {
  const rolls = [
    [{result: 6}, {result: 5}],
    [{result: 6}, {result: 4}]
  ];
  rolls.forEach(roll => {
    t.is(fitdRoller.getRollOutcome(roll, true), 'partial-success');
  });
});

test("correctly handles zero die failure", t => {
  const rolls = [
    [{result: 6}, {result: 3}],
    [{result: 6}, {result: 2}],
    [{result: 6}, {result: 1}]
  ];
  rolls.forEach(roll => {
    t.is(fitdRoller.getRollOutcome(roll, true), 'failure');
  });
});

test("correctly handles single die success", t => {
  const roll = [{result: 6}];
  t.is(fitdRoller.getRollOutcome(roll), 'success');
});

test("correctly handles single die partial success", t => {
  const rolls = [
    [{result: 4}],
    [{result: 5}]
  ];
  rolls.forEach(roll => {
    t.is(fitdRoller.getRollOutcome(roll), 'partial-success');
  });
});

test("correctly handles single die failure", t => {
  const rolls = [
    [{result: 1}],
    [{result: 2}],
    [{result: 3}]
  ];
  rolls.forEach(roll => {
    t.is(fitdRoller.getRollOutcome(roll), 'failure');
  });
});

test("correctly handles multi-die success", t => {
  const roll = [{result: 1}, {result: 6}];
  t.is(fitdRoller.getRollOutcome(roll), 'success');
});

test("correctly handles multi-die partial success", t => {
  const rolls = [
    [{result: 1}, {result: 4}],
    [{result: 1}, {result: 5}]
  ];
  rolls.forEach(roll => {
    t.is(fitdRoller.getRollOutcome(roll), 'partial-success');
  });
});

test("correctly handles multi-die failure", t => {
  const rolls = [
    [{result: 1}, {result: 3}],
    [{result: 1}, {result: 2}],
    [{result: 1}, {result: 1}]
  ];
  rolls.forEach(roll => {
    t.is(fitdRoller.getRollOutcome(roll), 'failure');
  });
});
