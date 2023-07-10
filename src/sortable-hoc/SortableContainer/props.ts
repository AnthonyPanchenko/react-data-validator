// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import PropTypes from 'prop-types';

import defaultGetHelperDimensions from './defaultGetHelperDimensions';
import defaultShouldCancelStart from './defaultShouldCancelStart';

export const propTypes = {
  axis: PropTypes.oneOf(['x', 'y', 'xy']),
  contentWindow: PropTypes.any,
  disableAutoscroll: PropTypes.bool,
  distance: PropTypes.number,
  getContainer: PropTypes.func,
  getHelperDimensions: PropTypes.func,
  helperClass: PropTypes.string,
  helperContainer: PropTypes.oneOfType([
    PropTypes.func,
    typeof HTMLElement === 'undefined' ? PropTypes.any : PropTypes.instanceOf(HTMLElement)
  ]),
  hideSortableGhost: PropTypes.bool,
  lockAxis: PropTypes.string,
  lockOffset: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string]))
  ]),
  lockToContainerEdges: PropTypes.bool,
  onSortEnd: PropTypes.func,
  onSortMove: PropTypes.func,
  onSortOver: PropTypes.func,
  onSortStart: PropTypes.func,
  pressDelay: PropTypes.number,
  pressThreshold: PropTypes.number,
  shouldCancelStart: PropTypes.func,
  transitionDuration: PropTypes.number,
  updateBeforeSortStart: PropTypes.func,
  useDragHandle: PropTypes.bool,
  useWindowAsScrollContainer: PropTypes.bool
};

export const defaultProps = {
  axis: 'y',
  disableAutoscroll: false,
  distance: 0,
  getHelperDimensions: defaultGetHelperDimensions,
  hideSortableGhost: true,
  lockOffset: '50%',
  lockToContainerEdges: false,
  pressDelay: 0,
  pressThreshold: 5,
  shouldCancelStart: defaultShouldCancelStart,
  transitionDuration: 300,
  useWindowAsScrollContainer: false
};

export const omittedProps = Object.keys(propTypes);
