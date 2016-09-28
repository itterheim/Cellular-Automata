namespace CA.Controls {
    export class BinaryInput extends EventCreator {
        private parent: HTMLElement;

        // private listeners: Function[] = [];

        private tiles: BinaryInputTile[] = [];
        private rule: Rule;

        public setRule (rule: Rule): void {
            this.rule = rule;
            let binary = this.rule.getBinary();
            for (let i = 0; i < binary.length; i++) {
                this.tiles[7 - i].setActive(binary[i] === '1');
            }
        }

        // public ruleChangeListener (listener: Function): void {
        //     this.listeners.push(listener);
        // }
        //
        // private ruleChanged (): void {
        //     for (let listener of this.listeners) {
        //         listener(this.rule);
        //     }
        // }

        constructor (parent: HTMLElement) {
            super();
            this.parent = parent;

            this.tiles[7] = new BinaryInputTile(this.parent, '111');
            this.tiles[6] = new BinaryInputTile(this.parent, '110');
            this.tiles[5] = new BinaryInputTile(this.parent, '101');
            this.tiles[4] = new BinaryInputTile(this.parent, '100');
            this.tiles[3] = new BinaryInputTile(this.parent, '011');
            this.tiles[2] = new BinaryInputTile(this.parent, '010');
            this.tiles[1] = new BinaryInputTile(this.parent, '001');
            this.tiles[0] = new BinaryInputTile(this.parent, '000');

            let self = this;
            let statusListener = function (value: string, active: boolean): void {
                let values: string = self.tiles.map(function (tile: BinaryInputTile): string {
                    return tile.isActive() ? '1' : '0';
                }).reverse().join('');

                self.rule.setBinary(values);
                self.fireEvent('rule-changed', self.rule);
            };

            for (let i = 0; i < this.tiles.length; i++) {
                this.tiles[i].registerEventListener('status-changed', statusListener);
            }
        }
    }
}
