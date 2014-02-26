var $upSpeed,
tString,
pcString,
fSize,
fColor,
randVar = Math.floor((Math.random() * 8) + 1);
if (randVar < 9) {
    $upSpeed = 1.1;
    tString = 'Tap for at starte';
    pcString = 'Tryk space for at starte';
    fSize = 40;
    fColor = '#9ce659';
}
if (randVar >= 9) {
    $upSpeed = 2.2;
    tString = 'DOUBLE SPEED!';
    pcString = 'DOUBLE SPEED!';
    fSize = 60;
    fColor = '#DB0000';
}
var game = {
    data: {
        score: 0,
        steps: 0,
        start: !1,
        newHiScore: !1
    },
    onload: function () {
        return me.video.init('screen', 900, 600, !0, 'auto') ? (me.audio.init('mp3,ogg'), me.loader.onload = this.loaded.bind(this), me.loader.preload(game.resources), void me.state.change(me.state.LOADING))  : void alert('Your browser does not support HTML5 canvas.')
    },
    loaded: function () {
        me.state.set(me.state.MENU, new game.TitleScreen),
        me.state.set(me.state.PLAY, new game.PlayScreen),
        me.state.set(me.state.GAME_OVER, new game.GameOverScreen),
        me.input.bindKey(me.input.KEY.SPACE, 'fly', !0),
        me.input.bindTouch(me.input.KEY.SPACE),
        me.pool.register('clumsy', BirdEntity),
        me.pool.register('pipe', PipeEntity, !0),
        me.pool.register('hit', HitEntity, !0),
        me.game.viewport.setBounds(0, 0, 900, 600),
        me.state.change(me.state.MENU)
    }
};
game.resources = [
    {
        name: 'bg',
        type: 'image',
        src: 'data/img/bg.png'
    },
    {
        name: 'clumsy',
        type: 'image',
        src: 'data/img/clumsy.png'
    },
    {
        name: 'pipe',
        type: 'image',
        src: 'data/img/pipe.png'
    },
    {
        name: 'logo',
        type: 'image',
        src: 'data/img/logo.png'
    },
    {
        name: 'ground',
        type: 'image',
        src: 'data/img/ground.png'
    },
    {
        name: 'gameover',
        type: 'image',
        src: 'data/img/gameover.png'
    },
    {
        name: 'gameoverbg',
        type: 'image',
        src: 'data/img/gameoverbg.png'
    },
    {
        name: 'hit',
        type: 'image',
        src: 'data/img/hit.png'
    },
    {
        name: 'getready',
        type: 'image',
        src: 'data/img/getready.png'
    },
    {
        name: 'new',
        type: 'image',
        src: 'data/img/new.png'
    },
    {
        name: 'share',
        type: 'image',
        src: 'data/img/share.png'
    },
    {
        name: 'hit',
        type: 'audio',
        src: 'data/sfx/'
    },
    {
        name: 'lose',
        type: 'audio',
        src: 'data/sfx/'
    },
    {
        name: 'johnhitler',
        type: 'audio',
        src: 'data/sfx/'
    }
];
var BirdEntity = me.ObjectEntity.extend({
    init: function (a, b) {
        var c = {
        };
        c.image = me.loader.getImage('clumsy'),
        c.width = 85,
        c.height = 60,
        c.spritewidth = 85,
        c.spriteheight = 60,
        this.parent(a, b, c),
        this.alwaysUpdate = !0,
        this.gravity = 0.2,
        this.gravityForce = 0.01,
        this.maxAngleRotation = Number.prototype.degToRad(30),
        this.maxAngleRotationDown = Number.prototype.degToRad(90),
        this.renderable.addAnimation('flying', [
            0,
            1,
            2
        ]),
        this.renderable.addAnimation('idle', [
            0
        ]),
        this.renderable.setCurrentAnimation('flying'),
        this.animationController = 0,
        this.addShape(new me.Rect(new me.Vector2d(5, 5), 70, 50)),
        this.flyTween = new me.Tween(this.pos),
        this.flyTween.easing(me.Tween.Easing.Exponential.InOut)
    },
    update: function (a) {
        if (game.data.start) if (me.input.isKeyPressed('fly')) {
            this.gravityForce = 0.01;
            me.audio.play('hit');
            var b = this.pos.y;
            this.flyTween.stop(),
            this.flyTween.to({
                y: b - 72
            }, 100),
            this.flyTween.start(),
            this.renderable.angle = - this.maxAngleRotation
        } else this.gravityForce += 0.2,
        this.pos.y += me.timer.tick * this.gravityForce * $upSpeed,
        this.renderable.angle += Number.prototype.degToRad(3) * me.timer.tick * $upSpeed,
        this.renderable.angle > this.maxAngleRotationDown && (this.renderable.angle = this.maxAngleRotationDown);
        var c = me.game.collide(this);
        if (c) {
            if ('hit' != c.obj.type) return me.device.vibrate(500),
            me.state.change(me.state.GAME_OVER),
            !1;
            me.game.world.removeChildNow(c.obj),
            game.data.steps++,
            me.audio.play('johnhitler')
        } else {
            var d = me.game.viewport.height - 156,
            e = - 80;
            if (this.pos.y >= d || this.pos.y <= e) return me.state.change(me.state.GAME_OVER),
            !1
        }
        return this.parent(a)
    }
}),
PipeEntity = me.ObjectEntity.extend({
    init: function (a, b) {
        var c = {
        };
        c.image = me.loader.getImage('pipe'),
        c.width = 148,
        c.height = 1664,
        c.spritewidth = 148,
        c.spriteheight = 1664,
        this.parent(a, b, c),
        this.alwaysUpdate = !0,
        this.gravity = 5,
        this.updateTime = !1
    },
    update: function () {
        return this.pos.add(new me.Vector2d( - this.gravity * me.timer.tick * $upSpeed, 0)),
        this.pos.x < - 148 && me.game.world.removeChild(this),
        !0
    }
}),
PipeGenerator = me.Renderable.extend({
    init: function () {
        this.parent(new me.Vector2d, me.game.viewport.width, me.game.viewport.height),
        this.alwaysUpdate = !0,
        this.generate = 0,
        this.pipeFrequency = 92,
        this.pipeHoleSize = 1240,
        this.posX = me.game.viewport.width
    },
    update: function () {
        if (this.generate++ % this.pipeFrequency == 0) {
            var a = Number.prototype.random(me.video.getHeight() - 100, 200),
            b = a - me.video.getHeight() - this.pipeHoleSize,
            c = new me.pool.pull('pipe', this.posX, a),
            d = new me.pool.pull('pipe', this.posX, b),
            e = a - 100,
            f = new me.pool.pull('hit', this.posX, e);
            c.renderable.flipY(),
            me.game.world.addChild(c, 10),
            me.game.world.addChild(d, 10),
            me.game.world.addChild(f, 11)
        }
        return !0
    }
}),
HitEntity = me.ObjectEntity.extend({
    init: function (a, b) {
        var c = {
        };
        c.image = me.loader.getImage('hit'),
        c.width = 148,
        c.height = 60,
        c.spritewidth = 148,
        c.spriteheight = 60,
        this.parent(a, b, c),
        this.alwaysUpdate = !0,
        this.gravity = 5,
        this.updateTime = !1,
        this.type = 'hit',
        this.renderable.alpha = 0,
        this.ac = new me.Vector2d( - this.gravity, 0)
    },
    update: function () {
        return this.pos.add(this.ac),
        this.pos.x < - 148 && me.game.world.removeChild(this),
        !0
    }
}),
Ground = me.ObjectEntity.extend({
    init: function (a, b) {
        var c = {
        };
        c.image = me.loader.getImage('ground'),
        c.width = 900,
        c.height = 96,
        this.parent(a, b, c),
        this.alwaysUpdate = !0,
        this.gravity = 0,
        this.updateTime = !1,
        this.accel = new me.Vector2d( - 4, 0)
    },
    update: function () {
        return this.pos.add(this.accel),
        this.pos.x < - this.renderable.width && (this.pos.x = me.video.getWidth() - 10),
        !0
    }
}),
TheGround = Object.extend({
    init: function () {
        this.ground1 = new Ground(0, me.video.getHeight() - 96),
        this.ground2 = new Ground(me.video.getWidth(), me.video.getHeight() - 96),
        me.game.world.addChild(this.ground1, 11),
        me.game.world.addChild(this.ground2, 11)
    },
    update: function () {
        return !0
    }
});
game.HUD = game.HUD || {
},
game.HUD.Container = me.ObjectContainer.extend({
    init: function () {
        this.parent(),
        this.isPersistent = !0,
        this.collidable = !1,
        this.z = 1 / 0,
        this.name = 'HUD',
        this.addChild(new game.HUD.ScoreItem(5, 5))
    }
}),
game.HUD.ScoreItem = me.Renderable.extend({
    init: function (a, b) {
        this.parent(new me.Vector2d(a, b), 10, 10),
        this.stepsFont = new me.Font('gamefont', 80, '#000', 'center'),
        this.floating = !0
    },
    update: function () {
        return !0
    },
    draw: function (a) {
        game.data.start && me.state.isCurrent(me.state.PLAY) && this.stepsFont.draw(a, game.data.steps, me.video.getWidth() / 2, 10)
    }
});
var BackgroundLayer = me.ImageLayer.extend({
    init: function (a, b, c) {
        name = a,
        width = 900,
        height = 600,
        ratio = 1,
        this.fixed = c > 0 ? !1 : !0,
        this.parent(name, width, height, a, b, ratio)
    },
    update: function () {
        return this.fixed || (this.pos.x >= this.imagewidth - 1 && (this.pos.x = 0), this.pos.x += this.speed),
        !0
    }
}),
Share = me.GUI_Object.extend({
    init: function () {
        var a = {
        },
        b = me.video.getWidth() / 2 - 75,
        c = me.video.getHeight() / 2 + 200;
        a.image = 'share',
        a.spritewidth = 150,
        a.spriteheight = 75,
        this.parent(b, c, a)
    },
    onClick: function () {
        return window.open('https://www.facebook.com/pages/John-Hitler/1382767758658468?fref=ts')
    }
});
game.TitleScreen = me.ScreenObject.extend({
    init: function () {
        this.font = null
    },
    onResetEvent: function () {
        game.data.newHiScore = !1,
        me.game.world.addChild(new BackgroundLayer('bg', 1)),
        me.input.bindKey(me.input.KEY.ENTER, 'enter', !0),
        me.input.bindKey(me.input.KEY.SPACE, 'enter', !0),
        me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.ENTER),
        this.handler = me.event.subscribe(me.event.KEYDOWN, function (a) {
            'enter' === a && me.state.change(me.state.PLAY)
        });
        var a = me.loader.getImage('logo'),
        b = new me.SpriteObject(me.game.viewport.width / 2 - 170, - a, a);
        me.game.world.addChild(b, 10);
        new me.Tween(b.pos) .to({
            y: me.game.viewport.height / 2 - 100
        }, 1000) .easing(me.Tween.Easing.Exponential.InOut) .start();
        this.ground = new TheGround,
        me.game.world.addChild(this.ground, 11),
        me.game.world.addChild(new (me.Renderable.extend({
            init: function () {
                this.parent(new me.Vector2d, 100, 100),
                this.text = me.device.touch ? tString : pcString,
                this.font = new me.Font('gamefont', fSize, fColor)
            },
            update: function () {
                return !0
            },
            draw: function (a) {
                var b = this.font.measureText(a, this.text);
                this.font.draw(a, this.text, me.game.viewport.width / 2 - b.width / 2, me.game.viewport.height / 2 + 50)
            }
        })), 12)
    },
    onDestroyEvent: function () {
        me.event.unsubscribe(this.handler),
        me.input.unbindKey(me.input.KEY.ENTER),
        me.input.unbindKey(me.input.KEY.SPACE),
        me.input.unbindMouse(me.input.mouse.LEFT),
        me.game.world.removeChild(this.ground)
    }
}),
game.PlayScreen = me.ScreenObject.extend({
    init: function () {
        var a = me.device.ua.contains('Firefox') ? 0.3 : 0.5;
        me.audio.setVolume(a * 2.2),
        this.parent(this)
    },
    onResetEvent: function () {
        me.input.bindKey(me.input.KEY.SPACE, 'fly', !0),
        game.data.score = 0,
        game.data.steps = 0,
        game.data.start = !1,
        game.data.newHiscore = !1,
        me.game.world.addChild(new BackgroundLayer('bg', 1)),
        this.ground = new TheGround,
        me.game.world.addChild(this.ground, 11),
        this.HUD = new game.HUD.Container,
        me.game.world.addChild(this.HUD),
        this.bird = me.pool.pull('clumsy', 60, me.game.viewport.height / 2 - 100),
        me.game.world.addChild(this.bird, 10),
        me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.SPACE),
        this.getReady = new me.SpriteObject(me.video.getWidth() / 2 - 200, me.video.getHeight() / 2 - 100, me.loader.getImage('getready')),
        me.game.world.addChild(this.getReady, 11);
        new me.Tween(this.getReady) .to({
            alpha: 0
        }, 2000) .easing(me.Tween.Easing.Linear.None) .onComplete(function () {
            game.data.start = !0,
            me.game.world.addChild(new PipeGenerator, 0)
        }) .start()
    },
    onDestroyEvent: function () {
        this.HUD = null,
        this.bird = null,
        me.input.unbindKey(me.input.KEY.SPACE)
    }
}),
game.GameOverScreen = me.ScreenObject.extend({
    init: function () {
        this.savedData = null,
        this.handler = null
    },
    onResetEvent: function () {
        me.audio.play('lose'),
        this.savedData = {
            score: 507,
            steps: 507
        },
        me.save.add(this.savedData),
        me.save.topSteps || me.save.add({
            topSteps: game.data.steps
        }),
        game.data.steps > me.save.topSteps && (me.save.topSteps = game.data.steps, game.data.newHiScore = !0),
        me.input.bindKey(me.input.KEY.ENTER, 'enter', !0),
        me.input.bindKey(me.input.KEY.SPACE, 'enter', !1),
        me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.ENTER),
        this.handler = me.event.subscribe(me.event.KEYDOWN, function (a) {
            'enter' === a && me.state.change(me.state.MENU)
        });
        var a = me.loader.getImage('gameover');
        me.game.world.addChild(new me.SpriteObject(me.video.getWidth() / 2 - a.width / 2, me.video.getHeight() / 2 - a.height / 2 - 100, a), 12);
        var b = me.loader.getImage('gameoverbg');
        if (me.game.world.addChild(new me.SpriteObject(me.video.getWidth() / 2 - b.width / 2, me.video.getHeight() / 2 - b.height / 2, b), 10), me.game.world.addChild(new BackgroundLayer('bg', 1)), this.ground = new TheGround, me.game.world.addChild(this.ground, 11), this.share = new Share, me.game.world.addChild(this.share, 12), game.data.newHiScore) {
            var c = new me.SpriteObject(235, 355, me.loader.getImage('new'));
            me.game.world.addChild(c, 12)
        }
        this.dialog = new (me.Renderable.extend({
            init: function () {
                this.parent(new me.Vector2d, 100, 100),
                this.font = new me.Font('gamefont', 40, 'black', 'left'),
                this.steps = 'Score: ' + game.data.steps.toString(),
                this.topSteps = 'Rekord: ' + me.save.topSteps.toString()
            },
            update: function () {
                return !0
            },
            draw: function (a) {
                {
                    var b = this.font.measureText(a, this.steps);
                    this.font.measureText(a, this.topSteps),
                    this.font.measureText(a, this.score)
                }
                this.font.draw(a, this.steps, me.game.viewport.width / 2 - b.width / 2 - 60, me.game.viewport.height / 2),
                this.font.draw(a, this.topSteps, me.game.viewport.width / 2 - b.width / 2 - 60, me.game.viewport.height / 2 + 50)
            }
        })),
        me.game.world.addChild(this.dialog, 12)
    },
    onDestroyEvent: function () {
        me.event.unsubscribe(this.handler),
        me.input.unbindKey(me.input.KEY.ENTER),
        me.input.unbindKey(me.input.KEY.SPACE),
        me.input.unbindMouse(me.input.mouse.LEFT),
        me.game.world.removeChild(this.ground),
        this.font = null
    }
});
