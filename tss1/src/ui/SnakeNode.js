var SnakeNodeId = 0;
var SnakeNode = cc.Class.extend({
	_sprite: new cc.Sprite(),
	_label: new cc.Label("", "Arail", 20),
	_snakeId: 0,
	_currentScale: 1,
	ctor: function(parent, snake_id, texture_name)
	{	
		this._snakeId = snake_id;

		this._sprite = new cc.Sprite(texture_name);
		parent.addChild(this._sprite);
		
		this._label = new cc.Label("aaaaa", "Arail", 20);
		this._sprite.addChild(this._label);
		this._label.setPosition(cc.p(15, 15));

		MapManager.getInstance().insertSnakeNode(snake_id, SnakeNodeId++, this);
	},

	destroy: function()
	{
		this._sprite.removeFromParent()
		this._sprite = null;
	},

	setPosition_: function(pos){
		this._sprite.setPosition(pos);
	},

	//
	getScale_: function(){
		return this._sprite.getScale();
	},

	getSnakeId: function(){
		return this._snakeId;
	},

	getPosition_: function(){
		return this._sprite.getPosition();
	},

	getRadius: function(){
		return W(this._sprite) * this._currentScale;
	},
	//
	setScale_: function(scale){
		this._currentScale = scale;
		this._sprite.setScale(scale);
	},

	setLocalZOrder_: function(zorder){
		this._sprite.setLocalZOrder(zorder);
	},

	setColor_: function(color){
		this._sprite.setColor(color);
	},

	setTexture_: function(texture){
		this._sprite.setTexture(texture);
	}
})