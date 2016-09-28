namespace CA {
    export class EventCreator {
        private lastId = 0;
        private listeners: EventListener[] = [];

        public registerEventListener (event: string, callback: Function): number {
            this.listeners.push(new EventListener(this.lastId++, event, callback));
            return this.lastId;
        }

        public removeEventListener (id: number): void {
            for (let i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i].id !== id) continue;
                this.listeners.splice(i, 1);
                return;
            }
        }

        public fireEvent (event: string, data?: any): void {
            for (let i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i].event !== '*' && this.listeners[i].event !== event) continue;
                this.listeners[i].callback(data);
            }
        }
    }
}
