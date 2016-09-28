var CA;
(function (CA) {
    var App = (function () {
        function App(selector) {
            this.target = document.querySelector(selector);
            if (!this.target) {
                console.error("CA: " + selector + " is not valid target;");
                return;
            }
            var rule = new CA.Rule(110);
            this.control = new CA.Controls.Control(this.target, rule);
            this.canvas = new CA.Canvas(this.target, rule);
            var self = this;
            this.control.registerEventListener('rule-changed', function (rule) {
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
        App.prototype.run = function () {
        };
        return App;
    }());
    CA.App = App;
})(CA || (CA = {}));

var CA;
(function (CA) {
    var Canvas = (function () {
        function Canvas(parent, rule) {
            this.rule = rule;
            this.parent = parent;
            this.target = document.createElement('div');
            this.parent.appendChild(this.target);
            this.target.id = 'ca-canvas';
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.target.offsetWidth;
            this.canvas.height = this.target.offsetHeight;
            this.target.appendChild(this.canvas);
        }
        Canvas.prototype.setRule = function (rule) {
            this.rule = rule;
        };
        Canvas.prototype.start = function () { };
        Canvas.prototype.stop = function () { };
        Canvas.prototype.reset = function () { };
        return Canvas;
    }());
    CA.Canvas = Canvas;
})(CA || (CA = {}));

var CA;
(function (CA) {
    var EventCreator = (function () {
        function EventCreator() {
            this.lastId = 0;
            this.listeners = [];
        }
        EventCreator.prototype.registerEventListener = function (event, callback) {
            this.listeners.push(new CA.EventListener(this.lastId++, event, callback));
            return this.lastId;
        };
        EventCreator.prototype.removeEventListener = function (id) {
            for (var i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i].id !== id)
                    continue;
                this.listeners.splice(i, 1);
                return;
            }
        };
        EventCreator.prototype.fireEvent = function (event, data) {
            for (var i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i].event !== '*' && this.listeners[i].event !== event)
                    continue;
                this.listeners[i].callback(data);
            }
        };
        return EventCreator;
    }());
    CA.EventCreator = EventCreator;
})(CA || (CA = {}));

var CA;
(function (CA) {
    var Rule = (function () {
        function Rule(n) {
            if (n === void 0) { n = 0; }
            this.setDecimal(n);
        }
        Rule.prototype.setDecimal = function (n) {
            this.decimal = n;
            this.binary = this.fixBinaryLength(this.decimal.toString(2));
        };
        Rule.prototype.setBinary = function (s) {
            this.binary = this.fixBinaryLength(s);
            this.decimal = parseInt(this.binary, 2);
        };
        Rule.prototype.getDecimal = function () {
            return this.decimal;
        };
        Rule.prototype.getBinary = function () {
            return this.binary;
        };
        Rule.prototype.fixBinaryLength = function (s) {
            if (s.length > 8) {
                s = s.slice(s.length - 8, s.length);
            }
            else if (s.length < 8) {
                while (s.length < 8) {
                    s = '0' + s;
                }
            }
            return s;
        };
        return Rule;
    }());
    CA.Rule = Rule;
})(CA || (CA = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CA;
(function (CA) {
    var Controls;
    (function (Controls) {
        var BinaryInput = (function (_super) {
            __extends(BinaryInput, _super);
            // public ruleChangeListener (listener: Function): void {
            //     this.listeners.push(listener);
            // }
            //
            // private ruleChanged (): void {
            //     for (let listener of this.listeners) {
            //         listener(this.rule);
            //     }
            // }
            function BinaryInput(parent) {
                _super.call(this);
                // private listeners: Function[] = [];
                this.tiles = [];
                this.parent = parent;
                this.tiles[7] = new Controls.BinaryInputTile(this.parent, '111');
                this.tiles[6] = new Controls.BinaryInputTile(this.parent, '110');
                this.tiles[5] = new Controls.BinaryInputTile(this.parent, '101');
                this.tiles[4] = new Controls.BinaryInputTile(this.parent, '100');
                this.tiles[3] = new Controls.BinaryInputTile(this.parent, '011');
                this.tiles[2] = new Controls.BinaryInputTile(this.parent, '010');
                this.tiles[1] = new Controls.BinaryInputTile(this.parent, '001');
                this.tiles[0] = new Controls.BinaryInputTile(this.parent, '000');
                var self = this;
                var statusListener = function (value, active) {
                    var values = self.tiles.map(function (tile) {
                        return tile.isActive() ? '1' : '0';
                    }).reverse().join('');
                    self.rule.setBinary(values);
                    self.fireEvent('rule-changed', self.rule);
                };
                for (var i = 0; i < this.tiles.length; i++) {
                    this.tiles[i].registerEventListener('status-changed', statusListener);
                }
            }
            BinaryInput.prototype.setRule = function (rule) {
                this.rule = rule;
                var binary = this.rule.getBinary();
                for (var i = 0; i < binary.length; i++) {
                    this.tiles[7 - i].setActive(binary[i] === '1');
                }
            };
            return BinaryInput;
        }(CA.EventCreator));
        Controls.BinaryInput = BinaryInput;
    })(Controls = CA.Controls || (CA.Controls = {}));
})(CA || (CA = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CA;
(function (CA) {
    var Controls;
    (function (Controls) {
        var BinaryInputTile = (function (_super) {
            __extends(BinaryInputTile, _super);
            function BinaryInputTile(parent, value) {
                _super.call(this);
                this.active = false;
                this.parent = parent;
                this.value = value;
                this.target = document.createElement('div');
                this.target.id = "rule-" + this.value;
                this.target.classList.add('rule');
                for (var j = 0; j < 6; j++) {
                    var cell = document.createElement('div');
                    cell.classList.add('cell');
                    if (j < 3 && this.value[j] === '1')
                        cell.classList.add('active');
                    if (j === 4)
                        cell.classList.add('new');
                    this.target.appendChild(cell);
                }
                var self = this;
                this.target.addEventListener('click', function () {
                    self.setActive(!self.active);
                    self.fireEvent('status-changed', self.active);
                });
                this.parent.appendChild(this.target);
            }
            BinaryInputTile.prototype.setActive = function (active) {
                this.active = active;
                var cell = this.target.querySelector('div.new');
                if (this.active)
                    cell.classList.add('active');
                else
                    cell.classList.remove('active');
            };
            BinaryInputTile.prototype.isActive = function () {
                return this.active;
            };
            return BinaryInputTile;
        }(CA.EventCreator));
        Controls.BinaryInputTile = BinaryInputTile;
    })(Controls = CA.Controls || (CA.Controls = {}));
})(CA || (CA = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CA;
(function (CA) {
    var Controls;
    (function (Controls) {
        var Control = (function (_super) {
            __extends(Control, _super);
            function Control(parent, rule) {
                _super.call(this);
                this.parent = parent;
                this.rule = rule;
                this.render();
            }
            Control.prototype.render = function () {
                this.target = document.createElement('div');
                this.target.id = 'ca-control';
                this.parent.appendChild(this.target);
                this.binaryInput = new Controls.BinaryInput(this.target);
                this.decimalInput = new Controls.DecimalInput(this.target);
                this.runButton = new Controls.RunButton(this.target);
                var self = this;
                this.binaryInput.registerEventListener('rule-changed', function (rule) {
                    self.rule = rule;
                    self.decimalInput.setRule(self.rule);
                    self.fireEvent('rule-changed', self.rule);
                });
                this.decimalInput.registerEventListener('rule-changed', function (rule) {
                    self.rule = rule;
                    self.binaryInput.setRule(self.rule);
                    self.fireEvent('rule-changed', self.rule);
                });
                this.runButton.registerEventListener('*', function (action) {
                    console.debug(action);
                });
                this.binaryInput.setRule(this.rule);
                this.decimalInput.setRule(this.rule);
            };
            return Control;
        }(CA.EventCreator));
        Controls.Control = Control;
    })(Controls = CA.Controls || (CA.Controls = {}));
})(CA || (CA = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CA;
(function (CA) {
    var Controls;
    (function (Controls) {
        var DecimalInput = (function (_super) {
            __extends(DecimalInput, _super);
            function DecimalInput(parent) {
                _super.call(this);
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
                var self = this;
                var ruleChangeListener = function () {
                    var value = parseInt(this.value);
                    if (isNaN(value))
                        return;
                    self.rule.setDecimal(value);
                    self.fireEvent('rule-changed', self.rule);
                };
                // add event listeners
                this.input.addEventListener('change', ruleChangeListener);
                this.input.addEventListener('keyup', ruleChangeListener);
            }
            DecimalInput.prototype.setRule = function (rule) {
                this.rule = rule;
                this.input.value = this.rule.getDecimal().toString();
            };
            return DecimalInput;
        }(CA.EventCreator));
        Controls.DecimalInput = DecimalInput;
    })(Controls = CA.Controls || (CA.Controls = {}));
})(CA || (CA = {}));

var CA;
(function (CA) {
    var EventListener = (function () {
        function EventListener(id, event, callback) {
            this.id = id;
            this.event = event;
            this.callback = callback;
        }
        return EventListener;
    }());
    CA.EventListener = EventListener;
})(CA || (CA = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CA;
(function (CA) {
    var Controls;
    (function (Controls) {
        var RunButton = (function (_super) {
            __extends(RunButton, _super);
            function RunButton(parent) {
                _super.call(this);
                this.state = 'stopped';
                this.parent = parent;
                this.target = document.createElement('button');
                this.target.className = this.state;
                this.parent.appendChild(this.target);
                var self = this;
                this.target.addEventListener('click', function () {
                    if (self.state === 'stopped') {
                        self.state = 'playing';
                        self.fireEvent('play', 'play');
                    }
                    else {
                        self.state = 'stopped';
                        self.fireEvent('stop', 'stop');
                    }
                    self.target.className = self.state;
                });
            }
            return RunButton;
        }(CA.EventCreator));
        Controls.RunButton = RunButton;
    })(Controls = CA.Controls || (CA.Controls = {}));
})(CA || (CA = {}));
