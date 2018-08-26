# MDX-Observable

Interactive documents powered by Markdown, React, and Observables

Share state between JSX blocks in a [MDX](https://mdxjs.com/) document

- **Declarative** React automatically updates observers when data changes
- **Write with Markdown** store documents in plain text that can be revision-controlled

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Examples](#examples)
- [API](#api)
  - [Init](#init)
  - [Observe](#observe)
- [Alternatives](#alternatives)
- [Roadmap](#roadmap)
- [Potential Issues](#potential-issues)
  - [Usage outside MDX](#usage-outside-mdx)
  - [Warning about blank lines in JSX](#warning-about-blank-lines-in-jsx)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Examples

```
git clone git@github.com:alexkrolick/mdx-observable.git
cd mdx-observable
yarn install
yarn run demo
```

- [Counter](./demo/counter.mdx)
- [Simple Example](./demo/simple.mdx)
- [Complex Example](./demo/complex.mdx)

```jsx
// notebook.mdx
import { Init, Observe } from 'mdx-observable';

# Counter

<Init state={{ count: 0 }} />

<Observe>
  {({ setState }) => (
    <button onClick={() => setState(s => ({ count: s.count + 1 }))}>
      Click me
    </button>
  )}
</Observe>

The button has been clicked:

<Observe>
  { ({state}) => (<span>{state.count} times</span>) }
</Observe>
```

Example with a form, table, and graph running in [OK-MDX](https://github.com/jxnblk/ok-mdx):

<img width="1311" alt="screen shot 2018-08-25 at 11 33 32 pm" src="https://user-images.githubusercontent.com/1571667/44625478-a8dbd800-a8bf-11e8-8a27-4f56e89f40f2.png">


## API

### Init

Sets initial state for the Observe components.

Observers cannot render until an Init component is mounted.

There should only be one Init per page.

```js
<Init state={{}} />
```

Props:

- `state: Object` - initial state

### Observe

Component that re-renders when the global state changes.

Props:

- `children: ({state, setState, replaceState}) => React.Node`
  function that accepts an object with:
  - `state`: the global state
  - `setState`: function like React `setState`, can take an object or an updater function (`state => patch`); result is _shallow merged_ with current state
  - `replaceState`: function like Redux reducer; takes an object or an updater function (`state => newState`); result replaces the current state

```js
<Observe>
  {({ state, setState, replaceState }) => {
    return <div>Something</div>;
  }}
</Observe>
```

## Alternatives

Advantages of MDX-Observable over [Jupyter](https://jupyter.org/) or [ObservableHQ](https://beta.observablehq.com/scratchpad):

- No cells to run; entire document is live
- Interactivity powered by predictable one-way data flow
- Use standard JS imports and any React component
- Produces static bundles
- Edit using preferred JS tooling
- Bundle with anything that supports [MDX](https://mdxjs.com/getting-started/), like Webpack, Gatsby, Parcel, etc.

## Roadmap

- [ ] Some way to define functions inline. This might map well to the concept of "selectors" from Redux. Currently you can work around this gap by defining utilities in external JS files, but this makes it hard to write self-contained notebooks.

Possible API:

```js
<Init state={} selectors={{ selectCheapest: state => {/* compute */} }} />
```

- [ ] Better live-reload support. MDX utils like `ok-mdx` do a full remount when the live editor changes or navigation occures; we could add a `restoreKey` to persist a namespaced cache within the module.

- [ ] **Add tests**

## Potential Issues

### Usage outside MDX

Technically `mdx-observable` doesn't depend on MDX for anything, but since it uses a singleton for a cache, it is not a good fit for state management in an app.

### Warning about blank lines in JSX

Currently (Aug 2018) the MDX parser doesn't allow putting blank lines inside of JSX blocks. If you see an error about "adjacent elements", this is probably why.

## License

See [LICENSE](./LICENSE)
