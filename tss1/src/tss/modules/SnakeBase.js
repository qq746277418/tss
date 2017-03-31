var SnakeType = {
	PLAYER: 1,
	AI:     2
};

var SnakeBase = cc.Class.extend({
	_id: 0,
	_headPos: cc.p(0, 0),
	_dir: null,
	_aimDir: null,
	_currentLength: 0,  //当前
	_disLength: 0, 		//之前
	_socre: 0,
	_radius: 0,
	_scale: 0,
	_rotateSpeed: PI*3,
	_moveDelta: 0.0,
	_clipPathDelta: 0.0,
	_viewRange: 150.0,
	_intervalPathPoint: SNAKE_SCALE_MIN_PATH_INTERVAL,
	_initSpeed: 3,
	_curSpeedScale: 1.2,
	_died: false,
	_type: null,

	_warnRange: 50.0, //警戒范围
	_normalAIUpdateDelta: 0.0,
	_nommalAIChangeDirDelta: 0.0,

	_paths: [],
	_bodies: [],
	_eatRandFoodNum: 0,  //普通食物6个顶一个尸体
	//ui
	_parent: null,
	ctor: function(parent, type, pos, dir)
	{
		this._parent = parent;
		this._id =  cc.formatStr("snake_%d", randBaseIndex++);
		this._type = type;
		this._headPos = pos;
		this._scale = 0.2;
		this._dir = gl.pNormalize(dir);
		this._aimDir = dir;
		this._currentLength = SNAKE_INIT_LENGTH;
		this._score = LENGTH_TO_SCORE * this._currentLength;
		this._color = cc.color(Math.random()*150+20, Math.random()*150+20, Math.random()*100+80);
		this._curSpeedScale = Math.random() + 1;

		this._paths = [];
		this._bodies = [];

		this.__init();
	},

	destroy: function()
	{
		this.__removeAllBodies();
		this._paths = [];
	},

	__createBody: function(zorder, pos)
	{
		var snake_node = new SnakeBody(this._parent, this._id);
		snake_node.setLocalZOrder(-zorder);
		snake_node.setBodyPosition(pos);
		snake_node.setBodyScale(this._scale);
		snake_node.setBodyColor(this._color);
		this._bodies.push(snake_node);
		if (zorder == 0)
			snake_node.reFreshHeadTexture();
	},

	__init: function()
	{
		if (this._parent == null) return;
		for (var i = 0; i < this._currentLength; i++){
			var pos = gl.pSub(this._headPos, gl.pMul(this._dir, this._initSpeed * i));
			this._paths.push(pos);
			this.__createBody(i, pos);
		}
	},

	update: function(dt)
	{
		if (this._died) return;
		if (this.__checkDie()) return;
		if (this._type == SnakeType.AI)
			this.__updateNomalAI(dt);
		this.__rotate(dt);
		this.__move(dt);
		this.__setScale(dt);
		this.__checkEatFood(dt);
	},

	__removeAllBodies: function()
	{
		for (var key in this._bodies){
			if (Math.random() > 0.6)
				tss.food_manager.createBodyDieFood(this._color, this._bodies[key].getPosition(), this._scale);
			this._bodies[key].destroy();
		}
		this._bodies = [];
	},

	__checkDie: function()
	{
		var regions = tss.map_manager.getEntityRegion(this._bodies[0].getId());

		for(var k in regions){
			var snakebodies = tss.map_manager.getSnakeNodesInRegion(regions[k].y, regions[k].x);
			for (var sk in snakebodies){
				if (snakebodies[sk]) {
					var snakenode = tss.snake_manager.getSnakeNode(snakebodies[sk]);
					if (snakenode && snakenode.getSnakeId() != this.getId()){
						var dir = snakenode.getPosition();
						if (gl.pGetDistance(this._headPos, dir) < (this._radius + snakenode.getRadius())){
							this.setDie();
							return true;
						}
					}
				}
				
			}
		}

		if (this._headPos.x < this._radius || MAP_WIDTH - this._headPos.x < this._radius){
			this.setDie();
			return true
		}
		if (this._headPos.y < this._radius || MAP_HEIGHT - this._headPos.y < this._radius){
			this.setDie();
			return true
		}
		return false;
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
			for (var i = 0; i <= this._curSpeedScale; i++){
				this._paths.splice(0, 0, gl.pAdd(this._headPos, gl.pMul(this._dir, this._initSpeed*i)));
			}
			this._headPos = this._paths[0];


			this.__moveBodies();
		}
	},

	__moveBodies: function()
	{
		var pathIndex = 0;
		var length = this._currentLength;
		//cc.log(this._paths.length);
		for (var i = 0; i < this._paths.length; i++, pathIndex++){
			if (pathIndex % this._intervalPathPoint == 0){
				var curBody = pathIndex / this._intervalPathPoint;
				if (curBody+1 > length){
					if (this._paths.length > curBody * 5){
						this._paths.splice(curBody * 5, this._paths.length);
					}
					return;
				}
				this._bodies[curBody].setBodyPosition(this._paths[i]);
			}
		}
	},

	__setScale: function(dt){
		if(this._currentLength != this._disLength){
			this._disLength = this._currentLength;
			var scale = this._currentLength / 500 + 0.25;
			if (scale > 0.7)
				scale = 0.7;
			this._scale = scale;
			this._radius = W(this._bodies[0]) * 0.5 * this._scale;
			for (var i= 0; i < this._bodies.length; i++){
				this._bodies[i].setScale(scale);
			}
		}
	},

	__checkEatFood: function(dt)
	{
		// var regions = tss.map_manager.getCoverRegion(this._headPos, MAX_EAT_RANGE);
		// for(var key in regions){
		// 	var foods = tss.map_manager.getFoodsInRegion(regions[key].y, regions[key].x);
		// 	for (var fk in foods){
		// 		if (foods[fk]){
		// 			var food = tss.food_manager.getFood(foods[fk]);
		// 			if( food && food.isActive() && gl.pGetDistance(food.getPosition(), this._headPos) < MAX_EAT_RANGE){
		// 				food.beEaten(this._headPos, this.__onEatFood.bind(this));
		// 			}
		// 		}
		// 	}
		// }


		// var foods = tss.food_manager.getFoodArray();
		// for (var k in foods){
		// 	var food = foods[k]
		// 	if (food && food.isActive() && gl.rectContainsPoint(food.getBoundingBox(), this._headPos)){
		// 		food.beEaten(this._headPos, this.__onEatFood.bind(this));
		// 	}
		// }

		//另外一套 区域划分
		var foods = tss.food_manager.getFoodVec(this._headPos);
		if (foods){
			for (var k in foods){
				if (foods[k] && foods[k].isActive()){
					foods[k].beEaten(this._headPos, this.__onEatFood.bind(this));
				}
			}
		}
	},

	__onEatFood: function(food)
	{
		if (this.isDead()) return;
		if(food.getType() == FoodTypeEnum.rand){
			this._eatRandFoodNum++;
			if(this._eatRandFoodNum == RAND_TO_BODY){
				this._eatRandFoodNum = 0;
				this.__addCurrentLength();
			}
		} else if (food.getType() == FoodTypeEnum.body_die){
			this.__addCurrentLength();
		}
		
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

	__addCurrentLength: function()
	{
		this._currentLength++;
		this.__createBody(this._currentLength, cc.p(0, 0));
		this._score = this._currentLength * LENGTH_TO_SCORE;
		if (this._bindUpdateScoreListener)
			this._bindUpdateScoreListener(this._score);
	},

	//bind
	bindUpdateScore: function(listener)
	{
		this._bindUpdateScoreListener = listener;
		listener(this._score);
	},

	//set
	setInitSpeed: function(n) { this._initSpeed = n; },
	setSpeedScale: function(scale){ this._curSpeedScale = scale; },
	setDie: function(){ this._died = true; },
	rotateTo: function(dir){ this._aimDir = gl.pNormalize(dir); },
	//get
	isDead: function(){ return this._died; },
	getRadius: function(){ return this._radius; },
	getSnakeBodies: function(){ return this._bodies; },
	getId: function() { return this._id; },
	getType: function(){ return this._type; },
	getSnakeDir: function() { return this._dir; },
	getSnakePosition: function() { return this._paths[0]; },
	getSnakeType: function() { return this._type; },
	getSnakeColor: function(){ return this._color; },
	getScore: function(){ return this._score; },
	getWoldPosition: function(){ return this._parent.convertToWorldSpace(this.getSnakePosition()); },

});