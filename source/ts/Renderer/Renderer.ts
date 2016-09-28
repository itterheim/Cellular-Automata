namespace CA.Renderer {
    export class Renderer {
        private parent: HTMLElement;
        private target: HTMLElement;

        private rule: Rule;
        private canvas: Canvas;

        public oneDimensionalAutomata: Automata.OneDimensional;
        // public twoDimensionalAutomata: Automata.TwoDimensional; // Future

        public setRule (rule: Rule): void {
            this.rule = rule;
        }

        public startAutomata (): void {
            let self = this;

            // stop execution of previous automata
            if (this.oneDimensionalAutomata) this.oneDimensionalAutomata.stop();

            // reset canvas to last width and max visible height
            this.canvas.reset();

            // maximal visible width or user defined
            let dataLength = this.canvas.setMaxDataWidth();
            this.canvas.setWidth(dataLength);

            // prepare data
            let initialData = [];
            for (let i = 0; i < dataLength; i++) {
                initialData.push(0);
            }
            initialData[Math.floor(initialData.length / 2)] = 1;

            // Automata
            this.oneDimensionalAutomata = new Automata.OneDimensional();
            this.oneDimensionalAutomata.setRule(this.rule);
            this.oneDimensionalAutomata.registerEventListener('new-generation', function (data: Automata.OneDimensionalData) {
                self.canvas.drawBinaryLine(data.generation, data.data);
            });
            this.oneDimensionalAutomata.start(initialData.join(''), this.canvas.getHeight() - 1);
        }

        constructor (parent: HTMLElement, rule: Rule) {
            this.rule = rule;

            this.parent = parent;
            this.target = document.createElement('div');
            this.parent.appendChild(this.target);
            this.target.id = 'ca-renderer';

            // scrollbars
            let scrollHorizontal = document.createElement('div');
            scrollHorizontal.id = 'ca-scroll-horizontal';
            this.target.appendChild(scrollHorizontal);
            let scrollVertical = document.createElement('div');
            scrollVertical.id = 'ca-scroll-vertical';
            this.target.appendChild(scrollVertical);

            // create canvas
            this.canvas = new Canvas(this.target);

            // scroll canvas
            let self = this;
            let updateScrollbarPosition = function (e?: WheelEvent) {
                if (e) {
                    self.target.scrollTop += e.deltaY / 2;
                    self.target.scrollLeft += e.deltaX / 2;
                }

                let verticalRatio = self.target.scrollTop / (self.target.scrollHeight - self.target.offsetHeight);
                let verticalTop = (self.target.offsetHeight - 5 - 5 - 50) * verticalRatio;

                let horizontalRatio = self.target.scrollLeft / (self.target.scrollWidth - self.target.offsetWidth);
                let horizontalLeft = (self.target.offsetWidth - 5 - 5 - 50) * horizontalRatio;

                scrollVertical.style.top = `${(self.target.scrollTop + 5 + verticalTop)}px`;
                scrollVertical.style.right = `${(5 - self.target.scrollLeft)}px`;

                scrollHorizontal.style.top = `${(self.target.scrollTop + self.target.offsetHeight - 10)}px`;
                scrollHorizontal.style.left = `${(self.target.scrollLeft + 5 + horizontalLeft)}px`;
            };
            this.target.addEventListener('wheel', updateScrollbarPosition);

            // visibility of scrollbars
            let updateScollbarVisibility = function () {
                let horizontal = self.target.scrollWidth > self.target.offsetWidth;
                let vertical = self.target.scrollHeight > self.target.offsetHeight;
                if (vertical) scrollVertical.style.display = '';
                else scrollVertical.style.display = 'none';
                if (horizontal) scrollHorizontal.style.display = '';
                else scrollHorizontal.style.display = 'none';
                updateScrollbarPosition();
            };
            updateScollbarVisibility();
            this.canvas.registerEventListener('canvas-size-changed', updateScollbarVisibility);
        }
    }
}
