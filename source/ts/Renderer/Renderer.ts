namespace CA.Renderer {
    export class Renderer {
        private parent: HTMLElement;
        private target: HTMLElement;

        private rule: Rule;

        private canvas: Canvas;

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
            this.target.id = 'ca-renderer';

            this.canvas = new Canvas(this.target);

            // test
            this.canvas.setCellSize(1);
            let dataLength = this.canvas.setMaxDataWidth();
            let rows = this.canvas.getHeight();
            for (let i = 0; i < rows; i++) {
                let binaryData = '';
                for (let j = 0; j < dataLength; j++) {
                    binaryData += Math.floor(Math.random() * 2);
                }
                this.canvas.drawBinaryLine(i, binaryData);
            }
        }
    }
}
