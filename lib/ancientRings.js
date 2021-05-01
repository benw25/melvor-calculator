import _ from 'lodash';
import bigInt from 'big-integer';
import { performance } from 'perf_hooks';

const PRECISION_FACTOR = 10;
const EXTRA_CHANCE_FROM_95_MASTERY = 0.25;
const CHANCE_FOR_ANCIENT_RING = 1 / 6722;
const HOUR_IN_SECONDS = 60 * 60;
const DAY_IN_SECONDS = HOUR_IN_SECONDS * 24;
const WEEK_IN_SECONDS = DAY_IN_SECONDS * 7;

const calcARSingleAction = (averageTime, specialChance) => {
  return calcAncientRing(averageTime, specialChance, 1);
};

const calcARHour = (averageTime, specialChance) => {
  const iterations = _.divide(HOUR_IN_SECONDS, averageTime);

  return calcAncientRing(averageTime, specialChance, iterations);
};

const calcARDay = (averageTime, specialChance) => {
  const iterations = _.divide(DAY_IN_SECONDS, averageTime);

  return calcAncientRing(averageTime, specialChance, iterations);
};

const calcARWeek = (averageTime, specialChance) => {
  const iterations = _.divide(WEEK_IN_SECONDS, averageTime);

  return calcAncientRing(averageTime, specialChance, iterations);
};

const calcAllARs = (averageTime, specialChance) => {
  const t0 = performance.now();

  const chanceSingleAction = calcARSingleAction(averageTime, specialChance);
  const chanceHour = calcARHour(averageTime, specialChance);
  const chanceDay = calcARDay(averageTime, specialChance);
  const chanceWeek = calcARWeek(averageTime, specialChance);

  const t1 = performance.now();
  let calcTime = t1 - t0; // ms
  calcTime = _.round(calcTime, 2);

  return {
    chanceSingleAction,
    chanceHour,
    chanceDay,
    chanceWeek,
    calcTime,
  };
};

export const logAllARs = (ARTimes) => {
  const {
    chanceSingleAction,
    chanceHour,
    chanceDay,
    chanceWeek,
    calcTime,
  } = ARTimes;

  console.log(`Single Action: \t${chanceSingleAction} %`);
  console.log(`Chance Hour: \t${chanceHour} %`);
  console.log(`Chance Day: \t${chanceDay} %`);
  console.log(`Chance Week: \t${chanceWeek} %\n`);

  // console.log(`\AR calc took **${calcTime}** milliseconds.\n`);
};

export const calcAncientRing = (averageTime, specialChance, iterations) => {
  iterations = _.floor(iterations);

  if (specialChance > 1) specialChance /= 100;

  const totalChance =
    specialChance *
    (1 + EXTRA_CHANCE_FROM_95_MASTERY) *
    CHANCE_FOR_ANCIENT_RING;

  const totalChanceToNot = 1 - totalChance;
  const totalChanceToNotPowed = bigInt(
    _.toInteger(
      Math.pow(totalChanceToNot, iterations) * Math.pow(10, PRECISION_FACTOR)
    )
  );

  const precision = bigInt(10).pow(PRECISION_FACTOR);
  const a = new BigDecimal((precision - totalChanceToNotPowed) * 100);

  const b = new BigDecimal(bigInt(precision).toString());

  const output = a.divide(b).toString();

  return output;
};

export const calcARSelectFish = () => {
  const DRAGON_ROD_MULTIPLIER = 0.4;
  const AMULET_OF_FISHING_MULTIPLIER = 0.15;
  const MASTERY_50_FISH_ADDITIONAL_SPECIAL_CHANCE = 0.03;

  const FISH_DATA = [
    { type: 'Seahorse', minTime: 2.0, maxTime: 10.0, baseSpecialChance: 0.05 },
    {
      type: 'Skeleton Fish',
      minTime: 4.0,
      maxTime: 12.0,
      baseSpecialChance: 0.05,
    },
    {
      type: 'Magic Fish',
      minTime: 10.0,
      maxTime: 30.0,
      baseSpecialChance: 0.05,
    },
    { type: 'Shark', minTime: 5.0, maxTime: 15.0, baseSpecialChance: 0.0 },
    { type: 'Whale', minTime: 5.0, maxTime: 25.0, baseSpecialChance: 0.0 },
  ];

  _.forEach(FISH_DATA, (d) => {
    const type = _.get(d, 'type');
    const minTime = _.get(d, 'minTime');
    const maxTime = _.get(d, 'maxTime');
    const baseSpecialChance = _.get(d, 'baseSpecialChance');

    const averageTime =
      ((minTime + maxTime) / 2) *
      (1 - DRAGON_ROD_MULTIPLIER - AMULET_OF_FISHING_MULTIPLIER);

    const totalSpecialChance =
      baseSpecialChance + MASTERY_50_FISH_ADDITIONAL_SPECIAL_CHANCE;

    console.log(
      `**${_.toUpper(type)}** (${totalSpecialChance}% Special Chance).`
    );
    logAllARs(calcAllARs(averageTime, totalSpecialChance));
  });
};

class BigDecimal {
  constructor(value) {
    let [ints, decis] = String(value).split('.').concat('');
    decis = decis.padEnd(BigDecimal.decimals, '0');
    this.bigint = BigInt(ints + decis);
  }
  static fromBigInt(bigint) {
    return Object.assign(Object.create(BigDecimal.prototype), { bigint });
  }
  divide(divisor) {
    // You would need to provide methods for other operations
    return BigDecimal.fromBigInt(
      (this.bigint * BigInt('1' + '0'.repeat(BigDecimal.decimals))) /
        divisor.bigint
    );
  }
  toString() {
    const s = this.bigint.toString().padStart(BigDecimal.decimals + 1, '0');
    return (
      s.slice(0, -BigDecimal.decimals) +
      '.' +
      s.slice(-BigDecimal.decimals).replace(/\.?0+$/, '')
    );
  }
}
BigDecimal.decimals = PRECISION_FACTOR;
