namespace  CA.Controls {
    export class RunButton extends EventCreator {
        private parent: HTMLElement;
        private target: HTMLElement;

        private state: string = 'stopped';

        constructor (parent: HTMLElement) {
            super();
            this.parent = parent;
            this.target = document.createElement('button');
            this.target.className = this.state;
            this.parent.appendChild(this.target);

            let self = this;
            this.target.addEventListener('click', function () {
                // if (self.state === 'stopped') {
                //     self.state = 'playing';
                    self.fireEvent('play', 'play');
                // } else {
                //     self.state = 'stopped';
                //     self.fireEvent('stop', 'stop');
                // }

                self.target.className = self.state;
            });
        }
    }
}
