var gl = gl || {}
//都当成有contentsize的处理吧
SIZE = function(node){
    if (node == null) return null;
    var size = node.getContentSize();
    // if (size.width == 0 && size.height == 0){
    //     var size_ = node.getLayoutSize();
    //     return size_;
    // } else{
    //     return size;
    // }
    return size;
}
//获取坐标位置函数
X = function(node) {
    if (node == null)
        return null;
    return node.getPositionX();
}

Y = function(node) {
    if (node == null)
        return null;
    return node.getPositionY();
}

W = function(node) {
    if (node == null)
        return null;
    return SIZE(node).width;
}

H = function(node) {
    if (node == null)
        return null;
    return SIZE(node).height;
}

var dump = function(object){
    //cc.log("{")
    var tstr = "{"
    for (var style in object){
        var str = null;
        if (typeof(object[style]) == "function"){
            str = "\n\t" + style + ": " + "function" + ","
        }else if (typeof(object[style]) == "object"){
            var ctstr = "{"
            for (var cstyle in object[style]){
                var cstr = null;
                if (typeof(object[style][cstyle]) == "function"){
                    cstr = "\n\t\t" + cstyle + ": " + "function" + ","
                }else {
                    cstr = "\n\t\t" + cstyle + ": " + object[style][cstyle] + ","
                }
                    ctstr = ctstr + cstr;
            }
            ctstr = ctstr + "\n}";
            str = "\n\t" + style + "=" + ctstr;
        }else{
            str = "\n\t" + style + ": " + object[style] + ","
        }
        tstr = tstr + str;
    }
    tstr = tstr + "\n}";
    cc.log(tstr)
}

//暂时使用
gl.vecSub = function(pos1, pos2)
{
    return cc.p(pos1.x - pos2.x, pos1.y - pos2.y);
}

gl.addNodeTouchEventListener = function(node, listener_){
    var listener = cc.EventListenerTouchOneByOne.create();
    listener.setSwallowTouches(true);
    var checkListener = function(touch, event){
        if (listener_ && typeof(listener_) == "function"){
            var location = touch.getLocation();
            event.x = location.x;
            event.y = location.y;
            event.location = location;
            var ret = listener_(touch, event);
            return ret;
        }
    }
    listener.onTouchBegan = function (touch, event){   
        event.name = "began";
        event.node = node
        var ret = checkListener(touch, event);
        return ret;
    };
    listener.onTouchMoved = function (touch, event){   
        event.name = "moved";
        event.node = node
        checkListener(touch, event);
    };
    listener.onTouchEnded = function (touch, event){   
        event.name = "ended";
        event.node = node
        checkListener(touch, event);
    };
    cc.eventManager.addListener(listener, node);
    return listener;
}

gl.GlCreateCusomLabel = function(txt, size, color){
    var label = new cc.LabelTTF(txt || "", "Arial", size || 20);
    label.color = color || cc.color(255,255,255);
    return label;
}

//{normal, pressed, disabled, listener, target, tag}
gl.GlCreateButton = function(params){
    var button = new ccui.Button(params.normal, params.pressed, params.disabled);
    button.setTag(params.tag ? params.tag: 0);
    button.addClickEventListener(params.listener);
    return button;
}

gl.getAngle = function(x1, x2, y1, y2){
    var x = x2 - x1;
    var y = y2 - y1;
    var hypotenuse = Math.sqrt(Math.pow(x, 2)+Math.pow(y, 2));
    //斜边长度
    var cos = x / hypotenuse;
    var radian = Math.acos(cos);
    //求出弧度
    var angle = 180 / (Math.PI / radian);
    //用弧度算出角度       
    // if (y<0) {
    //     angle = -angle;
    // } else if ((y == 0) && (x<0)) {
    //     angle = 180;
    // }
    cc.log("angle>>>>>>>", angle, x1, x2, y1, y2)
    return angle;
}