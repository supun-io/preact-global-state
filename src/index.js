import { useEffect, useState } from "preact/hooks";

function GlobalState(initialValue) {
    this.value = initialValue;  // Actual value of a global state
    this.subscribers = [];     // List of subscribers
    this.getValue = function () {
        return this.value;
    }
    this.setValue = function (newState) {
        if (this.getValue() === newState) {
            return
        }
        this.value = newState;
        this.subscribers.forEach(subscriber => {
            subscriber(this.value);
        });
    }
    this.subscribe = function (itemToSubscribe) {
        if (this.subscribers.indexOf(itemToSubscribe) > -1) {
            // Already subsribed
            return
        }
        this.subscribers.push(itemToSubscribe);
    }
    this.unsubscribe = function (itemToUnsubscribe) {
        this.subscribers = this.subscribers.filter(
            subscriber => subscriber !== itemToUnsubscribe
        );
    }
}

function Store() {

    this.value = {};

    this.init = function(obj) {
        for (var i in obj) {
            this.setState(i, obj[i]);
        }
    }

    this.getState = function(key, defaultValue) {
        if (this.value[key] === undefined) {
            this.setState(key, defaultValue);
        }
        return this.value[key];
    }

    this.setState = function(key, value) {
        this.value[key] = new GlobalState(value);
    }

}

function useGlobalState(key, defaultValue = null) {

    const [, setState] = useState();
    var globalState = store.getState(key, defaultValue);
    
    var currentState = globalState.getValue();

    function reRender() {
        setState({});
    }

    useEffect(() => {
        globalState.subscribe(reRender);
        return () => {
            globalState.unsubscribe(reRender);
        }
    });

    return [currentState, (v) => globalState.setValue(v)];

}

const store = new Store();

export { useGlobalState, store };