import _ from 'lodash';

import {
  calcAllAorpheats,
  logAllAorpheats,
  calcAorpheatMining,
  calcAorpheatWC,
  promptAorpheat,
  logInputNumberNeeded,
} from './lib';

logInputNumberNeeded(10000, 60, 10);

calcAorpheatWC();

calcAorpheatMining();

// promptAorpheat();
