(()=>{"use strict";var t,e=function(){function e(){}return e.init=function(e){var i;if(void 0!==e){if(void 0===(i=document.getElementById(e)))throw new Error("Cannot find a canvas element of id: "+e)}else i=document.createElement("canvas"),document.body.appendChild(i);if(void 0===(t=i.getContext("webgl2")))throw new Error("Unable to initilise WebGL2");return i},e}(),i="undefined"!=typeof Float32Array?Float32Array:Array;function r(){var t=new i(3);return i!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0),t}Math.random,Math.PI,Math.hypot||(Math.hypot=function(){for(var t=0,e=arguments.length;e--;)t+=arguments[e]*arguments[e];return Math.sqrt(t)}),r();var o=function(){},n=function(){function e(e,i,r,o){switch(void 0===i&&(i=t.FLOAT),void 0===r&&(r=t.ARRAY_BUFFER),void 0===o&&(o=t.TRIANGLES),this.m_HasAttributeLocation=!1,this.m_Data=[],this.m_Attributes=[],this.m_ElementSize=e,this.m_DataType=i,this.m_TargetBufferType=r,this.m_Mode=o,this.m_DataType){case t.FLOAT:case t.INT:case t.UNSIGNED_INT:this.m_TypeSize=4;break;case t.SHORT:case t.UNSIGNED_SHORT:this.m_TypeSize=2;break;case t.BYTE:case t.UNSIGNED_BYTE:this.m_TypeSize=1;break;default:throw new Error("Unrecognised data type ".concat(i.toString()))}this.m_Stride=this.m_ElementSize*this.m_TypeSize,this.m_GLBuffer=t.createBuffer(),this.m_VAO=t.createVertexArray()}return e.prototype.destroy=function(){t.deleteBuffer(this.m_GLBuffer)},e.prototype.bind=function(e){var i=this;void 0===e&&(e=!1),t.bindVertexArray(this.m_VAO),t.bindBuffer(this.m_TargetBufferType,this.m_GLBuffer),this.m_HasAttributeLocation&&this.m_Attributes.forEach((function(r){t.vertexAttribPointer(r.location,r.size,i.m_DataType,e,i.m_Stride,r.offset*i.m_TypeSize),t.enableVertexAttribArray(r.location)}))},e.prototype.bindVAO=function(){t.bindVertexArray(this.m_VAO)},e.prototype.unbind=function(){t.bindBuffer(t.ARRAY_BUFFER,void 0),t.bindVertexArray(null)},e.prototype.addAttributeLocation=function(t){this.m_HasAttributeLocation=!0,this.m_Attributes.push(t)},e.prototype.pushBackData=function(t){var e=this;t.forEach((function(t){e.m_Data.push(t)}))},e.prototype.upload=function(){var e;switch(t.bindBuffer(this.m_TargetBufferType,this.m_GLBuffer),this.m_DataType){case t.FLOAT:e=new Float32Array(this.m_Data);break;case t.INT:e=new Int32Array(this.m_Data);break;case t.UNSIGNED_INT:e=new Uint32Array(this.m_Data);break;case t.SHORT:e=new Int16Array(this.m_Data);break;case t.UNSIGNED_SHORT:e=new Uint16Array(this.m_Data);break;case t.BYTE:e=new Int8Array(this.m_Data);break;case t.UNSIGNED_BYTE:e=new Uint8Array(this.m_Data)}t.bufferData(this.m_TargetBufferType,e,t.STATIC_DRAW)},e.prototype.draw=function(){this.m_TargetBufferType===t.ARRAY_BUFFER?t.drawArrays(this.m_Mode,0,this.m_Data.length/this.m_ElementSize):this.m_TargetBufferType===t.ELEMENT_ARRAY_BUFFER&&t.drawElements(this.m_Mode,this.m_Data.length,this.m_DataType,0)},e}();const a=function(t,e){this.Message=t,this.Handler=e},s=function(){function t(){}return t.addSubscription=function(e,i){void 0===t.m_Subscriptions[e]&&(t.m_Subscriptions[e]=[]),-1!==t.m_Subscriptions[e].indexOf(i)?console.warn("Attempting to add duplicate handler to code ".concat(e,". Subscription not added")):t.m_Subscriptions[e].push(i)},t.removeSubscription=function(e,i){if(void 0!==t.m_Subscriptions[e]){var r=t.m_Subscriptions[e].indexOf(i);-1!==r&&t.m_Subscriptions[e].splice(r,1)}else console.warn("Can't unsubscribe thandelr from code ".concat(e,", because this code is not subscribed to."))},t.post=function(e){console.log("Message ".concat(e," posted")),void 0!==t.m_Subscriptions[e.Code]&&t.m_Subscriptions[e.Code].forEach((function(i){e.Priority===u.HIGH?i.onMessage(e):t.m_MessageQueue.push(new a(e,i))}))},t.update=function(e){if(0!=t.m_MessageQueue.length)for(var i=Math.min(t.m_QueueLimitPerFrame,t.m_MessageQueue.length),r=0;r<i;++r){var o=t.m_MessageQueue.pop();o.Handler.onMessage(o.Message)}},t.m_Subscriptions={},t.m_QueueLimitPerFrame=10,t.m_MessageQueue=[],t}();var u;!function(t){t[t.NORMAL=0]="NORMAL",t[t.HIGH=1]="HIGH"}(u||(u={}));const m=function(){function t(t,e,i,r){void 0===r&&(r=u.NORMAL),this.Code=t,this.Sender=e,this.Priority=r,this.Context=i}return t.send=function(e,i,r){s.post(new t(e,i,r))},t.sendPriority=function(e,i,r){s.post(new t(e,i,r,u.HIGH))},t.subscribe=function(t,e){s.addSubscription(t,e)},t.unsubscribe=function(t,e){s.removeSubscription(t,e)},t}();var c=function(){function t(t,e){this.Name=t,this.Data=e}return Object.defineProperty(t.prototype,"width",{get:function(){return this.Data.width},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"height",{get:function(){return this.Data.height},enumerable:!1,configurable:!0}),t}();const h=function(){function t(){}return Object.defineProperty(t.prototype,"supportedExts",{get:function(){return["png","gif","jpg"]},enumerable:!1,configurable:!0}),t.prototype.loadAsset=function(t){var e=new Image;e.onload=this.onImageLoaded.bind(this,t,e),e.src=t},t.prototype.onImageLoaded=function(t,e){console.log("onImage loaded ".concat(t,"/").concat(e));var i=new c(t,e);f.onAssetLoaded(i)},t}();var d="MSG_ASSET_LOADER_ASSET_LOADED::";const f=function(){function t(){}return t.init=function(){t.m_Loaders.push(new h)},t.registerLoader=function(e){t.m_Loaders.push(e)},t.onAssetLoaded=function(e){t.m_LoadedAssets[e.Name]=e,m.send(d+e.Name,this,e)},t.loadAsset=function(e){for(var i=e.split(".").pop().toLowerCase(),r=0,o=t.m_Loaders;r<o.length;r++){var n=o[r];if(-1!==n.supportedExts.indexOf(i))return void n.loadAsset(e)}console.warn("Unable to load asset with extension ".concat(i,", because there is no loader associated with it."))},t.isAssetLoaded=function(e){return void 0!==t.m_LoadedAssets[e]},t.getAsset=function(e){var i=t.m_LoadedAssets[e];if(void 0!==i)return i;t.loadAsset(e)},t.m_Loaders=[],t.m_LoadedAssets={},t}();var _=0,p=0,g=new Uint8Array([255,255,255,255]);const l=function(){function e(e,i,r){void 0===i&&(i=1),void 0===r&&(r=1),this.m_IsLoaded=!1,this.m_Name=e,this.m_Width=i,this.m_Height=r,this.m_Handle=t.createTexture(),m.subscribe(d+this.m_Name,this),this.bind(),t.texImage2D(t.TEXTURE_2D,_,t.RGBA,1,1,p,t.RGBA,t.UNSIGNED_BYTE,g);var o=f.getAsset(this.m_Name);void 0!==o&&this.loadTextureFromAsset(o)}return e.prototype.destroy=function(){t.deleteTexture(this.m_Handle)},Object.defineProperty(e.prototype,"name",{get:function(){return this.m_Name},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"isLoaded",{get:function(){return this.m_IsLoaded},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"width",{get:function(){return this.m_Width},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"height",{get:function(){return this.m_Height},enumerable:!1,configurable:!0}),e.prototype.bind=function(){t.bindTexture(t.TEXTURE_2D,this.m_Handle)},e.prototype.unbind=function(){t.bindTexture(t.TEXTURE_2D,void 0)},e.prototype.activateAndBind=function(e){void 0===e&&(e=0),t.activeTexture(t.TEXTURE0+e),this.bind()},e.prototype.onMessage=function(t){t.Code===d+this.m_Name&&(console.log("loaded:",t.Context),this.loadTextureFromAsset(t.Context))},e.prototype.loadTextureFromAsset=function(e){this.m_Width=e.width,this.m_Height=e.height,this.bind(),t.texImage2D(t.TEXTURE_2D,_,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,e.Data),this.m_IsLoaded=!0},e}();var b=function(t){this.ReferenceNode=1,this.Texture=t};const v=function(){function t(){}return t.getTexture=function(e){if(void 0===t.m_Textures[e]){var i=new l(e);t.m_Textures[e]=new b(i)}else t.m_Textures[e].ReferenceNode++;return t.m_Textures[e].Texture},t.releaseTexture=function(e){t.m_Textures[e],void 0===t.m_Textures[e]?console.warn("A texture name ".concat(e," doesn't exist, hence can't be released")):(t.m_Textures[e].ReferenceNode--,t.m_Textures[e].ReferenceNode<1&&(t.m_Textures[e].Texture.destroy(),t.m_Textures[e]=void 0,delete t.m_Textures[e]))},t.m_Textures={},t}();var A=function(){function e(t,e,i,o){void 0===i&&(i=100),void 0===o&&(o=100),this.m_Position=r(),this.m_Name=t,this.m_Height=o,this.m_Width=i,this.m_TextureName=e,this.m_Texture=v.getTexture(e)}return e.prototype.destroy=function(){this.m_Buffer.destroy(),v.releaseTexture(this.m_TextureName)},Object.defineProperty(e.prototype,"name",{get:function(){return this.m_Name},enumerable:!1,configurable:!0}),e.prototype.load=function(){this.m_Buffer=new n(5);var t=new o;t.location=0,t.size=3,t.offset=0,this.m_Buffer.addAttributeLocation(t);var e=new o;e.location=1,e.size=2,e.offset=3,this.m_Buffer.addAttributeLocation(e),this.m_Buffer.bind();var i=[0,0,0,0,0,0,this.m_Height,0,0,1,this.m_Width,this.m_Height,0,1,1,this.m_Width,this.m_Height,0,1,1,this.m_Width,0,0,1,0,0,0,0,0,0];this.m_Buffer.pushBackData(i),this.m_Buffer.upload(),this.m_Buffer.unbind()},e.prototype.update=function(t){},e.prototype.draw=function(e){this.m_Texture.activateAndBind(0);var i=e.getUniformLocation("u_diffuse");t.uniform1i(i,0),this.m_Buffer.bindVAO(),this.m_Buffer.draw()},e}();const y=A;var T=function(){function e(e,i,r){this.m_Attributes={},this.m_Uniforms={},this.m_Name=e;var o=this.loadShader(i,t.VERTEX_SHADER),n=this.loadShader(r,t.FRAGMENT_SHADER);this.createShaderProgram(o,n),this.detectAttributes(),this.detectUniforms()}return Object.defineProperty(e.prototype,"name",{get:function(){return this.m_Name},enumerable:!1,configurable:!0}),e.prototype.use=function(){t.useProgram(this.m_Program)},e.prototype.getAttributeLocation=function(t){if(void 0===this.m_Attributes[t])throw new Error("error getting attribute '".concat(t,"' :for ").concat(this.name));return this.m_Attributes[t]},e.prototype.getUniformLocation=function(t){if(void 0===this.m_Uniforms[t])throw new Error("error getting uniform '".concat(t,"' :for ").concat(this.name));return this.m_Uniforms[t]},e.prototype.loadShader=function(e,i){var r=t.createShader(i);if(t.shaderSource(r,e),t.compileShader(r),!t.getShaderParameter(r,t.COMPILE_STATUS)){var o=t.getShaderInfoLog(r);throw new Error("error compiling shader '".concat(this.m_Name,"' : ").concat(o))}return r},e.prototype.createShaderProgram=function(e,i){if(this.m_Program=t.createProgram(),t.attachShader(this.m_Program,e),t.attachShader(this.m_Program,i),t.linkProgram(this.m_Program),!t.getProgramParameter(this.m_Program,t.LINK_STATUS)){var r=t.getProgramInfoLog(this.m_Program);throw new Error("error linking shader ".concat(this.m_Name," : ").concat(r))}},e.prototype.detectAttributes=function(){for(var e=t.getProgramParameter(this.m_Program,t.ACTIVE_ATTRIBUTES),i=0;i<e;++i){var r=t.getActiveAttrib(this.m_Program,i);if(!r)break;this.m_Attributes[r.name]=t.getAttribLocation(this.m_Program,r.name)}},e.prototype.detectUniforms=function(){for(var e=t.getProgramParameter(this.m_Program,t.ACTIVE_UNIFORMS),i=0;i<e;++i){var r=t.getActiveUniform(this.m_Program,i);if(!r)break;this.m_Uniforms[r.name]=t.getUniformLocation(this.m_Program,r.name)}},e}();const S=T;function w(){var t=new i(16);return i!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0),t[0]=1,t[5]=1,t[10]=1,t[15]=1,t}const E=function(){function i(){}return i.prototype.start=function(){var i,r,o,n,a,s,u,m,c,h;this.m_Canvas=e.init(),f.init(),t.clearColor(0,0,0,1),this.loadShaders(),this.m_Shader.use(),this.m_Model=w(),this.m_Projection=w(),this.m_Projection=(i=this.m_Projection,r=0,o=this.m_Canvas.width,n=this.m_Canvas.height,m=1/(r-o),c=1/(n-(a=0)),h=1/((s=-100)-(u=100)),i[0]=-2*m,i[1]=0,i[2]=0,i[3]=0,i[4]=0,i[5]=-2*c,i[6]=0,i[7]=0,i[8]=0,i[9]=0,i[10]=2*h,i[11]=0,i[12]=(r+o)*m,i[13]=(a+n)*c,i[14]=(u+s)*h,i[15]=1,i),this.m_Sprite=new y("test","../assets/textures/crate.jpg"),this.m_Sprite.load(),this.m_Sprite.m_Position[0]=20,this.resize(),this.loop()},i.prototype.resize=function(){void 0!==this.m_Canvas&&(this.m_Canvas.width=window.innerWidth,this.m_Canvas.height=window.innerHeight),t.viewport(0,0,this.m_Canvas.width,this.m_Canvas.height)},i.prototype.loop=function(){s.update(0),t.clear(t.COLOR_BUFFER_BIT);var e=this.m_Shader.getUniformLocation("u_tint");t.uniform4f(e,1,1,1,1);var i=this.m_Shader.getUniformLocation("u_projection");t.uniformMatrix4fv(i,!1,new Float32Array(this.m_Projection));var r,o,n,a,u,m,c,h,d,f,_,p,g,l,b,v,A,y,T=this.m_Shader.getUniformLocation("u_model");t.uniformMatrix4fv(T,!1,new Float32Array((r=w(),o=this.m_Model,v=(n=this.m_Sprite.m_Position)[0],A=n[1],y=n[2],o===r?(r[12]=o[0]*v+o[4]*A+o[8]*y+o[12],r[13]=o[1]*v+o[5]*A+o[9]*y+o[13],r[14]=o[2]*v+o[6]*A+o[10]*y+o[14],r[15]=o[3]*v+o[7]*A+o[11]*y+o[15]):(a=o[0],u=o[1],m=o[2],c=o[3],h=o[4],d=o[5],f=o[6],_=o[7],p=o[8],g=o[9],l=o[10],b=o[11],r[0]=a,r[1]=u,r[2]=m,r[3]=c,r[4]=h,r[5]=d,r[6]=f,r[7]=_,r[8]=p,r[9]=g,r[10]=l,r[11]=b,r[12]=a*v+h*A+p*y+o[12],r[13]=u*v+d*A+g*y+o[13],r[14]=m*v+f*A+l*y+o[14],r[15]=c*v+_*A+b*y+o[15]),r))),this.m_Sprite.draw(this.m_Shader),requestAnimationFrame(this.loop.bind(this))},i.prototype.loadShaders=function(){this.m_Shader=new S("basic","#version 300 es\n\n            in vec4 a_position;\n            in vec2 a_texCoord;\n\n            uniform mat4 u_projection;\n            uniform mat4 u_model;\n\n            out vec2 v_texCoord;\n            \n            void main() {\n                gl_Position =  u_projection * u_model * a_position;\n                v_texCoord = a_texCoord;\n            }","#version 300 es\n\n            precision highp float;\n\n            uniform vec4 u_tint;\n            uniform sampler2D u_diffuse;\n\n            out vec4 outColor;\n            in vec2 v_texCoord;\n            \n            \n            void main() {\n                outColor = u_tint * texture(u_diffuse, v_texCoord);\n            }")},i}();var x;window.onload=function(){(x=new E).start()},window.onresize=function(){x.resize()}})();