

function laboDrawZone () {

	colorsPalettes=[["DarkSlateGray","Brown","Orange","Green","DodgerBlue"],
			["Black","Purple","Brown","Red","Orange","Yellow",
			 "Green","LimeGreen","DodgerBlue","DarkViolet"]];

	content="";
	var i;
	var colorsPalette=DAM.map.shapeDesign.colorsPalette;
	
	for (i=0; i<DAM.deliveryAreas.length; i++) {
		var id=DAM.deliveryAreas[i].id;
		var type=(DAM.deliveryAreas[i].area.type==0)?"Circle":"Polygon";
		
		if (colorsPalette>0) {
			
			var colorIdx=0;
			if (colorsPalette==1) {
				colorIdx=((id-1)%5);
			} else {
				colorIdx=((id-1)%10);
			}
			color=colorsPalettes[colorsPalette-1][colorIdx];
		}
		
		content+='<div id="labo_list_area" class="_frame">';
		content+='<div id="labo_list_area_title" class="labo_list_area_col labo_list_area_text">Zone '+id+'</div>';
		if (colorsPalette>0) {
			content+='<div id="labo_list_area_title" class="labo_list_area_col labo_list_area_color" style="background:'+color+'"></div>';
		}
		content+='<div id="labo_list_area_type" class="labo_list_area_col labo_list_area_text">'+type+'</div>';
		content+='<div id="labo_list_area_buttons" class="labo_list_area_col">';
		content+='<input id="btListArea_Edit_'+id+'" type="button" value="e" onclick="laboEditArea('+id+')">';
		//if(DAM.deliveryAreas.length>1 && i>0) {
			content+='<input id="btListArea_Del_'+id+'" type="button" value="-" onclick="laboRemoveArea('+id+')">';
		//}
		content+='</div>';
		content+='</div>';
		content+='<div id="labo_list_area_spacer"></div>';
	}
	content+='<div id="labo_list_area" class="_frame">';
	content+='<div id="labo_list_area_buttons" class="labo_list_area_col">';
	content+='<input id="btListArea_Add" type="button" value="+" onclick="laboEditNewArea()">';
	content+='</div>';
	content+='</div>';
	content+='<div id="labo_list_area_spacer"></div>';
	document.getElementById('labo_list').innerHTML=content;
}

function laboEnableAll(state) {
//return;
//log(DAM.deliveryAreas.length);
	for (i=0; i<DAM.deliveryAreas.length; i++) {
		var id=DAM.deliveryAreas[i].id;
		document.getElementById("btListArea_Edit_"+id).disabled=!state;
		document.getElementById("btListArea_Del_"+id).disabled=!state;
	}
	document.getElementById("btListArea_Add").disabled=!state;
}

//
function laboEditGeneralReturn(result,object) {
log("###editAreas>"+result);
log(object);
    laboDrawZone();
	if (result==-1) { // enter in general edition
		laboEnableAll(false);
	} else {
		laboEnableAll(true);
	}
log("###editAreas<");
}
DAM.editedGeneralCallback=laboEditGeneralReturn;

// [asynchronous] DeliveryAreasManClass.editAreaWithId
function laboEditArea(id) {

	var result=	DAM.editAreaWithId(id,laboEditAreaReturn);
		
	if (result) {
		laboEnableAll(false);
	} else if (typeof result=='undefined') {
		log("***editAreaWithId ERROR");
	} else {
		log("***editAreaWithId BLOCKED");
	}
}
function laboEditAreaReturn(result,object) {
log("return "+result);
log(object);
	laboDrawZone();
	laboEnableAll(true);
}

// [asynchronous] DeliveryAreasManClass.editNewArea
function laboEditNewArea(id) {
	
	var result=	DAM.editNewArea(laboEditAreaReturn);
	
	if (result) {
		laboDrawZone();
		laboEnableAll(false);
	} else if (typeof result=='undefined') {
		log("***editNewArea ERROR");
	} else {
		log("***editNewArea BLOCKED");
	}
}

// [synchronous] DeliveryAreasManClass.editAreaWithId
function laboRemoveArea(id) {
    var result=DAM.removeAreaWithId(id);
	//var result=DAM.removeAreaWithIdCallBack(id,null);

	if (result) {
		laboDrawZone();
	} else if (typeof result=='undefined') {
		log("***removeAreaWithId ERROR");
	} else {
		log("***removeAreaWithId BLOCKED");
	}
}

function laboExport () {
	log(DAM.dataLiteralExport("DAM"));
}

function labo_adminBound (code) {
    log(code);
    var url="resources/adminbounds/"+code;
    if (labo_urlExists(url)) {
        
        labo_loadScript(url, function() {
                        DAM.setEditedAreaPolygon(1,reducedpolygon);
                        });
       
    } else {
        DAM.setEditedAreaPolygon(-1,[code]);
    }
}
DAM.adminBoundsCaller=labo_adminBound;

function labo_urlExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    //alert(http.status);
    return http.status==0;
}

function labo_loadScript(url, callback) {
    var head=document.getElementsByTagName('head')[0];
    var script=document.createElement('script');
    script.type='text/javascript';
    script.src=url;
    script.onreadystatechange=callback;
    script.onload=callback;
    head.appendChild(script);
}






