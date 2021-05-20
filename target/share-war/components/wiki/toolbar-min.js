(function(){var b=YAHOO.util.Dom,t=YAHOO.util.Event,m=YAHOO.util.Element;var k=function(){};Alfresco.WikiToolbar=function(u){this.name="Alfresco.WikiToolbar";this.id=u;Alfresco.util.YUILoaderHelper.require(["button","container","connection"],this.onComponentsLoaded,this);this.widgets={};this.popups={};YAHOO.Bubbling.on("userAccess",this.onUserAccess,this);YAHOO.Bubbling.on("deactivateAllControls",this.onDeactivateAllControls,this);return this};Alfresco.WikiToolbar.prototype={options:{siteId:null,title:null,showBackLink:false,exists:true},widgets:null,popups:null,setOptions:function q(u){this.options=YAHOO.lang.merge(this.options,u);return this},setMessages:function d(u){Alfresco.util.addMessages(u,this.name);k=this._msg;return this},onComponentsLoaded:function g(){t.onContentReady(this.id,this.onReady,this,true)},onReady:function o(){this.widgets.newPageButton=Alfresco.util.createYUIButton(this,"create-button",this.onNewPageClick,{disabled:true,value:"create"});this.widgets.deletePageButton=Alfresco.util.createYUIButton(this,"delete-button",this.onDeleteClick,{disabled:true,value:"delete"});this.widgets.renamePageButton=Alfresco.util.createYUIButton(this,"rename-button",this.onRenameClick,{disabled:true,value:"edit"});this.widgets.rssFeedButton=Alfresco.util.createYUIButton(this,"rssFeed-button",null,{type:"link"});if(this.widgets.rssFeedButton!==null){var v=YAHOO.lang.substitute(Alfresco.constants.URL_FEEDSERVICECONTEXT+"components/wiki/rss?site={site}",{site:encodeURIComponent(this.options.siteId)});this.widgets.rssFeedButton.set("href",v)}var w=b.get(this.id+"-renamepanel"),z=w.cloneNode(true);w.parentNode.removeChild(w);this.popups.renamePanel=Alfresco.util.createYUIPanel(z,{width:"320px"});var y=Alfresco.util.createYUIButton(this,"rename-save-button",null,{type:"submit"});var u=new Alfresco.forms.Form(this.id+"-renamePageForm");u.addValidation(this.id+"-renameTo",Alfresco.forms.validation.mandatory,null,"blur");u.addValidation(this.id+"-renameTo",Alfresco.forms.validation.wikiTitle,null,"keyup");u.addValidation(this.id+"-renameTo",Alfresco.forms.validation.length,{max:256,crop:true},"keyup",this._msg("Alfresco.forms.validation.length.message"));u.setSubmitElements(y);u.ajaxSubmitMethod=Alfresco.util.Ajax.POST;u.doBeforeAjaxRequest={fn:function x(A,C){var B=A.dataObj.name;A.dataObj.name=B.replace(/\s+/g,"_");return true},scope:this};u.setAJAXSubmit(true,{successCallback:{fn:this.onPageRenamed,scope:this},failureCallback:{fn:this.onPageRenameFailed,scope:this}});u.setSubmitAsJSON(true);u.applyTabFix();u.init();YAHOO.Bubbling.on("deletePage",this.onDeletePage,this)},onUserAccess:function a(y,w){var B=w[1];if((B!==null)&&(B.userAccess!==null)){var A,u,v;for(v in this.widgets){if(this.widgets.hasOwnProperty(v)){A=this.widgets[v];if(A.get("srcelement").className!="no-access-check"&&(!(A._button!=null&&A._button.className=="no-access-check"))){A.set("disabled",false);if(typeof A.get("value")=="string"){u=A.get("value").split(",");for(var x=0,z=u.length;x<z;x++){if(!B.userAccess[u[x]]){A.set("disabled",true);break}}}}}}}},onDeactivateAllControls:function n(w,v){var u,x,y=Alfresco.util.disableYUIButton;for(u in this.widgets){if(this.widgets.hasOwnProperty(u)){y(this.widgets[u])}}},onNewPageClick:function e(v){var u=Alfresco.constants.URL_PAGECONTEXT+"site/"+encodeURIComponent(this.options.siteId)+"/wiki-create";if(!this.options.showBackLink){u+="?listViewLinkBack=true"}window.location.href=u},onDeletePage:function j(v,u){var w=u[1].title;if(w){this.options.title=w;this._deletePage()}},_deletePage:function l(){var u=this;Alfresco.util.PopupManager.displayPrompt({title:this._msg("panel.confirm.header"),text:this._msg("panel.confirm.delete-msg"),buttons:[{text:this._msg("button.delete"),handler:function(){this.destroy();u.onConfirm()}},{text:this._msg("button.cancel"),handler:function(){this.destroy()},isDefault:true}]});var v=b.getElementsByClassName("yui-button","span","prompt");b.addClass(v[0],"alf-primary-button")},onConfirm:function f(u){Alfresco.util.Ajax.request({method:Alfresco.util.Ajax.DELETE,url:Alfresco.constants.PROXY_URI+"slingshot/wiki/page/"+encodeURIComponent(this.options.siteId)+"/"+Alfresco.util.encodeURIPath(this.options.title)+"?page=wiki",successCallback:{fn:this.onPageDeleted,scope:this},failureMessage:this._msg("load.fail")})},onPageDeleted:function s(v){var u=Alfresco.constants.URL_PAGECONTEXT+"site/"+encodeURIComponent(this.options.siteId)+"/wiki";if(window.location.pathname==u){window.location.reload(true)}else{window.location=u}},onRenameClick:function i(w){this.popups.renamePanel.show();var v=b.get(this.id+"-renameTo");v.value=this.options.title.replace(/_/g," ");var u=b.get(this.id+"-renamePageForm");Alfresco.util.caretFix(u);if(!this.escapeListener){this.escapeListener=new YAHOO.util.KeyListener(document,{keys:YAHOO.util.KeyListener.KEY.ESCAPE},{fn:function x(z,y){Alfresco.util.undoCaretFix(u);this.popups.renamePanel.hide()},scope:this,correctScope:true})}this.escapeListener.enable();v.focus()},onPageRenamed:function c(w){var u=YAHOO.lang.JSON.parse(w.serverResponse.responseText);if(u){if(!YAHOO.lang.isUndefined(u.title)){window.location=Alfresco.constants.URL_PAGECONTEXT+"site/"+encodeURIComponent(this.options.siteId)+"/wiki-page?title="+encodeURIComponent(u.title)}else{var v="Rename failed: ";if(!YAHOO.lang.isUndefined(u.error)){v+=u.error}else{v+="Unknown error occurred."}Alfresco.util.PopupManager.displayPrompt({text:v})}}},onPageRenameFailed:function p(z,y){var x=this;if(z.serverResponse.status===404&&!this.options.exists){var v=Alfresco.constants.URL_PAGECONTEXT+"site/"+encodeURIComponent(this.options.siteId)+"/wiki-page?title="+encodeURIComponent(z.config.dataObj.name);if(!this.options.showBackLink){v+="?listViewLinkBack=true"}window.location.href=v}else{var w="rename.failure",u=w+"."+z.serverResponse.status,A=k(u,z.config.dataObj.name);if(u==A){A=k(w,z.config.dataObj.name)}Alfresco.util.PopupManager.displayPrompt({title:k("rename.failure.title"),text:A,buttons:[{text:k("button.ok"),handler:function(){this.destroy();b.get(x.id+"-renameTo").focus()},isDefault:true}]})}},onDeleteClick:function h(u){this._deletePage()},_msg:function r(u){return Alfresco.util.message.call(this,u,"Alfresco.WikiToolbar",Array.prototype.slice.call(arguments).slice(1))}}})();