import _ from 'lodash';
import bigInt from 'big-integer';
import prompt from 'prompt';
import { performance } from 'perf_hooks';

const AORPHEAT_CONSTANT = 19800000;
const PRECISION_FACTOR = 10;
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

export const logAllAorpheats = (aorpheatTimes) => {
  const {
    chanceSingleAction,
    chanceHour,
    chanceDay,
    chanceWeek,
    calcTime,
  } = aorpheatTimes;

  console.log(`Single Action: \t${chanceSingleAction} %`);
  console.log(`Chance Hour: \t${chanceHour} %`);
  console.log(`Chance Day: \t${chanceDay} %`);
  console.log(`Chance Week: \t${chanceWeek} %\n`);

  // console.log(`\nAorpheat calc took **${calcTime}** milliseconds.\n`);
};

const calcAorpheat = (level, iterations) => {
  iterations = _.floor(iterations);

  const numerator = AORPHEAT_CONSTANT + level;
  const divisor = AORPHEAT_CONSTANT;

  const fraction = numerator / divisor;
  const fractionPowed = bigInt(
    _.toInteger(Math.pow(fraction, iterations) * Math.pow(10, PRECISION_FACTOR))
  );

  const precision = bigInt(10).pow(PRECISION_FACTOR);
  const a = new BigDecimal(
    (precision - precision.times(precision).divide(fractionPowed)) * 100
  );

  const b = new BigDecimal(bigInt(precision).toString());

  const output = a.divide(b).toString();

  return output;
};

export const promptAorpheat = () => {
  prompt.start();

  console.log('Aorpheat Calculator');

  prompt.get(
    [
      {
        name: 'levelReq',
        description: 'Level Requirement',
        required: true,
      },
      {
        name: 'actionTime',
        description: 'Action Time',
        required: true,
      },
    ],
    function (err, result) {
      console.log('Calculating Aorpheat times...\n');

      logAllAorpheats(calcAllAorpheats(result.levelReq, result.actionTime));
    }
  );
};

export const calcAorpheatWC = () => {
  const WC_DATA = [
    { type: 'Normal', actionTime: 3, levelReq: 1, maxMastery: true },
    { type: 'Oak', actionTime: 4, levelReq: 10, maxMastery: true },
    { type: 'Willow', actionTime: 5, levelReq: 25, maxMastery: true },
    { type: 'Teak', actionTime: 6, levelReq: 35, maxMastery: true },
    { type: 'Maple', actionTime: 8, levelReq: 45, maxMastery: true },
    { type: 'Mahogany', actionTime: 10, levelReq: 55, maxMastery: true },
    { type: 'Yew', actionTime: 12, levelReq: 60, maxMastery: true },
    { type: 'Magic', actionTime: 20, levelReq: 75, maxMastery: true },
    { type: 'Redwood', actionTime: 15, levelReq: 90, maxMastery: true },
  ];

  const HAS_MAX_WC_AXE = true;
  const MAX_WC_AXE_UPGRADE_MULTIPLIER = 0.5;

  const HAS_WC_CAPE = true;
  const WC_CAPE_MULTIPLIER = 0.15;

  const HAS_MASTER_OF_NATURE = true;
  const MON_CAPE_MULTIPLIER = 0.15;

  const HAS_AGI_WC_OBSTACLE = true;
  const AGI_WC_MULTIPLIER = 0.06;

  _.forEach(_.reverse(WC_DATA), (d) => {
    const levelReq = _.get(d, 'levelReq');
    const type = _.get(d, 'type');
    const baseActionTime = _.get(d, 'actionTime');
    const maxMastery = _.get(d, 'maxMastery');

    let actionTime = baseActionTime;
    let multiplier = 1.0;

    if (HAS_MAX_WC_AXE) multiplier -= MAX_WC_AXE_UPGRADE_MULTIPLIER;
    if (HAS_WC_CAPE) multiplier -= WC_CAPE_MULTIPLIER;
    if (HAS_MASTER_OF_NATURE) multiplier -= MON_CAPE_MULTIPLIER;
    if (HAS_AGI_WC_OBSTACLE) multiplier -= AGI_WC_MULTIPLIER;

    multiplier = _.round(multiplier, 2);
    actionTime *= multiplier;
    if (maxMastery) actionTime -= 0.2;
    actionTime = _.round(actionTime, 3);

    console.log(`**${type}** Tree action time: ${actionTime} seconds.`);

    logAllAorpheats(calcAllAorpheats(levelReq, actionTime));
  });
};

export const calcAorpheatMining = () => {
  const MINING_DATA = [
    { type: 'Rune/Copper/Tin', actionTime: 0.86, levelReq: 1 },
    { type: 'Iron', actionTime: 0.86, levelReq: 15 },
    { type: 'Coal', actionTime: 0.92, levelReq: 30 },
    { type: 'Silver', actionTime: 0.95, levelReq: 30 },
    { type: 'Gold', actionTime: 0.95, levelReq: 40 },
    { type: 'Mithril', actionTime: 0.95, levelReq: 50 },
    { type: 'Adamantite', actionTime: 1.05, levelReq: 70 },
    { type: 'Runite', actionTime: 1.2, levelReq: 80 },
    { type: 'Dragonite', actionTime: 1.62, levelReq: 95 },
  ];

  _.forEach(_.reverse(MINING_DATA), (d) => {
    const levelReq = _.get(d, 'levelReq');
    const type = _.get(d, 'type');
    const actionTime = _.get(d, 'actionTime');

    console.log(`**${type}** ore action time: ${actionTime} seconds.`);

    logAllAorpheats(calcAllAorpheats(levelReq, actionTime));
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
