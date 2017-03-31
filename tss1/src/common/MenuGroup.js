// menu 需要在menu才能使用, 建立类似group
//menu_button  {target, normal, pressed , listener, x, y, aX, aY}
// gl.MenuEnums = {
//     button: "button",
// }
var Direction = {
    horizontal: 0,
    vertical:   1
}

var Anchors = {
    center: 0,
    left: 1,
    right: 2,
    up: 3,
    down: 4
}

var _createMenuButton = function(params)
{
    var target = params.target;
    var normal = params.normal;
    var pressed = params.pressed;
    var listener = params.listener || function(){};
    var button = new cc.MenuItemImage(normal, pressed, listener, target);
    var _x = params.x || 0;
    var _y = params.y || 0;
    var anX = params.aX || 0.5;
    var anY = params.aY || 0.5;
    button.attr({x: _x, y: _y, anchorX: anX, anchorY: anY});
    return button;
}

var _createMenLabel = function(params)
{
    var listener = params.listener || function() {};
    var label = new cc.MenuItemLabel(params.label, listener);
    return label;
}

// {array, disX, disY, direction, anchor,}
var createMenuGroup = function(params)
{   
    var array = params.array || [];
    var disX = params.disX || 0; //
    var disY = params.disY || 0; //
    var direction = params.direction || Direction.horizontal;
    var anchor = params.anchor || Anchors.center;

    var itemArray = [];
    var tWidth = 0;  
    var tHeight = 0; 
    for (var i = 0; i < array.length; ++i){
        var value = array[i];
        var item = null;
        if (value.type == "button"){
            item = _createMenuButton(value);
        } else if (value.type == "label") {
            item = _createMenLabel(value);
        }
        size = item.getContentSize();
        tWidth += size.width / 2;
        itemArray.push(item);
        item.setPosition(cc.p(tWidth+disX, 0));
        tWidth += size.width / 2;
    }
    var menu = new cc.Menu(itemArray);


    if (direction == Direction.horizontal){
        if (anchor == Anchors.center){

        }
    }
    return menu;
}