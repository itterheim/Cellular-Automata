namespace CA.Controls {
    export class BinaryInputTile extends EventCreator {
        private parent: HTMLElement;
        private target: HTMLElement;

        private value: string;
        private active: boolean = false;

        public setActive (active: boolean): void {
            this.active = active;
            let cell = this.target.querySelector('div.new');
            if (this.active) cell.classList.add('active');
            else cell.classList.remove('active');
        }

        public isActive (): boolean {
            return this.active;
        }

        constructor (parent: HTMLElement, value: string) {
            super();
            this.parent = parent;
            this.value = value;

            this.target = document.createElement('div');
            this.target.id = `rule-${this.value}`;
            this.target.classList.add('rule');

            for (let j = 0; j < 6; j++) {
                let cell = document.createElement('div');
                cell.classList.add('cell');
                if (j < 3 && this.value[j] === '1') cell.classList.add('active');
                if (j === 4) cell.classList.add('new');
                this.target.appendChild(cell);
            }

            let self = this;
            this.target.addEventListener('click', function () {
                self.setActive(!self.active);
                self.fireEvent('status-changed', self.active);
            });

            this.parent.appendChild(this.target);
        }
    }
}
