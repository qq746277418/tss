var tss = tss || {}

var bodyIndex = 0;
var SnakeManager = cc.Class.extend({
	_snakeArray: [],
	_dieSnakeNum: 0,
	_snakeBodies: [],
	_snakeIdBodies: [],  //根据每条蛇id存储
	//ui
	_root: null,
	_parent: null,
	setGameRoot: function(croot)
	{
		this._root = croot;
	},

	setParent: function(parent)
	{
		this._parent = parent;
	},

	//检测用户
	updatePlayerDie: function(ret)
	{
		if (ret){
			this._root._snakePlayer = this.initPlayerSnake();
		}
	},

	initAISnakes: function(num)
	{
		if (num == 0) return;
		var num = num || 50;
		for (i = 0; i < num; i++){
			var posx = Math.random() * (MAP_WIDTH - 200);
			var pos = cc.p(posx + 100, Math.random() * (MAP_HEIGHT - 200 ) + 100);
			var dir = cc.p(1,0);
			var snake = new SnakeBase(this._parent, SnakeType.AI, pos, dir);
			this._snakeArray[snake.getId()] = snake;
		}
	},

	initPlayerSnake: function()
	{
		var snake = new SnakeBase(this._parent, SnakeType.PLAYER, cc.p(200, 200), cc.p(0, 0));
		this._snakeArray[snake.getId()] = snake;
		snake.bindUpdateScore(function(str){
			tss.snake_manager._root.updateScore(str);
		})
		return snake;
	},

	update: function(dt)
	{
		for (var key in this._snakeArray){
			if (this._snakeArray[key])
				this._snakeArray[key].update(dt);
		}
		this.removeDeadSnake();
	},

	removeDeadSnake: function()
	{
		for (var key in this._snakeArray){
			if (this._snakeArray[key] && this._snakeArray[key].isDead()){
				this._dieSnakeNum++;
				this.updatePlayerDie(this._snakeArray[key].getType() == SnakeType.PLAYER);
				this._snakeArray[key].removeAllBodies();
				this._snakeArray[key] = null;
			}
		}
		//死了多少條就加多少條出來
		this.initAISnakes(this._dieSnakeNum)
		this._dieSnakeNum = 0;
	},

	getSnakeArray: function(id)
	{
		return this._snakeArray;
	},


	//_snakeBodies
	//根据每条蛇id存储
	// addSnakeBody: function(id, node)
	// {
	// 	this._snakeIdBodies[id] = node;
	// },

	// getSnakeBodies: function(id)
	// {
	// 	return this._snakeIdBodies[id];
	// },


	insertSnakeBodies: function(node){
		this._snakeBodies[node.getId()] = node;
	},

	removeSnakeBodies: function(node)
	{
		this._snakeBodies[node.getId()] = null;
	},

	getSnakeNode: function(id)
	{
		return this._snakeBodies[id];
	}
});

tss.snake_manager = new SnakeManager();