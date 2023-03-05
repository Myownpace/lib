/*library for managing user interfaces*/

var tabInstance = new tab()
options.prototype = tabInstance
miniTab.prototype  = tabInstance

function tab(){
    /*the constructor for tabs*/
    var container = document.createElement("div"); 
    container.className = "window top left"
    var curtain = container.cloneNode(true); curtain.className += " curtain"
    this.screenThreshold = 700
    this.construct = function(object){
        object.window = container.cloneNode(true)
        object.curtain = curtain.cloneNode(true)
        object.window.appendChild(object.curtain)
    }
}

function options(on,additionalBtns,cb){
    /*constructor for options
    the on parameter specifies what element the option is for
    
    # the additionalBtns parameter is an array of buttons that should also open
    the option
    #the cb parameter is a callback that is called whenever the option is opened
    */
   var self = this;
   this.construct(this)
   this.element = on
   this.cb = cb
   this.optionWidthBs = 30
   changeClass(this.curtain,"curtain","")
   var option = document.createElement("div"); 
   option.className = "option-elem minor-pad"
   this.window.appendChild(option)
   this.optionElement = option
   
   this.preventOption = function(e){e.stopPropagation()}
   this.open = function(e){
    /*opens the options*/
    stopDefault(e)
    e.stopPropagation()
    this.element.appendChild(this.window)
    if(windowDim("w") < this.screenThreshold){
        this.smallScreen(e)
    }
    else{this.bigScreen(e)}
    if(isFunction(this.cb)){this.cb(this)}
   }
   this.close = function(e){
    /*closes the options*/
    try{this.element.removeChild(this.window)}
    catch(err){console.error("tab is closed")}
   }
   this.smallScreen = function(){
    /*opens the options for small screens*/
   }
   this.bigScreen = function(e){
    /*opens the options for big screens*/
    var option = this.optionElement
    var p = this.optionWidthBs
    var {w:windowWidth,h:windowHeight} = windowDim()
    var optionWidth = (p/100) * windowWidth
    option.style.width = optionWidth.toString() + "px"
    option.style.height = "auto";
    if(elementDim(option,"h") > windowHeight){
        option.style.height = windowHeight.toString() + "px"
    }
    var coord = option.getBoundingClientRect()
    var {clientX:x,clientY:y} = e
    if(x + coord.width > windowWidth){x = windowWidth - coord.width}
    else if(x < 0){x = 0}

    if(y + coord.height > windowHeight){y = windowHeight - coord.height}
    else if(y < 0){y = 0}
    moveTo(option,x,y)
   }

   this.add = function(icon,option,click){
    /*adds a new option*/
    if(icon instanceof Array){
        for(var i=0; i < icon.length; i++){
            this.add(icon[i][0],icon[i][1],icon[i][2])
        }
        return
    }
    var entry = document.createElement("div");
    entry.className = "minor-pad option flex vcenter list-item"
    if(icon){
        var image = document.createElement("img"); image.src = icon;
        image.className = "icon"
        entry.appendChild(image)
    }
    var optionEntry = document.createElement("span")
    optionEntry.innerHTML = option
    entry.appendChild(optionEntry)
    if(isFunction(click)){
        addEvent(entry,"click",function(){click(self)})
    } 
    this.optionElement.appendChild(entry)   
   }
   addEvent(on,"contextmenu",function(e){self.open(e)})
   addEvent(this.curtain,"contextmenu",function(e){self.preventOption(e)})
   addEvent(this.window,"contextmenu",function(e){self.preventOption(e)})
   addEvent(this.optionElement,"contextmenu",function(e){self.preventOption(e)})
   addEvent(this.optionElement,"click",function(e){self.preventOption(e);})
   addEvent(this.curtain,"click",function(e){self.preventOption(e); self.close(e)})
   if(additionalBtns instanceof Array){
    for(var  i =0;  i < additionalBtns.length; i++){
        addEvent(additionalBtns[i],"click",function(e){self.open(e)})
    }
   }
}

function autoFetch(element,cb,threshold,direction){
    /* interface for scrolling down and fetching more content
        # the "cb" is a callback to handle the fetching of contents
        or whatever you want to do, musn't necessarily be fetching contents
        as for data that might be needed, the object will be sent as the first
        parameter of the callback, if no valid function is specified as a callback
        then the callback parameter should be an object containing information
        for retrieving the more contents , the syntax should be:
        {url:["the url to fetch the contents"],
        contentIndex:["the index of the content, it increments by
            the number of children the body of the response has"],
        contentIndexKey : ["the key to use when sending the content index"],
        cb : ["a call back to call for each of the content"],
        mcb : ["a callback to call before fetching"]
        }

        # the "threshold" parameter specifies how far in percentage of the total
        available scrolling area should be scrolled before more content is fetched
        defaults to 75%
        
        # the "direction" parameter specifies the direction of the scroll
        it can only be two values "x or y" defaults to y
    */
   this.getDirection = function(direction){
    return (inarray(["x","y"],direction,true))? direction : "y"
   }
    var self = this
    this.window = element
    this.threshold = (isNumeric(threshold))? threshold : 75
    this.direction = this.getDirection(direction)
    this.directions = {x:"scrollLeft",y:"scrollTop"}
    this.totalScrolls = {x:"scrollWidth",y:"scrollHeight"}
    
    this.fetchContent = function(e){
        if(self.stopFetch || self.lockFetch){return}
        var element = e.target
        var direction = self.getDirection()
        var dimension = (direction == "y")? 
        element.clientHeight : element.clientWidth;
        var scrollPositionProperty = self.directions[direction]
        var totalScrollProperty = self.totalScrolls[direction]
        var scrollPosition = element[scrollPositionProperty]
        var totalScroll = element[totalScrollProperty] - dimension
        var scrollPercent = (scrollPosition / totalScroll) * 100
        if(scrollPercent > self.threshold){self.cb(self)}
    }

    this.useMoreButton = function(){
        /*if the element doesn't yet have a scroll bar a more button will 
        be used
        */
        if(scrollable(this.window,this.getDirection()) || this.lockFetch){
            return this.removeMoreButton()
        }
        if(!this.moreButton){
            this.moreButton = document.createElement("a")
            this.moreButton.innerHTML = "Show more"
            this.moreButton.href = "javascript:void(0)"
            this.moreButton.onclick = function(){
                self.cb(self)
            }
        }
        this.window.appendChild(this.moreButton)
    }
    this.removeMoreButton = function(){
        if(this.moreButton){remove(this.moreButton)}
    }
    this.defaultCb = function(){
        /*the default call back to be used for fetching more contents*/
        if(!this.req){
            this.req = new Req()
            this.req.url = this.fetchDetails.url
            this.req.method = "POST"
            this.req.responseType = "document"
            
            this.req.onload = function(req){
                var object = req.object
                var response = object.responseXML
                if(response instanceof Document){
                    var body = response.body
                    var children = body.children
                    var formalIndex = self.fetchDetails.contentIndex
                    self.removeError()
                    for(var i=0; i < children.length; i++){
                        if(isFunction(self.fetchDetails.cb)){
                            self.fetchDetails.cb(children[i])
                        }
                        self.window.appendChild(children[i])
                        i--
                        self.fetchDetails.contentIndex++
                    }
                    if(self.fetchDetails.contentIndex == formalIndex){ 
                        self.lockFetch = true;
                    }
                    self.useMoreButton()
                    self.stopFetch = false
                }
            }
            this.req.onerror = function(req){
                self.error()
                self.setErr()
                self.window.appendChild(self.errElement)
                self.lockFetch = true
                self.stopFetch = false
            }
            this.req.ontimeout = function(req){
                self.error()
                self.errMsgBox.innerHTML = "This request took too long"
                self.window.appendChild(this.errElement)
                self.lock = true
                self.stopFetch = false
            }
        }
        self.stopFetch = true;
        self.lockFetch = false;
        self.req.message = {}
        self.req.message[self.fetchDetails.contentIndexKey] = 
        self.fetchDetails.contentIndex
        if(isFunction(self.fetchDetails.mcb)){self.fetchDetails.mcb(self)}
        self.removeMoreButton()
        self.removeError()
        self.req.send()
    }
    this.setErr = function(){
        if(!navigator.onLine){
            this.errorMessage = "Looks like you are offline"
        }
        else{this.errorMessage = "Something went wrong"}
        this.errMsgBox.innerHTML = this.errorMessage
    }
    this.error = function(){
        if(!this.errElement){
            this.errElement = document.createElement("div")
            this.errMsgBox = document.createElement("span")
            this.errMsgBox.className = "error"
            this.tryBtn = document.createElement("button")
            this.tryBtn.innerHTML = "Try Again"; 
            this.tryBtn.onclick = function(){self.cb(self)}
            this.errElement.appendChild(this.errMsgBox)
            this.errElement.appendChild(this.tryBtn)
        }
    }
    this.removeError = function(){if(this.errElement){remove(this.errElement)}}
    this.cb = (isFunction(cb))? cb : this.defaultCb
    this.fetchDetails = (isFunction(cb))? null : cb
    this.useMoreButton()
    addEvent(element,"scroll",this.fetchContent)
}

function miniTab(cb,opener){
    //constructor for minitabs
    var self = this
    var element = document.createElement("div")
    this.construct(this)
    this.window.appendChild(element)
    this.tab = element; element.className = "minitab"
    this.cb = cb
    this.bigScreenClass = "bigscreen-minitab"
    this.smallScreenClass = "smallscreen-minitab"
    var head = document.createElement("div")
    var closeBtn = document.createElement("button")
    closeBtn.innerHTML = "X"; closeBtn.className = "cancel-btn"
    head.appendChild(closeBtn); element.appendChild(head)
    this.head = head
    this.closeBtn = closeBtn

    this.open = function(){
        var wdim = windowDim()
        document.body.appendChild(this.window)
        if(this.screenThreshold > wdim.w){
            this.smallScreen(wdim)
        }
        else{this.bigScreen(wdim)}
        addEvent(window,"resize",resize)
        if(isFunction(this.cb)){this.cb()}
    }
    this.close = function(){
        removeEvent(window,"resize",resize)
        remove(this.window)
    }
    this.smallScreen = function(){

    }
    this.bigScreen = function(wdim){
        changeClass(this.tab,this.smallScreenClass,this.bigScreenClass)
        var height = elementDim(this.tab,"h")
        if(height < wdim.h){
            var y = (wdim.h - height) / 2
        }
        orgPos(this.tab)
        moveBy(this.tab,0,y)
    }
    this.addOpener = function(opener){
        if(opener instanceof Array){
            for(var i=0; i < opener.length; i++){this.addOpener(opener[i])}
            return
        }
        if(opener){addEvent(opener,"click",function(){self.open()})}
    }
    closeBtn.onclick = function(){self.close()}
    var resize = function(){self.open()}
    this.addOpener(opener)
}