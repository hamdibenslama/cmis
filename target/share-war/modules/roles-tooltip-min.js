(function(){var b=YAHOO.util.Dom;Alfresco.module.RolesTooltip=function(f,h,e,i,j){var g=f+"-"+e;Alfresco.module.RolesTooltip.superclass.constructor.call(this,"Alfresco.module.RolesTooltip",g+"-roles-tooltip",["button","json"]);this.tooltipDivId=f+"-role-info-panel";this.tooltipContextElementId=h;this.siteId=i?i:"";this.noderef=j?j:"";this.widgets.roleInfoButton=Alfresco.util.createYUIButton(this,e,this.show,{},g);return this};YAHOO.extend(Alfresco.module.RolesTooltip,Alfresco.component.Base,{tooltipDivId:"",tooltipContextElementId:"",siteId:"",noderef:"",show:function a(){if(!Alfresco.module.RolesTooltip.tooltipDiv){Alfresco.util.Ajax.request({url:Alfresco.constants.URL_SERVICECONTEXT+"modules/roles-tooltip",dataObj:{siteId:this.siteId,noderef:this.noderef},successCallback:{fn:this.onTemplateLoaded,scope:this},failureMessage:"Could not load Roles Tooltip"})}else{this._show()}},onTemplateLoaded:function d(e){var f=document.createElement("div");f.id=this.tooltipDivId;b.addClass(f,"hidden");f.innerHTML=e.serverResponse.responseText;b.get(this.tooltipContextElementId).appendChild(f);Alfresco.module.RolesTooltip.tooltipDiv=f;this._show()},_show:function c(){if(!this.widgets.roleTooltip){this.widgets.roleTooltip=new Alfresco.util.createInfoBalloon(this.tooltipContextElementId,{html:Alfresco.module.RolesTooltip.tooltipDiv.innerHTML,width:"350px",wrapperClass:"alf-info-balloon"})}this.widgets.roleTooltip.show();this.widgets.roleTooltip.balloon.align(YAHOO.widget.Overlay.TOP_RIGHT,YAHOO.widget.Overlay.BOTTOM_LEFT,[30,8])}})})();