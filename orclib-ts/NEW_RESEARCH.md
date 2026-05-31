# NEW RESEARCH

Find a safer pattern to help refactoring DOM element rendering logic

## BACKGROUND RESEARCH

* shadow and light dom
* Custom html element subclasses

## QUESTION

Are subclassing html elements exposing too many apis, too many options, and making refactor bugs even with typescript?

## HYPOTHESIS

If multiple paths touch an element's normal API (e.g., innerHTML) and requires remediation to a new custom endpoint, then missed refactors in those paths will only be able to be isolated from the same future refactor bugs if the normal API is not exposed by the designated access point (So no subclassing of HTMLElement).

Example: access.innerHTML gets refactored to use access.message, if you miss one will typescript catch it?

## PRE-TEST

// Unsafe

class ReverseChronLog extends HTMLElement {
}
customElements.define('camera-log', ReverseChronLog);

var cameraLog = document.querySelector("camera-log");
cameraLog.innerHTML = newMessage + cameraLog.innerHTML;

// Safe

class ReverseChronLog
{
    id: string
    constructor(id: string) {
        this.id = id;
    }
    set innerHTML(value) {
        var el = document.getElementById(this.id);
        el.innerHTML = value + el.innerHTML;
    }
}

var cameraLog = new ReverseChronLog("cameraLog");
cameraLog.innerHTML = newMessage;


## TEST

// now refactor UNSAFE:

class ReverseChronLog extends HTMLElement {
    set message(value) {
        console.log(value);
        this.innerHTML = value + this.innerHTML;
    }
}
customElements.define('camera-log', ReverseChronLog);

// ref 1: gets remediated
var cameraLog = document.querySelector("camera-log");
cameraLog.message = newMessage;

// ref 2: missed remediation (And won't perform the new behavior of console log)
var cameraLog = document.querySelector("camera-log");
cameraLog.innerHTML = newMessage + cameraLog.innerHTML;

// now refactor SAFE:

class ReverseChronLog {
    id: string
    constructor(id: string) {
        this.id = id;
    }
    set message(value) {
        console.log(value);
        var el = document.getElementById(this.id);
        el.innerHTML = value + el.innerHTML;
    }
}

// ref 1: gets remediated
var cameraLog = new ReverseChronLog("cameraLog");
cameraLog.message = newMessage;

// ref 2: missed remediation (And fails to compile)
var cameraLog = new ReverseChronLog("cameraLog");
cameraLog.innerHTML = newMessage; // TypeScript Error!

