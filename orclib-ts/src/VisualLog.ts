interface NodeInsertStrategy {
    insert(parentId: string, childElement: HTMLElement): void;
}

class ReverseChronologicalInsertStrategy implements NodeInsertStrategy {
    insert(parentId: string, childElement: HTMLElement) {
        document.querySelector(`#${parentId}`)
            ?.prepend(childElement);
    }
}

class ChronologicalInsertStrategy implements NodeInsertStrategy {
    insert(parentId: string, childElement: HTMLElement) {
        document.querySelector(`#${parentId}`)
            ?.appendChild(childElement);
    }
}


class VisualLogInternal {

    nodeInsertStrategy: NodeInsertStrategy;
    reverseNodeInsertStrategy: NodeInsertStrategy;
    id: string;

    constructor(
        nodeInsertStrategy: NodeInsertStrategy,
        reverseNodeInsertStrategy: NodeInsertStrategy,
        id: string
    ) {
        this.nodeInsertStrategy = nodeInsertStrategy;
        this.reverseNodeInsertStrategy = reverseNodeInsertStrategy;
        this.id = id;
    }

    public log(html: string) {
        let logEl = document.createElement("div");
        logEl.innerHTML = html;
        this.nodeInsertStrategy.insert(this.id, logEl);
    }

    public reverse() {
        const parent = document.querySelector(`#${this.id}`);
        if (parent) {
            parent
                .replaceChildren(...Array.from(parent.children).reverse());
        }
        var temp = this.nodeInsertStrategy;
        this.nodeInsertStrategy = this.reverseNodeInsertStrategy;
        this.reverseNodeInsertStrategy = temp;
    }


}

export class VisualLog {
    private readonly id: string;
    private readonly internalLog: VisualLogInternal;
    constructor(id: string) {
        this.internalLog = new VisualLogInternal(
            new ChronologicalInsertStrategy(),
            new ReverseChronologicalInsertStrategy(),
            id
        );
        this.id = id;
    }

    public log(html: string): VisualLog {
        this.internalLog.log(html);
        return this;
    }

    public reverse(): VisualLog {
        this.internalLog.reverse();
        return this;
    }
}
