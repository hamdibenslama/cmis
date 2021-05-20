(function(){var e=YAHOO.util.Dom;var c=Alfresco.util.encodeHTML,d=Alfresco.util.siteURL;if(!String.prototype.includes){String.prototype.includes=function(l,m){if(typeof m!=="number"){m=0}if(m+l.length>this.length){return false}else{return this.indexOf(l,m)!==-1}}}Alfresco.AbstractPendingBase=function(n,q,r,x,u,t,w,v,o,l,p,s,m){Alfresco.AbstractPendingBase.superclass.constructor.call(this,q(),n,["button","container","datasource","datatable","json"]);this.actionButtons={};this.searchTerm="";this.isSearching=false;this.getRuntimeClassName=q;this.getPendingApiUrl=r;this.getResultsListName=x;this.getActionButtonLabel=u;this.getActionButtonTitle=t;this.getActionButtonColumnWidth=w;this.getPersonData=v;this.getUpdatedResponse=o;this.performCustomCellRendering=l;this.getDate=p;this.performOnAction=s;this.addCustomColumnDefinitions=m;return this};YAHOO.extend(Alfresco.AbstractPendingBase,Alfresco.component.Base,{options:{siteId:"",minSearchTermLength:0,maxSearchResults:100,setFocus:false},actionButtons:null,searchTerm:null,isSearching:null,onReady:function j(){var o=this;var p=e.get(this.id+"-search-text");var m=new YAHOO.util.KeyListener(p,{keys:YAHOO.util.KeyListener.KEY.ENTER},{fn:function(){o.onSearchClick()},scope:this,correctScope:true},"keydown");m.enable();if(this.options.setFocus){p.focus()}this.widgets.searchButton=Alfresco.util.createYUIButton(this,"search-button",this.onSearchClick);this.widgets.dataSource=new YAHOO.util.DataSource(o.getPendingApiUrl(this.options.siteId),{responseType:YAHOO.util.DataSource.TYPE_JSON,responseSchema:{resultsList:o.getResultsListName()}});this.widgets.dataSource.doBeforeParseData=function q(D,I){var w=I;if(I){var C=[];if(o.searchTerm.length>0){var v=o.searchTerm.toLowerCase();var u=v;var J=["/","\\\\","\\?","\\+","\\$","\\.","\\^","\\(","\\)"];for(var G=0,F=J.length;G<F;G++){u=u.replace(new RegExp(J[G],"g"),J[G])}var E=u.search("\\*")==0;if(E){u=u.substring(1)}u=u.replace(new RegExp("\\*","g"),".*");var H=new RegExp(u,"i");var A,x,s,B,L;var t,y,z,K;for(var G=0,F=I[o.getResultsListName()].length;G<F;G++){A=o.getPersonData(I[o.getResultsListName()][G]);x=(A.userName||"").toLowerCase();s=(A.firstName||"").toLowerCase();B=(A.lastName||"").toLowerCase();L=(s+" "+B).toLowerCase();t=H.exec(x);y=H.exec(s);z=H.exec(B);K=H.exec(L);if(((t!=null&&t[0]!="")||(y!=null&&y[0]!="")||(z!=null&&z[0]!="")||(t=null&&K[0]!=""))&&(A.userName!==Alfresco.constants.USERNAME)){if(E){C.push(I[o.getResultsListName()][G])}else{if((t!=null&&t.index==0)||(y!=null&&y.index==0)||(z!=null&&z.index==0)||(t=null&&K.index==0)){C.push(I[o.getResultsListName()][G])}}}}}else{for(var G=0;G<I[o.getResultsListName()].length;G++){var A=o.getPersonData(I[o.getResultsListName()][G]);if(A.userName!==Alfresco.constants.USERNAME){C.push(I[o.getResultsListName()][G])}}}C.sort(function(M,P){var O=o.getPersonData(M).firstName+o.getPersonData(M).lastName,N=o.getPersonData(P).firstName+o.getPersonData(P).lastName;return(O>N)?1:(O<N)?-1:0});w=o.getUpdatedResponse(C)}return w};this._setupDataTable();if(this.options.setFocus){e.get(this.id+"-search-text").focus()}var n=function r(t,s){o.onSearchClick.call(o,s,null);return false};var l=new YAHOO.util.KeyListener(this.id+"-search-button",{keys:YAHOO.util.KeyListener.KEY.ENTER},n,"keydown");l.enable()},_setupDataTable:function f(){var s=this;var o=function q(x,w,y,z){e.setStyle(x.parentNode,"width",y.width+"px");var u=Alfresco.constants.URL_RESCONTEXT+"components/images/no-user-photo-64.png",v=s.getPersonData(w.getData());if(v.avatar!==undefined){u=Alfresco.constants.PROXY_URI+v.avatar+"?c=queue&ph=true"}x.innerHTML='<img class="avatar" src="'+u+'" alt="avatar" />'};var p=function(x){var w=x.userName,y=x.firstName,v=x.lastName,u="";if((y!==undefined)||(v!==undefined)){w=y?y+" ":"";w+=v?v:"";u=' <span class="lighter">('+c(x.userName)+")</span>"}return Alfresco.util.userProfileLink(x.userName,w)+u};var n=function t(x,w,y,A){var u=s.getPersonData(w.getData()),v=Alfresco.util.formatDate(s.getDate(w));var z='<div class="to-invitee"><span class="attr-label">'+s.msg("info.from")+": </span>";z+='<span class="attr-value">'+p(u)+"</span>";z+="</div>";z+="<div>";z+='<span class="attr-label">'+s.msg("info.sent")+": </span>";z+='<span class="attr-value">'+c(v)+"</span>";z+=s.performCustomCellRendering(s,w);z+="</div>";x.innerHTML=z};var l=function m(y,w,A,B){e.setStyle(y.parentNode,"width",A.width+"px");var x=s.getPersonData(w.getData()).userName;var u=s.id+"-action-"+x;y.innerHTML='<span id="'+u+'"></span>';var z=s.getActionButtonLabel(w);var v=new YAHOO.widget.Button({type:"button",label:z,title:s.getActionButtonTitle(),name:s.id+"-selectbutton-"+x,container:u,onclick:{fn:s.onActionClick,obj:w,scope:s}});s.actionButtons[x]=v};var r=[{key:"avatar",label:"Avatar",sortable:false,formatter:o,width:70},{key:"person",label:"Description",sortable:false,formatter:n},{key:"actions",label:"Actions",sortable:false,formatter:l,width:this.getActionButtonColumnWidth()}];this.addCustomColumnDefinitions(r);this.widgets.dataTable=new YAHOO.widget.DataTable(this.id+"-results",r,this.widgets.dataSource,{renderLoopSize:32,initialLoad:false,MSG_EMPTY:this.msg("message.empty")});this.widgets.dataTable.subscribe("rowMouseoverEvent",this.widgets.dataTable.onEventHighlightRow);this.widgets.dataTable.subscribe("rowMouseoutEvent",this.widgets.dataTable.onEventUnhighlightRow);if(this.options.minSearchTermLength<=0){this._performSearch("")}},onActionClick:function k(l,m){this.performOnAction(m)},onSearchClick:function i(m,n){var l=YAHOO.lang.trim(e.get(this.id+"-search-text").value);if(l.replace(/\*/g,"").length<this.options.minSearchTermLength){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.minimum-length",this.options.minSearchTermLength)});return}this._performSearch(l)},_setDefaultDataTableErrors:function g(l){var m=Alfresco.util.message;l.set("MSG_EMPTY",m("message.empty",this.getRuntimeClassName()));l.set("MSG_ERROR",m("message.error",this.getRuntimeClassName()))},_performSearch:function a(l){if(!this.isSearching){this.isSearching=true;this._setDefaultDataTableErrors(this.widgets.dataTable);var o=this.widgets.dataTable.getRecordSet().getLength();if(o>0){this.widgets.dataTable.deleteRows(0,o)}var m=function q(r,s,t){this._enableSearchUI();this._setDefaultDataTableErrors(this.widgets.dataTable);if(s.results.length>0){this.widgets.dataTable.onDataReturnInitializeTable.call(this.widgets.dataTable,r,s,t)}};var n=function p(s,t){this._enableSearchUI();if(t.status==401){window.location.reload()}else{try{var r=YAHOO.lang.JSON.parse(t.responseText);this.widgets.dataTable.set("MSG_ERROR",r.message);this.widgets.dataTable.showTableMessage(Alfresco.util.encodeHTML(r.message),YAHOO.widget.DataTable.CLASS_ERROR)}catch(u){this._setDefaultDataTableErrors(this.widgets.dataTable)}}};this.searchTerm=l;this.widgets.dataSource.sendRequest(this._buildSearchParams(l),{success:m,failure:n,scope:this});this.widgets.searchButton.set("disabled",true);YAHOO.lang.later(2000,this,function(){if(this.isSearching){if(!this.widgets.feedbackMessage){this.widgets.feedbackMessage=Alfresco.util.PopupManager.displayMessage({text:Alfresco.util.message("message.searching",this.name),spanClass:"wait",displayTime:0})}else{if(!this.widgets.feedbackMessage.cfg.getProperty("visible")){this.widgets.feedbackMessage.show()}}}})}},_enableSearchUI:function h(){if(this.widgets.feedbackMessage&&this.widgets.feedbackMessage.cfg.getProperty("visible")){this.widgets.feedbackMessage.hide()}this.widgets.searchButton.set("disabled",false);this.isSearching=false},_buildSearchParams:function b(l){return YAHOO.lang.substitute("siteShortName={siteShortName}",{siteShortName:encodeURIComponent(this.options.siteId)})}});Alfresco.SentInvites=function(n){var v=this;Alfresco.SentInvites.superclass.constructor.call(this,n,function A(){return"Alfresco.SentInvites"},function l(B){return Alfresco.constants.PROXY_URI+"api/invites?"},function w(){return"invites"},function o(B){if(B.getData("invitationStatus")=="pending"){return v.msg("button.cancel")}else{return v.msg("button.clear")}},function p(){return""},function y(){return 100},function t(B){return B.invitee},function z(B){return{invites:B}},function u(C,B){var E=C.msg("role."+B.getData("role"));var D="";D+='<span class="separator"> | </span>';D+='<span class="attr-label">'+C.msg("info.role")+": </span>";D+='<span class="attr-value">'+c(E)+"</span>";return D},function s(B){return B.getData("sentInviteDate")},function r(B){v.cancelInvite(B)},function q(B){});this.clearResults=function m(){if(v.widgets.dataTable){var B=v.widgets.dataTable.getRecordSet().getLength();if(B>0){v.widgets.dataTable.deleteRows(0,B)}}e.get(v.id+"-search-text").value=""};this.cancelInvite=function x(C){v.actionButtons[C.getData("invitee").userName].set("disabled",true);v.widgets.feedbackMessage=Alfresco.util.PopupManager.displayMessage({text:v.msg("message.removing"),spanClass:"wait",displayTime:0});var G=function B(H){v.widgets.feedbackMessage.hide();var I=v.widgets.dataTable.getRecordIndex(C);if(I!==null){v.widgets.dataTable.deleteRow(I)}};var E=function F(H){v.widgets.feedbackMessage.hide();v.actionButtons[C.getData("invitee").userName].set("disabled",true)};var D=Alfresco.constants.PROXY_URI+"api/invite/cancel";Alfresco.util.Ajax.request({url:D,method:"GET",dataObj:{inviteId:C.getData("inviteId"),siteShortName:encodeURIComponent(v.options.siteId)},responseContentType:"application/json",successMessage:v.msg("message.cancel.success"),successCallback:{fn:G,scope:v},failureMessage:v.msg("message.cancel.failure"),failureCallback:{fn:E,scope:v}})};return this};YAHOO.extend(Alfresco.SentInvites,Alfresco.AbstractPendingBase,{});Alfresco.PendingRequests=function(o){var u=this;Alfresco.PendingRequests.superclass.constructor.call(this,o,function x(){return"Alfresco.PendingRequests"},function t(A){return Alfresco.constants.PROXY_URI+YAHOO.lang.substitute("api/task-instances?authority={authority}&property=imwf:resourceName/{siteId}&properties={properties}&exclude={exclude}",{authority:encodeURIComponent(Alfresco.constants.USERNAME),siteId:A,properties:["bpm_priority","bpm_status","bpm_dueDate","bpm_description","bpm_id"].join(","),exclude:(this.options.hiddenTaskTypes||["wcmwf:*"]).join(",")})},function p(){return"data"},function m(A){return u.msg("button.view.label")},function l(){return u.msg("button.view.title")},function v(){return 70},function n(A){return A.workflowInstance.initiator},function s(A){return{data:A}},function r(B,A){return""},function z(A){return A.getData("workflowInstance").startDate},function w(A){var B="";if(A.getData().isEditable){B=d("task-edit?taskId="+A.getData().id)}else{B=d("task-details?taskId="+A.getData().id)}window.open(B,"_self")},function q(A){A.push({key:"approve",label:"Approve",sortable:false,formatter:u.renderApproveButton,width:111})});this.renderApproveButton=function y(F,D,G,H){e.setStyle(F.parentNode,"width",G.width+"px");var E=u.getPersonData(D.getData()).userName;var C=D.getData().id;var A=u.id+"-action-"+E+"_approve";F.innerHTML='<span id="'+A+'"></span>';var B=new YAHOO.widget.Button({type:"button",label:u.msg("button.approve.label"),name:u.id+"-selectbutton-"+E+"_approve",container:A,onclick:{fn:u.onApproveButtonClick,obj:D,scope:u}});u.actionButtons[E+"_approve"]=B};this.onApproveButtonClick=function(B,H){var G=u.getPersonData(H.getData()).userName;var E=H.getData().id;u.actionButtons[G+"_approve"].set("disabled",true);u.widgets.feedbackMessage=Alfresco.util.PopupManager.displayMessage({text:u.msg("message.approve.removing"),spanClass:"wait",displayTime:0});var I=function F(J){u.widgets.feedbackMessage.hide();var K=u.widgets.dataTable.getRecordIndex(H);if(K!==null){u.widgets.dataTable.deleteRow(K)}};var C=function D(J){u.widgets.feedbackMessage.hide();u.actionButtons[G+"_approve"].set("disabled",true)};var A=Alfresco.constants.PROXY_URI+"api/task/"+encodeURIComponent(E)+"/formprocessor";Alfresco.util.Ajax.jsonRequest({url:A,method:"POST",dataObj:{prop_bpm_comment:"",prop_imwf_reviewOutcome:"approve",prop_transitions:"Next"},responseContentType:"application/json",successMessage:u.msg("message.approve.success"),successCallback:{fn:I,scope:u},failureMessage:u.msg("message.approve.failure"),failureCallback:{fn:C,scope:u}})};return this};YAHOO.extend(Alfresco.PendingRequests,Alfresco.AbstractPendingBase,{})})();