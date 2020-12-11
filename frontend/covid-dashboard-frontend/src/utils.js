
import _ from 'lodash';

export const calcTrend = (start, end) => {
  if (!_.isNumber(start) || !_.isNumber(end)) {
    return NaN;
  }

  if (end === 0) {
    end = 0.01;
  }

  const pDiff = (end - start) / end * 100;
  return _.round(pDiff, 1);
};
