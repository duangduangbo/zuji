/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
(function($,owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';
		if (loginInfo.account.length < 3) {
			return callback('账号最短为 3 个字符');
		}
		if (loginInfo.password.length < 6) {
			return callback('密码最短为 6 个字符');
		}
		
		var users = JSON.parse(localStorage.getItem('$users') || '[]');
		var authed = users.some(function(user) {
			return loginInfo.account == user.account && loginInfo.password == user.password;
		});
		
		console.log(JSON.stringify(users));
		console.log(authed);
		if(users==null||users==[]||users==""||!authed){
			var url="http://192.168.43.189:88/zujidata/login.php";	    
		$.ajax(url,{
		type:"post",
		data:{
			uname:loginInfo.account,	
			upass:loginInfo.password,
		},
		crossDomain:true,
		dataType: 'json',
		success:function(data){
			console.log(JSON.stringify(data));
			if(data.code=="1"){
				plus.nativeUI.toast('登录成功');
				owner.getState();
			return owner.userState(loginInfo.account,loginInfo.password, callback);
			}
		else if(data.code="0"){
			plus.nativeUI.toast('登录失败');
		}
			},
			error:function(xhr,type,errorThrown){
				$.alert(type);
				}	
		});
		}
		else if (authed) {
			return owner.userState(loginInfo.account,loginInfo.password, callback);
		} else {
			return callback('用户名或密码错误');
		}
	};

	owner.createState = function(name, callback) {
		var state = owner.getState();
		state.account = name;
		state.token = "token123456"+name;
		owner.setState(state);
		return callback();
	};
owner.userState = function(name,passwd, callback) {
		var state = owner.getState();
		state.account = name;
		state.password = passwd;
		owner.setState(state);
		return callback();
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};
	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};
	/**
	 * 清除当前状态
	 **/
	owner.clearState = function(state) {
		 localStorage.removeItem('$state');
		
	};
	
	owner.findUid = function(uname) {		
					var url="http://192.168.43.189:88/zujidata/uid.php";
					var uid=null;
			      	$.ajax(url,{
			      		type:"post",
			      		crossDomain:true,
			      		dataType: 'json',
			      		data: {
			      			uname:uname
			      		},
			      		success:function(data){
			      			if(data.code=="1"){
								uid= 0;
			      			}	
			      			else{
			      				uid= -1;
			      			}
			      		},
			      		error:function(xhr,type,errorThrown){
			      			
			      			console.log(type);
			      		}
			      	});						
					
		return uid;
	};
	var checkEmail = function(email) {
		email = email || '';
		return (email.length > 3 && email.indexOf('@') > -1);
	};
	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(email, callback) {
		callback = callback || $.noop;
		if (!checkEmail(email)) {
			return callback('邮箱地址不合法');
		}
		return callback(null, '新的随机密码已经发送到您的邮箱，请查收邮件。');
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
			var settingsText = localStorage.getItem('$settings') || "{}";
			return JSON.parse(settingsText);
		}
		/**
		 * 获取本地是否安装客户端
		 **/
	owner.isInstalled = function(id) {
		if (id === 'qihoo' && $.os.plus) {
			return true;
		}
		if ($.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch (e) {}
		} else {
			switch (id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	}
}(mui,window.app = {}));