var s_snakeNodes = [1000]; //[ SnakeNode ]
var SnakeNode = Entity.extend({
	_sprite: null,
	_label: null,
	_parentId: 0,
	ctor: function(parent, parentId, textureName)
	{
		this._parentId = parentId;
		this._sprite = new cc.Sprite(textureName);
		parent.addChild(this._sprite);

		this._label = gl.GlCreateCusomLabel("", 13);
		this._sprite.addChild(this._label);
		this._label.setPosition(cc.p(15, 15));

		s_snakeNodes[this.GetId()] = this;
	},

	destroy: function()
	{
		this._sprite.removeFromParent();
		s_snakeNodes[this.GetId()] = null;
	},
	//set
	setScale: function(scale)
	{
		this._sprite.setScale(scale);
	},

	setLocalZorder_: function(zorder)
	{
		this._sprite.setLocalZOrder(zorder);
	},

	SetTexture: function(texture)
	{
		this._sprite.setTexture(texture);
	},

	setPosition_: function(pos)
	{
		this._sprite.setPosition(pos);

	},

	setColor_: function(color)
	{
		this._sprite.setColor(color);
	},
	//get
	getScale: function()
	{
		return this._sprite.getScale();
	},

	getParentId: function()
	{
		return this._parentId;
	},

	getPosition: function()
	{
		return this._sprite.getPosition();
	},

	getRadius: function()
	{
		return W(this._sprite) * 0.5 * this._sprite.getScale();
	},

	getSnakeNode: function(id)
	{
		var node = s_snakeNodes[id];
		if (node !== s_snakeNodes[s_snakeNodes.length-1])
			return node;
		else
			return null;
	}
});