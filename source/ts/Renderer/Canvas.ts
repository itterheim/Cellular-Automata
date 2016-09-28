namespace CA.Renderer {
    export class Canvas extends EventCreator {
        private parent: HTMLElement;

        private canvas: HTMLCanvasElement;
        private context: CanvasRenderingContext2D;

        private cellSize: number = 1;
        private cellColor: string = '#04666b';

        private drawBinaryCell (right, top, value: string): void {
            this.context.save();
            this.context.fillStyle = value === '1' ? this.cellColor : '#fff';
            this.context.fillRect(right, top, this.cellSize, this.cellSize);
            this.context.restore();
        }

        public drawBinaryLine (line: number, binaryData: string): void {
            let top = line * this.cellSize;
            if ((line * this.cellSize + this.cellSize) > this.canvas.height) this.updateHeight();
            for (let i = 0; i < binaryData.length; i++) {
                this.drawBinaryCell(i * this.cellSize, top, binaryData[i]);
            }
        }

        public setCellSize (size: number): void {
            this.cellSize = size;
        }

        public getCellSize (): number {
            return this.cellSize;
        }

        public setWidth (width: number): void {
            this.canvas.width = width * this.cellSize;
            this.fireEvent('canvas-size-changed');
        }

        public setPxWidth (width: number): void {
            this.canvas.width = width;
            this.fireEvent('canvas-size-changed');
        }

        public setMaxDataWidth (): number {
            let dataLength = Math.floor(this.parent.offsetWidth / this.cellSize);
            this.canvas.width = dataLength * this.cellSize;
            this.fireEvent('canvas-size-changed');
            return dataLength;
        }

        public getWidth (): number {
            return Math.floor(this.canvas.width / this.cellSize);
        }

        public getHeight (): number {
            return Math.floor(this.canvas.height / this.cellSize);
        }

        public getPxWidth (width: number): number {
            return this.canvas.width;
        }

        public getPxHeight (width: number): number {
            return this.canvas.height;
        }

        public reset (): void {
            this.canvas.width = this.parent.offsetWidth;
            this.canvas.height = this.parent.offsetHeight;
            this.fireEvent('canvas-size-changed');
        }

        public clear (): void {
            this.context.save();
            this.context.fillStyle = '#fff';
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.restore();
        }

        private updateHeight (): void {
            let data = this.canvas.toDataURL();
            this.clear();
            this.canvas.height += this.parent.offsetHeight;

            let image = new Image();
            image.src = data;
            this.context.drawImage(image, 0, 0);

            this.fireEvent('canvas-size-changed');
        }

        constructor (parent: HTMLElement) {
            super();
            this.parent = parent;

            this.canvas = document.createElement('canvas');
            this.canvas.width = this.parent.offsetWidth;
            this.canvas.height = this.parent.offsetHeight;
            this.parent.appendChild(this.canvas);
            this.context = this.canvas.getContext('2d');
        }
    }
}
