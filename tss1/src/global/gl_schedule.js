var _skeyIndex = 0;
var CSchedule = cc.Class.extend({
	_time: 0,  //用于计算
	_currentTime: 0,
	_ttime: 0,      //总时间
	_delayTime: -1, //间隔，有时可能不会用于计算
	_isReverse: true, //是否倒序 (默认)
	_loop: false,  //循环
	_callTime: 0,  // 报警时间
	_scheduleKey: null,
	_updateListener: null,
	_endListener: null,
	_callListener: null,
	start: function(ttime, delayTime, update_listener, end_listener)
	{
		this._updateListener = update_listener;
		this._endListener = end_listener;
		this._ttime = ttime;
		this._delayTime = delayTime;
		if (this._scheduleKey == null)
			_skeyIndex++;
		this._scheduleKey = cc.formatStr("schedule_%d", _skeyIndex);
		cc.director.getScheduler().schedule(this.__update, this, this._delayTime, cc.REPEAT_FOREVER, -1, false, this._scheduleKey);
	},

	restart: function()
	{
		cc.director.getScheduler().schedule(this.__update, this, this._delayTime, cc.REPEAT_FOREVER, -1, false, this._scheduleKey);
	},
	//手动停止 endEnable：是否启用end_listener
	stop: function(endEnable)
	{
		this.__endSchedule(endEnable);
	},

	__endSchedule: function(endEnable)
	{
		if (endEnable && typeof(this._endListener) == "function"){
			this._endListener();
		}
		cc.director.getScheduler().unschedule(this._scheduleKey, this);
		this._currentTime = 0;
		this._time = 0;
		//如果设置了循环 loop
		if (this._loop){
			this.restart();
		}
	},

	__update: function(dt)
	{
		//ttime == 0 ; 不计算时间， 属于repeat
		if (this._ttime != 0) {
			this._time += this._delayTime;
			this._currentTime = this._time;
			if (this._isReverse) {
				this._currentTime = this._ttime - this._time;
				if (this._currentTime <= 0)
					this.__endSchedule();
			} else{
				if (this._currentTime >= this._ttime)
					this.__endSchedule(true);
			}
		}
		if (this._updateListener && typeof(this._updateListener) == "function") {
			this._updateListener();
		}
	},

	__isCall: function(){
		if (this._callTime != 0 && (this._currentTime > this._callTime || this._currentTime < this._callTime)){
			if (this._callListener && typeof(this._callListener) == "function"){
				this._callListener();
			}
			return true;
		}
	},

	//set
	IsReverse: function(ret)
	{
		this._isReverse = ret;
	},

	setLoop: function(ret)
	{
		this._loop = ret;
	},

	setCallTime: function(time)
	{
		this._callTime = time || 0;
	},

	setCallListener: function(listener)
	{
		this._callListener = listener;
	},

	//get
	getCurrentTime: function()
	{
		return this._currentTime;
	},

	getDelayTime: function(){
		return this._delayTime;
	}
});