var MapRegionInstance = {
    _regionWidth: 0,
    _regionHeight: 0,
    _regionFoods: [],
    _regionSnakes: [],
    _entities: [],
    
}

var MapRegionManager  = (function()
{
    var instance = null;
    function getMapRegionInstance ()
    {
        return MapRegionInstance;
    }

    return {
        getInstance:function(){
            if(instance === null){
                instance = getMapRegionInstance();
            }
            return instance;
        }
    };
})();