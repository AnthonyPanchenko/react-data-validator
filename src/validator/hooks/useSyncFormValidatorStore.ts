import lodash from 'lodash';
import { useRef, useState } from 'react';

export default function useValidationFieldState<TValue, TError = string>(
  initialSate: ValidationFieldMetaState<TError> & { initialValue: TValue }
): ValidationFieldStateManagerReturnType<TValue, TError> {
  const initialState = useRef<ValidationFieldMetaState<TError>>(initialSate);
  const initialValue = useRef<TValue | undefined>(initialSate.initialValue);

  const [value, setFieldValue] = useState<TValue | undefined>(initialSate.initialValue);
  const [fieldState, setFieldState] = useState<ValidationFieldMetaState<TError>>(initialSate);

  const setInitialFieldState = (
    state: Partial<ValidationFieldMetaState<TError> & { initialValue: TValue }>
  ) => {
    const generatedState = {
      isValid: state.isValid !== undefined ? state.isValid : !!initialState.current.isValid,
      isDirty: state.isDirty !== undefined ? state.isDirty : !!initialState.current.isDirty,
      isValidating:
        state.isValidating !== undefined ? state.isValidating : !!initialState.current.isValidating,
      isTouched: state.isTouched !== undefined ? state.isTouched : !!initialState.current.isTouched,
      errors: lodash.has(state, 'errors') ? state.errors : initialState.current.errors
    };

    initialState.current = generatedState;
    setFieldState(generatedState);

    if (lodash.has(state, 'initialValue')) {
      initialValue.current = state.initialValue;
      setFieldValue(state.initialValue);
    }
  };

  const resetFieldState = () => {
    setFieldState({ ...initialState.current });
    setFieldValue(initialValue.current);
  };

  return {
    value,
    initialValue: initialValue.current,
    fieldState,
    setFieldValue,
    setInitialFieldState,
    setFieldState,
    resetFieldState
  };
}

/*
function is(x: any, y: any) {
  return (
    (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y) // eslint-disable-line no-self-compare
  );
}

// function shallowEqual(objA: mixed, objB: mixed): boolean {
//   if (is(objA, objB)) {
//     return true;
//   }

//   if (
//     typeof objA !== 'object' ||
//     objA === null ||
//     typeof objB !== 'object' ||
//     objB === null
//   ) {
//     return false;
//   }

//   const keysA = Object.keys(objA);
//   const keysB = Object.keys(objB);

//   if (keysA.length !== keysB.length) {
//     return false;
//   }

//   // Test for A's keys different from B.
//   for (let i = 0; i < keysA.length; i++) {
//     const currentKey = keysA[i];
//     if (
//       !hasOwnProperty.call(objB, currentKey) ||
//       // $FlowFixMe[incompatible-use] lost refinement of `objB`
//       !is(objA[currentKey], objB[currentKey])
//     ) {
//       return false;
//     }
//   }

//   return true;
// }

const objectIs: (x: any, y: any) => boolean =
  // $FlowFixMe[method-unbinding]
  typeof Object.is === 'function' ? Object.is : is;

export default objectIs;


// Intentionally not using named imports because Rollup uses dynamic
// dispatch for CommonJS interop named imports.
const {useState, useEffect, useLayoutEffect, useDebugValue} = React;

let didWarnOld18Alpha = false;
let didWarnUncachedGetSnapshot = false;

export function useSyncExternalStore<T>(
  subscribe: (() => void) => () => void,
  getSnapshot: () => T,
  getServerSnapshot?: () => T,
): T {
  // Read the current snapshot from the store on every render. Again, this
  // breaks the rules of React, and only works here because of specific
  // implementation details, most importantly that updates are
  // always synchronous.
  const value = getSnapshot();
  if (__DEV__) {
    if (!didWarnUncachedGetSnapshot) {
      const cachedValue = getSnapshot();
      if (!is(value, cachedValue)) {
        console.error(
          'The result of getSnapshot should be cached to avoid an infinite loop',
        );
        didWarnUncachedGetSnapshot = true;
      }
    }
  }

  // Because updates are synchronous, we don't queue them. Instead we force a
  // re-render whenever the subscribed state changes by updating an some
  // arbitrary useState hook. Then, during render, we call getSnapshot to read
  // the current value.
  //
  // Because we don't actually use the state returned by the useState hook, we
  // can save a bit of memory by storing other stuff in that slot.
  //
  // To implement the early bailout, we need to track some things on a mutable
  // object. Usually, we would put that in a useRef hook, but we can stash it in
  // our useState hook instead.
  //
  // To force a re-render, we call forceUpdate({inst}). That works because the
  // new object always fails an equality check.
  const [{inst}, forceUpdate] = useState({inst: {value, getSnapshot}});

  // Track the latest getSnapshot function with a ref. This needs to be updated
  // in the layout phase so we can access it during the tearing check that
  // happens on subscribe.
  useLayoutEffect(() => {
    inst.value = value;
    inst.getSnapshot = getSnapshot;

    // Whenever getSnapshot or subscribe changes, we need to check in the
    // commit phase if there was an interleaved mutation. In concurrent mode
    // this can happen all the time, but even in synchronous mode, an earlier
    // effect may have mutated the store.
    if (checkIfSnapshotChanged(inst)) {
      // Force a re-render.
      forceUpdate({inst});
    }
  }, [subscribe, value, getSnapshot]);

  useEffect(() => {
    // Check for changes right before subscribing. Subsequent changes will be
    // detected in the subscription handler.
    if (checkIfSnapshotChanged(inst)) {
      // Force a re-render.
      forceUpdate({inst});
    }
    const handleStoreChange = () => {
      // TODO: Because there is no cross-renderer API for batching updates, it's
      // up to the consumer of this library to wrap their subscription event
      // with unstable_batchedUpdates. Should we try to detect when this isn't
      // the case and print a warning in development?

      // The store changed. Check if the snapshot changed since the last time we
      // read from the store.
      if (checkIfSnapshotChanged(inst)) {
        // Force a re-render.
        forceUpdate({inst});
      }
    };
    // Subscribe to the store and return a clean-up function.
    return subscribe(handleStoreChange);
  }, [subscribe]);

  useDebugValue(value);
  return value;
}

function checkIfSnapshotChanged<T>(inst: {
  value: T,
  getSnapshot: () => T,
}): boolean {
  const latestGetSnapshot = inst.getSnapshot;
  const prevValue = inst.value;
  try {
    const nextValue = latestGetSnapshot();
    return !is(prevValue, nextValue);
  } catch (error) {
    return true;
  }
}





// Intentionally not using named imports because Rollup uses dynamic dispatch
// for CommonJS interop.
const {useRef, useEffect, useMemo, useDebugValue} = React;

// Same as useSyncExternalStore, but supports selector and isEqual arguments.
export function useSyncExternalStoreWithSelector<Snapshot, Selection>(
  subscribe: (() => void) => () => void,
  getSnapshot: () => Snapshot,
  getServerSnapshot: void | null | (() => Snapshot),
  selector: (snapshot: Snapshot) => Selection,
  isEqual?: (a: Selection, b: Selection) => boolean,
): Selection {
  // Use this to track the rendered snapshot.
  const instRef = useRef<
    | {
        hasValue: true,
        value: Selection,
      }
    | {
        hasValue: false,
        value: null,
      }
    | null,
  >(null);
  let inst;
  if (instRef.current === null) {
    inst = {
      hasValue: false,
      value: null,
    };
    instRef.current = inst;
  } else {
    inst = instRef.current;
  }

  const [getSelection, getServerSelection] = useMemo(() => {
    // Track the memoized state using closure variables that are local to this
    // memoized instance of a getSnapshot function. Intentionally not using a
    // useRef hook, because that state would be shared across all concurrent
    // copies of the hook/component.
    let hasMemo = false;
    let memoizedSnapshot;
    let memoizedSelection: Selection;
    const memoizedSelector = (nextSnapshot: Snapshot) => {
      if (!hasMemo) {
        // The first time the hook is called, there is no memoized result.
        hasMemo = true;
        memoizedSnapshot = nextSnapshot;
        const nextSelection = selector(nextSnapshot);
        if (isEqual !== undefined) {
          // Even if the selector has changed, the currently rendered selection
          // may be equal to the new selection. We should attempt to reuse the
          // current value if possible, to preserve downstream memoizations.
          if (inst.hasValue) {
            const currentSelection = inst.value;
            if (isEqual(currentSelection, nextSelection)) {
              memoizedSelection = currentSelection;
              return currentSelection;
            }
          }
        }
        memoizedSelection = nextSelection;
        return nextSelection;
      }

      // We may be able to reuse the previous invocation's result.
      const prevSnapshot: Snapshot = (memoizedSnapshot: any);
      const prevSelection: Selection = (memoizedSelection: any);

      if (is(prevSnapshot, nextSnapshot)) {
        // The snapshot is the same as last time. Reuse the previous selection.
        return prevSelection;
      }

      // The snapshot has changed, so we need to compute a new selection.
      const nextSelection = selector(nextSnapshot);

      // If a custom isEqual function is provided, use that to check if the data
      // has changed. If it hasn't, return the previous selection. That signals
      // to React that the selections are conceptually equal, and we can bail
      // out of rendering.
      if (isEqual !== undefined && isEqual(prevSelection, nextSelection)) {
        return prevSelection;
      }

      memoizedSnapshot = nextSnapshot;
      memoizedSelection = nextSelection;
      return nextSelection;
    };
    // Assigning this to a constant so that Flow knows it can't change.
    const maybeGetServerSnapshot =
      getServerSnapshot === undefined ? null : getServerSnapshot;
    const getSnapshotWithSelector = () => memoizedSelector(getSnapshot());
    const getServerSnapshotWithSelector =
      maybeGetServerSnapshot === null
        ? undefined
        : () => memoizedSelector(maybeGetServerSnapshot());
    return [getSnapshotWithSelector, getServerSnapshotWithSelector];
  }, [getSnapshot, getServerSnapshot, selector, isEqual]);

  const value = useSyncExternalStore(
    subscribe,
    getSelection,
    getServerSelection,
  );

  useEffect(() => {
    // $FlowFixMe[incompatible-type] changing the variant using mutation isn't supported
    inst.hasValue = true;
    // $FlowFixMe[incompatible-type]
    inst.value = value;
  }, [value]);

  useDebugValue(value);
  return value;
}

*/
