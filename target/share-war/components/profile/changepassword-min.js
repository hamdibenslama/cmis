(function(){var c=YAHOO.util.Dom,b=YAHOO.util.Event;Alfresco.ChangePassword=function(g){Alfresco.ChangePassword.superclass.constructor.call(this,"Alfresco.ChangePassword",g,["button"]);return this};YAHOO.extend(Alfresco.ChangePassword,Alfresco.component.Base,{options:{minPasswordLength:3},onReady:function f(){var h=this;this.widgets.ok=Alfresco.util.createYUIButton(this,"button-ok",null,{type:"submit",additionalClass:"alf-primary-button"});this.widgets.cancel=Alfresco.util.createYUIButton(this,"button-cancel",this.onCancel);var g=new Alfresco.forms.Form(this.id+"-form");g.setSubmitElements(this.widgets.ok);g.setSubmitAsJSON(true);g.setAJAXSubmit(true,{successCallback:{fn:this.onSuccess,scope:this}});g.addValidation(this.id+"-oldpassword",Alfresco.forms.validation.mandatory,null,"keyup");g.addValidation(this.id+"-newpassword1",Alfresco.forms.validation.mandatory,null,"keyup");g.addValidation(this.id+"-newpassword1",Alfresco.forms.validation.length,{min:this.options.minPasswordLength,max:255,crop:true},"change",this.msg("Alfresco.forms.validation.length.message.min"));g.addValidation(this.id+"-newpassword2",Alfresco.forms.validation.mandatory,null,"keyup");g.addValidation(this.id+"-newpassword2",Alfresco.forms.validation.length,{min:this.options.minPasswordLength,max:255,crop:true},"change",this.msg("Alfresco.forms.validation.length.message.min"));g.init();c.setStyle(this.id+"-body","display","block")},onSuccess:function a(g){if(g&&g.json){if(g.json.success){Alfresco.util.PopupManager.displayMessage({text:Alfresco.util.message("message.success",this.name)});this.navigateToProfile()}else{if(g.json.message){Alfresco.util.PopupManager.displayPrompt({text:g.json.message})}}}else{Alfresco.util.PopupManager.displayPrompt({text:Alfresco.util.message("message.failure",this.name)})}},onCancel:function d(g,h){this.navigateToProfile()},navigateToProfile:function e(){var g=document.location.href.lastIndexOf("/");document.location.href=document.location.href.substring(0,g+1)+"profile"}})})();