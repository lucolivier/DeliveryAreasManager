/*****************************************************************************************


    Html (pseudo) Class (Class extend)
    © Asity 2013
 
    version: ß1.00.05
 
*****************************************************************************************/
/*
    Notice: SELECT widget is not integrated even though model may be declared.
*/

function HtmlClass (_tag,_type,_spec,_decsep) {
    if (!this.isString(_tag)) { this.logArg("HtmlClass: Missing or bad tag!"); return; }
    if (!this.isString(_type)) { this.logArg("HtmlClass: Missing or bad type!"); return; }
    if (this.isDefined(_spec)) {
            if (!this.isObject(_spec))
                { this.logArg("HtmlClass: Missing or bad spec!"); return; }
            if (_spec.dec && (!this.isNumber(_spec.dec) || _spec.dec<0))
                { this.logArg("HtmlClass: bad spec.dec!"); return; }
    }
    if (this.isDefined(_decsep)) {
        if (!this.isString(_decsep)) { this.logArg("HtmlClass: Missing or bad decsep!"); return; }
    }
    
    this.tag=               _tag;
    
    this.model =            [
                            'fieldString', 'fieldNumber', 'fieldUndefined', 'innerString',
                            'innerNumber', 'innerUndefined', 'checkbox', 'radio', 'button',
                            'select', 'box'
                             ];
                
    if (this.model.indexOf(_type)===-1) { this.logArg("HtmlClass: Unknown type!");
    
        this.type=          null;
    } else {
    
        this.type=          _type;
    }
    
    this.group=             (this.type==='radio')
                            ? document.getElementsByName(this.tag)
                            : [];
                
    this.spec=              _spec;
    
    this.decsep=            (!this.isDefined(_decsep)) ? '.' : _decsep;
    
    this.logInit=           false;
    if (this.logInit) this.log("HtmlClass.init: "+this.description());
}
HtmlClass.prototype = Object.create(Class.prototype);

// (string) HtmlClass.description (void)
HtmlClass.prototype.description = function () { return this.tag+"("+this.type+")"; };

/* overrides */

// (void) PHtmlClass.log (param)
HtmlClass.prototype.log = function (param) { if (this.logInit) Class.call(null,param); };


/* (-) Checkers */

// (bool) HtmlClass.checkThis (void)
HtmlClass.prototype.checkThis = function () {
    if (!this.myEntityExists())
        { this.logArg("HtmlClass.checkThis: Entity doesn't exist!"); return false; }
    if (this.type==null)
        { this.logArg("HtmlClass.checkThis: Bad entity or type!"); return false; }
    return true;
};

// (bool) HtmlClass.iam[SomeThing] (void) =>this
HtmlClass.prototype.myEntityExists = function () {
    var T;
    return (T=document.getElementById(this.tag)) ? true : false;
};
HtmlClass.prototype.iamInner = function () {
    return (this.type.indexOf('inner')===-1) ? false : true;
};
HtmlClass.prototype.iamNumber = function () {
    return (this.type.indexOf('Number')===-1) ? false : true;
};
HtmlClass.prototype.iamString = function () {
    return (this.type.indexOf('String')===-1) ? false : true;
};
HtmlClass.prototype.iamUndefined = function () {
    return (this.type.indexOf('Undefined')===-1) ? false : true;
};
HtmlClass.prototype.iamCheckable = function () {
    return (this.type==='checkbox') ? true : false;
};
HtmlClass.prototype.iamTitlable = function () {
    return (this.type==='button') ? true : false;
};
HtmlClass.prototype.iamValuable = function () {
    return (this.type!=='button' && this.type!=='radio'
            && this.type!=='checkbox' && this.type!=='select') ? true : false;
};
HtmlClass.prototype.iamEnablable = function () {
    return (!this.iamInner() && this.type!=='box') ? true : false;
};
HtmlClass.prototype.iamFocusable = function () {
    return (!this.iamInner() && this.type!=='box') ? true : false;
};
HtmlClass.prototype.iamVoidable = function () {
    return (this.type!=='box' && this.type !=='checkbox' && this.type!=='button') ? true : false;
};


/* (-) Setters - Checkers */

// (void) HtmlClass.set[Property] (bool) =>this
// (bool) HtmlClass.is[Property] (void) =>this

// -- Enable -- //
// (void) HtmlClass.setEnable (bool)
HtmlClass.prototype.setEnable = function (bool) {
    if (!this.checkThis()) return this.error;
    if (!this.isBoolean(bool))
        { this.logArg("HtmlClass.setEnable: Missing or bad bool!"); return; }
    if (this.iamEnablable()) {
        document.getElementById(this.tag).disabled = !bool;
    } else {
        this.logArg("HtmlClass.setEnable: not appropriate on "+this.type+" object!");
    }
};

// (bool) HtmlClass.isEnable (void)
HtmlClass.prototype.isEnable = function () {
    if (!this.checkThis()) return this.error;
    if (this.iamEnablable()) {
        return !document.getElementById(this.tag).disabled;
    } else {
        this.logArg("HtmlClass.isEnable: not appropriate on "+this.type+" object!");
        return false;
    }
};
HtmlClass.prototype.enable = HtmlClass.prototype.isEnable; //<< alias

// -- Hidden --//
// (void) HtmlClass.setHidden (bool)
HtmlClass.prototype.setHidden = function (bool) {
    if (!this.checkThis()) return this.error;
    if (!this.isBoolean(bool))
        { this.logArg("HtmlClass.setHidden: Missing or bad bool!"); return; }
    if (this.group.length===0) {
        document.getElementById(this.tag).style.visibility = (bool) ? "hidden" : "visible";
    } else {
        var i; for (i=0; i<this.group.length; i++) {
            this.group[i].style.visibility = (bool) ? "hidden" : "visible";
        }
    }
};

// (bool) HtmlClass.isHidden (void)
HtmlClass.prototype.isHidden = function () {
    if (!this.checkThis()) return this.error;
    if (this.group.length===0) {
        return (document.getElementById(this.tag).style.visibility==="hidden") ? true : false;
    } else {
        return (this.group[0].style.visibility==="hidden") ? true : false;
    }
};

// -- State --//
// (void) HtmlClass.setState (bool)
HtmlClass.prototype.setState = function (bool) {
    if (!this.checkThis()) return this.error;
    if (this.iamCheckable()) {
        document.getElementById(this.tag).checked = bool;
    } else {
        this.logArg("HtmlClass.setState: not appropriate on "+this.type+" object!");
    }
};

// (bool) HtmlClass.state (void)
HtmlClass.prototype.state = function () {
    if (!this.checkThis()) return this.error;
    if (this.iamCheckable()) {
        return document.getElementById(this.tag).checked;
    } else {
        this.logArg("HtmlClass.state: not appropriate on "+this.type+" object!");
        return false;
    }
};

// -- Value --//
// (void) HtmlClass.setValue (number||string)
HtmlClass.prototype.setValue = function (value) {
    if (!this.checkThis()) return this.error;
    if (this.iamUndefined() && !this.isNumber(value) && !this.isString(value)) {
        this.logArg("HtmlClass.setValue: Mising value!"); return;
    } else {
        if ((this.iamNumber() || this.type==='radio' ) && !this.isNumber(value))
            { this.logArg("HtmlClass.setValue: Missing or bad value - not a number!"); return; }
        if (this.iamString() && !this.isString(value))
            {this.logArg("HtmlClass.setValue: Missing or bad value - not a string!"); return; }
    }
    if(this.iamInner()) {
        document.getElementById(this.tag).innerHTML = value;
    } else if (this.iamValuable()) {
        document.getElementById(this.tag).value = value;
    } else if (this.group.length!==0) {
        var i; for (i=0; i<this.group.length; i++) {
            if (i!==value) {
                this.group[i].checked=false;
            } else {
                this.group[i].checked=true;
            }
        }
    } else {
        this.logArg("HtmlClass.setValue: not appropriate on "+this.type+" object!");
    }
};

// (misc types) HtmlClass.value (void)
HtmlClass.prototype.value = function () {
    if (!this.checkThis()) return this.error;
    if (this.iamInner()) {
        return document.getElementById(this.tag).innerHTML;
    } else if (this.iamValuable()) {
        return document.getElementById(this.tag).value;
    } else if (this.group.length!==0) {
        var i; for (i=0; i<this.group.length; i++) {
            if (this.group[i].checked===true) return i;
        }
        return -1;
    } else {
        this.logArg("HtmlClass.value: not appropriate on "+this.type+" object!");
    }
};

// (void) HtmlClass.setNumericValue (number)
HtmlClass.prototype.setNumericValue = function (value) {
    if (!this.checkThis()) return this.error;
    if (this.iamUndefined() && !this.isNumber(value) && !this.isString(value)) {
        this.logArg("HtmlClass.setNumericValue: Mising value!"); return;
    } else {
        if (this.iamNumber()) {
            var val=value.toString().replace(RegExp("\\.","g"),this.decsep);
            if(this.iamInner()) {
                document.getElementById(this.tag).innerHTML = val;
            } else if (this.iamValuable()) {
                document.getElementById(this.tag).value = val;
            }
        } else {
            this.logArg("HtmlClass.setNumericValue: not appropriate on "+this.type+" object!");
        }
    }
}

// (misc types) HtmlClass.numericValue (void)
HtmlClass.prototype.numericValue = function () {
    if (!this.checkThis()) return this.error;
    if (this.iamNumber()) {
        var val=this.value();
        return (val.replace(RegExp("\\"+this.decsep,"g"),"."))*1;
    } else {
        this.logArg("HtmlClass.numericValue: not appropriate on "+this.type+" object!");
    }
}

// -- Title --//
// (void) HtmlClass.setTitle (bool)
HtmlClass.prototype.setTitle = function (value) {
    if (!this.checkThis()) return this.error;
    if (!this.isString(value))
        { this.logArg("HtmlClass.setTitle: Missing or bad string!"); return; }
    if (this.iamTitlable()) {
        document.getElementById(this.tag).value = value;
    } else {
        this.logArg("HtmlClass.setTitle: not appropriate on "+this.type+" object!");
    }
};

// (bool) HtmlClass.title (void)
HtmlClass.prototype.title = function () {
    if (!this.checkThis()) return this.error;
    if (this.iamTitlable()) {
        return document.getElementById(this.tag).value;
    } else {
        this.logArg("HtmlClass.title: not appropriate on "+this.type+" object!");
    }
};

// -- Void --
// (void) HtmlClass.setVoid (bool)
HtmlClass.prototype.setVoid = function () {
    if (this.iamVoidable()) {
        if (this.iamInner()) {
            document.getElementById(this.tag).innerHTML="";
        } else {
            document.getElementById(this.tag).value="";
        }
    } else {
        this.logArg("HtmlClass.setVoid: not appropriate on "+this.type+" object!");
    }
};

// -- Default --
// (void) HtmlClass.setDefault ()
HtmlClass.prototype.setDefault = function () {
    if(this.isDefined(this.spec) && this.isString(this.spec.value)) {
        this.setValue(this.spec.value);
    } else {
        this.logArg("HtmlClass.onEventDefault: no or bad spec.value definition");
    }
};

// -- Focus --
// (void) HtmlClass.setFocus (bool)
HtmlClass.prototype.setFocus = function (bool) {
    if (!this.checkThis()) return this.error;
    if (!this.isBoolean(bool))
        { this.logArg("HtmlClass.setFocus: Missing or bad bool!"); return; }
    if (this.iamFocusable()) {
        if (bool) {
            document.getElementById(this.tag).focus();
        } else {
            document.getElementById(this.tag).blur();
        }
    } else {
        this.logArg("HtmlClass.setFocus: Focus not appropriate on "+this.type+" object!");
    }
};

/* (-) Events Handlers */

// (void) HtmlClass.onEventFilter ()
/*** ATTENTION: unclompleted implementation ***/
HtmlClass.prototype.onEventFilter = function () {
    if (!this.checkThis()) return this.error;
    if (this.type==='fieldNumber') {
        var value=this.value().replace(RegExp("[^0-9\\"+this.decsep+"]","g"),"");
        var pointPos=value.indexOf(this.decsep);
        var dec=""; var ent=value;
        if (pointPos>-1 && pointPos!==value.length-1) {
            dec=value.substring(pointPos+1);
            ent=value.substring(0,pointPos)*1;
            if (ent==="") ent="0";
            dec=dec.replace(RegExp("\\"+this.decsep,"g"),"");
            if(this.isDefined(this.spec) && this.isNumber(this.spec.dec)) {
                if(this.spec.dec<=0) {
                    value=value.substring(0,pointPos-1);
                } else {
                    dec=dec.substring(0,this.spec.dec);
                    value=ent+this.decsep+dec;
                }
            } else {
                value=ent+this.decsep+dec;
            }
        } else {
            if (pointPos===-1) { value=value*1; }
            else if (pointPos===value.length-1) {
                if(this.isDefined(this.spec) && this.isNumber(this.spec.dec) && this.spec.dec<=0) {
                    value=value.replace(RegExp("\\"+this.decsep,"g"),"");
                }
            }
        }
        document.getElementById(this.tag).value=value;
    } else {
        this.logArg("HtmlClass.onEventFilter: not implemented on "+this.type+" object!");
    }
    
};

// (void) HtmlClass.onEventDefault (bool)
/*** ATTENTION: unclompleted implementation ***/
HtmlClass.prototype.onEventDefault = function (bool) {
    if (!this.checkThis()) return this.error;
    if (!this.isBoolean(bool)) return this.error;
    if(this.isDefined(this.spec) && this.isString(this.spec.value)) {
        if (this.type==='fieldString') {
            if (bool && this.value()===this.spec.value) {
                this.setVoid();
            } else if (!bool && this.value()==="") {
                this.setDefault();
            }
        } else {
            this.logArg("HtmlClass.onEventVoid: not implemented on "+this.type+" object!");
            return;
        }
    } else {
        this.logArg("HtmlClass.onEventVoid: no or bad spec.value definition");
    }
};


/* (+) Checkers */

// (bool) HtmlClass.entityExists (tag)
HtmlClass.prototype.entityExists = function (tag) {
    if (!this.isString(tag) || tag.length===0)
        { this.logArg("HtmlClass.entityExists: Missing or bad tag!"); return; }
    var T;
    return (T=document.getElementById(tag)) ? true : false;
};




