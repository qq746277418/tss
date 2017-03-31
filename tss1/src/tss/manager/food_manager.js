var tss = tss || {}

var FoodManager = cc.Class.extend({
	_foodArray: [],

	//

	_foodVecs: [],
	//ui
	_parent: null,
	initFoods: function(parent)
	{
		this._parent = parent;
		//1.初始化300個普通食物 並且普通食物的數量不會減少
		for(var i = 0; i < 300; i++){
			this.__createFood();
		}
	},

	__createFood: function(){
		var cfood = new FoodBase(this._parent);
		this._foodArray[cfood.getId()] = cfood;
	},

	createBodyDieFood: function(color, pos, scale)
	{
		var cfood = new FoodBase(this._parent, FoodTypeEnum.body_die, pos, color, scale);
		this._foodArray[cfood.getId()] = cfood;
	},	


	getFoodArray: function()
	{
		return this._foodArray;
	},

	getFood: function(id)
	{
		return this._foodArray[id];
	},

	//独立的计算 （划分区域来计算）
	addFoodVec: function(food)
	{
		var pos = food.getPosition();
		var row = Math.floor(pos.x / FOOD_CONST_RADIUS);
		var col = Math.floor(pos.y / FOOD_CONST_RADIUS);
		if (this._foodVecs[row] == null)
			this._foodVecs[row] = [];
		if (this._foodVecs[row][col] == null)
			this._foodVecs[row][col] = [];
		this._foodVecs[row][col][food.getId()] = food;
	},

	getFoodVec: function(pos)
	{
		var row = Math.floor(pos.x / FOOD_CONST_RADIUS);
		var col = Math.floor(pos.y / FOOD_CONST_RADIUS);
		if (this._foodVecs[row] == null)
			return;
		if (this._foodVecs[row][col] == null)
			return; 

		var tmp = this._foodVecs[row][col];
		this._foodVecs[row][col] = null;
		return tmp;
	}
});

tss.food_manager = new FoodManager();