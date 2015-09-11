function changeExperto(elmnt) {
    switchExperto();

    var id = elmnt.id;
    text="<experto:"+id+">";
    document.getElementById('chat').contentWindow.experto(text);
    elmnt.className = elmnt.className + " purple blink";
    i = elmnt.getElementsByTagName("img");
    i[0].src="img/"+id+"-p.png";
}

function newExpert(experto,text){
    switchExperto();
    document.getElementById('chat').contentWindow.experto(text);
    jQuery("#" + experto).addClass("purple blikn");
    jQuery("#" + experto + "-img").attr("src","img/"+experto+"-p.png");
}

function switchExperto(){
    jQuery("#content").addClass( "cargando" );
        var imgs = document.getElementsByClassName("experto-img");
        
        for (var i = imgs.length - 1; i >= 0; i--){
            //alert("img[i]"+imgs[i].src);
            imgs[i].src = "img/"+imgs[i].parentElement.id+".png";
        }
        //document.getElementById("ahorro").onclick = function(){
        jQuery("#ahorro").click(function(){
            
        });
    jQuery( ".experto" ).removeClass( "purple blink" )
}
function showFancyLink(destino){
    parent.top.jQuery("#bm_link_to_video").fancybox({
            //href: 'http://localhost/bankaool/media/Bankaool.mp4',
            href: destino,
            autoDimensions: true,
            hideOnOverlayClick: false,
            overlayColor: '#000',
            overlayOpacity: 0.7,
            padding: 0,
            type: 'iframe',
            topRatio: 0
        }).click();
}
function displayLink(href){
    showFancyLink(href);
}
function showFancyVideo(destino){
    parent.top.jQuery("#bm_link_to_video").fancybox({
            //href: 'http://localhost/bankaool/media/Bankaool.mp4',
            href: destino,
            width: 400,
            height: 300,
            //autoDimensions: false,
            //hideOnOverlayClick: false,
            overlayColor: '#000',
            overlayOpacity: 0.7,
            padding: 0,
            type: 'iframe',
            //topRatio: 0,
            autoSize: false
        }).click();
}
function displayVideo(href){
    showFancyVideo(href);
}