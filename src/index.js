import React from "react";

const StoreContext = React.createContext({ setState: () => {} });

// provides {...state, setState} as context as well as render prop
// if the children prop is a function
class State extends React.Component {
  static defaultProps = {
    initialState: {}
  };

  state = {
    ...this.props.initialState,
    setState: update => this.setState(update)
  };

  render() {
    return (
      <StoreContext.Provider value={this.state}>
        <React.Fragment>
          {typeof this.props.children === "function"
            ? this.props.children(this.state)
            : this.props.children}
        </React.Fragment>
      </StoreContext.Provider>
    );
  }
}

class Observe extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <StoreContext.Consumer>{store => children(store)}</StoreContext.Consumer>
    );
  }
}

export { State, Observe };
