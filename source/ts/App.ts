namespace CA {
    export class App {
        private target: HTMLElement;
        private control: Controls.Control;
        private renderer: Renderer.Renderer;

        constructor (selector: string) {
            this.target = <HTMLElement> document.querySelector(selector);
            if (!this.target) {
                console.error(`CA: ${selector} is not valid target;`);
                return;
            }
        }

        public run (): void {
            let rule = new Rule(110);
            this.control =  new Controls.Control(this.target, rule);
            this.renderer =  new Renderer.Renderer(this.target, rule);

            let self = this;
            this.control.registerEventListener('start', function (rule: Rule) {
                self.renderer.setRule(new Rule(rule.getDecimal()));
                self.renderer.startAutomata();
            });
        }
    }
}
