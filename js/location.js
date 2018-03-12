(function(w){
//获取位置信息
	w.getPos=function() {
	
	plus.geolocation.getCurrentPosition( geoInf, function ( e ) {
		alert( "获取位置信息失败："+e.message );
	}, {geocode:false} );
}
	//监听位置变化
w.watchPos=function() {
	if ( watchId ) {
		return;
	}
	watchId = plus.geolocation.watchPosition( function ( p ) {
		
		geoInf( p );
	}, function ( e ) {
		alert( "监听位置变化信息失败："+e.message );
	}, {geocode:false} );
}
//停止监听位置变化
 w.clearWatch=function() {
	if ( watchId ) {
		
		plus.geolocation.clearWatch( watchId );
		watchId = null;
	}
}
// 通过定位模块获取位置信息
w.getGeocode=function(){
	
	plus.geolocation.getCurrentPosition( geoInf, function ( e ) {
		alert( "获取定位位置信息失败："+e.message );
	},{geocode:true});
};
w.geoInf=function( position ) {
	var str = "";
	str += "地址："+position.addresses+"\n";//获取地址信息
	str += "坐标类型："+position.coordsType+"\n";
	var timeflag = position.timestamp;//获取到地理位置信息的时间戳；一个毫秒数；
	str += "时间戳："+timeflag+"\n";
	var codns = position.coords;//获取地理坐标信息；
	pos = position.coords;//获取地理坐标信息；
	var lat = codns.latitude;//获取到当前位置的纬度；
	str += "纬度："+lat+"\n";
	var longt = codns.longitude;//获取到当前位置的经度
	str += "经度："+longt+"\n";
	var alt = codns.altitude;//获取到当前位置的海拔信息；
	str += "海拔："+alt+"\n";
	var accu = codns.accuracy;//地理坐标信息精确度信息；
	str += "精确度："+accu+"\n";
	var altAcc = codns.altitudeAccuracy;//获取海拔信息的精确度；
	str += "海拔精确度："+altAcc+"\n";
	var head = codns.heading;//获取设备的移动方向；
	str += "移动方向："+head+"\n";
	var sped = codns.speed;//获取设备的移动速度；
	str += "移动速度："+sped;
	console.log(JSON.stringify(position));
	

	
}
//设置覆盖物
w.createMarker=function(pos,map){
	//高德地图坐标为(116.3406445236,39.9630878208), 百度地图坐标为(116.347292,39.968716
	var marker=new plus.maps.Marker(pos);
	marker.setIcon("/logo.png");
	marker.setLabel("我的位置");
	var bubble = new plus.maps.Bubble("打造最好的HTML5移动开发工具");
	marker.setBubble(bubble);
	map.addOverlay(marker);
	
	
}
 w.createSubview=function(){
	// 创建加载内容窗口
	var topoffset='44px';
	if(plus.navigator.isImmersedStatusbar()){// 兼容immersed状态栏模式
		topoffset=(Math.round(plus.navigator.getStatusbarHeight())+44)+'px';
	}
}
})(window);
