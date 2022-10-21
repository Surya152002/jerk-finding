var Piece = function(parent, jerk, duration) {
    if (Array.isArray(parent)) {
        parent = parent[parent.length - 1];
    }
    this.jerk = jerk;
    if (parent) {
        this.t0 = parent.t1;
        this.t1 = this.t0 + duration;
        this.a0 = parent.a(this.t0);
        this.v0 = parent.v(this.t0);
        this.x0 = parent.x(this.t0);
    } else {
        this.t0 = 0;
        this.t1 = duration;
        this.a0 = 0;
        this.v0 = 0;
        this.x0 = 0;
    }
}

Piece.prototype.hasT = function(t) {
    return t >= this.t0 && t < this.t1;
}

Piece.prototype.j = function(t) {
    return this.jerk;
}

Piece.prototype.a = function(t) {
    t -= this.t0;
    return this.a0 + this.jerk * t;
}

Piece.prototype.v = function(t) {
    t -= this.t0;
    return this.v0 + this.a0 * t + this.jerk * t * t / 2;
}

Piece.prototype.x = function(t) {
    t -= this.t0;
    return this.x0 + this.v0 * t + this.a0 * t * t / 2 + this.jerk * t * t * t / 6;
}

function f(pieces, n, t) {
    for (var i = 0; i < pieces.length; i++) {
        if (pieces[i].hasT(t) || i == pieces.length - 1) {
            switch (n) {
                case 0: return pieces[i].x(t);
                case 1: return pieces[i].v(t);
                case 2: return pieces[i].a(t);
                case 3: return pieces[i].j(t);
                default: return 0;
            }
        }
    }
    return 0;
}

var Controls = function() {
    this.d0 = 1;
    this.d1 = 1;
    this.d2 = 1;
    this.d3 = 1;
    this.d4 = 1;
    this.d5 = 1;
    this.s0 = 1;
    this.s1 = 0;
    this.s2 = -1;
    this.s3 = -1;
    this.s4 = 0;
    this.s5 = 1;
};

var controls = new Controls();

function setup() {
    var gui = new dat.GUI();
    gui.add(controls, 'd0', 0, 2).name('duration 0');
    gui.add(controls, 'd1', 0, 2).name('duration 1');
    gui.add(controls, 'd2', 0, 2).name('duration 2');
    gui.add(controls, 'd3', 0, 2).name('duration 3');
    gui.add(controls, 'd4', 0, 2).name('duration 4');
    gui.add(controls, 'd5', 0, 2).name('duration 5');
    gui.add(controls, 's0', -1, 1).step(1).name('jerk 0');
    gui.add(controls, 's1', -1, 1).step(1).name('jerk 1');
    gui.add(controls, 's2', -1, 1).step(1).name('jerk 2');
    gui.add(controls, 's3', -1, 1).step(1).name('jerk 3');
    gui.add(controls, 's4', -1, 1).step(1).name('jerk 4');
    gui.add(controls, 's5', -1, 1).step(1).name('jerk 5');
    createCanvas(windowWidth, windowHeight);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    var pieces = [];
    pieces.push(new Piece(pieces, controls.s0, controls.d0));
    pieces.push(new Piece(pieces, controls.s1, controls.d1));
    pieces.push(new Piece(pieces, controls.s2, controls.d2));
    pieces.push(new Piece(pieces, controls.s3, controls.d3));
    pieces.push(new Piece(pieces, controls.s4, controls.d4));
    pieces.push(new Piece(pieces, controls.s5, controls.d5));
    var duration = pieces[pieces.length - 1].t1;

    var ts = [0];
    for (var i = 0; i < pieces.length; i++) {
        ts.push(pieces[i].t1 - 0.001);
        ts.push(pieces[i].t1 + 0.001);
    }
    for (var i = 0; i < 32; i++) {
        ts.push(duration * i / 31);
    }
    ts.sort();

    background(0);

    noFill();
    strokeJoin(ROUND);

    strokeWeight(4);
    for (var n = 3; n >= 0; n--) {
        switch (n) {
            case 0: stroke(255); break;
            case 1: stroke(255, 0, 0); break;
            case 2: stroke(0, 255, 0); break;
            case 3: stroke(0, 0, 255); break;
        }
        beginShape();
        var scale = 64;
        for (var i = 0; i < ts.length; i++) {
            var t = ts[i];
            var x = t / duration * width;
            var y = height / 2 - f(pieces, n, t) * scale;
            vertex(x, y);
        }
        endShape();
    }

    strokeWeight(1);
    stroke(255);
    line(0, height / 2, width, height / 2);
}