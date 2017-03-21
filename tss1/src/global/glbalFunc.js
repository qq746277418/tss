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

        var dump = function(object)
        {
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
            cc.log(tstr);
        };

gl.getDate = function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
} 

gl.logDate = function(flag)
{
    cc.log(flag, gl.getDate());
}

var addNodeTouchEventListener = function(node, listener_){
    var listener = cc.EventListenerTouchOneByOne.create();
    listener.setSwallowTouches(true);
    var checkListener = function(touch, event){
        if (listener_ && typeof(listener_) == "function"){
            event.location = touch.getLocation();
            event.x = event.location.x;
            event.y = event.location.y;
            event.node = node;
            var ret = listener_(touch, event);
            return ret;
        }
    }
    listener.onTouchBegan = function (touch, event){   
        event.name = "began";
        var ret = checkListener(touch, event);
        return ret;
    };
    listener.onTouchMoved = function (touch, event){   
        event.name = "moved";
        checkListener(touch, event);
    };
    listener.onTouchEnded = function (touch, event){   
        event.name = "ended";
        checkListener(touch, event);
    };
    cc.eventManager.addListener(listener, node);
    return listener;
}

var func = function(sender, type){
            var snake = SnakeManager.getInstance().getSnake(self._playerId);
            
            switch (type) {
                case ccui.Widget.TOUCH_BEGAN:
                    snake.setSpeedScale(2);
                    break;
                case ccui.Widget.TOUCH_MOVED:
                    
                    break;
                case ccui.Widget.TOUCH_ENDED:
                    snake.setSpeedScale(1);
                    break;
                case ccui.Widget.TOUCH_CANCELED:
                    snake.setSpeedScale(1);
                    break;
                default:
                    break;
            }
        }
//{normal, pressed, disabled, listener, target, tag}
gl.CreateButton = function(params)
{
    var pressed = params.pressed || params.normal;
    var disabled = params.disabled || params.normal;
    var button = new ccui.Button(params.normal, pressed, disabled);
    button.setTag(params.tag ? params.tag: 0);
    if (params.listener)
        button.addClickEventListener(params.listener);
    if (params.touch_listener){
        var touchListener = function(sender, type){
            var event = {};
            switch (type) {
                case ccui.Widget.TOUCH_BEGAN:
                    event.name = "began";
                    break;
                case ccui.Widget.TOUCH_MOVED:
                    event.name = "moved";
                    break;
                case ccui.Widget.TOUCH_ENDED:
                    event.name = "ended";
                    break;
                case ccui.Widget.TOUCH_CANCELED:
                    event.name = "cancle";
                    break;
                default:
                    break;
            }
            params.touch_listener(event);
        }
        button.addTouchEventListener(touchListener, params.target);
    }
    return button;
}

//-----------------------------------------------
gl.pAdd = function(pt1, pt2)
{
    return {x: pt1.x + pt2.x , y: pt1.y + pt2.y } 
}

gl.pSub = function(pt1, pt2)
{
    return {x: pt1.x - pt2.x , y: pt1.y - pt2.y }
}

gl.pMul = function(pt1, factor)
{
    return { x: pt1.x * factor , y: pt1.y * factor }
}

gl.pCross = function(self, other)
{
    return self.x * other.y - self.y * other.x;
}

gl.pDot = function(self, other)
{
    return self.x * other.x + self.y * other.y;
}

gl.pGetLength = function(pt)
{
    return Math.sqrt(pt.x * pt.x + pt.y * pt.y);
}

gl.pNormalize = function(pt)
{
    var length = gl.pGetLength(pt);
    if (0 == length)
        return {x: 1.0, y: 0.0};
    return {x: pt.x / length, y:pt.y / length};
}

gl.pGetDistance = function(pt1, pt2)
{
    var x = (pt2.x - pt1.x) * (pt2.x - pt1.x);
    var y = (pt2.y - pt1.y) * (pt2.y - pt1.y);
    return Math.sqrt(x + y);
}

gl.pGetAngle = function(self, other)
{
    var a2 = gl.pNormalize(self);
    var b2 = gl.pNormalize(other);
    var angle = Math.atan2(gl.pCross(a2, b2), cc.pDot(a2, b2));
    if(Math.abs(angle) < 1.192092896e-7) 
        return 0.0;
    return angle;
}

gl.pFroAngle = function(a)
{
    return {x: Math.cos(a), y: Math.sin(a)};
}

gl.pRotate = function(pt1, pt2)
{
    return { x: pt1.x * pt2.x - pt1.y * pt2.y, y: pt1.x * pt2.y + pt1.y * pt2.x }
}

gl.pRotateByAngle = function(pt1, pt2, angle)
{
    return gl.Add(pt2, gl.pRotate(gl.pSub(pt1, pt2), gl.pForAngle(angle)));
}

