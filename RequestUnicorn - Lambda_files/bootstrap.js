!function(){
var MODULE_LOAD_URL="/static/build/modules",IN_WORKER="function"==typeof importScripts,host=location.protocol+"//"+location.hostname+(location.port?":"+location.port:""),global=function(){
return this}()
global||"undefined"==typeof window||(global=window),global||"undefined"==typeof self||(global=self)
var commentRegExp=/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm,cjsRequireRegExp=/require\s*\(\s*["']([^'"\s]+)["']\s*\)/g
function getInlineDeps(fn){var deps=[]
return fn.length&&(fn.toString().replace(commentRegExp,"").replace(cjsRequireRegExp,(function(match,dep,index,str){
for(var i=index;str.charCodeAt(i-=1)<=32;);"."!==str.charAt(i)&&deps.push(dep)})),
deps=["require","exports","module"].concat(deps)),deps}function define(name,deps,callback){
if("string"!=typeof name&&(callback=deps,
deps=name,name=null),deps&&!Array.isArray(deps)&&(callback=deps,
deps=null),nextModule&&(name&&name!=nextModule.name||(name=nextModule.name,
deps=deps||nextModule.deps,nextModule=null)),!name)return defQueue.push([deps,callback])
define.loaded[name]||(deps||"function"!=typeof callback||(deps=getInlineDeps(callback)),
define.loaded[name]={id:name,deps:resolveNames(name,deps||[]),factory:callback,exports:{}},
define.loading[name]&&delete define.loading[name],
define.lastModule?define.pending.push(name):define.lastModule=name)}
var nextModule,defQueue=[],addToLoadQueue=function(missing,deps,callback,errback){
var toLoad=missing.length,map={}
define.queue.push({deps:deps,map:map,toLoad:toLoad,callback:callback,errback:errback})
for(var i=0;i<missing.length;++i){var p=missing[i]
map[p]=1,define.loading[p]||(define.loading[p]=1,require.load(p))}
},processLoadQueue=function(err,id){var changed=!1
err?(id||(id=err.id),define.errors[id]=err,define.queue.forEach((function(r){
r.map[id]&&(r.toLoad=-1,r.errback&&r.errback(err))
})),define.lastModule==id&&(define.lastModule=null),
define.pending=define.pending.filter((function(p){return p!=id
})),changed=!0):!id||defQueue.length||define.loaded[id]||(defQueue=[config.shim&&config.shim[id]||[[],null]]),
defQueue.length&&(defQueue.length>1&&(console.error("possible error, more than one module in defqueue",defQueue),
defQueue=defQueue.slice(-1)),define(id,defQueue[0][0],defQueue[0][1]),defQueue.length=0)
var pending=define.pending
define.queue.forEach((function(request){pending.forEach((function(id){
request.map[id]&&request.toLoad--})),request.map[define.lastModule]&&request.toLoad--,
request.toLoad<=0&&(request.toLoad=NaN,
changed=!0,_require("",request.deps,request.callback,request.errback))})),define.lastModule=null,
pending.length&&(define.pending=[]),changed&&(define.queue=define.queue.filter((function(r){
return r.toLoad>0})))}
define.amd={},define.queue=[],define.loaded={},define.errors={},define.loading={},define.pending=[],
define.modules={require:1,exports:1,module:1},define.fetchedUrls={}
var activateModule=function(name){var module=define.loaded[name]
module.getModuleDefinition&&(module=module.getModuleDefinition(module))
var exports=module.exports
if("function"!=typeof module.factory)exports=module.factory
else{var req=function(path,callback){return _require(name,path,callback)}
req.config=config
var missing=checkMissing(module.deps)
if(missing.length)return missing
module.define=define
var specialModules={require:req,exports:exports,module:module}
0!=name.lastIndexOf("architect!",0)||module.pluginFactory||(module.pluginFactory=module.factory,
module.factory=activateArchitectModule),define.modules[name]=exports
var args=module.deps.slice(0,module.factory.length),returnValue=args.length?module.factory.apply(module,args.map((function(name){
return specialModules[name]||lookup(name)}))):module.factory(req,exports,module)
exports=null==returnValue?module.exports:returnValue}
config.$keepLoaders||delete define.loaded[name],define.modules[name]=exports
},checkMissing=function(deps,seen,missing){missing=missing||{},seen=seen||{}
for(var i=0;i<deps.length;++i){var depName=deps[i]
if(!define.modules[depName]){var dep=define.loaded[depName]
dep?missing[depName]||seen[depName]||(seen[depName]=1,checkMissing(dep.deps,seen,missing)):missing[depName]=1
}}return Object.keys(missing)},lookup=function(moduleName){var mod=define.modules[moduleName]
return void 0===mod&&define.loaded[moduleName]&&(activateModule(moduleName),mod=define.modules[moduleName]),
mod}
function asyncRequire(parentId,moduleName,callback,errback){
var result,deps=resolveNames(parentId,moduleName),missing=checkMissing(deps)
if(callback||errback||"function"!=typeof Promise||(result=new Promise((function(resolve,reject){
callback=function(){resolve([].slice.call(arguments))},errback=reject
}))),missing.length)addToLoadQueue(missing,deps,callback,errback)
else{var args=deps.map(lookup)
result&&(result.resolved=args),callback&&callback.apply(null,args)}return result}
var _require=function(parentId,moduleName,callback,errback){if("string"==typeof moduleName){
var depName=resolveName(parentId,moduleName),module=lookup(depName)
if(void 0!==module)return"function"==typeof callback&&callback(module),module
if(IN_WORKER||syncLoaders.test(moduleName))return addToLoadQueue([depName],[depName]),
lookup(depName)
}else if(Array.isArray(moduleName))return asyncRequire(parentId,moduleName,callback,errback)}
function resolveName(parentId,moduleName,isPluginPath){
/!/.test(parentId)&&(parentId=parentId.split("!").pop())
var i=moduleName.indexOf("!")
if(-1!==i)return resolveName(parentId,moduleName.slice(0,i),!0)+"!"+resolveName(parentId,moduleName.slice(i+1))
if("."==moduleName.charAt(0)){
var parentChunks=parentId.split("/"),parentModule=parentChunks.shift(),path=parentChunks.slice(0,-1).join("/")
for(moduleName=parentModule+(path?"/"+path:"")+"/"+moduleName;-1!==moduleName.indexOf(".")&&previous!=moduleName;){
var previous=moduleName
moduleName=moduleName.replace(/\/\.\//,"/").replace(/[^\/]+\/\.\.\//,"")}}
return!isPluginPath&&config.alias[moduleName]&&(moduleName=config.alias[moduleName]),moduleName}
function resolveNames(parentId,moduleNames){return moduleNames.map((function(name){
return resolveName(parentId,name)}))}var require=function(module,callback,errback){
return _require("",module,callback,errback)},config=require.config=function(options){
if(options.baseUrl&&(config.baseUrl=options.baseUrl.replace(/\/*$/,"/")),
options.host&&(host=options.host),options.alias&&Object.keys(options.alias).forEach((function(p){
config.alias[p]=options.alias[p]})),options.paths&&Object.keys(options.paths).forEach((function(p){
config.paths[p]=options.paths[p]
})),"useDevBundle"in options&&(config.useDevBundle=options.useDevBundle),
options.transform&&(config.transform=options.transform),
/\bes5\b/.test(options.transform)&&!global.shimIncluded){
console.assert||(console.assert=function(){})
var oldFlags=RegExp.prototype.flags
RegExp.prototype.flags=!0,require(["js-polyfills/es6"]),RegExp.prototype.flags=oldFlags,
global.shimIncluded=!0}options.MODULE_LOAD_URL&&(require.MODULE_LOAD_URL=options.MODULE_LOAD_URL),
options.assetUrl&&(config.assetUrl=options.assetUrl),
null!=options.$keepLoaders&&(config.$keepLoaders=options.$keepLoaders)}
function undefOne(module,path){delete define.errors[module],delete define.loaded[module],
delete define.modules[module],delete define.loading[module],delete define.fetchedUrls[path]}
function undefAll(module,hash){Object.keys(hash).forEach((function(key){var i=key.indexOf("!")+1
if(0==key.lastIndexOf(module,0)&&undefOne(key,require.toUrl(key,".js")),i){
var plugin=key.slice(0,i-1),resource=key.slice(i)
0!=resource.lastIndexOf(module,0)&&0!=plugin.lastIndexOf(module,0)||(undefOne(key,require.toUrl(key,"")),
undefOne(resource,require.toUrl(resource,"")))}}))}function addTransform(url,moduleName){
var transform=require.config.transform
return Array.isArray(transform)||(transform=[transform]),("~/"+transform.map((function(part){
return"string"==typeof part?part:"object"==typeof part&&part.except&&-1===moduleName.lastIndexOf(part.except,0)?part.transform:-1!=moduleName.lastIndexOf(part[0],0)?part[1]:void 0
})).filter(Boolean).join(",")+"/"+url).replace("//","/")}require.resetConfig=function(cfg){
config.alias=Object.create(null),config.paths=Object.create(null),config.baseUrl="",
config.transform="",cfg&&require.config(cfg)},require.getConfig=function(){
var script=document.querySelector("script[src*=mini_require]")
return{host:host,paths:config.paths,baseUrl:config.baseUrl,alias:config.alias,
transform:config.transform,useDevBundle:config.useDevBundle,MODULE_LOAD_URL:require.MODULE_LOAD_URL,
requireSourceUrl:!config.packed&&script&&script.src,assetUrl:config.assetUrl}
},require.resetConfig(),define.undef=require.undef=function(module,recursive){
if(module=resolveName("",module),recursive){var root=(module+"/").replace(/\/+$/,"/")
undefAll(root,define.errors),undefAll(root,define.loaded),undefAll(root,define.modules),
undefAll(root,define.loading)}else undefOne(module,require.toUrl(module,".js"))},
require.MODULE_LOAD_URL=MODULE_LOAD_URL,require.toUrl=function(moduleName,ext,skipExt,isStatic){
var absRe=/^([\w\+\.\-]+:|\/)/;-1===moduleName.indexOf("!")&&ext&&!/^\//.test(moduleName)||(ext="")
for(var paths=config.paths,testPath=moduleName,tail="";testPath;){if(paths[testPath]){
moduleName=paths[testPath]+tail
break}var i=testPath.lastIndexOf("/")
if(-1===i)break
tail=testPath.substr(i)+tail,testPath=testPath.slice(0,i)}if(skipExt)return testPath
var url=".js"==ext&&moduleName.slice(-3)==ext?moduleName:moduleName+ext
if(ext&&".ts"==moduleName.slice(-3)&&(url=moduleName.slice(0,-3)+ext),!absRe.test(url)){
".js"==ext&&require.config.transform&&(url=addTransform(url,moduleName))
var baseUrl=config.baseUrl
baseUrl||(baseUrl=isStatic?config.assetUrl||require.MODULE_LOAD_URL+"/../":require.MODULE_LOAD_URL),
"/"!=baseUrl.slice(-1)&&(baseUrl+="/"),url=baseUrl+url}return"/"==url[0]&&(url=host+url),url}
var loadScriptWithTag=function(path,id,callback){if(IN_WORKER)return nextModule={name:id,deps:null},
"/"==path[0]&&(path=host+path),importScripts(path),callback(null,id)
var head=document.head||document.documentElement,s=document.createElement("script")
s.setAttribute("crossorigin","anonymous"),s.src=path,s.charset="utf-8",s.async=!0,
s.onload=s.onreadystatechange=function(_,isAbort){
!isAbort&&s.readyState&&"loaded"!=s.readyState&&"complete"!=s.readyState||(s.remove&&s.remove(),
s=s.onload=s.onreadystatechange=null,isAbort||callback(null,id))},s.onerror=function(e){
processLoadQueue({message:"Error loading script "+id+":"+path,id:id,path:path})},head.appendChild(s)
}
function loadText(path,sync,callback){callback||(callback=sync,sync=!1)
var xhr=new global.XMLHttpRequest
xhr.open("GET",path,!sync),xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8"),
xhr.onload=function(e){if(xhr.status>399&&xhr.status<600)return callback({message:xhr.statusText,
path:path})
callback(null,xhr.responseText,xhr)},xhr.onabort=xhr.onerror=function(e){callback(e)},xhr.send("")}
var loadScript=function(path,id,callback){var useDevBundle=config.useDevBundle
return"string"==typeof useDevBundle&&(useDevBundle=id.match(useDevBundle)),useDevBundle&&!(path===id)?loadDevBundle(path,id,callback):loadScriptWithTag(path,id,callback)
}
function loadDevBundle(path,id,callback){
loadText(path+="?devBundle=1",IN_WORKER,(function(err,text,xhr){if(err)return callback(err)
parseDevBundle(text)
var continuationToken=xhr.getResponseHeader("x-metadata-length")
if(!continuationToken)return callback(err,id)
loadText(path+"&continue="+continuationToken,IN_WORKER,(function(err,text){
if(err)return callback(err)
parseDevBundle(text,!0),callback(err,id)}))}))}var DEV_BUNDLE_SEPARATOR="\0\0"
function parseDevBundle(text,isDiff){
for(var parts=text.split(DEV_BUNDLE_SEPARATOR),i=1;i<parts.length;i+=2)define.bundlePart(parts[i],parts[i+1],isDiff)
return parts[0]}function prepareBundlePart(part){var id=part.id
define.loaded[id]=null
var source=part._source
nextModule={name:id,deps:[]}
var path=require.MODULE_LOAD_URL+"~/amd/"+id.replace(/^[^/!]+!/,"")+".js"
return"/"==path[0]&&(path=host+path),global.eval(source+"\n//# sourceURL="+path),nextModule=null,
define.loaded[id]}define.bundlePart=function(id,source,reload){reload&&require.undef(id)
var factory=/text!/.test(id)?source:void 0
define.loaded[id]={id:id,deps:[],factory:factory,exports:{},
getModuleDefinition:factory?void 0:prepareBundlePart,_source:source
},define.loading[id]&&delete define.loading[id],define.pending.push(id)},require.load=function(id){
var i=id.indexOf("!")+1
if(i){var plugin=id.substring(0,i),resourceId=id.substr(i)
"function"==typeof require[plugin]?require[plugin](resourceId,processLoadQueue,id):console.error("require plugin "+plugin+"missing")
}else{var url=require.toUrl(id,".js")
define.fetchedUrls[url]|=1,loadScript(url,id,processLoadQueue)}}
var syncLoaders=/^(language!|webworker!|vfs!|asset-url!)/
function activateArchitectModule(_1,_2,_3){var module=this,wrapper=function(){
return module.pluginFactory(_1,_2,_3),
"function"==typeof module.exports&&(module.exports.provides||module.exports.consumes)?module.exports.apply(this,arguments):module.exports
}
return wrapper.packagePath=module.id,wrapper}require["language!"]=function(module,callback,id){
define(id,[],module),callback()},require["webworker!"]=function(module,callback,id){
define(id,[],require.toUrl(module.split("!").pop(),".js")),callback()
},require["asset-url!"]=function(module,callback,id){
define(id,[],require.toUrl(module.split("!").pop(),"","",!0)),callback()
},require["vfs!"]=function(module,callback,id){var url=require.MODULE_LOAD_URL+"/~node/"+module
if(4&define.fetchedUrls[url])return!1
define.fetchedUrls[url]|=4,define(id,[],{srcUrl:url,path:module}),callback()
},require["text!"]=function(module,callback,id){var url=require.toUrl(module)
if(2&define.fetchedUrls[url])return!1
define.fetchedUrls[url]|=2,loadText(url,(function(err,val){if(err)return callback(err,id)
define(id,[],val),callback()}))},require["json!"]=function(module,callback,id){
var textId="text!"+module
require["text!"](module,(function(err){if(err)return callback(err,id)
var val=JSON.parse(require(textId))
define(id,[],val),callback()}),textId)},require["architect-config!"]=function(module,callback,id){
var url=require.toUrl(module,".js").replace("~/","~/config,")
if(1&define.fetchedUrls[url])return!1
define.fetchedUrls[url]|=1,loadScript(url,id,processLoadQueue)
},require["ace/requirejs/text!"]=require["text!"],
require["architect!"]=function(module,callback,id){var url=require.toUrl(module,".js")
if(1&define.fetchedUrls[url])return!1
define.fetchedUrls[url]|=1,loadScript(url,id,processLoadQueue)
},require["vs/css!"]=function(module,callback,id){define(id,[],{}),callback()
},global.define&&global.define.packaged||(define.original=global.define,global.define=define,
global.define.packaged=!0),global.require&&global.require.packaged||(global.require=require,
global.require.packaged=!0),global.requirejs||(global.requirejs=require),global.miniRequire=require
}()


define("architect/requirejs-loader",[],(function(require,exports,module){"use strict"
function resolveArrayConfig(config,callback){var packagePaths=config.map((function(plugin){
return"string"==typeof plugin?plugin:plugin.provides&&plugin.packagePath&&!/!/.test(plugin.packagePath)?"architect!"+plugin.packagePath:plugin.packagePath
})).filter((function(path){return!!path})),request=require(packagePaths)
function done(modules){var i=0
callback(null,config.map((function(plugin){
return"string"==typeof plugin?modules[i++]:plugin.packagePath?(plugin.setup=modules[i++],
plugin):plugin})))}request.resolved?done(request.resolved):request.then(done)}
function resolveObjectConfig(config,callback){
var keys=Object.keys(config),packagePaths=keys.map((function(key){var path=config[key]
if("string"==typeof path)return/!/.test(path)?path:"architect!"+path})).filter((function(path){
return!!path})),request=require(packagePaths)
function done(modules){var i=0
keys.forEach((function(key){"string"==typeof config[key]&&(config[key]=modules[i++])})),
callback(null,config)}request.resolved?done(request.resolved):request.then(done)}
exports.resolveConfig=function(config,callback){
return Array.isArray(config)?resolveArrayConfig(config,callback):resolveObjectConfig(config,callback)
}}))


define("events",[],(function(require,exports,module){
var EventEmitter=exports.EventEmitter=function(){},toString=Object.prototype.toString,isArray=Array.isArray||function(obj){
return"[object Array]"===toString.call(obj)},defaultMaxListeners=10
EventEmitter.prototype.setMaxListeners=function(n){this._events||(this._events={}),
this._events.maxListeners=n},EventEmitter.prototype.emit=function(type){if(this._events){
var handler=this._events[type]
if(handler){var returnValue
if("function"==typeof handler)switch(arguments.length){case 1:return handler.call(this)
case 2:return handler.call(this,arguments[1])
case 3:return handler.call(this,arguments[1],arguments[2])
default:var args=Array.prototype.slice.call(arguments,1)
returnValue=handler.apply(this,args)}else if(isArray(handler)){
args=Array.prototype.slice.call(arguments,1)
for(var temp,listeners=handler.slice(),i=0,l=listeners.length;i<l;i++)void 0!==(temp=listeners[i].apply(this,args))&&(returnValue=temp)
}return returnValue}}},EventEmitter.prototype.addListener=function(type,listener,plugin){
if("function"!=typeof listener)throw new Error("addListener only takes instances of Function")
this._events||(this._events={})
var eventList=this._events[type]
if(eventList)if(isArray(eventList)){var m
if(!eventList.warned)(m=void 0!==this._events.maxListeners?this._events.maxListeners:defaultMaxListeners)&&m>0&&eventList.length>m&&(eventList.warned=!0,
console.error('warning: possible EventEmitter memory leak detected. "'+eventList.length+'" listeners of type "'+type+'" added. Use emitter.setMaxListeners() to increase limit.'),
console.trace())
eventList.push(listener)}else this._events[type]=[eventList,listener]
else this._events[type]=listener
return"newListener"!=type&&this.emit("newListener",type,listener),plugin&&plugin.addEvent(this,type,listener),
this
},EventEmitter.prototype.on=EventEmitter.prototype.addListener,EventEmitter.prototype.once=function(type,listener,plugin){
var self=this,wrapped=function(){return self.removeListener(type,wrapped.listener),
wrapped.listener.apply(self,arguments)}
if(listener)return wrapped.listener=listener,self.on(type,wrapped,plugin),this
var result=new Promise((function(resolve){wrapped.listener=resolve}))
return self.on(type,wrapped,plugin),result
},EventEmitter.prototype.removeListener=function(type,listener){
if("function"!=typeof listener)throw new Error("removeListener only takes instances of Function")
if(!this._events||!this._events[type])return this
var list=this._events[type]
if(isArray(list)){if(!list.some((function(l,i){if((l.listener||l)==listener)return list.splice(i,1),
!0})))return this
0===list.length&&delete this._events[type]
}else(this._events[type].listener||this._events[type])===listener&&delete this._events[type]
return"removeListener"!=type&&this.emit("removeListener",type,listener),this
},EventEmitter.prototype.off=EventEmitter.prototype.removeListener,
EventEmitter.prototype.removeAllListeners=function(type){
return type&&this._events&&this._events[type]&&(this._events[type]=null),this
},EventEmitter.prototype.listeners=function(type){return this._events||(this._events={}),
this._events[type]||(this._events[type]=[]),
isArray(this._events[type])||(this._events[type]=[this._events[type]]),this._events[type]},
exports.once=function(emitter,...args){return emitter.once(...args)}}))


define("architect/imports",[],(function(require,exports,module){"use strict"
exports.$setImports=function(value){
module.exports=value||null,"undefined"!=typeof define&&define.modules&&(define.modules["architect/imports"]=value||{})
}}))


define("architect/architect",[],(function(require,exports,module){"use strict"
var USE_PROXY="undefined"!=typeof Proxy,LOADING={},EventEmitter=require("events").EventEmitter,{$setImports:setInternalImports}=require("./imports")
function setImports(imports,app){exports.$currentApp=app,setInternalImports(imports)}
function normalizeServiceName(name){
return name.replace(/[._\-]./g,([dot,letter])=>letter.toUpperCase())}
function registerAlias(app,name,newPlugin,replace){var normalizedName=normalizeServiceName(name)
;[name,normalizedName,name.replace(/[.]./g,x=>x[1].toUpperCase()),name.replace(/[._]./g,x=>x[1].toUpperCase()),name.replace(/[a-z\d][A-Z]/g,x=>x[0]+"."+x[1].toLowerCase()),name.replace(/[a-z\d][A-Z]/g,x=>x[0]+"_"+x[1].toLowerCase())].forEach((function(x){
app.$alias[x]=normalizedName,
app.$addServiceName&&(app.$addServiceName(x),app.$addServiceName(x+"Options"))})),
!replace&&app.serviceDefinitions[normalizedName]||(app.serviceDefinitions[normalizedName]=newPlugin)
}setInternalImports(null)
class Architect extends EventEmitter{constructor(config){super()
var app=this
app.config=config,app.serviceToPlugin={},app.serviceDefinitions={},app.$alias={},
app._moduleCache=Object.create(null)
var services=app.services={app:app,hub:app},handler={get:function(target,name){
const dependency=app.getService(name)
if(dependency instanceof Error){
const err=new Error(`Dependency ${name} failed to load:\n${dependency.message}`)
throw err.stack=dependency.stack,err}return dependency}}
USE_PROXY?app.imports=new Proxy(services,handler):(app.imports={},app.$addServiceName=function(name){
app.imports.__defineGetter__(name,(function(){return handler.get(null,name)}))},
Object.keys(services).forEach(app.$addServiceName)),
app.addPlugins(config),services.imports=app.imports}getService(name){
if(this.$alias[name]&&(name=this.$alias[name]),"symbol"==typeof name)return this.services[name]
try{const result=this.services[name]||name in this.serviceDefinitions&&this.$activatePlugin(name)
if(result==LOADING)throw new Error("Dependency cycle detected when loading "+name)
if(!result)throw new Error("Trying to access unknown service "+name)
return result}catch(err){return this.services[name]=err,err}}activate(pluginNames){
var serviceDefinitions=this.serviceDefinitions
pluginNames||(pluginNames=Object.keys(serviceDefinitions))
var errors={}
if(pluginNames.forEach(key=>{const service=this.getService(key)
service instanceof Error&&(errors[key]=service)}),setImports(null),this.emit("ready"),
Object.keys(errors).length>0){
const err=new Error("The following plugins failed to load:\n"+Object.keys(errors).map(key=>key+": "+errors[key].message).reduce((a,b)=>a+"\n"+b))
throw err.errors=errors,err}}$activatePlugin(name){name=normalizeServiceName(name)
var app=this,options=this.serviceDefinitions[name],setup=options.setup
if(!setup&&name.endsWith("Options"))return options
var optionsName=name+"Options"
this.serviceDefinitions[optionsName]&&(options=this.serviceDefinitions[optionsName])
var asyncResult,asyncErr,services=this.services,imports=this.imports
function addDefinition(key){var normalizedName=normalizeServiceName(key)
if(services[normalizedName]&&services[normalizedName]!=LOADING)return console.error(`Plugin ${name} attempted to redefine ${normalizedName}`)
services[normalizedName]=providedServices[key],app.serviceToPlugin[normalizedName]=options,
app.emit("service",normalizedName,providedServices[key])}services[name]=LOADING,
services[optionsName]=options,setImports(imports,this)
var syncResult=setup(options,imports,(function(err,result){
err&&(asyncErr=err),asyncResult=result||{}}))
if(asyncErr)throw asyncErr
var providedServices=asyncResult||syncResult
if(!providedServices)throw new Error(`register for "${name}" was not called.\n            Asynchronous registration of services is deprecated`)
if(providedServices[name]||/^[$_]|^\d+$/.test(name)&&(providedServices[name]={}),
Object.keys(providedServices).forEach(addDefinition),
services[name]==LOADING||!services[name])throw new Error(`${name} not provided by ${setup.packagePath||options.packagePath}`)
return services[name]}addPlugins(newPlugins,options={}){Object.keys(newPlugins||{}).forEach(key=>{
var newPlugin=newPlugins[key]
"function"==typeof newPlugin&&(newPlugin={setup:newPlugin
}),!newPlugin.provides&&newPlugin.setup&&(newPlugin.provides=newPlugin.setup.provides),
"string"==typeof newPlugin.provides&&(newPlugin.provides=[newPlugin.provides]),
newPlugin.provides&&newPlugin.provides.length?newPlugin.provides.forEach(name=>{
registerAlias(this,name,newPlugin,options.replace)
}):registerAlias(this,key,newPlugin,options.replace)})}}function createApp(config,callback){var app
try{app=new Architect(config)}catch(err){return callback(err,app)}return setTimeout((function(){try{
app.activate(),callback(null,app)}catch(err){callback(err,app)}})),app}exports.createApp=createApp,
exports.Architect=Architect,exports.$setImports=setImports}))


define("@amzn/lambda-console-ide/plugins/bootstrap.js",[],(function(require,exports,module){
var _a,__assign=this&&this.__assign||function(){return(__assign=Object.assign||function(t){
for(var s,i=1,n=arguments.length;i<n;i++)for(var p in s=arguments[i])Object.prototype.hasOwnProperty.call(s,p)&&(t[p]=s[p])
return t}).apply(this,arguments)
},__awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){function adopt(value){
return value instanceof P?value:new P((function(resolve){resolve(value)}))}
return new(P||(P=Promise))((function(resolve,reject){function fulfilled(value){try{
step(generator.next(value))}catch(e){reject(e)}}function rejected(value){try{
step(generator.throw(value))}catch(e){reject(e)}}function step(result){
result.done?resolve(result.value):adopt(result.value).then(fulfilled,rejected)}
step((generator=generator.apply(thisArg,_arguments||[])).next())}))
},__generator=this&&this.__generator||function(thisArg,body){var f,y,t,g,_={label:0,sent:function(){
if(1&t[0])throw t[1]
return t[1]},trys:[],ops:[]}
return g={next:verb(0),throw:verb(1),return:verb(2)
},"function"==typeof Symbol&&(g[Symbol.iterator]=function(){return this}),g
function verb(n){return function(v){return step([n,v])}}function step(op){
if(f)throw new TypeError("Generator is already executing.")
for(;_;)try{if(f=1,y&&(t=2&op[0]?y.return:op[0]?y.throw||((t=y.return)&&t.call(y),
0):y.next)&&!(t=t.call(y,op[1])).done)return t
switch(y=0,t&&(op=[2&op[0],t.value]),op[0]){case 0:case 1:t=op
break
case 4:return _.label++,{value:op[1],done:!1}
case 5:_.label++,y=op[1],op=[0]
continue
case 7:op=_.ops.pop(),_.trys.pop()
continue
default:if(!(t=_.trys,(t=t.length>0&&t[t.length-1])||6!==op[0]&&2!==op[0])){_=0
continue}if(3===op[0]&&(!t||op[1]>t[0]&&op[1]<t[3])){_.label=op[1]
break}if(6===op[0]&&_.label<t[1]){_.label=t[1],t=op
break}if(t&&_.label<t[2]){_.label=t[2],_.ops.push(op)
break}t[2]&&_.ops.pop(),_.trys.pop()
continue}op=body.call(thisArg,_)}catch(e){op=[6,e],y=0}finally{f=t=0}if(5&op[0])throw op[1]
return{value:op[0]?op[1]:void 0,done:!0}}},__spreadArrays=this&&this.__spreadArrays||function(){
for(var s=0,i=0,il=arguments.length;i<il;i++)s+=arguments[i].length
var r=Array(s),k=0
for(i=0;i<il;i++)for(var a=arguments[i],j=0,jl=a.length;j<jl;j++,k++)r[k]=a[j]
return r},_this=this,MESSAGE_TYPE=function(version){
return"application/x-cloud9-lite-"+version+"+json"
},IS_LOCAL=!!document.querySelector('meta[name="c9lite-local"]'),CDN=IS_LOCAL?"/static/@amzn/lambda-console-ide/build/ide":null===(_a=window.location.pathname.match(/^((?!\/index.html).)*/))||void 0===_a?void 0:_a[0],logEvent=function(){
for(var _a,args=[],_i=0;_i<arguments.length;_i++)args[_i]=arguments[_i]
return(_a=window.bus).emit.apply(_a,__spreadArrays(["c9lite.metrics","logEvent"],args))
},bootstrapRequire=function(){var globalRequire=window.requirejs
if(IS_LOCAL){var requireConfig=require.getConfig()
globalRequire.resetConfig({assetUrl:requireConfig.baseUrl,MODULE_LOAD_URL:requireConfig.baseUrl,
transform:"amd",useDevBundle:!0})
}else globalRequire.resetConfig(),globalRequire.MODULE_LOAD_URL=CDN+"/modules"
},parseQuery=function(){var _a,_b
return{
origin:null===(_a=/origin=([^&?#=]+)|$/.exec(window.location.search))||void 0===_a?void 0:_a[1],
projectName:null===(_b=/fn=([^&?#=]+)|$/.exec(window.location.search))||void 0===_b?void 0:_b[1],
readonly:/readonly=true/.test(window.location.search)}},init=function(){
return __awaiter(_this,void 0,void 0,(function(){var busModule,initRes
return __generator(this,(function(_a){switch(_a.label){case 0:
return IS_LOCAL?[3,2]:[4,require(["js-polyfills/polyfill.min"])]
case 1:_a.sent(),_a.label=2
case 2:return[4,require(["@amzn/lambda-console-ide/plugins/utils/bus"])]
case 3:
busModule=_a.sent()[0],window.bus=new busModule.PostMessageBus(window,window.parent,window.query.origin,MESSAGE_TYPE("v2")),
_a.label=4
case 4:
return _a.trys.push([4,6,,7]),[4,Promise.race([window.bus.call("init",{}),new Promise((function(_,reject){
return setTimeout(reject,1e4)}))])]
case 5:return initRes=_a.sent(),logEvent("ideInitDone",!0),window.c9l=initRes,[3,7]
case 6:return _a.sent(),logEvent("ideInitDone",!1),[3,7]
case 7:return[2]}}))}))},getSettings=function(_a){
var dark=_a.dark,defaultFile=_a.defaultFile,fullscreen=_a.fullscreen,projectName=_a.projectName,readonly=_a.readonly,staticPrefix=IS_LOCAL?CDN:window.location.protocol+"//"+window.location.host+CDN
return{CORSWorkerPrefix:staticPrefix+"/build/worker",dashboardUrl:"",
defaultTheme:dark?"flat-dark":"flat-light",environmentDir:"/",environmentId:"/",
environmentName:projectName,home:"/",installPath:"/",manifest:{},packed:!0,platform:"linux",
previewUrl:"",project:{},projectName:projectName,readonly:readonly,standalone:!0,
staticPrefix:staticPrefix,
themePrefix:staticPrefix+"/build/skin/@amzn/lambda-console-ide/configs/default",user:{},
workerPrefix:staticPrefix+"/build/worker",defaultFile:defaultFile,fullscreen:fullscreen}
},getPlugins=function(settings){return __awaiter(_this,void 0,void 0,(function(){var config,plugins
return __generator(this,(function(_a){switch(_a.label){case 0:
return[4,require(["@amzn/lambda-console-ide/configs/default"])]
case 1:return config=_a.sent()[0],plugins=config(settings),window.plugins=plugins,[2,plugins]}}))}))
},resolveConfig=function(plugins){return new Promise((function(resolve,reject){
require("architect/requirejs-loader").resolveConfig(plugins,(function(err,config){
err?reject(err):resolve(config)}))}))},createApp=function(config){
return new Promise((function(resolve,reject){
var errored,app=require("architect").createApp(config,(function(err){err&&(errored=!0,reject(err))
}))
app.on("error",(function(err){logEvent("ideAppError"),errored||reject(err)
})),app.on("service",(function(name,plugin){plugin.name||(plugin.name=name)
})),app.on("ready",(function(){logEvent("ideAppReady"),resolve(app)}))}))
},postProcessAppServices=function(app){
window.app=app.services,Object.keys(window.app).forEach((function(n){
/[^\w]/.test(n)&&(window.app[n.replace(/[^\w]/,"_")+"_"]=window.app[n])}))
},waitForVfs=function(app){return new Promise((function(resolve){var vfs=app.services.vfs
vfs.connected?resolve():vfs.once("connect",resolve)}))},waitForSettings=function(app){
return new Promise((function(resolve){var settings=app.services.settings
settings.inited?resolve():settings.once("read",resolve)}))},waitForTheme=function(app){
return new Promise((function(resolve){var layout=app.services.layout
!layout||layout.hasTheme?resolve():layout.once("eachTheme",resolve)}))},hideLoader=function(){
var _a,loaderContainer=document.getElementById("loadingcontainer")
null===(_a=null==loaderContainer?void 0:loaderContainer.parentNode)||void 0===_a||_a.removeChild(loaderContainer),
document.body.className=document.body.className.replace("loading","")}
function load(){return __awaiter(this,void 0,void 0,(function(){
var start,settings,plugins,config,app,_i,waiters_1,totalLoadTime,c9
return __generator(this,(function(_a){switch(_a.label){case 0:
return document.body.className="loading",
start=Date.now(),bootstrapRequire(),window.query=parseQuery(),[4,init()]
case 1:return _a.sent(),settings=getSettings(__assign(__assign({},window.query),window.c9l)),
[4,getPlugins(settings)]
case 2:return plugins=_a.sent(),[4,resolveConfig(plugins)]
case 3:return config=_a.sent(),[4,createApp(config)]
case 4:
app=_a.sent(),postProcessAppServices(app),_i=0,waiters_1=[waitForVfs,waitForSettings,waitForTheme],
_a.label=5
case 5:return _i<waiters_1.length?[4,(0,waiters_1[_i])(app)]:[3,8]
case 6:_a.sent(),_a.label=7
case 7:return _i++,[3,5]
case 8:
return totalLoadTime=Date.now()-start,(c9=app.services.c9).ready(),c9.totalLoadTime=totalLoadTime,
app.services.c9liteMetrics.submitCustomTimer("ideLoad",totalLoadTime),window.bus.emit("ready"),
hideLoader(),[2]}}))}))}load()}))


define("@c9/aceterm",[],(function(){return require("@c9/aceterm/src/aceterm")})),
define("tern",[],(function(){return require("tern/lib/tern")})),define("base64-js",[],(function(){
return require("base64-js/index")})),define("jsonm",[],(function(){
return require("jsonm/build/node/index")})),define("js-beautify",[],(function(){
return require("js-beautify/js/index")})),define("source-map",[],(function(){
return require("source-map/lib/source-map")})),define("lodash",[],(function(){
return require("lodash/lodash")})),define("lodash.isequal",[],(function(){
return require("lodash.isequal/index")})),define("@c9/msgpack-js",[],(function(){
return require("@c9/msgpack-js/msgpack")})),define("@c9/smith",[],(function(){
return require("@c9/smith/smith")})),define("@c9/kaefer",[],(function(){
return require("@c9/kaefer/index")})),define("@c9/vscode-source",[],(function(){
return require("@c9/vscode-source/out/main")})),define("engine.io-client",[],(function(){
return require("engine.io-client/lib/index")})),define("secure-json-parse",[],(function(){
return require("secure-json-parse/index")})),define("vscode-uri",[],(function(){
return require("vscode-uri/lib/umd/index")})),define("vscode-languageserver-types",[],(function(){
return require("vscode-languageserver-types/lib/umd/main")})),define("architect",[],(function(){
return require("architect/architect")})),define("cloudformation-schema-js-yaml",[],(function(){
return require("cloudformation-schema-js-yaml/index")})),define("js-yaml",[],(function(){
return require("js-yaml/index")})),define("xss",[],(function(){return require("xss/lib/index")})),
define("cssfilter",[],(function(){return require("cssfilter/lib/index")
})),define("commander",[],(function(){return require("commander/index")
})),define("mocha",[],(function(){return require("mocha/index")})),define("chai",[],(function(){
return require("chai/index")})),define("js-polyfills",[],(function(){
return require("js-polyfills/polyfill")})),define("crypto-js",[],(function(){
return require("crypto-js/index")})),define("immutable",[],(function(){
return require("immutable/dist/immutable")})),define("localforage",[],(function(){
return require("localforage/dist/localforage")}))


require("@amzn/lambda-console-ide/plugins/bootstrap.js")

