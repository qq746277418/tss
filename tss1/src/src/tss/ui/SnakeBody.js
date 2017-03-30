var randBodyIndex = 0;
var SnakeBody = cc.Node.extend({
	_id: 0,
	_snakeId: 0,
	_radius: 0,
	_scale: 1,
	//ui
	ctor: function(parent, snake_id)
	{	
		this._super();
		this._id = randBodyIndex++;
		this._snakeId = snake_id;

		this._sprite = new cc.Sprite("res/body.png");
		this.addChild(this._sprite);

		this._radius = W(this._sprite) * 0.5 * this._scale;

		parent.addChild(this);

		tss.map_manager.addNodeToRegion(REGION_TYPE_SKANE, this);
		//tss.snake_manager.addSnakeBody(snake_id, this);
		tss.snake_manager.insertSnakeBodies(this);
	},

	destroy: function()
	{
		tss.map_manager.removeNodeFromRegion(REGION_TYPE_SKANE, this);
		tss.snake_manager.removeSnakeBodies(this);
		this.removeFromParent();
	},

	reFreshHeadTexture: function()
	{
		this._sprite.setTexture("res/head.png");
	},

	setBodyPosition: function(pos)
	{	
		this.setPosition(pos);
		tss.map_manager.refreshNodeRegion(REGION_TYPE_SKANE, this);
	},

	setBodyColor: function(color)
	{
		this._sprite.setColor(color);
	},

	setBodyScale: function(scale)
	{
		this._scale = scale;
		this.setScale(this._scale);
		this._radius = W(this._sprite) * 0.5 * this._scale;
	},
	//
	getId: function()
	{
		return this._id;
	},

	getRadius: function()
	{
		return this._radius;
	},

	getSnakeId: function()
	{
		return this._snakeId;
	}
});