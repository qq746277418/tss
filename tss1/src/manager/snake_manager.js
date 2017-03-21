var SnakeInstance = {
	_parent: null,
	_snakes: [], 
	_reviveInfo: [],

	setBodyParent: function(parent)
	{
		this._parent = parent;
	},

	createSnake: function(pos, dir, length, type)
	{	
		var snake = new Snake(this._parent, pos, dir, length);
		MapManager.getInstance().insertSnake(snake.getId(), snake);
		if (snake != null){
			snake.setType(type);
			this._snakes[snake.getId()] = snake;
			return snake.getId();
		} else
			return INVALID_ENTITY_ID;

	},

	getSnakeId: function()
	{
		for (var key in this._snakes){
			if (this._snakes[key] &&　this._snakes[key].getType() == SnakeType.PLAYER)
		 		return key;
		}
		return INVALID_ENTITY_ID;
	},

	update: function(dt)
	{
		this._removeDeadSnakes(dt);

		this._updateSnakes(dt);
	},

	_removeDeadSnakes: function(dt)
	{
		for (var key in this._snakes){
			var snake = this._snakes[key];
			if (snake && snake.isDead()){
				var data = {type: snake.getType(), color: snake.getColor_()};
				this._reviveInfo.push(data);
				snake.destroy();
				this._snakes[key] = null;
			}
		}
	},

	_updateSnakes: function(dt)
	{
		for (var key in this._snakes){
			if (this._snakes[key])
				this._snakes[key].update(dt);
		}
		for (var i = 0; i < this._reviveInfo.length-1; i++){
			var id = this.createSnake(
				cc.p(Math.random()*((MAP_WIDTH-200)+100), Math.random()*((MAP_HEIGHT - 200) + 100)),
				cc.p(Math.random(), Math.random()),
				SNAKE_INIT_LENGTH,
				this._reviveInfo[i].type
			)
			var snake = SnakeManager.getInstance().getSnake(id);
			if (snake)
				snake.setColor_(this._reviveInfo[i].color);
		}

		this._reviveInfo = [];
	},

	getSankes: function(){ return this._snakes; },
	getSnake: function(id){
		return this._snakes[id];
	}
}

var SnakeManager  = (function()
{
    var instance = null;
    function getSankeInstance ()
    {
        return SnakeInstance;
    }

    return {
        getInstance:function(){
            if(instance === null){
                instance = getSankeInstance();
            }
            return instance;
        }
    };
})();