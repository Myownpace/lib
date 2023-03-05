
function Req(url,method,message){
    this.object = new XMLHttpRequest()
    this.url = url
    this.stimulis = [
        "onload","onabort","ontimeout","onloadend","onerror",
        "onloadstart","onprogress","onreadystatechange"
    ]
    this.validMethods = ["POST","GET"]
    this.defaultMethod = "POST"
    this.method = method
    this.message = message

    this.send = function(){
        var object = this.object
        this.method = (inarray(this.validMethods,this.method))?this.method : 
        this.defaultMethod
        if(this.loadClass){
            if(!(this.loadInterface instanceof this.loadClass)){
                this.loadInterface = new this.loadClass(this.loadElement)
            }
        }
        
        object.open(this.method.toUpperCase(),this.url)
        object.responseType = (this.responseType)? this.responseType : 
        object.responseType
        if(equalString(this.method,"post")){
            object.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
        }
        for(var i=0; i < this.stimulis.length; i++){
            this.addReact(this.stimulis[i],this[this.stimulis[i]])
        }
        object.send(this.setMessage())
    }

    this.addReact = function(stimuli,response){
        var self = this
        if(isFunction(response)){
            this.object[stimuli] = function(){
                if(self.object.readyState == 4 & self.loadClass){
                    self.loadInterface.stop()
                }
                response(self)
            }
        }
    }
    this.setMessage = function(){
        var message = this.message
        var messageList = []
        for(key in message){
            messageList.push(key.toString() + "=" + message[key].toString())
        }
        return messageList.join("&")
    }

    this.ongoingRequest = function(){
        /*checks if there is an ongoing request*/
        return this.object.readyState !=4 && this.OPENED
    }
}