(function(){
	var ws=null,wo=null;
var em=null,map=null,pcenter=null,uLocation=false;
// H5 plus事件处理

function plusReady(){
	if(!em||ws){return};
	// 获取窗口对象
	ws=plus.webview.currentWebview();	
	wo=ws.opener();
	//高德地图坐标为(116.3974357341,39.9085574220), 百度地图坐标为(116.3975,39.9074)
	map=new plus.maps.Map("map");
	//获取定位信息
	getGeocode();
		
	setTimeout(function(){
		
		map.showUserLocation( true );
		uLocation=map.getUserLocation(function(state,pos){
		if(0==state){
			map.setCenter(pos);
			map.centerAndZoom(pos,12);
			
		}
		if(uLocation)
		{
			createMarker(pos,map);
		}
	});



	},300);
	// 显示页面并关闭等待框
    ws.show("pop-in");
    	var url="http://192.168.1.7:88/zujidata/index.php";
      	$.ajax({
      		type:"get",
      		url: url,
      		success:function(data){
      			var data=data[0];
      			for(var i in data){
      				console.log(data[i]);
      				
      			}
      			
      			
      			
      			
      		},
      		error:function(err,status){
      			console.log(status);
      		}
      	});
}
if(window.plus){
	plusReady();

	
}else{
	document.addEventListener("plusready",plusReady,false);
}


// DOMContentloaded事件处理
document.addEventListener("DOMContentLoaded",function(){
	em=document.getElementById("map");
	
	window.plus&&plusReady();
},false);


})();
