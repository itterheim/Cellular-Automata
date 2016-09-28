var CA;
(function (CA) {
    var App = (function () {
        function App(selector) {
            this.target = document.querySelector(selector);
            if (!this.target) {
                console.error("CA: " + selector + " is not valid target;");
                return;
            }
        }
        App.prototype.run = function () {
            var rule = new CA.Rule(110);
            this.control = new CA.Controls.Control(this.target, rule);
            this.renderer = new CA.Renderer.Renderer(this.target, rule);
            var self = this;
            this.control.registerEventListener('start', function (rule) {
                self.renderer.setRule(new CA.Rule(rule.getDecimal()));
                self.renderer.startAutomata();
            });
        };
        return App;
    }());
    CA.App = App;
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
            this.conditions = [];
            this.setDecimal(n);
        }
        Rule.prototype.isActive = function (value) {
            if (typeof this.conditions[value] === 'undefined')
                return false;
            return this.conditions[value];
        };
        Rule.prototype.setDecimal = function (n) {
            this.decimal = n;
            this.binary = this.fixBinaryLength(this.decimal.toString(2));
            this.updateConditions();
        };
        Rule.prototype.setBinary = function (s) {
            this.binary = this.fixBinaryLength(s);
            this.decimal = parseInt(this.binary, 2);
            this.updateConditions();
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
        Rule.prototype.updateConditions = function () {
            if (!this.binary || this.binary.length !== 8)
                return;
            for (var i = 0; i < this.binary.length; i++) {
                this.conditions[this.binary.length - i - 1] = this.binary[i] === '1';
            }
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
    var Automata;
    (function (Automata) {
        var OneDimensional = (function (_super) {
            __extends(OneDimensional, _super);
            function OneDimensional() {
                _super.call(this);
                this.data = [];
            }
            OneDimensional.prototype.start = function (data, limit) {
                if (limit === void 0) { limit = Infinity; }
                this.data = [];
                this.limit = limit;
                var generation = new OneDimensionalData(0, data);
                this.data.push(generation);
                this.fireEvent('new-generation', generation);
                var i = 0;
                var self = this;
                this.timer = window.setInterval(function (n) {
                    if (i < self.limit)
                        self.nextGeneration();
                    else
                        self.stop();
                    i++;
                }, 0);
            };
            OneDimensional.prototype.stop = function () {
                window.clearInterval(this.timer);
            };
            OneDimensional.prototype.setRule = function (rule) {
                this.rule = rule;
            };
            OneDimensional.prototype.nextGeneration = function () {
                if (this.data.length === 0)
                    return;
                var previousGeneration = this.data[this.data.length - 1];
                var data = this.evolve(previousGeneration.data);
                var generation = new OneDimensionalData(previousGeneration.generation + 1, data);
                this.data.push(generation);
                this.fireEvent('new-generation', generation);
                return generation;
            };
            OneDimensional.prototype.evolve = function (data) {
                var evolved = '';
                for (var i = 0; i < data.length; i++) {
                    var value = this.getValue(data, i);
                    evolved += this.rule.isActive(value) ? '1' : '0';
                }
                return evolved;
            };
            // get cell and its neightbours => binary value (110) => decimal value (6)
            OneDimensional.prototype.getValue = function (data, position) {
                try {
                    var binary = "" + this.getCharacter(data, position - 1) + this.getCharacter(data, position) + this.getCharacter(data, position + 1);
                    return parseInt(binary, 2);
                }
                catch (error) {
                    console.error('error', error);
                    return 0;
                }
            };
            OneDimensional.prototype.getCharacter = function (data, position) {
                if (position < 0)
                    return this.getCharacter(data, data.length + position);
                if (position >= data.length)
                    return this.getCharacter(data, position - data.length);
                return data[position];
            };
            ;
            return OneDimensional;
        }(CA.EventCreator));
        Automata.OneDimensional = OneDimensional;
        var OneDimensionalData = (function () {
            function OneDimensionalData(generation, data) {
                this.generation = generation;
                this.data = data;
            }
            return OneDimensionalData;
        }());
        Automata.OneDimensionalData = OneDimensionalData;
    })(Automata = CA.Automata || (CA.Automata = {}));
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
                // wrapper
                this.target = document.createElement('div');
                this.target.id = 'ca-control';
                this.parent.appendChild(this.target);
                // create elemets
                this.binaryInput = new Controls.BinaryInput(this.target);
                this.decimalInput = new Controls.DecimalInput(this.target);
                this.runButton = new Controls.RunButton(this.target);
                // bindings
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
                this.runButton.registerEventListener('click', function (action) {
                    self.fireEvent('start', self.rule);
                });
                // set default rule
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
                this.parent = parent;
                this.target = document.createElement('button');
                this.parent.appendChild(this.target);
                var self = this;
                this.target.addEventListener('click', function () {
                    self.fireEvent('click');
                });
            }
            return RunButton;
        }(CA.EventCreator));
        Controls.RunButton = RunButton;
    })(Controls = CA.Controls || (CA.Controls = {}));
})(CA || (CA = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CA;
(function (CA) {
    var Renderer;
    (function (Renderer) {
        var Canvas = (function (_super) {
            __extends(Canvas, _super);
            function Canvas(parent) {
                _super.call(this);
                this.cellSize = 1;
                this.cellColor = '#04666b';
                this.parent = parent;
                this.canvas = document.createElement('canvas');
                this.canvas.width = this.parent.offsetWidth;
                this.canvas.height = this.parent.offsetHeight;
                this.parent.appendChild(this.canvas);
                this.context = this.canvas.getContext('2d');
            }
            Canvas.prototype.drawBinaryCell = function (right, top, value) {
                this.context.save();
                this.context.fillStyle = value === '1' ? this.cellColor : '#fff';
                this.context.fillRect(right, top, this.cellSize, this.cellSize);
                this.context.restore();
            };
            Canvas.prototype.drawBinaryLine = function (line, binaryData) {
                var top = line * this.cellSize;
                if ((line * this.cellSize + this.cellSize) > this.canvas.height)
                    this.updateHeight();
                for (var i = 0; i < binaryData.length; i++) {
                    this.drawBinaryCell(i * this.cellSize, top, binaryData[i]);
                }
            };
            Canvas.prototype.setCellSize = function (size) {
                this.cellSize = size;
            };
            Canvas.prototype.getCellSize = function () {
                return this.cellSize;
            };
            Canvas.prototype.setWidth = function (width) {
                this.canvas.width = width * this.cellSize;
                this.fireEvent('canvas-size-changed');
            };
            Canvas.prototype.setPxWidth = function (width) {
                this.canvas.width = width;
                this.fireEvent('canvas-size-changed');
            };
            Canvas.prototype.setMaxDataWidth = function () {
                var dataLength = Math.floor(this.parent.offsetWidth / this.cellSize);
                this.canvas.width = dataLength * this.cellSize;
                this.fireEvent('canvas-size-changed');
                return dataLength;
            };
            Canvas.prototype.getWidth = function () {
                return Math.floor(this.canvas.width / this.cellSize);
            };
            Canvas.prototype.getHeight = function () {
                return Math.floor(this.canvas.height / this.cellSize);
            };
            Canvas.prototype.getPxWidth = function (width) {
                return this.canvas.width;
            };
            Canvas.prototype.getPxHeight = function (width) {
                return this.canvas.height;
            };
            Canvas.prototype.reset = function () {
                this.canvas.width = this.parent.offsetWidth;
                this.canvas.height = this.parent.offsetHeight;
                this.fireEvent('canvas-size-changed');
            };
            Canvas.prototype.clear = function () {
                this.context.save();
                this.context.fillStyle = '#fff';
                this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.context.restore();
            };
            Canvas.prototype.updateHeight = function () {
                var data = this.canvas.toDataURL();
                this.clear();
                this.canvas.height += this.parent.offsetHeight;
                var image = new Image();
                image.src = data;
                this.context.drawImage(image, 0, 0);
                this.fireEvent('canvas-size-changed');
            };
            return Canvas;
        }(CA.EventCreator));
        Renderer.Canvas = Canvas;
    })(Renderer = CA.Renderer || (CA.Renderer = {}));
})(CA || (CA = {}));

var CA;
(function (CA) {
    var Renderer;
    (function (Renderer_1) {
        var Renderer = (function () {
            function Renderer(parent, rule) {
                this.rule = rule;
                this.parent = parent;
                this.target = document.createElement('div');
                this.parent.appendChild(this.target);
                this.target.id = 'ca-renderer';
                // scrollbars
                var scrollHorizontal = document.createElement('div');
                scrollHorizontal.id = 'ca-scroll-horizontal';
                this.target.appendChild(scrollHorizontal);
                var scrollVertical = document.createElement('div');
                scrollVertical.id = 'ca-scroll-vertical';
                this.target.appendChild(scrollVertical);
                // create canvas
                this.canvas = new Renderer_1.Canvas(this.target);
                // scroll canvas
                var self = this;
                var updateScrollbarPosition = function (e) {
                    if (e) {
                        self.target.scrollTop += e.deltaY / 2;
                        self.target.scrollLeft += e.deltaX / 2;
                    }
                    var verticalRatio = self.target.scrollTop / (self.target.scrollHeight - self.target.offsetHeight);
                    var verticalTop = (self.target.offsetHeight - 5 - 5 - 50) * verticalRatio;
                    var horizontalRatio = self.target.scrollLeft / (self.target.scrollWidth - self.target.offsetWidth);
                    var horizontalLeft = (self.target.offsetWidth - 5 - 5 - 50) * horizontalRatio;
                    scrollVertical.style.top = (self.target.scrollTop + 5 + verticalTop) + "px";
                    scrollVertical.style.right = (5 - self.target.scrollLeft) + "px";
                    scrollHorizontal.style.top = (self.target.scrollTop + self.target.offsetHeight - 10) + "px";
                    scrollHorizontal.style.left = (self.target.scrollLeft + 5 + horizontalLeft) + "px";
                };
                this.target.addEventListener('wheel', updateScrollbarPosition);
                // visibility of scrollbars
                var updateScollbarVisibility = function () {
                    var horizontal = self.target.scrollWidth > self.target.offsetWidth;
                    var vertical = self.target.scrollHeight > self.target.offsetHeight;
                    if (vertical)
                        scrollVertical.style.display = '';
                    else
                        scrollVertical.style.display = 'none';
                    if (horizontal)
                        scrollHorizontal.style.display = '';
                    else
                        scrollHorizontal.style.display = 'none';
                    updateScrollbarPosition();
                };
                updateScollbarVisibility();
                this.canvas.registerEventListener('canvas-size-changed', updateScollbarVisibility);
            }
            // public twoDimensionalAutomata: Automata.TwoDimensional; // Future
            Renderer.prototype.setRule = function (rule) {
                this.rule = rule;
            };
            Renderer.prototype.startAutomata = function () {
                var self = this;
                // stop execution of previous automata
                if (this.oneDimensionalAutomata)
                    this.oneDimensionalAutomata.stop();
                // reset canvas to last width and max visible height
                this.canvas.reset();
                // maximal visible width or user defined
                var dataLength = this.canvas.setMaxDataWidth();
                this.canvas.setWidth(dataLength);
                // prepare data
                var initialData = [];
                for (var i = 0; i < dataLength; i++) {
                    initialData.push(0);
                }
                initialData[Math.floor(initialData.length / 2)] = 1;
                // Automata
                this.oneDimensionalAutomata = new CA.Automata.OneDimensional();
                this.oneDimensionalAutomata.setRule(this.rule);
                this.oneDimensionalAutomata.registerEventListener('new-generation', function (data) {
                    self.canvas.drawBinaryLine(data.generation, data.data);
                });
                this.oneDimensionalAutomata.start(initialData.join(''), this.canvas.getHeight() - 1);
            };
            return Renderer;
        }());
        Renderer_1.Renderer = Renderer;
    })(Renderer = CA.Renderer || (CA.Renderer = {}));
})(CA || (CA = {}));
