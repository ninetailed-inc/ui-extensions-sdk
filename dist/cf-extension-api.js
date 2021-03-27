!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).contentfulExtension={})}(this,(function(e){"use strict";var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])})(e,n)};var n,r=function(){return(r=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)};var o=function(){function e(){this._id=0,this._listeners={}}return e.prototype.dispatch=function(){for(var e,t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];for(var r in this._listeners)(e=this._listeners)[r].apply(e,t)},e.prototype.attach=function(e){var t=this;if("function"!=typeof e)throw new Error("listener function expected");var n=this._id++;return this._listeners[n]=e,function(){return delete t._listeners[n]}},e}(),i="__private__memoized__arguments__",a=function(e){function r(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];var o=e.call(this)||this;if(o[n]=[],!t.length)throw new Error("Initial value to be memoized expected");return o[i]=t,o}return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}(r,e),r.prototype.dispatch=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];this[i]=t,e.prototype.dispatch.apply(this,t)},r.prototype.attach=function(t){var n=e.prototype.attach.call(this,t);return t.apply(void 0,this[i]),n},r}(o);n=i;var s=function(){function e(e,t){var n=this;this._messageHandlers={},this._responseHandlers={},this._send=function(e,t){var n=0;return function(r,o){var i=n++;return t.postMessage({source:e,id:i,method:r,params:o},"*"),i}}(e,t.parent),t.addEventListener("message",(function(e){n._handleMessage(e.data)}))}return e.prototype.call=function(e){for(var t=this,n=[],r=1;r<arguments.length;r++)n[r-1]=arguments[r];var o=this._send(e,n);return new Promise((function(e,n){t._responseHandlers[o]={resolve:e,reject:n}}))},e.prototype.send=function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];this._send(e,t)},e.prototype.addHandler=function(e,t){return e in this._messageHandlers||(this._messageHandlers[e]=new o),this._messageHandlers[e].attach(t)},e.prototype._handleMessage=function(e){if(e.method){var t=e.method,n=e.params,r=this._messageHandlers[t];r&&r.dispatch.apply(r,n)}else{var o=e.id,i=this._responseHandlers[o];if(!i)return;"result"in e?i.resolve(e.result):"error"in e&&i.reject(e.error),delete this._responseHandlers[o]}},e}();var l=function(){function e(e,t){var n=this;this.id=t.id,this.locale=t.locale,this.type=t.type,this.required=t.required,this.validations=t.validations,this.items=t.items,this._value=t.value,this._valueSignal=new a(this._value),this._isDisabledSignal=new a(void 0),this._schemaErrorsChangedSignal=new a(void 0),this._channel=e,e.addHandler("valueChanged",(function(e,t,r){e!==n.id||t&&t!==n.locale||(n._value=r,n._valueSignal.dispatch(r))})),e.addHandler("isDisabledChangedForFieldLocale",(function(e,t,r){e===n.id&&t===n.locale&&n._isDisabledSignal.dispatch(r)})),e.addHandler("schemaErrorsChangedForFieldLocale",(function(e,t,r){e===n.id&&t===n.locale&&n._schemaErrorsChangedSignal.dispatch(r)}))}return e.prototype.getValue=function(){return this._value},e.prototype.setValue=function(e){return this._value=e,this._valueSignal.dispatch(e),this._channel.call("setValue",this.id,this.locale,e)},e.prototype.removeValue=function(){return this._value=void 0,this._channel.call("removeValue",this.id,this.locale)},e.prototype.setInvalid=function(e){return this._channel.call("setInvalid",e,this.locale)},e.prototype.onValueChanged=function(e){return this._valueSignal.attach(e)},e.prototype.onIsDisabledChanged=function(e){return this._isDisabledSignal.attach(e)},e.prototype.onSchemaErrorsChanged=function(e){return this._schemaErrorsChangedSignal.attach(e)},e}(),u=function(){function e(e,t,n){this.id=t.id,this.locales=t.locales,this.type=t.type,this.required=t.required,this.validations=t.validations,this.items=t.items,this._defaultLocale=n,this._fieldLocales=t.locales.reduce((function(n,o){var i,a=new l(e,{id:t.id,type:t.type,required:t.required,validations:t.validations,items:t.items,locale:o,value:t.values[o]});return r(r({},n),((i={})[o]=a,i))}),{}),this.assertHasLocale(n)}return e.prototype.getValue=function(e){return this._getFieldLocale(e).getValue()},e.prototype.setValue=function(e,t){return this._getFieldLocale(t).setValue(e)},e.prototype.removeValue=function(e){return this.setValue(void 0,e)},e.prototype.onValueChanged=function(e,t){var n=t||e;return t||(e=""),this._getFieldLocale(e).onValueChanged(n)},e.prototype.onIsDisabledChanged=function(e,t){var n=t||e;return t||(e=""),this._getFieldLocale(e).onIsDisabledChanged(n)},e.prototype._getFieldLocale=function(e){return e=e||this._defaultLocale,this.assertHasLocale(e),this._fieldLocales[e]},e.prototype.getForLocale=function(e){if(!e)throw new Error("getForLocale must be passed a locale");return this._getFieldLocale(e)},e.prototype.assertHasLocale=function(e){if(!this._fieldLocales[e])throw new Error('Unknown locale "'+e+'" for field "'+this.id+'"')},e}();function c(e,t){var n,r=e,o=r.document,i=r.MutationObserver,a=function(){u.updateHeight()},s=new i(a),l=!1,u={startAutoResizer:function(){if(u.updateHeight(),l)return;l=!0,s.observe(o.body,{attributes:!0,childList:!0,subtree:!0,characterData:!0}),e.addEventListener("resize",a)},stopAutoResizer:function(){if(!l)return;l=!1,s.disconnect(),e.removeEventListener("resize",a)},updateHeight:function(e){void 0===e&&(e=null);null===e&&(e=Math.ceil(o.documentElement.getBoundingClientRect().height));e!==n&&(t.send("setHeight",e),n=e)}};return u}var d=["getTask","getTasks","createTask","updateTask","deleteTask"];function p(e,t,n,o){var i=t.sys,s=new a(i),l=t.metadata;e.addHandler("sysChanged",(function(e){i=e,s.dispatch(i)}));var u={};return d.forEach((function(t){u[t]=function(){for(var n=[],r=0;r<arguments.length;r++)n[r]=arguments[r];return e.call("callEntryMethod",t,n)}})),r(r({getSys:function(){return i},onSysChanged:function(e){return s.attach(e)},fields:n.reduce((function(e,t){return e[t.id]=o(t),e}),{})},l?{metadata:l}:{}),u)}var f=["getContentType","getEntry","getEntrySnapshots","getAsset","getEditorInterface","getPublishedEntries","getPublishedAssets","getContentTypes","getEntries","getEditorInterfaces","getAssets","createContentType","createEntry","createAsset","updateContentType","updateEntry","updateAsset","deleteContentType","deleteEntry","deleteAsset","publishEntry","publishAsset","unpublishEntry","unpublishAsset","archiveEntry","archiveAsset","unarchiveEntry","unarchiveAsset","createUpload","processAsset","waitUntilAssetProcessed","getUsers","getAllScheduledActions","getEntityScheduledActions","signRequest"];function h(e,t){var n={};return f.forEach((function(t){n[t]=function(){for(var n=[],r=0;r<arguments.length;r++)n[r]=arguments[r];return e.call("callSpaceMethod",t,n)}})),n.getCachedContentTypes=function(){return function(){for(var e=0,t=0,n=arguments.length;t<n;t++)e+=arguments[t].length;var r=Array(e),o=0;for(t=0;t<n;t++)for(var i=arguments[t],a=0,s=i.length;a<s;a++,o++)r[o]=i[a];return r}(t)},n}var g=function(e){return"object"!=typeof(t=e)||null===t||Array.isArray(t)?{}:e;var t};function v(e,t){return{openAlert:n.bind(null,"alert"),openConfirm:n.bind(null,"confirm"),openPrompt:n.bind(null,"prompt"),openExtension:o,openCurrentApp:i,openCurrent:function(e){return t.app?i(e):o(r(r({},e),{id:t.extension}))},selectSingleEntry:a.bind(null,"Entry",!1),selectSingleAsset:a.bind(null,"Asset",!1),selectMultipleEntries:a.bind(null,"Entry",!0),selectMultipleAssets:a.bind(null,"Asset",!0)};function n(t,n){return e.call("openDialog",t,g(n))}function o(n){if(n=g(n),(n=r(r({},n),{id:n.id||t.extension})).id)return e.call("openDialog","extension",n);throw new Error("Extension ID not provided.")}function i(n){if(n=g(n),t.app){var o=r(r({},n),{id:t.app});return e.call("openDialog","app",o)}throw new Error("Not in the app context.")}function a(t,n,r){return(r=g(r)).entityType=t,r.multiple=n,e.call("openDialog","entitySelector",r)}}function y(e,t){var n=new a(void 0),r=new a(void 0);return e.addHandler("localeSettingsChanged",(function(e){n.dispatch(e)})),e.addHandler("showDisabledFieldsChanged",(function(e){r.dispatch(e)})),{editorInterface:t,onLocaleSettingsChanged:function(e){return n.attach(e)},onShowDisabledFieldsChanged:function(e){return r.attach(e)}}}function _(e,t){var n=new o;return e.addHandler("navigateSlideIn",(function(e){n.dispatch(e)})),{openEntry:function(t,n){return e.call("navigateToContentEntity",r(r({},n),{entityType:"Entry",id:t}))},openNewEntry:function(t,n){return e.call("navigateToContentEntity",r(r({},n),{entityType:"Entry",id:null,contentTypeId:t}))},openBulkEditor:function(t,n){return e.call("navigateToBulkEditor",r({entryId:t},n))},openAsset:function(t,n){return e.call("navigateToContentEntity",r(r({},n),{entityType:"Asset",id:t}))},openNewAsset:function(t){return e.call("navigateToContentEntity",r(r({},t),{entityType:"Asset",id:null}))},openPageExtension:function(n){return e.call("navigateToPage",r({type:"extension",id:t.extension},n))},openCurrentAppPage:function(n){return e.call("navigateToPage",r({type:"app",id:t.app},n))},openAppConfig:function(){return e.call("navigateToAppConfig")},onSlideInNavigation:function(e){return n.attach(e)}}}var E="preInstall",m="postInstall",A=function(e){return"object"==typeof e&&null!==e&&!Array.isArray(e)},C=function(e){return"function"==typeof e},I=function(e){return console.error(e),Promise.resolve(!1)},w=function(e,t,n){if(!C(e))return Promise.resolve(t);var r;try{r=void 0===n?e():e(n)}catch(e){return I(e)}var o,i=r;return A(o=i)&&C(o.then)||(i=Promise.resolve(i)),i.then((function(e){return e instanceof Error?Promise.reject(e):!1!==e&&(A(e)?e:t)}),I).catch(I)};function T(e){var t,n=((t={}).preInstall=null,t.postInstall=null,t),r=function(e,t){if(!C(t))throw new Error("Handler must be a function.");n[e]=t};return e.addHandler("appHook",(function(t){var r=t.stage,o=t.installationRequestId,i=t.err;return r===E?w(n[r],{}).then((function(t){return e.send("appHookResult",{stage:r,installationRequestId:o,result:t})})):r===m?w(n[r],void 0,i||null).then((function(){return e.send("appHookResult",{stage:r,installationRequestId:o})})):Promise.resolve()})),{setReady:function(){return e.call("callAppMethod","setReady")},isInstalled:function(){return e.call("callAppMethod","isInstalled")},getParameters:function(){return e.call("callAppMethod","getParameters")},getCurrentState:function(){return e.call("callAppMethod","getCurrentState")},onConfigure:function(e){r(E,e)},onConfigurationCompleted:function(e){r(m,e)}}}var b,L={LOCATION_ENTRY_FIELD:"entry-field",LOCATION_ENTRY_FIELD_SIDEBAR:"entry-field-sidebar",LOCATION_ENTRY_SIDEBAR:"entry-sidebar",LOCATION_DIALOG:"dialog",LOCATION_ENTRY_EDITOR:"entry-editor",LOCATION_PAGE:"page",LOCATION_APP_CONFIG:"app-config"},O=[N,P,function(e,t){var n=t.field;if(!n)throw new Error('FieldAPI called for location without "field" property defined.');return{field:new l(e,n)}},H,D],S=((b={})[L.LOCATION_ENTRY_FIELD]=O,b[L.LOCATION_ENTRY_FIELD_SIDEBAR]=O,b[L.LOCATION_ENTRY_SIDEBAR]=[N,P,H,D],b[L.LOCATION_ENTRY_EDITOR]=[N,P,H],b[L.LOCATION_DIALOG]=[N,function(e){return{close:function(t){return e.send("closeDialog",t)}}},D],b[L.LOCATION_PAGE]=[N],b[L.LOCATION_APP_CONFIG]=[N,function(e){return{app:T(e)}}],b);function N(e,t){var n=t.user,r=t.parameters,o=t.locales,i=t.ids,a=t.initialContentTypes,s=t.location||L.LOCATION_ENTRY_FIELD;return{location:{is:function(e){return s===e}},user:n,parameters:r,locales:{available:o.available,default:o.default,names:o.names,fallbacks:o.fallbacks,optional:o.optional,direction:o.direction},space:h(e,a),dialogs:v(e,i),navigator:_(e,i),notifier:{success:function(t){return e.send("notify",{type:"success",message:t})},error:function(t){return e.send("notify",{type:"error",message:t})}},ids:i,access:{can:function(t,n){return e.call("checkAccess",t,n)},canEditAppConfig:function(){return e.call("checkAppConfigAccess")},forgeApiKey:function(t){return e.call("getForgedApiKey",t)},canPerform:function(t,n,r){return e.call("previewForgedAccess",t,n,r)}}}}function D(e,t,n){return{window:c(n,e)}}function H(e,t){return{editor:y(e,t.editorInterface)}}function P(e,t){var n=t.locales,r=t.contentType,o=t.entry,i=t.fieldInfo;return{contentType:r,entry:p(e,o,i,(function(t){return new u(e,t,n.default)}))}}var R,F,x,k,M=(R=window,F=function(e,t,n){return(S[t.location]||O).reduce((function(o,i){return r(r({},o),i(e,t,n))}),{})},(x={promise:null,resolve:null}).promise=new Promise((function(e){x.resolve=e})),(k=x).promise.then((function(e){var t=e[0],n=R.document;n.addEventListener("focus",(function(){return t.send("setActive",!0)}),!0),n.addEventListener("blur",(function(){return t.send("setActive",!1)}),!0)})),function(e,t){!function(e,t){function n(r){var o=r.data;"connect"===o.method&&(e.removeEventListener("message",n),t.apply(void 0,o.params))}e.addEventListener("message",n)}(e,(function(n,r){var o=new s(n.id,e);t(o,n,r)}))}(R,(function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return k.resolve(e)})),function(e,t){var n=void 0===t?{supressIframeWarning:!1}:t,r=n.makeCustomApi;n.supressIframeWarning||R.self!==R.top||console.error("Cannot use ui-extension-sdk outside of Contenful:\n\nIn order for the ui-extension-sdk to function correctly, your app needs to be run in an iframe in the Contentful Web App.\n\nLearn more about local development with the ui-extension-sdk here:\n  https://www.contentful.com/developers/docs/extensibility/ui-extensions/faq/#how-can-i-use-the-ui-extension-sdk-locally"),k.promise.then((function(t){var n,o=t[0],i=t[1],a=t[2],s=F(o,i,R);"function"==typeof r&&(n=r(o,i)),a.forEach((function(e){o._handleMessage(e)})),e(s,n)}))});e.init=M,e.locations=L,Object.defineProperty(e,"__esModule",{value:!0})})),window.contentfulApp=window.contentfulExtension;