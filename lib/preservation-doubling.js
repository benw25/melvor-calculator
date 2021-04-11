import _ from 'lodash';

const NUM_TIMES_TO_CALCULATE_CONSTANT = 1000;
const PRECISION = 5;

const DESIRED = 2500 - 163;
const PRESERVE_CHANCE = 30;
const DOUBLE_CHANCE = 25;

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

export const logInputNumberNeeded = (
  desiredNumber,
  percentChanceToPreserve,
  percentChanceToDouble
) => {
  const numberNeeded = calcInputNumberNeeded(
    desiredNumber,
    percentChanceToPreserve,
    percentChanceToDouble
  );
  console.log(
    `Expect aproximately ${numberNeeded} input items to create ${desiredNumber} items with ${percentChanceToPreserve}% to preserve, ${percentChanceToDouble}% to double. `
  );
};
