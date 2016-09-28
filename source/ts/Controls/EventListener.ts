namespace CA {
    export class EventListener {
        public id: number;
        public event: string;
        public callback: Function;

        constructor (id: number, event: string, callback: Function) {
            this.id = id;
            this.event = event;
            this.callback = callback;
        }
    }
}
