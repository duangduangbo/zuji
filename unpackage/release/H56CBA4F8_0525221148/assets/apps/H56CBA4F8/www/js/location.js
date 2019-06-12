(function(w){
	var ws=null;
    var wo=null;
	var em=null;
	var map=null;
	var pcenter=null;
	var uLocation=false;
	var uflag=false;
var watchId;
var ppoint;
var pointsArr=[];
var pointsAll=[];
  	var num=0;
//获取位置信息
 w.getPos=function() {
	plus.geolocation.getCurrentPosition( geoInf, function ( e ) {
		outSet( "获取位置信息失败："+e.message );
	}, {geocode:false} );
}

	//监听位置变化
w.watchPos=function(map,calt,tspeed) {
	if ( watchId ) {
		return;
	}
	watchId = plus.geolocation.watchPosition( function ( p ) {
				ppoint=p;
			// 创建一个折线对象
//			var point1 = new plus.maps.Point(103.998961,30.756477);
//			var point2 = new plus.maps.Point(103.995857,30.758176);
//			var point3 = new plus.maps.Point(103.982755,30.751763);
		pointsArr.push(JSON.stringify(ppoint.coords));
		pointsAll.push(JSON.stringify(ppoint.coords));
		console.log(pointsAll[0]);
//		pointsArr.push(point1);
//		pointsArr.push(point2);
//		pointsArr.push(point3);
//		pointsAll.push(point1);
//		pointsAll.push(point2);
//		pointsAll.push(point3);
		if(pointsArr.length>2){
			addLine(pointsArr,map);
			console.log(JSON.stringify(p));
			tspeed.innerHTML=p.coords.speed;
			calculate(pointsArr,calt);
			pointsArr=[];
		}
		map.getUserLocation(function(state,pos){
		if(0==state){
			map.setCenter(pos);//设置地图的中心点
			map.centerAndZoom(pos,18);//设置地图初始中心点和缩放级别
		}
    },false);
			}, function ( e ) {
		alert( "监听位置变化信息失败："+e.message );
	}, {geocode:false,maximumAge:10000} );
}
//停止监听位置变化
 w.clearWatch=function(map,arr) {
	if ( watchId ) {
		var p=pointsArr;
		var linePoints = [],pointsLen = p.length,i;  
    // 创建标注对象并添加到地图     
    for(i = 0;i <pointsLen;i++){  
    	var longi=p[i].longitude;
    	var lati=p[i].latitude;
        linePoints.push(new plus.maps.Point(longi,lati));  
        
    } 
    console.log(linePoints.length);
    console.log(p[0])
		plus.geolocation.clearWatch( watchId );
		watchId = null;
		num=0;
		if(pointsLen>=3){
		if(p[0].latitude==p[p.length-1].latitude && p[0].latitude==p[(Math.floor(p.length-1)/2)].latitude){
			if(p[0].longitude==p[p.length-1].longitude && p[0].longitude==p[Math.floor((p.length-1)/2)].longitude){
				alert("没有记录到轨迹信息");
				pointsAll=[];
			}
		}
		else{
			var btnArray = ['否', '是'];
			$.confirm('添加轨迹，确认？', '足迹', btnArray, function(e) {
			if (e.index == 1) {
		//将坐标转换为地址
	plus.maps.Map.reverseGeocode(linePoints[0],{},function(event){
		 var rstart = event.address;  // 转换后的地理位置
		plus.maps.Map.reverseGeocode(linePoints[linePoints.length-1],{},function(event){
			var rend = event.address;  // 转换后的地理位置
				var url="http://192.168.43.189:88/zujidata/add_route.php";
			      	$.ajax(url,{
			      		type:"post",
			      		data: {
			      			st:arr.st,
			      			endt:arr.endt,
			      			calt:arr.calt,
			      			avgs:arr.avgs,
			      			dtime:arr.dtime,
			      			uname:arr.uname,
			      			points:linePoints,
			      			rstart:rstart,
			      			rend:rend
			      		},
			      		crossDomain:true,
			      		dataType: 'json',
			      		success:function(data){
			      			console.log(data.code);
			      			pointsAll=[];
			      			if(data.code=="1"){
								//关闭modal						
								mui.toast("添加成功~");
								
			      			}	
			      			else{
			      				mui.toast("添加失败~");
			      			}
			      		},
			      		error:function(xhr,type,errorThrown){
			      			mui.alert("network");
			      			pointsAll=[];
			      			console.log(type);
			      		}
			      	});
		},function(e){
			alert("Failed:"+JSON.stringify(e));
		});
	},function(e){
		alert("Failed:"+JSON.stringify(e));
	});
					} else {
						mui.toast("已取消添加轨迹~");
						pointsAll=[];
					}
		});		
	}
	}
	else {
		alert("没有记录到轨迹信息");
				pointsAll=[];
	}
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
	var marker=new plus.maps.Marker(pos);
	marker.setIcon("/logo.png");
	marker.setLabel("我的位置");
	var bubble = new plus.maps.Bubble("添加足迹");
	bubble.setIcon("/logo.png");
	marker.setBubble(bubble,true);
	bubble.onclick = function ( bubble ) {
			//将坐标转换为地址
	plus.maps.Map.reverseGeocode(pos,{},function(event){
		 var address = event.address;  // 转换后的地理位置
		var  point = event.coord;  // 转换后的坐标信息
		 var coordType = event.coordType;	// 转换后的坐标系类型
		var floatw=plus.webview.create('html/new_view.html?dplace='+address,'view',{top:'60px',height:'430px',width:'282px',left:'40px',position:'absolute',background:"rgba(0,0,0,0.8)",scrollIndicator:'none',scalable:false,popGesture:'none'});
	    floatw.addEventListener("loaded",function(){
		floatw.show('fade-in',300);
		floatw=null;
	    },false);
	},function(e){
		alert("Failed:"+JSON.stringify(e));
	});
	}
	map.addOverlay(marker);
}
//设置POly覆盖物
w.createPolyMarker=function(pos,map,image){
	var marker=new plus.maps.Marker(pos);
	marker.setIcon(image);
	var circle=new plus.maps.Circle(pos,30);
	circle.setStrokeColor( "#FF6100");
	circle.setStrokeOpacity(0.8);
	circle.setFillColor("#FF7D40");
	circle.setFillOpacity(0.2);
	circle.setLineWidth(1);
	map.addOverlay(circle);
	map.addOverlay(marker);
}
w.polyMarker=function(pos,map){
	//高德地图坐标为(116.3406445236,39.9630878208), 百度地图坐标为(116.347292,39.968716
	var marker=new plus.maps.Marker(pos);
		var circle=new plus.maps.Circle(pos,30);
	circle.setStrokeColor( "#FF6100");
	circle.setStrokeOpacity(0.8);
	circle.setFillColor("#FF7D40");
	circle.setFillOpacity(0.2);
	circle.setLineWidth(1);
	map.addOverlay(circle);
	map.addOverlay(marker);
}
//显示覆盖物
w.showMarker=function(pos,map,title,did,dminutes){
	var marker=new plus.maps.Marker(pos);
	marker.setIcon("/logo.png");
	var bubble = new plus.maps.Bubble(title);
	bubble.setIcon("/logo.png");
	marker.setBubble(bubble,true);
	var circle=new plus.maps.Circle(pos,400);
	circle.setStrokeOpacity(0.8);
	circle.setFillOpacity(0.4);
	circle.setLineWidth(2);
	
	if(dminutes<60){//停留时间为1小时以下
		circle.setStrokeColor( "#FF6100");
	circle.setFillColor("#FF7D40");
	}
	else if(dminutes>60&&dminutes<360){//停留时间为1小时以上，6小时以下
		circle.setStrokeColor( "#00CD00");
	circle.setFillColor("#00CD00");
	}
	else{//停留时间为6小时以上
		circle.setStrokeColor( "#CD0000");
	circle.setFillColor("#CD0000");
	}
	bubble.onclick = function ( bubble ) {
			//将坐标转换为地址
	plus.maps.Map.reverseGeocode(pos,{},function(event){
		 var address = event.address;  // 转换后的地理位置
		 point = event.coord;  // 转换后的坐标信息
		 coordType = event.coordType;	// 转换后的坐标系类型
		 mui.openWindow({
			id: 'show_view.html',
			url:'html/show_view.html?did='+did,
			show: {
			aniShow: 'pop-in'
			},
			waiting: {
				autoShow: false
			}
		});
	},function(e){
		alert("Failed:"+JSON.stringify(e));
	});
	}
	map.addOverlay(circle);
	map.addOverlay(marker);
}
  w.addLine=function(points,map){

    var linePoints = [];
    var pointsLen = points.length;
    var i;
    if(pointsLen == 0){  
        return;  
    }  
    // 创建标注对象并添加到地图     
    for(i = 0;i <pointsLen;i++){  
    	var longi=points[i].longitude;
    	var lati=points[i].latitude;
        linePoints.push(new plus.maps.Point(longi,lati));   
        
    }  
    console.log(points);
   	var polylineObj = new plus.maps.Polyline( linePoints );
polylineObj.setStrokeColor( "#ff0000" );// 设置折线颜色
polylineObj.setStrokeOpacity( 0.4 ); // 设置折线为半透明
polylineObj.setLineWidth( 8 );// 设置折线为宽度为8
polylineObj.setPath(  linePoints );
map.addOverlay(polylineObj);  //增加折线
 }

  w.calculate=function(points,calt){
  	var linePoints=[];
  	
    for(var i = 0;i <points.length;i++){  
    	var longi=points[i].longitude;
    	var lati=points[i].latitude;
        linePoints.push(new plus.maps.Point(longi,lati));  
    }
    if(linePoints.length>1)
    {
    	for(var i=0;i<linePoints.length-1;i++){
    		plus.maps.Map.calculateDistance(linePoints[i],linePoints[i+1],function(event){
		var distance = event.distance;  // 转换后的距离值
		num+=distance;
		calt.innerHTML=Math.round(num)/1000;
	},function(e){
		var m=JSON.stringify(e);
		console.log(e.message);
	});
    	}
    	console.log(num);
    }
  }

})(window);
