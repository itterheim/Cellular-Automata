namespace CA.Controls {
    export class Control extends EventCreator {
        private parent: HTMLElement;
        private target: HTMLElement;

        private rule: Rule;

        private binaryInput: BinaryInput;
        private decimalInput: DecimalInput;
        private runButton: RunButton;

        private render (): void {
            this.target = document.createElement('div');
            this.target.id = 'ca-control';
            this.parent.appendChild(this.target);

            this.binaryInput = new BinaryInput(this.target);
            this.decimalInput = new DecimalInput(this.target);
            this.runButton = new RunButton(this.target);

            let self = this;
            this.binaryInput.registerEventListener('rule-changed', function (rule: Rule) {
                self.rule = rule;
                self.decimalInput.setRule(self.rule);
                self.fireEvent('rule-changed', self.rule);
            });
            this.decimalInput.registerEventListener('rule-changed', function (rule: Rule) {
                self.rule = rule;
                self.binaryInput.setRule(self.rule);
                self.fireEvent('rule-changed', self.rule);
            });
            this.runButton.registerEventListener('*', function (action: string) {
                console.debug(action);
            });

            this.binaryInput.setRule(this.rule);
            this.decimalInput.setRule(this.rule);
        }

        constructor (parent: HTMLElement, rule: Rule) {
            super();
            this.parent = parent;
            this.rule = rule;
            this.render();
        }
    }
}
