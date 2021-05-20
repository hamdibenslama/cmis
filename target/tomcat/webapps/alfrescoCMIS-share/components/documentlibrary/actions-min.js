(function(){var V=YAHOO.util.Dom,T=YAHOO.util.Event;var R=Alfresco.util.encodeHTML,L=Alfresco.util.combinePaths,K=Alfresco.util.siteURL,Z=Alfresco.util.isValueSet;var l;Alfresco.doclib.Actions={};Alfresco.doclib.Actions.prototype={actionsView:null,onRegisterAction:function D(aj,ai){var ak=ai[1];if(ak&&Z(ak.actionName)&&Z(ak.fn)){this.registerAction(ak.actionName,ak.fn)}else{Alfresco.logger.error("DL_onRegisterAction: Custom action registion invalid: "+ak)}},registerAction:function d(ai,aj){if(Z(ai)&&Z(aj)){this.constructor.prototype[ai]=aj;return true}return false},renderAction:function Y(aj,am){var ai=Alfresco.constants.URL_RESCONTEXT+"components/documentlibrary/actions/",ao='style="background-image:url('+ai+'{icon}-16.png)" ',al={link:'<div class="{id}{additionalCssClasses}"><a title="{label}" class="simple-link" href="{href}" '+ao+"{target}><span>{label}</span></a></div>",pagelink:'<div class="{id}{additionalCssClasses}"><a title="{label}" class="simple-link" href="{pageUrl}" '+ao+"><span>{label}</span></a></div>",javascript:'<div class="{id}{additionalCssClasses}" id="{jsfunction}"><a title="{label}" class="action-link" href="#"'+ao+"><span>{label}</span></a></div>"};am.actionParams[aj.id]=aj.params;var ak={id:aj.id,icon:aj.icon,label:R(Alfresco.util.substituteDotNotation(this.msg(aj.label),am)),additionalCssClasses:aj.additionalCssClasses?" "+aj.additionalCssClasses:""};if(aj.lastActionInSubgroup){ak.additionalCssClasses=" alf-action-group-end"}if(aj.type==="link"){if(aj.params.href){ak.href=Alfresco.util.substituteDotNotation(aj.params.href,am);ak.target=aj.params.target?'target="'+aj.params.target+'"':""}else{Alfresco.logger.warn("Action configuration error: Missing 'href' parameter for actionId: ",aj.id)}}else{if(aj.type==="pagelink"){if(aj.params.page){ak.pageUrl=Alfresco.util.substituteDotNotation(aj.params.page,am);if(aj.params.page.charAt(0)!=="{"){var an=Z(am.location.site)?am.location.site.name:null;ak.pageUrl=K(ak.pageUrl,{site:an})}}else{Alfresco.logger.warn("Action configuration error: Missing 'page' parameter for actionId: ",aj.id)}}else{if(aj.type==="javascript"){if(aj.params["function"]){ak.jsfunction=aj.params["function"]}else{Alfresco.logger.warn("Action configuration error: Missing 'function' parameter for actionId: ",aj.id)}}}}return YAHOO.lang.substitute(al[aj.type],ak)},getActionUrls:function w(ao,aj){var al=ao.jsNode,ar=al.isLink?al.linkedNode.nodeRef:al.nodeRef,ar=al.isLink&&!Z(ar)?"invalidlink":ar,ap=ar.toString(),ai=ar.uri,an=al.contentURL,at=ao.workingCopy||{},ak=Z(ao.location.site)?ao.location.site.name:null,aq=Alfresco.util.bind(function(au){return Alfresco.util.siteURL(au,{site:YAHOO.lang.isString(aj)?aj:ak})},this),am={downloadUrl:L(Alfresco.constants.PROXY_URI,an)+"?a=true",viewUrl:L(Alfresco.constants.PROXY_URI,an)+'" target="_blank',documentDetailsUrl:aq("document-details?nodeRef="+ap),folderDetailsUrl:aq("folder-details?nodeRef="+ap),editMetadataUrl:aq("edit-metadata?nodeRef="+ap),inlineEditUrl:aq("inline-edit?nodeRef="+ap),managePermissionsUrl:aq("manage-permissions?nodeRef="+ap),manageTranslationsUrl:aq("manage-translations?nodeRef="+ap),workingCopyUrl:aq("document-details?nodeRef="+(at.workingCopyNodeRef||ap)),workingCopySourceUrl:aq("document-details?nodeRef="+(at.sourceNodeRef||ap)),cloudViewUrl:L(Alfresco.constants.URL_SERVICECONTEXT,"cloud/cloudUrl?nodeRef="+ap)};am.sourceRepositoryUrl=this.viewInSourceRepositoryURL(ao,am)+'" target="_blank';return am},getAction:function ah(aj,ai,an){var ap=ai.className.match(/([^\s])*/)[0];var am=Alfresco.util.findInArray(aj.actions,ap,"id")||{};if(an===false){return am}else{am=Alfresco.util.deepCopy(am);var ao=am.params||{};for(var ak in ao){ao[ak]=YAHOO.lang.substitute(ao[ak],aj,function al(ar,at,aq){return Alfresco.util.findValueByDotNotation(aj,ar)})}return am}},getParentNodeRef:function ag(aj){var am=null;if(YAHOO.lang.isArray(aj)){try{am=this.doclistMetadata.parent.nodeRef}catch(an){am=null}if(am===null){for(var al=1,ak=aj.length,ai=true;al<ak&&ai;al++){ai=(aj[al].parent.nodeRef==aj[al-1].parent.nodeRef)}am=ai?aj[0].parent.nodeRef:this.doclistMetadata.container}}else{am=aj.parent.nodeRef}return am},onActionDetails:function M(al){var ar=this,an=al.nodeRef,ak=al.jsNode;var ap=function ai(au,av){var at='<span class="light">'+R(al.displayName)+"</span>";Alfresco.util.populateHTML([av.id+"-dialogTitle",ar.msg("edit-details.title",at)]);this.widgets.editMetadata=Alfresco.util.createYUIButton(av,"editMetadata",null,{type:"link",label:ar.msg("edit-details.label.edit-metadata"),href:K("edit-metadata?nodeRef="+an)})};var aj=YAHOO.lang.substitute(Alfresco.constants.URL_SERVICECONTEXT+"components/form?itemKind={itemKind}&itemId={itemId}&destination={destination}&mode={mode}&submitType={submitType}&formId={formId}&showCancelButton=true",{itemKind:"node",itemId:an,mode:"edit",submitType:"json",formId:"doclib-simple-metadata"});var aq=new Alfresco.module.SimpleDialog(this.id+"-editDetails-"+Alfresco.util.generateDomId());aq.setOptions({width:"auto",zIndex:1001,templateUrl:aj,actionUrl:null,destroyOnHide:true,doBeforeDialogShow:{fn:ap,scope:this},onSuccess:{fn:function am(au){var aw="components/documentlibrary/data";if(Z(this.options.siteId)){aw+="/site/"+encodeURIComponent(this.options.siteId)}Alfresco.util.Ajax.request({url:L(Alfresco.constants.URL_SERVICECONTEXT,aw,"/node/",ak.nodeRef.uri)+"?view="+this.actionsView,successCallback:{fn:function av(ay){var ax=ay.json.item;ax.jsNode=new Alfresco.util.Node(ay.json.item.node);YAHOO.Bubbling.fire(ax.node.isContainer?"folderRenamed":"fileRenamed",{file:ax});YAHOO.Bubbling.fire("tagRefresh");Alfresco.util.PopupManager.displayMessage({text:this.msg("message.details.success")});this._updateDocList.call(this)},scope:this},failureCallback:{fn:function at(ax){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.details.failure")})},scope:this}})},scope:this},onFailure:{fn:function ao(at){var au=this.msg("message.details.failure");if(at.json&&at.json.message.indexOf("Failed to persist field 'prop_cm_name'")!==-1){au=this.msg("message.details.failure.name")}Alfresco.util.PopupManager.displayMessage({text:au})},scope:this}}).show()},onActionLocate:function ae(aj){var al=aj.jsNode,an=aj.location.path,ai=aj.location.repoPath,ak,am=Z(aj.location.site)?aj.location.site.name:null;if(al.isLink){ak=Z(al.linkedNode.properties)?al.linkedNode.properties.name:null;if(ak===null){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.actions.failure.locate")})}}else{ak=aj.displayName}if(Z(this.options.siteId)&&am!==this.options.siteId){window.location=K((am===null?"repository":"documentlibrary")+"?file="+encodeURIComponent(ak)+"&path="+encodeURIComponent(an),{site:am})}else{if((Alfresco.constants.PAGECONTEXT=="shared"&&ai!="/Shared")||(Alfresco.constants.PAGECONTEXT=="mine"&&ai!="/")){window.location="/share/page/repository?file="+encodeURIComponent(ak)+"&path="+encodeURIComponent(ai)}else{this.options.highlightFile=ak;YAHOO.Bubbling.fire("changeFilter",{filterId:"path",filterData:an})}}},onActionDelete:function W(am){var ar=this,aj=am.jsNode,ap=aj.isContainer?"folder":"document",au=am.displayName,al=(this.options.syncMode==="CLOUD"),at=0;var ak=(aj.hasAspect("sync:syncSetMemberNode")&&Z(aj.properties))?aj.properties["sync:directSync"]==="true":false;var ai="";if(!al&&ak){ai='<div><input type="checkbox" id="requestDeleteRemote" class="requestDeleteRemote-checkBox"><span class="requestDeleteRemote-text">'+this.msg("sync.remove."+ap+".from.cloud",au)+"</span></div>"}var aw=this.msg("message.confirm.delete",au);if(this.fullscreen!==undefined&&(this.fullscreen.isWindowOnly||V.hasClass(this.id,"alf-fullscreen"))){at=1000}var av=undefined;if(V.hasClass(this.id,"alf-true-fullscreen")){av=V.get(this.id)}var aq=[{text:this.msg("button.delete"),handler:function ao(){var ax=al?false:V.getAttribute("requestDeleteRemote","checked");this.destroy();if(ak){ar._onActionDeleteSyncConfirm.call(ar,am,ax)}else{ar._onActionDeleteConfirm.call(ar,am)}}},{text:this.msg("button.cancel"),handler:function an(){this.destroy()},isDefault:true}];Alfresco.util.PopupManager.displayPrompt({title:this.msg("actions."+ap+".delete"),text:aw+ai,noEscape:true,buttons:aq,zIndex:at},av)},_onActionDeleteSyncConfirm:function h(am,ao){var ai=am.jsNode,ar=am.location.path,al=am.location.file,aj=L(ar,al),ap=am.displayName,aq=ai.nodeRef,an=this.getParentNodeRef(am);Alfresco.util.Ajax.request({url:Alfresco.constants.PROXY_URI+"enterprise/sync/syncsetmembers/"+am.jsNode.nodeRef.uri+"?requestDeleteRemote="+ao,method:Alfresco.util.Ajax.DELETE,successCallback:{fn:function ak(){YAHOO.Bubbling.fire("metadataRefresh");Alfresco.util.PopupManager.displayMessage({text:this.msg("message.unsync.success")});this._onActionDeleteConfirm.call(this,am)},scope:this},failureMessage:this.msg("message.unsync.failure")})},_onActionDeleteConfirm:function ac(al){var ai=al.jsNode,ar=al.location.path,ak=al.location.file,aj=L(ar,ak),ao=al.displayName,ap=ai.nodeRef,am=this.getParentNodeRef(al);var an={zIndex:this.fullscreen!==undefined&&(V.hasClass(this.id,"alf-true-fullscreen")||V.hasClass(this.id,"alf-fullscreen"))?1000:0,parentElement:V.hasClass(this.id,"alf-true-fullscreen")?V.get(this.id):undefined};this.modules.actions.genericAction({success:{activity:{siteId:this.options.siteId,activityType:ai.isContainer?"folder-deleted":"file-deleted",page:"documentlibrary",activityData:{fileName:ak,path:ar,nodeRef:ap.toString(),parentNodeRef:am.toString()}},event:{name:ai.isContainer?"folderDeleted":"fileDeleted",obj:{path:aj}},display:an,message:this.msg("message.delete.success",ao),callback:{fn:function aq(at,au){if(this.totalRecords){this.totalRecords-=at.json.successCount}},scope:this}},failure:{display:an,message:this.msg("message.delete.failure",ao)},webscript:{method:Alfresco.util.Ajax.DELETE,name:"file/node/{nodeRef}",params:{nodeRef:ap.uri}},wait:{message:this.msg("message.multiple-delete.please-wait")}})},onActionEditOffline:function b(ai){Alfresco.logger.error("onActionEditOffline","Abstract implementation not overridden")},onlineEditMimetypes:{"application/msword":"Word.Document","application/vnd.openxmlformats-officedocument.wordprocessingml.document":"Word.Document","application/vnd.ms-word.document.macroenabled.12":"Word.Document","application/vnd.openxmlformats-officedocument.wordprocessingml.template":"Word.Document","application/vnd.ms-word.template.macroenabled.12":"Word.Document","application/vnd.ms-powerpoint":"PowerPoint.Slide","application/vnd.openxmlformats-officedocument.presentationml.presentation":"PowerPoint.Slide","application/vnd.ms-powerpoint.presentation.macroenabled.12":"PowerPoint.Slide","application/vnd.openxmlformats-officedocument.presentationml.slideshow":"PowerPoint.Slide","application/vnd.ms-powerpoint.slideshow.macroenabled.12":"PowerPoint.Slide","application/vnd.openxmlformats-officedocument.presentationml.template":"PowerPoint.Slide","application/vnd.ms-powerpoint.template.macroenabled.12":"PowerPoint.Slide","application/vnd.ms-powerpoint.addin.macroenabled.12":"PowerPoint.Slide","application/vnd.openxmlformats-officedocument.presentationml.slide":"PowerPoint.Slide","application/vnd.ms-powerpoint.slide.macroEnabled.12":"PowerPoint.Slide","application/vnd.ms-excel":"Excel.Sheet","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":"Excel.Sheet","application/vnd.openxmlformats-officedocument.spreadsheetml.template":"Excel.Sheet","application/vnd.ms-excel.sheet.macroenabled.12":"Excel.Sheet","application/vnd.ms-excel.template.macroenabled.12":"Excel.Sheet","application/vnd.ms-excel.addin.macroenabled.12":"Excel.Sheet","application/vnd.ms-excel.sheet.binary.macroenabled.12":"Excel.Sheet","application/vnd.visio":"Visio.Drawing","application/vnd.visio2013":"Visio.Drawing"},onActionEditOnline:function p(ai){if(!Z(ai.onlineEditUrl)){ai.onlineEditUrl=Alfresco.util.onlineEditUrl(this.doclistMetadata.custom.vtiServer,ai.location)}if(ai.onlineEditUrl.length>256||(encodeURI(ai.onlineEditUrl)).length>256){Alfresco.util.Ajax.request({method:Alfresco.util.Ajax.GET,url:Alfresco.constants.PROXY_URI+"/api/sites/"+ai.location.site.name,successCallback:{fn:function(aj){var an=aj.json.node.split("/").pop();var al=ai.nodeRef.split("/").pop();ai.onlineEditUrl=ai.onlineEditUrl.split(ai.location.site.name)[0]+"_IDX_SITE_"+an+"/_IDX_NODE_"+al+"/"+ai.displayName;if(ai.onlineEditUrl.length>256){var ak=ai.displayName.split(".").pop();var am=ai.displayName.split(".")[0];var ap=ai.onlineEditUrl.length-256;ai.onlineEditUrl=ai.onlineEditUrl.replace(ai.displayName,am.substring(0,am.length-ap-1)+"."+ak)}if(encodeURI(ai.onlineEditUrl).length>256){var ak=ai.displayName.split(".").pop();var am=ai.onlineEditUrl.split("/").pop();var ao=am.split(".")[0].substring(0,5)+"."+ak;ai.onlineEditUrl=ai.onlineEditUrl.replace(am,ao)}this.actionEditOnlineInternal(ai)},scope:this},failureCallback:{fn:function(aj){this.actionEditOnlineInternal(ai)},scope:this}})}else{this.actionEditOnlineInternal(ai)}},actionEditOnlineInternal:function p(ai){if(ai.onlineEditUrl.length>256||encodeURI(ai.onlineEditUrl).length>256){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.edit-online.office.path.failure")})}else{if(this._launchOnlineEditor(ai)){YAHOO.Bubbling.fire("metadataRefresh")}else{Alfresco.util.PopupManager.displayMessage({text:this.msg("message.edit-online.office.failure")})}}},_launchOnlineEditor:function F(am){var ap="SharePoint.OpenDocuments",aj=am.jsNode,an=am.location,ar=aj.mimetype,ak=null,al=null,ai={doc:"application/msword",docx:"application/vnd.openxmlformats-officedocument.wordprocessingml.document",docm:"application/vnd.ms-word.document.macroenabled.12",dotx:"application/vnd.openxmlformats-officedocument.wordprocessingml.template",dotm:"application/vnd.ms-word.template.macroenabled.12",ppt:"application/vnd.ms-powerpoint",pptx:"application/vnd.openxmlformats-officedocument.presentationml.presentation",pptm:"application/vnd.ms-powerpoint.presentation.macroenabled.12",ppsx:"application/vnd.openxmlformats-officedocument.presentationml.slideshow",ppsm:"application/vnd.ms-powerpoint.slideshow.macroenabled.12",potx:"application/vnd.openxmlformats-officedocument.presentationml.template",potm:"application/vnd.ms-powerpoint.template.macroenabled.12",ppam:"application/vnd.ms-powerpoint.addin.macroenabled.12",sldx:"application/vnd.openxmlformats-officedocument.presentationml.slide",sldm:"application/vnd.ms-powerpoint.slide.macroEnabled.12",xls:"application/vnd.ms-excel",xlsx:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",xltx:"application/vnd.openxmlformats-officedocument.spreadsheetml.template",xlsm:"application/vnd.ms-excel.sheet.macroenabled.12",xltm:"application/vnd.ms-excel.template.macroenabled.12",xlam:"application/vnd.ms-excel.addin.macroenabled.12",xlsb:"application/vnd.ms-excel.sheet.binary.macroenabled.12"};if(!Alfresco.util.validLocationForOnlineEdit(an)){Alfresco.util.PopupManager.displayPrompt({text:this.msg("actions.editOnline.invalid",an.file)});return true}if(this.onlineEditMimetypes.hasOwnProperty(ar)){ak=this.onlineEditMimetypes[ar]}else{var ao=Alfresco.util.getFileExtension(am.location.file);if(ao!==null){ao=ao.toLowerCase();if(ai.hasOwnProperty(ao)){ar=ai[ao];if(this.onlineEditMimetypes.hasOwnProperty(ar)){ak=this.onlineEditMimetypes[ar]}}}}if(ak!==null){if(!Z(am.onlineEditUrl)){am.onlineEditUrl=Alfresco.util.onlineEditUrl(this.doclistMetadata.custom.vtiServer,an)}if(YAHOO.env.ua.ie>0){return this._launchOnlineEditorIE(ap,am,ak)}if((YAHOO.env.ua.chrome>0)&&!Alfresco.util.isSharePointPluginInstalled()){var ao=Alfresco.util.getFileExtension(an.file);if(null!==ao){var aq=this.getProtocolForFileExtension(ao.toLowerCase());return this._launchOnlineEditorChrome(aq,am.onlineEditUrl)}}if(Alfresco.util.isSharePointPluginInstalled()){return this._launchOnlineEditorPlugin(am,ak)}else{Alfresco.util.PopupManager.displayPrompt({text:this.msg("actions.editOnline.failure",an.file)});return false}}return window.open(am.onlineEditUrl,"_blank")},_launchOnlineEditorChrome:function k(am,al){var ai=am+":ofe%7Cu%7C"+al;var an=false;var aj=document.createElement("input");var ak=document.body.scrollTop+10;aj.setAttribute("style","z-index: 1000; background-color: rgba(0, 0, 0, 0); border: none; outline: none; position: absolute; left: 10px; top: "+ak+"px;");document.getElementsByTagName("body")[0].appendChild(aj);aj.focus();aj.onblur=function(){an=true};location.href=ai;setTimeout(function(){aj.onblur=null;aj.remove();if(!an){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.edit-online.supported_office_version_required")})}},500)},getProtocolForFileExtension:function(aj){var ai={doc:"ms-word",docx:"ms-word",docm:"ms-word",dot:"ms-word",dotx:"ms-word",dotm:"ms-word",xls:"ms-excel",xlsx:"ms-excel",xlsb:"ms-excel",xlsm:"ms-excel",xlt:"ms-excel",xltx:"ms-excel",xltm:"ms-excel",xlsm:"ms-excel",ppt:"ms-powerpoint",pptx:"ms-powerpoint",pot:"ms-powerpoint",potx:"ms-powerpoint",potm:"ms-powerpoint",pptm:"ms-powerpoint",potm:"ms-powerpoint",pps:"ms-powerpoint",ppsx:"ms-powerpoint",ppam:"ms-powerpoint",ppsm:"ms-powerpoint",sldx:"ms-powerpoint",sldm:"ms-powerpoint"};return ai[aj]},_launchOnlineEditorIE:function N(ak,ai,aj){try{if(aj==="Visio.Drawing"){throw ("Visio should be invoked using activeXControl.EditDocument2.")}activeXControl=new ActiveXObject(ak+".3");return activeXControl.EditDocument3(window,ai.onlineEditUrl,true,aj)}catch(am){try{activeXControl=new ActiveXObject(ak+".2");return activeXControl.EditDocument2(window,ai.onlineEditUrl,aj)}catch(an){try{activeXControl=new ActiveXObject(ak+".1");return activeXControl.EditDocument(ai.onlineEditUrl,aj)}catch(al){}}}return false},_launchOnlineEditorPlugin:function j(aj,ak){var al=document.getElementById("SharePointPlugin");if(al==null&&Alfresco.util.isSharePointPluginInstalled()){var ai=null;if(YAHOO.env.ua.webkit&&Alfresco.util.isBrowserPluginInstalled("application/x-sharepoint-webkit")){ai="application/x-sharepoint-webkit"}else{ai="application/x-sharepoint"}var ap=document.createElement("object");ap.id="SharePointPlugin";ap.type=ai;ap.width=0;ap.height=0;ap.style.setProperty("visibility","hidden","");document.body.appendChild(ap);al=document.getElementById("SharePointPlugin");if(!al){return false}}try{if(ak==="Visio.Drawing"){throw ("Visio should be invoked using activeXControl.EditDocument2.")}return al.EditDocument3(window,aj.onlineEditUrl,true,ak)}catch(an){try{return al.EditDocument2(window,aj.onlineEditUrl,ak)}catch(ao){try{return al.EditDocument(aj.onlineEditUrl,ak)}catch(am){return false}}}},onActionEditOnlineAos:function Q(aj){var ai=function ak(an){var ao=JSON.parse(an.serverResponse.responseText);if(ao){var ap=ao.item.node;if(ap.isLocked){var al=Alfresco.util.arrayContains(ap.aspects,"cm:checkedOut");var aq=ap.properties["cm:lockOwner"];var am=aq.userName!==Alfresco.constants.USERNAME;if(al&&am){this._onAlreadyLockedConfirmation(aj,aq)}else{this._triggerEditOnlineAos(aj)}}else{this._triggerEditOnlineAos(aj)}}};Alfresco.util.Ajax.request({url:Alfresco.constants.PROXY_URI+"slingshot/doclib2/node/"+aj.nodeRef.replace("://","/"),successCallback:{fn:ai,scope:this}})},_onAlreadyLockedConfirmation:function X(ai,am){var al=this;Alfresco.util.PopupManager.displayPrompt({title:this.msg("message.edit-online-aos.edit_offline_locked.title",am.displayName.length>0?am.displayName:am.userName),text:this.msg("message.edit-online-aos.edit_offline_locked.message"),buttons:[{text:this.msg("message.edit-online-aos.edit_offline_locked.confirm"),handler:function ak(){this.destroy();al._triggerEditOnlineAos(ai)}},{text:this.msg("message.edit-online-aos.edit_offline_locked.cancel"),handler:function aj(){this.destroy()},isDefault:true}]})},_triggerEditOnlineAos:function S(ai){if(!Z(ai.onlineEditUrlAos)){ai.onlineEditUrlAos=Alfresco.util.onlineEditUrlAos(this.doclistMetadata.custom.aos,ai)}var al=Alfresco.util.getFileExtension(ai.location.file);al=al!=null?al.toLowerCase():al;var aj=this.getProtocolForFileExtension(al);if(aj===undefined){Alfresco.logger.error("onActionEditOnlineAos","No protocol handler available for file extension.");return}var ak=new EmbeddedOfficeLauncher();if(ak.isIOS()){this._aos_launchOfficeOnIos(ak,aj,ai.onlineEditUrlAos);return}if(!ak.isWin()&&!ak.isMac()){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.edit-online-aos.no_supported_environment")});return}if(ak.isAvailable()){this._aos_launchOfficeByPlugin(ak,ai.onlineEditUrlAos)}else{this._aos_tryToLaunchOfficeByMsProtocolHandler(ak,aj,ai.onlineEditUrlAos)}return},_aos_launchOfficeByPlugin:function A(am,ak){var aj,ao;var al=(am.isFirefox()||am.isChrome()||am.isSafari());if(!am.EditDocument(ak)){if(am.isControlNotActivated()&&al){aj=window.setInterval(function(){if(am.isControlActivated()){window.clearInterval(aj);ao.destroy();window.setTimeout(function(){if(!am.EditDocument(ak)){if(am.getLastControlResult()!==-2){var ap=am.getLastControlResult()!==false?" (Error code: "+am.getLastControlResult()+")":"";Alfresco.util.PopupManager.displayMessage({text:this.msg("message.edit-online-aos.starting_office_failed")+ap})}}else{YAHOO.Bubbling.fire("metadataRefresh")}},50)}},250);var ao=new YAHOO.widget.SimpleDialog("prompt",{close:false,constraintoviewport:true,draggable:false,effect:null,modal:true,visible:true,zIndex:9999});var an="message.edit-online-aos.plugin_blocked.body.firefox";if(am.isFirefox()){an="message.edit-online-aos.plugin_blocked.body.firefox"}else{if(am.isChrome()){an="message.edit-online-aos.plugin_blocked.body.chrome"}else{if(am.isSafari()){an="message.edit-online-aos.plugin_blocked.body.safari"}}}ao.setHeader(this.msg("message.edit-online-aos.plugin_blocked.caption"));ao.setBody(this.msg(an));ao.cfg.queueProperty("buttons",[{text:this.msg("message.edit-online-aos.plugin_blocked.button_dismiss"),handler:function(){window.clearInterval(aj);this.destroy()},isDefault:true}]);ao.render(document.body);ao.center();ao.show()}else{if(am.getLastControlResult()!==-2){var ai=am.getLastControlResult()!==false?" (Error code: "+am.getLastControlResult()+")":"";Alfresco.util.PopupManager.displayMessage({text:this.msg("message.edit-online-aos.starting_office_failed")+ai})}}}else{YAHOO.Bubbling.fire("metadataRefresh")}},_aos_tryToLaunchOfficeByMsProtocolHandler:function aa(ao,am,al){var ai=am+":ofe%7Cu%7C"+al;var an=false;var aj=document.createElement("input");var ak=document.body.scrollTop+10;aj.setAttribute("style","z-index: 1000; background-color: rgba(0, 0, 0, 0); border: none; outline: none; position: absolute; left: 10px; top: "+ak+"px;");document.getElementsByTagName("body")[0].appendChild(aj);aj.focus();aj.onblur=function(){an=true};aj.context=this;location.href=ai;setTimeout(function(){aj.onblur=null;aj.remove();if(!an){Alfresco.util.PopupManager.displayMessage({text:aj.context.msg("message.edit-online-aos.supported_office_version_required")})}},500)},_aos_launchOfficeOnIos:function y(am,ak,aj){var ai=ak+":ofe%7Cu%7C"+am.encodeUrl(aj);var al=document.createElement("iframe");al.setAttribute("style","display: none; height: 0; width: 0;");document.getElementsByTagName("body")[0].appendChild(al);al.src=ai},getProtocolForFileExtension:function(aj){var ai={doc:"ms-word",docx:"ms-word",docm:"ms-word",dot:"ms-word",dotx:"ms-word",dotm:"ms-word",xls:"ms-excel",xlsx:"ms-excel",xlsb:"ms-excel",xlsm:"ms-excel",xlt:"ms-excel",xltx:"ms-excel",xltm:"ms-excel",xlsm:"ms-excel",ppt:"ms-powerpoint",pptx:"ms-powerpoint",pot:"ms-powerpoint",potx:"ms-powerpoint",potm:"ms-powerpoint",pptm:"ms-powerpoint",potm:"ms-powerpoint",pps:"ms-powerpoint",ppsx:"ms-powerpoint",ppam:"ms-powerpoint",ppsm:"ms-powerpoint",sldx:"ms-powerpoint",sldm:"ms-powerpoint"};return ai[aj]},onActionSimpleRepoAction:function g(ao,aj){if(aj.title.indexOf("_deactivated")==-1){var am=this.getAction(ao,aj).params,at=ao.displayName,ar=["function","action","success","successMessage","failure","failureMessage","async"],ap={};for(var ai in am){if(am.hasOwnProperty(ai)&&!Alfresco.util.arrayContains(ar,ai)){ap[ai]=am[ai]}}var aq=aj.title;aj.title=aj.title+"_deactivated";var al=am.async?"async="+am.async:null;var ak={success:{event:{name:"metadataRefresh",obj:ao}},failure:{message:this.msg(am.failureMessage,at),fn:function an(){aj.title=aq},scope:this},webscript:{method:Alfresco.util.Ajax.POST,stem:Alfresco.constants.PROXY_URI+"api/",name:"actionQueue",queryString:al},config:{requestContentType:Alfresco.util.Ajax.JSON,dataObj:{actionedUponNode:ao.nodeRef,actionDefinitionName:am.action,parameterValues:ap}}};if(YAHOO.lang.isFunction(this[am.success])){ak.success.callback={fn:this[am.success],obj:ao,scope:this}}if(am.successMessage){ak.success.message=this.msg(am.successMessage,at)}if(YAHOO.lang.isFunction(this[am.failure])){ak.failure.callback={fn:this[am.failure],obj:ao,scope:this}}if(am.failureMessage){ak.failure.message=this.msg(am.failureMessage,at)}this.modules.actions.genericAction(ak)}},onActionFormDialog:function r(aj,ai){var ak=this.generateConfigForFormDialogAction(aj,ai);Alfresco.util.PopupManager.displayForm(ak)},onActionFormDialogWithSubmitDisable:function B(aj,ai){var ak=this.generateConfigForFormDialogAction(aj,ai);ak.properties.disableSubmitButton=true;Alfresco.util.PopupManager.displayForm(ak)},generateConfigForFormDialogAction:function G(ak,ai){var am=this.getAction(ak,ai),ao=am.params,al={title:this.msg(am.label)},aj=ak.displayName;delete ao["function"];var an=ao.success;delete ao.success;al.success={fn:function(ap,aq){if(YAHOO.lang.isFunction(this[an])){this[an].call(this,ap,aq)}YAHOO.Bubbling.fire("metadataRefresh",aq)},obj:ak,scope:this};if(ao.successMessage){al.successMessage=this.msg(ao.successMessage,aj);delete ao.successMessage}if(YAHOO.lang.isFunction(this[ao.failure])){al.failure={fn:this[ao.failure],obj:ak,scope:this};delete ao.failure}if(ao.failureMessage){al.failureMessage=this.msg(ao.failureMessage,aj);delete ao.failureMessage}al.properties=ao;return al},onActionUploadNewVersion:function o(ak){var aj=ak.jsNode,ao=ak.displayName,ap=aj.nodeRef,al=ak.version;if(!this.fileUpload){this.fileUpload=Alfresco.getFileUploadInstance()}var aq=this.msg("label.filter-description",ao),am="*";if(ao&&new RegExp(/[^\.]+\.[^\.]+/).exec(ao)){am="*"+ao.substring(ao.lastIndexOf("."))}if(ak.workingCopy&&ak.workingCopy.workingCopyVersion){al=ak.workingCopy.workingCopyVersion}var an=0;if(this.fullscreen!==undefined&&(this.fullscreen.isWindowOnly||V.hasClass(this.id,"alf-fullscreen"))){an=1000}var ai={updateNodeRef:ap.toString(),updateFilename:ao,updateVersion:al,overwrite:true,filter:[{description:aq,extensions:am}],mode:this.fileUpload.MODE_SINGLE_UPDATE,onFileUploadComplete:{fn:this.onNewVersionUploadComplete,scope:this},newVersion:true,jsNode:aj};this.fileUpload.options.zIndex=an;if(Z(this.options.siteId)){ai.siteId=this.options.siteId;ai.containerId=this.options.containerId}this.fileUpload.show(ai)},_uploadComplete:function U(ai,am){var an=ai.successful.length,aj,al;if(an>0){if(an<(this.options.groupActivitiesAt||5)){for(var ak=0;ak<an;ak++){al=ai.successful[ak];aj={fileName:al.fileName,nodeRef:al.nodeRef};this.modules.actions.postActivity(this.options.siteId,"file-"+am,"document-details",aj)}}else{aj={fileCount:an,path:this.currentPath,parentNodeRef:this.doclistMetadata.parent.nodeRef};this.modules.actions.postActivity(this.options.siteId,"files-"+am,"documentlibrary",aj)}}},onFileUploadComplete:function t(ai){this._uploadComplete(ai,"added")},onNewVersionUploadComplete:function C(ai){this._uploadComplete(ai,"updated")},onActionCancelEditing:function n(aj){var ai=aj.displayName;this.modules.actions.genericAction({success:{event:{name:"metadataRefresh"},message:this.msg("message.edit-cancel.success",ai)},failure:{message:this.msg("message.edit-cancel.failure",ai)},webscript:{method:Alfresco.util.Ajax.POST,name:"cancel-checkout/node/{nodeRef}",params:{nodeRef:aj.jsNode.nodeRef.uri}}});YAHOO.Bubbling.fire("editingCanceled",{record:aj})},onActionUnlockDocument:function af(aj){var ai=aj.displayName;this.modules.actions.genericAction({success:{event:{name:"metadataRefresh"},message:this.msg("message.unlock-document.success",ai)},failure:{message:this.msg("message.unlock-document.failure",ai)},webscript:{method:Alfresco.util.Ajax.POST,name:"unlock-document/node/{nodeRef}",params:{nodeRef:aj.jsNode.nodeRef.uri}}})},onActionCopyTo:function m(ai){this._copyMoveTo("copy",ai)},onActionLinkTo:function m(ai){this._copyMoveTo("link",ai)},onActionMoveTo:function i(ai){this._copyMoveTo("move",ai)},onActionUnzipTo:function c(ai){this._copyMoveTo("unzip",ai)},_copyMoveTo:function J(am,ak){if(!am in {copy:true,move:true,unzip:true}){throw new Error("'"+am+"' is not a valid Copy/Move to mode.")}if(!this.modules.copyMoveTo){this.modules.copyMoveTo=new Alfresco.module.DoclibCopyMoveTo(this.id+"-copyMoveTo")}var al=Alfresco.module.DoclibGlobalFolder;var ai=[al.VIEW_MODE_RECENT_SITES,al.VIEW_MODE_FAVOURITE_SITES,al.VIEW_MODE_SITE,al.VIEW_MODE_SHARED];if(this.options.repositoryBrowsing===true){ai.push(al.VIEW_MODE_REPOSITORY)}ai.push(al.VIEW_MODE_USERHOME);var an=0;if(this.fullscreen!==undefined&&(this.fullscreen.isWindowOnly||V.hasClass(this.id,"alf-fullscreen"))){an=1000}var aj=undefined;if(V.hasClass(this.id,"alf-true-fullscreen")){aj=V.get(this.id)}this.modules.copyMoveTo.setOptions({allowedViewModes:ai,mode:am,siteId:this.options.siteId,containerId:this.options.containerId,path:this.currentPath,files:ak,rootNode:this.options.repositoryBrowsing?this.modules.copyMoveTo.options.rootNode:this.options.rootNode,repositoryRoot:this.options.repositoryRoot,parentId:this.getParentNodeRef(ak),zIndex:an,parentElement:aj?aj:undefined}).showDialog()},onActionAssignWorkflow:function e(aj){var an="",ai=this.getParentNodeRef(aj);if(YAHOO.lang.isArray(aj)){for(var al=0,ak=aj.length;al<ak;al++){an+=(al===0?"":",")+aj[al].nodeRef}}else{an=aj.nodeRef}var am={selectedItems:an};if(ai){am.destination=ai}Alfresco.util.navigateTo(K("start-workflow"),"POST",am)},onActionManagePermissions:function P(ai){if(!this.modules.permissions){this.modules.permissions=new Alfresco.module.DoclibPermissions(this.id+"-permissions")}this.modules.permissions.setOptions({siteId:this.options.siteId,containerId:this.options.containerId,path:this.currentPath,files:ai}).showDialog()},onActionTakeOwnership:function f(am,al){var ap=this,ak=am.jsNode,an=ak.isContainer?"folder":"document",at=am.displayName,aq=0;var aw=this.msg("message.confirm.take-ownership",at);if(this.fullscreen!==undefined&&(this.fullscreen.isWindowOnly||V.hasClass(this.id,"alf-fullscreen"))){aq=1000}var au=undefined;var aj=V.get(this.id);var ai=navigator.userAgent.toLowerCase();if((ai.indexOf("gecko")!=-1||ai.indexOf("safari")!=-1)&&ai.indexOf("chrome")==-1){au=aj}var ao=[{text:this.msg("button.take-ownership"),handler:function ar(){this.destroy();ap.onActionSimpleRepoAction.call(ap,am,al)}},{text:this.msg("button.cancel"),handler:function av(){this.destroy()},isDefault:true}];Alfresco.util.PopupManager.displayPrompt({title:this.msg("message.confirm.take-ownership.title"),text:aw,noEscape:true,buttons:ao})},onActionManageAspects:function v(ai){if(!this.modules.aspects){this.modules.aspects=new Alfresco.module.DoclibAspects(this.id+"-aspects")}this.modules.aspects.setOptions({file:ai}).show()},onActionChangeType:function u(am){var ai=am.jsNode,an=ai.type,ap=am.displayName,aj=Alfresco.constants.PROXY_URI+L("slingshot/doclib/type/node",ai.nodeRef.uri);var aq=function al(at){at.addValidation(this.id+"-changeType-type",function ar(az,av,ay,ax,au,aw){return az.options[az.selectedIndex].value!=="-"},null,"change",null,{validationType:"mandatory"})};this.modules.changeType=new Alfresco.module.SimpleDialog(this.id+"-changeType").setOptions({width:"30em",templateUrl:Alfresco.constants.URL_SERVICECONTEXT+"modules/documentlibrary/change-type?currentType="+encodeURIComponent(an),actionUrl:aj,doSetupFormsValidation:{fn:aq,scope:this},firstFocus:this.id+"-changeType-type",onSuccess:{fn:function ao(ar){YAHOO.Bubbling.fire("metadataRefresh",{highlightFile:ap});Alfresco.util.PopupManager.displayMessage({text:this.msg("message.change-type.success",ap)})},scope:this},onFailure:{fn:function ak(ar){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.change-type.failure",ap)})},scope:this}});this.modules.changeType.show()},viewInSourceRepositoryURL:function s(ak,am){var al=ak.node,aj=ak.location.repositoryId,ai=this.options.replicationUrlMapping,an;if(!aj||!ai||!ai[aj]){return"#"}an=al.isContainer?am.folderDetailsUrl:am.documentDetailsUrl;an=an.substring(Alfresco.constants.URL_CONTEXT.length);return L(ai[aj],"/",an)},onActionCloudSync:function ab(ai){if(l){l.destroy()}l=new Alfresco.module.DoclibCloudFolder(this.id+"-cloud-folder");var aj=this;YAHOO.Bubbling.on("folderSelected",function ak(am,al){this.updateSyncOptions();Alfresco.util.Ajax.jsonPost({url:Alfresco.constants.PROXY_URI+"enterprise/sync/syncsetdefinitions",dataObj:YAHOO.lang.merge(this.options.syncOptions,{memberNodeRefs:aj.getMemberNodeRefs(this.options.files),remoteTenantId:this.options.targetNetwork,targetFolderNodeRef:al[1].selectedFolder.nodeRef}),successCallback:{fn:function an(){YAHOO.Bubbling.fire("metadataRefresh");Alfresco.util.PopupManager.displayMessage({text:this.msg("message.sync.success")})},scope:this},failureMessage:this.msg("message.sync.failure")})},l);if(!this.modules.cloudAuth){this.modules.cloudAuth=new Alfresco.module.CloudAuth(this.id+"cloudAuth")}l.setOptions({files:ai});this.modules.cloudAuth.setOptions({authCallback:l.showDialog,authCallbackContext:l}).checkAuth()},onActionCloudUnsync:function I(ak){var ap=this,ao=ak.jsNode.isContainer?"folder":"document",aj=ak.displayName,an=(this.options.syncMode==="CLOUD"),ai=an?"":'<div><input type="checkbox" id="requestDeleteRemote" class="requestDeleteRemote-checkBox"><span class="requestDeleteRemote-text">'+this.msg("sync.remove."+ao+".from.cloud",aj)+"</span></div>";Alfresco.util.PopupManager.displayPrompt({title:this.msg("actions."+ao+".cloud-unsync"),noEscape:true,text:this.msg("message.unsync.confirm",aj)+ai,buttons:[{text:this.msg("button.unsync"),handler:function al(){var aq=an?false:V.getAttribute("requestDeleteRemote","checked");this.destroy();Alfresco.util.Ajax.request({url:Alfresco.constants.PROXY_URI+"enterprise/sync/syncsetmembers/"+ak.jsNode.nodeRef.uri+"?requestDeleteRemote="+aq,method:Alfresco.util.Ajax.DELETE,successCallback:{fn:function ar(){YAHOO.Bubbling.fire("metadataRefresh");Alfresco.util.PopupManager.displayMessage({text:ap.msg("message.unsync.success")})},scope:ap},failureMessage:ap.msg("message.unsync.failure")})}},{text:this.msg("button.cancel"),handler:function am(){this.destroy()},isDefault:true}]})},onCloudSyncIndicatorAction:function E(ai,am){var ak=new Alfresco.util.createInfoBalloon(this.widgets.dataTable.getTrEl(am),{text:this.msg("label.loading"),width:"455px"});ak.show();Alfresco.util.Ajax.request({url:Alfresco.constants.PROXY_URI+"slingshot/doclib2/node/"+ai.nodeRef.replace("://","/"),successCallback:{fn:function al(ao){var ap=this,an={showTitle:true,showRequestSyncButton:true,showUnsyncButton:true,showMoreInfoLink:true};Alfresco.util.getSyncStatus(this,ai,ao.json,an,function(ar){if(ar!=null){ak.html(ar.html);ak.requestsync=Alfresco.util.createYUIButton(ap,"button-requestsyn",function(){ap.onActionCloudSyncRequest(ai);ak.hide()},{id:ap.id});if(!ar.showRequestSyncButton&&ak.requestsync!=null){ak.requestsync.setStyle("display","none")}ak.unsync=Alfresco.util.createYUIButton(ap,"button-unsync",function(){ap.onActionCloudUnsync(ai);ak.hide()},{id:ap.id});if(!ar.showUnsyncButton&&ak.unsync!=null){ak.unsync.setStyle("display","none")}var aq=ak.content;Alfresco.util.syncClickOnShowDetailsLinkEvent(ap,aq);Alfresco.util.syncClickOnHideLinkEvent(ap,aq);Alfresco.util.syncClickOnTransientErrorShowDetailsLinkEvent(ap,aq);Alfresco.util.syncClickOnTransientErrorHideLinkEvent(ap,aq)}else{ak.hide()}})},scope:this},failureCallback:{fn:function aj(an){Alfresco.util.PopupManager.displayMessage({text:this.msg("sync.unable.get.details")})},scope:this}})},onActionCloudSyncRequest:function z(ai,ak){Alfresco.util.Ajax.jsonPost({url:Alfresco.constants.PROXY_URI+"enterprise/sync/syncrequest",dataObj:{memberNodeRefs:this.getMemberNodeRefs(ai)},successCallback:{fn:function aj(){YAHOO.Bubbling.fire("metadataRefresh");Alfresco.util.PopupManager.displayMessage({text:this.msg("message.request.sync.success")})},scope:this},failureMessage:this.msg("message.request.sync.failure")})},getMemberNodeRefs:function a(ai){var ak=new Array();if(YAHOO.lang.isArray(ai)){for(var aj in ai){ak.push(ai[aj].nodeRef)}}else{ak.push(ai.nodeRef)}return ak},onCloudSyncFailedIndicatorAction:function H(ai,aj){this.onCloudSyncIndicatorAction(ai,aj)},onCloudIndirectSyncIndicatorAction:function ad(ai,aj){this.onCloudSyncIndicatorAction(ai,aj)},onCloudIndirectSyncFailedIndicatorAction:function O(ai,aj){this.onCloudSyncIndicatorAction(ai,aj)},onActionFolderDownload:function x(ai){var aj=Alfresco.getArchiveAndDownloadInstance(),ak={nodesToArchive:[{nodeRef:ai.nodeRef}],archiveName:ai.fileName};aj.show(ak)},onActionDownload:function q(ai){var aj=Alfresco.getArchiveAndDownloadInstance(),ak={nodesToArchive:[]};if(ai.length==1){ak.nodesToArchive.push({nodeRef:ai[0].nodeRef});ak.archiveName=ai[0].fileName}else{for(var al=0;al<ai.length;al++){ak.nodesToArchive.push({nodeRef:ai[al].nodeRef})}}aj.show(ak)}}})();