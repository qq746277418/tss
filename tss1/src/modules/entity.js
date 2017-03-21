var Entity = cc.Class.extend({
	_id: 0,
	ctor: function()
	{
		//_id = EntityIndex++;
		//cc.log("index = ", _id);
	},

	getId: function()
	{
		return this._id;
	},

	getPosition_: function()
	{
		//子类重写
	},

	getRadius: function()
	{
		//子类重写
	}
});