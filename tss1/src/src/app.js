var self = null;
var HelloWorldLayer = cc.Layer.extend({
    _mapLayer:null,
    _schedule: new CSchedule(),
    _touchYaoB: false,

    _snakePlayer: null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        self = this;
        var size = cc.winSize;

        //ui
                //
        var func = function(event){
            if (event.name == "ended"){
                self._snakePlayer.setSpeedScale(1);
            } else {
                self._snakePlayer.setSpeedScale(2);
            }
        }
        var button = gl.createButton({normal: "res/joystick2.png", pressed: "res/joystick2.png", touch_listener: func, target: this});
        this.addChild(button, 2);
        button.setPosition(cc.p(cc.winSize.width - 50, 50));

        var socreF = new ccui.Text("当前得分: ", "Arial", 26);
        this.addChild(socreF, 10);
        socreF.setPosition(cc.p(cc.winSize.width - 140, cc.winSize.height - 50));
        socreF.setTextColor(cc.color(255, 144, 120));

        this._scoreLabel = new ccui.Text("0", "Arial", 26);
        this.addChild(this._scoreLabel, 10);
        this._scoreLabel.setPosition(cc.p(X(socreF) + W(socreF) + 5, cc.winSize.height - 50));
        this._scoreLabel.setTextColor(cc.color(255, 0, 0));

        //摇杆
        this._diZuo = new cc.Sprite("res/joystick1.png");
        this._diZuo.x = 100;
        this._diZuo.y = 100;
        this.addChild(this._diZuo, 10);

        this._hKuai = new cc.Sprite("res/joystick2.png");
        this._hKuai.x = 100;
        this._hKuai.y = 100;
        this.addChild(this._hKuai, 10);
        this._hkInitPos = cc.p(100, 100);
        this._radius = W(this._diZuo) / 2;

        //child control
        this._mapLayer = new cc.LayerColor(cc.color(255, 255, 255, 255), MAP_WIDTH, MAP_HEIGHT);
        this.addChild(this._mapLayer);

        var snakeLayer = new cc.Layer();
        this._mapLayer.addChild(snakeLayer, 1);
        tss.snake_manager.setParent(snakeLayer);
        tss.snake_manager.setGameRoot(this);
        tss.snake_manager.initAISnakes();
        this._snakePlayer = tss.snake_manager.initPlayerSnake();

        var foodLayer = new cc.Layer();
        this._mapLayer.addChild(foodLayer, 0);
        tss.food_manager.initFoods(foodLayer);

        addNodeTouchEventListener(this, this.__nodeTouchEventListener.bind(this));
        this._schedule.start(0, 0.01, this.__updateListener);

        return true;
    },

    updateScore: function(str)
    {
        this._scoreLabel.setString(str);
    },

    __nodeTouchEventListener: function(touch, event)
    {
        var SnakeFunc = function(pos){
            if (event.node._snakePlayer) {
                var tWpos = event.node.convertToNodeSpace(pos);
                var sWpos = event.node.convertToNodeSpace(event.node._snakePlayer.getWoldPosition());
                var dir = gl.pSub(tWpos, cc.p(100, 100));
                event.node._snakePlayer.rotateTo(dir);
            }
        }
        if (event.name == "began"){
            if (event.x < 100+this._radius && event.x > 100-this._radius && event.y < 100+this._radius && event.y > 100-this._radius){
                this._touchYaoB = true;
            }
            return true;
        } else if (event.name == "moved"){
            if (this._touchYaoB){
                var dis = gl.pGetDistance(this._hkInitPos, event.location);
                var numX = event.x - this._hkInitPos.x;
                var numY = event.y - this._hkInitPos.y;
                if (dis < this._radius){
                    this._hKuai.setPosition(event.location);
                    SnakeFunc(event.location);
                } else{
                    var bili = this._radius / dis;
                    //四大象限
                    var x = 0;
                    var y = 0;
                    if (numX > 0 && numY > 0){
                        x = (event.x - 100) * bili + 100;
                        y = (event.y - 100) * bili + 100;
                    } else if (numX < 0 && numY > 0){
                        x = 100 - (100 - event.x) * bili;
                        y = (event.y - 100) * bili + 100;
                    } else if (numX < 0 && numY < 0){
                        x = 100 - (100 - event.x) * bili;
                        y = 100 - (100 - event.y) * bili;
                    } else if (numX > 0 && numY < 0){
                        y = 100 - (100 - event.y) * bili;
                        x = (event.x - 100) * bili + 100;
                    }
                    
                    this._hKuai.setPosition(cc.p(x, y));
                    SnakeFunc(cc.p(x, y));
                }
            }
        } else if (event.name == "ended"){
            this._touchYaoB = false;
            this._hKuai.setPosition(this._hkInitPos);
        }
    },

    __updateListener: function(dt)
    {
        tss.snake_manager.update(self._schedule.getDelayTime())

        if (self._snakePlayer){
            var pos = self._mapLayer.convertToNodeSpace(self._snakePlayer.getWoldPosition());
            var size = cc.winSize;
            var offset = gl.pSub(pos, cc.p(size.width * 0.5, size.height * 0.5));
            var tmpx = MAP_WIDTH - size.width < offset.x ? MAP_WIDTH - size.width : offset.x;
            offset.x = tmpx > 0 ? tmpx: 0;
            var tmpy = MAP_HEIGHT - size.height < offset.y ? MAP_HEIGHT - size.height : offset.y;
            offset.y = tmpy > 0 ? tmpy: 0;　
            self._mapLayer.setPosition(cc.p(-offset.x, -offset.y));
        }
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

