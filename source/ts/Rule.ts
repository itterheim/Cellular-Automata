namespace CA {
    export class Rule {
        private decimal: number;
        private binary: string;

        public setDecimal (n: number): void {
            this.decimal = n;
            this.binary = this.fixBinaryLength(this.decimal.toString(2));
        }

        public setBinary (s: string) {
            this.binary = this.fixBinaryLength(s);
            this.decimal = parseInt(this.binary, 2);
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

        constructor (n: number = 0) {
            this.setDecimal(n);
        }
    }
}
