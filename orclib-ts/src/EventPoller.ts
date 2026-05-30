
export class EventPoller {

    polls: Record<string, boolean> = {};
    events: Record<string, Event> = {};

    public register(element: HTMLElement, eventType: string, key: string) {
        if (element != null) {
            element.addEventListener(eventType, e => {
                this.polls[key] = true;
                this.events[key] = e;
            });
            this.polls[key] = false;
        }
    }

    public polled(key: string): boolean {
        const p: boolean = this.polls[key];
        this.polls[key] = false;
        return p;
    }

    public event(key: string): Event {
        const event = this.events[key];
        delete this.events[key];
        return event;
    }
}
