// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import PropTypes from 'prop-types';

import defaultGetHelperDimensions from './defaultGetHelperDimensions';
import defaultShouldCancelStart from './defaultShouldCancelStart';

export const propTypes = {
  axis: PropTypes.oneOf(['x', 'y', 'xy']),
  contentWindow: PropTypes.any,
  getContainer: PropTypes.func,
  getHelperDimensions: PropTypes.func,
  helperContainer: PropTypes.oneOfType([
    PropTypes.func,
    typeof HTMLElement === 'undefined' ? PropTypes.any : PropTypes.instanceOf(HTMLElement)
  ]),
  onSortEnd: PropTypes.func,
  onSortMove: PropTypes.func,
  pressDelay: PropTypes.number,
  pressThreshold: PropTypes.number,
  shouldCancelStart: PropTypes.func,
  transitionDuration: PropTypes.number,
  useDragHandle: PropTypes.bool,
  useWindowAsScrollContainer: PropTypes.bool
};

export const defaultProps = {
  axis: 'y',
  getHelperDimensions: defaultGetHelperDimensions,
  pressDelay: 0,
  pressThreshold: 5,
  shouldCancelStart: defaultShouldCancelStart,
  transitionDuration: 300,
  useWindowAsScrollContainer: false
};

export const omittedProps = Object.keys(propTypes);
