var func_rand_color = function()
{
	return cc.color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
}

var FoodCommon = FoodBase.extend({
	_sprite: null,
	_mwidth: 0,
	_mheight: 0,
	ctor: function(parent)
	{
		this._super();
		this._score = 1;
		this._type = FoodTypeEnum.rand;
		this._color = func_rand_color();
		this._scale = 0.1;
		this._pos = cc.p(Math.random() * MAP_WIDTH, Math.random() * MAP_HEIGHT);

		this._sprite = new cc.Sprite("res/body.png");
		this.addChild(this._sprite);
		this._sprite.setColor(this._color);
		this._sprite.setScale(this._scale);

		this._radius = W(this._sprite) * 0.5 * this._scale;

		this.__changePos(this._pos);
		parent.addChild(this);

		tss.map_manager.addNodeToRegion(REGION_TYPE_FOOD, this);
	},
});