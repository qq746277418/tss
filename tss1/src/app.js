var self = null;
var HelloWorldLayer = cc.Layer.extend({
    _mapLayer:null,
    _schedule: new CSchedule(),
    _touchYaoB: false,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        self = this;
        var size = cc.winSize;

        this._mapLayer = new cc.LayerColor(cc.color(255, 255, 255, 255), MAP_WIDTH, MAP_HEIGHT);
        this.addChild(this._mapLayer);
        var snakeLayer = new cc.Layer();
        this._mapLayer.addChild(snakeLayer, 1);
        SnakeManager.getInstance().setBodyParent(snakeLayer);
        this._playerId = SnakeManager.getInstance().createSnake(cc.p(200, 400), cc.p(1,0), 5, SnakeType.PLAYER);
        for( var i = 0; i < SNAKE_ENEMY_INIT_NUM; i++ ) {
            var posx = Math.random() * (MAP_WIDTH - 200);
            SnakeManager.getInstance().createSnake(cc.p(posx + 100, Math.random() * (MAP_HEIGHT - 200 ) + 100), cc.p(1,0), SNAKE_INIT_LENGTH, SnakeType.AI);
        }

        var foodLayer = new cc.Layer();
        this._mapLayer.addChild(foodLayer, 0);
        FoodManager.getInstance().setBodyParent(foodLayer);
        FoodManager.getInstance().initFoods(300);

        addNodeTouchEventListener(this, this.__nodeTouchEventListener.bind(this));
        this._schedule.start(0, 0.01, this.__updateListener);

        //
        var func = function(event){
            var snake = SnakeManager.getInstance().getSnake(self._playerId);
            if (event.name == "began"){
                snake.setSpeedScale(2);
            } else {
                snake.setSpeedScale(1);
            }
        }
        var button = gl.CreateButton({normal: "res/body.png", pressed: "res/body.png", touch_listener: func, target: this});
        this.addChild(button, 2);
        button.setPosition(cc.p(cc.winSize.width - 50, 50));

        //摇杆
        this._diZuo = new cc.Sprite("res/joystick1.png");
        this._diZuo.x = 100;
        this._diZuo.y = 100;
        this.addChild(this._diZuo);

        this._hKuai = new cc.Sprite("res/joystick2.png");
        this._hKuai.x = 100;
        this._hKuai.y = 100;
        this.addChild(this._hKuai);

        this._hkInitPos = cc.p(100, 100);

        this._radius = W(this._diZuo) / 2;

        return true;
    },

    __nodeTouchEventListener: function(touch, event)
    {
        var SnakeFunc = function(pos){
            var snake = SnakeManager.getInstance().getSnake(event.node._playerId);
            if (snake) {
                var tWpos = event.node.convertToNodeSpace(pos);
                var sWpos = event.node.convertToNodeSpace(snake.getWoldPosition());
                var dir = gl.pSub(tWpos, cc.p(100, 100));
                snake.rotateTo(dir);
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
        SnakeManager.getInstance().update(self._schedule.getDelayTime());
        FoodManager.getInstance().update(self._schedule.getDelayTime());

        var snake = SnakeManager.getInstance().getSnake(self._playerId);
        if (snake){
            var pos = self._mapLayer.convertToNodeSpace(snake.getWoldPosition());
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

