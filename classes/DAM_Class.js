/*****************************************************************************************
 
 
    Delivery Areas Manager
    © Asity 2013
 
    version: ß1.00.05
 
*****************************************************************************************/

// Defines
function log (param) {
    console.log(param);
}
function logm (mark,param) {
    console.log(mark);
    console.log(param);
}

/**
    Class (pseudo) Class
**/

function Class() {}
Class.prototype = {
    // Constants
    logInit: true,
    logAction: true,
    VSEP: ",", MSEP: ":", ISEP: "|",
    error: 'error',
       
    /** log methods (in order to silent a deployment state**/
    // (void) Class.log (object)
    log: function(param) { if (param) console.log(arguments.callee.caller.name+" + "+param); },
    // (void) Class.logArg (object)
    logArg: function(param) { if (param) console.log(arguments.callee.caller.name+" + arg: "+param); },

    
    /* (+) Type Checkers */
    
    // (bool) Class.is[Type] (object)
    isBoolean: function(_bool) { return this.isType('[object Boolean]',_bool); },
    isNumber: function(_number) { return this.isType('[object Number]',_number); },
    isString: function(_string) { return this.isType('[object String]',_string); },
    isArray: function(_array) { return this.isType('[object Array]',_array); },
    isObject: function(_object) { return this.isType('[object Object]',_object); },
    isFunction: function(_function) { return this.isType('[object Function]',_function); },
    isDefined: function (_stuff) { return (typeof _stuff !== 'undefined'); },
    // (bool) Class.isType (const string, object)
    isType: function (_type, _item) { 
        return (typeof _item !== 'undefined' && Object.prototype.toString.call(_item)===_type); },
    
    
    /* (+) Class checkers */
    
    // (bool) Class.is[Type] (object)
    isPoint: function(_point) {
        return (_point instanceof PointClass && this.isNotCircle(_point) && this.isNotPolygon(_point));
    },
    isCircle: function(_circle) {
        return (_circle instanceof CircleClass && this.isNotPolygon(_circle));
    },
    isPolygon: function(_polygon) { return _polygon instanceof PolygonClass; },
    isArea: function(_area) { return _area instanceof AreaClass; },
    isHtml: function(_html) { return _html instanceof HtmlClass; },

    isNotPoint: function(_object) { return !(_object instanceof PointClass); },
    isNotCircle: function(_object) { return !(_object instanceof CircleClass); },
    isNotPolygon: function(_object) { return !(_object instanceof PolygonClass); },
    
    
    /* (+) Tools */
    
    // (number) Class.decimal (number)
    decimal: function(_number) {
        if (!this.isNumber(_number))
            { this.logArg("Class.decimal: Missing or bad number"); return; }
        _number=(_number+"").split(".");
        if (_number.length===1) return 0;
        return ("0."+_number[1])*1;
    },
    
    // (number) Class.entDecimal (number)
    entDecimal: function(_number) {
        if (!this.isNumber(_number))
            { this.logArg("Class.decimal: Missing or bad number"); return; }
        _number=(_number+"").split(".");
        if (_number.length===1) return 0;
        return (_number[1])*1;
    }
};


