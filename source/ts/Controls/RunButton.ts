namespace  CA.Controls {
    export class RunButton extends EventCreator {
        private parent: HTMLElement;
        private target: HTMLElement;

        constructor (parent: HTMLElement) {
            super();
            this.parent = parent;
            this.target = document.createElement('button');
            this.parent.appendChild(this.target);

            let self = this;
            this.target.addEventListener('click', function () {
                self.fireEvent('click');
            });
        }
    }
}
