var PI = 3.1415925

var MAP_WIDTH = 2048.0;
var MAP_HEIGHT = 1536.0;

var MAP_REGION_WIDTH = 400.0;
var MAP_REGION_HEIGHT = 400.0;

var LENGTH_TO_SCORE = 6;  //一截身體6分
var SNAKE_INIT_LENGTH = 5;
var SNAKE_SCALE_MIN_PATH_INTERVAL = 6;
var NORMAL_AI_UPDATE_INTERVAL = 0.2;
var SNAKE_MOVE_INTERVAL = 0.03;

//吃食物的范围
var MAX_EAT_RANGE = 30.0;



var randBaseIndex = 0;
var RAND_TO_BODY = 6;
//食物计算
var FOOD_CONST_RADIUS = 20;  //按照20给地图划分地域

//map
var REGION_TYPE_FOOD = 1;
var REGION_TYPE_SKANE = 2;