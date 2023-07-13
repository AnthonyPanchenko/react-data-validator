// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import * as React from 'react';
import { findDOMNode } from 'react-dom';

import AutoScroller from '../AutoScroller';
import Manager from '../Manager';
import { isSortableHandle } from '../SortableHandle';
import {
    cloneNode,
    closest,
    events,
    getContainerGridGap,
    getElementMargin,
    getNestedNodeOffset,
    getPosition,
    getScrollingParent,
    isTouchEvent,
    NodeType,
    omit,
    setInlineStyles,
    setTransitionDuration,
    setTranslate3d
} from '../utils';
import { defaultProps, omittedProps, propTypes } from './props';

export const SortableContext = React.createContext({
  manager: {}
});

export default function sortableContainer(WrappedComponent, config = { withRef: false }) {
  return class WithSortableContainer extends React.Component {
    constructor(props) {
      super(props);
      const manager = new Manager();

      this.manager = manager;
      this.wrappedInstance = React.createRef();
      this.sortableContextValue = { manager };
      this.events = {
        end: this.handleEnd,
        move: this.handleMove,
        start: this.handleStart
      };
    }

    state = {};

    static defaultProps = defaultProps;
    static propTypes = propTypes;

    componentDidMount() {
      const { useWindowAsScrollContainer } = this.props;
      const container = this.getContainer();

      Promise.resolve(container).then(containerNode => {
        this.container = containerNode;
        this.document = this.container.ownerDocument || document;

        /*
         *  Set our own default rather than using defaultProps because Jest
         *  snapshots will serialize window, causing a RangeError
         */
        const contentWindow = this.props.contentWindow || this.document.defaultView || window;

        this.contentWindow = typeof contentWindow === 'function' ? contentWindow() : contentWindow;

        this.scrollContainer = useWindowAsScrollContainer
          ? this.document.scrollingElement || this.document.documentElement
          : getScrollingParent(this.container) || this.container;

        this.autoScroller = new AutoScroller(this.scrollContainer, this.onAutoScroll);

        Object.keys(this.events).forEach(key =>
          events[key].forEach(eventName =>
            this.container.addEventListener(eventName, this.events[key], false)
          )
        );
      });
    }

    componentWillUnmount() {
      if (this.helper && this.helper.parentNode) {
        this.helper.parentNode.removeChild(this.helper);
      }
      if (!this.container) {
        return;
      }

      Object.keys(this.events).forEach(key =>
        events[key].forEach(eventName =>
          this.container.removeEventListener(eventName, this.events[key])
        )
      );
    }

    handleStart = event => {
      const { shouldCancelStart } = this.props;

      if (event.button === 2 || shouldCancelStart(event)) {
        return;
      }

      this.touched = true;
      this.position = getPosition(event);

      const node = closest(event.target, el => el.sortableInfo != null);

      if (node && node.sortableInfo && this.nodeIsChild(node) && !this.state.sorting) {
        const { useDragHandle } = this.props;
        const { index, collection, disabled } = node.sortableInfo;

        if (disabled) {
          return;
        }

        if (useDragHandle && !closest(event.target, isSortableHandle)) {
          return;
        }

        this.manager.active = { collection, index };

        /*
         * Fixes a bug in Firefox where the :active state of anchor tags
         * prevent subsequent 'mousemove' events from being fired
         */
        if (!isTouchEvent(event) && event.target.tagName === NodeType.Anchor) {
          event.preventDefault();
        }

        if (this.props.pressDelay === 0) {
          this.handlePress(event);
        } else {
          this.pressTimer = setTimeout(() => this.handlePress(event), this.props.pressDelay);
        }
      }
    };

    nodeIsChild = node => {
      return node.sortableInfo.manager === this.manager;
    };

    handleMove = event => {
      const { pressThreshold } = this.props;

      if (!this.state.sorting && this.touched && !this._awaitingUpdateBeforeSortStart) {
        const position = getPosition(event);
        const delta = {
          x: this.position.x - position.x,
          y: this.position.y - position.y
        };
        const combinedDelta = Math.abs(delta.x) + Math.abs(delta.y);

        this.delta = delta;

        if (!pressThreshold || combinedDelta >= pressThreshold) {
          clearTimeout(this.cancelTimer);
          this.cancelTimer = setTimeout(this.cancel, 0);
        }
      }
    };

    handleEnd = () => {
      this.touched = false;
      this.cancel();
    };

    cancel = () => {
      const { sorting } = this.state;

      if (!sorting) {
        clearTimeout(this.pressTimer);
        this.manager.active = null;
      }
    };

    handlePress = async event => {
      const active = this.manager.getActive();

      if (active) {
        const { axis, getHelperDimensions, useWindowAsScrollContainer } = this.props;
        const { node, collection } = active;

        // Need to get the latest value for `index` in case it changes during `updateBeforeSortStart`
        const { index } = node.sortableInfo;
        const margin = getElementMargin(node);
        const gridGap = getContainerGridGap(this.container);
        const containerBoundingRect = this.scrollContainer.getBoundingClientRect();
        const dimensions = getHelperDimensions({ index, node, collection });

        console.log(node.sortableInfo);

        this.node = node;
        this.margin = margin;
        this.gridGap = gridGap;
        this.width = dimensions.width;
        this.height = dimensions.height;
        this.marginOffset = {
          x: this.margin.left + this.margin.right + this.gridGap.x,
          y: Math.max(this.margin.top, this.margin.bottom, this.gridGap.y)
        };
        this.boundingClientRect = node.getBoundingClientRect();
        this.containerBoundingRect = containerBoundingRect;
        this.index = index;
        this.newIndex = index;

        this.axis = {
          x: axis.indexOf('x') >= 0,
          y: axis.indexOf('y') >= 0
        };
        this.offsetEdge = getNestedNodeOffset(node, this.container);

        this.initialOffset = getPosition(event);

        this.initialScroll = {
          left: this.scrollContainer.scrollLeft,
          top: this.scrollContainer.scrollTop
        };

        this.initialWindowScroll = {
          left: window.pageXOffset,
          top: window.pageYOffset
        };

        this.helper = this.helperContainer.appendChild(cloneNode(node));

        setInlineStyles(this.helper, {
          boxSizing: 'border-box',
          height: `${this.height}px`,
          left: `${this.boundingClientRect.left - margin.left}px`,
          pointerEvents: 'none',
          position: 'fixed',
          top: `${this.boundingClientRect.top - margin.top}px`,
          width: `${this.width}px`
        });

        this.sortableGhost = node;

        this.minTranslate = {};
        this.maxTranslate = {};

        if (this.axis.x) {
          this.minTranslate.x =
            (useWindowAsScrollContainer ? 0 : containerBoundingRect.left) -
            this.boundingClientRect.left -
            this.width / 2;
          this.maxTranslate.x =
            (useWindowAsScrollContainer
              ? this.contentWindow.innerWidth
              : containerBoundingRect.left + containerBoundingRect.width) -
            this.boundingClientRect.left -
            this.width / 2;
        } else if (this.axis.y) {
          this.minTranslate.y =
            (useWindowAsScrollContainer ? 0 : containerBoundingRect.top) -
            this.boundingClientRect.top -
            this.height / 2;
          this.maxTranslate.y =
            (useWindowAsScrollContainer
              ? this.contentWindow.innerHeight
              : containerBoundingRect.top + containerBoundingRect.height) -
            this.boundingClientRect.top -
            this.height / 2;
        }

        this.listenerNode = event.touches ? event.target : this.contentWindow;

        events.move.forEach(eventName =>
          this.listenerNode.addEventListener(eventName, this.handleSortMove, false)
        );
        events.end.forEach(eventName =>
          this.listenerNode.addEventListener(eventName, this.handleSortEnd, false)
        );

        this.setState({
          sorting: true,
          sortingIndex: index
        });
      }
    };

    handleSortMove = event => {
      const { onSortMove } = this.props;

      // Prevent scrolling on mobile
      if (typeof event.preventDefault === 'function' && event.cancelable) {
        event.preventDefault();
      }

      this.updateHelperPosition(event);
      this.animateNodes();

      this.autoScroller.update({
        height: this.height,
        maxTranslate: this.maxTranslate,
        minTranslate: this.minTranslate,
        translate: this.translate,
        width: this.width
      });

      if (onSortMove) {
        onSortMove(event);
      }
    };

    handleSortEnd = event => {
      const { onSortEnd } = this.props;
      const {
        active: { collection }
      } = this.manager;
      const nodes = this.manager.getOrderedRefs();

      // Remove the event listeners if the node is still in the DOM
      if (this.listenerNode) {
        events.move.forEach(eventName =>
          this.listenerNode.removeEventListener(eventName, this.handleSortMove)
        );
        events.end.forEach(eventName =>
          this.listenerNode.removeEventListener(eventName, this.handleSortEnd)
        );
      }

      // Remove the helper from the DOM
      this.helper.parentNode.removeChild(this.helper);

      if (this.sortableGhost) {
        setInlineStyles(this.sortableGhost, {
          opacity: '',
          visibility: ''
        });
      }

      for (let i = 0, len = nodes.length; i < len; i++) {
        const node = nodes[i];
        const el = node.node;

        // Clear the cached offset/boundingClientRect
        node.edgeOffset = null;
        node.boundingClientRect = null;

        // Remove the transforms / transitions
        setTranslate3d(el, null);
        setTransitionDuration(el, null);
        node.translate = null;
      }

      // Stop autoscroll
      this.autoScroller.clear();

      // Update manager state
      this.manager.active = null;

      this.setState({
        sorting: false,
        sortingIndex: null
      });

      if (typeof onSortEnd === 'function') {
        onSortEnd(
          {
            collection,
            newIndex: this.newIndex,
            oldIndex: this.index,
            nodes
          },
          event
        );
      }

      this.touched = false;
    };

    updateHelperPosition(event) {
      const { axis } = this.props;

      const offset = getPosition(event);
      const translate = {
        x: offset.x - this.initialOffset.x,
        y: offset.y - this.initialOffset.y
      };

      // Adjust for window scroll
      translate.y -= window.pageYOffset - this.initialWindowScroll.top;
      translate.x -= window.pageXOffset - this.initialWindowScroll.left;

      this.translate = translate;

      if (axis === 'x') {
        translate.y = 0;
      } else if (axis === 'y') {
        translate.x = 0;
      }

      setTranslate3d(this.helper, translate);
    }

    animateNodes() {
      const { transitionDuration } = this.props;
      const { containerScrollDelta, windowScrollDelta } = this;
      const nodes = this.manager.getOrderedRefs();
      const sortingOffset = {
        left: this.offsetEdge.left + this.translate.x + containerScrollDelta.left,
        top: this.offsetEdge.top + this.translate.y + containerScrollDelta.top
      };

      this.newIndex = null;

      for (let i = 0, len = nodes.length; i < len; i++) {
        const { node } = nodes[i];
        const { index } = node.sortableInfo;
        const width = node.offsetWidth;
        const height = node.offsetHeight;
        const offset = {
          height: this.height > height ? height / 2 : this.height / 2,
          width: this.width > width ? width / 2 : this.width / 2
        };

        const translate = {
          x: 0,
          y: 0
        };
        let { edgeOffset } = nodes[i];

        // If we haven't cached the node's offsetTop / offsetLeft value
        if (!edgeOffset) {
          edgeOffset = getNestedNodeOffset(node, this.container);
          nodes[i].edgeOffset = edgeOffset;
        }

        // If the node is the one we're currently animating, skip it
        if (index === this.index) {
          /*
           * With windowing libraries such as `react-virtualized`, the sortableGhost
           * node may change while scrolling down and then back up (or vice-versa),
           * so we need to update the reference to the new node just to be safe.
           */
          this.sortableGhost = node;

          setInlineStyles(node, {
            opacity: 0,
            visibility: 'hidden'
          });

          continue;
        }

        if (transitionDuration) {
          setTransitionDuration(node, transitionDuration);
        }

        if (this.axis.x) {
          if (
            index > this.index &&
            sortingOffset.left + windowScrollDelta.left + offset.width >= edgeOffset.left
          ) {
            translate.x = -(this.width + this.marginOffset.x);
            this.newIndex = index;
          } else if (
            index < this.index &&
            sortingOffset.left + windowScrollDelta.left <= edgeOffset.left + offset.width
          ) {
            translate.x = this.width + this.marginOffset.x;

            if (this.newIndex == null) {
              this.newIndex = index;
            }
          }
        } else if (this.axis.y) {
          if (
            index > this.index &&
            sortingOffset.top + windowScrollDelta.top + offset.height >= edgeOffset.top
          ) {
            translate.y = -(this.height + this.marginOffset.y);
            this.newIndex = index;
          } else if (
            index < this.index &&
            sortingOffset.top + windowScrollDelta.top <= edgeOffset.top + offset.height
          ) {
            translate.y = this.height + this.marginOffset.y;
            if (this.newIndex == null) {
              this.newIndex = index;
            }
          }
        }

        setTranslate3d(node, translate);
        nodes[i].translate = translate;
      }

      if (this.newIndex == null) {
        this.newIndex = this.index;
      }
    }

    onAutoScroll = offset => {
      this.translate.x += offset.left;
      this.translate.y += offset.top;

      this.animateNodes();
    };

    getWrappedInstance() {
      return this.wrappedInstance.current;
    }

    getContainer() {
      const { getContainer } = this.props;

      if (typeof getContainer !== 'function') {
        // eslint-disable-next-line react/no-find-dom-node
        return findDOMNode(this);
      }

      return getContainer(config.withRef ? this.getWrappedInstance() : undefined);
    }

    isValidSortingTarget = event => {
      const { useDragHandle } = this.props;
      const { target } = event;
      const node = closest(target, el => el.sortableInfo != null);

      return (
        node &&
        node.sortableInfo &&
        !node.sortableInfo.disabled &&
        (useDragHandle ? isSortableHandle(target) : target.sortableInfo)
      );
    };

    render() {
      const ref = config.withRef ? this.wrappedInstance : null;

      return (
        <SortableContext.Provider value={this.sortableContextValue}>
          <WrappedComponent ref={ref} {...omit(this.props, omittedProps)} />
        </SortableContext.Provider>
      );
    }

    get helperContainer() {
      const { helperContainer } = this.props;

      if (typeof helperContainer === 'function') {
        return helperContainer();
      }

      return this.props.helperContainer || this.document.body;
    }

    get containerScrollDelta() {
      const { useWindowAsScrollContainer } = this.props;

      if (useWindowAsScrollContainer) {
        return { left: 0, top: 0 };
      }

      return {
        left: this.scrollContainer.scrollLeft - this.initialScroll.left,
        top: this.scrollContainer.scrollTop - this.initialScroll.top
      };
    }

    get windowScrollDelta() {
      return {
        left: this.contentWindow.pageXOffset - this.initialWindowScroll.left,
        top: this.contentWindow.pageYOffset - this.initialWindowScroll.top
      };
    }
  };
}
