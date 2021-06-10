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

        var self = this;
        this.subscribers.forEach(function(subscriber) {
            subscriber(self.value);
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
            function(subscriber) { return subscriber !== itemToUnsubscribe }
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

function useGlobalState(key, defaultValue) {

    if (typeof defaultValue === 'undefined') {
        defaultValue = null;
    }

    var [, setState] = useState();
    var globalState = store.getState(key, defaultValue);
    
    var currentState = globalState.getValue();

    function reRender() {
        setState({});
    }

    useEffect(function() {
        globalState.subscribe(reRender);
        return function() {
            globalState.unsubscribe(reRender);
        }
    });

    return [currentState, function(v) {globalState.setValue(v)}];

}

var store = new Store();

export { useGlobalState, store };