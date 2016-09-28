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

        public oneDimensionalAutomata: Automata.OneDimensional;
        private timer: number;
        public startAutomata (): void {
            window.clearTimeout(this.timer);
            this.canvas.clear();

            this.canvas.setCellSize(1);
            // this.canvas.setWidth(9);
            let dataLength = this.canvas.setMaxDataWidth();
            let limit = this.canvas.getHeight() - 1;


            let self = this;
            let rule = new Rule(this.rule.getDecimal());
            this.oneDimensionalAutomata = new Automata.OneDimensional();
            this.oneDimensionalAutomata.setRule(rule);
            this.oneDimensionalAutomata.registerEventListener('new-generation', function (data: Automata.OneDimensionalData) {
                self.canvas.drawBinaryLine(data.generation, data.data);
                if (data.generation < limit) {
                    self.timer = window.setTimeout(function () {
                        self.oneDimensionalAutomata.nextGeneration();
                    }, 0);
                }
            });

            let initialData = [];
            for (let i = 0; i < dataLength; i++) {
                initialData.push(0);
            }
            initialData[Math.floor(initialData.length / 2)] = 1;
            this.oneDimensionalAutomata.start(initialData.join(''));
        }

        public test (): void {
            this.canvas.setCellSize(10);
            let self = this;
            let dataLength = this.canvas.setMaxDataWidth();
            let i = 0;
            let timer;

            let createData = function () {
                let binaryData = '';
                for (let j = 0; j < dataLength; j++) {
                    binaryData += Math.floor(Math.random() * 2);
                }
                self.canvas.drawBinaryLine(i, binaryData);

                if (i * self.canvas.getCellSize() > self.target.offsetHeight * 1.2) {
                    window.clearInterval(timer);
                    return;
                }

                i++;
            };
            timer = window.setInterval(createData, 100);
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

            this.canvas = new Canvas(this.target);

            // scroll canvas
            let self = this;
            this.target.addEventListener('wheel', function (e: WheelEvent) {
                self.target.scrollTop += e.deltaY / 2;
                self.target.scrollLeft += e.deltaX / 2;

                let verticalRatio = self.target.scrollTop / (self.target.scrollHeight - self.target.offsetHeight);
                let verticalTop = (self.target.offsetHeight - 5 - 5 - 50) * verticalRatio;

                let horizontalRatio = self.target.scrollLeft / (self.target.scrollWidth - self.target.offsetWidth);
                let horizontalLeft = (self.target.offsetWidth - 5 - 5 - 50) * horizontalRatio;

                scrollVertical.style.top = `${(self.target.scrollTop + 5 + verticalTop)}px`;
                scrollVertical.style.right = `${(5 - self.target.scrollLeft)}px`;

                scrollHorizontal.style.top = `${(self.target.scrollTop + self.target.offsetHeight - 10)}px`;
                scrollHorizontal.style.left = `${(self.target.scrollLeft + 5 + horizontalLeft)}px`;
            });

            // visibility of scrollbars
            let updateScollbarVisibility = function () {
                let horizontal = self.target.scrollWidth > self.target.offsetWidth;
                let vertical = self.target.scrollHeight > self.target.offsetHeight;
                if (vertical) scrollVertical.style.display = '';
                else scrollVertical.style.display = 'none';
                if (horizontal) scrollHorizontal.style.display = '';
                else scrollHorizontal.style.display = 'none';
            };
            updateScollbarVisibility();
            this.canvas.registerEventListener('canvas-size-changed', updateScollbarVisibility);

            // this.test();
            // this.startAutomata();
        }
    }
}
