/*****************************************************************************************


    DeliveryAreasManClass Class
    © Asity 2013
 
    version: ß1.00.05
 
*****************************************************************************************/

/**
    DeliveryArea (pseudo) Class (AreaClass extend, composite AreaClass)
**/

// (object) DeliveryAreaClass (number,object{charges:[3x{extra:number,minimum:number}],area:AreaClass})
function DeliveryAreaClass (_id, _args) {
    //params set or default
    this.id = (this.isNumber(_id)) ? _id    : -1;
    var voidcharges=[{extra:0,minimum:0},{extra:0,minimum:0},{extra:0,minimum:0}];
    if (!this.isObject(_args)) _args={id:-1, charges:voidcharges, area:new AreaClass()};
    this.charges =  (this.isArray(_args.charges))   ? _args.charges : voidcharges;
    this.area =     (this.isArea(_args.area))       ? _args.area    : new AreaClass();
    
    if (this.logInit) this.log("DeliveryArea init: "+this.description());
}
DeliveryAreaClass.prototype = Object.create(AreaClass.prototype);

DeliveryAreaClass.prototype.description = function() {
    return this.id+this.ISEP+this.extra+this.ISEP+this.minimum+this.ISEP+this.ISEP
    +this.area.description();
};

// (DeliveryAreaClass object) DeliveryAreaClass.copy ()
DeliveryAreaClass.prototype.copy = function() {
    return new DeliveryAreaClass(
                                 this.id, {
                                 charges:       this.charges.slice(0),
                                 area:          this.area.copy()
                                 });
};

// (formatted object) DeliveryAreaClass.unClassedDeliveryArea ()
DeliveryAreaClass.prototype.unClassedDeliveryArea = function() {
    var polygon = (this.area.type===1) ? this.area.polygon.unclassedDefinedPolygon() : null;
    return {
            id:         this.id,
            charges:    this.charges,
            type:       this.area.type,
            circle:     this.area.circle.unClassedDefinedCircle(),
            polygon:    polygon
    };
};



/**
    DeliveryAreasManager (pseudo) Class (DeliveryAreaClass extend, composite DeliveryArea)
**/

// (object) DeliveryAreasManClass (string || point{x:number,y:number},callback,options)
//            param:    string:        literal address
//                                || geographic address as {x:number,y:number}
//                    [callback]    general callback return for general edition
//                                (location marker and shapes moves) - optional
//                    [options]={
//                    callbackAeraFullDataOn:       return always full data (general edition
//                                                  and shape edition.
//                                                  . default true
//                    callbackEditAlwaysGeneral:    use always general callback (bypass the shape
//                                                  edition callback)
//                                                  . default true
//                    areasEditionBlocking:         no add, remove or edition messages can be give
//                                                  while pending edition.
//                                                  . default true
//                    areasNoAreaDisallowed:        disallow to delete the last area
//                                                  . default true
//                    mapReverseGeocodeBased:       base each pin marker move on literal address
//                                                  discovery.
//                                                  . default false
//                    mapSearchBaseCountry:         base search and centering when no address found
//                                                  . default "France"
//                    mapShapesColorWheel:          colorwheel used for shape strokes (0=no color
//                                                  1=5 colors, 2=10 colors)
//                                                  . default 1
//                    mapShapesPolygonDraggable:    are they centered to pin or draggable?
//                                                  . default true
//                    mapShapesCircleDraggable:     are they centered to pin or draggable?
//                                                  . default false
//                    mapLocationAlertChangeOn:     alert what means change pin by drag or search
//                                                  . default true
//                    mapLocationAlertChangeOnNoRepeat: do not repeat alert for each change
//                                                  . default false
//                    mapLocationChangesMovePolygonsWhenNotDraggable set polygons move with location pin drag or
//                                                  location change when polygons are not draggables
//                                                  . default true
//                    resourcesFolderPath:          set path of resource folder where base dam imgs
//                                                  . default 'resources/'
//                    localeParams:                 set texts and decimal separator
//                                                  . default english texts and dot as decimal separator
//
function DeliveryAreasManClass (address,callback,options) {
    if(!this.isString(address) && !this.isUnclassedDefinedPoint(address))
        { this.logArg("DeliveryAreasManClass: Missing or bad address!"); return; }
    if(this.isString(address) && address.length===0)
        { this.logArg("DeliveryAreasManClass: address void!"); return; }
    if(callback && !this.isFunction(callback))
            { this.logArg("DeliveryAreasManClass: Missing or bad callback!"); return; }
    if(options && !this.isObject(options))
        { this.logArg("DeliveryAreasManClass: bad options!"); return; }
    
    
    // load global options
    this.options=                       (options) ? options : {};
    
    // properties
    this.deliveryAreas=                 [];
    
    this.defaultAddress=                this.option("mapSearchBaseCountry","France");
    this.address=                       (this.isString(address))
                                        ? address : this.defaultAddress;
    this.addressChanged=                null;
    this.addressPoint=                  (this.isUnclassedDefinedPoint(address))
                                        ? new PointClass(address.x, address.y)
                                        : null;
    this.addressPointChanged=           null;
    
    // load self options
    this.callbackAeraFullDataOn=        this.option("callbackAeraFullDataOn",true);
    this.callbackEditAlwaysGeneral=     this.option("callbackEditAlwaysGeneral",true);
    this.areasEditionBlocking=          this.option("areasEditionBlocking",true);
    this.areasNoAreaDisallowed=         this.option("areasNoAreaDisallowed",true);
    this.resourcesFolder=               this.option("resourcesFolderPath",'resources/');

    this.locale=                        this.option("localeParams",{
        decimalSeparator:               '.',
        texts:                          {
            s1:                         "General Location and Delivery Areas Edition",
            s2:                         "code, name...",
            s3:                         "Address, Town, Zip, Area code...",
            
            m1a:                        "Base Address not found!",
            m1b:                        "You'll be centered to '",
            m2a:                        "Location change!",
            m2b:                        "Commercial information will not be changed, only geographic location",
            m3a:                        "Fail to find address for position!",
            m3b:                        "Returning to last position.",
            m4a:                        "New address: ",
            m5a:                        "Address not found!",
            m5b:                        "Try to extend with zip, department, region...",
                                         },
        });
    
    // start Map
    this.map=                           new MapManClass(this);
    
    // State ivars
    this.idHistory=                     0;
    this.editedGeneralCallback=         (callback)?callback:null;
    this.editedAreaIdx=                 -1;
    this.editedNewAreaIdx=              null;
    this.editedAreaCallback=            null;
    
    
}
DeliveryAreasManClass.prototype = Object.create(DeliveryAreaClass.prototype);


/* (-) Tools */

// (bool) DeliveryAreasManClass.editionSemaphore (int -2||-1||0||1)
DeliveryAreasManClass.prototype.editionSemaphore = function (state) {
    if (!this.isNumber(state) || (state!==-2 && state!==-1 && state!==0 && state!==1))
    { this.logArg("DeliveryAreasManClass.editionSemaphore: Missing or bad state!"); return; }
    
    if (state>=0) {

        if (this.editedNewAreaIdx==null && this.areasEditionBlocking
            && (this.editedAreaIdx!==-1 || this.map.deliveryAreas!=null)) return false;

        if (this.editedAreaIdx!==-1) this.map.closeEditArea(-1);
        if (this.map.deliveryAreas!=null) this.map.closeEditAreas(-1);
        
    } else {
        
        if (state===-1 && this.editedAreaIdx!==-1) {
            this.editedAreaIdx=-1;
            this.editedAreaCallback=null;
        }
        if (this.map.started) {
            this.map.shapeRemoveAll();
            this.map.shapeDrawAll();
            this.map.centerToPin();
        } else {
            return false;
        }
        
    }
    return true;
};

/* (-) Getters */

// (object) DeliveryAreasManClass.dataExport ()
DeliveryAreasManClass.prototype.dataExport = function () {
    var deliveryAreas=[];
    for (var i=0; i<this.deliveryAreas.length; i++) {
        deliveryAreas.push(this.deliveryAreas[i].unClassedDeliveryArea());
    }
    return {
        location:       this.location(),
        history:        this.idHistory,
        deliveryareas:  deliveryAreas
    };
};

// (string) DeliveryAreasManClass.dataLiteralExport (string)
DeliveryAreasManClass.prototype.dataLiteralExport = function (objectName) {
    if(!this.isString(objectName) || objectName.length===0)
        { this.logArg("DeliveryAreasManClass.dataLiteralExport: Missing or bad objectName!"); return; }
        
    var buff="";
    buff+="var "+objectName;
    buff+="=new DeliveryAreasManClass(";
    buff+="{x:"+this.addressPoint.x+",y:"+this.addressPoint.y+"}";
    buff+=",null,options);\n";
    var dai;
    for (var i=0; i<this.deliveryAreas.length; i++) {
        dai=this.deliveryAreas[i];
        buff+=objectName+".addArea({";
        buff+="charges:[{extra:"+dai.charges[0].extra+",minimum:"+dai.charges[0].minimum+"},";
        buff+="{extra:"+dai.charges[1].extra+",minimum:"+dai.charges[1].minimum+"},";
        buff+="{extra:"+dai.charges[2].extra+",minimum:"+dai.charges[2].minimum+"}]";
        buff+=",circle:{origin:{x:"+dai.area.circle.origin.x+",y:"+dai.area.circle.origin.y+"}";
        buff+=",radius:"+dai.area.circle.radius+"}";
        if (dai.area.type===0) {
            buff+=",polygon:null";
        } else {
            buff+=",polygon:[";
            for (var j=0; j<dai.area.polygon.points.length; j++) {
                buff+="{x:"+dai.area.polygon.points[j].x+",y:"+dai.area.polygon.points[j].y+"}";
                if (j!==dai.area.polygon.points.length-1) buff+=",";
            }
            buff+="]";
        }
        buff+="});\n";
    }
    return buff;
};


// (object) DeliveryAreasManClass.dataBackup ()
DeliveryAreasManClass.prototype.dataBackup = function () {
    var deliveryAreas=[];
    for (var i=0; i<this.deliveryAreas.length; i++) {
        deliveryAreas.push(this.deliveryAreas[i].copy());
    }
    return {
        address:            this.address,
        addressPoint:       this.addressPoint.copy(),
        deliveryAreas:      deliveryAreas
    };
};


// (int) DeliveryAreasManClass.indexOfId (int)
DeliveryAreasManClass.prototype.indexOfId = function (id) {
    if (!this.isNumber(id) || id<1)
        { this.logArg("DeliveryAreasManClass.indexOfId: Missing or bad id!"); return; }
    var i; for (i=0; i<this.deliveryAreas.length; i++) {
        if (this.deliveryAreas[i].id===id) return i;
    }
    return -1;
};

// (object) DeliveryAreasManClass.location ()
DeliveryAreasManClass.prototype.location = function () {
    return {
            address:            this.address,
            newaddress:         this.addressChanged,
            pointaddress:       (this.addressPoint!=null)
                                ? this.addressPoint.unClassedDefinedPoint()
                                : null,
            newpointaddress:    (this.addressPointChanged!=null)
                                ? this.addressPointChanged.unClassedDefinedPoint()
                                : null
    };
};

// (misc) DeliveryAreasManClass.option (string,misc)
DeliveryAreasManClass.prototype.option = function (option,value) {
    if (!this.isString(option))
        { this.logArg("DeliveryAreasManClass.option: Missing or bad option!"); return; }
    
    var result=(this.isDefined(this.options[option])) ? this.options[option] : value;
    log(">"+option+"("+((this.isDefined(this.options[option]))?"set":"notset")+"):"+result);
    return result;
};


/* (-) Setters */

// (void) DeliveryAreasManClass.dataRestore (object)
DeliveryAreasManClass.prototype.dataRestore = function (object) {
    if (    !this.isObject(object)  || !this.isString(object.address)
                                    || !this.isPoint(object.addressPoint)
                                    || !this.isArray(object.deliveryAreas) )
        { this.logArg("DeliveryAreasManClass.dataRestore: Missing or bad object!"); return; }
    var i=0;
    for (i=0; i<object.deliveryAreas.length; i++) {
        if (!(object.deliveryAreas[i] instanceof DeliveryAreaClass))
        { this.logArg("DeliveryAreasManClass.dataRestore: Missing or bad objectdeliveryAreas item!"); return; }
    }
    this.address=           object.address;
    this.addressPoint=      object.addressPoint.copy();
    var deliveryAreas=      [];
    for (i=0; i<object.deliveryAreas.length; i++) {
        deliveryAreas.push(object.deliveryAreas[i].copy());
    }
    this.deliveryAreas=    deliveryAreas;
};

// (void) DeliveryAreasManClass.sortDeliveryAreas ()
DeliveryAreasManClass.prototype.sortDeliveryAreas = function () {
    var i,j; var temp;
    for (i=0; i<this.deliveryAreas.length-1; i++) {
        for (j=i+1; j<this.deliveryAreas.length; j++) {
            if (this.deliveryAreas[j].area.circle.radius<this.deliveryAreas[i].area.circle.radius) {
                temp=this.deliveryAreas[i];
                this.deliveryAreas[i]=this.deliveryAreas[j];
                this.deliveryAreas[j]=temp;
                i--;
                break;
            }
        }
    }
};

// (bool) DeliveryAreasManClass.addArea (object) [synchronous]
//          param:    object={    charges:      array of 3 objects {extra: number>=0, minimum: number>=0}
//                                 circle:      {origin:point{x:x,y:y},radius:number} << never null
//                                 polygon:     [point{x:x,y:y},...] || null }
//          return:   true:        item added
//                    false:       param syntax
//                    undefined:   areasEditionBlocking & pending editing
DeliveryAreasManClass.prototype.addArea = function (object) {
    if (!this.isObject(object))
        { this.logArg("DeliveryAreasManClass.addArea: Missing or bad object!"); return; }
    
    if (!this.isArray(object.charges) || object.charges.length!=3)
        { this.logArg("DeliveryAreasManClass.addArea: Missing or bad charges array!"); return; }
    
    for (var i=0; i<object.charges.length; i++) {
        var item=object.charges[i];
        if (!this.isNumber(item.extra) || item.extra<0)
            { this.logArg("DeliveryAreasManClass.addArea: Missing or bad item["+i+"].extra!"); return; }
        if (!this.isNumber(item.minimum) || item.minimum<0)
            { this.logArg("DeliveryAreasManClass.addArea: Missing or bad item["+i+"].minimum!"); return; }
    }
    
    if (!this.isObject(object.circle) || !this.isUnclassedDefinedCircle(object.circle))
        { this.logArg("DeliveryAreasManClass.addArea: Missing or bad object.circle!"); return; }

    if (this.isArray(object.polygon) && !this.isUnclassedDefinedPolygon(object.polygon))
        { this.logArg("DeliveryAreasManClass.addArea: Missing or bad object.polygon!"); return; }
    
    //-SEMAPHORE-IN
    if (!this.editionSemaphore(1)) return false;
    //

    var type=(this.isArray(object.polygon))?1:0;
    
    this.deliveryAreas[this.deliveryAreas.length]=new DeliveryAreaClass(
        ++this.idHistory, {
            charges:    object.charges,
            area:       new AreaClass(type, {
                           circle:    new CircleClass(object.circle.origin,object.circle.radius),
                           polygon:    new PolygonClass(object.polygon)
        })
    });
    
    // reorder deliveryAreas on radius length
    this.sortDeliveryAreas();
    
    //-SEMAPHORE-OUT
    this.editionSemaphore(-1);
    //
    
    return true;
};

// (bool) DeliveryAreasManClass.removeAreaWithId (int>0) [synchronous]
//          param:    value of DeliveryAreasManClass.addArea attributed id (>0)
//          return:   true:        item removed
//                    false:        areasEditionBlocking & pending editing
//                                deliveryAreas.length==0
//                                areasNoAreaDisallowed & deliveryAreas.length==1
//                    undefined:    id<1, non existant id
DeliveryAreasManClass.prototype.removeAreaWithId = function (id) {
    if (!this.isNumber(id) || id<1)
        { this.logArg("DeliveryAreasManClass.removeAreaWithId: Missing or bad id!"); return; }
    
    if (this.deliveryAreas.length===0) return false;

    if (this.areasNoAreaDisallowed && this.deliveryAreas.length===1) return false;

    //-SEMAPHORE-IN
    if (!this.editionSemaphore(1)) return false;
    //

    var newAreas=[]; var done=false;
    for (var i=0; i<this.deliveryAreas.length; i++) {
        if (this.deliveryAreas[i].id!==id) {
            newAreas[newAreas.length]=this.deliveryAreas[i];
        } else {
            done=true;
        }
    }
    if (done===false) { this.logArg("DeliveryAreasManClass.editAreaWithId: Bad id!"); return false; }

    this.deliveryAreas=newAreas;

    //-SEMAPHORE-OUT
    this.editionSemaphore(-1);
    //

    return true;
};

// (Bool | Callback) DeliveryAreasManClass.removeAreaWithIdCallBack (int>0, function callback) [false asynchronous]
DeliveryAreasManClass.prototype.removeAreaWithIdCallBack = function (id,callback) {
    if (!this.isNumber(id) || id<1)
        { this.logArg("DeliveryAreasManClass.removeAreaWithIdAndCallBack: Missing or bad id!"); return; }
    
    var result=this.removeAreaWithId(id);

    var _callback=callback;
    if (this.callbackEditAlwaysGeneral && this.editedGeneralCallback!=null)
        _callback=this.editedGeneralCallback;
    
    if(_callback) {
        _callback((result)?1:0, this.dataExport());
    } else {
        return result;
    }
}

// (bool) DeliveryAreasManClass.editNewArea (callback) [asynchronous]
//          params:    [calback:]    see DeliveryAreasManClass.editAreaWithId for details)
//          return:                                "
//          asyncrhonous return: DeliveryAreasManClass.editAreaWithIdTerminated
DeliveryAreasManClass.prototype.editNewArea = function (callback) {
    if(callback && !this.isFunction(callback))
    { this.logArg("DeliveryAreasManClass.editNewArea: Missing or bad callback!"); return; }
    
    //-SEMAPHORE-IN
    if (!this.editionSemaphore(0)) return false;

    var origin=this.pointZero;
    if (this.addressPoint!=null) {
        origin=this.addressPoint;
    } else if (this.map.locationMarker!=null) {
        origin=newPointFromLatLng(this.map.locationMarker.location);
    }

    var idx=this.deliveryAreas.length;
    
    var radius=this.map.circleBase.radius;
    var da;
    for (var i=this.deliveryAreas.length-1; i>=0; i--) {
        da=this.deliveryAreas[i];
        if (da.area.type===0
            && this.isZero(da.area.circle.origin.diffFromLatLng(this.map.locationMarker.position))) {
            radius=da.area.circle.radius+this.map.circleBase.minimumradius;
            break;
        }
    }
    
    idx=0;
    this.deliveryAreas.unshift(null);
    this.deliveryAreas[idx]=new DeliveryAreaClass(
        ++this.idHistory, {
            charges:    [{extra:0,minimum:0},{extra:0,minimum:0},{extra:0,minimum:0}],
            area:       new AreaClass(0, {
                        circle:     new CircleClass(origin,    radius),
                        polygon:    this.newComputedPolygonAroundPoint(
                                    origin, this.map.polygonBase.edges,
                                    this.map.polygonBase.radius)
                        })
    });

    //-SEMAPHORE-OUT
    if (!this.editionSemaphore(-2)) return false;
    //

    // No reorder while area have to enter in edition

    this.editedAreaIdx=idx;
    this.editedNewAreaIdx=idx;
    this.editedAreaCallback=callback;
    
    this.map.editArea();
    
    return true;
};

// (bool) DeliveryAreasManClass.editAreaWithId (int>0,callback) [asynchronous]
//          params:    int:        value of DeliveryAreasManClass.addArea attributed id (>0)
//                    [callback]:    f(result,object)
//                                result: 0=user cancel, 1=user save
//                                object: {
//                                    location:      (see DeliveryAreaClass.location)
//                                    deliveryarea: (see DeliveryAreaClass.unClassedDeliveryArea) 
//                                }
//          return:    true:        edition started
//                    false:        areasEditionBlocking & pending editing
//                    undefined:    param syntax, non existant id
//          asyncrhonous return: DeliveryAreasManClass.editAreaWithIdTerminated
DeliveryAreasManClass.prototype.editAreaWithId = function (id,callback) {
    if (!this.isNumber(id) || id<1)
        { this.logArg("DeliveryAreasManClass.editAreaWithId: Missing or bad id!"); return; }
    if(callback && !this.isFunction(callback))
        { this.logArg("DeliveryAreasManClass.editAreaWithId: Missing or bad callback!"); return; }
        
    var idx=this.indexOfId(id);
    if (idx===-1)
        { this.logArg("DeliveryAreasManClass.editAreaWithId: Bad id!"); return; }
    
    //-SEMAPHORE-IN-NO-OUT
    if (!this.editionSemaphore(0)) return false;
    //
    
    this.editedAreaIdx=idx;
    this.editedAreaCallback=callback;

    this.map.editArea();
    
    return true;
};

// (void) DeliveryAreasManClass.editAreaWithIdTerminated (int 0||1)
//            see DeliveryAreasManClass.editAreaWithId for description
DeliveryAreasManClass.prototype.editAreaWithIdTerminated = function (result) {
    if (!this.isNumber(result) || (result!==-1 && result!==0 && result!==1))
        { this.logArg("MapManClass.closeEditAreas: Missing or bad type!"); return; }
        
    var callback=this.editedAreaCallback;
    if (this.callbackEditAlwaysGeneral && this.editedGeneralCallback!=null)
        callback=this.editedGeneralCallback;
    
    if (result===1) {
        this.sortDeliveryAreas();

        if (this.callbackAeraFullDataOn) {
            if(callback) callback(result, this.dataExport());
        } else {
            if(callback) callback(result, this.deliveryAreas[this.editedAreaIdx].unClassedDeliveryArea());
        }
        
        //-SEMAPHORE-OUT
        this.editionSemaphore(-2);
        //
        
    } else {
        if (this.editedNewAreaIdx!=null) {
            this.removeAreaWithId(this.deliveryAreas[this.editedNewAreaIdx].id);
        }
        if(callback) callback(result, null);
    }
    this.editedNewAreaIdx=null;
    this.editedAreaIdx=-1;
    this.editedAreaCallback=null;
};

// (void) DeliveryAreasManClass.prototype.editAreasTerminated (int -1|0|1)
DeliveryAreasManClass.prototype.editAreasTerminated = function (result) {
    if (!this.isNumber(result) || (result!==-1 && result!=0 && result!==1))
        { this.logArg("MapManClass.closeEditAreas: Missing or bad type!"); return; }
        
    if (this.editedGeneralCallback!=null) {
        if (result===1) {
            this.sortDeliveryAreas();
            this.editedGeneralCallback(result, this.dataExport());
        } else {
            this.editedGeneralCallback(result, null);
        }
    }
};

// (boolean status) DeliveryAreasManClass.prototype.setEditedAreaPolygon
//                                                              (int 1, polygon points {x:n,y:n} array)
//                                                              (int -1, [code])
DeliveryAreasManClass.prototype.setEditedAreaPolygon = function (status,array) {
    if (!this.isNumber(status))
        { this.logArg("MapManClass.setEditedAreaPolygon: Missing or bad status"); return; }
    if (status>=0) {
        if (!this.isUnclassedDefinedPolygon(array))
            { this.logArg("DeliveryAreasManClass.setEditedAreaPolygon: Missing or bad array!"); return; }
    }
    if (this.editedAreaIdx!=-1) {
        this.map.polygonSetBoundary(status,array)
    } else {
        return false;
    }
}






