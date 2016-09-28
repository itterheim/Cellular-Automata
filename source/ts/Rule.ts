namespace CA {
    export class Rule {
        private decimal: number;
        private binary: string;
        private conditions: boolean[] = [];

        public isActive (value: number): boolean {
            if (typeof this.conditions[value] === 'undefined') return false;
            return this.conditions[value];
        }

        public setDecimal (n: number): void {
            this.decimal = n;
            this.binary = this.fixBinaryLength(this.decimal.toString(2));
            this.updateConditions();
        }

        public setBinary (s: string) {
            this.binary = this.fixBinaryLength(s);
            this.decimal = parseInt(this.binary, 2);
            this.updateConditions();
        }

        public getDecimal (): number {
            return this.decimal;
        }

        public getBinary (): string {
            return this.binary;
        }

        public fixBinaryLength (s: string): string {
            if (s.length > 8) {
                s = s.slice(s.length - 8, s.length);
            } else if (s.length < 8) {
                while (s.length < 8) {
                    s = '0' + s;
                }
            }
            return s;
        }

        private updateConditions (): void {
            if (!this.binary || this.binary.length !== 8) return;
            for (let i = 0; i < this.binary.length; i++) {
                this.conditions[this.binary.length - i - 1] = this.binary[i] === '1';
            }
        }

        constructor (n: number = 0) {
            this.setDecimal(n);
        }
    }
}
