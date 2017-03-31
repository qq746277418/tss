var SnakeAI = SnakeBase.extend({
	_warnRange: 50.0, //警戒范围
	_normalAIUpdateDelta: 0.0,
	_nommalAIChangeDirDelta: 0.0,
	ctor: function(parent, pos, dir)
	{
		this._super();
		

		this.__init();
	},
});