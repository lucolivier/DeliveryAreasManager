/*****************************************************************************************


    AlertClass (pseudo) Class (HtmlClass extend)    
    © Asity 2013
 
    version: ß1.00.05
 
*****************************************************************************************/

function AlertClass (_tag,_tagMess,_tagInfo,_tagBtDefault) {
    if (!this.isString(_tag) && !this.isString(_tagMess)
        && !this.isString(_tagInfo) && !this.isString(_tagBtDefault) )
        { this.logArg("Missing or bad _tag or _tagText!"); return; }
        
    this.tag=            _tag;
    this.box=            new HtmlClass(_tag,'box');
    this.message=        new HtmlClass(_tagMess,'innerUndefined');
    this.info=           new HtmlClass(_tagInfo,'innerUndefined');
    this.btDefault=      new HtmlClass(_tagBtDefault,'button');
    
    this.bgd=            "rgba(0,0,0,.4)";
    
    this.stack=          [];
    this.stackcpt=       0;
    
    this.focusTo=        null;
}
AlertClass.prototype = Object.create(HtmlClass.prototype);

// (void) AlertClass.open (string, string, string, [object])
//        Create dialog alert
//        params:    message            bolded text
//                info            light text
//              btDefaut        button title
//              [objectFocus]    object to give focus after dismiss
//                                object is store to this.focusTo
AlertClass.prototype.open = function (message,info,btDefault,objectFocus,flag) {
    if (!this.isString(message) && !this.isString(info) && !this.isString(btDefault))
        { this.logArg("AlertClass.open: Missing or bad param!"); return; }
    
    if (objectFocus) {
        if (!this.isHtml(objectFocus)) {
            this.logArg("AlertClass.open: Missing or bad objectFocus!"); return;
        } else { this.focusTo=objectFocus; }
    }

    if (this.stackcpt===0 || flag) {
        if (!flag) this.stackcpt=1;
        this.message.setValue(message);
        this.info.setValue(info);
        this.btDefault.setTitle(btDefault);
        
        if (this.stackcpt===0) document.getElementById(this.box.tag).style.background=this.bgd;
        this.box.setHidden(false);
        
    } else {
        this.stackcpt++;
        this.stack[this.stack.length]=[message,info,btDefault,objectFocus];
    }
};

// (void) AlertClass.close (number)
//        Close dialog alert
//        params:    [value]            -999 to not give focus to this.focusTo
AlertClass.prototype.close = function (value) {
    if (!this.isNumber(value))
        { this.logArg("AlertClass.close: Missing or bad value!"); return; }

    this.box.setHidden(true);
    
log("AlertClass-stackcpt:"+this.stackcpt);
        
    if (this.stackcpt>1) {
        this.stackcpt--;
        var alert=this.stack[0];
        
        var i; var newStack=[];
        for (i=1; i<this.stack.length; i++) {
            newStack[newStack.length]=this.stack[i];
        }
        this.stack=newStack;
        
        document.getElementById(this.box.tag).style.background="rgba("+this.stackcpt+","+this.stackcpt+","+this.stackcpt+",."+this.stackcpt+")";
        this.open(alert[0],alert[1],alert[2],alert[3],true);
        
        return;
        
    }
    
    this.stackcpt=0;
    
    if (value!==-999) {
        if (this.focusTo!=null) { this.focusTo.setFocus(true); }
        else { this.focusTo=null; }
    }
};

