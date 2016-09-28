namespace CA {
    export class Canvas {
        private parent: HTMLElement;
        private target: HTMLElement;

        private rule: Rule;

        private canvas: HTMLCanvasElement;

        public setRule (rule: Rule): void {
            this.rule = rule;
        }

        public start (): void { }
        public stop (): void { }
        public reset (): void { }

        constructor (parent: HTMLElement, rule: Rule) {
            this.rule = rule;

            this.parent = parent;
            this.target = document.createElement('div');
            this.parent.appendChild(this.target);
            this.target.id = 'ca-canvas';

            this.canvas = document.createElement('canvas');
            this.canvas.width = this.target.offsetWidth;
            this.canvas.height = this.target.offsetHeight;
            this.target.appendChild(this.canvas);
        }
    }
}
