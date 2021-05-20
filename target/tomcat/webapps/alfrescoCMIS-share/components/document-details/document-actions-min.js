(function(){var i=YAHOO.util.Dom;var f=Alfresco.util.encodeHTML,g=Alfresco.util.combinePaths,h=Alfresco.util.siteURL;Alfresco.DocumentActions=function(n){Alfresco.DocumentActions.superclass.constructor.call(this,"Alfresco.DocumentActions",n,["button"]);this.actionsView="details";YAHOO.Bubbling.on("filesPermissionsUpdated",this.doRefresh,this);YAHOO.Bubbling.on("metadataRefresh",this.doRefresh,this);YAHOO.Bubbling.on("registerAction",this.onRegisterAction,this);return this};function j(s,r){if(Alfresco.constants.PAGECONTEXT=="mine"||Alfresco.constants.PAGECONTEXT=="shared"){var q=s.substring(1);if(Alfresco.constants.PAGECONTEXT=="mine"){q=q.substring(q.indexOf("/")+1)}var p=q.indexOf("/");if(p!=-1){s=q.substring(p)}else{s=""}}var t="",o=s.length>1?"?path="+encodeURIComponent(s):"";if(Alfresco.constants.PAGECONTEXT=="mine"){t="myfiles"}else{if(Alfresco.constants.PAGECONTEXT=="shared"){t="sharedfiles"}else{t=Alfresco.util.isValueSet(r)?"documentlibrary":"repository"}}var n=t+o;return n}YAHOO.extend(Alfresco.DocumentActions,Alfresco.component.Base);YAHOO.lang.augmentProto(Alfresco.DocumentActions,Alfresco.doclib.Actions);YAHOO.lang.augmentObject(Alfresco.DocumentActions.prototype,{options:{nodeRef:null,siteId:null,containerId:"documentLibrary",inlineEditMimetypes:{"text/plain":true,"text/html":true,"text/xml":true},rootNode:"alfresco://company/home",replicationUrlMapping:{},documentDetails:null,repositoryBrowsing:true},recordData:null,doclistMetadata:null,currentPath:null,onReady:function d(){var A=this;this.recordData=this.options.documentDetails.item;this.doclistMetadata=this.options.documentDetails.metadata;this.currentPath=this.recordData.location.path;this.recordData.jsNode=new Alfresco.util.Node(this.recordData.node);var w=this.recordData,p=w.node,q=w.actions,r=i.get(this.id+"-actionSet"),z="",v;w.actionParams={};for(var u=0,D=q.length;u<D;u++){if(u+1<D&&q[u].subgroup!=q[u+1].subgroup){q[u]["lastActionInSubgroup"]=true}z+=this.renderAction(q[u],w)}var o=this.getActionUrls(w);r.innerHTML=YAHOO.lang.substitute(z,o);i.addClass(r,"action-set");i.setStyle(r,"visibility","visible");var B=w.displayName,t=o.downloadUrl;var C=function x(G,F){var E=YAHOO.Bubbling.getOwnerByTagName(F[1].anchor,"div");if(E!==null){if(typeof A[E.id]==="function"){F[1].stop=true;try{A[E.id].call(A,A.recordData,E)}catch(H){Alfresco.logger.error("DocumentActions_fnActionHandler",E.id,H)}}}return true};YAHOO.Bubbling.addDefaultAction("action-link",C,true);this.modules.actions=new Alfresco.module.DoclibActions();if(window.location.hash=="#editOffline"){window.location.hash="";var n=false;YAHOO.Bubbling.on("editingCanceled",function(F,E){if(w.workingCopy.sourceNodeRef==E[1].record.workingCopy.sourceNodeRef){n=true}},this);if(YAHOO.env.ua.ie>6){Alfresco.util.PopupManager.displayPrompt({title:this.msg("message.edit-offline.success",B),text:this.msg("message.edit-offline.success.ie7"),buttons:[{text:this.msg("button.download"),handler:function s(){window.open(t,"_blank");this.destroy()},isDefault:true},{text:this.msg("button.close"),handler:function y(){this.destroy()}}]})}else{Alfresco.util.PopupManager.displayMessage({text:this.msg("message.edit-offline.success",B)});YAHOO.lang.later(3000,this,function(){if(!n){window.location=t}})}}if(window.location.hash=="#editCancelled"){window.location.hash="";Alfresco.util.PopupManager.displayMessage({text:this.msg("message.edit-cancel.success",B)})}if(window.location.hash=="#unlockDocument"){window.location.hash="";Alfresco.util.PopupManager.displayMessage({text:this.msg("message.unlock-document.success",B)})}if(window.location.hash=="#newVersionUpload"){window.location.hash="";Alfresco.util.PopupManager.displayMessage({text:this.msg("message.new-version-upload.success")})}},onActionEditOffline:function c(p){var n=p.displayName,o=new Alfresco.util.NodeRef(p.nodeRef);this.modules.actions.genericAction({success:{callback:{fn:function q(r){this.recordData.jsNode.setNodeRef(r.json.results[0].nodeRef);window.location=this.getActionUrls(this.recordData).documentDetailsUrl+"#editOffline"},scope:this}},failure:{message:this.msg("message.edit-offline.failure",n)},webscript:{method:Alfresco.util.Ajax.POST,name:"checkout/node/{nodeRef}",params:{nodeRef:o.uri}}})},onActionCancelEditing:function k(q){var n=q.displayName,p=new Alfresco.util.NodeRef(q.nodeRef),r=j(q.location.path,this.options.siteId);this.modules.actions.genericAction({success:{callback:{fn:function o(u){var t=this.recordData.jsNode.nodeRef.nodeRef,s=u.json.results[0].nodeRef;this.recordData.jsNode.setNodeRef(s);if(this.recordData.parent&&this.recordData.parent.nodeRef==s){window.location=q.parent.nodeRef?h(r):Alfresco.constants.URL_CONTEXT}else{window.location=this.getActionUrls(this.recordData).documentDetailsUrl+"#editCancelled"}if(t==s){window.location.reload()}},scope:this}},failure:{message:this.msg("message.edit-cancel.failure",n)},webscript:{method:Alfresco.util.Ajax.POST,name:"cancel-checkout/node/{nodeRef}",params:{nodeRef:p.uri}}});YAHOO.Bubbling.fire("editingCanceled",{record:q})},onActionUnlockDocument:function b(q){var n=q.displayName,p=new Alfresco.util.NodeRef(q.nodeRef);this.modules.actions.genericAction({success:{callback:{fn:function o(t){var s=this.recordData.jsNode.nodeRef.nodeRef,r=t.json.results[0].nodeRef;this.recordData.jsNode.setNodeRef(r);window.location=this.getActionUrls(this.recordData).documentDetailsUrl+"#unlockDocument";if(s==r){window.location.reload()}},scope:this}},failure:{message:this.msg("message.unlock-document.failure",n)},webscript:{method:Alfresco.util.Ajax.POST,name:"unlock-document/node/{nodeRef}",params:{nodeRef:p.uri}}});YAHOO.Bubbling.fire("editingCanceled",{record:q})},onActionUploadNewVersion:function l(r){var o=r.displayName,q=new Alfresco.util.NodeRef(r.nodeRef),n=r.version;if(!this.fileUpload){this.fileUpload=Alfresco.getFileUploadInstance()}var t=this.msg("label.filter-description",o),p="*";if(o&&new RegExp(/[^\.]+\.[^\.]+/).exec(o)){p="*"+o.substring(o.lastIndexOf("."))}if(r.workingCopy&&r.workingCopy.workingCopyVersion){n=r.workingCopy.workingCopyVersion}var s={updateNodeRef:q.toString(),updateFilename:o,updateVersion:n,suppressRefreshEvent:true,overwrite:true,filter:[{description:t,extensions:p}],mode:this.fileUpload.MODE_SINGLE_UPDATE,onFileUploadComplete:{fn:this.onNewVersionUploadCompleteCustom,scope:this},newVersion:true,jsNode:r.jsNode};if(Alfresco.util.isValueSet(this.options.siteId)){s.siteId=this.options.siteId;s.containerId=this.options.containerId}this.fileUpload.show(s)},onNewVersionUploadCompleteCustom:function a(n){this.recordData.jsNode.setNodeRef(n.successful[0].nodeRef);var q=this.getActionUrls(this.recordData).documentDetailsUrl+"#newVersionUpload";var p=this.recordData.jsNode.nodeRef.nodeRef,o=this.recordData.nodeRef;Alfresco.Share.postActivity(this.options.siteId,"org.alfresco.documentlibrary.file-updated",n.successful[0].fileName,"document-details?nodeRef="+n.successful[0].nodeRef,{fileName:n.successful[0].fileName,nodeRef:n.successful[0].nodeRef},function(){window.location=q;if(p==o){window.location.reload()}})},_onActionDeleteConfirm:function m(q){var r=q.location.path,t=q.fileName,n=q.displayName,p=new Alfresco.util.NodeRef(q.nodeRef),s=j(r,this.options.siteId);this.modules.actions.genericAction({success:{activity:{siteId:this.options.siteId,activityType:"file-deleted",page:"documentlibrary",activityData:{fileName:t,path:r,nodeRef:p.toString()}},callback:{fn:function o(u){window.location=q.parent.nodeRef?h(s):Alfresco.constants.URL_CONTEXT}}},failure:{message:this.msg("message.delete.failure",n)},webscript:{method:Alfresco.util.Ajax.DELETE,name:"file/node/{nodeRef}",params:{nodeRef:p.uri}}})},doRefresh:function e(){YAHOO.Bubbling.unsubscribe("filesPermissionsUpdated",this.doRefresh,this);YAHOO.Bubbling.unsubscribe("metadataRefresh",this.doRefresh,this);this.refresh("components/document-details/document-actions?nodeRef={nodeRef}"+(this.options.siteId?"&site={siteId}":""))}},true)})();