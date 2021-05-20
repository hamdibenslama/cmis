(function(){var b=YAHOO.util.Dom,s=YAHOO.util.Event,n=YAHOO.util.Element;var o=Alfresco.util.encodeHTML;Alfresco.SiteMembers=function(t){this.name="Alfresco.SiteMembers";this.id=t;this.widgets={};this.listWidgets={};this.buttons=[];this.modules={};this.isCurrentUserSiteAdmin=false;Alfresco.util.ComponentManager.register(this);Alfresco.util.YUILoaderHelper.require(["button","container","datasource","datatable","json"],this.onComponentsLoaded,this);YAHOO.Bubbling.on("deactivateAllControls",this.onDeactivateAllControls,this);return this};YAHOO.extend(Alfresco.SiteMembers,Alfresco.component.Base,{options:{siteId:"",minSearchTermLength:0,maxSearchResults:100,currentUser:"",currentUserRole:"",roles:[],error:null,setFocus:false},widgets:null,listWidgets:null,buttons:null,modules:null,isCurrentUserSiteAdmin:null,isSearching:false,onReady:function m(){var x=this;var w=Alfresco.constants.PROXY_URI+"api/sites/"+x.options.siteId+"/memberships?";this.widgets.dataSource=new YAHOO.util.DataSource(w,{responseType:YAHOO.util.DataSource.TYPE_JSON,connXhrMode:"queueRequests",responseSchema:{resultsList:"items"}});this.widgets.dataSource.doBeforeParseData=function u(C,B){var A=B;if(B){var z=[],E,F;for(var y=0,D=B.length;y<D;y++){E=B[y];F=E.authority;F.role=E.role;F.isMemberOfGroup=E.isMemberOfGroup;z.push(F)}z.sort(function(H,G){var J=H.firstName+H.lastName,I=G.firstName+G.lastName;return(J>I)?1:(J<I)?-1:0});A={items:z}}return A};if(x.options.currentUserRole!==undefined&&x.options.currentUserRole==="SiteManager"){this.isCurrentUserSiteAdmin=true}this._setupDataTable();this.widgets.searchButton=Alfresco.util.createYUIButton(this,"button",this.onSearch);if(b.get(this.id+"-invitePeople")){this.widgets.invitePeople=Alfresco.util.createYUIButton(this,"invitePeople",null,{type:"link"})}var t=b.get(this.id+"-term"),v=new YAHOO.util.KeyListener(t,{keys:13},{fn:function(){x.onSearch()},scope:this,correctScope:true},"keydown");v.enable();if(this.options.error){v.disable();this.widgets.dataTable.set("MSG_ERROR",this.options.error);this.widgets.dataTable.showTableMessage(this.options.error,YAHOO.widget.DataTable.CLASS_ERROR);YAHOO.Bubbling.fire("deactivateAllControls")}if(this.options.setFocus){t.focus()}if(window.location.hash==="#showall"||this.options.minSearchTermLength===0){this.onSearch()}b.setStyle(this.id+"-body","visibility","visible")},_setupDataTable:function q(){var u=this;var v=[{key:"userName",label:"User Name",sortable:false,formatter:this.bind(this.renderCellAvatar),width:64},{key:"bio",label:"Bio",sortable:false,formatter:this.bind(this.renderCellDescription)},{key:"info",label:"Info",sortable:false,formatter:this.bind(this.renderCellInfo)},{key:"role",label:"Select Role",formatter:this.bind(this.renderCellRoleSelect),width:140},{key:"uninvite",label:"Uninvite",formatter:this.bind(this.renderCellUninvite)}];this.widgets.dataTable=new YAHOO.widget.DataTable(this.id+"-members",v,this.widgets.dataSource,{renderLoopSize:32,initialLoad:false,MSG_EMPTY:'<span style="white-space: nowrap;">'+this.msg("site-members.enter-search-term")+"</span>"});this.widgets.dataTable.doBeforeLoadData=function t(x,y,A){if(y.error){try{var w=YAHOO.lang.JSON.parse(y.responseText);u.widgets.dataTable.set("MSG_ERROR",w.message)}catch(z){u._setDefaultDataTableErrors(u.widgets.dataTable)}}else{if(y.results){if(y.results.length===0){u.widgets.dataTable.set("MSG_EMPTY",'<span style="white-space: nowrap;">'+u.msg("message.empty")+"</span>")}u.renderLoopSize=Alfresco.util.RENDERLOOPSIZE}}return true}},renderCellAvatar:function e(x,u,y,z){b.setStyle(x.parentNode,"width",y.width+"px");var w=u.getData("userName"),v=Alfresco.constants.URL_PAGECONTEXT+"user/"+w+"/profile",t=Alfresco.constants.URL_RESCONTEXT+"components/images/no-user-photo-64.png";if(u.getData("avatar")!==undefined){t=Alfresco.constants.PROXY_URI+u.getData("avatar")+"?c=queue&ph=true"}x.innerHTML='<a href="'+v+'"><img src="'+t+'" alt="avatar" /></a>'},renderCellDescription:function k(B,E,y,w){var A=E.getData("userName"),v=A,C=E.getData("firstName"),D=E.getData("lastName");if((C!==undefined)||(D!==undefined)){v=C?C+" ":"";v+=D?D:""}var u=Alfresco.constants.URL_PAGECONTEXT+"user/"+A+"/profile",z=E.getData("jobtitle")?E.getData("jobtitle"):"",t=E.getData("organization")?E.getData("organization"):"",x='<h3><a href="'+u+'">'+o(v)+"</a></h3>";if(z.length>0){x+='<div><span class="attr-name">'+this.msg("label.title")+': </span>&nbsp;<span class="attr-value">'+o(z)+"</span></div>"}if(t.length>0){x+='<div><span class="attr-name">'+this.msg("label.company")+':</span>&nbsp;<span class="attr-value">'+o(t)+"</span></div>"}B.innerHTML=x},renderCellInfo:function g(v,u,w,x){b.setStyle(v.parentNode,"text-align","right");var t=u.getData("isMemberOfGroup");if(t){v.innerHTML='<span class="alf-site-visibility info" title="'+this.msg("message.group-info")+'">'+this.msg("site-members.group")+"</span>"}},getRoles:function(t){return this.options.roles},renderCellRoleSelect:function a(D,F,z,u){b.setStyle(D.parentNode,"width",z.width+"px");b.setStyle(D.parentNode,"text-align","right");b.addClass(D,"overflow");var v=F.getData("role");if(this.isCurrentUserSiteAdmin&&F.getData("userName")!==this.options.currentUser){var C=F.getData("userName");D.innerHTML='<span id="'+this.id+"-roleSelector-"+C+'"></span>';var A=[],y=this.getRoles(F.getData()),w;for(var B=0,t=y.length;B<t;B++){w=y[B];A.push({text:this.msg("role."+w),value:w,onclick:{fn:this.onRoleSelect,obj:{user:C,currentRole:v,newRole:w,recordId:F.getId()},scope:this}})}var E=new YAHOO.widget.Button({container:this.id+"-roleSelector-"+C,type:"menu",label:this.msg("role."+v)+" "+Alfresco.constants.MENU_ARROW_SYMBOL,menu:A});this.listWidgets[C]={roleSelector:E};this.buttons[C+"-roleSelector"]={roleSelector:E}}else{D.innerHTML="<div>"+this.msg("role."+v)+"</div>"}},renderCellUninvite:function p(w,u,x,y){b.setStyle(w.parentNode,"width",7+"em");b.addClass(w.parentNode,"uninvite");if(this.isCurrentUserSiteAdmin){var v=u.getData("userName");w.innerHTML='<span id="'+this.id+"-button-"+v+'"></span>';var t=new YAHOO.widget.Button({container:this.id+"-button-"+v,label:this.msg("site-members.uninvite"),disabled:u.getData("isMemberOfGroup"),onclick:{fn:this.doRemove,obj:v,scope:this}});t.addClass("uninvite");this.buttons[v+"-button"]={button:t}}else{w.innerHTML="<div></div>"}},onSearch:function h(){var t=YAHOO.lang.trim(b.get(this.id+"-term").value);if(t.replace(/\*/g,"").length<this.options.minSearchTermLength){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.minimum-length",this.options.minSearchTermLength)});return}this._performSearch(t)},doRemove:function i(w,t){this.widgets.feedbackMessage=Alfresco.util.PopupManager.displayMessage({text:this.msg("message.removing"),spanClass:"wait",displayTime:0});var x=function y(A,z){this.widgets.feedbackMessage.hide();Alfresco.util.PopupManager.displayMessage({text:this.msg("site-members.remove-success",z)});this.onSearch()};var u=function v(z){this.widgets.feedbackMessage.hide()};Alfresco.util.Ajax.request({url:Alfresco.constants.PROXY_URI+"api/sites/"+this.options.siteId+"/memberships/"+encodeURIComponent(t),method:"DELETE",successCallback:{fn:x,obj:t,scope:this},failureMessage:this.msg("site-members.remove-failure",t,this.options.siteId),failureCallback:{fn:u,scope:this}})},onRoleSelect:function f(D,t,C){var A=this.widgets.dataTable.getRecord(C.recordId);var z=A.getData();var y=this.widgets.dataTable.getRecordIndex(A);var v=z.role;var E=C.newRole;var x=C.user;if(E!==v){this.widgets.feedbackMessage=Alfresco.util.PopupManager.displayMessage({text:this.msg("message.changingrole"),spanClass:"wait",effect:null,displayTime:0});var F=function w(G,H){this.widgets.feedbackMessage.hide();Alfresco.util.PopupManager.displayMessage({text:this.msg("site-members.change-role-success",H.user,this.msg("role."+H.role)),effect:null});this.onSearch()};var u=function B(G){this.widgets.feedbackMessage.hide()};Alfresco.util.Ajax.jsonPut({url:Alfresco.constants.PROXY_URI+"api/sites/"+this.options.siteId+"/memberships",dataObj:{role:E,person:{userName:x}},successCallback:{fn:F,obj:{user:x,role:E,recordIndex:y},scope:this},failureMessage:this.msg("site-members.change-role-failure",x),failureCallback:{fn:u,scope:this}})}},onDeactivateAllControls:function j(v,u){var t,w,x=Alfresco.util.disableYUIButton;for(t in this.widgets){if(this.widgets.hasOwnProperty(t)){x(this.widgets[t])}}},_setDefaultDataTableErrors:function l(t){var u=Alfresco.util.message;t.set("MSG_EMPTY",u("message.empty","Alfresco.SiteMembers"));t.set("MSG_ERROR",u("message.error","Alfresco.SiteMembers"))},_performSearch:function c(t){if(!this.isSearching){this.isSearching=true;this._setDefaultDataTableErrors(this.widgets.dataTable);this.widgets.dataTable.set("MSG_EMPTY",this.msg("site-members.searching"));this.widgets.dataTable.deleteRows(0,this.widgets.dataTable.getRecordSet().getLength());function u(w,x,y){this._enableSearchUI();this.widgets.dataTable.onDataReturnInitializeTable.call(this.widgets.dataTable,w,x,y);this._setDefaultDataTableErrors(this.widgets.dataTable)}function v(x,y){this._enableSearchUI();if(y.status==401){window.location.reload()}else{try{var w=YAHOO.lang.JSON.parse(y.responseText);this.widgets.dataTable.set("MSG_ERROR",w.message);this.widgets.dataTable.showTableMessage(Alfresco.util.encodeHTML(w.message),YAHOO.widget.DataTable.CLASS_ERROR)}catch(z){this._setDefaultDataTableErrors(this.widgets.dataTable)}}}this.widgets.dataSource.sendRequest(this._buildSearchParams(t),{success:u,failure:v,scope:this});this.widgets.searchButton.set("disabled",true);YAHOO.lang.later(2000,this,function(){if(this.isSearching){if(!this.widgets.feedbackMessage){this.widgets.feedbackMessage=Alfresco.util.PopupManager.displayMessage({text:Alfresco.util.message("message.searching",this.name),spanClass:"wait",displayTime:0})}else{if(!this.widgets.feedbackMessage.cfg.getProperty("visible")){this.widgets.feedbackMessage.show()}}}},[])}},_enableSearchUI:function r(){if(this.widgets.feedbackMessage&&this.widgets.feedbackMessage.cfg.getProperty("visible")){this.widgets.feedbackMessage.hide()}this.widgets.searchButton.set("disabled",false);this.isSearching=false},_buildSearchParams:function d(t){var u=YAHOO.lang.substitute("size={maxResults}&nf={term}&authorityType=USER",{maxResults:this.options.maxSearchResults,term:encodeURIComponent(t)});return u}})})();