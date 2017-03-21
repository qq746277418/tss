var FoodIndex = 0;
var Food = cc.Class.extend({
	_id: 0,
	_type: null,
	_body: null,
	_pos: cc.p(0, 0),
	_radius: 0,
	_die: false,
	_active: true,
	_dieCallBack: null,
	ctor: function(parent, type, pos)
	{
		this._id = FoodIndex++;
		this._type = type;
		this._pos = pos;
		this.__init(parent);
	},

	__init: function(parent)
	{
		if (parent == null) return;
		this._body = new cc.Sprite("res/body.png");
		this._body.setColor(cc.color(125, 125, 125));
		this._body.setPosition(this._pos);
		parent.addChild(this._body); 

		if(this._type == FoodType.RANDOM ) {
        	this._body.setScale( 0.2);
		} else if( _type == FoodType.DIE_BODY ) {
			_body.setScale( 0.4);
		} else if( _type == FoodType.STAR ) {
	        this.__randomMove();
	        this.__randomColor();
	    }
	    this._radius = W(this._body) * 0.5 * this._body.getScale();
	},

	destroy: function()
	{
		if (this._body){
			this._body.removeFromParent();
			this._body = null;
		}
	},

	__randomMove: function()
	{
		var aim = cc.p( MAP_WIDTH * Math.random(), MAP_HEIGHT * Math.random());
	    var delay = gl.pGetLength(gl.pSub(aim, this.getPosition_())) / FOOD_STAR_SPEED;
	    var callfunc = cc.callFunc(this.__randomMove.bind(this));
	    this._body.runAction(cc.sequence(cc.moveTo(delay, aim), callfunc));
	},

	__randomColor: function()
	{
		var delay = 0.5;
    	this._body.setColor( cc.color( 255 * Math.random(), 255 * Math.random(), 255 * Math.random()));
    	var callfunc = cc.callFunc(this.__randomColor.bind(this));
    	this._body.runAction(cc.sequence(cc.delayTime(delay), callfunc));
	},

	beEaten: function(toPos, listener)
	{
		this._body.stopAllActions;
		this._active = false;
		var self = this;
		var func = function(){
			listener(self)
		}
		this._dieCallBack = func;
		var moveto = cc.moveTo(0.1, toPos);
		var callfunc = cc.callFunc(this.setDie.bind(this));
		this._body.runAction(cc.sequence(moveto, callfunc));
	},

	update: function(dt)
	{

	},

	//
	setDie: function()
	{
		if (this._dieCallBack)
			this._dieCallBack(this);
		this._active = false;
		this._die = true;
		//this._body.setVisible(false);
		//this.destroy();
		//给这个食物重置
		this.__reset();
	},

	__reset: function()
	{
		this._die = false;
		this._active = true;
		var pos = cc.p(Math.random() * MAP_WIDTH, Math.random() * MAP_HEIGHT);
		this._body.setPosition(pos);

	},

	//
	getId: function()
	{
		return this._id;
	},

	getScore: function()
	{
		if(this._type == FoodType.RANDOM ) {
	        return 1;
	    } else if(this._type == FoodType.DIE_BODY ) {
	        return 4;
	    } else if(this._type == FoodType.STAR ) {
	        return 6;
	    }
	    return 0;
	},

	isDead: function()
	{
		return this._die;
	},

	isActive: function(){
		return this._active;
	},

	getRadius: function()
	{
		return this._radius;
	},

	getType: function()
	{
		return this._type;
	},

	getPosition_: function()
	{
		return this._body.getPosition();
	}
});