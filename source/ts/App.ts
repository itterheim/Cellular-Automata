namespace CA {
    export class App {
        private target: HTMLElement;
        private control: Controls.Control;
        private canvas: Canvas;

        constructor (selector: string) {
            this.target = <HTMLElement> document.querySelector(selector);
            if (!this.target) {
                console.error(`CA: ${selector} is not valid target;`);
                return;
            }

            let rule = new Rule(110);
            this.control =  new Controls.Control(this.target, rule);
            this.canvas =  new Canvas(this.target, rule);

            let self = this;
            this.control.registerEventListener('rule-changed', function (rule: Rule) {
                self.canvas.setRule(rule);
            });
            this.control.registerEventListener('start', function () {
                self.canvas.start();
            });
            this.control.registerEventListener('stop', function () {
                self.canvas.stop();
            });
            this.control.registerEventListener('reset', function () {
                self.canvas.reset();
            });
        }

        public run (): void {

        }
    }
}
