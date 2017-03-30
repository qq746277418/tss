var FoodTypeEnum = {
	rand: 0,  //最普通的
	star: 1,  //星星，用于扩展
	body_die: 2 //蛇的尸体
}

var FoodBase = cc.Node.extend({
	_id: 0,
	_type: 0,
	_scale: 0.15,
	_color: null,
	_pos: cc.p(0, 0),
	_radius: 0,
	_active: true,
	_dieCallback: null,

	//ui
	_parent: null,
	ctor: function(parent, type, pos, color, scale)
	{
		this._super();
		this._id = randBaseIndex++;

		this._score = 1;
		this._type = type || FoodTypeEnum.rand;
		this._color = color || func_rand_color();
		this._scale = scale || 0.1;
		this._pos = pos || cc.p(Math.random() * MAP_WIDTH, Math.random() * MAP_HEIGHT);

		this._sprite = new cc.Sprite("res/body.png");
		this.addChild(this._sprite);
		this._sprite.setColor(this._color);
		this._sprite.setScale(this._scale);

		this._radius = W(this._sprite) * 0.5 * this._scale;

		this.__changePos(this._pos);
		parent.addChild(this);

		//tss.map_manager.addNodeToRegion(REGION_TYPE_FOOD, this);
		tss.food_manager.addFoodVec(this);
	},

	destroy: function()
	{
		//tss.map_manager.removeNodeFromRegion(REGION_TYPE_FOOD, this);
		this.removeFromParent();
	},

	beEaten: function(toPos, listener)
	{
		this.stopAllActions;
		this._active = false;
		var self = this;
		var func = function(){
			listener(self)
		}

		var moveto = cc.moveTo(0.1, toPos);
		this.runAction(cc.sequence(moveto, cc.callFunc(function(){
			self.setFoodDie();
			func();
		} )));
	},

	__changePos: function(pos)
	{
		this._pos = pos;
		this.setPosition(this._pos);
		//var vec = tss.food_manager.setFoodPVec(this)
	},

	setFoodDie: function()
	{
		//如果是普通食物则重置
		this.destroy();
		if (this._type == FoodTypeEnum.rand){
			tss.food_manager.__createFood();
		}
	},

	//get
	isActive: function()
	{
		return this._active;
	},

	getId: function()
	{
		return this._id;
	},

	getType: function()
	{
		return this._type;
	},

	getFoodType: function()
	{
		return this._type;
	},

	getFoodPosition: function()
	{
		return this._pos;
	},

	getRadius: function()
	{
		return this._radius;
	}
});