# NEW RESEARCH

Look for a mechanism that restricts the same web style being defined in multiple locations.

## QUESTION

Can an element's declared style in static HTML (whether inline or via a css class) serve as the single source of truth for the web element's original or load state?

To understand why this matters, let me detail out a scenario where a sleeping element becomes awake. Usually an element has more than 2 states, but for this example we just need to consider 2 states: asleep and awake.

On load the element is sleeping and hidden with an inline style `visibility:hidden`. Knowing that the element can be re-hidden (and go back to sleep), you immediately put the code into a class stylesheet instead. You are then surprised to see while testing the code that even when hidden the element is taking up space and even preventing other elements from receiving click events. 

So now you decide to refactor to use a style of `display:none` to fix the space issue, which is no problem at all, because you used a class and you can just change it in the style sheet and you are done. But, this gives a false sense of security because the code is still referenced in two places: the static HTML element and in the JavaScript that resets it again.

After a while you then decide the class name is confusing and want to change it to a better name, and logically it makes sense that there is only one state of the style and you'd expect it's reference to exist in but one place, so you go looking for its one usage location in addition to the style definition and make the change. But now when you run the code it no longer works since the second reference location is still using the old name.

So the question really is, can we eliminate the second style reference entirely?

