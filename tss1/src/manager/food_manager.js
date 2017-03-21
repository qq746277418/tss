var FoodInstance = {
    _parent: null,
    _foods: [],
    _addFoodDelta: 0.0,
    setBodyParent: function(parent)
    {
        this._parent = parent;
    },

    initFoods: function(num)
    {
        num = num < MAX_FOOD_NUM ? num : MAX_FOOD_NUM;
        for(var i = 0; i < num; i++ ) {
            this.__addFood(FoodType.RANDOM, cc.p(Math.random() * MAP_WIDTH, Math.random() * MAP_HEIGHT));
        }
    },

    update: function(dt)
    {
        this.__checkDie();
        this.__randomFood(dt);

        for (var key in this._foods){
            if (this._foods[key])
                this._foods[key].update(dt);
        }
    },

    __addFood: function(type, pos)
    {
        var food = new Food(this._parent, type, pos);
        if (food){
            this._foods[food.getId()] = food;
            return food.getId();
        }
        return INVALID_ENTITY_ID;
    },

    __checkDie: function()
    {
        for (var key in this._foods){
            var food = this._foods[key];
            if (food && food.isDead()){
                food.destroy();
                this._foods[key] = null;
            }
        }
    },

    __randomFood: function(dt)
    {
        this._addFoodDelta += dt;
        if (this._foods.length < MAX_FOOD_NUM && this._addFoodDelta >= RANDOM_FOOD_INTERVAL){
            this._addFoodDelta -= RANDOM_FOOD_INTERVAL;
            if (Math.random() < FOOD_STAR_RANDOM_CHANCE)
                this.__addFood(FoodType.STAR, cc.p(Math.random() * MAP_WIDTH, Math.random() * MAP_HEIGHT));
            else
                this.__addFood(FoodType.RANDOM, cc.p(Math.random() * MAP_WIDTH, Math.random() * MAP_HEIGHT));
        }
    },
    //
    getFoods: function()
    {
        return this._foods;
    },

    getFood: function(id)
    {
        return this._foods[id];
    }
}

var FoodManager  = (function()
{
    var instance = null;
    function getFoodInstance ()
    {
        return FoodInstance;
    }

    return {
        getInstance:function(){
            if(instance === null){
                instance = getFoodInstance();
            }
            return instance;
        }
    };
})();