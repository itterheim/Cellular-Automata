namespace CA.Automata {
    export class OneDimensional extends EventCreator {
        private rule: Rule;
        private data: OneDimensionalData[] = [];

        private limit: number;
        private timer: number;

        public start (data: string, limit: number = Infinity): void {
            this.data = [];
            this.limit = limit;
            let generation = new OneDimensionalData(0, data);
            this.data.push(generation);
            this.fireEvent('new-generation', generation);

            let i = 0;
            let self = this;
            this.timer = window.setInterval(function (n) {
                if (i < self.limit) self.nextGeneration();
                else self.stop();
                i++;
            }, 0);
        }

        public stop () {
            window.clearInterval(this.timer);
        }

        public setRule(rule: Rule): void {
            this.rule = rule;
        }

        public nextGeneration (): OneDimensionalData {
            if (this.data.length === 0) return;
            let previousGeneration = this.data[this.data.length - 1];

            let data = this.evolve(previousGeneration.data);

            let generation = new OneDimensionalData(previousGeneration.generation + 1, data);
            this.data.push(generation);
            this.fireEvent('new-generation', generation);

            return generation;
        }

        private evolve (data: string): string {
            let evolved = '';

            for (let i = 0; i < data.length; i++) {
                let value = this.getValue(data, i);
                evolved += this.rule.isActive(value) ? '1' : '0';
            }
            return evolved;
        }

        // get cell and its neightbours => binary value (110) => decimal value (6)
        private getValue (data: string, position: number): number {
            try {
                let binary = `${this.getCharacter(data, position - 1)}${this.getCharacter(data, position)}${this.getCharacter(data, position + 1)}`;
                return parseInt(binary, 2);
            } catch (error) {
                console.error('error', error);
                return 0;
            }
        }

        private getCharacter (data: string, position: number) {
            if (position < 0) return this.getCharacter(data, data.length + position);
            if (position >= data.length) return this.getCharacter(data, position - data.length);
            return data[position];
        };

        constructor () {
            super();
        }
    }

    export class OneDimensionalData {
        public generation: number;
        public data: string;
        constructor (generation: number, data: string) {
            this.generation = generation;
            this.data = data;
        }
    }
}
