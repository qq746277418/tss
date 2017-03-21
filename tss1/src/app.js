var self = null;
var HelloWorldLayer = cc.Layer.extend({
    _mapLayer:null,
    _schedule: new CSchedule(),
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
        gl.logDate("___2222__________________________")
        for( var i = 0; i < SNAKE_ENEMY_INIT_NUM; i++ ) {
            var posx = Math.random() * (MAP_WIDTH - 200);
            SnakeManager.getInstance().createSnake(cc.p(posx + 100, Math.random() * (MAP_HEIGHT - 200 ) + 100), cc.p(1,0), SNAKE_INIT_LENGTH, SnakeType.AI);
        }
        gl.logDate("___qqqqq__________________________")

        var foodLayer = new cc.Layer();
        this._mapLayer.addChild(foodLayer, 0);
        FoodManager.getInstance().setBodyParent(foodLayer);
        FoodManager.getInstance().initFoods(300);

        addNodeTouchEventListener(this, this.__nodeTouchEventListener);
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

        return true;
    },

    __nodeTouchEventListener: function(touch, event)
    {
        var SnakeFunc = function(){
            var snake = SnakeManager.getInstance().getSnake(event.node._playerId);
            if (snake) {
                var tWpos = event.node.convertToNodeSpace(event.location);
                var sWpos = event.node.convertToNodeSpace(snake.getWoldPosition());
                var dir = gl.pSub(tWpos, sWpos);
                snake.rotateTo(dir);
            }
        }
        if (event.name == "began"){
            SnakeFunc();
            return true;
        } else if (event.name == "moved"){
            SnakeFunc();
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

