/*****************************************************************************************


    MapManClass (pseudo) Class (Area extend, composite Multiple)
    © Asity 2013
 
    version: ß1.00.05
 
*****************************************************************************************/

function MapManClass (parent) {
    
    this.parent=                        parent;

    // Iface (HTML) properties
                                        var dsep=this.parent.locale.decimalSeparator;
    this.iface = {
        divMap:                         'dm_da_area_map_canvas',
        alert:                          new AlertClass(    'boxAlert','tlAlertMessage',
                                                        'tlAlertInfo','tlAlertBtDefault'),

        tfTitle:                        new HtmlClass('tfTitle','innerString',
                                        {value:this.parent.locale.texts.s1}),
        
        boxValues:                      new HtmlClass('boxValues','box'),
        tfExtra0:                       new HtmlClass('tfExtra0','fieldNumber',{dec:2},dsep),
        tfMinimum0:                     new HtmlClass('tfMinimum0','fieldNumber',{dec:2},dsep),
        tfExtra1:                       new HtmlClass('tfExtra1','fieldNumber',{dec:2},dsep),
        tfMinimum1:                     new HtmlClass('tfMinimum1','fieldNumber',{dec:2},dsep),
        tfExtra2:                       new HtmlClass('tfExtra2','fieldNumber',{dec:2},dsep),
        tfMinimum2:                     new HtmlClass('tfMinimum2','fieldNumber',{dec:2},dsep),
        
        boxDistance:                    new HtmlClass('boxDistance','box'),
        tlDistance:                     new HtmlClass('tlDistance','innerNumber',{dec:1},dsep),
        
        boxShapes:                      new HtmlClass('boxShapes','box'),
        rdShapes:                       new HtmlClass('rdShapes', 'radio'),
        
        boxRadius:                      new HtmlClass('boxRadius','box'),
        tfRadius:                       new HtmlClass('tfRadius','fieldNumber',{dec:1},dsep),
        btRadius:                       new HtmlClass('btRadius','button'),

        boxEdges:                       new HtmlClass('boxEdges','box'),
        tfEdges:                        new HtmlClass('tfEdges','fieldNumber',{dec:0}),
        btEdges:                        new HtmlClass('btEdges','button'),

        boxBoundary:                    new HtmlClass('boxBoundary','box'),
        tfBoundary:                     new HtmlClass('tfBoundary','fieldString',
                                        {value:this.parent.locale.texts.s2}),
        btBoundary:                     new HtmlClass('btBoundary','button'),
        
        btCenter2Shape:                 new HtmlClass('btCenter2shape','button'),
        btZoomMoins:                    new HtmlClass('btZoomMoins','button'),
        btZoomPlus:                     new HtmlClass('btZoomPlus','button'),
        
        tfSearch:                       new HtmlClass('tfSearch','fieldString',
                                        {value:this.parent.locale.texts.s3}),
        btSearch:                       new HtmlClass('btSearch','button'),
        
        boxButtons:                     new HtmlClass('boxButtons','box'),
        
        boxGlobalButtons:               new HtmlClass('boxGlobalButtons','box')
    };

    // Global
    this.started=                        false;
    this.shapes=                        [];

    // Options
    this.mapReverseGeocodeBased=        this.parent.option("mapReverseGeocodeBased",false);
    this.alertChangeOn=                 this.parent.option("mapLocationAlertChangeOn",true);
    this.alertChangeOnNoRepeat=         this.parent.option("mapLocationAlertChangeOnNoRepeat",false);
    this.alertChange=                   false;

    
    // Map Properties
    this.geocoder=                      new google.maps.Geocoder();
    this.map=                           null;
    this.zoom=                          13;
    this.zoomMin=                       this.parent.option("mapZoomMax",11);
    this.zoomMax=                       this.parent.option("mapZoomMax",16);
    this.locationMarker=                null;
    this.prevLocation=                  null;
    this.mapOptions= {
        zoom:                           this.zoom,
        center:                         null,
        /*To get direction arrows rather hand */
        draggableCursor:                'auto',
        draggingCursor:                 'move',
        /**/
    
        panControl:                     false,
        zoomControl:                    false,
        zoomControlOptions: {
            style:                      google.maps.ZoomControlStyle.DEFAULT,
            position:                   google.maps.ControlPosition.LEFT_CENTER
        },
        mapTypeControl:                 false,
        scaleControl:                   false,
        streetViewControl:              false,

        mapTypeId:                      google.maps.MapTypeId.ROADMAP
    };
    
    // Map Shape Properties
    this.deliveryAreas=                 null;
    this.deliveryArea=                  null;
    this.daIdx=                         null;

    this.polygonMarkers=                [];
    this.polygonBase = {
        edges:                          5,
        radius:                         500, // while iFace is in Km, here is meters
        draggable:                      this.parent.option("mapShapesPolygonDraggable",true),
        movewithlocationifnotdraggable: this.parent.option("mapLocationChangesMovePolygonsWhenNotDraggable",true)
    };
        
    this.circleMarker =                 null;
    this.prevRadius =                   null;
    this.circleBase = {
        radius:                         500, // while iFace is in Km, here is meters
        bearing:                        180,
        draggable:                      this.parent.option("mapShapesCircleDraggable",false),
        minimumradius:                  500
    };

    this.shapeDesign = {
        colorsPalette:                  this.parent.option("mapShapesColorWheel",1),
        colorsPalettes:                 [["DarkSlateGray","Brown","Orange","Green","DodgerBlue"],
                                        ["Black","Purple","Brown","Red","Orange","Yellow",
                                        "Green","LimeGreen","DodgerBlue","DarkViolet"]],
        stroke: {
            color:                      "black",
            opacity:                    0.8,
            weight:                     1
        },
        strokeColored: {
            opacity:                    1,
            weight:                     4
        },
        strokeEdited: {
            color:                      "red",
            opacity:                    0.8,
            weight:                     2
        },
        handle: {
            base:                       this.parent.resourcesFolder+'img_handle.png',
            selected:                   this.parent.resourcesFolder+'img_handle_selected.png',
            ends:                       this.parent.resourcesFolder+'img_handle_ends.png',
            endsselect:                 this.parent.resourcesFolder+'img_handle_ends_selected.png'
        },
        fill: {
            color:                      "black",
            opacity:                    0.2
        },
        fillEdited: {
            color:                      "red",
            opacity:                    0.2
        }
    };
    
}
MapManClass.prototype = Object.create(AreaClass.prototype);

/**
    MapManClass: Core method
**/

// (void) MapManClass.start (string)
MapManClass.prototype.start = function () {
    this.started=true;
    if (this.parent.addressPoint!=null) {
        this.draw (this.parent.addressPoint);
    } else {
        this.draw (this.parent.address);
    }
};

// (void) MapManClass.draw (string, int)
MapManClass.prototype.draw = function (address, zoom) {
    if (!this.started) { this.logArg("MapManClass.draw: not started"); return; }
    if(!this.isString(address) && !this.isPoint(address))
        { this.logArg("MapManClass.draw: Missing or bad address"); return; }
    if(this.isString(address) && address.length===0)
        { this.logArg("MapManClass.draw: address void"); return; }
        
    var _this=this;
    var _parent=_this.parent;

    if (this.isString(address)) {

        this.geocoder.geocode( { 'address': address}, function(results, status) {

            if (status !== google.maps.GeocoderStatus.OK) {
                _this.iface.alert.open(_parent.locale.texts.m1a,_parent.locale.texts.m1b
                                        +_parent.defaultAddress+"'","Ok");
                _parent.addressChanged=_parent.defaultAddress;
                _this.draw(_parent.defaultAddress, 5);
                return;
                              
            } else {

                var location = results[0].geometry.location;

                _parent.addressPoint=new PointClass(location.lng(), location.lat());
                              
                if(_this.isNumber(zoom)) _this.mapOptions.zoom = zoom;
                _this.mapOptions.center = location;
                _this.map = new google.maps.Map(document.getElementById(_this.iface.divMap),
                                                _this.mapOptions);
                                                        
                _this.locationMarker = new google.maps.Marker({
                    map:                         _this.map,
                    // icon:                     iconMarker,
                    position:                    location,
                    draggable:                   true
                    //animation:                 google.maps.Animation.DROP
                });
                _this.prevLocation=_this.newPointFromLatLng(_this.locationMarker.position);

                if (_this.mapReverseGeocodeBased) {
                    google.maps.event.addListener(
                        _this.locationMarker,
                        'dragend',
                        function(pos) { _this.reverseGeocode(pos); }
                    );
                } else {
                    google.maps.event.addListener(
                        _this.locationMarker,
                        'dragend',
                        function(pos) { _this.changeLocation(pos); }
                    );
                }
            }
            
            _this.shapeDrawAll();
            
        });
        
    } else {
        
        if(_this.isNumber(zoom)) _this.mapOptions.zoom = zoom;
        _this.mapOptions.center = new google.maps.LatLng(_parent.addressPoint.y,
                                                        _parent.addressPoint.x);

        _this.map = new google.maps.Map(document.getElementById(_this.iface.divMap),
                                                                _this.mapOptions);
        _this.locationMarker = new google.maps.Marker({
              map:                      _this.map,
              // icon:                     iconMarker,
              position:                 _this.mapOptions.center, //location,
              draggable:                true
              //animation:                 google.maps.Animation.DROP
        });
        
        _this.prevLocation=_this.newPointFromLatLng(_this.locationMarker.position);
        
        if (_this.mapReverseGeocodeBased) {
            google.maps.event.addListener(
                _this.locationMarker,
                'dragend',
                function(pos) { _this.reverseGeocode(pos); }
            );
        } else {
            google.maps.event.addListener(
                _this.locationMarker,
                'dragend',
                function(pos) { _this.changeLocation(pos); }
            );
        }

        _this.shapeDrawAll();
        
    }
    
};

/**
    MapManClass: Location method
**/


// (void) MapManClass.changeToLocation (LatLng Point)
MapManClass.prototype.changeLocation = function (pos) {
    if (!this.started) { this.logArg("MapManClass.changeToLocation: not started"); return; }
    var latLng;
    if (this.isLatLng(pos)) {
        latLng=pos;
    } else if (this.isLatLng(pos.latLng)) {
        latLng=pos.latLng;
    } else {
        this.logArg("MapManClass.changeToLocation: Missing or bad pos!"); return;
    }
    
    if (this.deliveryAreas==null) this.editAreas();
    
    this.map.setCenter(latLng);
    
    this.parent.addressPoint.changeToLatLng(latLng);
    this.parent.addressChanged=null;
        
    this.shapeDrawAll();
    
    if (this.alertChangeOn && !this.alertChange) {
        if (this.alertChangeOnNoRepeat) this.alertChange=true;
            this.iface.alert.open(this.parent.locale.texts.m2a,this.parent.locale.texts.m2b,"Ok");
    }

};


// (void) MapManClass.reverseGeocode (GMAP Marker or LatLng Point)
MapManClass.prototype.reverseGeocode = function (pos) {
    if (!this.started) { this.logArg("MapManClass.reverseGeocode: not started"); return; }
    if (!pos) { this.logArg("MapManClass.reverseGeocode: Missing or bad pos!"); return; }
    var latLng;
    if (this.isLatLng(pos)) {
        latLng=pos;
    } else if (this.isLatLng(pos.latLng)) {
        latLng=pos.latLng;
    } else {
        this.logArg("MapManClass.reverseGeocode: Missing or bad pos!"); return;
    }

    var _this=this;
    var _parent=this.parent;
    
    this.geocoder.geocode({'latLng': latLng}, function(results, status) {
        if (status !== google.maps.GeocoderStatus.OK) {
            _this.iface.alert.open(this.parent.locale.texts.m3a,this.parent.locale.texts.m3b,"Ok");
        }
        if (results[1]) {
            var address=results[1].formatted_address;
            if (_this.alertChangeOn && !_this.alertChange) {
                if (_this.alertChangeOnNoRepeat) _this.alertChange=true;
                
                _this.iface.alert.open(_parent.locale.texts.m4a+address,_parent.locale.texts.m2b,"Ok");
            }
            _this.centerToAddress(address);
        } else {
            _this.iface.alert.open(_parent.locale.texts.m3a,_parent.locale.texts.m3b,"Ok");
        }

    });

};

// (void) MapManClass.centerToAddress (string, HtmlClass object)
MapManClass.prototype.centerToAddress = function (address,objectFocus) {
    if (!this.started) { this.logArg("MapManClass.centerToAddress: not started"); return; }
    if (!this.isString(address))
        { this.logArg("MapManClass.centerToAddress: Missing or bad address!"); return; }
    if (objectFocus && !this.isHtml(objectFocus))
        { this.logArg("MapManClass.centerToAddress: Missing or bad objectFocus!"); return; }
    
    var _this=this;
    var _parent=_this.parent;

    if (this.deliveryAreas==null) this.editAreas();

    this.geocoder.geocode( { 'address': address}, function(results, status) {

        if (status !== google.maps.GeocoderStatus.OK) {
            _this.iface.alert.open(_parent.locale.texts.m5a,_parent.locale.texts.m5b,"Ok",objectFocus);
            return;
        }
        
        var location = results[0].geometry.location;
        
        _parent.addressPoint.changeToLatLng(location);
        _parent.addressChanged=address;

        _this.locationMarker.setMap(null);
        _this.map.setCenter(location);
        
        _this.locationMarker = new google.maps.Marker({
            map:                         _this.map,
            // icon:                     iconMarker,
            position:                    location,
            draggable:                   true
            //animation:                     google.maps.Animation.DROP
        });

        if (_this.mapReverseGeocodeBased) {
            google.maps.event.addListener(
                _this.locationMarker,
                'dragend',
                function(pos) { _this.reverseGeocode(pos); }
            );
        } else {
            google.maps.event.addListener(
                _this.locationMarker,
                'dragend',
                function(pos) { _this.changLocation(pos); }
            );
        }
    
        _this.shapeDrawAll();

    });

};

// (void) MapManClass.editAreas ()
MapManClass.prototype.editAreas = function () {
    if (!this.started) { this.logArg("MapManClass.editAreas: not started"); return; }
    
    this.deliveryAreas=this.parent.dataBackup();

    this.iface.boxGlobalButtons.setHidden(false);
    
    this.parent.editAreasTerminated(-1);

};

// (void) MapManClass.closeEditAreas (int -1||0||1)
MapManClass.prototype.closeEditAreas = function (result) {
    if (!this.started) { this.logArg("MapManClass.closeEditAreas: not started"); return; }
    if (!this.isNumber(result) || (result!==-1 && result!==0 && result!==1))
    { this.logArg("MapManClass.closeEditAreas: Missing or bad type!"); return; }
    
    if (result===0) {
        this.parent.dataRestore(this.deliveryAreas);
//log(this.parent.addressPoint);
        this.shapes=[];
        this.draw(this.parent.addressPoint);
    }
    this.deliveryAreas=null;
    
    if (result!==-1) this.parent.editAreasTerminated(result);
    
    this.iface.boxGlobalButtons.setHidden(true);
    
};

/**
    MapManClass: Shapes method
**/

// Global

// (void) MapManClass.shapeDrawAll (void)
MapManClass.prototype.shapeDrawAll = function () {
    if (!this.started) { this.logArg("MapManClass.shapeDrawAll: not started"); return; }
//log("#>");
    var area;
    var i;
    for (i=this.parent.deliveryAreas.length-1; i>=0; i--) {

        darea=this.parent.deliveryAreas[i];
            
        if (this.shapes[i]!=null) {

            //>> if dreaggable, area data are updated by this.shapeDragEnd
            if (darea.area.type===0 && this.circleBase.draggable) continue;
            if (darea.area.type!==0 && this.polygonBase.draggable) continue;
            //<<
            this.shapes[i].setMap(null);
        }
        
        var diff=this.prevLocation.diffFromLatLng(this.locationMarker.position);

        if (!this.isZero(diff)) {
            if (darea.area.type===0 && !this.circleBase.draggable) {
                this.parent.deliveryAreas[i].area.changeToLatLng(this.locationMarker.position);
            }
            if (darea.area.type===1 && !this.polygonBase.draggable && this.polygonBase.movewithlocationifnotdraggable) {
                this.parent.deliveryAreas[i].area.moveOfXY(diff);
            }
        }

        this.shapes[i]=this.shapeDraw(i,darea.area.shape());

    }
    
    this.prevLocation=this.newPointFromLatLng(this.locationMarker.position);
//log("#<");
};

// (CircleClass or PolygonClass object) MapManClass.shapeDraw (int, CircleClass or PolygonClass object)
MapManClass.prototype.shapeDraw = function (idx,shape) {
    if (!this.started) { this.logArg("MapManClass.shapeDraw: not started"); return; }
    if (!this.isNumber(idx) || (idx<0) || (idx>this.parent.deliveryAreas.length-1))
        { this.logArg("MapManClass.shapeDraw: Missing or bad idx!"); return; }
    if (!this.isCircle(shape) && !this.isPolygon(shape))
        { this.logArg("MapManClass.shapeDraw: Missing or bad shape!"); return; }
    if (this.isCircle(shape) && shape.radius<=0)
        { this.logArg("MapManClass.shapeDraw: Missing or bad circle!"); return; }
        
    var shapeOptions;

    if (this.shapeDesign.colorsPalette>0) {
        var id=this.parent.deliveryAreas[idx].id;
        var colorIdx=0; var palette=0;
        if (this.shapeDesign.colorsPalette===1) {
            colorIdx=((id-1)%5);
        } else {
            palette=1;
            colorIdx=((id-1)%10);
        }

        var color=this.shapeDesign.colorsPalettes[palette][colorIdx];
        
        shapeOptions= {
            strokeColor:                 color,
            strokeOpacity:               this.shapeDesign.strokeColored.opacity,
            strokeWeight:                this.shapeDesign.strokeColored.weight,
            fillColor:                   this.shapeDesign.fill.color,
            fillOpacity:                 this.shapeDesign.fill.opacity/2,
            map:                         this.map
        };
        
    } else {
    
        shapeOptions= {
            strokeColor:                 this.shapeDesign.stroke.color,
            strokeOpacity:               this.shapeDesign.stroke.opacity,
            strokeWeight:                this.shapeDesign.stroke.weight,
            fillColor:                   this.shapeDesign.fill.color,
            fillOpacity:                 this.shapeDesign.fill.opacity,
            map:                         this.map
        };
        
    }

    shapeOptions.map=this.map;

    if (this.isCircle(shape)) {

        shapeOptions.center=            new google.maps.LatLng(shape.origin.y,shape.origin.x);
        shapeOptions.radius=            shape.radius;
        shapeOptions.draggable=         this.circleBase.draggable;
        
        shape = new google.maps.Circle( shapeOptions );
        
    } else {

        var _points=[];
        var i;
        for (i=0; i<shape.points.length; i++) {
            _points[i]=shape.points[i].LatLng();

        }
        
        shapeOptions.paths=            _points;
        shapeOptions.draggable=        this.polygonBase.draggable;
        
        shape = new google.maps.Polygon( shapeOptions );
        
    }
    
    if (shapeOptions.draggable) {
        var _this=this;
        google.maps.event.addListener(
            shape,
            'dragstart',
            function(pos) { _this.shapeDragStart(idx,pos); }
        );
        google.maps.event.addListener(
            shape,
            'dragend',
            function(pos) { _this.shapeDragEnd(idx,pos); }
        );
    }

    return shape;    
};

// (void) MapManClass.shapeRemoveAll ()
MapManClass.prototype.shapeRemoveAll = function () {
    if (!this.started) { this.logArg("MapManClass.shapeRemoveAll: not started"); return; }
    
    for (var i=0; i<this.shapes.length; i++) {
        if (this.shapes[i]!=null) this.shapes[i].setMap(null);
    }
    this.shapes=[];
};

// (void) MapManClass.shapeDragStart (int,GMAP pos)
MapManClass.prototype.shapeDragStart = function (idx,pos) {
//log("shapeDragStart");
    this.shapes[idx].dragstart=this.newPointFromLatLng(pos.latLng);
    if (this.deliveryAreas==null) this.editAreas();
};

// (void) MapManClass.shapeDragEnd (int,GMAP pos)
MapManClass.prototype.shapeDragEnd = function (idx,pos) {
//log("shapeDragEnd");
    var diff=this.shapes[idx].dragstart.diffFromLatLng(pos.latLng);
    this.parent.deliveryAreas[idx].area.moveOfXY(diff);
    //>> only for verification
    //    this.shapeDraw(idx,this.parent.deliveryAreas[idx].area.shape());
    //<<
};


/**
 MapManClass: Map iFace control methods
 **/


/*--- Map Controls (Zoom, Map types & Search) ---*/

// (void) MapManClass.changeType (int[1,4])
MapManClass.prototype.changeType = function (type) {
    if (!this.started) { this.logArg("MapManClass.changeType: not started"); return; }
    if ( !this.isNumber(type) || (type<0) || (type>4) )
    { this.logArg("Missing or bad type!"); return; }
    
    switch(type)
    {
        case 1:
            this.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
            break;
        case 2:
            this.map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
            break;
        case 3:
            this.map.setMapTypeId(google.maps.MapTypeId.HYBRID);
            break;
        case 4:
            this.map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
    }
    //updateValues();
};

// (void) MapManClass.changeZoom (int -1 || +1)
MapManClass.prototype.changeZoom = function (step) {
    if (!this.started) { this.logArg("MapManClass.changeZoom: not started"); return; }
    if ( !this.isNumber(step) || ((step!==-1) && (step!==1)) )
    { this.logArg("MapManClass.changeZoom: Missing or bad step!"); return; }
    this.zoom=this.map.getZoom();
    this.zoom+=step;
    if (this.zoom > this.zoomMax) {
        this.iface.btZoomPlus.setEnable(false);
    } else {
        this.iface.btZoomPlus.setEnable(true);
    }
    if (this.zoom < this.zoomMin) {
        this.iface.btZoomMoins.setEnable(false);
    } else {
        this.iface.btZoomMoins.setEnable(true);
    }
    this.map.setOptions({ zoom: this.zoom });
    
    //updateValues();
};

// (void) MapManClass.centerToPin ()
MapManClass.prototype.centerToPin = function () {
    this.map.setCenter(this.locationMarker.position);
}

// (void) MapManClass.centerToShape ()
MapManClass.prototype.centerToShape = function () {
    this.map.setCenter(this.deliveryArea.area.circle.origin.LatLng());
}


// (void) MapManClass.search ()
MapManClass.prototype.search = function () {
    if (!this.started) { this.logArg("MapManClass.search: not started"); return; }
    
    var search=this.iface.tfSearch.value();
    if (search.length===0) { this.iface.tfSearch.setFocus(true); return; }
    this.centerToAddress(search+" "+this.parent.defaultAddress,this.iface.tfSearch);
};

// (void) MapManClass.searchControl (void)
MapManClass.prototype.searchControl = function () {
    if (this.iface.tfSearch.value()=="") {
        this.iface.btSearch.setEnable(false);
    } else {
        this.iface.btSearch.setEnable(true);
    }
};


/*--- Area Controls ---*/

// (void) MapManClass.editArea ()
MapManClass.prototype.editArea = function () {
    if (!this.started) { this.logArg("MapManClass.editArea: not started"); return; }
    
    this.daIdx=this.parent.editedAreaIdx;
    this.deliveryArea=this.parent.deliveryAreas[this.parent.editedAreaIdx].copy();
    
    this.editAreaStateOn(true);

    this.iface.tfExtra0.setNumericValue(this.deliveryArea.charges[0].extra);
    this.iface.tfMinimum0.setNumericValue(this.deliveryArea.charges[0].minimum);
    this.iface.tfExtra1.setNumericValue(this.deliveryArea.charges[1].extra);
    this.iface.tfMinimum1.setNumericValue(this.deliveryArea.charges[1].minimum);
    this.iface.tfExtra2.setNumericValue(this.deliveryArea.charges[2].extra);
    this.iface.tfMinimum2.setNumericValue(this.deliveryArea.charges[2].minimum);
    
    this.setShapeControls(this.deliveryArea.area.type);
    
    this.shapeHandlesOn(this.deliveryArea.area.type);
    
    this.map.setCenter(this.deliveryArea.area.circle.origin.LatLng());
    
};

// (void) MapManClass.editAreaState (bool)
MapManClass.prototype.editAreaStateOn = function (state) {
    if (!this.started) { this.logArg("MapManClass.editAreaState: not started"); return; }
    if(!this.isBoolean(state))
        { this.logArg("MapManClass.editAreaState: Missing or bad state!"); return; }
    
    this.iface.boxValues.setHidden(!state);
    this.iface.boxDistance.setHidden(!state);
    this.iface.boxShapes.setHidden(!state);
    this.iface.boxRadius.setHidden(!state);
    this.iface.boxEdges.setHidden(!state);
    this.iface.boxBoundary.setHidden(!state);
    this.iface.boxButtons.setHidden(!state);
    this.iface.tfSearch.setEnable(!state);
    this.iface.btSearch.setEnable(!state);
    if (state) {
        this.iface.tfTitle.setValue("Editing zone "+this.deliveryArea.id);
        this.iface.tfSearch.setVoid();
    } else {
        this.iface.tfSearch.setDefault();
        this.iface.tfTitle.setDefault();
    }
    this.iface.btCenter2Shape.setEnable(state);
};

// (void) MapManClass.setShapeControls (int 0||1)
MapManClass.prototype.setShapeControls = function (type) {
    if (!this.started) { this.logArg("MapManClass.setShapeControls: not started"); return; }
    if (!this.isNumber(type) || (type!==0 && type!==1))
    { this.logArg("MapManClass.setShapeControls: Missing or bad type!"); return; }
    
    this.iface.rdShapes.setValue(type);
    
    if (type===0) {
        //this.iface.tfRadius.setEnable(true);
        //this.iface.btRadius.setEnable(true);
        this.iface.tfEdges.setEnable(false);
        this.iface.btEdges.setEnable(false);
        this.iface.tfEdges.setVoid();
        this.iface.tfBoundary.setVoid();
        this.iface.tfBoundary.setEnable(false);
        this.iface.btBoundary.setEnable(false);
        this.circleUpdateIfaceValues();

    
    } else {
        //this.iface.tfRadius.setEnable(false);
        //this.iface.btRadius.setEnable(false);
        this.iface.tfEdges.setEnable(true);
        this.iface.btEdges.setEnable(true);
        this.iface.tfBoundary.setDefault();
        this.iface.tfBoundary.setEnable(true);
        this.iface.btBoundary.setEnable(false);
        this.polygonUpdateIfaceValues();
    }
};

// (void) MapManClass.changeShape (int 0||1)
MapManClass.prototype.changeShape = function (type) {
    if (!this.isNumber(type) && (type===0 || type===1))
    { this.logArg("MapManClass.changeShape: Missing or bad type!"); return; }

    this.shapeHandlesOff((type===0)?1:0);

    if (type===0) {
        this.deliveryArea.area.changeType(0);
    } else {
        edges= (this.deliveryArea.area.polygon.isDefaultPolygon())
        ? this.polygonBase.edges
        : this.deliveryArea.area.polygon.points.length;
        this.deliveryArea.area.changeType(1,edges);
    }

    this.setShapeControls(type);

    this.shapes[this.daIdx].setMap(null);

    this.shapes[this.daIdx]=this.shapeDraw(this.daIdx,this.deliveryArea.area.shape());

    this.shapeHandlesOn(type);

};


// (void) MapManClass.closeEditArea (int -1||0||1)
MapManClass.prototype.closeEditArea = function (result) {
    if (!this.started) { this.logArg("MapManClass.closeEditArea: not started"); return; }
    if (!this.isNumber(result) || (result!==-1 && result!==0 && result!==1))
        { this.logArg("MapManClass.closeEditArea: Missing or bad type!"); return; }

    var type=this.deliveryArea.area.type;
    
    this.editAreaStateOn(false);

    if (result===1) {
        this.deliveryArea.charges[0].extra=(this.iface.tfExtra0.numericValue());
        this.deliveryArea.charges[0].minimum=(this.iface.tfMinimum0.numericValue());
        this.deliveryArea.charges[1].extra=(this.iface.tfExtra1.numericValue());
        this.deliveryArea.charges[1].minimum=(this.iface.tfMinimum1.numericValue());
        this.deliveryArea.charges[2].extra=(this.iface.tfExtra2.numericValue());
        this.deliveryArea.charges[2].minimum=(this.iface.tfMinimum2.numericValue());

        if (type===1) {
            this.deliveryArea.area.polygon.selfBearing();
            this.deliveryArea.area.polygon.selfWise(1);
        }
        
        this.parent.deliveryAreas[this.daIdx]=this.deliveryArea.copy();
        
    } else {
        this.deliveryArea=this.parent.deliveryAreas[this.daIdx].copy();
    }
    
    this.shapeHandlesOff(type);
    
    this.shapes[this.daIdx].setMap(null);
    this.shapes[this.daIdx]=this.shapeDraw(this.daIdx, this.deliveryArea.area.shape());
    
    if (result!==-1) this.parent.editAreaWithIdTerminated(result);
};



/*--- Shape Controls ---*/

// (void) MapManClass.shapeHandlesOn (int)
MapManClass.prototype.shapeHandlesOn = function (type) {
    if (!this.started) { this.logArg("MapManClass.shapeHandlesOn: not started"); return; }
    if (!this.isNumber(type) || (type!==0 && type!==1))
        { this.logArg("MapManClass.shapeHandlesOn: Missing or bad type"); return; }

    this.locationMarker.setOptions({draggable:false});

    for (var i=0; i<this.shapes.length; i++) {

        if (i===this.daIdx && this.shapes[i].getDraggable()) {

            google.maps.event.clearListeners(this.shapes[i],'dragstart');
            google.maps.event.clearListeners(this.shapes[i],'dragend');
            var _this=this;
            google.maps.event.addListener(
                                          this.shapes[i],
                                          'dragstart',
                                          function(pos) { _this.shapeEditedDragStart(pos); }
                                          );
            google.maps.event.addListener(
                                          this.shapes[i],
                                          'dragend',
                                          function(pos) { _this.shapeEditedDragEnd(pos); }
                                          );
        } else {
            this.shapes[i].setOptions({draggable:false});
        }
    }
    
    this.shapes[this.daIdx].setOptions({
        strokeColor:    this.shapeDesign.strokeEdited.color,
        strokeOpacity:  this.shapeDesign.strokeEdited.opacity,
        strokeWeight:   this.shapeDesign.strokeEdited.weight,
        fillColor:      this.shapeDesign.fillEdited.color,
        fillOpacity:    this.shapeDesign.fillEdited.opacity
    });
    
    if (type===0) {
        this.circleCreateMarker();
    } else {
        this.polygonCreateMarkers();
    }
    
};

// (void) MapManClass.shapeEditedDragStart (GMAP pos)
MapManClass.prototype.shapeEditedDragStart = function (pos) {
    //log("shapeDragStart");
    this.shapes[this.daIdx].dragstart=this.newPointFromLatLng(pos.latLng);
    
    //start handle
    if (this.deliveryArea.area.type===0) {
        this.circleTerminate();
    } else {
        this.polygonTerminate();
    }
};


// (void) MapManClass.shapeEditedDragEnd (GMAP pos)
MapManClass.prototype.shapeEditedDragEnd = function (pos) {
    var diff=this.shapes[this.daIdx].dragstart.diffFromLatLng(pos.latLng);
    this.deliveryArea.area.moveOfXY(diff);

    if (this.deliveryArea.area.type===0) {
        this.circleUpdateIfaceValues();
        this.circleCreateMarker();
    } else {
        this.polygonUpdateIfaceValues();
        this.polygonCreateMarkers();
    }

};

// (void) MapManClass.shapeHandlesOff (int 0||1)
MapManClass.prototype.shapeHandlesOff = function (type) {
    if (!this.started) { this.logArg("MapManClass.shapeHandlesOff: not started"); return; }
    if (!this.isNumber(type) || (type!==0 && type!==1))
        { this.logArg("MapManClass.shapeHandlesOff: Missing or bad type"); return; }

    this.locationMarker.setOptions({draggable:true});
    for (var i=0; i<this.shapes.length; i++) {
        if (i===this.daIdx && this.shapes[i].getDraggable()) {

            google.maps.event.clearListeners(this.shapes[i],'dragstart');
            google.maps.event.clearListeners(this.shapes[i],'dragend');
            var _this=this;
            google.maps.event.addListener(
                                          this.shapes[i],
                                          'dragstart',
                                          function(pos) { _this.shapeDragStart(i,pos); }
                                          );
            google.maps.event.addListener(
                                          this.shapes[i],
                                          'dragend',
                                          function(pos) { _this.shapeDragEnd(i,pos); }
                                          );
        } else {
            if (this.parent.deliveryAreas[i].area.type===0) {
                this.shapes[i].setOptions({draggable:this.circleBase.draggable});
            } else {
                this.shapes[i].setOptions({draggable:this.polygonBase.draggable});
            }
        }
    }
    
    this.shapes[this.daIdx].setOptions({
        strokeColor:        this.shapeDesign.stroke.color,
        strokeOpacity:      this.shapeDesign.stroke.opacity,
        strokeWeight:       this.shapeDesign.stroke.weight,
        fillColor:          this.shapeDesign.fill.color,
        fillOpacity:        this.shapeDesign.fill.opacity
    });
    
    if (type===0) {
        this.circleTerminate();
    } else {
        this.polygonTerminate();
    }
};

// (void) MapManClass.setRadius ()
MapManClass.prototype.setRadius = function () {
    if (!this.started) { this.logArg("MapManClass.shapeHandlesOff: not started"); return; }
    
    if (this.deliveryArea.area.type===0) {
        this.circleSetRadius();
    } else {
        this.polygonSetRadius();
    }
    
};


/*--- Circle Controls ---*/

/* Handle */

// (void) MapManClass.circleCreateMarker (int)
MapManClass.prototype.circleCreateMarker = function () {
    if (!this.started) { this.logArg("MapManClass.circleCreateMarker: not started"); return; }
    
    var radius=this.deliveryArea.area.circle.radius;
    this.prevRadius=radius;

    var dot=this.deliveryArea.area.circle.origin.projectWithBearing(
                                radius,this.circleBase.bearing);
            
    var _this=this;
    
    var markerImage = new google.maps.MarkerImage(      this.shapeDesign.handle.ends,
                                                        new google.maps.Size(11,11),
                                                        null,
                                                        new google.maps.Point(5,5)
                                                );
                
    var marker = new google.maps.Marker({
                                        position:           dot,
                                        map:                this.map,
                                        icon:               markerImage,
                                        raiseOnDrag:        false,
                                        draggable:          true
                                        });
    this.circleMarker=marker;
    
    google.maps.event.addListener(    // update dragged Radius
                                    marker,
                                      "drag",
                                      function(newMarker) {
                                          _this.circleMarker.setPosition( newMarker.latLng );
                                  
                                          _this.circleChangeRadius();
                                  
                                          _this.circleUpdateIfaceValues();
                                      });

};

// (void) MapManClass.circleChangeRadius (int,int 0||1)
MapManClass.prototype.circleChangeRadius = function () {
    if (!this.started) { this.logArg("MapManClass.circleChangeRadius: not started"); return; }

    var circle = this.deliveryArea.area.circle;
    var radius = circle.computeRadiusWithLatLngPoint (this.circleMarker.getPosition());
    

        var newRadius=this.circleUniqueRadius(radius);
        
        if (newRadius!==radius) {
        
            this.circleMarker.setPosition(
                this.deliveryArea.area.circle.origin.projectWithBearing(
                    this.prevRadius,
                    this.deliveryArea.area.circle.origin.bearingWithLatLng(
                                                        this.circleMarker.position)
                )
            );
            radius=this.prevRadius;
        }
    
    this.prevRadius=this.deliveryArea.area.circle.radius;
    this.deliveryArea.area.circle.radius=radius;
    
    this.shapes[this.daIdx].setRadius(radius);
    this.shapes[this.daIdx].setMap(this.map);
};

// (void) MapManClass.circleUpdateIfaceValues (int, string)
MapManClass.prototype.circleUpdateIfaceValues = function (option) {
    //option: 'clear' to void radius info
    if (!this.started) { this.logArg("MapManClass.circleUpdateIfaceValues: not started"); return; }
    if (option) {
        if (!this.isString(option) || (option!=="clear" && option!==""))
        { this.logArg("MapManClass.circleUpdateIfaceValues: Missing or bad option"); return; }
    }
    
    var radius = this.deliveryArea.area.circle.radius;
    

    if (option!=='clear') {

        var circle=this.deliveryArea.area.circle;
        this.iface.tfRadius.setNumericValue(circle.radiusInKm());
        var d=this.convertDistanceInKm(
                       circle.longestDistanceFromLatLngPoint(this.locationMarker.position));
        
        this.iface.tlDistance.setNumericValue(d);

    } else {
        this.iface.tfRadius.setVoid();
    }
};

// (int) MapManClass.circleUniqueRadius (int)
MapManClass.prototype.circleUniqueRadius = function (radius) {
    if (!this.started) { this.logArg("MapManClass.circleUniqueRadius: not started"); return; }
    if (!this.isNumber(radius) && radius<=0)
        { this.logArg("MapManClass.circleUniqueRadius: Missing or bad radius"); return; }
    
    for (var i=0; i<this.parent.deliveryAreas.length; i++) {
        if (i!==this.daIdx
            && this.parent.deliveryAreas[i].area.type===0
            && this.isZero(this.parent.deliveryAreas[i].area.circle.origin.diffFromLatLng(
                                                          this.locationMarker.position))
            && Math.abs(this.parent.deliveryAreas[i].area.circle.radius-radius)
            <this.circleBase.minimumradius ) {
            radius=this.prevRadius;
            break;
        }
    }
    //
    if (radius<this.circleBase.minimumradius) {
        radius=this.circleBase.minimumradius/1000;
    }
    return radius;
};

// (void) MapManClass.circleTerminate (void)
MapManClass.prototype.circleTerminate = function () {
    if (!this.started) { this.logArg("MapManClass.circleTerminate: not started"); return; }
    
    google.maps.event.clearInstanceListeners(this.circleMarker);
    this.circleMarker.setMap(null);
    this.prevRadius=null;
};



/* iFace Controls */

// (void) MapManClass.circleSetRadius (int)
MapManClass.prototype.circleSetRadius = function (radius) {
    if (!this.started) { this.logArg("MapManClass.circleSetRadius: not started"); return; }
    if (!radius) radius=this.iface.tfRadius.numericValue();
    if(!this.isNumber(radius) && radius<=0)
        { this.logArg("MapManClass.circleSetRadius: Missing or bad radius!"); return; }
    //if (radius==0) return;
    
    radius=radius*1000;
        
    var newRadius=this.circleUniqueRadius(radius);

    if(newRadius===this.deliveryArea.area.circle.radius) return;

    this.prevRadius=this.deliveryArea.area.circle.radius;
    this.deliveryArea.area.circle.radius=radius;
    
    this.shapes[this.daIdx].setRadius(radius);
    this.shapes[this.daIdx].setMap(this.map);
    
    this.circleMarker.setPosition(
                        this.deliveryArea.area.circle.origin.projectWithBearing(
                            radius,
                            this.circleBase.bearing ));
                
    this.circleUpdateIfaceValues();
};

// (void) MapManClass.circleRadiusControl (void)
MapManClass.prototype.circleRadiusControl = function () {
    if (!this.started) { this.logArg("MapManClass.circleRadiusControl: not started"); return; }
    if (parseFloat(this.iface.tfRadius.numericValue())===0.0) {
        this.iface.btRadius.setEnable(false);
    } else {
        this.iface.btRadius.setEnable(true);
    }
};


/*--- Polygon Controls ---*/

/* Handles */

// (void) MapManClass.polygonCreateMarkers (int)
MapManClass.prototype.polygonCreateMarkers = function () {
    if (!this.started) { this.logArg("MapManClass.circleCreateMarker: not started"); return; }

    var _this=this;
    
    //this.map.setOptions({ draggableCursor: 'crosshair' });
    
    google.maps.event.addListener(
                                    this.map,
                                    "click",
                                    function (newMarker) {
                                    
                                        _this.polygonAddPoint(newMarker.latLng);
                                    
                                    }
                                );
    var i=0;
    for (i=0; i<this.shapes.length; i++) {
        
        //this.shapes[i].setOptions({ draggableCursor: 'crosshair' });
        
        google.maps.event.addListener(
                                        this.shapes[i],
                                        "click",
                                        function (newMarker) {
                                      
                                            _this.polygonAddPoint(newMarker.latLng);
                                      
                                        }
                                    );
    }
    
    var points=this.deliveryArea.area.polygon.points;
    
    for (i=0; i<points.length; i++) {
        
        if (i===0 || i===points.length-1) {
            this.polygonCreateMarker(points[i].LatLng(),'setend'); // << add param i to repair dot on map
        } else {
            this.polygonCreateMarker(points[i].LatLng(),'set'); // << add param i to repair dot on map
        }
    }
    
    //showShapeValues('polygon');
    
};

// (void) MapManClass.polygonAddPoint (LatLng Point)
MapManClass.prototype.polygonAddPoint = function (point) {
    if (!this.isLatLng(point))
        { this.logArg("MapManClass.polygonAddPoint: Missing or bad point"); return; }
//log("polygonAddPoint: ");
//log(point);
    
   var segment=this.deliveryArea.area.polygon.framingSerialByDistancesAndArrow(
                                            new PointClass(point.lng(),point.lat()),0.100);
//log("polygonAddPoint segment value: "+segment);
    
    
    
    if (segment.length==2 && segment[0]!=this.polygonMarkers.length-1) {
//log("polygonAddPoint segment: ");
        this.polygonCreateMarker(point,'set',segment[1]);
        this.shapes[this.daIdx].getPath().insertAt(segment[1],point);
        this.deliveryArea.area.insertPolygonPointAtIndex(this.newPointFromLatLng(point),segment[1]);
        
    } else {
//log("polygonAddPoint off segment: ");
        this.polygonCreateMarker(point,'set');
        this.shapes[this.daIdx].getPath().push(point);
        this.deliveryArea.area.addPolygonPoint(this.newPointFromLatLng(point));
        
    }
    
    this.polygonUpdateEnds();
    
    this.polygonUpdateIfaceValues();
    
//log("<<<polygonAddPoint");
};

// (Gmap Marker) MapManClass.polygonCreateMarker (latLng Point)
MapManClass.prototype.polygonCreateMarker = function (dot,state,idx) {
    if (!this.started) { this.logArg("MapManClass.circleCreateMarker: not started"); return; }
    if (!this.isLatLng(dot))
        { this.logArg("MapManClass.circleCreateMarker: Missing or bad dot"); return; }
    if (!this.isString(state) || (state!=='set' && state!=='setend' && state!=='on' && state!=='off'))
        { this.logArg("MapManClass.circleCreateMarker: Missing or bad state"); return; }
    if (idx) {
        if (!this.isNumber(idx) || idx<0 || idx>this.polygonMarkers.length-1)
            { this.logArg("MapManClass.circleCreateMarker: bad idx"); return; }
    }
    
    var _this=this;
    
    var marker = new google.maps.Marker({
                                        position:        dot,
                                        map:             this.map,
                                        //icon:             setMarker(),
                                        raiseOnDrag:     false,
                                        draggable:       true
                                        });
    
    if ( (state==='set') || (state==='setend')) {
        marker.setIcon( this.polygonSetHandles(marker,state) );
    } else {
        marker.setIcon( this.polygonSetHandles(marker,'off') );
    }
    
    if (idx) {
        this.polygonMarkers.splice(idx,0,marker);
    } else {
        this.polygonMarkers.push(marker);
    }
    
    google.maps.event.addListener(    // set Handle ON
                                      marker,
                                      "mouseover",
                                  function () { marker.setIcon( _this.polygonSetHandles(marker,'on') ); }
                                );
                
    google.maps.event.addListener(  // set Handle OFF
                                    marker,
                                    "mouseout",
                                  function () { marker.setIcon( _this.polygonSetHandles(marker,'off') ); }
                                );
    
    google.maps.event.addListener(    // update Polygon dragged Point
                                      marker,
                                      "drag",
                                  function (newMarker) { _this.polygonChangePoint(marker, newMarker); }
                                );
    
    google.maps.event.addListener(  // remove Polygon Point
                                      marker,
                                      "click",
                                  function () { _this.polygonRemovePoint(marker); }
                                );
    return marker;

};

// (GMap MarkerImage) MapManClass.polygonSetHandles (GMap marker, string)
MapManClass.prototype.polygonSetHandles = function (marker,state) {
    if (!this.isString(state) || (state!=='set' && state!=='setend' && state!=='on' && state!=='off'))
        { this.logArg("MapManClass.polygonSetHandles: Missing or bad state"); return; }

    var iconImage;

    if ( (state!=='set') && (state!=='setend') ) {
        for (var i=0,polygonRow ; polygonRow=this.polygonMarkers[i] ; i++) {
            if (polygonRow===marker) { break; }
        }
        if ( (i===0) || (i===(this.polygonMarkers.length-1)) ) {
            if (state==='on') {
                iconImage=this.shapeDesign.handle.endsselect;
            } else {
                iconImage=this.shapeDesign.handle.ends;
            }
        } else {
            if (state==='on') {
                iconImage=this.shapeDesign.handle.selected;
            } else {
                iconImage=this.shapeDesign.handle.base;
            }
        }
    } else {
        if (state==='set') {
            iconImage=this.shapeDesign.handle.base;
        } else {
            iconImage=this.shapeDesign.handle.ends;
        }
    }

    return new google.maps.MarkerImage(
                iconImage, new google.maps.Size(11,11), null, new google.maps.Point(5,5) );
        
};


// (void) MapManClass.polygonTerminate (void)
MapManClass.prototype.polygonTerminate = function () {
    if (!this.started) { this.logArg("MapManClass.circleUniqueRadius: not started"); return; }
    
    var i=0; var polygonRow;
    for(i=0; i<this.polygonMarkers.length; i++) {
        polygonRow=this.polygonMarkers[i];
        google.maps.event.clearInstanceListeners(polygonRow);
        polygonRow.setMap(null);
    }
    
    this.polygonMarkers=[];
    
    google.maps.event.clearListeners(this.map,"click");
    for (i=0; i<this.shapes.length; i++) {
        google.maps.event.clearListeners(this.shapes[i],"click");
    }
    
};


/* Handles events */

// (void) MapManClass.polygonChangePoint (int, GMap markers)
MapManClass.prototype.polygonChangePoint = function (marker, newMarker) {
    if (!this.started) { this.logArg("MapManClass.polygonChangePoint: not started"); return; }
    
    var newMarkerCoord; var polygonRow;
    for (var i=0,polygonRow; i<this.polygonMarkers.length; i++) {
        polygonRow=this.polygonMarkers[i];
        if (polygonRow===marker) {
            newMarkerCoord=newMarker.latLng;
            break;
        }
    }
    this.shapes[this.daIdx].getPath().setAt(i,newMarkerCoord);
    this.deliveryArea.area.changePolygonPointAtIndex(
                                            i,this.newPointFromLatLng(newMarkerCoord));
    
    this.polygonUpdateIfaceValues();
};

// (void) MapManClass.polygonRemovePoint (int, GMap marker)
MapManClass.prototype.polygonRemovePoint = function (marker) {
    if (!this.started) { this.logArg("MapManClass.polygonRemovePoint: not started"); return; }
        
    if ( this.polygonMarkers.length >= 4 ) {
        var polygonRow;
        for (var i=0,polygonRow; i<this.polygonMarkers.length; i++) {
            polygonRow=this.polygonMarkers[i];
            if (polygonRow===marker) {
                polygonRow.setMap(null);
                this.polygonMarkers.splice(i,1);
                break;
            }
        }
        this.shapes[this.daIdx].getPath().removeAt(i);
        this.deliveryArea.area.removePolygonPointAtIndex(i);

        this.polygonUpdateEnds();
        
        this.polygonUpdateIfaceValues();
    }
};

// (void) MapManClass.polygonUpdateEnds (void)
MapManClass.prototype.polygonUpdateEnds = function () {
    if (!this.started) { this.logArg("MapManClass.circleUniqueRadius: not started"); return; }
    
    var polygonRow;
    for (var i=0; i<this.polygonMarkers.length; i++) {
//log("update: "+i);
        polygonRow=this.polygonMarkers[i];
        polygonRow.setIcon( this.polygonSetHandles(polygonRow,'off') );
    }
};


/* iFace Controls */

// (void) MapManClass.polygonUpdateIfaceValues (int, string)
MapManClass.prototype.polygonUpdateIfaceValues = function (option) {
    //option: 'clear' to void radius info
    if (!this.started) { this.logArg("MapManClass.polygonUpdateIfaceValues: not started"); return; }
    if (option) {
        if (!this.isString(option) || (option!=="clear" && option!==""))
        { this.logArg("MapManClass.polygonUpdateIfaceValues: Missing or bad option"); return; }
    }

    var polygon=this.deliveryArea.area.polygon;
//log(polygon.exoCircle());
    this.iface.tfRadius.setNumericValue(this.convertDistanceInKm(
        polygon.exoCircle().radius)
        );

    this.iface.tfEdges.setValue(polygon.points.length);
    
    var d=this.convertDistanceInKm(
                    polygon.longestDistanceFromLatLngPoint(this.locationMarker.position));
    this.iface.tlDistance.setNumericValue(d);
    
};

// (void) MapManClass.polygonSetEdges (int)
MapManClass.prototype.polygonSetEdges = function (edges) {
    if (!this.started) { this.logArg("MapManClass.polygonSetEdges: not started"); return; }
    if (!edges) edges=this.iface.tfEdges.value()*1;
    if (!this.isNumber(edges) || edges<3)
        { this.logArg("MapManClass.polygonSetEdges: Missing or bad edges"); return; }

    this.deliveryArea.area.computePolygon(null,edges);
    
    this.shapeHandlesOff(1);
    this.shapes[this.daIdx].setMap(null);
    this.shapes[this.daIdx]=this.shapeDraw(this.daIdx, this.deliveryArea.area.shape());
    this.shapeHandlesOn(1);
    
};

// (void) MapManClass.polygonSetRadius (int)
MapManClass.prototype.polygonSetRadius = function (radius) {
    if (!this.started) { this.logArg("MapManClass.polygonSetRadius: not started"); return; }
    if (!radius) radius=this.iface.tfRadius.numericValue()*1000;

    if(!this.isNumber(radius) && radius<=0)
        { this.logArg("MapManClass.polygonSetRadius: Missing or bad radius!"); return; }
    
    this.deliveryArea.area.computePolygon(radius,null);
    
    this.shapeHandlesOff(1);
    this.shapes[this.daIdx].setMap(null);
    this.shapes[this.daIdx]=this.shapeDraw(this.daIdx, this.deliveryArea.area.shape());
    this.shapeHandlesOn(1);
};

// (void) MapManClass.polygonEdgesControl (void)
MapManClass.prototype.polygonEdgesControl = function () {
    if (parseInt(this.iface.tfEdges.value())<3) {
        this.iface.btEdges.setEnable(false);
    } else {
        this.iface.btEdges.setEnable(true);
    }
};

// (void) MapManClass.polygonBoundaryControl (void)
MapManClass.prototype.polygonBoundaryControl = function () {
    if (this.iface.tfBoundary.value()=="") {
        this.iface.btBoundary.setEnable(false);
    } else {
        this.iface.btBoundary.setEnable(true);
    }
};

// (void) MapManClass.polygonSetBoundaryCall (array)
MapManClass.prototype.polygonSetBoundaryCall = function () {
    if (!this.started) { this.logArg("MapManClass.polygonSetBoundaryCall: not started"); return; }

    var code=this.iface.tfBoundary.value();
    if (code==="") { this.logArg("MapManClass.polygonSetBoundaryCall: void code"); return; }
    
    this.parent.adminBoundsCaller(code);

};

// (void) MapManClass.polygonSetBoundary (int -1|1)
MapManClass.prototype.polygonSetBoundary = function (status,array) {
    if (!this.started) { this.logArg("MapManClass.polygonSetBoundary: not started"); return; }
    if (!this.isNumber(status))
        { this.logArg("MapManClass.polygonSetBoundary: Missing or bad status"); return; }
    if (status>=0) {
        if (!this.isArray(array) || !this.isUnclassedDefinedPolygon(array))
            { this.logArg("MapManClass.polygonSetBoundary: Missing or bad array"); return; }
        
        // follow same process as polygonSetRadius or polygonSetEdges
        this.deliveryArea.area.changeToXY(array);
 
        this.shapeHandlesOff(1);
        this.shapes[this.daIdx].setMap(null);
        this.shapes[this.daIdx]=this.shapeDraw(this.daIdx, this.deliveryArea.area.shape());
        this.shapeHandlesOn(1);
        
        // center map to new polygon?
        //      maybe we will need a "center2map" button
        this.map.setCenter(this.deliveryArea.area.circle.origin.LatLng());
        
    } else {
        if (!this.isArray(array))
            { this.logArg("MapManClass.polygonSetBoundary: Missing or bad array"); return; }
        
        alert("Code not found:"+array[0]);
    }
};




