This is a simple version (79 lines, 200 bytes minified gziped) of [React state-pool](https://github.com/yezyilomo/state-pool). This only contains one Preact hook, `useGlobalState` that can be used to set/get global state.

## Installing

```
npm install preact-global-state
```

## Usage

```js
import { store, useGlobalState } from 'preact-global-state';

store.init({
    name: "Ghost"
});

function App() {
    const [name, setName] = useGlobalState('name');

    return (
        <div>
            The Name: { name }
        </div>
        <button onClick={() => setName('Another name')}></button>
    )
}

// another component
function Compo2() {
    const [name] = useGlobalState('name');

    return <div>{name}</div>
}
```

Whenever the button is clicked, all components that use the `name` globalState will be updated (Ex: Compo2).

* `store.init` sets the starting values.
* You can also set a default value as `useGlobalState(key, defaultValue)`, which will be used when a global state for that key is not defined.