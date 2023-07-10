// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import * as React from 'react';
import { findDOMNode } from 'react-dom';

export default function sortableHandle(WrappedComponent, config = { withRef: false }) {
  return class WithSortableHandle extends React.Component {
    componentDidMount() {
      // eslint-disable-next-line react/no-find-dom-node
      const node = findDOMNode(this);
      node.sortableHandle = true;
    }

    getWrappedInstance() {
      return this.wrappedInstance.current;
    }

    wrappedInstance = React.createRef();

    render() {
      const ref = config.withRef ? this.wrappedInstance : null;

      return <WrappedComponent ref={ref} {...this.props} />;
    }
  };
}

export function isSortableHandle(node) {
  return node.sortableHandle != null;
}
