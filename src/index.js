import React from "react";
import fromObs from "callbag-from-obs";
import observe from "callbag-observe";

const createObservableStore = (initialState = {}) => {
  let store = { ...initialState };
  let observers = [];

  const observable = {
    subscribe: observer => {
      observers.push(observer);
    },
    unsubscribe: observer => {
      observers = observers.filter(o => o !== observer);
    },
    notify: nextState => {
      observers.forEach(o => o.next(nextState));
    }
  };

  const source = fromObs(observable);

  return {
    getState: () => store,
    // like Redux reducer updates, must return whole next state object:
    replaceState: updateWith => {
      const nextValue =
        typeof updateWith === "function" ? updateWith(store) : updateWith;
      store = nextValue;
      observable.notify(store);
    },
    // like React setState, merges input with current state:
    setState: updateWith => {
      const partialValue =
        typeof updateWith === "function" ? updateWith(store) : updateWith;
      store = { ...store, ...partialValue };
      observable.notify(store);
    },
    source
  };
};

// store for internal values like initialization states:
let internalStore = createObservableStore({ hasInitRun: false });
// the exposed store:
let store = createObservableStore();

class Init extends React.Component {
  componentDidMount() {
    const { state } = this.props;
    if (internalStore.getState().hasInitRun) {
      internalStore.setState({ hasInitRun: false });
      // TODO: might add a "restoreKey" prop to namepace the inits
      // and allow restoring state across mdx live-reloads
      console.warn(
        "State was already initialized and is being reset. If this is unexpected, try adding a React key prop to the component to prevent it from remounting in place."
      );
    }
    store.replaceState(state);
    internalStore.setState({ hasInitRun: true });
  }

  componentWillUnmount() {
    internalStore.setState({ hasInitRun: false });
  }

  render() {
    return null;
  }
}

class Observe extends React.Component {
  constructor() {
    super();
    observe(this.handleUpdate)(internalStore.source);
    observe(this.handleUpdate)(store.source);
    this.unmounting = false;
  }

  componentWillUnmount() {
    this.unmounting = true;
  }

  handleUpdate = nextState => {
    // could use setState or some other mechanism here
    if (!this.unmounting) this.forceUpdate();
  };

  render() {
    const { children } = this.props;
    // TODO: could use React Suspense here
    if (internalStore.getState().hasInitRun === false) return null;
    return children({
      state: store.getState(),
      setState: store.setState,
      replaceState: store.replaceState
    });
  }
}

export { Init, Observe };
