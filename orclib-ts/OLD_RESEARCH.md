# NEW RESEARCH

Find a new way to poll for events and avoid callbacks for the goal of writing imperative app code.

## BACKGROUND RESEARCH

* main / event loops
* game loop

We can categorize events into two categories:

1. events (or calbacks) that start processes (e.g., DOMContentLoaded, setInterval)
2. events that observe user actions (e.g., KeyPress, Click)

In an attempt to create imperative app code structure #2 is far easier than #1, as it could have a data structure that functions as an event poller. That is not possible with #1 which cannot be written without reactionary event callback code.

If the goal is imperative code for games in the browser, then even if you could abstract away #1 (process-invoking events) with a meta language, you shouldn't as it provides minimal callback possibly at the cost of structure clarity.

## QUESTION

Can JavaScript/TypeScript code be organized in such a way that user-behavior events may be handled by imperative-style application code that delegates to a library helper which can hide away the nested event callback structures?


## HYPOTHESIS

User-interaction events can be abstracted into an event poller in library code, removing callback nesting from the application code. In a game loop structure, polling will have lower response latency to mouse events than an alternate imperative implementation that uses global mouse event states to calculate mouse in element bounds conditions.

## TBD


v=${1:-game_}
cat  << EOF | orcJsLoad | orcJsExport fname

    // initialize game data
    var ${v}_gl_GameObject = {};

    // start game loop
    ` ./game-loop.wl ${v}_gl_ | orcJsLoop --ms 1000 `

EOF


// initialize file
eventPoller.add(playBtn, 'click');

// in game loop file
if (eventPoller.polled(playBtn, "click")) {
    // do something
}

which would be able to handle the callbacks inside the event poller lib helper rather than having callbacks in the app code, replacing:
 playBtn.addEventListener('click', () => { /*do something*/});
