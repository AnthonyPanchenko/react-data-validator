// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

export default class Manager {
  refs = {};

  add(collection: Array<unknown>, ref: unknown) {
    if (!this.refs[collection]) {
      this.refs[collection] = [];
    }

    this.refs[collection].push(ref);
  }

  remove(collection, ref) {
    const index = this.getIndex(collection, ref);

    if (index !== -1) {
      this.refs[collection].splice(index, 1);
    }
  }

  isActive() {
    return this.active;
  }

  getActive() {
    return this.refs[this.active.collection].find(
      // eslint-disable-next-line
      ({ node }) => node.sortableInfo.index == this.active.index
    );
  }

  getIndex(collection, ref) {
    return this.refs[collection].indexOf(ref);
  }

  getOrderedRefs(collection = this.active.collection) {
    return this.refs[collection].sort(sortByIndex);
  }
}

function sortByIndex(
  {
    node: {
      sortableInfo: { index: index1 }
    }
  },
  {
    node: {
      sortableInfo: { index: index2 }
    }
  }
) {
  return index1 - index2;
}
