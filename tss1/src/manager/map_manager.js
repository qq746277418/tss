var MapInstance = {
    _snakeNodes: [], // {id, value}  二维数组，暂时解决方案
    _snakeAIArray: [],
    //body节点的管理
    insertSnakeNode: function(snake_id, node_id, node)
    {
        if (this._snakeNodes[snake_id] == null)
            this._snakeNodes[snake_id] = new Array();
        this._snakeNodes[snake_id].push({id: node_id, value: node});
    },

    getSnakeNode: function(snake_id, node_id)
    {
        if (this._snakeNodes[snake_id] == null) return;
        var tmp = this._snakeNodes[snake_id];
        for (var i = 0; i < tmp.length; i++){
            if (tmp[i].id == node_id)
                return tmp[i].value;
        }
    },

    getSnakeNodes: function(snake_id)
    {
        return this._snakeNodes[snake_id];
    },

    removeAllSnakeNodes: function(snake_id)
    {
        var bodies = this._snakeNodes[snake_id];
        if (bodies){
            for (var i = 0; i < bodies.length; i++){
                bodies[i].value.destroy();
            }
        }
        this._snakeNodes[snake_id] = null;
    },

    //Ai的管理
    insertSnake: function(snake_id, snake)
    {   
        this._snakeAIArray.push({id: snake_id, value: snake});
    },

    removeSnake: function(snake_id)
    {
        for (var i = 0; i < this._snakeAIArray.length; i++){
            if (this._snakeAIArray[i].id == snake_id)
                this._snakeAIArray.splice(i, i + 1);
        }
    },

    getSnakeArray: function()
    {
        return this._snakeAIArray;
    },
}

var MapManager  = (function()
{
    var instance = null;
    function getMapInstance ()
    {
        return MapInstance;
    }

    return {
        getInstance:function(){
            if(instance === null){
                instance = getMapInstance();
            }
            return instance;
        }
    };
})();