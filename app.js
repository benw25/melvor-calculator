import _ from 'lodash';

import { calcAllAorpheats, logAllAorpheats, logInputNumberNeeded } from './lib';

logInputNumberNeeded(2338, 30, 25);

console.log('');

logAllAorpheats(calcAllAorpheats(90, 3.75));
