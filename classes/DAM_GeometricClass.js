/*****************************************************************************************


    Geometric Classes
    © Asity 2013
 
    version: ß1.00.05
 
*****************************************************************************************/

/*----------------------------------------------------------------------------------------
 Arithmetic (pseudo) Class (Class extend)
 ----------------------------------------------------------------------------------------*/

function ArithmeticClass () {}
ArithmeticClass.prototype = Object.create(Class.prototype);

// (number) ArithmeticClass.round (float, int)
ArithmeticClass.prototype.round = function (val,dec) {
	if (!this.isNumber(val))
		{ logArg("ArithmeticClass.round: Missing or bad val!"); return; }
	if (!this.isNumber(dec) && dec<0)
		{ logArg("ArithmeticClass.round: Missing or bad dec!"); return; }
	
	return (Math.round(val*Math.pow(10,dec))/Math.pow(10,dec));
};




/*----------------------------------------------------------------------------------------
 Geometric (pseudo) Class (Arithmetic extend)
 ----------------------------------------------------------------------------------------*/

function GeometricClass () {}
GeometricClass.prototype = Object.create(ArithmeticClass.prototype);

// (number based on ∏,-∏) GeometricClass.deg2Rad (number based on 180°,-180°)
GeometricClass.prototype.deg2Rad = function (deg) {
    if (!this.isNumber(deg))
        { logArg("GeometricClass.deg2Rad: Missing or bad deg!"); return; }
    return deg*Math.PI/180;
}

// (number based on 2∏) GeometricClass.circDeg2Rad (number based on 360°)
GeometricClass.prototype.circDeg2Rad = function (deg) {
	if (!this.isNumber(deg))
		{ logArg("GeometricClass.circDeg2Rad: Missing or bad deg!"); return; }
	
	return (deg/360)*2*Math.PI;
};

// (number based on 360°) GeometricClass.circRad2Deg (number based on 2∏)
GeometricClass.prototype.circRad2Deg = function (rad) {
	if (!this.isNumber(deg))
	{ logArg("GeometricClass.circRad2Deg: Missing or bad rad!"); return; }	
	
	return (rad/(2*Math.PI))*360;
};




/*----------------------------------------------------------------------------------------
    Point (pseudo) Class (Class extend)
----------------------------------------------------------------------------------------*/

function PointClass (_x, _y) {
    this.defaultGeoNumber=        -999999;
    this.x =                     (this.isNumber(_x)) ? _x : this.defaultGeoNumber;
    this.y =                     (this.isNumber(_y)) ? _y : this.defaultGeoNumber;
    this.pointZero=                {x:0,y:0};
    this.earthRadius=            6371;
    this.logInit =                false;
    if (this.logInit) this.log("PointClass.init: "+this.description());
}
PointClass.prototype = Object.create(GeometricClass.prototype);

// (sring) PointClass.description (void)
PointClass.prototype.description = function() { return this.x+this.VSEP+this.y; };

/* overrides */

// (void) PointClass.log (param)
PointClass.prototype.log = function (param) { if (this.logInit) Class.call(null,param); };


/* (-) Checkers */

// (bool) PointClass.isDefaultPoint ()
PointClass.prototype.isDefaultPoint = function () {
    return (this.x===this.defaultGeoNumber && this.y===this.defaultGeoNumber);
};


/* (+) Checkers */

// (bool) PointClass.isUnclassedDefinedPoint (object{x:number,y:number})
PointClass.prototype.isUnclassedDefinedPoint = function (point) {
    return (this.isObject(point) && this.isNumber(point.x) && this.isNumber(point.y));
};

// (bool) PointClass.isLatLng (GMAP {lat(),lng()})
PointClass.prototype.isLatLng = function(_latLng) {
    return (
            this.isObject(_latLng) &&
            _latLng.lat && this.isFunction(_latLng.lat) && this.isNumber(_latLng.lat()) &&
            _latLng.lng && this.isFunction(_latLng.lng) && this.isNumber(_latLng.lng())
            );
};

// (bool) Class.isLatLngArray ([GMAP {lat(),lng()},...])
PointClass.prototype.isLatLngArray = function(_latLngs) {
    if (!this.isArray(_latLngs)) return false;
    var i;
    for (i=0; i<_latLngs.length; i++) {
        if (!this.isLatLng(_latLngs[i])) return false;
    }
    return true;
};

// (bool) PointClass.isZero = function (PointClass || {x:number,y:number})
PointClass.prototype.isZero = function (point) {
    if (!this.isPoint(point) && !this.isUnclassedDefinedPoint(point))
        { this.logArg("PointClass.isZero: Missing or bad point!"); return; }
    if (point.x===0 && point.y===0) return true;
    return false;
};


/* (-) Setters */

// (void) PointClass.changeToXY ({x:number,y:number})
PointClass.prototype.changeToXY = function (dot) {
    if (!this.isUnclassedDefinedPoint(dot))
    { this.logArg("PointClass.changeToXY: Missing or bad XY dot!"); return; }
    this.x=dot.x; this.y=dot.y;
    if (this.logAction) this.log("PointClass.changeToXY: "+this.description());
};

// (void) PointClass.changeToLatLng (GMAP latLng)
PointClass.prototype.changeToLatLng = function (latLng) {
    if (!this.isLatLng(latLng))
    { this.logArg("PointClass.changeToLatLng: Missing or bad latLng"); return; }
    this.changeToXY(this.xyFromLatLng(latLng));
};

// (void) PointClass.moveOfXY ({x:number,y:number})
//          * ATTENTION * offset is expected to be calculated P2(destination)-P1(origine)
PointClass.prototype.moveOfXY = function (dot) {
    if (!this.isUnclassedDefinedPoint(dot))
    { this.logArg("PointClass.moveOfXY: Missing or bad XY dot!"); return; }
    this.x+=dot.x; this.y+=dot.y;
    //if (this.logAction) this.log("PointClass.moveOfXY: "+this.description());
};

// (void) PointClass.moveOfLatLng (GMAP latLng)
PointClass.prototype.moveOfLatLng = function (latLng) {
    if (!this.isLatLng(latLng))
    { this.logArg("PointClass.moveOfLatLng: Missing or bad latLng"); return; }
    this.moveOfXY(this.xyFromLatLng(latLng));
};


/* (-) Getters */

// (UnClassedPoint object) PointClass.unclassedDefinedPoint ()
PointClass.prototype.unClassedDefinedPoint = function () {
    return {x:this.x,y:this.y};
};

// (LatLng Point) PointClass.LatLng (void)
PointClass.prototype.LatLng = function () {
    return new google.maps.LatLng(this.y,this.x);
};

// (PointClass point) PointClass.copy (void)
PointClass.prototype.copy = function () {
    return new PointClass(this.x,this.y);
};

// ({x:number,y:number}) PointClass.diffFromXY ({x:number,y:number})
PointClass.prototype.diffFromXY = function (dot) {
    if (!this.isUnclassedDefinedPoint(dot))
        { this.logArg("PointClass.diffFromXY: Missing or bad XY dot!"); return; }
    return {x:dot.x-this.x,y:dot.y-this.y};
};

// ({x:number,y:number}) PointClass.diffFromLatLng (GMAP latLng)
PointClass.prototype.diffFromLatLng = function (latLng) {
    if (!this.isLatLng(latLng))
        { this.logArg("PointClass.diffFromLatLng: Missing or bad latLng"); return; }
    var dot=this.xyFromLatLng(latLng);
    return this.diffFromXY(dot);
};

// (number) PointClass.bearingWithLatLng (GMAP latLng)
PointClass.prototype.bearingWithLatLng = function (latLng) {
    if (!this.isLatLng(latLng))
        { this.logArg("PointClass.bearingWithLatLng: Missing or bad latLng"); return; }
    return google.maps.geometry.spherical.computeHeading(this.LatLng(),latLng);
};

// (LatLng Point) PointClass.projectWithBearing (number, number)
PointClass.prototype.projectWithBearing = function  (distance, bearing) {
    if (!this.isNumber(distance) || !this.isNumber(bearing))
        { this.logARg("PointClass.projectWithBearing: Missing or bad distance or bearing"); return; }
    return new google.maps.geometry.spherical.computeOffset (
                                                this.LatLng(), distance, bearing);
};

//------------------------- LOCAL TRIGONOMETRIC CALCULATION ------------------------------

// (number) PointClass.absBearing ()
PointClass.prototype.absBearing = function () {
	return Math.atan(this.deg2Rad(y)/this.deg2Rad(x));
};

// (number) PointClass.relBearing (PointClass point)
PointClass.prototype.relBearing = function (dot) {
	if (!this.isPoint(dot))
		{ this.logArg("PointClass.relBearing: Missing or bad dot"); return; }
	return Math.atan(
                     (this.deg2Rad(dot.y)-this.deg2Rad(this.y))
                     /(this.deg2Rad(dot.x)-this.deg2Rad(this.x))
                     );
};

// (number based on 2∏) PointClass.circAbsBearing ()
PointClass.prototype.circAbsBearing = function () {
	var aTgt=Math.atan(this.deg2Rad(this.y)/this.deg2Rad(this.x));
	if (this.x<0 && this.y<0) { return Math.PI+Math.abs(aTgt); }
	else if (this.x<0) { return Math.PI-Math.abs(aTgt); }
	else if (this.y<0) { return (Math.PI*2)-Math.abs(aTgt); }
	return Math.abs(aTgt);
};

// (number) PointClass.circRelBearing (PointClass point)
PointClass.prototype.circRelBearing = function (dot) {
	if (!this.isPoint(dot))
		{ this.logArg("PointClass.circRelBearing: Missing or bad dot"); return; }
	var newPoint=new PointClass(dot.x-this.x,dot.y-this.y);
	return newPoint.circAbsBearing();
};

// (number in meters) PointClass.absDistance (PointClass point)
// Calculate distance from 0,0 but based on lat of this to evaluate spherical earth radius.
PointClass.prototype.absDistance = function () {
    var lng=this.deg2Rad(this.x)*Math.cos(this.deg2Rad(this.x));
    var lat=this.deg2Rad(this.x);
	return Math.sqrt(Math.pow(lng,2)+Math.pow(lat,2))*this.earthRadius;
};

// (number) PointClass.relDistance (PointClass point)
PointClass.prototype.relDistance = function (dot) {
	if (!this.isPoint(dot))
		{ this.logArg("PointClass.relBearing: Missing or bad dot"); return; }
    
//log("relDistance: "+(dot.x-this.x)+" - "+(dot.y-this.y));
    
    var lng=this.deg2Rad(dot.x-this.x)*Math.cos(this.deg2Rad((dot.x-this.x)/2));
    var lat=this.deg2Rad(dot.y-this.y);
	return Math.sqrt(Math.pow(lng,2)+Math.pow(lat,2))*this.earthRadius;

};

//----------------------------------------------------------------------------------------


/* (+) Tools */

// ({x:number,y:number}) PointClass.xyFromLatLng (GMAP latLng)
PointClass.prototype.xyFromLatLng = function (latLng) {
    if (!this.isLatLng(latLng))
        { this.logArg("PointClass.xyFromLatLng: Missing or bad latLng"); return; }
    return {x:latLng.lng(),y:latLng.lat()};
};

// (object) PointClass.newPointFromLatLng (GMAP latLng)
PointClass.prototype.newPointFromLatLng = function (latLng) {
    if (!this.isLatLng(latLng))
        { this.logArg("PointClass.newPointFromLatLng: Missing or bad latLng"); return; }
    return new PointClass(latLng.lng(),latLng.lat());
};

// (number) PointClass.sphericalDistanceBetween (GMAP latLng, GMAP latLng)
PointClass.prototype.sphericalDistanceBetween = function (latLng1, latLng2) {
if (!this.isLatLng(latLng1) || !this.isLatLng(latLng1))
    { this.logArg("PointClass.sphericalDistanceBetween: Missing or bad latLng1 or 2"); return; }
    
    return google.maps.geometry.spherical.computeDistanceBetween (latLng1,latLng2);
};

// (number) PointClass.convertDistanceInKm (number)
PointClass.prototype.convertDistanceInKm = function (distance) {
    if (!this.isNumber(distance))
        { this.logArg("PointClass.convertDistanceInKm: Missing or bad distance"); return; }

    return Math.round(distance/1000*10)/10;
};

// (number) PointClass.trajectoryWise (Array of 3 PoinClass points)
PointClass.prototype.trajectoryWise = function (points) {
	if (!this.isArray(points) || points.length!=3)
        { this.logArg("PointClass.trajectoryWise: Missing or bad points"); return; }
    for (var i=0; i<points.length; i++) {
        if (!this.isPoint(points[i]))
            { this.logArg("PointClass.trajectoryWise: Missing or bad point in points ("+i+")"); return; }
    }
    //# -1=>p1-p0-p2  0=>p0-p2-p1  1=>p0-p1-p2
	var dx1 = points[1].x - points[0].x; var dy1 = points[1].y - points[0].y;
	var dx2 = points[2].x - points[0].x; var dy2 = points[2].y - points[0].y;
	if (dx1*dy2 > dy1*dx2) return +1;
	if (dx1*dy2 < dy1*dx2) return -1;
	if ((dx1*dx2 < 0) || (dy1*dy2 < 0)) return -1;
	if ((dx1*dx1 + dy1*dy1) >= (dx2*dx2 + dy2*dy2)) return 0;
	return 1;
}
    

/*----------------------------------------------------------------------------------------
    Circle (pseudo) Class (PointClass extend, composite PointClass)
----------------------------------------------------------------------------------------*/

// (object) CircleClass (PointClass || {x:number,y:number}, number)
function CircleClass (_point, _radius) {
    if (!this.isPoint(_point) && !this.isUnclassedDefinedPoint(_point)) {
        this.origin=        new PointClass();
    } else if (this.isPoint(_point)) {
        this.origin=         _point;
    } else if (this.isUnclassedDefinedPoint(_point)) {
        this.origin=        new PointClass(_point.x,_point.y);
    } else {
        this.logArg("CircleClass: Missing or bad point (bug)"); return;
    }
    this.radius=            (this.isNumber(_radius)) ? _radius : this.defaultGeoNumber;
    
    this.circleZero=        {origin:{x:0,y:0},radius:0};
    if (this.logInit) this.log("CircleClass.init: "+this.description());
}
CircleClass.prototype = Object.create(PointClass.prototype);

// (sring) CircleClass.description (void)
CircleClass.prototype.description = function() {
    return this.origin.description()+this.MSEP+this.radius;
};


/* (-) Checkers */

// (bool) CircleClass.isDefaultCircle ()
CircleClass.prototype.isDefaultCircle = function () {
    return (this.origin.isDefaultPoint() && this.radius===this.defaultGeoNumber);
};


/* (+) Checkers */

// (bool) CircleClass.isUnclassedDefinedCircle (object)
//            check for: {origin:{x:number,y:number},radius:number}
CircleClass.prototype.isUnclassedDefinedCircle = function (circle) {
    return (this.isObject(circle) && this.isUnclassedDefinedPoint(circle.origin)
            && this.isNumber(circle.radius) && circle.radius>0);
};


/* (-) Setters */

// (void) CircleClass.changeToXY ({x:number,y:number})
CircleClass.prototype.changeToXY = function (dot) {
    if (!this.isUnclassedDefinedPoint(dot))
    { this.logArg("CircleClass.changeToXY: Missing or bad XY dot!"); return; }
    
    this.origin.changeToXY(dot);
    if (this.logAction) this.log("CircleClass.changeToXY: "+this.description());
};
// (void) CircleClass.changeToLatLng (GMAP latLng)
CircleClass.prototype.changeToLatLng = function (latLng) {
    if (!this.isLatLng(latLng))
    { this.logArg("CircleClass.changeToLatLng: Missing or bad latLng"); return; }
    
    this.origin.changeToLatLng(latLng);
};

// (void) CircleClass.moveOfXY ({x:number,y:number})
CircleClass.prototype.moveOfXY = function (dot) {
    if (!this.isUnclassedDefinedPoint(dot))
    { this.logArg("CircleClass.moveOfXY: Missing or bad XY dot!"); return; }
    
    this.origin.moveOfXY(dot);
    if (this.logAction) this.log("CircleClass.moveOfXY: "+this.description());
};
// (void) CircleClass.moveOfLatLng (GMAP latLng)
CircleClass.prototype.moveOfLatLng = function (latLng) {
    if (!this.isLatLng(latLng))
    { this.logArg("CircleClass.moveOfLatLng: Missing or bad latLng"); return; }
    
    this.origin.moveToLatLng(latLng);
};


/* (-) Getters */

// (CircleClass circle) CircleClass.copy (void)
CircleClass.prototype.copy = function () {
    return new CircleClass(this.origin.copy(),this.radius);
};

// (UnClassedCircle) CircleClass.unClassedDefinedCircle ()
CircleClass.prototype.unClassedDefinedCircle = function () {
    return {    origin:    this.origin.unClassedDefinedPoint(),
                radius: this.radius };
};

// (number) CircleClass.radiusInKm ()
CircleClass.prototype.radiusInKm = function () {
    return this.convertDistanceInKm(this.radius);
};

// (number) CircleClass.longestDistanceFromLatLngPoint ()
CircleClass.prototype.longestDistanceFromLatLngPoint = function (latLng) {
    if (!this.isLatLng(latLng))
    { this.logArg("CircleClass.longestDistanceFromLatLngPoint: Missing or bad latLng"); return; }
    return this.radius+this.sphericalDistanceBetween(this.origin.LatLng(),latLng);
};

// (number) CircleClass.computeRadiusWithLngPoint (GMAP latLng)
CircleClass.prototype.computeRadiusWithLatLngPoint = function (latLng) {
    if (!this.isLatLng(latLng))
    { this.logArg("CircleClass.computeRadiusWithLngPoint: Missing or bad latLng"); return; }
    
    return this.sphericalDistanceBetween(this.origin.LatLng(), latLng);
};


/* (+) Tools */




/*----------------------------------------------------------------------------------------
    Polygon (pseudo) Class (CircleClass extend, composite [PointClass])
----------------------------------------------------------------------------------------*/

// (object) PolygonClass ([PointClass || {x:number,y:number},...])
function PolygonClass (_points) {
    if (!this.isArray(_points) || _points.length<3) {
        _points=[new PointClass(),new PointClass(),new PointClass()];
    } else {
        for (var i=0; i<_points.length; i++) {
            if (!this.isPoint(_points[i]) && !this.isUnclassedDefinedPoint(_points[i])) {
                _points[i]=new PointClass();
            } else if (this.isUnclassedDefinedPoint(_points[i])) {
                _points[i]=new PointClass(_points[i].x,_points[i].y);
            }
        }
    }
    this.points=_points;
    if (this.logInit) this.log("PolygonClass.init: "+this.description());
}
PolygonClass.prototype = Object.create(CircleClass.prototype);

// (sring) PolygonClass.description (void)
PolygonClass.prototype.description = function() {
    if (this.points.length===0) return "void";
    var result="";
    for(var i=0; i<this.points.length; i++) {
        result+=this.points[i].description();
        if (i<this.points.length-1) { result+=this.MSEP+'\n'; }
    }
    return result;
};


/* (-) Checkers */

// (bool) PolygonClass.isDefaultPolygon ()
PolygonClass.prototype.isDefaultPolygon = function () {
    for (var i=0; i<this.points.length; i++) {
        if (!this.points[i].isDefaultPoint()) return false;
    }
    return true;
};

// (bool) PolygonClass.isUnclassedDefinedPolygon (array)
//            check for: array[{x:number,y:number},...]
PolygonClass.prototype.isUnclassedDefinedPolygon = function (array) {
    if (!this.isArray(array) || array.length<3) return false;
    var i; for (i=0;i<array.length;i++) {
        if (!this.isUnclassedDefinedPoint(array[i])) return false;
    }
    return true;
};


/* (-) Setters */

// (void) PolygonClass.selfBearing ()
PolygonClass.prototype.selfBearing = function () {
    var pg=this.points;
    var minYidx=0;
    var minYvalXval=pg[0].x;
    var i; for (i=0; i<pg.length; i++) {
        if (pg[i].y<pg[minYidx].y || (pg[i].y==pg[minYidx].y && pg[i].x<pg[minYidx].x)) {
            minYidx=i
            minYvalXval=pg[i].x
        }
    }
    var array=new Array();
    for (i=minYidx; i<pg.length; i++) {
        array.push(pg[i]);
    }
    for (i=0; i<minYidx; i++) {
        array.push(pg[i]);
    }
    this.points=array;
}

// (void) PolygonClass.selfWise (int)
PolygonClass.prototype.selfWise = function (wise) {
    if (!this.isNumber(wise) || (wise!=-1 && wise!=1))
        { this.logArg("PolygonClass.addPoint: Missing or bad wise!"); return; }
//log(this.rotationWise());
    if (this.rotationWise()!=wise) {
//log("return");
        var array=new Array();
        var pg=this.points;
        for (var i=pg.length-1; i>=0; i--) {
            array.push(pg[i]);
        }
        this.points=array;
    }
}

// (void) PolygonClass.addPoint (PointClass)
PolygonClass.prototype.addPoint = function (point) {
    if (!this.isPoint(point))
        { this.logArg("PolygonClass.addPoint: Missing or bad PointClass point!"); return; }
    this.points.push(point);
};

// (void) PolygonClass.insertPointAtIndex (PointClass,idx)
PolygonClass.prototype.insertPointAtIndex = function (point,idx) {
    if (!this.isPoint(point))
        { this.logArg("PolygonClass.insertPointAtIndex: Missing or bad PointClass point!"); return; }
    if (!this.isNumber(idx) || idx<0 || idx>this.points.length-1)
        { this.logArg("PolygonClass.insertPointAtIndex: Missing or bad idx!"); return; }
    this.points.splice(idx,0,point);
};

// (void) PolygonClass.changePointAtIndex (int, PointClass)
PolygonClass.prototype.changePointAtIndex = function (idx, point) {
    if (!this.isNumber(idx) || idx<0 || idx>this.points.length-1)
        { this.logArg("PolygonClass.changePointAtIndex: Missing or bad idx!"); return; }
    if (!this.isPoint(point))
        { this.logArg("PolygonClass.changePointAtIndex: Missing or bad PointClass point!"); return; }
    
    this.points[idx]=point;
};

// (void) PolygonClass.removePointAtIndex (int)
PolygonClass.prototype.removePointAtIndex = function (idx) {
    if (!this.isNumber(idx) || idx<0 || idx>this.points.length-1)
        { this.logArg("PolygonClass.removePointAtIndex: Missing or bad idx!"); return; }
    
    this.points.splice(idx,1);
};

// (void) PolygonClass.changeToXYs ([{x:x,y:y},...])
PolygonClass.prototype.changeToXYs = function (dots) {
    if (!this.isUnclassedDefinedPolygon(dots))
        { this.logArg("PolygonClass.changeToXYs: Missing or bad XY dots!"); return; }
    if (dots.length<3)
        { this.logArg("PolygonClass.changeToXYs: bad XY dots amount!"); return; }
    var i;
    var _points=[];
    for (i=0; i<dots.length; i++) {
        if (!this.isUnclassedDefinedPoint(dots[i]))
        { this.logArg("PolygonClass.changeToXYs: bad XY dot in array!"); return; }
        _points[i]=new PointClass(dots[i].x,dots[i].y);
    }
    this.points=_points;
    if (this.logAction) this.log("PolygonClass.changeToXYs: "+this.description());
};

// (void) PolygonClass.changeToLatLngs ([GMAP latLng,...])
PolygonClass.prototype.changeToLatLngs = function (dots) {
    if (!this.isLatLngArray(dots))
        { this.logArg("PolygonClass.changeToLatLngs: Missing or bad latLng array!"); return; }
    var i;
    for (i=0; i<dots.length; i++) {
        dots[i]=this.xyFromLatLng(dots[i]);
    }
    this.changeToXYs(dots);
};

// (void) PolygonClass.moveOfXY ({x:number,y:number})
PolygonClass.prototype.moveOfXY = function (dot) {
    if (!this.isUnclassedDefinedPoint(dot))
        { this.logArg("PolygonClass.moveOfXY: Missing or bad XY dot!"); return; }
    var i;
    for (i=0; i<this.points.length; i++) {
        this.points[i].moveOfXY(dot);
    }
    if (this.logAction) this.log("PolygonClass.moveOfXY: "+this.description());
};

// (void) PolygonClass.moveOfLatLng (GMAP latLng)
PolygonClass.prototype.moveOfLatLng = function (latLng) {
    if (!this.isLatLng(latLng))
        { this.logArg("PolygonClass.moveOfLatLng: Missing or bad latLng!"); return; }
    this.moveOfXY(this.xyFromLatLng(latLng));
};


/* (-) Getters */

// (PolygonClass polygon) PolygonClass.copy (void)
PolygonClass.prototype.copy = function () {
    var _points=[];
    for (var i=0; i<this.points.length; i++) {
        _points.push(this.points[i].copy());
    }
    return new PolygonClass(_points);
};

// (Array of UnClassedDefinedPoints) PolygonClass.unclassedDefinedPolygon ()
PolygonClass.prototype.unclassedDefinedPolygon = function () {
    var result=[];
    var i; for (i=0; i<this.points.length; i++) {
        result[result.length]=this.points[i].unClassedDefinedPoint();
    }
    return result;
};

// (CircleClass) PolygonClass.exoCircle (void)
PolygonClass.prototype.exoCircle = function () {
    var sumX=0; var sumY=0; var nbrPoints=this.points.length;
    for (var i=0; i<nbrPoints; i++) { sumX+=this.points[i].x; sumY+=this.points[i].y; }
    var avgX=sumX/nbrPoints; var avgY=sumY/nbrPoints;
    var origin=new PointClass(avgX,avgY);
    var farestPoint=this.farestPointFromPoint(origin);
    var radius=this.sphericalDistanceBetween(this.points[farestPoint].LatLng(),origin.LatLng());
    return new CircleClass(origin,radius);
};

// (number) PolygonClass.rotationWise ()
PolygonClass.prototype.rotationWise = function () {
    var circle=this.exoCircle();
    var res=0;
    var prevBearing=circle.origin.circRelBearing(this.points[0]);
    var curBearing;
    for (var i=1; i<=this.points.length; i++) {
        idx=(i<this.points.length)?i:0;
        curBearing=circle.origin.circRelBearing(this.points[idx]);
        res+=((curBearing-prevBearing)>=0)?1:-1;
        prevBearing=curBearing;
        //log(idx+":"+curBearing-prevBearing);
    }
    if (res>0) { return -1; }
    else if (res<0) { return 1; }
    else return 0;
}


// (number) PolygonClass.farestPointFromPoint (PointClass)
PolygonClass.prototype.farestPointFromPoint = function (point) {
    if (!this.isPoint(point))
    { this.logArg("PolygonClass.farestPointFromPoint: Missing or bad point"); return; }
    
    var farestVal=0; var farestIdx=-1; var val=0;
    for (var i=0; i<this.points.length; i++) {
        val=Math.abs(this.points[i].x-point.x)+Math.abs(this.points[i].y-point.y);
        if (val>farestVal) {
            farestVal=val;
            farestIdx=i;
        }
    }
    return farestIdx;
};

// (number) PolygonClass.farestPointFromLatLngPoint (latLng)
PolygonClass.prototype.farestPointFromLatLngPoint = function (latLng) {
    if (!this.isLatLng(latLng))
    { this.logArg("PolygonClass.farestPointFromLatLngPoint: Missing or bad latLng"); return; }
    
    return this.farestPointFromPoint(this.newPointFromLatLng(latLng));
};

// (number) PolygonClass.longestDistanceFromLatLngPoint (latLng)
PolygonClass.prototype.longestDistanceFromLatLngPoint = function (latLng) {
    if (!this.isLatLng(latLng))
    { this.logArg("PolygonClass.longestDistanceFromLatLngPoint: Missing or bad latLng"); return; }
    
    return this.sphericalDistanceBetween(
					 this.points[this.farestPointFromLatLngPoint(latLng)].LatLng(),
					 latLng
					 );
};

// ([idx,idx]) PolygonClass.framingSerialByDistancesAndArrow (PointClass point)
PolygonClass.prototype.framingSerialByDistancesAndArrow = function (dot,min) {
	if (!this.isPoint(dot))
		{ this.logArg("PolygonClass.framingSerialByDistancesAndArrow: Missing or bad dot"); return; }
	if (!this.isNumber(min))
		{ this.logArg("PolygonClass.framingSerialByDistancesAndArrow: Missing or bad min"); return; }
		
//log("fsbdar: "+dot.description());
	var i=0; var j=0; var pI=null; var pJ=null;
	var hIJ=0; var hId=0; var hJd=0;	// hypotenuses
	var bIJ=0; var bId=0; 				// bearing
	var sI=0; var sMin=min;				// sinus
	for (i=0; i<this.points.length; i++) {
		j++; if (j==this.points.length) j=0;
		pI=this.points[i]; pJ=this.points[j];
//log("fsbdar: "+i+"--"+j+": "+pI.description()+"/"+pJ.description());
		hIJ=pI.relDistance(pJ); hId=pI.relDistance(dot); hJd=pJ.relDistance(dot);
//log("fsbdar: "+i+": "+this.round(hIJ,2)+" / "+this.round(hId,2)+" / "+this.round(hJd,2));
		if (hId<hIJ && hJd<hIJ) {

//log ("fsbdar: "+">>>"+i+"/"+j);
			bIJ=pI.relBearing(pJ); bId=pI.relBearing(dot);
//log ("fsbdar: "+bIJ+" / "+bId);
			sI=Math.abs(Math.sin(bIJ-bId)*hId);
//log ("fsbdar: "+"dist: "+sI+"     "+sMin);
			if (sI<=sMin) {
				return [i,j];
			}
		}
		
	}
	return [];
};


/* (+) Tools */

// (Array of PointClass) PolygonClass.newComputedPolygonAroundPoint (PointClass,int>=3,int>0 in meters)
PolygonClass.prototype.newComputedPolygonAroundPoint = function (point,edges,radius) {
    if (!this.isPoint(point))
        { this.logArg("PolygonClass.generateFromPoint: Missing or bad point!"); return; }
    if (!this.isNumber(edges) || edges<3)
        { this.logArg("PolygonClass.generateFromPoint: Missing or bad edges!"); return; }
    if (!this.isNumber(radius) || radius<=0)
        { this.logArg("PolygonClass.generateFromPoint: Missing or bad radius!"); return; }
    
    var origin=point.LatLng();
    var _points=[]; var _projLatLng; var cpt=0; var i;
    for (i=0; i<=(360/edges*(edges-1)); i+=(360/edges)) {
        _projLatLng=new google.maps.geometry.spherical.computeOffset(origin,radius,i);
        _points[cpt]=this.newPointFromLatLng(_projLatLng);
        cpt++;
    }
    return new PolygonClass(_points);
};



/*----------------------------------------------------------------------------------------
    Area (pseudo) Class (PolygonClass extend, composite CircleClass, PolygonClass)
----------------------------------------------------------------------------------------*/

// (object) AreaClass (number, object{circle:CircleClass,polygon:PolygonClass})
function AreaClass (_type, _args) {
    this.type = (this.isNumber(_type)) ? _type : -1;
    if (!this.isObject(_args)) _args={type:-1, circle:new CircleClass(), polygon:new PolygonClass()};
    this.circle =   (this.isCircle(_args.circle))   ? _args.circle  : new CircleClass();
    this.polygon =  (this.isPolygon(_args.polygon)) ? _args.polygon : new PolygonClass();
    
    if (this.type===1) this.circle=this.polygon.exoCircle();
    
    if (this.logInit) this.log("AreaClass.init: "+this.description());
}
AreaClass.prototype = Object.create(PolygonClass.prototype);

// (sring) AreaClass.description (void)
AreaClass.prototype.description = function() {
    return this.type+this.ISEP+this.circle.description()+this.ISEP+this.polygon.description();
};


/* (-) Getters */

// (CircleClass or PolygonClass object) AreaClass.shape (void)
AreaClass.prototype.shape = function () {
    if (this.type===0) {
        return this.circle;
    } else {
        return this.polygon;
    }
};

AreaClass.prototype.copy = function () {
    return new AreaClass(this.type,{circle:this.circle.copy(),polygon:this.polygon.copy()});
};


/* (-) Setters */

// (void) AreaClass.changeType (int 0||1, int >=3)
AreaClass.prototype.changeType = function (type,edges) {
    if (!this.isNumber(type) || (type!==0 && type!==1))
        { this.logArg("AreaClass.changeType: Missing or bad type!"); return; }
    if (type===1 && edges) {
        if (!this.isNumber(edges) || edges<3)
            { this.logArg("AreaClass.changeType: Missing or bad egdes!"); return; }
    }
    
    if (this.type===type) return;
    this.type=type;
    if (type===0) {
        this.circle=this.polygon.exoCircle();
    } else {
        this.polygon=this.newComputedPolygonAroundPoint(
                                                        this.circle.origin,
                                                        edges,
                                                        this.circle.radius
                                                        );
    }
};

// (void) AreaClass.addPolygonPoint (PointClass point)
AreaClass.prototype.addPolygonPoint = function (point) {
    if (!this.isPoint(point))
        { this.logArg("AreaClass.addPolygonPoint: Missing or bad PointClass point!"); return; }
    this.polygon.addPoint(point);
    this.circle=this.polygon.exoCircle();
};

// (void) AreaClass.insertPolygonPointAtIndex (PointClass point,idx)
AreaClass.prototype.insertPolygonPointAtIndex = function (point,idx) {
    if (!this.isPoint(point))
        { this.logArg("AreaClass.insertPolygonPointAtIndex: Missing or bad PointClass point!"); return; }
    if (!this.isNumber(idx) || idx<0 || idx>this.polygon.points.length-1)
        { this.logArg("AreaClass.insertPolygonPointAtIndex: Missing or bad idx!"); return; }
    this.polygon.insertPointAtIndex(point,idx);
    this.circle=this.polygon.exoCircle();
};

// (void) AreaClass.changePolygonPointAtIndex (int,PointClass point)
AreaClass.prototype.changePolygonPointAtIndex = function (idx,point) {
    if (!this.isNumber(idx) || idx<0 || idx>this.polygon.points.length-1)
        { this.logArg("AreaClass.changePolygonPointAtIndex: Missing or bad idx!"); return; }
    if (!this.isPoint(point))
        { this.logArg("AreaClass.changePolygonPointAtIndex: Missing or bad PointClass point!"); return; }
    this.polygon.changePointAtIndex(idx,point);
    this.circle=this.polygon.exoCircle();
};

// (void) AreaClass.removePolygonPointAtIndex (int)
AreaClass.prototype.removePolygonPointAtIndex = function (idx) {
    if (!this.isNumber(idx) || idx<0 || idx>this.polygon.points.length-1)
        { this.logArg("AreaClass.removePolygonPointAtIndex: Missing or bad idx!"); return; }
    this.polygon.removePointAtIndex(idx);
    this.circle=this.polygon.exoCircle();
};

// (void) AreaClass.computePolygon (int 0||1, int >=3)
AreaClass.prototype.computePolygon = function (radius,edges) {
    if (!radius) radius=this.circle.radius;
    if (!this.isNumber(radius) || radius<=0)
        { this.logArg("AreaClass.computePolygon: Missing or bad radius!"); return; }
    if (!edges) edges=this.polygon.points.length;
    if (!this.isNumber(edges) || edges<3)
        { this.logArg("AreaClass.computePolygon: Missing or bad egdes!"); return; }

    this.circle=this.polygon.exoCircle();
    this.polygon=this.newComputedPolygonAroundPoint(
                                                    this.circle.origin,
                                                    edges,
                                                    radius
                                                    );
    this.circle=this.polygon.exoCircle();
};

// (void) AreaClass.changeToXY ({x:number,y:number} || [{x:number,y:number},...])
AreaClass.prototype.changeToXY = function (data) {
    if (!this.isUnclassedDefinedPoint(data) && !this.isUnclassedDefinedPolygon(data))
        { this.logArg("AreaClass.changeToXY: Missing or bad XY(s) data!"); return; }
    if (this.type===0) {
        if (!this.isUnclassedDefinedPoint(data))
            { this.logArg("AreaClass.changeToXY: bad XY data!"); return; }
        this.circle.changeToXY(data);
    } else {
        if (!this.isUnclassedDefinedPolygon(data))
            { this.logArg("AreaClass.changeToXY: bad XYs data!"); return; }
        this.polygon.changeToXYs(data);
        this.circle=this.polygon.exoCircle();
    }
    if (this.logAction) this.log("AreaClass.changeToXY: "+this.description());
};

// (void) AreaClass.changeToLatLng (GMAP latLng || [GMAP latLng,...])
AreaClass.prototype.changeToLatLng = function (data) {
    if (!this.isLatLng(data) && !this.isLatLngArray(data))
        { this.logArg("AreaClass.changeToLatLng: Missing or bad latLng(s) data!"); return; }
    if (this.type===0) {
        if (!this.isLatLng(data))
        { this.logArg("AreaClass.changeToLatLng: bad latLng data!"); return; }
        this.circle.changeToLatLng(data);
    } else {
        if (!this.isLatLngArray(data))
        { this.logArg("AreaClass.changeToXY: bad latLngs data!"); return; }
        this.polygon.changeToLatLngs(data);
        this.circle=this.polygon.exoCircle();
    }
};

// (void) AreaClass.moveOfXY ({x:number,y:number})
AreaClass.prototype.moveOfXY = function (dot) {
    if (!this.isUnclassedDefinedPoint(dot))
        { this.logArg("AreaClass.moveOfXY: Missing or bad XY dot!"); return; }
    if (this.type===0) {
        this.circle.moveOfXY(dot);
    } else {
        this.polygon.moveOfXY(dot);
        this.circle=this.polygon.exoCircle();
    }
    if (this.logAction) this.log("AreaClass.moveOfXY: "+this.description());
};

// (void) AreaClass.moveOfLatLng (GMAP latLng)
AreaClass.prototype.moveOfLatLng = function (latLng) {
    if (!this.isLatLng(latLng))
        { this.logArg("AreaClass.moveOfXY: Missing or bad latLng!"); return; }
    if (this.type===0) {
        this.circle.moveOfLatLng(latLng);
    } else {
        this.polygon.moveOfLatLng(latLng);
        this.circle=this.polygon.exoCircle();
    }
};


