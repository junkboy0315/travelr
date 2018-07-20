import * as _ from 'lodash';

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */

export const difference = (object, base) => {
  const changes = (object, base) =>
    _.transform(object, (result, value, key) => {
      if (!_.isEqual(value, base[key])) {
        result[key] =
          _.isObject(value) && _.isObject(base[key])
            ? changes(value, base[key])
            : value;
      }
    });
  return changes(object, base);
};

export const loadJS = (src: string) => {
  const ref = window.document.getElementsByTagName('script')[0];
  const script = window.document.createElement('script');
  script.src = src;
  script.async = true;
  ref.parentNode.insertBefore(script, ref);
};
