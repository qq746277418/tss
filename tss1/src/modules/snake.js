var Snake = cc.Class.extend({
	_id: 0,
	_parent: null,
	_headPos: null,
	_dir: null,
	_aimDir: null,
	_currentLength: 0,
	_socre: 0,
	_width: 0,
	_rotateSpeed: PI*3,
	_moveDelta: 0.0,
	_clipPathDelta: 0.0,
	_viewRange: 150.0,
	_warnRange: 50.0, //警戒范围
	_intervalPathPoint: SNAKE_SCALE_MIN_PATH_INTERVAL,
	_initSpeed: 3,
	_curSpeedScale: 1.2,
	_normalAIUpdateDelta: 0.0,
	_nommalAIChangeDirDelta: 0.0,
	_died: false,
	_type: SnakeType.AI,

	_paths: [],
	//_bodies: [],

	ctor: function(parent, pos, dir, length)
	{
		this._id = EntityIndex++;
		//this._super();
		this._headPos = pos;
		this._dir = gl.pNormalize(dir);
		this._aimDir = dir;
		this._currentLength = length;
		this._score = LENGTH_TO_SCORE * length;
		this._color = cc.color(Math.random()*150+20, Math.random()*150+20, Math.random()*100+80);
		this._curSpeedScale = Math.random() + 1;
		this._paths = [];

		this._init(parent);
	},

	_init: function(parent)
	{
		if (parent == null) return false;
		this._parent = parent;
		for (var i = 0; i < this._currentLength; i++){
			var body = new SnakeNode(this._parent, this.getId(), "res/body.png");

			var pos = gl.pSub(this._headPos, gl.pMul(this._dir, this._initSpeed * i));
			this._paths.push(pos);
			if (body != 0)
				body.setColor_(this._color);
			body.setPosition_(pos);
			body.setLocalZOrder_(-i);
			body.setScale_(SankeScaleValue.fir);
			if (i == 0)
				this._width = body.getRadius();
		}
		
		return true;
	},

	setType: function(type)
	{
		this._type = type;
		var bodies = MapManager.getInstance().getSnakeNodes(this.getId());
		if (type == SnakeType.PLAYER)
			bodies[0].value.setTexture_("res/head.png");
		else
			bodies[0].value.setColor_(this._color);
	},

	setColor_: function(color)
	{
		this._color = color;
		var bodies = MapManager.getInstance().getSnakeNodes(this.getId());
		if (bodies){
			for (var i = 0; i < bodies.length; i++){
				if (i == 0 && this._type == SnakeType.PLAYER)
					continue;
				bodies[i].value.setColor_(this._color);
			}
		}
	},

	update: function(dt)
	{
		if (this._die) return;
		if (this.__checkDie())
			return ;
		if (this._type == SnakeType.AI)
			this.__updateNomalAI(dt);
		this.__rotate(dt);
		this.__move(dt);
		this.__setScale(dt);
		this.__checkEatFood(dt);
	},

	__updateNomalAI: function(dt)
	{
		this._normalAIUpdateDelta += dt;
		this._nommalAIChangeDirDelta -= dt;
		if (this._normalAIUpdateDelta < NORMAL_AI_UPDATE_INTERVAL) return;
		this._normalAIUpdateDelta -= NORMAL_AI_UPDATE_INTERVAL;

		var force = cc.p(0, 0);
		//avoid enities
		//for ()

		// avoid border
		if(this._headPos.x < this._warnRange || MAP_WIDTH - this._headPos.x < this._warnRange ) {
			force.x = this._headPos.x < this._warnRange ? 1 : -1;
		}
		if( this._headPos.y < this._warnRange || MAP_HEIGHT - this._headPos.y < this._warnRange ) {
			force.y = this._headPos.y < this._warnRange ? 1 : -1;
		}
		if(force.x != 0 || force.y != 0) {
			this.rotateTo( force );
			return;
		}

		// random move
		if(this._nommalAIChangeDirDelta < 0 ) {
			this._nommalAIChangeDirDelta = Math.random() * 5;

			var theta = Math.random() * 100 + 30;
			var prefix = Math.random() > 0.5 ? 1 : -1;
			this.rotateTo( cc.p( Math.cos( prefix * theta), Math.sin( prefix * theta)));
			return;
		}
	},

	__rotate: function(dt)
	{
		if (this._aimDir !== this._dir){
			var angle = Math.acos(gl.pDot(this._dir, this._aimDir));
			if (Math.abs(angle) <= dt* this._rotateSpeed){
				this._dir = this._aimDir;
			} else {
				var N = cc.p(this._dir.y, -this._dir.x);
				var aiDot = (gl.pDot(this._aimDir, N) > 0? -1 : 1) * dt * this._rotateSpeed;
				this._dir = cc.pRotateByAngle(this._dir, cc.p(0, 0), aiDot);
			}
		}
	},

	__move: function(dt)
	{
		this._moveDelta += dt;
		if (this._moveDelta >= SNAKE_MOVE_INTERVAL){
			this._moveDelta -= SNAKE_MOVE_INTERVAL;  
			for (var i = 0; i <= this._curSpeedScale; i++)
				this._paths.splice(0, 0, gl.pAdd(this._headPos, gl.pMul(this._dir, this._initSpeed*i)));
			this._headPos = this._paths[0];

			this.__moveBodies();
		}
		// this._clipPathDelta += dt;
		// if (this._clipPathDelta >= SNAKE_CLIP_PATH_INTERVAL){
		// 	this._clipPathDelta -= SNAKE_CLIP_PATH_INTERVAL;
		// }
	},

	__setScale: function(dt){
		var bodies = MapManager.getInstance().getSnakeNodes(this.getId());
		if (bodies == null) return;
		for (var i = 0; i < bodies.length; i++){
			if (this._currentLength < SnakeScaleLevel.fir)
				bodies[i].value.setScale_(SankeScaleValue.fir);
			else if (this._currentLength < SnakeScaleLevel.sec)
				bodies[i].value.setScale_(SankeScaleValue.sec);
			else if (this._currentLength < SnakeScaleLevel.thi)
				bodies[i].value.setScale_(SankeScaleValue.thi);
			else if (this._currentLength < SnakeScaleLevel.for)
				bodies[i].value.setScale_(SankeScaleValue.for);
			else if (this._currentLength < SnakeScaleLevel.fiv)
				bodies[i].value.setScale_(SankeScaleValue.fiv);
		}
		this._width = bodies[0].value.getRadius();
	},

	__moveBodies: function()
	{
		var pathIndex = 0;
		var length = this._currentLength;
		var bodies = MapManager.getInstance().getSnakeNodes(this.getId());
		if (bodies){
			for (var i = 0; i < this._paths.length; i++, pathIndex++){
				if (pathIndex % this._intervalPathPoint == 0){
					var curBody = pathIndex / this._intervalPathPoint;
					if (curBody+1 > length)
						return;
					bodies[curBody].value.setPosition_(this._paths[i]);
				}
			}
		}
	},

	__checkEatFood: function()
	{
		var foods = FoodManager.getInstance().getFoods();
		for (var key in foods){
			var food = foods[key];
			if (food){
				var distance = gl.pGetDistance(food.getPosition_(), this._headPos);
				if (food.isActive() && distance <= MAX_EAT_RANGE)
					food.beEaten(this._headPos, this.__onEatFood.bind(this));
			}
		}
	},

	__checkDie: function()
	{
		var snakes_ai = MapManager.getInstance().getSnakeArray();
		for (var i = 0; i < snakes_ai.length; i++){
			var bodies = MapManager.getInstance().getSnakeNodes(snakes_ai[i].id);
			if (bodies == null || snakes_ai[i].id == this.getId())
				continue;
			for (var j = 0; j < bodies.length; j++){
				var body = bodies[j].value;
				var distance = gl.pGetDistance(body.getPosition_(), this._headPos);
				if (distance < this._width + body.getRadius()){
					this.setDie();
					return true;
				}
			}
		}

		if (this._headPos.x < this._width || MAP_WIDTH - this._headPos.x < this._width){
			this.setDie();
			return true
		}
		if (this._headPos.y < this._width || MAP_HEIGHT - this._headPos.y < this._width){
			this.setDie();
			return true
		}
		return false;
	},

	__onEatFood: function(food)
	{
		if (this.isDead()) return;
		this._currentLength++;
		var body = new SnakeNode(this._parent, this.getId(), "res/head.png" );
		body.setColor_(this._color );
		body.setLocalZOrder_( -this._currentLength);
	},

	setDie: function()
	{
		this._die = true;
	},

	rotateTo: function(dir)
	{	
		this._aimDir = gl.pNormalize(dir);
	},

	getType: function()
	{
		return this._type;
	},

	getPosition_: function(){
		return this._paths[0];
	},

	getWoldPosition: function(){
		return this._parent.convertToWorldSpace(this.getPosition_());
	},

	setSpeedScale: function(scale){
		this._curSpeedScale = scale;
	},

	getBodies: function(){
		return this._bodies;
	},

	getColor_: function(){
		return this._color;
	},

	isDead: function(){
		return this._die;
	},

	getScore: function(){
		return this._socre;
	},

	getRadius: function(){
		return this._width;
	},

	getId: function()
	{
		return this._id;
	},

	destroy: function()
	{
		MapManager.getInstance().removeAllSnakeNodes(this.getId());
	}
});