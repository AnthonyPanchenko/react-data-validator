
onstart = () => {
  this.minTranslate = {};
  this.maxTranslate = {};

  if (this.axis.x) {
    this.minTranslate.x =
      (isWindowScrollContainer ? 0 : containerBoundingRect.left) -
      this.boundingClientRect.left -
      this.width / 2;
    this.maxTranslate.x =
      (isWindowScrollContainer
        ? this.contentWindow.innerWidth
        : containerBoundingRect.left + containerBoundingRect.width) -
      this.boundingClientRect.left -
      this.width / 2;
  } else if (this.axis.y) {
    this.minTranslate.y =
      (isWindowScrollContainer ? 0 : containerBoundingRect.top) -
      this.boundingClientRect.top -
      this.height / 2;
    this.maxTranslate.y =
      (isWindowScrollContainer
        ? this.contentWindow.innerHeight
        : containerBoundingRect.top + containerBoundingRect.height) -
      this.boundingClientRect.top -
      this.height / 2;
  }
}

  handleSortEnd = event => {
    const { onSortEnd } = this.props;
    const {
      active: { collection }
    } = this.manager;
    const nodes = this.manager.getOrderedRefs();

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
  };

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
        edgeOffset = getEdgeOffset(node, this.container);
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

   containerScrollDelta() {
    const { isWindowScrollContainer } = this.props;

    if (isWindowScrollContainer) {
      return { left: 0, top: 0 };
    }

    return {
      left: this.scrollContainer.scrollLeft - this.initialScroll.left,
      top: this.scrollContainer.scrollTop - this.initialScroll.top
    };
  }

   windowScrollDelta() {
    return {
      left: this.contentWindow.pageXOffset - this.initialWindowScroll.left,
      top: this.contentWindow.pageYOffset - this.initialWindowScroll.top
    };
  }