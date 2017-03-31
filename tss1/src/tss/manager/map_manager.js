var testid = 0;
var MapManager = cc.Class.extend({
	_regionWidth: 0,
	_regionHeight: 0,
	_regionFoods: [],
	_regionSnakes: [],
	_entities: [],
	ctor: function()
	{
		this._regionWidth = Math.ceil( MAP_WIDTH / MAP_REGION_WIDTH );
		this._regionHeight = Math.ceil( MAP_HEIGHT / MAP_REGION_WIDTH );

		this._regionFoods = new Array(this._regionHeight);
	    this._regionSnakes = new Array(this._regionHeight);
		for( var r = 0; r < this._regionWidth; r++ ) {
			this._regionFoods[r] = new Array(this._regionWidth);
	        this._regionSnakes[r] = new Array(this._regionWidth);

			for( var c = 0; c < this._regionWidth; c++ ) {
				this._regionFoods[r][c] = [];
				this._regionSnakes[r][c] = [];
			}
		}
	},

	addNodeToRegion: function(type, node)
	{
		var regions = this.getCoverRegion(node.getPosition(), node.getRadius());
		this._entities[node.getId()] = regions;
		for(var i = 0; i < regions.length; i++) {
	        this.__addNodeInRegion( type, node.getId(), regions[i].y, regions[i].x );
	    }
	},

	removeNodeFromRegion: function(type, node)
	{
		var itr = this._entities[node.getId()];
		for (var i = 0; i < itr.length; i++){
			this.__removeNodeInRegion(type, node.getId(), itr[i].y, itr[i].x);
		}
		this._entities[node.getId()] = [];
	},

	refreshNodeRegion: function(type, node)
	{
		var id = node.getId();
	    var oldRegions = this._entities[id];
	    this._entities[id] = null;
		this._entities[id] =  this.getCoverRegion(node.getPosition(), node.getRadius())

		for (var k in oldRegions){
			this.__removeNodeInRegion(type, id, oldRegions[k].y, oldRegions[k].x);
		}

		for (var k in this._entities[id]){
			this.__addNodeInRegion(type, id, this._entities[id][k].y, this._entities[id][k].x);
		}
	},

	__addNodeInRegion: function(type, id, row, col)
	{
		if (type == REGION_TYPE_FOOD){
			this._regionFoods[row][col].push(id);
		}
		else{
			this._regionSnakes[row][col].push(id);
		}
	},

	__removeValueById: function(arr, value)
	{
		for (var k in arr){
			if (k == value){
				arr.splice(k, k+1);
			}
		}
		return arr;
	},

	__removeNodeInRegion: function(type, id, row, col)
	{
		if (type == REGION_TYPE_FOOD)
			this._regionFoods[row][col] = this.__removeValueById(this._regionFoods[row][col], id);
		else
			this._regionSnakes[row][col] = this.__removeValueById(this._regionSnakes[row][col], id);
	},

	getCoverRegion: function(pos, radius)
	{
		var leftCol = Math.floor(gl.max( 0.0, Math.floor( ( pos.x - radius ) / MAP_REGION_WIDTH ) ));
	    var rightCol = Math.floor(gl.min(this._regionWidth, Math.floor( pos.x + radius ) / MAP_REGION_WIDTH ));
	    var topRow = Math.floor(gl.min(this._regionHeight, Math.floor( pos.y + radius ) / MAP_REGION_HEIGHT ));
	    var bottomRow = Math.floor(gl.max( 0.0, Math.floor( pos.y - radius ) / MAP_REGION_HEIGHT )); 
	    var result = [];
	    //cc.log("brow-trow-lcol-rcol----------", bottomRow, topRow, leftCol, rightCol)
	    for(var r = bottomRow; r <= topRow; r++ ) {
	        for( var c = leftCol; c <= rightCol; c++ ) {
	            result.push(cc.p( c, r ) );
	        }
	    }
	    return result;
	},


	//get
	getFoodsInRegion: function(row, col)
	{
		return this._regionFoods[row][col];
	},

	getSnakeNodesInRegion: function(row, col)
	{
		return this._regionSnakes[row][col];
	},

	getEntityRegion: function(id)
	{
		return this._entities[id];
	}
});

var tss = tss || {}
tss.map_manager = new MapManager();