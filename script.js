function bmChatShow(){
	//alert("show");
	if(document.getElementById("bm_link_to_tutorial").className == "noChat"){

		jQuery("#chatDiv").html('<iframe id="iframeChat" width="400" height="475" src="http://dominio.com/web/wp-content/themes/Bankaool/support/ChatBM/index.html"></iframe>');

		jQuery("#iframeChat").load(function(){
			jQuery("#item").show(function(){
				jQuery("#item").animate({
					width: '340px',
					height: '500px'
				});
			});
		});

		jQuery("#bm_link_to_tutorial").attr('href','javascript:bmChatHide();');
		jQuery("#bm_link_to_tutorial").attr('class','');
	}else{
		jQuery("#item").show(function(){
			jQuery("#item").animate({
				width: '340px',
				height: '500px'
			});
		});
		jQuery("#bm_link_to_tutorial").attr('href','javascript:bmChatHide();');
	}
	jQuery("#bm_arrow").attr('class','downArrow');
	document.getElementById("bm_link_to_tutorial").blur();
}
function bmChatHide(){
	jQuery("#item").show(function(){
		jQuery("#item").animate({
			width: '340px',
			height: '25px'
		});
	});
	jQuery("#bm_link_to_tutorial").attr('href','javascript:bmChatShow();');
	jQuery("#bm_arrow").attr('class','upArrow');
	document.getElementById("bm_link_to_tutorial").blur();
}
function hover(element){
	if(jQuery("#bm_arrow").attr('class')=="upArrow"){
		element.setAttribute('src','http://dominio.com/web/wp-content/themes/Bankaool/support/ChatBM/img/arrows/arrowUpHover.png');	
	}else{
		element.setAttribute('src','http://dominio.com/web/wp-content/themes/Bankaool/support/ChatBM/img/arrows/arrowDownHover.png');	
	}
	
}
function unhover(element){
	if(jQuery("#bm_arrow").attr('class')=="upArrow"){
		element.setAttribute('src','http://dominio.com/web/wp-content/themes/Bankaool/support/ChatBM/img/arrows/arrowUp.png');
	}else{
		element.setAttribute('src','http://dominio.com/web/wp-content/themes/Bankaool/support/ChatBM/img/arrows/arrowDown.png');
	}
}
parent.document.body.innerHTML += '<div style="position:fixed;bottom:0;left:0;width:500px;height:500px;opacity:1;z-index:100;">'+
								  	'<div style="position:absolute;bottom:0;left:0;">'+
								  	'</div>'+
								  	'<div id="item" style="margin-left:30px;height:25px;width:340px;position:fixed;bottom:0;left:0;color:white;">'+
								  		'<div style="background-color:#92278e; height:25px;width:340px;border-radius: 15px 15px 0px 0px;padding-left:0px;">'+
								  			'<style>#bm_link_to_tutorial:hover{text-decoration:underline;}</style>'+
											'<a id="bm_link_to_tutorial" href="javascript:bmChatShow();" class="noChat" style="display:inline-block;color:white;margin-left:15px;display:block;width:100%;height:25px;outline:none">Contáctanos!<img onmouseover="hover(this);" onmouseout="unhover(this);" class="upArrow" id="bm_arrow"  style="float:right; margin-right:30px; margin-top:5px; height:17px; width: 17px;" src="http://dominio.com/web/wp-content/themes/Bankaool/support/ChatBM/img/arrows/arrowUp.png"></a>'+
											''+
										'</div>'+
										'<div id="chatDiv" style="width:340; height:475px;">'+
											'<p>ola k ase</p>'+
										'</div>'+
								  	'</div>'+
								  '</div>'+
								  '<a href="http://dominio.com/web/wp-content/themes/Bankaool/support/ChatBM/media/Bankaool.mp4" id="bm_link_to_video" class="fancyYouTube fancybox.iframe" style="display:none;">tutorial</a>'+
								  '<a href="http://dominio.com/web/wp-content/themes/Bankaool/support/ChatBM/media/Bankaool_token_V.mp4" id="bm_link_to_web" class="fancyYouTube fancybox.iframe" style="display:none;">token</a>';
