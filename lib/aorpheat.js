import _ from 'lodash';
import bigInt from 'big-integer';
import { performance } from 'perf_hooks';

const AORPHEAT_CONSTANT = 19800000;
const PRECISION_FACTOR = 8;
const HOUR_IN_SECONDS = 60 * 60;
const DAY_IN_SECONDS = HOUR_IN_SECONDS * 24;
const WEEK_IN_SECONDS = DAY_IN_SECONDS * 7;

const calcAorpheatSingleAction = (level) => {
  return calcAorpheat(level, 1);
};

const calcAorpheatHour = (level, actionTime) => {
  const iterations = _.divide(HOUR_IN_SECONDS, actionTime);

  return calcAorpheat(level, iterations);
};

const calcAorpheatDay = (level, actionTime) => {
  const iterations = _.divide(DAY_IN_SECONDS, actionTime);

  return calcAorpheat(level, iterations);
};

const calcAorpheatWeek = (level, actionTime) => {
  const iterations = _.divide(WEEK_IN_SECONDS, actionTime);

  return calcAorpheat(level, iterations);
};

export const calcAllAorpheats = (level, actionTime) => {
  const t0 = performance.now();

  const chanceSingleAction = calcAorpheatSingleAction(level);
  const chanceHour = calcAorpheatHour(level, actionTime);
  const chanceDay = calcAorpheatDay(level, actionTime);
  const chanceWeek = calcAorpheatWeek(level, actionTime);

  const t1 = performance.now();
  const calcTime = t1 - t0; // ms

  return {
    chanceSingleAction,
    chanceHour,
    chanceDay,
    chanceWeek,
    calcTime,
  };
};

export const logAllAorpheats = (aorpheatTimes) => {
  const {
    chanceSingleAction,
    chanceHour,
    chanceDay,
    chanceWeek,
    calcTime,
  } = aorpheatTimes;

  console.log(`Chance Single Action: ${chanceSingleAction} %`);
  console.log(`Chance Hour: ${chanceHour} %`);
  console.log(`Chance Day: ${chanceDay} %`);
  console.log(`Chance Week: ${chanceWeek} %`);

  console.log(`\nAorpheat calc took ${calcTime} milliseconds.`);
};

const calcAorpheat = (level, iterations) => {
  const numerator = bigInt(AORPHEAT_CONSTANT - 90);
  const divisor = bigInt(AORPHEAT_CONSTANT);

  const nPowed = numerator.pow(iterations);
  const dPowed = divisor.pow(iterations);

  const precision = bigInt(10).pow(PRECISION_FACTOR);

  const a = new BigDecimal(
    bigInt(precision)
      .subtract(nPowed.times(precision).divide(dPowed))
      .times(100)
      .toString()
  );
  const b = new BigDecimal(bigInt(precision).toString());

  const output = a.divide(b).toString();

  return output;
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
