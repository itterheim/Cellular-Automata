namespace CA.Controls {
    export class DecimalInput extends EventCreator {
        private parent: HTMLElement;
        private target: HTMLElement;
        private input: HTMLInputElement;

        private rule: Rule;

        public setRule (rule: Rule): void {
            this.rule = rule;
            this.input.value = this.rule.getDecimal().toString();
        }

        constructor (parent: HTMLElement) {
            super();
            this.parent = parent;

            this.target = document.createElement('div');
            this.target.classList.add('decimal');
            this.target.innerHTML = 'Rule: ';

            this.input = document.createElement('input');
            this.input.type = 'number';
            this.input.min = '0';
            this.input.max = '255';

            this.target.appendChild(this.input);
            this.parent.appendChild(this.target);


            // decimal input change
            let self = this;
            let ruleChangeListener = function () {
                let value = parseInt(this.value);
                if (isNaN(value)) return;

                self.rule.setDecimal(value);
                self.fireEvent('rule-changed', self.rule);
            };

            // add event listeners
            this.input.addEventListener('change', ruleChangeListener);
            this.input.addEventListener('keyup', ruleChangeListener);
        }
    }
}
