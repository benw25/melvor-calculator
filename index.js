const _ = require("lodash");

const NUM_TIMES_TO_CALCULATE_CONSTANT = 1000;
const PRECISION = 5;

const calcPreserveMultiplier = (percentChanceToPreserve) => {
  // percentChanceToPreserve as a percent, integer

  if (
    percentChanceToPreserve <= 1 ||
    !percentChanceToPreserve ||
    percentChanceToPreserve >= 100
  )
    return 1;

  percentChanceToPreserve = _.toInteger(_.floor(percentChanceToPreserve));

  const chanceToPreserve = percentChanceToPreserve / 100;
  const chanceToBrick = 1 - chanceToPreserve;

  let sum = 0;

  for (let i = 0; i < NUM_TIMES_TO_CALCULATE_CONSTANT; i++) {
    sum += Math.pow(chanceToPreserve, i) * chanceToBrick * (i + 1);
  }

  return _.round(sum, PRECISION);
};

const calcDoubleMultiplier = (percentChanceToDouble) => {
  percentChanceToDouble = _.toInteger(_.floor(percentChanceToDouble));

  const chanceToPreserve = percentChanceToDouble / 100;

  return 1 + chanceToPreserve;
};

const totalExpectedNumberMultiplier = (
  percentChanceToPreserve,
  percentChanceToDouble
) => {
  return (
    calcPreserveMultiplier(percentChanceToPreserve) *
    calcDoubleMultiplier(percentChanceToDouble)
  );
};

const calcInputNumberNeeded = (
  desiredNumber,
  percentChanceToPreserve,
  percentChanceToDouble
) => {
  const unformattedExpectedInputNumber = _.divide(
    desiredNumber,
    totalExpectedNumberMultiplier(
      percentChanceToPreserve,
      percentChanceToDouble
    )
  );

  return _.floor(unformattedExpectedInputNumber);
};

const DESIRED = 2500 - 801;
const PRESERVE_CHANCE = 20;
const DOUBLE_CHANCE = 25;

const inputNumber = calcInputNumberNeeded(
  DESIRED,
  PRESERVE_CHANCE,
  DOUBLE_CHANCE
);
console.log(
  `Expect aproximately ${inputNumber} input items to create ${DESIRED} items with ${PRESERVE_CHANCE}% to preserve, ${DOUBLE_CHANCE}% to double. `
);
