var cp=Object.defineProperty;var up=(n,e,t)=>e in n?cp(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var M=(n,e,t)=>up(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=t(s);fetch(s.href,i)}})();const lp=60,hp=1e3/lp,dp=3,Ol=80,Jn=50,Bi=150,ds=2,ji=52,fp=120,pp=200,pn=112,fs=52,Fc=400,Ll=60,mp=15,gp=.25,qi=4.6,$i=2,Ml=14,_p=320,yp=10,Ep=245,Tp=5,ee={Splash:"splash",Game:"game",Score:"score",Records:"records"},Ip=[0,1,2,1];class wp{constructor(){M(this,"x",Ll);M(this,"radius",mp);M(this,"animation",Ip);M(this,"y",0);M(this,"frame",0);M(this,"velocity",0);M(this,"rotation",0);M(this,"animAccumulator",0)}jump(){this.velocity=-qi}update(e,t,r,s,i,a){const u=e===ee.Splash||e===ee.Records?10:5;for(this.animAccumulator+=i;this.animAccumulator>=u;)this.animAccumulator-=u,this.frame=(this.frame+1)%this.animation.length;if(e===ee.Splash||e===ee.Records){this.y=t-Ep+Tp*Math.cos(s/10),this.rotation=0;return}this.velocity+=gp*i,this.y+=this.velocity*i;const l=this.radius;this.y<=l&&(this.y=l,this.velocity=0);const d=t-r-yp;this.y>=d&&(this.y=d,e===ee.Game&&(a==null||a()),this.velocity=qi),this.velocity>=qi?(this.frame=1,this.rotation=Math.min(Math.PI/2,this.rotation+.3*i)):this.rotation=-.3}draw(e,t){e.save(),e.translate(this.x,this.y),e.rotate(this.rotation);const r=this.animation[this.frame],s=t.goose[r];s.draw(e,-s.width/2,-s.height/2+6),e.restore()}}const q={skyTop:"#8ED4EA",skyBottom:"#C5EAF5",cloud:"rgba(255, 255, 255, 0.6)",ground:"#E8DCC8",groundStripe:"#66CFC8",obstacle:"#00A196",obstacleCap:"#007A72",outline:"#2A2A2A",accent:"#00A196",panel:"#FFF8F0",panelBorder:"#D4C4B0",text:"#FFFFFF"},Zr=24,es=8,vp=[{x:.15,y:.18,w:70,h:28},{x:.55,y:.12,w:90,h:32},{x:.78,y:.25,w:60,h:24}];function Ap(n,e,t){const r=t-pn,s=n.createLinearGradient(0,0,0,r);s.addColorStop(0,q.skyTop),s.addColorStop(1,q.skyBottom),n.fillStyle=s,n.fillRect(0,0,e,r),n.fillStyle=q.cloud;for(const i of vp){const a=e*i.x,u=r*i.y;n.beginPath(),n.ellipse(a,u,i.w/2,i.h/2,0,0,Math.PI*2),n.ellipse(a-i.w*.25,u+4,i.w*.3,i.h*.4,0,0,Math.PI*2),n.ellipse(a+i.w*.25,u+4,i.w*.35,i.h*.45,0,0,Math.PI*2),n.fill()}}function Sp(n,e,t,r){const s=t-pn;n.fillStyle=q.ground,n.fillRect(0,s,e,pn),n.fillStyle=q.groundStripe,n.fillRect(0,s,e,es),n.save(),n.beginPath(),n.rect(0,s+es,e,pn-es),n.clip();const i=s+es,a=Ml*2,u=r%a;n.strokeStyle="rgba(180, 160, 120, 0.35)",n.lineWidth=2;for(let l=-a+u;l<e+a;l+=a)n.beginPath(),n.moveTo(l,i),n.lineTo(l+a,i+a),n.stroke();n.restore()}function xc(n,e,t,r,s){const i=s?t+Zr:t,a=r-Zr;n.fillStyle=q.obstacle,n.strokeStyle=q.outline,n.lineWidth=2,n.fillRect(e+2,i,fs-4,a),n.strokeRect(e+2,i,fs-4,a),n.fillStyle=q.obstacleCap;const u=s?t+r-Zr:t;n.beginPath(),n.roundRect(e,u,fs,Zr,6),n.fill(),n.stroke(),n.fillStyle="rgba(255, 255, 255, 0.15)",n.fillRect(e+6,i+4,6,a-8)}const Rp=.4;class Pp{constructor(){M(this,"pipes",[]);M(this,"pipeGap",Ol);M(this,"pipeSpeed",ds);M(this,"spawnFrames",0)}setDifficulty(e){this.pipeGap=e.pipeGap,this.pipeSpeed=e.pipeSpeed}reset(){this.pipes=[],this.spawnFrames=0}seedInitial(e,t){const r=_p+ji,s=e+ji;if(s<=r)return;const i=Jn+Bi,u=r+Rp*(s-r)+i*this.pipeSpeed;this.pipes.push(this.createPipe(t,u))}update(e,t,r,s,i,a){const u=this.spawnFrames;if(this.spawnFrames+=s,this.spawnFrames>=Jn){const l=Math.floor((Math.max(u,Jn)-Jn)/Bi),d=Math.floor((this.spawnFrames-Jn)/Bi);for(let p=l;p<d;p++)this.pipes.push(this.createPipe(t,e+ji))}for(let l=0;l<this.pipes.length;l++){const d=this.pipes[l];l===0&&(!d.passed&&d.x+d.width<Ll&&(d.passed=!0,a()),this.checkCollision(r,d)&&i()),d.x-=this.pipeSpeed*s,d.x<-d.width&&(this.pipes.splice(l,1),l--)}}createPipe(e,t){const r=e-(Fc+pn+fp+pp*Math.random());return{x:t,y:r,width:fs,height:Fc,passed:!1}}checkCollision(e,t){const r=Math.min(Math.max(e.x,t.x),t.x+t.width),s=Math.min(Math.max(e.y,t.y),t.y+t.height),i=Math.min(Math.max(e.y,t.y+t.height+this.pipeGap),t.y+2*t.height+this.pipeGap),a=e.x-r,u=e.y-s,l=e.y-i,d=a*a+u*u,p=a*a+l*l,g=e.radius*e.radius;return g>d||g>p}draw(e){for(const t of this.pipes)xc(e,t.x,t.y,t.height,!0),xc(e,t.x,t.y+this.pipeGap+t.height,t.height,!1)}}const bp=12,Cp=36,Vp=16;function Uc(n){const e=n*.312;return{titleY:n*.125,subtitleY:n*.208,difficultyTabsY:e,playButtonY:e+Cp+Vp,footerStartY:n*.66}}const Dp=36,Np=20;function Bc(n){const e=n*.14;return{titleY:n*.08,tabsY:e,tableStartY:e+Dp+Np,backButtonY:n*.88}}function jc(n){return{subtitleY:n*.125,imageY:n*.28,imageHeight:n*.21,panelY:n*.49,retryButtonY:n*.68}}function kp(n){return n*.075}class ts{constructor(e,t,r,s,i){M(this,"img");M(this,"x");M(this,"y");M(this,"width");M(this,"height");this.img=e,this.x=t*2,this.y=r*2,this.width=s*2,this.height=i*2}draw(e,t,r){e.drawImage(this.img,this.x,this.y,this.width,this.height,t,r,this.width,this.height)}}function Op(n,e){return{goose:[new ts(n,0,0,32,24),new ts(n,32,0,32,24),new ts(n,64,0,32,24)],petyaSplash:new ts(e,0,0,55,100)}}const Lp=()=>{};var qc={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fl=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},Mp=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const s=n[t++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const i=n[t++];e[r++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=n[t++],a=n[t++],u=n[t++],l=((s&7)<<18|(i&63)<<12|(a&63)<<6|u&63)-65536;e[r++]=String.fromCharCode(55296+(l>>10)),e[r++]=String.fromCharCode(56320+(l&1023))}else{const i=n[t++],a=n[t++];e[r++]=String.fromCharCode((s&15)<<12|(i&63)<<6|a&63)}}return e.join("")},xl={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const i=n[s],a=s+1<n.length,u=a?n[s+1]:0,l=s+2<n.length,d=l?n[s+2]:0,p=i>>2,g=(i&3)<<4|u>>4;let A=(u&15)<<2|d>>6,b=d&63;l||(b=64,a||(A=64)),r.push(t[p],t[g],t[A],t[b])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Fl(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):Mp(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const i=t[n.charAt(s++)],u=s<n.length?t[n.charAt(s)]:0;++s;const d=s<n.length?t[n.charAt(s)]:64;++s;const g=s<n.length?t[n.charAt(s)]:64;if(++s,i==null||u==null||d==null||g==null)throw new Fp;const A=i<<2|u>>4;if(r.push(A),d!==64){const b=u<<4&240|d>>2;if(r.push(b),g!==64){const k=d<<6&192|g;r.push(k)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class Fp extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const xp=function(n){const e=Fl(n);return xl.encodeByteArray(e,!0)},As=function(n){return xp(n).replace(/\./g,"")},Ul=function(n){try{return xl.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Up(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bp=()=>Up().__FIREBASE_DEFAULTS__,jp=()=>{if(typeof process>"u"||typeof qc>"u")return;const n=qc.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},qp=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Ul(n[1]);return e&&JSON.parse(e)},Hs=()=>{try{return Lp()||Bp()||jp()||qp()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Bl=n=>{var e,t;return(t=(e=Hs())==null?void 0:e.emulatorHosts)==null?void 0:t[n]},$p=n=>{const e=Bl(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},jl=()=>{var n;return(n=Hs())==null?void 0:n.config},ql=n=>{var e;return(e=Hs())==null?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zp{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gp(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",s=n.iat||0,i=n.sub||n.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a={iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}},...n};return[As(JSON.stringify(t)),As(JSON.stringify(a)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function we(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Hp(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(we())}function Wp(){var e;const n=(e=Hs())==null?void 0:e.forceEnvironment;if(n==="node")return!0;if(n==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Kp(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Qp(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Yp(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Jp(){const n=we();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Xp(){return!Wp()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Zp(){try{return typeof indexedDB=="object"}catch{return!1}}function em(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var i;e(((i=s.error)==null?void 0:i.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tm="FirebaseError";class ot extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=tm,Object.setPrototypeOf(this,ot.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Rr.prototype.create)}}class Rr{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},s=`${this.service}/${e}`,i=this.errors[e],a=i?nm(i,r):"Error",u=`${this.serviceName}: ${a} (${s}).`;return new ot(s,u,r)}}function nm(n,e){return n.replace(rm,(t,r)=>{const s=e[r];return s!=null?String(s):`<${r}?>`})}const rm=/\{\$([^}]+)}/g;function sm(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Kt(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const s of t){if(!r.includes(s))return!1;const i=n[s],a=e[s];if($c(i)&&$c(a)){if(!Kt(i,a))return!1}else if(i!==a)return!1}for(const s of r)if(!t.includes(s))return!1;return!0}function $c(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pr(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function im(n,e){const t=new om(n,e);return t.subscribe.bind(t)}class om{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let s;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");am(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:r},s.next===void 0&&(s.next=zi),s.error===void 0&&(s.error=zi),s.complete===void 0&&(s.complete=zi);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function am(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function zi(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ce(n){return n&&n._delegate?n._delegate:n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function br(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function $l(n){return(await fetch(n,{credentials:"include"})).ok}class Qt{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gt="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cm{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new zp;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(lm(e))try{this.getOrInitializeService({instanceIdentifier:Gt})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const i=this.getOrInitializeService({instanceIdentifier:s});r.resolve(i)}catch{}}}}clearInstance(e=Gt){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Gt){return this.instances.has(e)}getOptions(e=Gt){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[i,a]of this.instancesDeferred.entries()){const u=this.normalizeInstanceIdentifier(i);r===u&&a.resolve(s)}return s}onInit(e,t){const r=this.normalizeInstanceIdentifier(t),s=this.onInitCallbacks.get(r)??new Set;s.add(e),this.onInitCallbacks.set(r,s);const i=this.instances.get(r);return i&&e(i,r),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const s of r)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:um(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Gt){return this.component?this.component.multipleInstances?e:Gt:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function um(n){return n===Gt?void 0:n}function lm(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hm{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new cm(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var G;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(G||(G={}));const dm={debug:G.DEBUG,verbose:G.VERBOSE,info:G.INFO,warn:G.WARN,error:G.ERROR,silent:G.SILENT},fm=G.INFO,pm={[G.DEBUG]:"log",[G.VERBOSE]:"log",[G.INFO]:"info",[G.WARN]:"warn",[G.ERROR]:"error"},mm=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),s=pm[e];if(s)console[s](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Do{constructor(e){this.name=e,this._logLevel=fm,this._logHandler=mm,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in G))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?dm[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,G.DEBUG,...e),this._logHandler(this,G.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,G.VERBOSE,...e),this._logHandler(this,G.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,G.INFO,...e),this._logHandler(this,G.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,G.WARN,...e),this._logHandler(this,G.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,G.ERROR,...e),this._logHandler(this,G.ERROR,...e)}}const gm=(n,e)=>e.some(t=>n instanceof t);let zc,Gc;function _m(){return zc||(zc=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function ym(){return Gc||(Gc=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const zl=new WeakMap,oo=new WeakMap,Gl=new WeakMap,Gi=new WeakMap,No=new WeakMap;function Em(n){const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("success",i),n.removeEventListener("error",a)},i=()=>{t(Tt(n.result)),s()},a=()=>{r(n.error),s()};n.addEventListener("success",i),n.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&zl.set(t,n)}).catch(()=>{}),No.set(e,n),e}function Tm(n){if(oo.has(n))return;const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("complete",i),n.removeEventListener("error",a),n.removeEventListener("abort",a)},i=()=>{t(),s()},a=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",i),n.addEventListener("error",a),n.addEventListener("abort",a)});oo.set(n,e)}let ao={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return oo.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Gl.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Tt(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Im(n){ao=n(ao)}function wm(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=n.call(Hi(this),e,...t);return Gl.set(r,e.sort?e.sort():[e]),Tt(r)}:ym().includes(n)?function(...e){return n.apply(Hi(this),e),Tt(zl.get(this))}:function(...e){return Tt(n.apply(Hi(this),e))}}function vm(n){return typeof n=="function"?wm(n):(n instanceof IDBTransaction&&Tm(n),gm(n,_m())?new Proxy(n,ao):n)}function Tt(n){if(n instanceof IDBRequest)return Em(n);if(Gi.has(n))return Gi.get(n);const e=vm(n);return e!==n&&(Gi.set(n,e),No.set(e,n)),e}const Hi=n=>No.get(n);function Am(n,e,{blocked:t,upgrade:r,blocking:s,terminated:i}={}){const a=indexedDB.open(n,e),u=Tt(a);return r&&a.addEventListener("upgradeneeded",l=>{r(Tt(a.result),l.oldVersion,l.newVersion,Tt(a.transaction),l)}),t&&a.addEventListener("blocked",l=>t(l.oldVersion,l.newVersion,l)),u.then(l=>{i&&l.addEventListener("close",()=>i()),s&&l.addEventListener("versionchange",d=>s(d.oldVersion,d.newVersion,d))}).catch(()=>{}),u}const Sm=["get","getKey","getAll","getAllKeys","count"],Rm=["put","add","delete","clear"],Wi=new Map;function Hc(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(Wi.get(e))return Wi.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,s=Rm.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(s||Sm.includes(t)))return;const i=async function(a,...u){const l=this.transaction(a,s?"readwrite":"readonly");let d=l.store;return r&&(d=d.index(u.shift())),(await Promise.all([d[t](...u),s&&l.done]))[0]};return Wi.set(e,i),i}Im(n=>({...n,get:(e,t,r)=>Hc(e,t)||n.get(e,t,r),has:(e,t)=>!!Hc(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pm{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(bm(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function bm(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const co="@firebase/app",Wc="0.14.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const et=new Do("@firebase/app"),Cm="@firebase/app-compat",Vm="@firebase/analytics-compat",Dm="@firebase/analytics",Nm="@firebase/app-check-compat",km="@firebase/app-check",Om="@firebase/auth",Lm="@firebase/auth-compat",Mm="@firebase/database",Fm="@firebase/data-connect",xm="@firebase/database-compat",Um="@firebase/functions",Bm="@firebase/functions-compat",jm="@firebase/installations",qm="@firebase/installations-compat",$m="@firebase/messaging",zm="@firebase/messaging-compat",Gm="@firebase/performance",Hm="@firebase/performance-compat",Wm="@firebase/remote-config",Km="@firebase/remote-config-compat",Qm="@firebase/storage",Ym="@firebase/storage-compat",Jm="@firebase/firestore",Xm="@firebase/ai",Zm="@firebase/firestore-compat",eg="firebase",tg="12.14.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uo="[DEFAULT]",ng={[co]:"fire-core",[Cm]:"fire-core-compat",[Dm]:"fire-analytics",[Vm]:"fire-analytics-compat",[km]:"fire-app-check",[Nm]:"fire-app-check-compat",[Om]:"fire-auth",[Lm]:"fire-auth-compat",[Mm]:"fire-rtdb",[Fm]:"fire-data-connect",[xm]:"fire-rtdb-compat",[Um]:"fire-fn",[Bm]:"fire-fn-compat",[jm]:"fire-iid",[qm]:"fire-iid-compat",[$m]:"fire-fcm",[zm]:"fire-fcm-compat",[Gm]:"fire-perf",[Hm]:"fire-perf-compat",[Wm]:"fire-rc",[Km]:"fire-rc-compat",[Qm]:"fire-gcs",[Ym]:"fire-gcs-compat",[Jm]:"fire-fst",[Zm]:"fire-fst-compat",[Xm]:"fire-vertex","fire-js":"fire-js",[eg]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ss=new Map,rg=new Map,lo=new Map;function Kc(n,e){try{n.container.addComponent(e)}catch(t){et.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function vn(n){const e=n.name;if(lo.has(e))return et.debug(`There were multiple attempts to register component ${e}.`),!1;lo.set(e,n);for(const t of Ss.values())Kc(t,n);for(const t of rg.values())Kc(t,n);return!0}function ko(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Ne(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sg={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},It=new Rr("app","Firebase",sg);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ig{constructor(e,t,r){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Qt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw It.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bn=tg;function Hl(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r={name:uo,automaticDataCollectionEnabled:!0,...e},s=r.name;if(typeof s!="string"||!s)throw It.create("bad-app-name",{appName:String(s)});if(t||(t=jl()),!t)throw It.create("no-options");const i=Ss.get(s);if(i){if(Kt(t,i.options)&&Kt(r,i.config))return i;throw It.create("duplicate-app",{appName:s})}const a=new hm(s);for(const l of lo.values())a.addComponent(l);const u=new ig(t,r,a);return Ss.set(s,u),u}function Wl(n=uo){const e=Ss.get(n);if(!e&&n===uo&&jl())return Hl();if(!e)throw It.create("no-app",{appName:n});return e}function wt(n,e,t){let r=ng[n]??n;t&&(r+=`-${t}`);const s=r.match(/\s|\//),i=e.match(/\s|\//);if(s||i){const a=[`Unable to register library "${r}" with version "${e}":`];s&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&i&&a.push("and"),i&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),et.warn(a.join(" "));return}vn(new Qt(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const og="firebase-heartbeat-database",ag=1,dr="firebase-heartbeat-store";let Ki=null;function Kl(){return Ki||(Ki=Am(og,ag,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(dr)}catch(t){console.warn(t)}}}}).catch(n=>{throw It.create("idb-open",{originalErrorMessage:n.message})})),Ki}async function cg(n){try{const t=(await Kl()).transaction(dr),r=await t.objectStore(dr).get(Ql(n));return await t.done,r}catch(e){if(e instanceof ot)et.warn(e.message);else{const t=It.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});et.warn(t.message)}}}async function Qc(n,e){try{const r=(await Kl()).transaction(dr,"readwrite");await r.objectStore(dr).put(e,Ql(n)),await r.done}catch(t){if(t instanceof ot)et.warn(t.message);else{const r=It.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});et.warn(r.message)}}}function Ql(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ug=1024,lg=30;class hg{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new fg(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=Yc();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(a=>a.date===i))return;if(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats.length>lg){const a=pg(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){et.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Yc(),{heartbeatsToSend:r,unsentEntries:s}=dg(this._heartbeatsCache.heartbeats),i=As(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return et.warn(t),""}}}function Yc(){return new Date().toISOString().substring(0,10)}function dg(n,e=ug){const t=[];let r=n.slice();for(const s of n){const i=t.find(a=>a.agent===s.agent);if(i){if(i.dates.push(s.date),Jc(t)>e){i.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),Jc(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class fg{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Zp()?em().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await cg(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Qc(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Qc(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function Jc(n){return As(JSON.stringify({version:2,heartbeats:n})).length}function pg(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let r=1;r<n.length;r++)n[r].date<t&&(t=n[r].date,e=r);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mg(n){vn(new Qt("platform-logger",e=>new Pm(e),"PRIVATE")),vn(new Qt("heartbeat",e=>new hg(e),"PRIVATE")),wt(co,Wc,n),wt(co,Wc,"esm2020"),wt("fire-js","")}mg("");var gg="firebase",_g="12.14.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */wt(gg,_g,"app");var Xc=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var vt,Yl;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(T,m){function y(){}y.prototype=m.prototype,T.F=m.prototype,T.prototype=new y,T.prototype.constructor=T,T.D=function(I,E,v){for(var _=Array(arguments.length-2),Re=2;Re<arguments.length;Re++)_[Re-2]=arguments[Re];return m.prototype[E].apply(I,_)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(r,t),r.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(T,m,y){y||(y=0);const I=Array(16);if(typeof m=="string")for(var E=0;E<16;++E)I[E]=m.charCodeAt(y++)|m.charCodeAt(y++)<<8|m.charCodeAt(y++)<<16|m.charCodeAt(y++)<<24;else for(E=0;E<16;++E)I[E]=m[y++]|m[y++]<<8|m[y++]<<16|m[y++]<<24;m=T.g[0],y=T.g[1],E=T.g[2];let v=T.g[3],_;_=m+(v^y&(E^v))+I[0]+3614090360&4294967295,m=y+(_<<7&4294967295|_>>>25),_=v+(E^m&(y^E))+I[1]+3905402710&4294967295,v=m+(_<<12&4294967295|_>>>20),_=E+(y^v&(m^y))+I[2]+606105819&4294967295,E=v+(_<<17&4294967295|_>>>15),_=y+(m^E&(v^m))+I[3]+3250441966&4294967295,y=E+(_<<22&4294967295|_>>>10),_=m+(v^y&(E^v))+I[4]+4118548399&4294967295,m=y+(_<<7&4294967295|_>>>25),_=v+(E^m&(y^E))+I[5]+1200080426&4294967295,v=m+(_<<12&4294967295|_>>>20),_=E+(y^v&(m^y))+I[6]+2821735955&4294967295,E=v+(_<<17&4294967295|_>>>15),_=y+(m^E&(v^m))+I[7]+4249261313&4294967295,y=E+(_<<22&4294967295|_>>>10),_=m+(v^y&(E^v))+I[8]+1770035416&4294967295,m=y+(_<<7&4294967295|_>>>25),_=v+(E^m&(y^E))+I[9]+2336552879&4294967295,v=m+(_<<12&4294967295|_>>>20),_=E+(y^v&(m^y))+I[10]+4294925233&4294967295,E=v+(_<<17&4294967295|_>>>15),_=y+(m^E&(v^m))+I[11]+2304563134&4294967295,y=E+(_<<22&4294967295|_>>>10),_=m+(v^y&(E^v))+I[12]+1804603682&4294967295,m=y+(_<<7&4294967295|_>>>25),_=v+(E^m&(y^E))+I[13]+4254626195&4294967295,v=m+(_<<12&4294967295|_>>>20),_=E+(y^v&(m^y))+I[14]+2792965006&4294967295,E=v+(_<<17&4294967295|_>>>15),_=y+(m^E&(v^m))+I[15]+1236535329&4294967295,y=E+(_<<22&4294967295|_>>>10),_=m+(E^v&(y^E))+I[1]+4129170786&4294967295,m=y+(_<<5&4294967295|_>>>27),_=v+(y^E&(m^y))+I[6]+3225465664&4294967295,v=m+(_<<9&4294967295|_>>>23),_=E+(m^y&(v^m))+I[11]+643717713&4294967295,E=v+(_<<14&4294967295|_>>>18),_=y+(v^m&(E^v))+I[0]+3921069994&4294967295,y=E+(_<<20&4294967295|_>>>12),_=m+(E^v&(y^E))+I[5]+3593408605&4294967295,m=y+(_<<5&4294967295|_>>>27),_=v+(y^E&(m^y))+I[10]+38016083&4294967295,v=m+(_<<9&4294967295|_>>>23),_=E+(m^y&(v^m))+I[15]+3634488961&4294967295,E=v+(_<<14&4294967295|_>>>18),_=y+(v^m&(E^v))+I[4]+3889429448&4294967295,y=E+(_<<20&4294967295|_>>>12),_=m+(E^v&(y^E))+I[9]+568446438&4294967295,m=y+(_<<5&4294967295|_>>>27),_=v+(y^E&(m^y))+I[14]+3275163606&4294967295,v=m+(_<<9&4294967295|_>>>23),_=E+(m^y&(v^m))+I[3]+4107603335&4294967295,E=v+(_<<14&4294967295|_>>>18),_=y+(v^m&(E^v))+I[8]+1163531501&4294967295,y=E+(_<<20&4294967295|_>>>12),_=m+(E^v&(y^E))+I[13]+2850285829&4294967295,m=y+(_<<5&4294967295|_>>>27),_=v+(y^E&(m^y))+I[2]+4243563512&4294967295,v=m+(_<<9&4294967295|_>>>23),_=E+(m^y&(v^m))+I[7]+1735328473&4294967295,E=v+(_<<14&4294967295|_>>>18),_=y+(v^m&(E^v))+I[12]+2368359562&4294967295,y=E+(_<<20&4294967295|_>>>12),_=m+(y^E^v)+I[5]+4294588738&4294967295,m=y+(_<<4&4294967295|_>>>28),_=v+(m^y^E)+I[8]+2272392833&4294967295,v=m+(_<<11&4294967295|_>>>21),_=E+(v^m^y)+I[11]+1839030562&4294967295,E=v+(_<<16&4294967295|_>>>16),_=y+(E^v^m)+I[14]+4259657740&4294967295,y=E+(_<<23&4294967295|_>>>9),_=m+(y^E^v)+I[1]+2763975236&4294967295,m=y+(_<<4&4294967295|_>>>28),_=v+(m^y^E)+I[4]+1272893353&4294967295,v=m+(_<<11&4294967295|_>>>21),_=E+(v^m^y)+I[7]+4139469664&4294967295,E=v+(_<<16&4294967295|_>>>16),_=y+(E^v^m)+I[10]+3200236656&4294967295,y=E+(_<<23&4294967295|_>>>9),_=m+(y^E^v)+I[13]+681279174&4294967295,m=y+(_<<4&4294967295|_>>>28),_=v+(m^y^E)+I[0]+3936430074&4294967295,v=m+(_<<11&4294967295|_>>>21),_=E+(v^m^y)+I[3]+3572445317&4294967295,E=v+(_<<16&4294967295|_>>>16),_=y+(E^v^m)+I[6]+76029189&4294967295,y=E+(_<<23&4294967295|_>>>9),_=m+(y^E^v)+I[9]+3654602809&4294967295,m=y+(_<<4&4294967295|_>>>28),_=v+(m^y^E)+I[12]+3873151461&4294967295,v=m+(_<<11&4294967295|_>>>21),_=E+(v^m^y)+I[15]+530742520&4294967295,E=v+(_<<16&4294967295|_>>>16),_=y+(E^v^m)+I[2]+3299628645&4294967295,y=E+(_<<23&4294967295|_>>>9),_=m+(E^(y|~v))+I[0]+4096336452&4294967295,m=y+(_<<6&4294967295|_>>>26),_=v+(y^(m|~E))+I[7]+1126891415&4294967295,v=m+(_<<10&4294967295|_>>>22),_=E+(m^(v|~y))+I[14]+2878612391&4294967295,E=v+(_<<15&4294967295|_>>>17),_=y+(v^(E|~m))+I[5]+4237533241&4294967295,y=E+(_<<21&4294967295|_>>>11),_=m+(E^(y|~v))+I[12]+1700485571&4294967295,m=y+(_<<6&4294967295|_>>>26),_=v+(y^(m|~E))+I[3]+2399980690&4294967295,v=m+(_<<10&4294967295|_>>>22),_=E+(m^(v|~y))+I[10]+4293915773&4294967295,E=v+(_<<15&4294967295|_>>>17),_=y+(v^(E|~m))+I[1]+2240044497&4294967295,y=E+(_<<21&4294967295|_>>>11),_=m+(E^(y|~v))+I[8]+1873313359&4294967295,m=y+(_<<6&4294967295|_>>>26),_=v+(y^(m|~E))+I[15]+4264355552&4294967295,v=m+(_<<10&4294967295|_>>>22),_=E+(m^(v|~y))+I[6]+2734768916&4294967295,E=v+(_<<15&4294967295|_>>>17),_=y+(v^(E|~m))+I[13]+1309151649&4294967295,y=E+(_<<21&4294967295|_>>>11),_=m+(E^(y|~v))+I[4]+4149444226&4294967295,m=y+(_<<6&4294967295|_>>>26),_=v+(y^(m|~E))+I[11]+3174756917&4294967295,v=m+(_<<10&4294967295|_>>>22),_=E+(m^(v|~y))+I[2]+718787259&4294967295,E=v+(_<<15&4294967295|_>>>17),_=y+(v^(E|~m))+I[9]+3951481745&4294967295,T.g[0]=T.g[0]+m&4294967295,T.g[1]=T.g[1]+(E+(_<<21&4294967295|_>>>11))&4294967295,T.g[2]=T.g[2]+E&4294967295,T.g[3]=T.g[3]+v&4294967295}r.prototype.v=function(T,m){m===void 0&&(m=T.length);const y=m-this.blockSize,I=this.C;let E=this.h,v=0;for(;v<m;){if(E==0)for(;v<=y;)s(this,T,v),v+=this.blockSize;if(typeof T=="string"){for(;v<m;)if(I[E++]=T.charCodeAt(v++),E==this.blockSize){s(this,I),E=0;break}}else for(;v<m;)if(I[E++]=T[v++],E==this.blockSize){s(this,I),E=0;break}}this.h=E,this.o+=m},r.prototype.A=function(){var T=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);T[0]=128;for(var m=1;m<T.length-8;++m)T[m]=0;m=this.o*8;for(var y=T.length-8;y<T.length;++y)T[y]=m&255,m/=256;for(this.v(T),T=Array(16),m=0,y=0;y<4;++y)for(let I=0;I<32;I+=8)T[m++]=this.g[y]>>>I&255;return T};function i(T,m){var y=u;return Object.prototype.hasOwnProperty.call(y,T)?y[T]:y[T]=m(T)}function a(T,m){this.h=m;const y=[];let I=!0;for(let E=T.length-1;E>=0;E--){const v=T[E]|0;I&&v==m||(y[E]=v,I=!1)}this.g=y}var u={};function l(T){return-128<=T&&T<128?i(T,function(m){return new a([m|0],m<0?-1:0)}):new a([T|0],T<0?-1:0)}function d(T){if(isNaN(T)||!isFinite(T))return g;if(T<0)return N(d(-T));const m=[];let y=1;for(let I=0;T>=y;I++)m[I]=T/y|0,y*=4294967296;return new a(m,0)}function p(T,m){if(T.length==0)throw Error("number format error: empty string");if(m=m||10,m<2||36<m)throw Error("radix out of range: "+m);if(T.charAt(0)=="-")return N(p(T.substring(1),m));if(T.indexOf("-")>=0)throw Error('number format error: interior "-" character');const y=d(Math.pow(m,8));let I=g;for(let v=0;v<T.length;v+=8){var E=Math.min(8,T.length-v);const _=parseInt(T.substring(v,v+E),m);E<8?(E=d(Math.pow(m,E)),I=I.j(E).add(d(_))):(I=I.j(y),I=I.add(d(_)))}return I}var g=l(0),A=l(1),b=l(16777216);n=a.prototype,n.m=function(){if(O(this))return-N(this).m();let T=0,m=1;for(let y=0;y<this.g.length;y++){const I=this.i(y);T+=(I>=0?I:4294967296+I)*m,m*=4294967296}return T},n.toString=function(T){if(T=T||10,T<2||36<T)throw Error("radix out of range: "+T);if(k(this))return"0";if(O(this))return"-"+N(this).toString(T);const m=d(Math.pow(T,6));var y=this;let I="";for(;;){const E=ve(y,m).g;y=W(y,E.j(m));let v=((y.g.length>0?y.g[0]:y.h)>>>0).toString(T);if(y=E,k(y))return v+I;for(;v.length<6;)v="0"+v;I=v+I}},n.i=function(T){return T<0?0:T<this.g.length?this.g[T]:this.h};function k(T){if(T.h!=0)return!1;for(let m=0;m<T.g.length;m++)if(T.g[m]!=0)return!1;return!0}function O(T){return T.h==-1}n.l=function(T){return T=W(this,T),O(T)?-1:k(T)?0:1};function N(T){const m=T.g.length,y=[];for(let I=0;I<m;I++)y[I]=~T.g[I];return new a(y,~T.h).add(A)}n.abs=function(){return O(this)?N(this):this},n.add=function(T){const m=Math.max(this.g.length,T.g.length),y=[];let I=0;for(let E=0;E<=m;E++){let v=I+(this.i(E)&65535)+(T.i(E)&65535),_=(v>>>16)+(this.i(E)>>>16)+(T.i(E)>>>16);I=_>>>16,v&=65535,_&=65535,y[E]=_<<16|v}return new a(y,y[y.length-1]&-2147483648?-1:0)};function W(T,m){return T.add(N(m))}n.j=function(T){if(k(this)||k(T))return g;if(O(this))return O(T)?N(this).j(N(T)):N(N(this).j(T));if(O(T))return N(this.j(N(T)));if(this.l(b)<0&&T.l(b)<0)return d(this.m()*T.m());const m=this.g.length+T.g.length,y=[];for(var I=0;I<2*m;I++)y[I]=0;for(I=0;I<this.g.length;I++)for(let E=0;E<T.g.length;E++){const v=this.i(I)>>>16,_=this.i(I)&65535,Re=T.i(E)>>>16,xt=T.i(E)&65535;y[2*I+2*E]+=_*xt,K(y,2*I+2*E),y[2*I+2*E+1]+=v*xt,K(y,2*I+2*E+1),y[2*I+2*E+1]+=_*Re,K(y,2*I+2*E+1),y[2*I+2*E+2]+=v*Re,K(y,2*I+2*E+2)}for(T=0;T<m;T++)y[T]=y[2*T+1]<<16|y[2*T];for(T=m;T<2*m;T++)y[T]=0;return new a(y,0)};function K(T,m){for(;(T[m]&65535)!=T[m];)T[m+1]+=T[m]>>>16,T[m]&=65535,m++}function X(T,m){this.g=T,this.h=m}function ve(T,m){if(k(m))throw Error("division by zero");if(k(T))return new X(g,g);if(O(T))return m=ve(N(T),m),new X(N(m.g),N(m.h));if(O(m))return m=ve(T,N(m)),new X(N(m.g),m.h);if(T.g.length>30){if(O(T)||O(m))throw Error("slowDivide_ only works with positive integers.");for(var y=A,I=m;I.l(T)<=0;)y=de(y),I=de(I);var E=ue(y,1),v=ue(I,1);for(I=ue(I,2),y=ue(y,2);!k(I);){var _=v.add(I);_.l(T)<=0&&(E=E.add(y),v=_),I=ue(I,1),y=ue(y,1)}return m=W(T,E.j(m)),new X(E,m)}for(E=g;T.l(m)>=0;){for(y=Math.max(1,Math.floor(T.m()/m.m())),I=Math.ceil(Math.log(y)/Math.LN2),I=I<=48?1:Math.pow(2,I-48),v=d(y),_=v.j(m);O(_)||_.l(T)>0;)y-=I,v=d(y),_=v.j(m);k(v)&&(v=A),E=E.add(v),T=W(T,_)}return new X(E,T)}n.B=function(T){return ve(this,T).h},n.and=function(T){const m=Math.max(this.g.length,T.g.length),y=[];for(let I=0;I<m;I++)y[I]=this.i(I)&T.i(I);return new a(y,this.h&T.h)},n.or=function(T){const m=Math.max(this.g.length,T.g.length),y=[];for(let I=0;I<m;I++)y[I]=this.i(I)|T.i(I);return new a(y,this.h|T.h)},n.xor=function(T){const m=Math.max(this.g.length,T.g.length),y=[];for(let I=0;I<m;I++)y[I]=this.i(I)^T.i(I);return new a(y,this.h^T.h)};function de(T){const m=T.g.length+1,y=[];for(let I=0;I<m;I++)y[I]=T.i(I)<<1|T.i(I-1)>>>31;return new a(y,T.h)}function ue(T,m){const y=m>>5;m%=32;const I=T.g.length-y,E=[];for(let v=0;v<I;v++)E[v]=m>0?T.i(v+y)>>>m|T.i(v+y+1)<<32-m:T.i(v+y);return new a(E,T.h)}r.prototype.digest=r.prototype.A,r.prototype.reset=r.prototype.u,r.prototype.update=r.prototype.v,Yl=r,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.B,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=p,vt=a}).apply(typeof Xc<"u"?Xc:typeof self<"u"?self:typeof window<"u"?window:{});var ns=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Jl,tr,Xl,ps,ho,Zl,eh,th;(function(){var n,e=Object.defineProperty;function t(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof ns=="object"&&ns];for(var c=0;c<o.length;++c){var h=o[c];if(h&&h.Math==Math)return h}throw Error("Cannot find global object")}var r=t(this);function s(o,c){if(c)e:{var h=r;o=o.split(".");for(var f=0;f<o.length-1;f++){var w=o[f];if(!(w in h))break e;h=h[w]}o=o[o.length-1],f=h[o],c=c(f),c!=f&&c!=null&&e(h,o,{configurable:!0,writable:!0,value:c})}}s("Symbol.dispose",function(o){return o||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(o){return o||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(o){return o||function(c){var h=[],f;for(f in c)Object.prototype.hasOwnProperty.call(c,f)&&h.push([f,c[f]]);return h}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var i=i||{},a=this||self;function u(o){var c=typeof o;return c=="object"&&o!=null||c=="function"}function l(o,c,h){return o.call.apply(o.bind,arguments)}function d(o,c,h){return d=l,d.apply(null,arguments)}function p(o,c){var h=Array.prototype.slice.call(arguments,1);return function(){var f=h.slice();return f.push.apply(f,arguments),o.apply(this,f)}}function g(o,c){function h(){}h.prototype=c.prototype,o.Z=c.prototype,o.prototype=new h,o.prototype.constructor=o,o.Ob=function(f,w,S){for(var C=Array(arguments.length-2),j=2;j<arguments.length;j++)C[j-2]=arguments[j];return c.prototype[w].apply(f,C)}}var A=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?o=>o&&AsyncContext.Snapshot.wrap(o):o=>o;function b(o){const c=o.length;if(c>0){const h=Array(c);for(let f=0;f<c;f++)h[f]=o[f];return h}return[]}function k(o,c){for(let f=1;f<arguments.length;f++){const w=arguments[f];var h=typeof w;if(h=h!="object"?h:w?Array.isArray(w)?"array":h:"null",h=="array"||h=="object"&&typeof w.length=="number"){h=o.length||0;const S=w.length||0;o.length=h+S;for(let C=0;C<S;C++)o[h+C]=w[C]}else o.push(w)}}class O{constructor(c,h){this.i=c,this.j=h,this.h=0,this.g=null}get(){let c;return this.h>0?(this.h--,c=this.g,this.g=c.next,c.next=null):c=this.i(),c}}function N(o){a.setTimeout(()=>{throw o},0)}function W(){var o=T;let c=null;return o.g&&(c=o.g,o.g=o.g.next,o.g||(o.h=null),c.next=null),c}class K{constructor(){this.h=this.g=null}add(c,h){const f=X.get();f.set(c,h),this.h?this.h.next=f:this.g=f,this.h=f}}var X=new O(()=>new ve,o=>o.reset());class ve{constructor(){this.next=this.g=this.h=null}set(c,h){this.h=c,this.g=h,this.next=null}reset(){this.next=this.g=this.h=null}}let de,ue=!1,T=new K,m=()=>{const o=Promise.resolve(void 0);de=()=>{o.then(y)}};function y(){for(var o;o=W();){try{o.h.call(o.g)}catch(h){N(h)}var c=X;c.j(o),c.h<100&&(c.h++,o.next=c.g,c.g=o)}ue=!1}function I(){this.u=this.u,this.C=this.C}I.prototype.u=!1,I.prototype.dispose=function(){this.u||(this.u=!0,this.N())},I.prototype[Symbol.dispose]=function(){this.dispose()},I.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function E(o,c){this.type=o,this.g=this.target=c,this.defaultPrevented=!1}E.prototype.h=function(){this.defaultPrevented=!0};var v=(function(){if(!a.addEventListener||!Object.defineProperty)return!1;var o=!1,c=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const h=()=>{};a.addEventListener("test",h,c),a.removeEventListener("test",h,c)}catch{}return o})();function _(o){return/^[\s\xa0]*$/.test(o)}function Re(o,c){E.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o&&this.init(o,c)}g(Re,E),Re.prototype.init=function(o,c){const h=this.type=o.type,f=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;this.target=o.target||o.srcElement,this.g=c,c=o.relatedTarget,c||(h=="mouseover"?c=o.fromElement:h=="mouseout"&&(c=o.toElement)),this.relatedTarget=c,f?(this.clientX=f.clientX!==void 0?f.clientX:f.pageX,this.clientY=f.clientY!==void 0?f.clientY:f.pageY,this.screenX=f.screenX||0,this.screenY=f.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=o.pointerType,this.state=o.state,this.i=o,o.defaultPrevented&&Re.Z.h.call(this)},Re.prototype.h=function(){Re.Z.h.call(this);const o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var xt="closure_listenable_"+(Math.random()*1e6|0),Vf=0;function Df(o,c,h,f,w){this.listener=o,this.proxy=null,this.src=c,this.type=h,this.capture=!!f,this.ha=w,this.key=++Vf,this.da=this.fa=!1}function xr(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function Ur(o,c,h){for(const f in o)c.call(h,o[f],f,o)}function Nf(o,c){for(const h in o)c.call(void 0,o[h],h,o)}function Ma(o){const c={};for(const h in o)c[h]=o[h];return c}const Fa="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function xa(o,c){let h,f;for(let w=1;w<arguments.length;w++){f=arguments[w];for(h in f)o[h]=f[h];for(let S=0;S<Fa.length;S++)h=Fa[S],Object.prototype.hasOwnProperty.call(f,h)&&(o[h]=f[h])}}function Br(o){this.src=o,this.g={},this.h=0}Br.prototype.add=function(o,c,h,f,w){const S=o.toString();o=this.g[S],o||(o=this.g[S]=[],this.h++);const C=_i(o,c,f,w);return C>-1?(c=o[C],h||(c.fa=!1)):(c=new Df(c,this.src,S,!!f,w),c.fa=h,o.push(c)),c};function gi(o,c){const h=c.type;if(h in o.g){var f=o.g[h],w=Array.prototype.indexOf.call(f,c,void 0),S;(S=w>=0)&&Array.prototype.splice.call(f,w,1),S&&(xr(c),o.g[h].length==0&&(delete o.g[h],o.h--))}}function _i(o,c,h,f){for(let w=0;w<o.length;++w){const S=o[w];if(!S.da&&S.listener==c&&S.capture==!!h&&S.ha==f)return w}return-1}var yi="closure_lm_"+(Math.random()*1e6|0),Ei={};function Ua(o,c,h,f,w){if(Array.isArray(c)){for(let S=0;S<c.length;S++)Ua(o,c[S],h,f,w);return null}return h=qa(h),o&&o[xt]?o.J(c,h,u(f)?!!f.capture:!1,w):kf(o,c,h,!1,f,w)}function kf(o,c,h,f,w,S){if(!c)throw Error("Invalid event type");const C=u(w)?!!w.capture:!!w;let j=Ii(o);if(j||(o[yi]=j=new Br(o)),h=j.add(c,h,f,C,S),h.proxy)return h;if(f=Of(),h.proxy=f,f.src=o,f.listener=h,o.addEventListener)v||(w=C),w===void 0&&(w=!1),o.addEventListener(c.toString(),f,w);else if(o.attachEvent)o.attachEvent(ja(c.toString()),f);else if(o.addListener&&o.removeListener)o.addListener(f);else throw Error("addEventListener and attachEvent are unavailable.");return h}function Of(){function o(h){return c.call(o.src,o.listener,h)}const c=Lf;return o}function Ba(o,c,h,f,w){if(Array.isArray(c))for(var S=0;S<c.length;S++)Ba(o,c[S],h,f,w);else f=u(f)?!!f.capture:!!f,h=qa(h),o&&o[xt]?(o=o.i,S=String(c).toString(),S in o.g&&(c=o.g[S],h=_i(c,h,f,w),h>-1&&(xr(c[h]),Array.prototype.splice.call(c,h,1),c.length==0&&(delete o.g[S],o.h--)))):o&&(o=Ii(o))&&(c=o.g[c.toString()],o=-1,c&&(o=_i(c,h,f,w)),(h=o>-1?c[o]:null)&&Ti(h))}function Ti(o){if(typeof o!="number"&&o&&!o.da){var c=o.src;if(c&&c[xt])gi(c.i,o);else{var h=o.type,f=o.proxy;c.removeEventListener?c.removeEventListener(h,f,o.capture):c.detachEvent?c.detachEvent(ja(h),f):c.addListener&&c.removeListener&&c.removeListener(f),(h=Ii(c))?(gi(h,o),h.h==0&&(h.src=null,c[yi]=null)):xr(o)}}}function ja(o){return o in Ei?Ei[o]:Ei[o]="on"+o}function Lf(o,c){if(o.da)o=!0;else{c=new Re(c,this);const h=o.listener,f=o.ha||o.src;o.fa&&Ti(o),o=h.call(f,c)}return o}function Ii(o){return o=o[yi],o instanceof Br?o:null}var wi="__closure_events_fn_"+(Math.random()*1e9>>>0);function qa(o){return typeof o=="function"?o:(o[wi]||(o[wi]=function(c){return o.handleEvent(c)}),o[wi])}function ye(){I.call(this),this.i=new Br(this),this.M=this,this.G=null}g(ye,I),ye.prototype[xt]=!0,ye.prototype.removeEventListener=function(o,c,h,f){Ba(this,o,c,h,f)};function Ae(o,c){var h,f=o.G;if(f)for(h=[];f;f=f.G)h.push(f);if(o=o.M,f=c.type||c,typeof c=="string")c=new E(c,o);else if(c instanceof E)c.target=c.target||o;else{var w=c;c=new E(f,o),xa(c,w)}w=!0;let S,C;if(h)for(C=h.length-1;C>=0;C--)S=c.g=h[C],w=jr(S,f,!0,c)&&w;if(S=c.g=o,w=jr(S,f,!0,c)&&w,w=jr(S,f,!1,c)&&w,h)for(C=0;C<h.length;C++)S=c.g=h[C],w=jr(S,f,!1,c)&&w}ye.prototype.N=function(){if(ye.Z.N.call(this),this.i){var o=this.i;for(const c in o.g){const h=o.g[c];for(let f=0;f<h.length;f++)xr(h[f]);delete o.g[c],o.h--}}this.G=null},ye.prototype.J=function(o,c,h,f){return this.i.add(String(o),c,!1,h,f)},ye.prototype.K=function(o,c,h,f){return this.i.add(String(o),c,!0,h,f)};function jr(o,c,h,f){if(c=o.i.g[String(c)],!c)return!0;c=c.concat();let w=!0;for(let S=0;S<c.length;++S){const C=c[S];if(C&&!C.da&&C.capture==h){const j=C.listener,le=C.ha||C.src;C.fa&&gi(o.i,C),w=j.call(le,f)!==!1&&w}}return w&&!f.defaultPrevented}function Mf(o,c){if(typeof o!="function")if(o&&typeof o.handleEvent=="function")o=d(o.handleEvent,o);else throw Error("Invalid listener argument");return Number(c)>2147483647?-1:a.setTimeout(o,c||0)}function $a(o){o.g=Mf(()=>{o.g=null,o.i&&(o.i=!1,$a(o))},o.l);const c=o.h;o.h=null,o.m.apply(null,c)}class Ff extends I{constructor(c,h){super(),this.m=c,this.l=h,this.h=null,this.i=!1,this.g=null}j(c){this.h=arguments,this.g?this.i=!0:$a(this)}N(){super.N(),this.g&&(a.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Ln(o){I.call(this),this.h=o,this.g={}}g(Ln,I);var za=[];function Ga(o){Ur(o.g,function(c,h){this.g.hasOwnProperty(h)&&Ti(c)},o),o.g={}}Ln.prototype.N=function(){Ln.Z.N.call(this),Ga(this)},Ln.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var vi=a.JSON.stringify,xf=a.JSON.parse,Uf=class{stringify(o){return a.JSON.stringify(o,void 0)}parse(o){return a.JSON.parse(o,void 0)}};function Ha(){}function Wa(){}var Mn={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function Ai(){E.call(this,"d")}g(Ai,E);function Si(){E.call(this,"c")}g(Si,E);var Ut={},Ka=null;function qr(){return Ka=Ka||new ye}Ut.Ia="serverreachability";function Qa(o){E.call(this,Ut.Ia,o)}g(Qa,E);function Fn(o){const c=qr();Ae(c,new Qa(c))}Ut.STAT_EVENT="statevent";function Ya(o,c){E.call(this,Ut.STAT_EVENT,o),this.stat=c}g(Ya,E);function Se(o){const c=qr();Ae(c,new Ya(c,o))}Ut.Ja="timingevent";function Ja(o,c){E.call(this,Ut.Ja,o),this.size=c}g(Ja,E);function xn(o,c){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return a.setTimeout(function(){o()},c)}function Un(){this.g=!0}Un.prototype.ua=function(){this.g=!1};function Bf(o,c,h,f,w,S){o.info(function(){if(o.g)if(S){var C="",j=S.split("&");for(let Y=0;Y<j.length;Y++){var le=j[Y].split("=");if(le.length>1){const fe=le[0];le=le[1];const xe=fe.split("_");C=xe.length>=2&&xe[1]=="type"?C+(fe+"="+le+"&"):C+(fe+"=redacted&")}}}else C=null;else C=S;return"XMLHTTP REQ ("+f+") [attempt "+w+"]: "+c+`
`+h+`
`+C})}function jf(o,c,h,f,w,S,C){o.info(function(){return"XMLHTTP RESP ("+f+") [ attempt "+w+"]: "+c+`
`+h+`
`+S+" "+C})}function on(o,c,h,f){o.info(function(){return"XMLHTTP TEXT ("+c+"): "+$f(o,h)+(f?" "+f:"")})}function qf(o,c){o.info(function(){return"TIMEOUT: "+c})}Un.prototype.info=function(){};function $f(o,c){if(!o.g)return c;if(!c)return null;try{const S=JSON.parse(c);if(S){for(o=0;o<S.length;o++)if(Array.isArray(S[o])){var h=S[o];if(!(h.length<2)){var f=h[1];if(Array.isArray(f)&&!(f.length<1)){var w=f[0];if(w!="noop"&&w!="stop"&&w!="close")for(let C=1;C<f.length;C++)f[C]=""}}}}return vi(S)}catch{return c}}var $r={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},Xa={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},Za;function Ri(){}g(Ri,Ha),Ri.prototype.g=function(){return new XMLHttpRequest},Za=new Ri;function Bn(o){return encodeURIComponent(String(o))}function zf(o){var c=1;o=o.split(":");const h=[];for(;c>0&&o.length;)h.push(o.shift()),c--;return o.length&&h.push(o.join(":")),h}function ct(o,c,h,f){this.j=o,this.i=c,this.l=h,this.S=f||1,this.V=new Ln(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new ec}function ec(){this.i=null,this.g="",this.h=!1}var tc={},Pi={};function bi(o,c,h){o.M=1,o.A=Gr(Fe(c)),o.u=h,o.R=!0,nc(o,null)}function nc(o,c){o.F=Date.now(),zr(o),o.B=Fe(o.A);var h=o.B,f=o.S;Array.isArray(f)||(f=[String(f)]),mc(h.i,"t",f),o.C=0,h=o.j.L,o.h=new ec,o.g=kc(o.j,h?c:null,!o.u),o.P>0&&(o.O=new Ff(d(o.Y,o,o.g),o.P)),c=o.V,h=o.g,f=o.ba;var w="readystatechange";Array.isArray(w)||(w&&(za[0]=w.toString()),w=za);for(let S=0;S<w.length;S++){const C=Ua(h,w[S],f||c.handleEvent,!1,c.h||c);if(!C)break;c.g[C.key]=C}c=o.J?Ma(o.J):{},o.u?(o.v||(o.v="POST"),c["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.B,o.v,o.u,c)):(o.v="GET",o.g.ea(o.B,o.v,null,c)),Fn(),Bf(o.i,o.v,o.B,o.l,o.S,o.u)}ct.prototype.ba=function(o){o=o.target;const c=this.O;c&&ht(o)==3?c.j():this.Y(o)},ct.prototype.Y=function(o){try{if(o==this.g)e:{const j=ht(this.g),le=this.g.ya(),Y=this.g.ca();if(!(j<3)&&(j!=3||this.g&&(this.h.h||this.g.la()||wc(this.g)))){this.K||j!=4||le==7||(le==8||Y<=0?Fn(3):Fn(2)),Ci(this);var c=this.g.ca();this.X=c;var h=Gf(this);if(this.o=c==200,jf(this.i,this.v,this.B,this.l,this.S,j,c),this.o){if(this.U&&!this.L){t:{if(this.g){var f,w=this.g;if((f=w.g?w.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!_(f)){var S=f;break t}}S=null}if(o=S)on(this.i,this.l,o,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,Vi(this,o);else{this.o=!1,this.m=3,Se(12),Bt(this),jn(this);break e}}if(this.R){o=!0;let fe;for(;!this.K&&this.C<h.length;)if(fe=Hf(this,h),fe==Pi){j==4&&(this.m=4,Se(14),o=!1),on(this.i,this.l,null,"[Incomplete Response]");break}else if(fe==tc){this.m=4,Se(15),on(this.i,this.l,h,"[Invalid Chunk]"),o=!1;break}else on(this.i,this.l,fe,null),Vi(this,fe);if(rc(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),j!=4||h.length!=0||this.h.h||(this.m=1,Se(16),o=!1),this.o=this.o&&o,!o)on(this.i,this.l,h,"[Invalid Chunked Response]"),Bt(this),jn(this);else if(h.length>0&&!this.W){this.W=!0;var C=this.j;C.g==this&&C.aa&&!C.P&&(C.j.info("Great, no buffering proxy detected. Bytes received: "+h.length),xi(C),C.P=!0,Se(11))}}else on(this.i,this.l,h,null),Vi(this,h);j==4&&Bt(this),this.o&&!this.K&&(j==4?Cc(this.j,this):(this.o=!1,zr(this)))}else op(this.g),c==400&&h.indexOf("Unknown SID")>0?(this.m=3,Se(12)):(this.m=0,Se(13)),Bt(this),jn(this)}}}catch{}finally{}};function Gf(o){if(!rc(o))return o.g.la();const c=wc(o.g);if(c==="")return"";let h="";const f=c.length,w=ht(o.g)==4;if(!o.h.i){if(typeof TextDecoder>"u")return Bt(o),jn(o),"";o.h.i=new a.TextDecoder}for(let S=0;S<f;S++)o.h.h=!0,h+=o.h.i.decode(c[S],{stream:!(w&&S==f-1)});return c.length=0,o.h.g+=h,o.C=0,o.h.g}function rc(o){return o.g?o.v=="GET"&&o.M!=2&&o.j.Aa:!1}function Hf(o,c){var h=o.C,f=c.indexOf(`
`,h);return f==-1?Pi:(h=Number(c.substring(h,f)),isNaN(h)?tc:(f+=1,f+h>c.length?Pi:(c=c.slice(f,f+h),o.C=f+h,c)))}ct.prototype.cancel=function(){this.K=!0,Bt(this)};function zr(o){o.T=Date.now()+o.H,sc(o,o.H)}function sc(o,c){if(o.D!=null)throw Error("WatchDog timer not null");o.D=xn(d(o.aa,o),c)}function Ci(o){o.D&&(a.clearTimeout(o.D),o.D=null)}ct.prototype.aa=function(){this.D=null;const o=Date.now();o-this.T>=0?(qf(this.i,this.B),this.M!=2&&(Fn(),Se(17)),Bt(this),this.m=2,jn(this)):sc(this,this.T-o)};function jn(o){o.j.I==0||o.K||Cc(o.j,o)}function Bt(o){Ci(o);var c=o.O;c&&typeof c.dispose=="function"&&c.dispose(),o.O=null,Ga(o.V),o.g&&(c=o.g,o.g=null,c.abort(),c.dispose())}function Vi(o,c){try{var h=o.j;if(h.I!=0&&(h.g==o||Di(h.h,o))){if(!o.L&&Di(h.h,o)&&h.I==3){try{var f=h.Ba.g.parse(c)}catch{f=null}if(Array.isArray(f)&&f.length==3){var w=f;if(w[0]==0){e:if(!h.v){if(h.g)if(h.g.F+3e3<o.F)Yr(h),Kr(h);else break e;Fi(h),Se(18)}}else h.xa=w[1],0<h.xa-h.K&&w[2]<37500&&h.F&&h.A==0&&!h.C&&(h.C=xn(d(h.Va,h),6e3));ac(h.h)<=1&&h.ta&&(h.ta=void 0)}else qt(h,11)}else if((o.L||h.g==o)&&Yr(h),!_(c))for(w=h.Ba.g.parse(c),c=0;c<w.length;c++){let Y=w[c];const fe=Y[0];if(!(fe<=h.K))if(h.K=fe,Y=Y[1],h.I==2)if(Y[0]=="c"){h.M=Y[1],h.ba=Y[2];const xe=Y[3];xe!=null&&(h.ka=xe,h.j.info("VER="+h.ka));const $t=Y[4];$t!=null&&(h.za=$t,h.j.info("SVER="+h.za));const dt=Y[5];dt!=null&&typeof dt=="number"&&dt>0&&(f=1.5*dt,h.O=f,h.j.info("backChannelRequestTimeoutMs_="+f)),f=h;const ft=o.g;if(ft){const Xr=ft.g?ft.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Xr){var S=f.h;S.g||Xr.indexOf("spdy")==-1&&Xr.indexOf("quic")==-1&&Xr.indexOf("h2")==-1||(S.j=S.l,S.g=new Set,S.h&&(Ni(S,S.h),S.h=null))}if(f.G){const Ui=ft.g?ft.g.getResponseHeader("X-HTTP-Session-Id"):null;Ui&&(f.wa=Ui,Z(f.J,f.G,Ui))}}h.I=3,h.l&&h.l.ra(),h.aa&&(h.T=Date.now()-o.F,h.j.info("Handshake RTT: "+h.T+"ms")),f=h;var C=o;if(f.na=Nc(f,f.L?f.ba:null,f.W),C.L){cc(f.h,C);var j=C,le=f.O;le&&(j.H=le),j.D&&(Ci(j),zr(j)),f.g=C}else Pc(f);h.i.length>0&&Qr(h)}else Y[0]!="stop"&&Y[0]!="close"||qt(h,7);else h.I==3&&(Y[0]=="stop"||Y[0]=="close"?Y[0]=="stop"?qt(h,7):Mi(h):Y[0]!="noop"&&h.l&&h.l.qa(Y),h.A=0)}}Fn(4)}catch{}}var Wf=class{constructor(o,c){this.g=o,this.map=c}};function ic(o){this.l=o||10,a.PerformanceNavigationTiming?(o=a.performance.getEntriesByType("navigation"),o=o.length>0&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(a.chrome&&a.chrome.loadTimes&&a.chrome.loadTimes()&&a.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function oc(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function ac(o){return o.h?1:o.g?o.g.size:0}function Di(o,c){return o.h?o.h==c:o.g?o.g.has(c):!1}function Ni(o,c){o.g?o.g.add(c):o.h=c}function cc(o,c){o.h&&o.h==c?o.h=null:o.g&&o.g.has(c)&&o.g.delete(c)}ic.prototype.cancel=function(){if(this.i=uc(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function uc(o){if(o.h!=null)return o.i.concat(o.h.G);if(o.g!=null&&o.g.size!==0){let c=o.i;for(const h of o.g.values())c=c.concat(h.G);return c}return b(o.i)}var lc=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Kf(o,c){if(o){o=o.split("&");for(let h=0;h<o.length;h++){const f=o[h].indexOf("=");let w,S=null;f>=0?(w=o[h].substring(0,f),S=o[h].substring(f+1)):w=o[h],c(w,S?decodeURIComponent(S.replace(/\+/g," ")):"")}}}function ut(o){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let c;o instanceof ut?(this.l=o.l,qn(this,o.j),this.o=o.o,this.g=o.g,$n(this,o.u),this.h=o.h,ki(this,gc(o.i)),this.m=o.m):o&&(c=String(o).match(lc))?(this.l=!1,qn(this,c[1]||"",!0),this.o=zn(c[2]||""),this.g=zn(c[3]||"",!0),$n(this,c[4]),this.h=zn(c[5]||"",!0),ki(this,c[6]||"",!0),this.m=zn(c[7]||"")):(this.l=!1,this.i=new Hn(null,this.l))}ut.prototype.toString=function(){const o=[];var c=this.j;c&&o.push(Gn(c,hc,!0),":");var h=this.g;return(h||c=="file")&&(o.push("//"),(c=this.o)&&o.push(Gn(c,hc,!0),"@"),o.push(Bn(h).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),h=this.u,h!=null&&o.push(":",String(h))),(h=this.h)&&(this.g&&h.charAt(0)!="/"&&o.push("/"),o.push(Gn(h,h.charAt(0)=="/"?Jf:Yf,!0))),(h=this.i.toString())&&o.push("?",h),(h=this.m)&&o.push("#",Gn(h,Zf)),o.join("")},ut.prototype.resolve=function(o){const c=Fe(this);let h=!!o.j;h?qn(c,o.j):h=!!o.o,h?c.o=o.o:h=!!o.g,h?c.g=o.g:h=o.u!=null;var f=o.h;if(h)$n(c,o.u);else if(h=!!o.h){if(f.charAt(0)!="/")if(this.g&&!this.h)f="/"+f;else{var w=c.h.lastIndexOf("/");w!=-1&&(f=c.h.slice(0,w+1)+f)}if(w=f,w==".."||w==".")f="";else if(w.indexOf("./")!=-1||w.indexOf("/.")!=-1){f=w.lastIndexOf("/",0)==0,w=w.split("/");const S=[];for(let C=0;C<w.length;){const j=w[C++];j=="."?f&&C==w.length&&S.push(""):j==".."?((S.length>1||S.length==1&&S[0]!="")&&S.pop(),f&&C==w.length&&S.push("")):(S.push(j),f=!0)}f=S.join("/")}else f=w}return h?c.h=f:h=o.i.toString()!=="",h?ki(c,gc(o.i)):h=!!o.m,h&&(c.m=o.m),c};function Fe(o){return new ut(o)}function qn(o,c,h){o.j=h?zn(c,!0):c,o.j&&(o.j=o.j.replace(/:$/,""))}function $n(o,c){if(c){if(c=Number(c),isNaN(c)||c<0)throw Error("Bad port number "+c);o.u=c}else o.u=null}function ki(o,c,h){c instanceof Hn?(o.i=c,ep(o.i,o.l)):(h||(c=Gn(c,Xf)),o.i=new Hn(c,o.l))}function Z(o,c,h){o.i.set(c,h)}function Gr(o){return Z(o,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),o}function zn(o,c){return o?c?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function Gn(o,c,h){return typeof o=="string"?(o=encodeURI(o).replace(c,Qf),h&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function Qf(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var hc=/[#\/\?@]/g,Yf=/[#\?:]/g,Jf=/[#\?]/g,Xf=/[#\?@]/g,Zf=/#/g;function Hn(o,c){this.h=this.g=null,this.i=o||null,this.j=!!c}function jt(o){o.g||(o.g=new Map,o.h=0,o.i&&Kf(o.i,function(c,h){o.add(decodeURIComponent(c.replace(/\+/g," ")),h)}))}n=Hn.prototype,n.add=function(o,c){jt(this),this.i=null,o=an(this,o);let h=this.g.get(o);return h||this.g.set(o,h=[]),h.push(c),this.h+=1,this};function dc(o,c){jt(o),c=an(o,c),o.g.has(c)&&(o.i=null,o.h-=o.g.get(c).length,o.g.delete(c))}function fc(o,c){return jt(o),c=an(o,c),o.g.has(c)}n.forEach=function(o,c){jt(this),this.g.forEach(function(h,f){h.forEach(function(w){o.call(c,w,f,this)},this)},this)};function pc(o,c){jt(o);let h=[];if(typeof c=="string")fc(o,c)&&(h=h.concat(o.g.get(an(o,c))));else for(o=Array.from(o.g.values()),c=0;c<o.length;c++)h=h.concat(o[c]);return h}n.set=function(o,c){return jt(this),this.i=null,o=an(this,o),fc(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[c]),this.h+=1,this},n.get=function(o,c){return o?(o=pc(this,o),o.length>0?String(o[0]):c):c};function mc(o,c,h){dc(o,c),h.length>0&&(o.i=null,o.g.set(an(o,c),b(h)),o.h+=h.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],c=Array.from(this.g.keys());for(let f=0;f<c.length;f++){var h=c[f];const w=Bn(h);h=pc(this,h);for(let S=0;S<h.length;S++){let C=w;h[S]!==""&&(C+="="+Bn(h[S])),o.push(C)}}return this.i=o.join("&")};function gc(o){const c=new Hn;return c.i=o.i,o.g&&(c.g=new Map(o.g),c.h=o.h),c}function an(o,c){return c=String(c),o.j&&(c=c.toLowerCase()),c}function ep(o,c){c&&!o.j&&(jt(o),o.i=null,o.g.forEach(function(h,f){const w=f.toLowerCase();f!=w&&(dc(this,f),mc(this,w,h))},o)),o.j=c}function tp(o,c){const h=new Un;if(a.Image){const f=new Image;f.onload=p(lt,h,"TestLoadImage: loaded",!0,c,f),f.onerror=p(lt,h,"TestLoadImage: error",!1,c,f),f.onabort=p(lt,h,"TestLoadImage: abort",!1,c,f),f.ontimeout=p(lt,h,"TestLoadImage: timeout",!1,c,f),a.setTimeout(function(){f.ontimeout&&f.ontimeout()},1e4),f.src=o}else c(!1)}function np(o,c){const h=new Un,f=new AbortController,w=setTimeout(()=>{f.abort(),lt(h,"TestPingServer: timeout",!1,c)},1e4);fetch(o,{signal:f.signal}).then(S=>{clearTimeout(w),S.ok?lt(h,"TestPingServer: ok",!0,c):lt(h,"TestPingServer: server error",!1,c)}).catch(()=>{clearTimeout(w),lt(h,"TestPingServer: error",!1,c)})}function lt(o,c,h,f,w){try{w&&(w.onload=null,w.onerror=null,w.onabort=null,w.ontimeout=null),f(h)}catch{}}function rp(){this.g=new Uf}function Oi(o){this.i=o.Sb||null,this.h=o.ab||!1}g(Oi,Ha),Oi.prototype.g=function(){return new Hr(this.i,this.h)};function Hr(o,c){ye.call(this),this.H=o,this.o=c,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}g(Hr,ye),n=Hr.prototype,n.open=function(o,c){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=o,this.D=c,this.readyState=1,Kn(this)},n.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const c={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};o&&(c.body=o),(this.H||a).fetch(new Request(this.D,c)).then(this.Pa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,Wn(this)),this.readyState=0},n.Pa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,Kn(this)),this.g&&(this.readyState=3,Kn(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof a.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;_c(this)}else o.text().then(this.Oa.bind(this),this.ga.bind(this))};function _c(o){o.j.read().then(o.Ma.bind(o)).catch(o.ga.bind(o))}n.Ma=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var c=o.value?o.value:new Uint8Array(0);(c=this.B.decode(c,{stream:!o.done}))&&(this.response=this.responseText+=c)}o.done?Wn(this):Kn(this),this.readyState==3&&_c(this)}},n.Oa=function(o){this.g&&(this.response=this.responseText=o,Wn(this))},n.Na=function(o){this.g&&(this.response=o,Wn(this))},n.ga=function(){this.g&&Wn(this)};function Wn(o){o.readyState=4,o.l=null,o.j=null,o.B=null,Kn(o)}n.setRequestHeader=function(o,c){this.A.append(o,c)},n.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],c=this.h.entries();for(var h=c.next();!h.done;)h=h.value,o.push(h[0]+": "+h[1]),h=c.next();return o.join(`\r
`)};function Kn(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(Hr.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function yc(o){let c="";return Ur(o,function(h,f){c+=f,c+=":",c+=h,c+=`\r
`}),c}function Li(o,c,h){e:{for(f in h){var f=!1;break e}f=!0}f||(h=yc(h),typeof o=="string"?h!=null&&Bn(h):Z(o,c,h))}function re(o){ye.call(this),this.headers=new Map,this.L=o||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}g(re,ye);var sp=/^https?$/i,ip=["POST","PUT"];n=re.prototype,n.Fa=function(o){this.H=o},n.ea=function(o,c,h,f){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);c=c?c.toUpperCase():"GET",this.D=o,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():Za.g(),this.g.onreadystatechange=A(d(this.Ca,this));try{this.B=!0,this.g.open(c,String(o),!0),this.B=!1}catch(S){Ec(this,S);return}if(o=h||"",h=new Map(this.headers),f)if(Object.getPrototypeOf(f)===Object.prototype)for(var w in f)h.set(w,f[w]);else if(typeof f.keys=="function"&&typeof f.get=="function")for(const S of f.keys())h.set(S,f.get(S));else throw Error("Unknown input type for opt_headers: "+String(f));f=Array.from(h.keys()).find(S=>S.toLowerCase()=="content-type"),w=a.FormData&&o instanceof a.FormData,!(Array.prototype.indexOf.call(ip,c,void 0)>=0)||f||w||h.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[S,C]of h)this.g.setRequestHeader(S,C);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(o),this.v=!1}catch(S){Ec(this,S)}};function Ec(o,c){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=c,o.o=5,Tc(o),Wr(o)}function Tc(o){o.A||(o.A=!0,Ae(o,"complete"),Ae(o,"error"))}n.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=o||7,Ae(this,"complete"),Ae(this,"abort"),Wr(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Wr(this,!0)),re.Z.N.call(this)},n.Ca=function(){this.u||(this.B||this.v||this.j?Ic(this):this.Xa())},n.Xa=function(){Ic(this)};function Ic(o){if(o.h&&typeof i<"u"){if(o.v&&ht(o)==4)setTimeout(o.Ca.bind(o),0);else if(Ae(o,"readystatechange"),ht(o)==4){o.h=!1;try{const S=o.ca();e:switch(S){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var c=!0;break e;default:c=!1}var h;if(!(h=c)){var f;if(f=S===0){let C=String(o.D).match(lc)[1]||null;!C&&a.self&&a.self.location&&(C=a.self.location.protocol.slice(0,-1)),f=!sp.test(C?C.toLowerCase():"")}h=f}if(h)Ae(o,"complete"),Ae(o,"success");else{o.o=6;try{var w=ht(o)>2?o.g.statusText:""}catch{w=""}o.l=w+" ["+o.ca()+"]",Tc(o)}}finally{Wr(o)}}}}function Wr(o,c){if(o.g){o.m&&(clearTimeout(o.m),o.m=null);const h=o.g;o.g=null,c||Ae(o,"ready");try{h.onreadystatechange=null}catch{}}}n.isActive=function(){return!!this.g};function ht(o){return o.g?o.g.readyState:0}n.ca=function(){try{return ht(this)>2?this.g.status:-1}catch{return-1}},n.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.La=function(o){if(this.g){var c=this.g.responseText;return o&&c.indexOf(o)==0&&(c=c.substring(o.length)),xf(c)}};function wc(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.F){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function op(o){const c={};o=(o.g&&ht(o)>=2&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let f=0;f<o.length;f++){if(_(o[f]))continue;var h=zf(o[f]);const w=h[0];if(h=h[1],typeof h!="string")continue;h=h.trim();const S=c[w]||[];c[w]=S,S.push(h)}Nf(c,function(f){return f.join(", ")})}n.ya=function(){return this.o},n.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Qn(o,c,h){return h&&h.internalChannelParams&&h.internalChannelParams[o]||c}function vc(o){this.za=0,this.i=[],this.j=new Un,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Qn("failFast",!1,o),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Qn("baseRetryDelayMs",5e3,o),this.Za=Qn("retryDelaySeedMs",1e4,o),this.Ta=Qn("forwardChannelMaxRetries",2,o),this.va=Qn("forwardChannelRequestTimeoutMs",2e4,o),this.ma=o&&o.xmlHttpFactory||void 0,this.Ua=o&&o.Rb||void 0,this.Aa=o&&o.useFetchStreams||!1,this.O=void 0,this.L=o&&o.supportsCrossDomainXhr||!1,this.M="",this.h=new ic(o&&o.concurrentRequestLimit),this.Ba=new rp,this.S=o&&o.fastHandshake||!1,this.R=o&&o.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=o&&o.Pb||!1,o&&o.ua&&this.j.ua(),o&&o.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&o&&o.detectBufferingProxy||!1,this.ia=void 0,o&&o.longPollingTimeout&&o.longPollingTimeout>0&&(this.ia=o.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}n=vc.prototype,n.ka=8,n.I=1,n.connect=function(o,c,h,f){Se(0),this.W=o,this.H=c||{},h&&f!==void 0&&(this.H.OSID=h,this.H.OAID=f),this.F=this.X,this.J=Nc(this,null,this.W),Qr(this)};function Mi(o){if(Ac(o),o.I==3){var c=o.V++,h=Fe(o.J);if(Z(h,"SID",o.M),Z(h,"RID",c),Z(h,"TYPE","terminate"),Yn(o,h),c=new ct(o,o.j,c),c.M=2,c.A=Gr(Fe(h)),h=!1,a.navigator&&a.navigator.sendBeacon)try{h=a.navigator.sendBeacon(c.A.toString(),"")}catch{}!h&&a.Image&&(new Image().src=c.A,h=!0),h||(c.g=kc(c.j,null),c.g.ea(c.A)),c.F=Date.now(),zr(c)}Dc(o)}function Kr(o){o.g&&(xi(o),o.g.cancel(),o.g=null)}function Ac(o){Kr(o),o.v&&(a.clearTimeout(o.v),o.v=null),Yr(o),o.h.cancel(),o.m&&(typeof o.m=="number"&&a.clearTimeout(o.m),o.m=null)}function Qr(o){if(!oc(o.h)&&!o.m){o.m=!0;var c=o.Ea;de||m(),ue||(de(),ue=!0),T.add(c,o),o.D=0}}function ap(o,c){return ac(o.h)>=o.h.j-(o.m?1:0)?!1:o.m?(o.i=c.G.concat(o.i),!0):o.I==1||o.I==2||o.D>=(o.Sa?0:o.Ta)?!1:(o.m=xn(d(o.Ea,o,c),Vc(o,o.D)),o.D++,!0)}n.Ea=function(o){if(this.m)if(this.m=null,this.I==1){if(!o){this.V=Math.floor(Math.random()*1e5),o=this.V++;const w=new ct(this,this.j,o);let S=this.o;if(this.U&&(S?(S=Ma(S),xa(S,this.U)):S=this.U),this.u!==null||this.R||(w.J=S,S=null),this.S)e:{for(var c=0,h=0;h<this.i.length;h++){t:{var f=this.i[h];if("__data__"in f.map&&(f=f.map.__data__,typeof f=="string")){f=f.length;break t}f=void 0}if(f===void 0)break;if(c+=f,c>4096){c=h;break e}if(c===4096||h===this.i.length-1){c=h+1;break e}}c=1e3}else c=1e3;c=Rc(this,w,c),h=Fe(this.J),Z(h,"RID",o),Z(h,"CVER",22),this.G&&Z(h,"X-HTTP-Session-Id",this.G),Yn(this,h),S&&(this.R?c="headers="+Bn(yc(S))+"&"+c:this.u&&Li(h,this.u,S)),Ni(this.h,w),this.Ra&&Z(h,"TYPE","init"),this.S?(Z(h,"$req",c),Z(h,"SID","null"),w.U=!0,bi(w,h,null)):bi(w,h,c),this.I=2}}else this.I==3&&(o?Sc(this,o):this.i.length==0||oc(this.h)||Sc(this))};function Sc(o,c){var h;c?h=c.l:h=o.V++;const f=Fe(o.J);Z(f,"SID",o.M),Z(f,"RID",h),Z(f,"AID",o.K),Yn(o,f),o.u&&o.o&&Li(f,o.u,o.o),h=new ct(o,o.j,h,o.D+1),o.u===null&&(h.J=o.o),c&&(o.i=c.G.concat(o.i)),c=Rc(o,h,1e3),h.H=Math.round(o.va*.5)+Math.round(o.va*.5*Math.random()),Ni(o.h,h),bi(h,f,c)}function Yn(o,c){o.H&&Ur(o.H,function(h,f){Z(c,f,h)}),o.l&&Ur({},function(h,f){Z(c,f,h)})}function Rc(o,c,h){h=Math.min(o.i.length,h);const f=o.l?d(o.l.Ka,o.l,o):null;e:{var w=o.i;let j=-1;for(;;){const le=["count="+h];j==-1?h>0?(j=w[0].g,le.push("ofs="+j)):j=0:le.push("ofs="+j);let Y=!0;for(let fe=0;fe<h;fe++){var S=w[fe].g;const xe=w[fe].map;if(S-=j,S<0)j=Math.max(0,w[fe].g-100),Y=!1;else try{S="req"+S+"_"||"";try{var C=xe instanceof Map?xe:Object.entries(xe);for(const[$t,dt]of C){let ft=dt;u(dt)&&(ft=vi(dt)),le.push(S+$t+"="+encodeURIComponent(ft))}}catch($t){throw le.push(S+"type="+encodeURIComponent("_badmap")),$t}}catch{f&&f(xe)}}if(Y){C=le.join("&");break e}}C=void 0}return o=o.i.splice(0,h),c.G=o,C}function Pc(o){if(!o.g&&!o.v){o.Y=1;var c=o.Da;de||m(),ue||(de(),ue=!0),T.add(c,o),o.A=0}}function Fi(o){return o.g||o.v||o.A>=3?!1:(o.Y++,o.v=xn(d(o.Da,o),Vc(o,o.A)),o.A++,!0)}n.Da=function(){if(this.v=null,bc(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var o=4*this.T;this.j.info("BP detection timer enabled: "+o),this.B=xn(d(this.Wa,this),o)}},n.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,Se(10),Kr(this),bc(this))};function xi(o){o.B!=null&&(a.clearTimeout(o.B),o.B=null)}function bc(o){o.g=new ct(o,o.j,"rpc",o.Y),o.u===null&&(o.g.J=o.o),o.g.P=0;var c=Fe(o.na);Z(c,"RID","rpc"),Z(c,"SID",o.M),Z(c,"AID",o.K),Z(c,"CI",o.F?"0":"1"),!o.F&&o.ia&&Z(c,"TO",o.ia),Z(c,"TYPE","xmlhttp"),Yn(o,c),o.u&&o.o&&Li(c,o.u,o.o),o.O&&(o.g.H=o.O);var h=o.g;o=o.ba,h.M=1,h.A=Gr(Fe(c)),h.u=null,h.R=!0,nc(h,o)}n.Va=function(){this.C!=null&&(this.C=null,Kr(this),Fi(this),Se(19))};function Yr(o){o.C!=null&&(a.clearTimeout(o.C),o.C=null)}function Cc(o,c){var h=null;if(o.g==c){Yr(o),xi(o),o.g=null;var f=2}else if(Di(o.h,c))h=c.G,cc(o.h,c),f=1;else return;if(o.I!=0){if(c.o)if(f==1){h=c.u?c.u.length:0,c=Date.now()-c.F;var w=o.D;f=qr(),Ae(f,new Ja(f,h)),Qr(o)}else Pc(o);else if(w=c.m,w==3||w==0&&c.X>0||!(f==1&&ap(o,c)||f==2&&Fi(o)))switch(h&&h.length>0&&(c=o.h,c.i=c.i.concat(h)),w){case 1:qt(o,5);break;case 4:qt(o,10);break;case 3:qt(o,6);break;default:qt(o,2)}}}function Vc(o,c){let h=o.Qa+Math.floor(Math.random()*o.Za);return o.isActive()||(h*=2),h*c}function qt(o,c){if(o.j.info("Error code "+c),c==2){var h=d(o.bb,o),f=o.Ua;const w=!f;f=new ut(f||"//www.google.com/images/cleardot.gif"),a.location&&a.location.protocol=="http"||qn(f,"https"),Gr(f),w?tp(f.toString(),h):np(f.toString(),h)}else Se(2);o.I=0,o.l&&o.l.pa(c),Dc(o),Ac(o)}n.bb=function(o){o?(this.j.info("Successfully pinged google.com"),Se(2)):(this.j.info("Failed to ping google.com"),Se(1))};function Dc(o){if(o.I=0,o.ja=[],o.l){const c=uc(o.h);(c.length!=0||o.i.length!=0)&&(k(o.ja,c),k(o.ja,o.i),o.h.i.length=0,b(o.i),o.i.length=0),o.l.oa()}}function Nc(o,c,h){var f=h instanceof ut?Fe(h):new ut(h);if(f.g!="")c&&(f.g=c+"."+f.g),$n(f,f.u);else{var w=a.location;f=w.protocol,c=c?c+"."+w.hostname:w.hostname,w=+w.port;const S=new ut(null);f&&qn(S,f),c&&(S.g=c),w&&$n(S,w),h&&(S.h=h),f=S}return h=o.G,c=o.wa,h&&c&&Z(f,h,c),Z(f,"VER",o.ka),Yn(o,f),f}function kc(o,c,h){if(c&&!o.L)throw Error("Can't create secondary domain capable XhrIo object.");return c=o.Aa&&!o.ma?new re(new Oi({ab:h})):new re(o.ma),c.Fa(o.L),c}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function Oc(){}n=Oc.prototype,n.ra=function(){},n.qa=function(){},n.pa=function(){},n.oa=function(){},n.isActive=function(){return!0},n.Ka=function(){};function Jr(){}Jr.prototype.g=function(o,c){return new be(o,c)};function be(o,c){ye.call(this),this.g=new vc(c),this.l=o,this.h=c&&c.messageUrlParams||null,o=c&&c.messageHeaders||null,c&&c.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=c&&c.initMessageHeaders||null,c&&c.messageContentType&&(o?o["X-WebChannel-Content-Type"]=c.messageContentType:o={"X-WebChannel-Content-Type":c.messageContentType}),c&&c.sa&&(o?o["X-WebChannel-Client-Profile"]=c.sa:o={"X-WebChannel-Client-Profile":c.sa}),this.g.U=o,(o=c&&c.Qb)&&!_(o)&&(this.g.u=o),this.A=c&&c.supportsCrossDomainXhr||!1,this.v=c&&c.sendRawJson||!1,(c=c&&c.httpSessionIdParam)&&!_(c)&&(this.g.G=c,o=this.h,o!==null&&c in o&&(o=this.h,c in o&&delete o[c])),this.j=new cn(this)}g(be,ye),be.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},be.prototype.close=function(){Mi(this.g)},be.prototype.o=function(o){var c=this.g;if(typeof o=="string"){var h={};h.__data__=o,o=h}else this.v&&(h={},h.__data__=vi(o),o=h);c.i.push(new Wf(c.Ya++,o)),c.I==3&&Qr(c)},be.prototype.N=function(){this.g.l=null,delete this.j,Mi(this.g),delete this.g,be.Z.N.call(this)};function Lc(o){Ai.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var c=o.__sm__;if(c){e:{for(const h in c){o=h;break e}o=void 0}(this.i=o)&&(o=this.i,c=c!==null&&o in c?c[o]:void 0),this.data=c}else this.data=o}g(Lc,Ai);function Mc(){Si.call(this),this.status=1}g(Mc,Si);function cn(o){this.g=o}g(cn,Oc),cn.prototype.ra=function(){Ae(this.g,"a")},cn.prototype.qa=function(o){Ae(this.g,new Lc(o))},cn.prototype.pa=function(o){Ae(this.g,new Mc)},cn.prototype.oa=function(){Ae(this.g,"b")},Jr.prototype.createWebChannel=Jr.prototype.g,be.prototype.send=be.prototype.o,be.prototype.open=be.prototype.m,be.prototype.close=be.prototype.close,th=function(){return new Jr},eh=function(){return qr()},Zl=Ut,ho={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},$r.NO_ERROR=0,$r.TIMEOUT=8,$r.HTTP_ERROR=6,ps=$r,Xa.COMPLETE="complete",Xl=Xa,Wa.EventType=Mn,Mn.OPEN="a",Mn.CLOSE="b",Mn.ERROR="c",Mn.MESSAGE="d",ye.prototype.listen=ye.prototype.J,tr=Wa,re.prototype.listenOnce=re.prototype.K,re.prototype.getLastError=re.prototype.Ha,re.prototype.getLastErrorCode=re.prototype.ya,re.prototype.getStatus=re.prototype.ca,re.prototype.getResponseJson=re.prototype.La,re.prototype.getResponseText=re.prototype.la,re.prototype.send=re.prototype.ea,re.prototype.setWithCredentials=re.prototype.Fa,Jl=re}).apply(typeof ns<"u"?ns:typeof self<"u"?self:typeof window<"u"?window:{});/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Te{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Te.UNAUTHENTICATED=new Te(null),Te.GOOGLE_CREDENTIALS=new Te("google-credentials-uid"),Te.FIRST_PARTY=new Te("first-party-uid"),Te.MOCK_USER=new Te("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Cn="12.14.0";function yg(n){Cn=n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yt=new Do("@firebase/firestore");function un(){return Yt.logLevel}function V(n,...e){if(Yt.logLevel<=G.DEBUG){const t=e.map(Oo);Yt.debug(`Firestore (${Cn}): ${n}`,...t)}}function tt(n,...e){if(Yt.logLevel<=G.ERROR){const t=e.map(Oo);Yt.error(`Firestore (${Cn}): ${n}`,...t)}}function Jt(n,...e){if(Yt.logLevel<=G.WARN){const t=e.map(Oo);Yt.warn(`Firestore (${Cn}): ${n}`,...t)}}function Oo(n){if(typeof n=="string")return n;try{return(function(t){return JSON.stringify(t)})(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function F(n,e,t){let r="Unexpected state";typeof e=="string"?r=e:t=e,nh(n,r,t)}function nh(n,e,t){let r=`FIRESTORE (${Cn}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{r+=" CONTEXT: "+JSON.stringify(t)}catch{r+=" CONTEXT: "+t}throw tt(r),new Error(r)}function Q(n,e,t,r){let s="Unexpected state";typeof t=="string"?s=t:r=t,n||nh(e,s,r)}function B(n,e){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const R={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class D extends ot{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xe{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rh{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Eg{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Te.UNAUTHENTICATED)))}shutdown(){}}class Tg{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class Ig{constructor(e){this.t=e,this.currentUser=Te.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Q(this.o===void 0,42304);let r=this.i;const s=l=>this.i!==r?(r=this.i,t(l)):Promise.resolve();let i=new Xe;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new Xe,e.enqueueRetryable((()=>s(this.currentUser)))};const a=()=>{const l=i;e.enqueueRetryable((async()=>{await l.promise,await s(this.currentUser)}))},u=l=>{V("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=l,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit((l=>u(l))),setTimeout((()=>{if(!this.auth){const l=this.t.getImmediate({optional:!0});l?u(l):(V("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new Xe)}}),0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((r=>this.i!==e?(V("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(Q(typeof r.accessToken=="string",31837,{l:r}),new rh(r.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Q(e===null||typeof e=="string",2055,{h:e}),new Te(e)}}class wg{constructor(e,t,r){this.P=e,this.T=t,this.I=r,this.type="FirstParty",this.user=Te.FIRST_PARTY,this.R=new Map}A(){return this.I?this.I():null}get headers(){this.R.set("X-Goog-AuthUser",this.P);const e=this.A();return e&&this.R.set("Authorization",e),this.T&&this.R.set("X-Goog-Iam-Authorization-Token",this.T),this.R}}class vg{constructor(e,t,r){this.P=e,this.T=t,this.I=r}getToken(){return Promise.resolve(new wg(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(Te.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Zc{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Ag{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Ne(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){Q(this.o===void 0,3512);const r=i=>{i.error!=null&&V("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const a=i.token!==this.m;return this.m=i.token,V("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable((()=>r(i)))};const s=i=>{V("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((i=>s(i))),setTimeout((()=>{if(!this.appCheck){const i=this.V.getImmediate({optional:!0});i?s(i):V("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Zc(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(Q(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new Zc(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sg(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lo{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const s=Sg(40);for(let i=0;i<s.length;++i)r.length<20&&s[i]<t&&(r+=e.charAt(s[i]%62))}return r}}function $(n,e){return n<e?-1:n>e?1:0}function fo(n,e){const t=Math.min(n.length,e.length);for(let r=0;r<t;r++){const s=n.charAt(r),i=e.charAt(r);if(s!==i)return Qi(s)===Qi(i)?$(s,i):Qi(s)?1:-1}return $(n.length,e.length)}const Rg=55296,Pg=57343;function Qi(n){const e=n.charCodeAt(0);return e>=Rg&&e<=Pg}function An(n,e,t){return n.length===e.length&&n.every(((r,s)=>t(r,e[s])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eu="__name__";class Ue{constructor(e,t,r){t===void 0?t=0:t>e.length&&F(637,{offset:t,range:e.length}),r===void 0?r=e.length-t:r>e.length-t&&F(1746,{length:r,range:e.length-t}),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return Ue.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Ue?e.forEach((r=>{t.push(r)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let s=0;s<r;s++){const i=Ue.compareSegments(e.get(s),t.get(s));if(i!==0)return i}return $(e.length,t.length)}static compareSegments(e,t){const r=Ue.isNumericId(e),s=Ue.isNumericId(t);return r&&!s?-1:!r&&s?1:r&&s?Ue.extractNumericId(e).compare(Ue.extractNumericId(t)):fo(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return vt.fromString(e.substring(4,e.length-2))}}class J extends Ue{construct(e,t,r){return new J(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new D(R.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter((s=>s.length>0)))}return new J(t)}static emptyPath(){return new J([])}}const bg=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ge extends Ue{construct(e,t,r){return new ge(e,t,r)}static isValidIdentifier(e){return bg.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ge.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===eu}static keyField(){return new ge([eu])}static fromServerFormat(e){const t=[];let r="",s=0;const i=()=>{if(r.length===0)throw new D(R.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let a=!1;for(;s<e.length;){const u=e[s];if(u==="\\"){if(s+1===e.length)throw new D(R.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const l=e[s+1];if(l!=="\\"&&l!=="."&&l!=="`")throw new D(R.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=l,s+=2}else u==="`"?(a=!a,s++):u!=="."||a?(r+=u,s++):(i(),s++)}if(i(),a)throw new D(R.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new ge(t)}static emptyPath(){return new ge([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L{constructor(e){this.path=e}static fromPath(e){return new L(J.fromString(e))}static fromName(e){return new L(J.fromString(e).popFirst(5))}static empty(){return new L(J.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&J.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return J.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new L(new J(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sh(n,e,t){if(!t)throw new D(R.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function Cg(n,e,t,r){if(e===!0&&r===!0)throw new D(R.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function tu(n){if(!L.isDocumentKey(n))throw new D(R.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function nu(n){if(L.isDocumentKey(n))throw new D(R.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function ih(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function Ws(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=(function(r){return r.constructor?r.constructor.name:null})(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":F(12329,{type:typeof n})}function Xt(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new D(R.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Ws(n);throw new D(R.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}function Vg(n,e){if(e<=0)throw new D(R.INVALID_ARGUMENT,`Function ${n}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ae(n,e){const t={typeString:n};return e&&(t.value=e),t}function Cr(n,e){if(!ih(n))throw new D(R.INVALID_ARGUMENT,"JSON must be an object");let t;for(const r in e)if(e[r]){const s=e[r].typeString,i="value"in e[r]?{value:e[r].value}:void 0;if(!(r in n)){t=`JSON missing required field: '${r}'`;break}const a=n[r];if(s&&typeof a!==s){t=`JSON field '${r}' must be a ${s}.`;break}if(i!==void 0&&a!==i.value){t=`Expected '${r}' field to equal '${i.value}'`;break}}if(t)throw new D(R.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ru=-62135596800,su=1e6;class te{static now(){return te.fromMillis(Date.now())}static fromDate(e){return te.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*su);return new te(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new D(R.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new D(R.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<ru)throw new D(R.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new D(R.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/su}_compareTo(e){return this.seconds===e.seconds?$(this.nanoseconds,e.nanoseconds):$(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:te._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Cr(e,te._jsonSchema))return new te(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-ru;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}te._jsonSchemaVersion="firestore/timestamp/1.0",te._jsonSchema={type:ae("string",te._jsonSchemaVersion),seconds:ae("number"),nanoseconds:ae("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U{static fromTimestamp(e){return new U(e)}static min(){return new U(new te(0,0))}static max(){return new U(new te(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fr=-1;function Dg(n,e){const t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=U.fromTimestamp(r===1e9?new te(t+1,0):new te(t,r));return new Rt(s,L.empty(),e)}function Ng(n){return new Rt(n.readTime,n.key,fr)}class Rt{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new Rt(U.min(),L.empty(),fr)}static max(){return new Rt(U.max(),L.empty(),fr)}}function kg(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=L.comparator(n.documentKey,e.documentKey),t!==0?t:$(n.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Og="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Lg{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Vn(n){if(n.code!==R.FAILED_PRECONDITION||n.message!==Og)throw n;V("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class P{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&F(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new P(((r,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(r,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(r,s)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof P?t:P.resolve(t)}catch(t){return P.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):P.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):P.reject(t)}static resolve(e){return new P(((t,r)=>{t(e)}))}static reject(e){return new P(((t,r)=>{r(e)}))}static waitFor(e){return new P(((t,r)=>{let s=0,i=0,a=!1;e.forEach((u=>{++s,u.next((()=>{++i,a&&i===s&&t()}),(l=>r(l)))})),a=!0,i===s&&t()}))}static or(e){let t=P.resolve(!1);for(const r of e)t=t.next((s=>s?P.resolve(s):r()));return t}static forEach(e,t){const r=[];return e.forEach(((s,i)=>{r.push(t.call(this,s,i))})),this.waitFor(r)}static mapArray(e,t){return new P(((r,s)=>{const i=e.length,a=new Array(i);let u=0;for(let l=0;l<i;l++){const d=l;t(e[d]).next((p=>{a[d]=p,++u,u===i&&r(a)}),(p=>s(p)))}}))}static doWhile(e,t){return new P(((r,s)=>{const i=()=>{e()===!0?t().next((()=>{i()}),s):r()};i()}))}}function Mg(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Dn(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ks{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.ae(r),this.ue=r=>t.writeSequenceNumber(r))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}Ks.ce=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mo=-1;function Qs(n){return n==null}function Rs(n){return n===0&&1/n==-1/0}function Fg(n){return typeof n=="number"&&Number.isInteger(n)&&!Rs(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oh="";function xg(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=iu(e)),e=Ug(n.get(t),e);return iu(e)}function Ug(n,e){let t=e;const r=n.length;for(let s=0;s<r;s++){const i=n.charAt(s);switch(i){case"\0":t+="";break;case oh:t+="";break;default:t+=i}}return t}function iu(n){return n+oh+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ou(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function tn(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function ah(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ne{constructor(e,t){this.comparator=e,this.root=t||me.EMPTY}insert(e,t){return new ne(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,me.BLACK,null,null))}remove(e){return new ne(this.comparator,this.root.remove(e,this.comparator).copy(null,null,me.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(e,r.key);if(s===0)return t+r.left.size;s<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,r)=>(e(t,r),!1)))}toString(){const e=[];return this.inorderTraversal(((t,r)=>(e.push(`${t}:${r}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new rs(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new rs(this.root,e,this.comparator,!1)}getReverseIterator(){return new rs(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new rs(this.root,e,this.comparator,!0)}}class rs{constructor(e,t,r,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?r(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class me{constructor(e,t,r,s,i){this.key=e,this.value=t,this.color=r??me.RED,this.left=s??me.EMPTY,this.right=i??me.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,s,i){return new me(e??this.key,t??this.value,r??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let s=this;const i=r(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,r),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return me.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return me.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,me.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,me.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw F(43730,{key:this.key,value:this.value});if(this.right.isRed())throw F(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw F(27949);return e+(this.isRed()?0:1)}}me.EMPTY=null,me.RED=!0,me.BLACK=!1;me.EMPTY=new class{constructor(){this.size=0}get key(){throw F(57766)}get value(){throw F(16141)}get color(){throw F(16727)}get left(){throw F(29726)}get right(){throw F(36894)}copy(e,t,r,s,i){return this}insert(e,t,r){return new me(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class he{constructor(e){this.comparator=e,this.data=new ne(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,r)=>(e(t),!1)))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new au(this.data.getIterator())}getIteratorFrom(e){return new au(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((r=>{t=t.add(r)})),t}isEqual(e){if(!(e instanceof he)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=r.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new he(this.comparator);return t.data=e,t}}class au{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ke{constructor(e){this.fields=e,e.sort(ge.comparator)}static empty(){return new ke([])}unionWith(e){let t=new he(ge.comparator);for(const r of this.fields)t=t.add(r);for(const r of e)t=t.add(r);return new ke(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return An(this.fields,e.fields,((t,r)=>t.isEqual(r)))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ch extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _e{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new ch("Invalid base64 string: "+i):i}})(e);return new _e(t)}static fromUint8Array(e){const t=(function(s){let i="";for(let a=0;a<s.length;++a)i+=String.fromCharCode(s[a]);return i})(e);return new _e(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return $(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}_e.EMPTY_BYTE_STRING=new _e("");const Bg=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Pt(n){if(Q(!!n,39018),typeof n=="string"){let e=0;const t=Bg.exec(n);if(Q(!!t,46558,{timestamp:n}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:se(n.seconds),nanos:se(n.nanos)}}function se(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function bt(n){return typeof n=="string"?_e.fromBase64String(n):_e.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uh="server_timestamp",lh="__type__",hh="__previous_value__",dh="__local_write_time__";function Fo(n){var t,r;return((r=(((t=n==null?void 0:n.mapValue)==null?void 0:t.fields)||{})[lh])==null?void 0:r.stringValue)===uh}function Ys(n){const e=n.mapValue.fields[hh];return Fo(e)?Ys(e):e}function pr(n){const e=Pt(n.mapValue.fields[dh].timestampValue);return new te(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jg{constructor(e,t,r,s,i,a,u,l,d,p,g){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=s,this.ssl=i,this.forceLongPolling=a,this.autoDetectLongPolling=u,this.longPollingOptions=l,this.useFetchStreams=d,this.isUsingEmulator=p,this.apiKey=g}}const Ps="(default)";class mr{constructor(e,t){this.projectId=e,this.database=t||Ps}static empty(){return new mr("","")}get isDefaultDatabase(){return this.database===Ps}isEqual(e){return e instanceof mr&&e.projectId===this.projectId&&e.database===this.database}}function qg(n,e){if(!Object.prototype.hasOwnProperty.apply(n.options,["projectId"]))throw new D(R.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new mr(n.options.projectId,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fh="__type__",$g="__max__",ss={mapValue:{}},ph="__vector__",bs="value";function Ct(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Fo(n)?4:Gg(n)?9007199254740991:zg(n)?10:11:F(28295,{value:n})}function We(n,e){if(n===e)return!0;const t=Ct(n);if(t!==Ct(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return pr(n).isEqual(pr(e));case 3:return(function(s,i){if(typeof s.timestampValue=="string"&&typeof i.timestampValue=="string"&&s.timestampValue.length===i.timestampValue.length)return s.timestampValue===i.timestampValue;const a=Pt(s.timestampValue),u=Pt(i.timestampValue);return a.seconds===u.seconds&&a.nanos===u.nanos})(n,e);case 5:return n.stringValue===e.stringValue;case 6:return(function(s,i){return bt(s.bytesValue).isEqual(bt(i.bytesValue))})(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return(function(s,i){return se(s.geoPointValue.latitude)===se(i.geoPointValue.latitude)&&se(s.geoPointValue.longitude)===se(i.geoPointValue.longitude)})(n,e);case 2:return(function(s,i){if("integerValue"in s&&"integerValue"in i)return se(s.integerValue)===se(i.integerValue);if("doubleValue"in s&&"doubleValue"in i){const a=se(s.doubleValue),u=se(i.doubleValue);return a===u?Rs(a)===Rs(u):isNaN(a)&&isNaN(u)}return!1})(n,e);case 9:return An(n.arrayValue.values||[],e.arrayValue.values||[],We);case 10:case 11:return(function(s,i){const a=s.mapValue.fields||{},u=i.mapValue.fields||{};if(ou(a)!==ou(u))return!1;for(const l in a)if(a.hasOwnProperty(l)&&(u[l]===void 0||!We(a[l],u[l])))return!1;return!0})(n,e);default:return F(52216,{left:n})}}function gr(n,e){return(n.values||[]).find((t=>We(t,e)))!==void 0}function Sn(n,e){if(n===e)return 0;const t=Ct(n),r=Ct(e);if(t!==r)return $(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return $(n.booleanValue,e.booleanValue);case 2:return(function(i,a){const u=se(i.integerValue||i.doubleValue),l=se(a.integerValue||a.doubleValue);return u<l?-1:u>l?1:u===l?0:isNaN(u)?isNaN(l)?0:-1:1})(n,e);case 3:return cu(n.timestampValue,e.timestampValue);case 4:return cu(pr(n),pr(e));case 5:return fo(n.stringValue,e.stringValue);case 6:return(function(i,a){const u=bt(i),l=bt(a);return u.compareTo(l)})(n.bytesValue,e.bytesValue);case 7:return(function(i,a){const u=i.split("/"),l=a.split("/");for(let d=0;d<u.length&&d<l.length;d++){const p=$(u[d],l[d]);if(p!==0)return p}return $(u.length,l.length)})(n.referenceValue,e.referenceValue);case 8:return(function(i,a){const u=$(se(i.latitude),se(a.latitude));return u!==0?u:$(se(i.longitude),se(a.longitude))})(n.geoPointValue,e.geoPointValue);case 9:return uu(n.arrayValue,e.arrayValue);case 10:return(function(i,a){var A,b,k,O;const u=i.fields||{},l=a.fields||{},d=(A=u[bs])==null?void 0:A.arrayValue,p=(b=l[bs])==null?void 0:b.arrayValue,g=$(((k=d==null?void 0:d.values)==null?void 0:k.length)||0,((O=p==null?void 0:p.values)==null?void 0:O.length)||0);return g!==0?g:uu(d,p)})(n.mapValue,e.mapValue);case 11:return(function(i,a){if(i===ss.mapValue&&a===ss.mapValue)return 0;if(i===ss.mapValue)return 1;if(a===ss.mapValue)return-1;const u=i.fields||{},l=Object.keys(u),d=a.fields||{},p=Object.keys(d);l.sort(),p.sort();for(let g=0;g<l.length&&g<p.length;++g){const A=fo(l[g],p[g]);if(A!==0)return A;const b=Sn(u[l[g]],d[p[g]]);if(b!==0)return b}return $(l.length,p.length)})(n.mapValue,e.mapValue);default:throw F(23264,{he:t})}}function cu(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return $(n,e);const t=Pt(n),r=Pt(e),s=$(t.seconds,r.seconds);return s!==0?s:$(t.nanos,r.nanos)}function uu(n,e){const t=n.values||[],r=e.values||[];for(let s=0;s<t.length&&s<r.length;++s){const i=Sn(t[s],r[s]);if(i)return i}return $(t.length,r.length)}function Rn(n){return po(n)}function po(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?(function(t){const r=Pt(t);return`time(${r.seconds},${r.nanos})`})(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?(function(t){return bt(t).toBase64()})(n.bytesValue):"referenceValue"in n?(function(t){return L.fromName(t).toString()})(n.referenceValue):"geoPointValue"in n?(function(t){return`geo(${t.latitude},${t.longitude})`})(n.geoPointValue):"arrayValue"in n?(function(t){let r="[",s=!0;for(const i of t.values||[])s?s=!1:r+=",",r+=po(i);return r+"]"})(n.arrayValue):"mapValue"in n?(function(t){const r=Object.keys(t.fields||{}).sort();let s="{",i=!0;for(const a of r)i?i=!1:s+=",",s+=`${a}:${po(t.fields[a])}`;return s+"}"})(n.mapValue):F(61005,{value:n})}function ms(n){switch(Ct(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Ys(n);return e?16+ms(e):16;case 5:return 2*n.stringValue.length;case 6:return bt(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return(function(r){return(r.values||[]).reduce(((s,i)=>s+ms(i)),0)})(n.arrayValue);case 10:case 11:return(function(r){let s=0;return tn(r.fields,((i,a)=>{s+=i.length+ms(a)})),s})(n.mapValue);default:throw F(13486,{value:n})}}function lu(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function _r(n){return!!n&&"integerValue"in n}function mh(n){return _r(n)||(function(t){return!!t&&"doubleValue"in t})(n)}function xo(n){return!!n&&"arrayValue"in n}function hu(n){return!!n&&"nullValue"in n}function du(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function gs(n){return!!n&&"mapValue"in n}function zg(n){var t,r;return((r=(((t=n==null?void 0:n.mapValue)==null?void 0:t.fields)||{})[fh])==null?void 0:r.stringValue)===ph}function ar(n){if(n.geoPointValue)return{geoPointValue:{...n.geoPointValue}};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:{...n.timestampValue}};if(n.mapValue){const e={mapValue:{fields:{}}};return tn(n.mapValue.fields,((t,r)=>e.mapValue.fields[t]=ar(r))),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=ar(n.arrayValue.values[t]);return e}return{...n}}function Gg(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===$g}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ve{constructor(e){this.value=e}static empty(){return new Ve({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!gs(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=ar(t)}setAll(e){let t=ge.emptyPath(),r={},s=[];e.forEach(((a,u)=>{if(!t.isImmediateParentOf(u)){const l=this.getFieldsMap(t);this.applyChanges(l,r,s),r={},s=[],t=u.popLast()}a?r[u.lastSegment()]=ar(a):s.push(u.lastSegment())}));const i=this.getFieldsMap(t);this.applyChanges(i,r,s)}delete(e){const t=this.field(e.popLast());gs(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return We(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=t.mapValue.fields[e.get(r)];gs(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,r){tn(t,((s,i)=>e[s]=i));for(const s of r)delete e[s]}clone(){return new Ve(ar(this.value))}}function gh(n){const e=[];return tn(n.fields,((t,r)=>{const s=new ge([t]);if(gs(r)){const i=gh(r.mapValue).fields;if(i.length===0)e.push(s);else for(const a of i)e.push(s.child(a))}else e.push(s)})),new ke(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ie{constructor(e,t,r,s,i,a,u){this.key=e,this.documentType=t,this.version=r,this.readTime=s,this.createTime=i,this.data=a,this.documentState=u}static newInvalidDocument(e){return new Ie(e,0,U.min(),U.min(),U.min(),Ve.empty(),0)}static newFoundDocument(e,t,r,s){return new Ie(e,1,t,U.min(),r,s,0)}static newNoDocument(e,t){return new Ie(e,2,t,U.min(),U.min(),Ve.empty(),0)}static newUnknownDocument(e,t){return new Ie(e,3,t,U.min(),U.min(),Ve.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(U.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Ve.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Ve.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=U.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Ie&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Ie(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cs{constructor(e,t){this.position=e,this.inclusive=t}}function fu(n,e,t){let r=0;for(let s=0;s<n.position.length;s++){const i=e[s],a=n.position[s];if(i.field.isKeyField()?r=L.comparator(L.fromName(a.referenceValue),t.key):r=Sn(a,t.data.field(i.field)),i.dir==="desc"&&(r*=-1),r!==0)break}return r}function pu(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!We(n.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yr{constructor(e,t="asc"){this.field=e,this.dir=t}}function Hg(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _h{}class oe extends _h{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new Kg(e,t,r):t==="array-contains"?new Jg(e,r):t==="in"?new Xg(e,r):t==="not-in"?new Zg(e,r):t==="array-contains-any"?new e_(e,r):new oe(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new Qg(e,r):new Yg(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(Sn(t,this.value)):t!==null&&Ct(this.value)===Ct(t)&&this.matchesComparison(Sn(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return F(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Me extends _h{constructor(e,t){super(),this.filters=e,this.op=t,this.Pe=null}static create(e,t){return new Me(e,t)}matches(e){return yh(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function yh(n){return n.op==="and"}function Eh(n){return Wg(n)&&yh(n)}function Wg(n){for(const e of n.filters)if(e instanceof Me)return!1;return!0}function mo(n){if(n instanceof oe)return n.field.canonicalString()+n.op.toString()+Rn(n.value);if(Eh(n))return n.filters.map((e=>mo(e))).join(",");{const e=n.filters.map((t=>mo(t))).join(",");return`${n.op}(${e})`}}function Th(n,e){return n instanceof oe?(function(r,s){return s instanceof oe&&r.op===s.op&&r.field.isEqual(s.field)&&We(r.value,s.value)})(n,e):n instanceof Me?(function(r,s){return s instanceof Me&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce(((i,a,u)=>i&&Th(a,s.filters[u])),!0):!1})(n,e):void F(19439)}function Ih(n){return n instanceof oe?(function(t){return`${t.field.canonicalString()} ${t.op} ${Rn(t.value)}`})(n):n instanceof Me?(function(t){return t.op.toString()+" {"+t.getFilters().map(Ih).join(" ,")+"}"})(n):"Filter"}class Kg extends oe{constructor(e,t,r){super(e,t,r),this.key=L.fromName(r.referenceValue)}matches(e){const t=L.comparator(e.key,this.key);return this.matchesComparison(t)}}class Qg extends oe{constructor(e,t){super(e,"in",t),this.keys=wh("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class Yg extends oe{constructor(e,t){super(e,"not-in",t),this.keys=wh("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function wh(n,e){var t;return(((t=e.arrayValue)==null?void 0:t.values)||[]).map((r=>L.fromName(r.referenceValue)))}class Jg extends oe{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return xo(t)&&gr(t.arrayValue,this.value)}}class Xg extends oe{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&gr(this.value.arrayValue,t)}}class Zg extends oe{constructor(e,t){super(e,"not-in",t)}matches(e){if(gr(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!gr(this.value.arrayValue,t)}}class e_ extends oe{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!xo(t)||!t.arrayValue.values)&&t.arrayValue.values.some((r=>gr(this.value.arrayValue,r)))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class t_{constructor(e,t=null,r=[],s=[],i=null,a=null,u=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=s,this.limit=i,this.startAt=a,this.endAt=u,this.Te=null}}function mu(n,e=null,t=[],r=[],s=null,i=null,a=null){return new t_(n,e,t,r,s,i,a)}function Uo(n){const e=B(n);if(e.Te===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((r=>mo(r))).join(","),t+="|ob:",t+=e.orderBy.map((r=>(function(i){return i.field.canonicalString()+i.dir})(r))).join(","),Qs(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((r=>Rn(r))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((r=>Rn(r))).join(",")),e.Te=t}return e.Te}function Bo(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!Hg(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!Th(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!pu(n.startAt,e.startAt)&&pu(n.endAt,e.endAt)}function go(n){return L.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nn{constructor(e,t=null,r=[],s=[],i=null,a="F",u=null,l=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=i,this.limitType=a,this.startAt=u,this.endAt=l,this.Ie=null,this.Ee=null,this.Re=null,this.startAt,this.endAt}}function n_(n,e,t,r,s,i,a,u){return new Nn(n,e,t,r,s,i,a,u)}function jo(n){return new Nn(n)}function gu(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function r_(n){return L.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}function vh(n){return n.collectionGroup!==null}function cr(n){const e=B(n);if(e.Ie===null){e.Ie=[];const t=new Set;for(const i of e.explicitOrderBy)e.Ie.push(i),t.add(i.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let u=new he(ge.comparator);return a.filters.forEach((l=>{l.getFlattenedFilters().forEach((d=>{d.isInequality()&&(u=u.add(d.field))}))})),u})(e).forEach((i=>{t.has(i.canonicalString())||i.isKeyField()||e.Ie.push(new yr(i,r))})),t.has(ge.keyField().canonicalString())||e.Ie.push(new yr(ge.keyField(),r))}return e.Ie}function qe(n){const e=B(n);return e.Ee||(e.Ee=s_(e,cr(n))),e.Ee}function s_(n,e){if(n.limitType==="F")return mu(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map((s=>{const i=s.dir==="desc"?"asc":"desc";return new yr(s.field,i)}));const t=n.endAt?new Cs(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new Cs(n.startAt.position,n.startAt.inclusive):null;return mu(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function _o(n,e){const t=n.filters.concat([e]);return new Nn(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function i_(n,e){const t=n.explicitOrderBy.concat([e]);return new Nn(n.path,n.collectionGroup,t,n.filters.slice(),n.limit,n.limitType,n.startAt,n.endAt)}function Vs(n,e,t){return new Nn(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function Js(n,e){return Bo(qe(n),qe(e))&&n.limitType===e.limitType}function Ah(n){return`${Uo(qe(n))}|lt:${n.limitType}`}function ln(n){return`Query(target=${(function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map((s=>Ih(s))).join(", ")}]`),Qs(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map((s=>(function(a){return`${a.field.canonicalString()} (${a.dir})`})(s))).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map((s=>Rn(s))).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map((s=>Rn(s))).join(",")),`Target(${r})`})(qe(n))}; limitType=${n.limitType})`}function Xs(n,e){return e.isFoundDocument()&&(function(r,s){const i=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(i):L.isDocumentKey(r.path)?r.path.isEqual(i):r.path.isImmediateParentOf(i)})(n,e)&&(function(r,s){for(const i of cr(r))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0})(n,e)&&(function(r,s){for(const i of r.filters)if(!i.matches(s))return!1;return!0})(n,e)&&(function(r,s){return!(r.startAt&&!(function(a,u,l){const d=fu(a,u,l);return a.inclusive?d<=0:d<0})(r.startAt,cr(r),s)||r.endAt&&!(function(a,u,l){const d=fu(a,u,l);return a.inclusive?d>=0:d>0})(r.endAt,cr(r),s))})(n,e)}function o_(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function Sh(n){return(e,t)=>{let r=!1;for(const s of cr(n)){const i=a_(s,e,t);if(i!==0)return i;r=r||s.field.isKeyField()}return 0}}function a_(n,e,t){const r=n.field.isKeyField()?L.comparator(e.key,t.key):(function(i,a,u){const l=a.data.field(i),d=u.data.field(i);return l!==null&&d!==null?Sn(l,d):F(42886)})(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return F(19790,{direction:n.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nn{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(const[s,i]of r)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[t]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){tn(this.inner,((t,r)=>{for(const[s,i]of r)e(s,i)}))}isEmpty(){return ah(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const c_=new ne(L.comparator);function nt(){return c_}const Rh=new ne(L.comparator);function nr(...n){let e=Rh;for(const t of n)e=e.insert(t.key,t);return e}function Ph(n){let e=Rh;return n.forEach(((t,r)=>e=e.insert(t,r.overlayedDocument))),e}function Ht(){return ur()}function bh(){return ur()}function ur(){return new nn((n=>n.toString()),((n,e)=>n.isEqual(e)))}const u_=new ne(L.comparator),l_=new he(L.comparator);function z(...n){let e=l_;for(const t of n)e=e.add(t);return e}const h_=new he($);function d_(){return h_}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zs(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Rs(e)?"-0":e}}function qo(n){return{integerValue:""+n}}function f_(n,e){return Fg(e)?qo(e):Zs(n,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ei{constructor(){this._=void 0}}function p_(n,e,t){return n instanceof Er?(function(s,i){const a={fields:{[lh]:{stringValue:uh},[dh]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&Fo(i)&&(i=Ys(i)),i&&(a.fields[hh]=i),{mapValue:a}})(t,e):n instanceof Tr?Vh(n,e):n instanceof Ir?Dh(n,e):n instanceof wr?(function(s,i){const a=Ch(s,i),u=ks(a)+ks(s.Ae);return _r(a)&&_r(s.Ae)?qo(u):Zs(s.serializer,u)})(n,e):n instanceof Ds?(function(s,i){return _u(s,i,Math.min)})(n,e):n instanceof Ns?(function(s,i){return _u(s,i,Math.max)})(n,e):void 0}function m_(n,e,t){return n instanceof Tr?Vh(n,e):n instanceof Ir?Dh(n,e):t}function Ch(n,e){return n instanceof wr?mh(e)?e:{integerValue:0}:null}class Er extends ei{}class Tr extends ei{constructor(e){super(),this.elements=e}}function Vh(n,e){const t=Nh(e);for(const r of n.elements)t.some((s=>We(s,r)))||t.push(r);return{arrayValue:{values:t}}}class Ir extends ei{constructor(e){super(),this.elements=e}}function Dh(n,e){let t=Nh(e);for(const r of n.elements)t=t.filter((s=>!We(s,r)));return{arrayValue:{values:t}}}class $o extends ei{constructor(e,t){super(),this.serializer=e,this.Ae=t}}class wr extends $o{}class Ds extends $o{}class Ns extends $o{}function _u(n,e,t){if(!mh(e))return n.Ae;const r=t(ks(e),ks(n.Ae));return _r(e)&&_r(n.Ae)?qo(r):Zs(n.serializer,r)}function ks(n){return se(n.integerValue||n.doubleValue)}function Nh(n){return xo(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class g_{constructor(e,t){this.field=e,this.transform=t}}function __(n,e){return n.field.isEqual(e.field)&&(function(r,s){return r instanceof Tr&&s instanceof Tr||r instanceof Ir&&s instanceof Ir?An(r.elements,s.elements,We):r instanceof wr&&s instanceof wr||r instanceof Ds&&s instanceof Ds||r instanceof Ns&&s instanceof Ns?We(r.Ae,s.Ae):r instanceof Er&&s instanceof Er})(n.transform,e.transform)}class y_{constructor(e,t){this.version=e,this.transformResults=t}}class Ze{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Ze}static exists(e){return new Ze(void 0,e)}static updateTime(e){return new Ze(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function _s(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class ti{}function kh(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Lh(n.key,Ze.none()):new Vr(n.key,n.data,Ze.none());{const t=n.data,r=Ve.empty();let s=new he(ge.comparator);for(let i of e.fields)if(!s.has(i)){let a=t.field(i);a===null&&i.length>1&&(i=i.popLast(),a=t.field(i)),a===null?r.delete(i):r.set(i,a),s=s.add(i)}return new rn(n.key,r,new ke(s.toArray()),Ze.none())}}function E_(n,e,t){n instanceof Vr?(function(s,i,a){const u=s.value.clone(),l=Eu(s.fieldTransforms,i,a.transformResults);u.setAll(l),i.convertToFoundDocument(a.version,u).setHasCommittedMutations()})(n,e,t):n instanceof rn?(function(s,i,a){if(!_s(s.precondition,i))return void i.convertToUnknownDocument(a.version);const u=Eu(s.fieldTransforms,i,a.transformResults),l=i.data;l.setAll(Oh(s)),l.setAll(u),i.convertToFoundDocument(a.version,l).setHasCommittedMutations()})(n,e,t):(function(s,i,a){i.convertToNoDocument(a.version).setHasCommittedMutations()})(0,e,t)}function lr(n,e,t,r){return n instanceof Vr?(function(i,a,u,l){if(!_s(i.precondition,a))return u;const d=i.value.clone(),p=Tu(i.fieldTransforms,l,a);return d.setAll(p),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null})(n,e,t,r):n instanceof rn?(function(i,a,u,l){if(!_s(i.precondition,a))return u;const d=Tu(i.fieldTransforms,l,a),p=a.data;return p.setAll(Oh(i)),p.setAll(d),a.convertToFoundDocument(a.version,p).setHasLocalMutations(),u===null?null:u.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map((g=>g.field)))})(n,e,t,r):(function(i,a,u){return _s(i.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):u})(n,e,t)}function T_(n,e){let t=null;for(const r of n.fieldTransforms){const s=e.data.field(r.field),i=Ch(r.transform,s||null);i!=null&&(t===null&&(t=Ve.empty()),t.set(r.field,i))}return t||null}function yu(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!(function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&An(r,s,((i,a)=>__(i,a)))})(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class Vr extends ti{constructor(e,t,r,s=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class rn extends ti{constructor(e,t,r,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function Oh(n){const e=new Map;return n.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const r=n.data.field(t);e.set(t,r)}})),e}function Eu(n,e,t){const r=new Map;Q(n.length===t.length,32656,{Ve:t.length,de:n.length});for(let s=0;s<t.length;s++){const i=n[s],a=i.transform,u=e.data.field(i.field);r.set(i.field,m_(a,u,t[s]))}return r}function Tu(n,e,t){const r=new Map;for(const s of n){const i=s.transform,a=t.data.field(s.field);r.set(s.field,p_(i,a,e))}return r}class Lh extends ti{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class I_ extends ti{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class w_{constructor(e,t,r,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,t){const r=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&E_(i,e,r[s])}}applyToLocalView(e,t){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(t=lr(r,e,t,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(t=lr(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const r=bh();return this.mutations.forEach((s=>{const i=e.get(s.key),a=i.overlayedDocument;let u=this.applyToLocalView(a,i.mutatedFields);u=t.has(s.key)?null:u;const l=kh(a,u);l!==null&&r.set(s.key,l),a.isValidDocument()||a.convertToNoDocument(U.min())})),r}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),z())}isEqual(e){return this.batchId===e.batchId&&An(this.mutations,e.mutations,((t,r)=>yu(t,r)))&&An(this.baseMutations,e.baseMutations,((t,r)=>yu(t,r)))}}class zo{constructor(e,t,r,s){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=s}static from(e,t,r){Q(e.mutations.length===r.length,58842,{me:e.mutations.length,fe:r.length});let s=(function(){return u_})();const i=e.mutations;for(let a=0;a<i.length;a++)s=s.insert(i[a].key,r[a].version);return new zo(e,t,r,s)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class v_{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class A_{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ie,H;function S_(n){switch(n){case R.OK:return F(64938);case R.CANCELLED:case R.UNKNOWN:case R.DEADLINE_EXCEEDED:case R.RESOURCE_EXHAUSTED:case R.INTERNAL:case R.UNAVAILABLE:case R.UNAUTHENTICATED:return!1;case R.INVALID_ARGUMENT:case R.NOT_FOUND:case R.ALREADY_EXISTS:case R.PERMISSION_DENIED:case R.FAILED_PRECONDITION:case R.ABORTED:case R.OUT_OF_RANGE:case R.UNIMPLEMENTED:case R.DATA_LOSS:return!0;default:return F(15467,{code:n})}}function Mh(n){if(n===void 0)return tt("GRPC error has no .code"),R.UNKNOWN;switch(n){case ie.OK:return R.OK;case ie.CANCELLED:return R.CANCELLED;case ie.UNKNOWN:return R.UNKNOWN;case ie.DEADLINE_EXCEEDED:return R.DEADLINE_EXCEEDED;case ie.RESOURCE_EXHAUSTED:return R.RESOURCE_EXHAUSTED;case ie.INTERNAL:return R.INTERNAL;case ie.UNAVAILABLE:return R.UNAVAILABLE;case ie.UNAUTHENTICATED:return R.UNAUTHENTICATED;case ie.INVALID_ARGUMENT:return R.INVALID_ARGUMENT;case ie.NOT_FOUND:return R.NOT_FOUND;case ie.ALREADY_EXISTS:return R.ALREADY_EXISTS;case ie.PERMISSION_DENIED:return R.PERMISSION_DENIED;case ie.FAILED_PRECONDITION:return R.FAILED_PRECONDITION;case ie.ABORTED:return R.ABORTED;case ie.OUT_OF_RANGE:return R.OUT_OF_RANGE;case ie.UNIMPLEMENTED:return R.UNIMPLEMENTED;case ie.DATA_LOSS:return R.DATA_LOSS;default:return F(39323,{code:n})}}(H=ie||(ie={}))[H.OK=0]="OK",H[H.CANCELLED=1]="CANCELLED",H[H.UNKNOWN=2]="UNKNOWN",H[H.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",H[H.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",H[H.NOT_FOUND=5]="NOT_FOUND",H[H.ALREADY_EXISTS=6]="ALREADY_EXISTS",H[H.PERMISSION_DENIED=7]="PERMISSION_DENIED",H[H.UNAUTHENTICATED=16]="UNAUTHENTICATED",H[H.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",H[H.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",H[H.ABORTED=10]="ABORTED",H[H.OUT_OF_RANGE=11]="OUT_OF_RANGE",H[H.UNIMPLEMENTED=12]="UNIMPLEMENTED",H[H.INTERNAL=13]="INTERNAL",H[H.UNAVAILABLE=14]="UNAVAILABLE",H[H.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function R_(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P_=new vt([4294967295,4294967295],0);function Iu(n){const e=R_().encode(n),t=new Yl;return t.update(e),new Uint8Array(t.digest())}function wu(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new vt([t,r],0),new vt([s,i],0)]}class Go{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new rr(`Invalid padding: ${t}`);if(r<0)throw new rr(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new rr(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new rr(`Invalid padding when bitmap length is 0: ${t}`);this.ge=8*e.length-t,this.pe=vt.fromNumber(this.ge)}ye(e,t,r){let s=e.add(t.multiply(vt.fromNumber(r)));return s.compare(P_)===1&&(s=new vt([s.getBits(0),s.getBits(1)],0)),s.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.ge===0)return!1;const t=Iu(e),[r,s]=wu(t);for(let i=0;i<this.hashCount;i++){const a=this.ye(r,s,i);if(!this.we(a))return!1}return!0}static create(e,t,r){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),a=new Go(i,s,t);return r.forEach((u=>a.insert(u))),a}insert(e){if(this.ge===0)return;const t=Iu(e),[r,s]=wu(t);for(let i=0;i<this.hashCount;i++){const a=this.ye(r,s,i);this.Se(a)}}Se(e){const t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}}class rr extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dr{constructor(e,t,r,s,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=s,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,r){const s=new Map;return s.set(e,Nr.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new Dr(U.min(),s,new ne($),nt(),z())}}class Nr{constructor(e,t,r,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new Nr(r,t,z(),z(),z())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ys{constructor(e,t,r,s){this.be=e,this.removedTargetIds=t,this.key=r,this.De=s}}class Fh{constructor(e,t){this.targetId=e,this.Ce=t}}class xh{constructor(e,t,r=_e.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=s}}class vu{constructor(e){this.targetId=e,this.ve=0,this.Fe=Au(),this.Me=_e.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=z(),t=z(),r=z();return this.Fe.forEach(((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:r=r.add(s);break;default:F(38017,{changeType:i})}})),new Nr(this.Me,this.xe,e,t,r)}qe(){this.Oe=!1,this.Fe=Au()}Ke(e,t){this.Oe=!0,this.Fe=this.Fe.insert(e,t)}Ue(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}$e(){this.ve+=1}We(){this.ve-=1,Q(this.ve>=0,3241,{ve:this.ve,targetId:this.targetId})}Qe(){this.Oe=!0,this.xe=!0}}const Xn="WatchChangeAggregator";class b_{constructor(e){this.Ge=e,this.ze=new Map,this.je=nt(),this.Je=is(),this.He=is(),this.Ze=new ne($)}Xe(e){for(const t of e.be)e.De&&e.De.isFoundDocument()?this.Ye(t,e.De):this.et(t,e.key,e.De);for(const t of e.removedTargetIds)this.et(t,e.key,e.De)}tt(e){this.forEachTarget(e,(t=>{const r=this.ze.get(t);if(r)switch(e.state){case 0:this.nt(t)&&r.Le(e.resumeToken);break;case 1:r.We(),r.Ne||r.qe(),r.Le(e.resumeToken);break;case 2:r.We(),r.Ne||this.removeTarget(t);break;case 3:this.nt(t)&&(r.Qe(),r.Le(e.resumeToken));break;case 4:this.nt(t)&&(this.rt(t),r.Le(e.resumeToken));break;default:F(56790,{state:e.state})}else V(Xn,`handleTargetChange received targetChange for untracked target ID (${t}) with state (${e.state})`)}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ze.forEach(((r,s)=>{this.nt(s)&&t(s)}))}it(e){const t=e.targetId,r=e.Ce.count,s=this.st(t);if(s){const i=s.target;if(go(i))if(r===0){const a=new L(i.path);this.et(t,a,Ie.newNoDocument(a,U.min()))}else Q(r===1,20013,{expectedCount:r});else{const a=this.ot(t);if(a!==r){const u=this._t(e),l=u?this.ut(u,e,a):1;if(l!==0){this.rt(t);const d=l===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ze=this.Ze.insert(t,d)}}}}}_t(e){const t=e.Ce.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:i=0}=t;let a,u;try{a=bt(r).toUint8Array()}catch(l){if(l instanceof ch)return Jt("Decoding the base64 bloom filter in existence filter failed ("+l.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw l}try{u=new Go(a,s,i)}catch(l){return Jt(l instanceof rr?"BloomFilter error: ":"Applying bloom filter failed: ",l),null}return u.ge===0?null:u}ut(e,t,r){return t.Ce.count===r-this.ht(e,t.targetId)?0:2}ht(e,t){const r=this.Ge.getRemoteKeysForTarget(t);let s=0;return r.forEach((i=>{const a=this.Ge.lt(),u=`projects/${a.projectId}/databases/${a.database}/documents/${i.path.canonicalString()}`;e.mightContain(u)||(this.et(t,i,null),s++)})),s}Pt(e){const t=new Map;this.ze.forEach(((i,a)=>{const u=this.st(a);if(u){if(i.current&&go(u.target)){const l=new L(u.target.path);this.Tt(l).has(a)||this.It(a,l)||this.et(a,l,Ie.newNoDocument(l,e))}i.Be&&(t.set(a,i.ke()),i.qe())}}));let r=z();this.He.forEach(((i,a)=>{let u=!0;a.forEachWhile((l=>{const d=this.st(l);return!d||d.purpose==="TargetPurposeLimboResolution"||(u=!1,!1)})),u&&(r=r.add(i))})),this.je.forEach(((i,a)=>a.setReadTime(e)));const s=new Dr(e,t,this.Ze,this.je,r);return this.je=nt(),this.Je=is(),this.He=is(),this.Ze=new ne($),s}Ye(e,t){const r=this.ze.get(e);if(!r||!this.nt(e))return void V(Xn,`addDocumentToTarget received document for unknown inactive target (${e})`);const s=this.It(e,t.key)?2:0;r.Ke(t.key,s),this.je=this.je.insert(t.key,t),this.Je=this.Je.insert(t.key,this.Tt(t.key).add(e)),this.He=this.He.insert(t.key,this.Et(t.key).add(e))}et(e,t,r){const s=this.ze.get(e);s&&this.nt(e)?(this.It(e,t)?s.Ke(t,1):s.Ue(t),this.He=this.He.insert(t,this.Et(t).delete(e)),this.He=this.He.insert(t,this.Et(t).add(e)),r&&(this.je=this.je.insert(t,r))):V(Xn,`removeDocumentFromTarget received document for unknown or inactive target (${e})`)}removeTarget(e){this.ze.delete(e)}ot(e){const t=this.ze.get(e);if(!t)return 0;const r=t.ke();return this.Ge.getRemoteKeysForTarget(e).size+r.addedDocuments.size-r.removedDocuments.size}$e(e){let t=this.ze.get(e);t||(V(Xn,`recordPendingTargetRequest set up tracking for target ID ${e}`),t=new vu(e),this.ze.set(e,t)),t.$e()}Et(e){let t=this.He.get(e);return t||(t=new he($),this.He=this.He.insert(e,t)),t}Tt(e){let t=this.Je.get(e);return t||(t=new he($),this.Je=this.Je.insert(e,t)),t}nt(e){const t=this.st(e)!==null;return t||V(Xn,"Detected inactive target",e),t}st(e){const t=this.ze.get(e);return t===void 0||t.Ne?null:this.Ge.Rt(e)}rt(e){this.ze.set(e,new vu(e)),this.Ge.getRemoteKeysForTarget(e).forEach((t=>{this.et(e,t,null)}))}It(e,t){return this.Ge.getRemoteKeysForTarget(e).has(t)}}function is(){return new ne(L.comparator)}function Au(){return new ne(L.comparator)}const C_={asc:"ASCENDING",desc:"DESCENDING"},V_={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},D_={and:"AND",or:"OR"};class N_{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function yo(n,e){return n.useProto3Json||Qs(e)?e:{value:e}}function Os(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Uh(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function k_(n,e){return Os(n,e.toTimestamp())}function $e(n){return Q(!!n,49232),U.fromTimestamp((function(t){const r=Pt(t);return new te(r.seconds,r.nanos)})(n))}function Ho(n,e){return Eo(n,e).canonicalString()}function Eo(n,e){const t=(function(s){return new J(["projects",s.projectId,"databases",s.database])})(n).child("documents");return e===void 0?t:t.child(e)}function Bh(n){const e=J.fromString(n);return Q(Gh(e),10190,{key:e.toString()}),e}function To(n,e){return Ho(n.databaseId,e.path)}function Yi(n,e){const t=Bh(e);if(t.get(1)!==n.databaseId.projectId)throw new D(R.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new D(R.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new L(qh(t))}function jh(n,e){return Ho(n.databaseId,e)}function O_(n){const e=Bh(n);return e.length===4?J.emptyPath():qh(e)}function Io(n){return new J(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function qh(n){return Q(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function Su(n,e,t){return{name:To(n,e),fields:t.value.mapValue.fields}}function L_(n,e){let t;if("targetChange"in e){e.targetChange;const r=(function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:F(39313,{state:d})})(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=(function(d,p){return d.useProto3Json?(Q(p===void 0||typeof p=="string",58123),_e.fromBase64String(p||"")):(Q(p===void 0||p instanceof Buffer||p instanceof Uint8Array,16193),_e.fromUint8Array(p||new Uint8Array))})(n,e.targetChange.resumeToken),a=e.targetChange.cause,u=a&&(function(d){const p=d.code===void 0?R.UNKNOWN:Mh(d.code);return new D(p,d.message||"")})(a);t=new xh(r,s,i,u||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const s=Yi(n,r.document.name),i=$e(r.document.updateTime),a=r.document.createTime?$e(r.document.createTime):U.min(),u=new Ve({mapValue:{fields:r.document.fields}}),l=Ie.newFoundDocument(s,i,a,u),d=r.targetIds||[],p=r.removedTargetIds||[];t=new ys(d,p,l.key,l)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const s=Yi(n,r.document),i=r.readTime?$e(r.readTime):U.min(),a=Ie.newNoDocument(s,i),u=r.removedTargetIds||[];t=new ys([],u,a.key,a)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const s=Yi(n,r.document),i=r.removedTargetIds||[];t=new ys([],i,s,null)}else{if(!("filter"in e))return F(11601,{At:e});{e.filter;const r=e.filter;r.targetId;const{count:s=0,unchangedNames:i}=r,a=new A_(s,i),u=r.targetId;t=new Fh(u,a)}}return t}function M_(n,e){let t;if(e instanceof Vr)t={update:Su(n,e.key,e.value)};else if(e instanceof Lh)t={delete:To(n,e.key)};else if(e instanceof rn)t={update:Su(n,e.key,e.data),updateMask:G_(e.fieldMask)};else{if(!(e instanceof I_))return F(16599,{Vt:e.type});t={verify:To(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((r=>(function(i,a){const u=a.transform;if(u instanceof Er)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(u instanceof Tr)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:u.elements}};if(u instanceof Ir)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:u.elements}};if(u instanceof wr)return{fieldPath:a.field.canonicalString(),increment:u.Ae};if(u instanceof Ds)return{fieldPath:a.field.canonicalString(),minimum:u.Ae};if(u instanceof Ns)return{fieldPath:a.field.canonicalString(),maximum:u.Ae};throw F(20930,{transform:a.transform})})(0,r)))),e.precondition.isNone||(t.currentDocument=(function(s,i){return i.updateTime!==void 0?{updateTime:k_(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:F(27497)})(n,e.precondition)),t}function F_(n,e){return n&&n.length>0?(Q(e!==void 0,14353),n.map((t=>(function(s,i){let a=s.updateTime?$e(s.updateTime):$e(i);return a.isEqual(U.min())&&(a=$e(i)),new y_(a,s.transformResults||[])})(t,e)))):[]}function x_(n,e){return{documents:[jh(n,e.path)]}}function U_(n,e){const t={structuredQuery:{}},r=e.path;let s;e.collectionGroup!==null?(s=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=jh(n,s);const i=(function(d){if(d.length!==0)return zh(Me.create(d,"and"))})(e.filters);i&&(t.structuredQuery.where=i);const a=(function(d){if(d.length!==0)return d.map((p=>(function(A){return{field:hn(A.field),direction:q_(A.dir)}})(p)))})(e.orderBy);a&&(t.structuredQuery.orderBy=a);const u=yo(n,e.limit);return u!==null&&(t.structuredQuery.limit=u),e.startAt&&(t.structuredQuery.startAt=(function(d){return{before:d.inclusive,values:d.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(d){return{before:!d.inclusive,values:d.position}})(e.endAt)),{dt:t,parent:s}}function B_(n){let e=O_(n.parent);const t=n.structuredQuery,r=t.from?t.from.length:0;let s=null;if(r>0){Q(r===1,65062);const p=t.from[0];p.allDescendants?s=p.collectionId:e=e.child(p.collectionId)}let i=[];t.where&&(i=(function(g){const A=$h(g);return A instanceof Me&&Eh(A)?A.getFilters():[A]})(t.where));let a=[];t.orderBy&&(a=(function(g){return g.map((A=>(function(k){return new yr(dn(k.field),(function(N){switch(N){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(k.direction))})(A)))})(t.orderBy));let u=null;t.limit&&(u=(function(g){let A;return A=typeof g=="object"?g.value:g,Qs(A)?null:A})(t.limit));let l=null;t.startAt&&(l=(function(g){const A=!!g.before,b=g.values||[];return new Cs(b,A)})(t.startAt));let d=null;return t.endAt&&(d=(function(g){const A=!g.before,b=g.values||[];return new Cs(b,A)})(t.endAt)),n_(e,s,a,i,u,"F",l,d)}function j_(n,e){const t=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return F(28987,{purpose:s})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function $h(n){return n.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const r=dn(t.unaryFilter.field);return oe.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=dn(t.unaryFilter.field);return oe.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=dn(t.unaryFilter.field);return oe.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=dn(t.unaryFilter.field);return oe.create(a,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return F(61313);default:return F(60726)}})(n):n.fieldFilter!==void 0?(function(t){return oe.create(dn(t.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return F(58110);default:return F(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(n):n.compositeFilter!==void 0?(function(t){return Me.create(t.compositeFilter.filters.map((r=>$h(r))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return F(1026)}})(t.compositeFilter.op))})(n):F(30097,{filter:n})}function q_(n){return C_[n]}function $_(n){return V_[n]}function z_(n){return D_[n]}function hn(n){return{fieldPath:n.canonicalString()}}function dn(n){return ge.fromServerFormat(n.fieldPath)}function zh(n){return n instanceof oe?(function(t){if(t.op==="=="){if(du(t.value))return{unaryFilter:{field:hn(t.field),op:"IS_NAN"}};if(hu(t.value))return{unaryFilter:{field:hn(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(du(t.value))return{unaryFilter:{field:hn(t.field),op:"IS_NOT_NAN"}};if(hu(t.value))return{unaryFilter:{field:hn(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:hn(t.field),op:$_(t.op),value:t.value}}})(n):n instanceof Me?(function(t){const r=t.getFilters().map((s=>zh(s)));return r.length===1?r[0]:{compositeFilter:{op:z_(t.op),filters:r}}})(n):F(54877,{filter:n})}function G_(n){const e=[];return n.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function Gh(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}function Hh(n){return!!n&&typeof n._toProto=="function"&&n._protoValueType==="ProtoValue"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qe{constructor(e,t,r,s,i=U.min(),a=U.min(),u=_e.EMPTY_BYTE_STRING,l=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=u,this.expectedCount=l}withSequenceNumber(e){return new Qe(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Qe(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Qe(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Qe(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H_{constructor(e){this.gt=e}}function W_(n){const e=B_({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Vs(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class K_{constructor(){this.Sn=new Q_}addToCollectionParentIndex(e,t){return this.Sn.add(t),P.resolve()}getCollectionParents(e,t){return P.resolve(this.Sn.getEntries(t))}addFieldIndex(e,t){return P.resolve()}deleteFieldIndex(e,t){return P.resolve()}deleteAllFieldIndexes(e){return P.resolve()}createTargetIndexes(e,t){return P.resolve()}getDocumentsMatchingTarget(e,t){return P.resolve(null)}getIndexType(e,t){return P.resolve(0)}getFieldIndexes(e,t){return P.resolve([])}getNextCollectionGroupToUpdate(e){return P.resolve(null)}getMinOffset(e,t){return P.resolve(Rt.min())}getMinOffsetFromCollectionGroup(e,t){return P.resolve(Rt.min())}updateCollectionGroup(e,t,r){return P.resolve()}updateIndexEntries(e,t){return P.resolve()}}class Q_{constructor(){this.index={}}add(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t]||new he(J.comparator),i=!s.has(r);return this.index[t]=s.add(r),i}has(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t];return s&&s.has(r)}getEntries(e){return(this.index[e]||new he(J.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ru={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Wh=41943040;class Pe{static withCacheSize(e){return new Pe(e,Pe.DEFAULT_COLLECTION_PERCENTILE,Pe.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Pe.DEFAULT_COLLECTION_PERCENTILE=10,Pe.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Pe.DEFAULT=new Pe(Wh,Pe.DEFAULT_COLLECTION_PERCENTILE,Pe.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Pe.DISABLED=new Pe(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vt{constructor(e){this.ir=e}next(){return this.ir+=2,this.ir}static sr(){return new Vt(0)}static _r(){return new Vt(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pu="LruGarbageCollector",Y_=1048576;function bu([n,e],[t,r]){const s=$(n,t);return s===0?$(e,r):s}class J_{constructor(e){this.hr=e,this.buffer=new he(bu),this.Pr=0}Tr(){return++this.Pr}Ir(e){const t=[e,this.Tr()];if(this.buffer.size<this.hr)this.buffer=this.buffer.add(t);else{const r=this.buffer.last();bu(t,r)<0&&(this.buffer=this.buffer.delete(r).add(t))}}get maxValue(){return this.buffer.last()[0]}}class X_{constructor(e,t,r){this.garbageCollector=e,this.asyncQueue=t,this.localStore=r,this.Er=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Rr(6e4)}stop(){this.Er&&(this.Er.cancel(),this.Er=null)}get started(){return this.Er!==null}Rr(e){V(Pu,`Garbage collection scheduled in ${e}ms`),this.Er=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Er=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Dn(t)?V(Pu,"Ignoring IndexedDB error during garbage collection: ",t):await Vn(t)}await this.Rr(3e5)}))}}class Z_{constructor(e,t){this.Ar=e,this.params=t}calculateTargetCount(e,t){return this.Ar.Vr(e).next((r=>Math.floor(t/100*r)))}nthSequenceNumber(e,t){if(t===0)return P.resolve(Ks.ce);const r=new J_(t);return this.Ar.forEachTarget(e,(s=>r.Ir(s.sequenceNumber))).next((()=>this.Ar.dr(e,(s=>r.Ir(s))))).next((()=>r.maxValue))}removeTargets(e,t,r){return this.Ar.removeTargets(e,t,r)}removeOrphanedDocuments(e,t){return this.Ar.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(V("LruGarbageCollector","Garbage collection skipped; disabled"),P.resolve(Ru)):this.getCacheSize(e).next((r=>r<this.params.cacheSizeCollectionThreshold?(V("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Ru):this.mr(e,t)))}getCacheSize(e){return this.Ar.getCacheSize(e)}mr(e,t){let r,s,i,a,u,l,d;const p=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((g=>(g>this.params.maximumSequenceNumbersToCollect?(V("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${g}`),s=this.params.maximumSequenceNumbersToCollect):s=g,a=Date.now(),this.nthSequenceNumber(e,s)))).next((g=>(r=g,u=Date.now(),this.removeTargets(e,r,t)))).next((g=>(i=g,l=Date.now(),this.removeOrphanedDocuments(e,r)))).next((g=>(d=Date.now(),un()<=G.DEBUG&&V("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${a-p}ms
	Determined least recently used ${s} in `+(u-a)+`ms
	Removed ${i} targets in `+(l-u)+`ms
	Removed ${g} documents in `+(d-l)+`ms
Total Duration: ${d-p}ms`),P.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:g}))))}}function ey(n,e){return new Z_(n,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ty{constructor(){this.changes=new nn((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Ie.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const r=this.changes.get(t);return r!==void 0?P.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ny{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ry{constructor(e,t,r,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next((s=>(r=s,this.remoteDocumentCache.getEntry(e,t)))).next((s=>(r!==null&&lr(r.mutation,s,ke.empty(),te.now()),s)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.getLocalViewOfDocuments(e,r,z()).next((()=>r))))}getLocalViewOfDocuments(e,t,r=z()){const s=Ht();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,r).next((i=>{let a=nr();return i.forEach(((u,l)=>{a=a.insert(u,l.overlayedDocument)})),a}))))}getOverlayedDocuments(e,t){const r=Ht();return this.populateOverlays(e,r,t).next((()=>this.computeViews(e,t,r,z())))}populateOverlays(e,t,r){const s=[];return r.forEach((i=>{t.has(i)||s.push(i)})),this.documentOverlayCache.getOverlays(e,s).next((i=>{i.forEach(((a,u)=>{t.set(a,u)}))}))}computeViews(e,t,r,s){let i=nt();const a=ur(),u=(function(){return ur()})();return t.forEach(((l,d)=>{const p=r.get(d.key);s.has(d.key)&&(p===void 0||p.mutation instanceof rn)?i=i.insert(d.key,d):p!==void 0?(a.set(d.key,p.mutation.getFieldMask()),lr(p.mutation,d,p.mutation.getFieldMask(),te.now())):a.set(d.key,ke.empty())})),this.recalculateAndSaveOverlays(e,i).next((l=>(l.forEach(((d,p)=>a.set(d,p))),t.forEach(((d,p)=>u.set(d,new ny(p,a.get(d)??null)))),u)))}recalculateAndSaveOverlays(e,t){const r=ur();let s=new ne(((a,u)=>a-u)),i=z();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((a=>{for(const u of a)u.keys().forEach((l=>{const d=t.get(l);if(d===null)return;let p=r.get(l)||ke.empty();p=u.applyToLocalView(d,p),r.set(l,p);const g=(s.get(u.batchId)||z()).add(l);s=s.insert(u.batchId,g)}))})).next((()=>{const a=[],u=s.getReverseIterator();for(;u.hasNext();){const l=u.getNext(),d=l.key,p=l.value,g=bh();p.forEach((A=>{if(!i.has(A)){const b=kh(t.get(A),r.get(A));b!==null&&g.set(A,b),i=i.add(A)}})),a.push(this.documentOverlayCache.saveOverlays(e,d,g))}return P.waitFor(a)})).next((()=>r))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.recalculateAndSaveOverlays(e,r)))}getDocumentsMatchingQuery(e,t,r,s){return r_(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):vh(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,s):this.getDocumentsMatchingCollectionQuery(e,t,r,s)}getNextDocuments(e,t,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,s).next((i=>{const a=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,s-i.size):P.resolve(Ht());let u=fr,l=i;return a.next((d=>P.forEach(d,((p,g)=>(u<g.largestBatchId&&(u=g.largestBatchId),i.get(p)?P.resolve():this.remoteDocumentCache.getEntry(e,p).next((A=>{l=l.insert(p,A)}))))).next((()=>this.populateOverlays(e,d,i))).next((()=>this.computeViews(e,l,d,z()))).next((p=>({batchId:u,changes:Ph(p)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new L(t)).next((r=>{let s=nr();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s}))}getDocumentsMatchingCollectionGroupQuery(e,t,r,s){const i=t.collectionGroup;let a=nr();return this.indexManager.getCollectionParents(e,i).next((u=>P.forEach(u,(l=>{const d=(function(g,A){return new Nn(A,null,g.explicitOrderBy.slice(),g.filters.slice(),g.limit,g.limitType,g.startAt,g.endAt)})(t,l.child(i));return this.getDocumentsMatchingCollectionQuery(e,d,r,s).next((p=>{p.forEach(((g,A)=>{a=a.insert(g,A)}))}))})).next((()=>a))))}getDocumentsMatchingCollectionQuery(e,t,r,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next((a=>(i=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,i,s)))).next((a=>{i.forEach(((l,d)=>{const p=d.getKey();a.get(p)===null&&(a=a.insert(p,Ie.newInvalidDocument(p)))}));let u=nr();return a.forEach(((l,d)=>{const p=i.get(l);p!==void 0&&lr(p.mutation,d,ke.empty(),te.now()),Xs(t,d)&&(u=u.insert(l,d))})),u}))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sy{constructor(e){this.serializer=e,this.Or=new Map,this.Nr=new Map}getBundleMetadata(e,t){return P.resolve(this.Or.get(t))}saveBundleMetadata(e,t){return this.Or.set(t.id,(function(s){return{id:s.id,version:s.version,createTime:$e(s.createTime)}})(t)),P.resolve()}getNamedQuery(e,t){return P.resolve(this.Nr.get(t))}saveNamedQuery(e,t){return this.Nr.set(t.name,(function(s){return{name:s.name,query:W_(s.bundledQuery),readTime:$e(s.readTime)}})(t)),P.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iy{constructor(){this.overlays=new ne(L.comparator),this.Br=new Map}getOverlay(e,t){return P.resolve(this.overlays.get(t))}getOverlays(e,t){const r=Ht();return P.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&r.set(s,i)})))).next((()=>r))}saveOverlays(e,t,r){return r.forEach(((s,i)=>{this.wt(e,t,i)})),P.resolve()}removeOverlaysForBatchId(e,t,r){const s=this.Br.get(r);return s!==void 0&&(s.forEach((i=>this.overlays=this.overlays.remove(i))),this.Br.delete(r)),P.resolve()}getOverlaysForCollection(e,t,r){const s=Ht(),i=t.length+1,a=new L(t.child("")),u=this.overlays.getIteratorFrom(a);for(;u.hasNext();){const l=u.getNext().value,d=l.getKey();if(!t.isPrefixOf(d.path))break;d.path.length===i&&l.largestBatchId>r&&s.set(l.getKey(),l)}return P.resolve(s)}getOverlaysForCollectionGroup(e,t,r,s){let i=new ne(((d,p)=>d-p));const a=this.overlays.getIterator();for(;a.hasNext();){const d=a.getNext().value;if(d.getKey().getCollectionGroup()===t&&d.largestBatchId>r){let p=i.get(d.largestBatchId);p===null&&(p=Ht(),i=i.insert(d.largestBatchId,p)),p.set(d.getKey(),d)}}const u=Ht(),l=i.getIterator();for(;l.hasNext()&&(l.getNext().value.forEach(((d,p)=>u.set(d,p))),!(u.size()>=s)););return P.resolve(u)}wt(e,t,r){const s=this.overlays.get(r.key);if(s!==null){const a=this.Br.get(s.largestBatchId).delete(r.key);this.Br.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new v_(t,r));let i=this.Br.get(t);i===void 0&&(i=z(),this.Br.set(t,i)),this.Br.set(t,i.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oy{constructor(){this.sessionToken=_e.EMPTY_BYTE_STRING}getSessionToken(e){return P.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,P.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wo{constructor(){this.Lr=new he(pe.kr),this.qr=new he(pe.Kr)}isEmpty(){return this.Lr.isEmpty()}addReference(e,t){const r=new pe(e,t);this.Lr=this.Lr.add(r),this.qr=this.qr.add(r)}Ur(e,t){e.forEach((r=>this.addReference(r,t)))}removeReference(e,t){this.$r(new pe(e,t))}Wr(e,t){e.forEach((r=>this.removeReference(r,t)))}Qr(e){const t=new L(new J([])),r=new pe(t,e),s=new pe(t,e+1),i=[];return this.qr.forEachInRange([r,s],(a=>{this.$r(a),i.push(a.key)})),i}Gr(){this.Lr.forEach((e=>this.$r(e)))}$r(e){this.Lr=this.Lr.delete(e),this.qr=this.qr.delete(e)}zr(e){const t=new L(new J([])),r=new pe(t,e),s=new pe(t,e+1);let i=z();return this.qr.forEachInRange([r,s],(a=>{i=i.add(a.key)})),i}containsKey(e){const t=new pe(e,0),r=this.Lr.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}}class pe{constructor(e,t){this.key=e,this.jr=t}static kr(e,t){return L.comparator(e.key,t.key)||$(e.jr,t.jr)}static Kr(e,t){return $(e.jr,t.jr)||L.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ay{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Xn=1,this.Jr=new he(pe.kr)}checkEmpty(e){return P.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,s){const i=this.Xn;this.Xn++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new w_(i,t,r,s);this.mutationQueue.push(a);for(const u of s)this.Jr=this.Jr.add(new pe(u.key,i)),this.indexManager.addToCollectionParentIndex(e,u.key.path.popLast());return P.resolve(a)}lookupMutationBatch(e,t){return P.resolve(this.Hr(t))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,s=this.Zr(r),i=s<0?0:s;return P.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return P.resolve(this.mutationQueue.length===0?Mo:this.Xn-1)}getAllMutationBatches(e){return P.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const r=new pe(t,0),s=new pe(t,Number.POSITIVE_INFINITY),i=[];return this.Jr.forEachInRange([r,s],(a=>{const u=this.Hr(a.jr);i.push(u)})),P.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new he($);return t.forEach((s=>{const i=new pe(s,0),a=new pe(s,Number.POSITIVE_INFINITY);this.Jr.forEachInRange([i,a],(u=>{r=r.add(u.jr)}))})),P.resolve(this.Xr(r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,s=r.length+1;let i=r;L.isDocumentKey(i)||(i=i.child(""));const a=new pe(new L(i),0);let u=new he($);return this.Jr.forEachWhile((l=>{const d=l.key.path;return!!r.isPrefixOf(d)&&(d.length===s&&(u=u.add(l.jr)),!0)}),a),P.resolve(this.Xr(u))}Xr(e){const t=[];return e.forEach((r=>{const s=this.Hr(r);s!==null&&t.push(s)})),t}removeMutationBatch(e,t){Q(this.Yr(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.Jr;return P.forEach(t.mutations,(s=>{const i=new pe(s.key,t.batchId);return r=r.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)})).next((()=>{this.Jr=r}))}tr(e){}containsKey(e,t){const r=new pe(t,0),s=this.Jr.firstAfterOrEqual(r);return P.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,P.resolve()}Yr(e,t){return this.Zr(e)}Zr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Hr(e){const t=this.Zr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cy{constructor(e){this.ei=e,this.docs=(function(){return new ne(L.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const r=t.key,s=this.docs.get(r),i=s?s.size:0,a=this.ei(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:a}),this.size+=a-i,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const r=this.docs.get(t);return P.resolve(r?r.document.mutableCopy():Ie.newInvalidDocument(t))}getEntries(e,t){let r=nt();return t.forEach((s=>{const i=this.docs.get(s);r=r.insert(s,i?i.document.mutableCopy():Ie.newInvalidDocument(s))})),P.resolve(r)}getDocumentsMatchingQuery(e,t,r,s){let i=nt();const a=t.path,u=new L(a.child("__id-9223372036854775808__")),l=this.docs.getIteratorFrom(u);for(;l.hasNext();){const{key:d,value:{document:p}}=l.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||kg(Ng(p),r)<=0||(s.has(p.key)||Xs(t,p))&&(i=i.insert(p.key,p.mutableCopy()))}return P.resolve(i)}getAllFromCollectionGroup(e,t,r,s){F(9500)}ti(e,t){return P.forEach(this.docs,(r=>t(r)))}newChangeBuffer(e){return new uy(this)}getSize(e){return P.resolve(this.size)}}class uy extends ty{constructor(e){super(),this.Fr=e}applyChanges(e){const t=[];return this.changes.forEach(((r,s)=>{s.isValidDocument()?t.push(this.Fr.addEntry(e,s)):this.Fr.removeEntry(r)})),P.waitFor(t)}getFromCache(e,t){return this.Fr.getEntry(e,t)}getAllFromCache(e,t){return this.Fr.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ly{constructor(e){this.persistence=e,this.ni=new nn((t=>Uo(t)),Bo),this.lastRemoteSnapshotVersion=U.min(),this.highestTargetId=0,this.ri=0,this.ii=new Wo,this.targetCount=0,this.si=Vt.sr()}forEachTarget(e,t){return this.ni.forEach(((r,s)=>t(s))),P.resolve()}getLastRemoteSnapshotVersion(e){return P.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return P.resolve(this.ri)}allocateTargetId(e){return this.highestTargetId=this.si.next(),P.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.ri&&(this.ri=t),P.resolve()}cr(e){this.ni.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.si=new Vt(t),this.highestTargetId=t),e.sequenceNumber>this.ri&&(this.ri=e.sequenceNumber)}addTargetData(e,t){return this.cr(t),this.targetCount+=1,P.resolve()}updateTargetData(e,t){return this.cr(t),P.resolve()}removeTargetData(e,t){return this.ni.delete(t.target),this.ii.Qr(t.targetId),this.targetCount-=1,P.resolve()}removeTargets(e,t,r){let s=0;const i=[];return this.ni.forEach(((a,u)=>{u.sequenceNumber<=t&&r.get(u.targetId)===null&&(this.ni.delete(a),i.push(this.removeMatchingKeysForTargetId(e,u.targetId)),s++)})),P.waitFor(i).next((()=>s))}getTargetCount(e){return P.resolve(this.targetCount)}getTargetData(e,t){const r=this.ni.get(t)||null;return P.resolve(r)}addMatchingKeys(e,t,r){return this.ii.Ur(t,r),P.resolve()}removeMatchingKeys(e,t,r){this.ii.Wr(t,r);const s=this.persistence.referenceDelegate,i=[];return s&&t.forEach((a=>{i.push(s.markPotentiallyOrphaned(e,a))})),P.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.ii.Qr(t),P.resolve()}getMatchingKeysForTargetId(e,t){const r=this.ii.zr(t);return P.resolve(r)}containsKey(e,t){return P.resolve(this.ii.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kh{constructor(e,t){this.oi={},this.overlays={},this._i=new Ks(0),this.ai=!1,this.ai=!0,this.ui=new oy,this.referenceDelegate=e(this),this.ci=new ly(this),this.indexManager=new K_,this.remoteDocumentCache=(function(s){return new cy(s)})((r=>this.referenceDelegate.li(r))),this.serializer=new H_(t),this.hi=new sy(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ai=!1,Promise.resolve()}get started(){return this.ai}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new iy,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.oi[e.toKey()];return r||(r=new ay(t,this.referenceDelegate),this.oi[e.toKey()]=r),r}getGlobalsCache(){return this.ui}getTargetCache(){return this.ci}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.hi}runTransaction(e,t,r){V("MemoryPersistence","Starting transaction:",e);const s=new hy(this._i.next());return this.referenceDelegate.Pi(),r(s).next((i=>this.referenceDelegate.Ti(s).next((()=>i)))).toPromise().then((i=>(s.raiseOnCommittedEvent(),i)))}Ii(e,t){return P.or(Object.values(this.oi).map((r=>()=>r.containsKey(e,t))))}}class hy extends Lg{constructor(e){super(),this.currentSequenceNumber=e}}class Ko{constructor(e){this.persistence=e,this.Ei=new Wo,this.Ri=null}static Ai(e){return new Ko(e)}get Vi(){if(this.Ri)return this.Ri;throw F(60996)}addReference(e,t,r){return this.Ei.addReference(r,t),this.Vi.delete(r.toString()),P.resolve()}removeReference(e,t,r){return this.Ei.removeReference(r,t),this.Vi.add(r.toString()),P.resolve()}markPotentiallyOrphaned(e,t){return this.Vi.add(t.toString()),P.resolve()}removeTarget(e,t){this.Ei.Qr(t.targetId).forEach((s=>this.Vi.add(s.toString())));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next((s=>{s.forEach((i=>this.Vi.add(i.toString())))})).next((()=>r.removeTargetData(e,t)))}Pi(){this.Ri=new Set}Ti(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return P.forEach(this.Vi,(r=>{const s=L.fromPath(r);return this.di(e,s).next((i=>{i||t.removeEntry(s,U.min())}))})).next((()=>(this.Ri=null,t.apply(e))))}updateLimboDocument(e,t){return this.di(e,t).next((r=>{r?this.Vi.delete(t.toString()):this.Vi.add(t.toString())}))}li(e){return 0}di(e,t){return P.or([()=>P.resolve(this.Ei.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ii(e,t)])}}class Ls{constructor(e,t){this.persistence=e,this.mi=new nn((r=>xg(r.path)),((r,s)=>r.isEqual(s))),this.garbageCollector=ey(this,t)}static Ai(e,t){return new Ls(e,t)}Pi(){}Ti(e){return P.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}Vr(e){const t=this.gr(e);return this.persistence.getTargetCache().getTargetCount(e).next((r=>t.next((s=>r+s))))}gr(e){let t=0;return this.dr(e,(r=>{t++})).next((()=>t))}dr(e,t){return P.forEach(this.mi,((r,s)=>this.yr(e,r,s).next((i=>i?P.resolve():t(s)))))}removeTargets(e,t,r){return this.persistence.getTargetCache().removeTargets(e,t,r)}removeOrphanedDocuments(e,t){let r=0;const s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.ti(e,(a=>this.yr(e,a,t).next((u=>{u||(r++,i.removeEntry(a,U.min()))})))).next((()=>i.apply(e))).next((()=>r))}markPotentiallyOrphaned(e,t){return this.mi.set(t,e.currentSequenceNumber),P.resolve()}removeTarget(e,t){const r=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,t,r){return this.mi.set(r,e.currentSequenceNumber),P.resolve()}removeReference(e,t,r){return this.mi.set(r,e.currentSequenceNumber),P.resolve()}updateLimboDocument(e,t){return this.mi.set(t,e.currentSequenceNumber),P.resolve()}li(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=ms(e.data.value)),t}yr(e,t,r){return P.or([()=>this.persistence.Ii(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const s=this.mi.get(t);return P.resolve(s!==void 0&&s>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qo{constructor(e,t,r,s){this.targetId=e,this.fromCache=t,this.Ps=r,this.Ts=s}static Is(e,t){let r=z(),s=z();for(const i of t.docChanges)switch(i.type){case 0:r=r.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new Qo(e,t.fromCache,r,s)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dy{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fy{constructor(){this.Es=!1,this.Rs=!1,this.As=100,this.Vs=(function(){return Xp()?8:Mg(we())>0?6:4})()}initialize(e,t){this.ds=e,this.indexManager=t,this.Es=!0}getDocumentsMatchingQuery(e,t,r,s){const i={result:null};return this.fs(e,t).next((a=>{i.result=a})).next((()=>{if(!i.result)return this.gs(e,t,s,r).next((a=>{i.result=a}))})).next((()=>{if(i.result)return;const a=new dy;return this.ps(e,t,a).next((u=>{if(i.result=u,this.Rs)return this.ys(e,t,a,u.size)}))})).next((()=>i.result))}ys(e,t,r,s){return r.documentReadCount<this.As?(un()<=G.DEBUG&&V("QueryEngine","SDK will not create cache indexes for query:",ln(t),"since it only creates cache indexes for collection contains","more than or equal to",this.As,"documents"),P.resolve()):(un()<=G.DEBUG&&V("QueryEngine","Query:",ln(t),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.Vs*s?(un()<=G.DEBUG&&V("QueryEngine","The SDK decides to create cache indexes for query:",ln(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,qe(t))):P.resolve())}fs(e,t){if(gu(t))return P.resolve(null);let r=qe(t);return this.indexManager.getIndexType(e,r).next((s=>s===0?null:(t.limit!==null&&s===1&&(t=Vs(t,null,"F"),r=qe(t)),this.indexManager.getDocumentsMatchingTarget(e,r).next((i=>{const a=z(...i);return this.ds.getDocuments(e,a).next((u=>this.indexManager.getMinOffset(e,r).next((l=>{const d=this.ws(t,u);return this.Ss(t,d,a,l.readTime)?this.fs(e,Vs(t,null,"F")):this.bs(e,d,t,l)}))))})))))}gs(e,t,r,s){return gu(t)||s.isEqual(U.min())?P.resolve(null):this.ds.getDocuments(e,r).next((i=>{const a=this.ws(t,i);return this.Ss(t,a,r,s)?P.resolve(null):(un()<=G.DEBUG&&V("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),ln(t)),this.bs(e,a,t,Dg(s,fr)).next((u=>u)))}))}ws(e,t){let r=new he(Sh(e));return t.forEach(((s,i)=>{Xs(e,i)&&(r=r.add(i))})),r}Ss(e,t,r,s){if(e.limit===null)return!1;if(r.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}ps(e,t,r){return un()<=G.DEBUG&&V("QueryEngine","Using full collection scan to execute query:",ln(t)),this.ds.getDocumentsMatchingQuery(e,t,Rt.min(),r)}bs(e,t,r,s){return this.ds.getDocumentsMatchingQuery(e,r,s).next((i=>(t.forEach((a=>{i=i.insert(a.key,a)})),i)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yo="LocalStore",py=3e8;class my{constructor(e,t,r,s){this.persistence=e,this.Ds=t,this.serializer=s,this.Cs=new ne($),this.vs=new nn((i=>Uo(i)),Bo),this.Fs=new Map,this.Ms=e.getRemoteDocumentCache(),this.ci=e.getTargetCache(),this.hi=e.getBundleCache(),this.xs(r)}xs(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new ry(this.Ms,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Ms.setIndexManager(this.indexManager),this.Ds.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Cs)))}}function gy(n,e,t,r){return new my(n,e,t,r)}async function Qh(n,e){const t=B(n);return await t.persistence.runTransaction("Handle user change","readonly",(r=>{let s;return t.mutationQueue.getAllMutationBatches(r).next((i=>(s=i,t.xs(e),t.mutationQueue.getAllMutationBatches(r)))).next((i=>{const a=[],u=[];let l=z();for(const d of s){a.push(d.batchId);for(const p of d.mutations)l=l.add(p.key)}for(const d of i){u.push(d.batchId);for(const p of d.mutations)l=l.add(p.key)}return t.localDocuments.getDocuments(r,l).next((d=>({Os:d,removedBatchIds:a,addedBatchIds:u})))}))}))}function _y(n,e){const t=B(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(r=>{const s=e.batch.keys(),i=t.Ms.newChangeBuffer({trackRemovals:!0});return(function(u,l,d,p){const g=d.batch,A=g.keys();let b=P.resolve();return A.forEach((k=>{b=b.next((()=>p.getEntry(l,k))).next((O=>{const N=d.docVersions.get(k);Q(N!==null,48541),O.version.compareTo(N)<0&&(g.applyToRemoteDocument(O,d),O.isValidDocument()&&(O.setReadTime(d.commitVersion),p.addEntry(O)))}))})),b.next((()=>u.mutationQueue.removeMutationBatch(l,g)))})(t,r,e,i).next((()=>i.apply(r))).next((()=>t.mutationQueue.performConsistencyCheck(r))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(r,s,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,(function(u){let l=z();for(let d=0;d<u.mutationResults.length;++d)u.mutationResults[d].transformResults.length>0&&(l=l.add(u.batch.mutations[d].key));return l})(e)))).next((()=>t.localDocuments.getDocuments(r,s)))}))}function Yh(n){const e=B(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.ci.getLastRemoteSnapshotVersion(t)))}function yy(n,e){const t=B(n),r=e.snapshotVersion;let s=t.Cs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{const a=t.Ms.newChangeBuffer({trackRemovals:!0});s=t.Cs;const u=[];e.targetChanges.forEach(((p,g)=>{const A=s.get(g);if(!A)return;u.push(t.ci.removeMatchingKeys(i,p.removedDocuments,g).next((()=>t.ci.addMatchingKeys(i,p.addedDocuments,g))));let b=A.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(g)!==null?b=b.withResumeToken(_e.EMPTY_BYTE_STRING,U.min()).withLastLimboFreeSnapshotVersion(U.min()):p.resumeToken.approximateByteSize()>0&&(b=b.withResumeToken(p.resumeToken,r)),s=s.insert(g,b),(function(O,N,W){return O.resumeToken.approximateByteSize()===0||N.snapshotVersion.toMicroseconds()-O.snapshotVersion.toMicroseconds()>=py?!0:W.addedDocuments.size+W.modifiedDocuments.size+W.removedDocuments.size>0})(A,b,p)&&u.push(t.ci.updateTargetData(i,b))}));let l=nt(),d=z();if(e.documentUpdates.forEach((p=>{e.resolvedLimboDocuments.has(p)&&u.push(t.persistence.referenceDelegate.updateLimboDocument(i,p))})),u.push(Ey(i,a,e.documentUpdates).next((p=>{l=p.Ns,d=p.Bs}))),!r.isEqual(U.min())){const p=t.ci.getLastRemoteSnapshotVersion(i).next((g=>t.ci.setTargetsMetadata(i,i.currentSequenceNumber,r)));u.push(p)}return P.waitFor(u).next((()=>a.apply(i))).next((()=>t.localDocuments.getLocalViewOfDocuments(i,l,d))).next((()=>l))})).then((i=>(t.Cs=s,i)))}function Ey(n,e,t){let r=z(),s=z();return t.forEach((i=>r=r.add(i))),e.getEntries(n,r).next((i=>{let a=nt();return t.forEach(((u,l)=>{const d=i.get(u);l.isFoundDocument()!==d.isFoundDocument()&&(s=s.add(u)),l.isNoDocument()&&l.version.isEqual(U.min())?(e.removeEntry(u,l.readTime),a=a.insert(u,l)):!d.isValidDocument()||l.version.compareTo(d.version)>0||l.version.compareTo(d.version)===0&&d.hasPendingWrites?(e.addEntry(l),a=a.insert(u,l)):V(Yo,"Ignoring outdated watch update for ",u,". Current version:",d.version," Watch version:",l.version)})),{Ns:a,Bs:s}}))}function Ty(n,e){const t=B(n);return t.persistence.runTransaction("Get next mutation batch","readonly",(r=>(e===void 0&&(e=Mo),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e))))}function Iy(n,e){const t=B(n);return t.persistence.runTransaction("Allocate target","readwrite",(r=>{let s;return t.ci.getTargetData(r,e).next((i=>i?(s=i,P.resolve(s)):t.ci.allocateTargetId(r).next((a=>(s=new Qe(e,a,"TargetPurposeListen",r.currentSequenceNumber),t.ci.addTargetData(r,s).next((()=>s)))))))})).then((r=>{const s=t.Cs.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.Cs=t.Cs.insert(r.targetId,r),t.vs.set(e,r.targetId)),r}))}async function wo(n,e,t){const r=B(n),s=r.Cs.get(e),i=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",i,(a=>r.persistence.referenceDelegate.removeTarget(a,s)))}catch(a){if(!Dn(a))throw a;V(Yo,`Failed to update sequence numbers for target ${e}: ${a}`)}r.Cs=r.Cs.remove(e),r.vs.delete(s.target)}function Cu(n,e,t){const r=B(n);let s=U.min(),i=z();return r.persistence.runTransaction("Execute query","readwrite",(a=>(function(l,d,p){const g=B(l),A=g.vs.get(p);return A!==void 0?P.resolve(g.Cs.get(A)):g.ci.getTargetData(d,p)})(r,a,qe(e)).next((u=>{if(u)return s=u.lastLimboFreeSnapshotVersion,r.ci.getMatchingKeysForTargetId(a,u.targetId).next((l=>{i=l}))})).next((()=>r.Ds.getDocumentsMatchingQuery(a,e,t?s:U.min(),t?i:z()))).next((u=>(wy(r,o_(e),u),{documents:u,Ls:i})))))}function wy(n,e,t){let r=n.Fs.get(e)||U.min();t.forEach(((s,i)=>{i.readTime.compareTo(r)>0&&(r=i.readTime)})),n.Fs.set(e,r)}class Vu{constructor(){this.activeTargetIds=d_()}Ws(e){this.activeTargetIds=this.activeTargetIds.add(e)}Qs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}$s(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class vy{constructor(){this.Co=new Vu,this.vo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.Co.Ws(e),this.vo[e]||"not-current"}updateQueryState(e,t,r){this.vo[e]=t}removeLocalQueryTarget(e){this.Co.Qs(e)}isLocalQueryTarget(e){return this.Co.activeTargetIds.has(e)}clearQueryState(e){delete this.vo[e]}getAllActiveQueryTargets(){return this.Co.activeTargetIds}isActiveQueryTarget(e){return this.Co.activeTargetIds.has(e)}start(){return this.Co=new Vu,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ay{Fo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Du="ConnectivityMonitor";class Nu{constructor(){this.Mo=()=>this.xo(),this.Oo=()=>this.No(),this.Bo=[],this.Lo()}Fo(e){this.Bo.push(e)}shutdown(){window.removeEventListener("online",this.Mo),window.removeEventListener("offline",this.Oo)}Lo(){window.addEventListener("online",this.Mo),window.addEventListener("offline",this.Oo)}xo(){V(Du,"Network connectivity changed: AVAILABLE");for(const e of this.Bo)e(0)}No(){V(Du,"Network connectivity changed: UNAVAILABLE");for(const e of this.Bo)e(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let os=null;function vo(){return os===null?os=(function(){return 268435456+Math.round(2147483648*Math.random())})():os++,"0x"+os.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ji="RestConnection",Sy={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class Ry{get ko(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.qo=t+"://"+e.host,this.Ko=`projects/${r}/databases/${s}`,this.Uo=this.databaseId.database===Ps?`project_id=${r}`:`project_id=${r}&database_id=${s}`}$o(e,t,r,s,i){const a=vo(),u=this.Wo(e,t.toUriEncodedString());V(Ji,`Sending RPC '${e}' ${a}:`,u,r);const l={"google-cloud-resource-prefix":this.Ko,"x-goog-request-params":this.Uo};this.Qo(l,s,i);const{host:d}=new URL(u),p=br(d);return this.Go(e,u,l,r,p).then((g=>(V(Ji,`Received RPC '${e}' ${a}: `,g),g)),(g=>{throw Jt(Ji,`RPC '${e}' ${a} failed with error: `,g,"url: ",u,"request:",r),g}))}zo(e,t,r,s,i,a){return this.$o(e,t,r,s,i)}Qo(e,t,r){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+Cn})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((s,i)=>e[i]=s)),r&&r.headers.forEach(((s,i)=>e[i]=s))}Wo(e,t){const r=Sy[e];let s=`${this.qo}/v1/${t}:${r}`;return this.databaseInfo.apiKey&&(s=`${s}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),s}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Py{constructor(e){this.jo=e.jo,this.Jo=e.Jo}Ho(e){this.Zo=e}Xo(e){this.Yo=e}e_(e){this.t_=e}onMessage(e){this.n_=e}close(){this.Jo()}send(e){this.jo(e)}r_(){this.Zo()}i_(){this.Yo()}s_(e){this.t_(e)}o_(e){this.n_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ee="WebChannelConnection",Zn=(n,e,t)=>{n.listen(e,(r=>{try{t(r)}catch(s){setTimeout((()=>{throw s}),0)}}))};class mn extends Ry{constructor(e){super(e),this.__=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static a_(){if(!mn.u_){const e=eh();Zn(e,Zl.STAT_EVENT,(t=>{t.stat===ho.PROXY?V(Ee,"STAT_EVENT: detected buffering proxy"):t.stat===ho.NOPROXY&&V(Ee,"STAT_EVENT: detected no buffering proxy")})),mn.u_=!0}}Go(e,t,r,s,i){const a=vo();return new Promise(((u,l)=>{const d=new Jl;d.setWithCredentials(!0),d.listenOnce(Xl.COMPLETE,(()=>{try{switch(d.getLastErrorCode()){case ps.NO_ERROR:const g=d.getResponseJson();V(Ee,`XHR for RPC '${e}' ${a} received:`,JSON.stringify(g)),u(g);break;case ps.TIMEOUT:V(Ee,`RPC '${e}' ${a} timed out`),l(new D(R.DEADLINE_EXCEEDED,"Request time out"));break;case ps.HTTP_ERROR:const A=d.getStatus();if(V(Ee,`RPC '${e}' ${a} failed with status:`,A,"response text:",d.getResponseText()),A>0){let b=d.getResponseJson();Array.isArray(b)&&(b=b[0]);const k=b==null?void 0:b.error;if(k&&k.status&&k.message){const O=(function(W){const K=W.toLowerCase().replace(/_/g,"-");return Object.values(R).indexOf(K)>=0?K:R.UNKNOWN})(k.status);l(new D(O,k.message))}else l(new D(R.UNKNOWN,"Server responded with status "+d.getStatus()))}else l(new D(R.UNAVAILABLE,"Connection failed."));break;default:F(9055,{c_:e,streamId:a,l_:d.getLastErrorCode(),h_:d.getLastError()})}}finally{V(Ee,`RPC '${e}' ${a} completed.`)}}));const p=JSON.stringify(s);V(Ee,`RPC '${e}' ${a} sending request:`,s),d.send(t,"POST",p,r,15)}))}P_(e,t,r){const s=vo(),i=[this.qo,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=this.createWebChannelTransport(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},l=this.longPollingOptions.timeoutSeconds;l!==void 0&&(u.longPollingTimeout=Math.round(1e3*l)),this.useFetchStreams&&(u.useFetchStreams=!0),this.Qo(u.initMessageHeaders,t,r),u.encodeInitMessageHeaders=!0;const d=i.join("");V(Ee,`Creating RPC '${e}' stream ${s}: ${d}`,u);const p=a.createWebChannel(d,u);this.T_(p);let g=!1,A=!1;const b=new Py({jo:k=>{A?V(Ee,`Not sending because RPC '${e}' stream ${s} is closed:`,k):(g||(V(Ee,`Opening RPC '${e}' stream ${s} transport.`),p.open(),g=!0),V(Ee,`RPC '${e}' stream ${s} sending:`,k),p.send(k))},Jo:()=>p.close()});return Zn(p,tr.EventType.OPEN,(()=>{A||(V(Ee,`RPC '${e}' stream ${s} transport opened.`),b.r_())})),Zn(p,tr.EventType.CLOSE,(()=>{A||(A=!0,V(Ee,`RPC '${e}' stream ${s} transport closed`),b.s_(),this.I_(p))})),Zn(p,tr.EventType.ERROR,(k=>{A||(A=!0,Jt(Ee,`RPC '${e}' stream ${s} transport errored. Name:`,k.name,"Message:",k.message),b.s_(new D(R.UNAVAILABLE,"The operation could not be completed")))})),Zn(p,tr.EventType.MESSAGE,(k=>{var O;if(!A){const N=k.data[0];Q(!!N,16349);const W=N,K=(W==null?void 0:W.error)||((O=W[0])==null?void 0:O.error);if(K){V(Ee,`RPC '${e}' stream ${s} received error:`,K);const X=K.status;let ve=(function(T){const m=ie[T];if(m!==void 0)return Mh(m)})(X),de=K.message;X==="NOT_FOUND"&&de.includes("database")&&de.includes("does not exist")&&de.includes(this.databaseId.database)&&Jt(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),ve===void 0&&(ve=R.INTERNAL,de="Unknown error status: "+X+" with message "+K.message),A=!0,b.s_(new D(ve,de)),p.close()}else V(Ee,`RPC '${e}' stream ${s} received:`,N),b.o_(N)}})),mn.a_(),setTimeout((()=>{b.i_()}),0),b}terminate(){this.__.forEach((e=>e.close())),this.__=[]}T_(e){this.__.push(e)}I_(e){this.__=this.__.filter((t=>t===e))}Qo(e,t,r){super.Qo(e,t,r),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return th()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function by(n){return new mn(n)}function Xi(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ni(n){return new N_(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */mn.u_=!1;class Jh{constructor(e,t,r=1e3,s=1.5,i=6e4){this.Di=e,this.timerId=t,this.E_=r,this.R_=s,this.A_=i,this.V_=0,this.d_=null,this.m_=Date.now(),this.reset()}reset(){this.V_=0}f_(){this.V_=this.A_}g_(e){this.cancel();const t=Math.floor(this.V_+this.p_()),r=Math.max(0,Date.now()-this.m_),s=Math.max(0,t-r);s>0&&V("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.V_} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.d_=this.Di.enqueueAfterDelay(this.timerId,s,(()=>(this.m_=Date.now(),e()))),this.V_*=this.R_,this.V_<this.E_&&(this.V_=this.E_),this.V_>this.A_&&(this.V_=this.A_)}y_(){this.d_!==null&&(this.d_.skipDelay(),this.d_=null)}cancel(){this.d_!==null&&(this.d_.cancel(),this.d_=null)}p_(){return(Math.random()-.5)*this.V_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ku="PersistentStream";class Xh{constructor(e,t,r,s,i,a,u,l){this.Di=e,this.w_=r,this.S_=s,this.connection=i,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=u,this.listener=l,this.state=0,this.b_=0,this.D_=null,this.C_=null,this.stream=null,this.v_=0,this.F_=new Jh(e,t)}M_(){return this.state===1||this.state===5||this.x_()}x_(){return this.state===2||this.state===3}start(){this.v_=0,this.state!==4?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&this.D_===null&&(this.D_=this.Di.enqueueAfterDelay(this.w_,6e4,(()=>this.L_())))}k_(e){this.q_(),this.stream.send(e)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}K_(){this.C_&&(this.C_.cancel(),this.C_=null)}async close(e,t){this.q_(),this.K_(),this.F_.cancel(),this.b_++,e!==4?this.F_.reset():t&&t.code===R.RESOURCE_EXHAUSTED?(tt(t.toString()),tt("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):t&&t.code===R.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.U_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.e_(t)}U_(){}auth(){this.state=1;const e=this.W_(this.b_),t=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([r,s])=>{this.b_===t&&this.Q_(r,s)}),(r=>{e((()=>{const s=new D(R.UNKNOWN,"Fetching auth token failed: "+r.message);return this.G_(s)}))}))}Q_(e,t){const r=this.W_(this.b_);this.stream=this.z_(e,t),this.stream.Ho((()=>{r((()=>this.listener.Ho()))})),this.stream.Xo((()=>{r((()=>(this.state=2,this.C_=this.Di.enqueueAfterDelay(this.S_,1e4,(()=>(this.x_()&&(this.state=3),Promise.resolve()))),this.listener.Xo())))})),this.stream.e_((s=>{r((()=>this.G_(s)))})),this.stream.onMessage((s=>{r((()=>++this.v_==1?this.j_(s):this.onNext(s)))}))}O_(){this.state=5,this.F_.g_((async()=>{this.state=0,this.start()}))}G_(e){return V(ku,`close with error: ${e}`),this.stream=null,this.close(4,e)}W_(e){return t=>{this.Di.enqueueAndForget((()=>this.b_===e?t():(V(ku,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class Cy extends Xh{constructor(e,t,r,s,i,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,s,a),this.serializer=i}z_(e,t){return this.connection.P_("Listen",e,t)}j_(e){return this.onNext(e)}onNext(e){this.F_.reset();const t=L_(this.serializer,e),r=(function(i){if(!("targetChange"in i))return U.min();const a=i.targetChange;return a.targetIds&&a.targetIds.length?U.min():a.readTime?$e(a.readTime):U.min()})(e);return this.listener.J_(t,r)}H_(e){const t={};t.database=Io(this.serializer),t.addTarget=(function(i,a){let u;const l=a.target;if(u=go(l)?{documents:x_(i,l)}:{query:U_(i,l).dt},u.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){u.resumeToken=Uh(i,a.resumeToken);const d=yo(i,a.expectedCount);d!==null&&(u.expectedCount=d)}else if(a.snapshotVersion.compareTo(U.min())>0){u.readTime=Os(i,a.snapshotVersion.toTimestamp());const d=yo(i,a.expectedCount);d!==null&&(u.expectedCount=d)}return u})(this.serializer,e);const r=j_(this.serializer,e);r&&(t.labels=r),this.k_(t)}Z_(e){const t={};t.database=Io(this.serializer),t.removeTarget=e,this.k_(t)}}class Vy extends Xh{constructor(e,t,r,s,i,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,s,a),this.serializer=i}get X_(){return this.v_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.X_&&this.Y_([])}z_(e,t){return this.connection.P_("Write",e,t)}j_(e){return Q(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,Q(!e.writeResults||e.writeResults.length===0,55816),this.listener.ea()}onNext(e){Q(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.F_.reset();const t=F_(e.writeResults,e.commitTime),r=$e(e.commitTime);return this.listener.ta(r,t)}na(){const e={};e.database=Io(this.serializer),this.k_(e)}Y_(e){const t={streamToken:this.lastStreamToken,writes:e.map((r=>M_(this.serializer,r)))};this.k_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dy{}class Ny extends Dy{constructor(e,t,r,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=s,this.ra=!1}ia(){if(this.ra)throw new D(R.FAILED_PRECONDITION,"The client has already been terminated.")}$o(e,t,r,s){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,a])=>this.connection.$o(e,Eo(t,r),s,i,a))).catch((i=>{throw i.name==="FirebaseError"?(i.code===R.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new D(R.UNKNOWN,i.toString())}))}zo(e,t,r,s,i){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([a,u])=>this.connection.zo(e,Eo(t,r),s,a,u,i))).catch((a=>{throw a.name==="FirebaseError"?(a.code===R.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new D(R.UNKNOWN,a.toString())}))}terminate(){this.ra=!0,this.connection.terminate()}}function ky(n,e,t,r){return new Ny(n,e,t,r)}class Oy{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve()))))}la(e){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ua("Offline")))}set(e){this.ha(),this.sa=0,e==="Online"&&(this._a=!1),this.ua(e)}ua(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ca(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?(tt(t),this._a=!1):V("OnlineStateTracker",t)}ha(){this.oa!==null&&(this.oa.cancel(),this.oa=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ke="RemoteStore";class Ly{constructor(e,t,r,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Map,this.Ea=new Map,this.Ra=new Vt(1e3),this.Aa=new Vt(1001),this.Va=new Set,this.da=[],this.ma=i,this.ma.Fo((a=>{r.enqueueAndForget((async()=>{sn(this)&&(V(Ke,"Restarting streams for network reachability change."),await(async function(l){const d=B(l);d.Va.add(4),await kr(d),d.fa.set("Unknown"),d.Va.delete(4),await ri(d)})(this))}))})),this.fa=new Oy(r,s)}}async function ri(n){if(sn(n))for(const e of n.da)await e(!0)}async function kr(n){for(const e of n.da)await e(!1)}function Ao(n,e){return n.Ia.get(e)||void 0}function Zh(n,e){const t=B(n),r=Ao(t,e.targetId);if(r!==void 0&&t.Ta.has(r))return;const s=(function(u,l){const d=Ao(u,l);d!==void 0&&u.Ea.delete(d);const p=(function(A,b){return b%2!=0?A.Aa.next():A.Ra.next()})(u,l);return u.Ia.set(l,p),u.Ea.set(p,l),p})(t,e.targetId);V(Ke,"remoteStoreListen mapping SDK target ID to remote",e.targetId,s);const i=new Qe(e.target,s,e.purpose,e.sequenceNumber,e.snapshotVersion,e.lastLimboFreeSnapshotVersion,e.resumeToken);t.Ta.set(s,i),ea(t)?Zo(t):kn(t).x_()&&Xo(t,i)}function Jo(n,e){const t=B(n),r=kn(t),s=Ao(t,e);V(Ke,"remoteStoreUnlisten removing mapping of SDK target ID to remote",e,s),t.Ta.delete(s),t.Ia.delete(e),t.Ea.delete(s),r.x_()&&ed(t,s),t.Ta.size===0&&(r.x_()?r.B_():sn(t)&&t.fa.set("Unknown"))}function Xo(n,e){if(n.ga.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(U.min())>0){const t=n.Ea.get(e.targetId);if(t===void 0)return void V(Ke,"SDK target ID not found for remote ID: "+e.targetId);const r=n.remoteSyncer.getRemoteKeysForTarget(t).size;e=e.withExpectedCount(r)}kn(n).H_(e)}function ed(n,e){n.ga.$e(e),kn(n).Z_(e)}function Zo(n){n.ga=new b_({getRemoteKeysForTarget:e=>{const t=n.Ea.get(e);return t!==void 0?n.remoteSyncer.getRemoteKeysForTarget(t):z()},Rt:e=>n.Ta.get(e)||null,lt:()=>n.datastore.serializer.databaseId}),kn(n).start(),n.fa.aa()}function ea(n){return sn(n)&&!kn(n).M_()&&n.Ta.size>0}function sn(n){return B(n).Va.size===0}function td(n){n.ga=void 0}async function My(n){n.fa.set("Online")}async function Fy(n){n.Ta.forEach(((e,t)=>{Xo(n,e)}))}async function xy(n,e){td(n),ea(n)?(n.fa.la(e),Zo(n)):n.fa.set("Unknown")}async function Uy(n,e,t){if(n.fa.set("Online"),e instanceof xh&&e.state===2&&e.cause)try{await(async function(s,i){const a=i.cause;for(const u of i.targetIds){if(s.Ta.has(u)){const l=s.Ea.get(u);l!==void 0&&(await s.remoteSyncer.rejectListen(l,a),s.Ia.delete(l),s.Ea.delete(u)),s.Ta.delete(u)}s.ga.removeTarget(u)}})(n,e)}catch(r){V(Ke,"Failed to remove targets %s: %s ",e.targetIds.join(","),r),await Ms(n,r)}else if(e instanceof ys?n.ga.Xe(e):e instanceof Fh?n.ga.it(e):n.ga.tt(e),!t.isEqual(U.min()))try{const r=await Yh(n.localStore);t.compareTo(r)>=0&&await(function(i,a){const u=i.ga.Pt(a);u.targetChanges.forEach(((d,p)=>{if(d.resumeToken.approximateByteSize()>0){const g=i.Ta.get(p);g&&i.Ta.set(p,g.withResumeToken(d.resumeToken,a))}})),u.targetMismatches.forEach(((d,p)=>{const g=i.Ta.get(d);if(!g)return;i.Ta.set(d,g.withResumeToken(_e.EMPTY_BYTE_STRING,g.snapshotVersion)),ed(i,d);const A=new Qe(g.target,d,p,g.sequenceNumber);Xo(i,A)}));const l=(function(p,g){const A=new Map;g.targetChanges.forEach(((k,O)=>{const N=p.Ea.get(O);N!==void 0&&A.set(N,k)}));let b=new ne($);return g.targetMismatches.forEach(((k,O)=>{const N=p.Ea.get(k);N!==void 0&&(b=b.insert(N,O))})),new Dr(g.snapshotVersion,A,b,g.documentUpdates,g.resolvedLimboDocuments)})(i,u);return i.remoteSyncer.applyRemoteEvent(l)})(n,t)}catch(r){V(Ke,"Failed to raise snapshot:",r),await Ms(n,r)}}async function Ms(n,e,t){if(!Dn(e))throw e;n.Va.add(1),await kr(n),n.fa.set("Offline"),t||(t=()=>Yh(n.localStore)),n.asyncQueue.enqueueRetryable((async()=>{V(Ke,"Retrying IndexedDB access"),await t(),n.Va.delete(1),await ri(n)}))}function nd(n,e){return e().catch((t=>Ms(n,t,e)))}async function si(n){const e=B(n),t=Dt(e);let r=e.Pa.length>0?e.Pa[e.Pa.length-1].batchId:Mo;for(;By(e);)try{const s=await Ty(e.localStore,r);if(s===null){e.Pa.length===0&&t.B_();break}r=s.batchId,jy(e,s)}catch(s){await Ms(e,s)}rd(e)&&sd(e)}function By(n){return sn(n)&&n.Pa.length<10}function jy(n,e){n.Pa.push(e);const t=Dt(n);t.x_()&&t.X_&&t.Y_(e.mutations)}function rd(n){return sn(n)&&!Dt(n).M_()&&n.Pa.length>0}function sd(n){Dt(n).start()}async function qy(n){Dt(n).na()}async function $y(n){const e=Dt(n);for(const t of n.Pa)e.Y_(t.mutations)}async function zy(n,e,t){const r=n.Pa.shift(),s=zo.from(r,e,t);await nd(n,(()=>n.remoteSyncer.applySuccessfulWrite(s))),await si(n)}async function Gy(n,e){e&&Dt(n).X_&&await(async function(r,s){if((function(a){return S_(a)&&a!==R.ABORTED})(s.code)){const i=r.Pa.shift();Dt(r).N_(),await nd(r,(()=>r.remoteSyncer.rejectFailedWrite(i.batchId,s))),await si(r)}})(n,e),rd(n)&&sd(n)}async function Ou(n,e){const t=B(n);t.asyncQueue.verifyOperationInProgress(),V(Ke,"RemoteStore received new credentials");const r=sn(t);t.Va.add(3),await kr(t),r&&t.fa.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Va.delete(3),await ri(t)}async function Hy(n,e){const t=B(n);e?(t.Va.delete(2),await ri(t)):e||(t.Va.add(2),await kr(t),t.fa.set("Unknown"))}function kn(n){return n.pa||(n.pa=(function(t,r,s){const i=B(t);return i.ia(),new Cy(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(n.datastore,n.asyncQueue,{Ho:My.bind(null,n),Xo:Fy.bind(null,n),e_:xy.bind(null,n),J_:Uy.bind(null,n)}),n.da.push((async e=>{e?(n.pa.N_(),ea(n)?Zo(n):n.fa.set("Unknown")):(await n.pa.stop(),td(n))}))),n.pa}function Dt(n){return n.ya||(n.ya=(function(t,r,s){const i=B(t);return i.ia(),new Vy(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(n.datastore,n.asyncQueue,{Ho:()=>Promise.resolve(),Xo:qy.bind(null,n),e_:Gy.bind(null,n),ea:$y.bind(null,n),ta:zy.bind(null,n)}),n.da.push((async e=>{e?(n.ya.N_(),await si(n)):(await n.ya.stop(),n.Pa.length>0&&(V(Ke,`Stopping write stream with ${n.Pa.length} pending writes`),n.Pa=[]))}))),n.ya}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ta{constructor(e,t,r,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=i,this.deferred=new Xe,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((a=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,i){const a=Date.now()+r,u=new ta(e,t,a,s,i);return u.start(r),u}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new D(R.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function na(n,e){if(tt("AsyncQueue",`${e}: ${n}`),Dn(n))return new D(R.UNAVAILABLE,`${e}: ${n}`);throw n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gn{static emptySet(e){return new gn(e.comparator)}constructor(e){this.comparator=e?(t,r)=>e(t,r)||L.comparator(t.key,r.key):(t,r)=>L.comparator(t.key,r.key),this.keyedMap=nr(),this.sortedSet=new ne(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,r)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof gn)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=r.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const r=new gn;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=t,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lu{constructor(){this.wa=new ne(L.comparator)}track(e){const t=e.doc.key,r=this.wa.get(t);r?e.type!==0&&r.type===3?this.wa=this.wa.insert(t,e):e.type===3&&r.type!==1?this.wa=this.wa.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.wa=this.wa.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.wa=this.wa.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.wa=this.wa.remove(t):e.type===1&&r.type===2?this.wa=this.wa.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.wa=this.wa.insert(t,{type:2,doc:e.doc}):F(63341,{At:e,Sa:r}):this.wa=this.wa.insert(t,e)}ba(){const e=[];return this.wa.inorderTraversal(((t,r)=>{e.push(r)})),e}}class Pn{constructor(e,t,r,s,i,a,u,l,d){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=i,this.fromCache=a,this.syncStateChanged=u,this.excludesMetadataChanges=l,this.hasCachedResults=d}static fromInitialDocuments(e,t,r,s,i){const a=[];return t.forEach((u=>{a.push({type:0,doc:u})})),new Pn(e,t,gn.emptySet(t),a,r,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Js(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==r[s].type||!t[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wy{constructor(){this.Da=void 0,this.Ca=[]}va(){return this.Ca.some((e=>e.Fa()))}}class Ky{constructor(){this.queries=Mu(),this.onlineState="Unknown",this.Ma=new Set}terminate(){(function(t,r){const s=B(t),i=s.queries;s.queries=Mu(),i.forEach(((a,u)=>{for(const l of u.Ca)l.onError(r)}))})(this,new D(R.ABORTED,"Firestore shutting down"))}}function Mu(){return new nn((n=>Ah(n)),Js)}async function id(n,e){const t=B(n);let r=3;const s=e.query;let i=t.queries.get(s);i?!i.va()&&e.Fa()&&(r=2):(i=new Wy,r=e.Fa()?0:1);try{switch(r){case 0:i.Da=await t.onListen(s,!0);break;case 1:i.Da=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(a){const u=na(a,`Initialization of query '${ln(e.query)}' failed`);return void e.onError(u)}t.queries.set(s,i),i.Ca.push(e),e.xa(t.onlineState),i.Da&&e.Oa(i.Da)&&ra(t)}async function od(n,e){const t=B(n),r=e.query;let s=3;const i=t.queries.get(r);if(i){const a=i.Ca.indexOf(e);a>=0&&(i.Ca.splice(a,1),i.Ca.length===0?s=e.Fa()?0:1:!i.va()&&e.Fa()&&(s=2))}switch(s){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function Qy(n,e){const t=B(n);let r=!1;for(const s of e){const i=s.query,a=t.queries.get(i);if(a){for(const u of a.Ca)u.Oa(s)&&(r=!0);a.Da=s}}r&&ra(t)}function Yy(n,e,t){const r=B(n),s=r.queries.get(e);if(s)for(const i of s.Ca)i.onError(t);r.queries.delete(e)}function ra(n){n.Ma.forEach((e=>{e.next()}))}var So,Fu;(Fu=So||(So={})).Na="default",Fu.Cache="cache";class ad{constructor(e,t,r){this.query=e,this.Ba=t,this.La=!1,this.ka=null,this.onlineState="Unknown",this.options=r||{}}Oa(e){if(!this.options.includeMetadataChanges){const r=[];for(const s of e.docChanges)s.type!==3&&r.push(s);e=new Pn(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.La?this.qa(e)&&(this.Ba.next(e),t=!0):this.Ka(e,this.onlineState)&&(this.Ua(e),t=!0),this.ka=e,t}onError(e){this.Ba.error(e)}xa(e){this.onlineState=e;let t=!1;return this.ka&&!this.La&&this.Ka(this.ka,e)&&(this.Ua(this.ka),t=!0),t}Ka(e,t){if(!e.fromCache||!this.Fa())return!0;const r=t!=="Offline";return(!this.options.$a||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}qa(e){if(e.docChanges.length>0)return!0;const t=this.ka&&this.ka.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}Ua(e){e=Pn.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.La=!0,this.Ba.next(e)}Fa(){return this.options.source!==So.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cd{constructor(e){this.key=e}}class ud{constructor(e){this.key=e}}class Jy{constructor(e,t){this.query=e,this.eu=t,this.tu=null,this.hasCachedResults=!1,this.current=!1,this.nu=z(),this.mutatedKeys=z(),this.ru=Sh(e),this.iu=new gn(this.ru)}get su(){return this.eu}ou(e,t){const r=t?t._u:new Lu,s=t?t.iu:this.iu;let i=t?t.mutatedKeys:this.mutatedKeys,a=s,u=!1;const l=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,d=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(e.inorderTraversal(((p,g)=>{const A=s.get(p),b=Xs(this.query,g)?g:null,k=!!A&&this.mutatedKeys.has(A.key),O=!!b&&(b.hasLocalMutations||this.mutatedKeys.has(b.key)&&b.hasCommittedMutations);let N=!1;A&&b?A.data.isEqual(b.data)?k!==O&&(r.track({type:3,doc:b}),N=!0):this.au(A,b)||(r.track({type:2,doc:b}),N=!0,(l&&this.ru(b,l)>0||d&&this.ru(b,d)<0)&&(u=!0)):!A&&b?(r.track({type:0,doc:b}),N=!0):A&&!b&&(r.track({type:1,doc:A}),N=!0,(l||d)&&(u=!0)),N&&(b?(a=a.add(b),i=O?i.add(p):i.delete(p)):(a=a.delete(p),i=i.delete(p)))})),this.query.limit!==null)for(;a.size>this.query.limit;){const p=this.query.limitType==="F"?a.last():a.first();a=a.delete(p.key),i=i.delete(p.key),r.track({type:1,doc:p})}return{iu:a,_u:r,Ss:u,mutatedKeys:i}}au(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,s){const i=this.iu;this.iu=e.iu,this.mutatedKeys=e.mutatedKeys;const a=e._u.ba();a.sort(((p,g)=>(function(b,k){const O=N=>{switch(N){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return F(20277,{At:N})}};return O(b)-O(k)})(p.type,g.type)||this.ru(p.doc,g.doc))),this.uu(r),s=s??!1;const u=t&&!s?this.cu():[],l=this.nu.size===0&&this.current&&!s?1:0,d=l!==this.tu;return this.tu=l,a.length!==0||d?{snapshot:new Pn(this.query,e.iu,i,a,e.mutatedKeys,l===0,d,!1,!!r&&r.resumeToken.approximateByteSize()>0),lu:u}:{lu:u}}xa(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({iu:this.iu,_u:new Lu,mutatedKeys:this.mutatedKeys,Ss:!1},!1)):{lu:[]}}hu(e){return!this.eu.has(e)&&!!this.iu.has(e)&&!this.iu.get(e).hasLocalMutations}uu(e){e&&(e.addedDocuments.forEach((t=>this.eu=this.eu.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.eu=this.eu.delete(t))),this.current=e.current)}cu(){if(!this.current)return[];const e=this.nu;this.nu=z(),this.iu.forEach((r=>{this.hu(r.key)&&(this.nu=this.nu.add(r.key))}));const t=[];return e.forEach((r=>{this.nu.has(r)||t.push(new ud(r))})),this.nu.forEach((r=>{e.has(r)||t.push(new cd(r))})),t}Pu(e){this.eu=e.Ls,this.nu=z();const t=this.ou(e.documents);return this.applyChanges(t,!0)}Tu(){return Pn.fromInitialDocuments(this.query,this.iu,this.mutatedKeys,this.tu===0,this.hasCachedResults)}}const sa="SyncEngine";class Xy{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}}class Zy{constructor(e){this.key=e,this.Iu=!1}}class eE{constructor(e,t,r,s,i,a){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=a,this.Eu={},this.Ru=new nn((u=>Ah(u)),Js),this.Au=new Map,this.Vu=new Set,this.du=new ne(L.comparator),this.mu=new Map,this.fu=new Wo,this.gu={},this.pu=new Map,this.yu=Vt._r(),this.onlineState="Unknown",this.wu=void 0}get isPrimaryClient(){return this.wu===!0}}async function tE(n,e,t=!0){const r=md(n);let s;const i=r.Ru.get(e);return i?(r.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.Tu()):s=await ld(r,e,t,!0),s}async function nE(n,e){const t=md(n);await ld(t,e,!0,!1)}async function ld(n,e,t,r){const s=await Iy(n.localStore,qe(e)),i=s.targetId,a=n.sharedClientState.addLocalQueryTarget(i,t);let u;return r&&(u=await rE(n,e,i,a==="current",s.resumeToken)),n.isPrimaryClient&&t&&Zh(n.remoteStore,s),u}async function rE(n,e,t,r,s){n.Su=(g,A,b)=>(async function(O,N,W,K){let X=N.view.ou(W);X.Ss&&(X=await Cu(O.localStore,N.query,!1).then((({documents:T})=>N.view.ou(T,X))));const ve=K&&K.targetChanges.get(N.targetId),de=K&&K.targetMismatches.get(N.targetId)!=null,ue=N.view.applyChanges(X,O.isPrimaryClient,ve,de);return Uu(O,N.targetId,ue.lu),ue.snapshot})(n,g,A,b);const i=await Cu(n.localStore,e,!0),a=new Jy(e,i.Ls),u=a.ou(i.documents),l=Nr.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",s),d=a.applyChanges(u,n.isPrimaryClient,l);Uu(n,t,d.lu);const p=new Xy(e,t,a);return n.Ru.set(e,p),n.Au.has(t)?n.Au.get(t).push(e):n.Au.set(t,[e]),d.snapshot}async function sE(n,e,t){const r=B(n),s=r.Ru.get(e),i=r.Au.get(s.targetId);if(i.length>1)return r.Au.set(s.targetId,i.filter((a=>!Js(a,e)))),void r.Ru.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await wo(r.localStore,s.targetId,!1).then((()=>{r.sharedClientState.clearQueryState(s.targetId),t&&Jo(r.remoteStore,s.targetId),Ro(r,s.targetId)})).catch(Vn)):(Ro(r,s.targetId),await wo(r.localStore,s.targetId,!0))}async function iE(n,e){const t=B(n),r=t.Ru.get(e),s=t.Au.get(r.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),Jo(t.remoteStore,r.targetId))}async function oE(n,e,t){const r=fE(n);try{const s=await(function(a,u){const l=B(a),d=te.now(),p=u.reduce(((b,k)=>b.add(k.key)),z());let g,A;return l.persistence.runTransaction("Locally write mutations","readwrite",(b=>{let k=nt(),O=z();return l.Ms.getEntries(b,p).next((N=>{k=N,k.forEach(((W,K)=>{K.isValidDocument()||(O=O.add(W))}))})).next((()=>l.localDocuments.getOverlayedDocuments(b,k))).next((N=>{g=N;const W=[];for(const K of u){const X=T_(K,g.get(K.key).overlayedDocument);X!=null&&W.push(new rn(K.key,X,gh(X.value.mapValue),Ze.exists(!0)))}return l.mutationQueue.addMutationBatch(b,d,W,u)})).next((N=>{A=N;const W=N.applyToLocalDocumentSet(g,O);return l.documentOverlayCache.saveOverlays(b,N.batchId,W)}))})).then((()=>({batchId:A.batchId,changes:Ph(g)})))})(r.localStore,e);r.sharedClientState.addPendingMutation(s.batchId),(function(a,u,l){let d=a.gu[a.currentUser.toKey()];d||(d=new ne($)),d=d.insert(u,l),a.gu[a.currentUser.toKey()]=d})(r,s.batchId,t),await Or(r,s.changes),await si(r.remoteStore)}catch(s){const i=na(s,"Failed to persist write");t.reject(i)}}async function hd(n,e){const t=B(n);try{const r=await yy(t.localStore,e);e.targetChanges.forEach(((s,i)=>{const a=t.mu.get(i);a&&(Q(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?a.Iu=!0:s.modifiedDocuments.size>0?Q(a.Iu,14607):s.removedDocuments.size>0&&(Q(a.Iu,42227),a.Iu=!1))})),await Or(t,r,e)}catch(r){await Vn(r)}}function xu(n,e,t){const r=B(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){const s=[];r.Ru.forEach(((i,a)=>{const u=a.view.xa(e);u.snapshot&&s.push(u.snapshot)})),(function(a,u){const l=B(a);l.onlineState=u;let d=!1;l.queries.forEach(((p,g)=>{for(const A of g.Ca)A.xa(u)&&(d=!0)})),d&&ra(l)})(r.eventManager,e),s.length&&r.Eu.J_(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function aE(n,e,t){const r=B(n);r.sharedClientState.updateQueryState(e,"rejected",t);const s=r.mu.get(e),i=s&&s.key;if(i){let a=new ne(L.comparator);a=a.insert(i,Ie.newNoDocument(i,U.min()));const u=z().add(i),l=new Dr(U.min(),new Map,new ne($),a,u);await hd(r,l),r.du=r.du.remove(i),r.mu.delete(e),ia(r)}else await wo(r.localStore,e,!1).then((()=>Ro(r,e,t))).catch(Vn)}async function cE(n,e){const t=B(n),r=e.batch.batchId;try{const s=await _y(t.localStore,e);fd(t,r,null),dd(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await Or(t,s)}catch(s){await Vn(s)}}async function uE(n,e,t){const r=B(n);try{const s=await(function(a,u){const l=B(a);return l.persistence.runTransaction("Reject batch","readwrite-primary",(d=>{let p;return l.mutationQueue.lookupMutationBatch(d,u).next((g=>(Q(g!==null,37113),p=g.keys(),l.mutationQueue.removeMutationBatch(d,g)))).next((()=>l.mutationQueue.performConsistencyCheck(d))).next((()=>l.documentOverlayCache.removeOverlaysForBatchId(d,p,u))).next((()=>l.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,p))).next((()=>l.localDocuments.getDocuments(d,p)))}))})(r.localStore,e);fd(r,e,t),dd(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await Or(r,s)}catch(s){await Vn(s)}}function dd(n,e){(n.pu.get(e)||[]).forEach((t=>{t.resolve()})),n.pu.delete(e)}function fd(n,e,t){const r=B(n);let s=r.gu[r.currentUser.toKey()];if(s){const i=s.get(e);i&&(t?i.reject(t):i.resolve(),s=s.remove(e)),r.gu[r.currentUser.toKey()]=s}}function Ro(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const r of n.Au.get(e))n.Ru.delete(r),t&&n.Eu.bu(r,t);n.Au.delete(e),n.isPrimaryClient&&n.fu.Qr(e).forEach((r=>{n.fu.containsKey(r)||pd(n,r)}))}function pd(n,e){n.Vu.delete(e.path.canonicalString());const t=n.du.get(e);t!==null&&(Jo(n.remoteStore,t),n.du=n.du.remove(e),n.mu.delete(t),ia(n))}function Uu(n,e,t){for(const r of t)r instanceof cd?(n.fu.addReference(r.key,e),lE(n,r)):r instanceof ud?(V(sa,"Document no longer in limbo: "+r.key),n.fu.removeReference(r.key,e),n.fu.containsKey(r.key)||pd(n,r.key)):F(19791,{Du:r})}function lE(n,e){const t=e.key,r=t.path.canonicalString();n.du.get(t)||n.Vu.has(r)||(V(sa,"New document in limbo: "+t),n.Vu.add(r),ia(n))}function ia(n){for(;n.Vu.size>0&&n.du.size<n.maxConcurrentLimboResolutions;){const e=n.Vu.values().next().value;n.Vu.delete(e);const t=new L(J.fromString(e)),r=n.yu.next();n.mu.set(r,new Zy(t)),n.du=n.du.insert(t,r),Zh(n.remoteStore,new Qe(qe(jo(t.path)),r,"TargetPurposeLimboResolution",Ks.ce))}}async function Or(n,e,t){const r=B(n),s=[],i=[],a=[];r.Ru.isEmpty()||(r.Ru.forEach(((u,l)=>{a.push(r.Su(l,e,t).then((d=>{var p;if((d||t)&&r.isPrimaryClient){const g=d?!d.fromCache:(p=t==null?void 0:t.targetChanges.get(l.targetId))==null?void 0:p.current;r.sharedClientState.updateQueryState(l.targetId,g?"current":"not-current")}if(d){s.push(d);const g=Qo.Is(l.targetId,d);i.push(g)}})))})),await Promise.all(a),r.Eu.J_(s),await(async function(l,d){const p=B(l);try{await p.persistence.runTransaction("notifyLocalViewChanges","readwrite",(g=>P.forEach(d,(A=>P.forEach(A.Ps,(b=>p.persistence.referenceDelegate.addReference(g,A.targetId,b))).next((()=>P.forEach(A.Ts,(b=>p.persistence.referenceDelegate.removeReference(g,A.targetId,b)))))))))}catch(g){if(!Dn(g))throw g;V(Yo,"Failed to update sequence numbers: "+g)}for(const g of d){const A=g.targetId;if(!g.fromCache){const b=p.Cs.get(A),k=b.snapshotVersion,O=b.withLastLimboFreeSnapshotVersion(k);p.Cs=p.Cs.insert(A,O)}}})(r.localStore,i))}async function hE(n,e){const t=B(n);if(!t.currentUser.isEqual(e)){V(sa,"User change. New user:",e.toKey());const r=await Qh(t.localStore,e);t.currentUser=e,(function(i,a){i.pu.forEach((u=>{u.forEach((l=>{l.reject(new D(R.CANCELLED,a))}))})),i.pu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await Or(t,r.Os)}}function dE(n,e){const t=B(n),r=t.mu.get(e);if(r&&r.Iu)return z().add(r.key);{let s=z();const i=t.Au.get(e);if(!i)return s;for(const a of i){const u=t.Ru.get(a);s=s.unionWith(u.view.su)}return s}}function md(n){const e=B(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=hd.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=dE.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=aE.bind(null,e),e.Eu.J_=Qy.bind(null,e.eventManager),e.Eu.bu=Yy.bind(null,e.eventManager),e}function fE(n){const e=B(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=cE.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=uE.bind(null,e),e}class Fs{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=ni(e.databaseInfo.databaseId),this.sharedClientState=this.Fu(e),this.persistence=this.Mu(e),await this.persistence.start(),this.localStore=this.xu(e),this.gcScheduler=this.Ou(e,this.localStore),this.indexBackfillerScheduler=this.Nu(e,this.localStore)}Ou(e,t){return null}Nu(e,t){return null}xu(e){return gy(this.persistence,new fy,e.initialUser,this.serializer)}Mu(e){return new Kh(Ko.Ai,this.serializer)}Fu(e){return new vy}async terminate(){var e,t;(e=this.gcScheduler)==null||e.stop(),(t=this.indexBackfillerScheduler)==null||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Fs.provider={build:()=>new Fs};class pE extends Fs{constructor(e){super(),this.cacheSizeBytes=e}Ou(e,t){Q(this.persistence.referenceDelegate instanceof Ls,46915);const r=this.persistence.referenceDelegate.garbageCollector;return new X_(r,e.asyncQueue,t)}Mu(e){const t=this.cacheSizeBytes!==void 0?Pe.withCacheSize(this.cacheSizeBytes):Pe.DEFAULT;return new Kh((r=>Ls.Ai(r,t)),this.serializer)}}class Po{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>xu(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=hE.bind(null,this.syncEngine),await Hy(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new Ky})()}createDatastore(e){const t=ni(e.databaseInfo.databaseId),r=by(e.databaseInfo);return ky(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return(function(r,s,i,a,u){return new Ly(r,s,i,a,u)})(this.localStore,this.datastore,e.asyncQueue,(t=>xu(this.syncEngine,t,0)),(function(){return Nu.v()?new Nu:new Ay})())}createSyncEngine(e,t){return(function(s,i,a,u,l,d,p){const g=new eE(s,i,a,u,l,d);return p&&(g.wu=!0),g})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(s){const i=B(s);V(Ke,"RemoteStore shutting down."),i.Va.add(5),await kr(i),i.ma.shutdown(),i.fa.set("Unknown")})(this.remoteStore),(e=this.datastore)==null||e.terminate(),(t=this.eventManager)==null||t.terminate()}}Po.provider={build:()=>new Po};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gd{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Lu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Lu(this.observer.error,e):tt("Uncaught Error in snapshot listener:",e.toString()))}ku(){this.muted=!0}Lu(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nt="FirestoreClient";class mE{constructor(e,t,r,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this._databaseInfo=s,this.user=Te.UNAUTHENTICATED,this.clientId=Lo.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(r,(async a=>{V(Nt,"Received user=",a.uid),await this.authCredentialListener(a),this.user=a})),this.appCheckCredentials.start(r,(a=>(V(Nt,"Received new app check token=",a),this.appCheckCredentialListener(a,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Xe;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const r=na(t,"Failed to shutdown persistence");e.reject(r)}})),e.promise}}async function Zi(n,e){n.asyncQueue.verifyOperationInProgress(),V(Nt,"Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener((async s=>{r.isEqual(s)||(await Qh(e.localStore,s),r=s)})),e.persistence.setDatabaseDeletedListener((()=>n.terminate())),n._offlineComponents=e}async function Bu(n,e){n.asyncQueue.verifyOperationInProgress();const t=await gE(n);V(Nt,"Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener((r=>Ou(e.remoteStore,r))),n.setAppCheckTokenChangeListener(((r,s)=>Ou(e.remoteStore,s))),n._onlineComponents=e}async function gE(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){V(Nt,"Using user provided OfflineComponentProvider");try{await Zi(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(s){return s.name==="FirebaseError"?s.code===R.FAILED_PRECONDITION||s.code===R.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(t))throw t;Jt("Error using user provided cache. Falling back to memory cache: "+t),await Zi(n,new Fs)}}else V(Nt,"Using default OfflineComponentProvider"),await Zi(n,new pE(void 0));return n._offlineComponents}async function _d(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(V(Nt,"Using user provided OnlineComponentProvider"),await Bu(n,n._uninitializedComponentsProvider._online)):(V(Nt,"Using default OnlineComponentProvider"),await Bu(n,new Po))),n._onlineComponents}function _E(n){return _d(n).then((e=>e.syncEngine))}async function yd(n){const e=await _d(n),t=e.eventManager;return t.onListen=tE.bind(null,e.syncEngine),t.onUnlisten=sE.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=nE.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=iE.bind(null,e.syncEngine),t}function yE(n,e,t={}){const r=new Xe;return n.asyncQueue.enqueueAndForget((async()=>(function(i,a,u,l,d){const p=new gd({next:A=>{p.ku(),a.enqueueAndForget((()=>od(i,g)));const b=A.docs.has(u);!b&&A.fromCache?d.reject(new D(R.UNAVAILABLE,"Failed to get document because the client is offline.")):b&&A.fromCache&&l&&l.source==="server"?d.reject(new D(R.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):d.resolve(A)},error:A=>d.reject(A)}),g=new ad(jo(u.path),p,{includeMetadataChanges:!0,$a:!0});return id(i,g)})(await yd(n),n.asyncQueue,e,t,r))),r.promise}function EE(n,e,t={}){const r=new Xe;return n.asyncQueue.enqueueAndForget((async()=>(function(i,a,u,l,d){const p=new gd({next:A=>{p.ku(),a.enqueueAndForget((()=>od(i,g))),A.fromCache&&l.source==="server"?d.reject(new D(R.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(A)},error:A=>d.reject(A)}),g=new ad(u,p,{includeMetadataChanges:!0,$a:!0});return id(i,g)})(await yd(n),n.asyncQueue,e,t,r))),r.promise}function TE(n,e){const t=new Xe;return n.asyncQueue.enqueueAndForget((async()=>oE(await _E(n),e,t))),t.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ed(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const IE="ComponentProvider",ju=new Map;function wE(n,e,t,r,s){return new jg(n,e,t,s.host,s.ssl,s.experimentalForceLongPolling,s.experimentalAutoDetectLongPolling,Ed(s.experimentalLongPollingOptions),s.useFetchStreams,s.isUsingEmulator,r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Td="firestore.googleapis.com",qu=!0;class $u{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new D(R.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Td,this.ssl=qu}else this.host=e.host,this.ssl=e.ssl??qu;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=Wh;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Y_)throw new D(R.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}Cg("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Ed(e.experimentalLongPollingOptions??{}),(function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new D(R.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new D(R.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new D(R.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(r,s){return r.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class ii{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new $u({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new D(R.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new D(R.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new $u(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(r){if(!r)return new Eg;switch(r.type){case"firstParty":return new vg(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new D(R.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const r=ju.get(t);r&&(V(IE,"Removing Datastore"),ju.delete(t),r.terminate())})(this),Promise.resolve()}}function vE(n,e,t,r={}){var d;n=Xt(n,ii);const s=br(e),i=n._getSettings(),a={...i,emulatorOptions:n._getEmulatorOptions()},u=`${e}:${t}`;s&&$l(`https://${u}`),i.host!==Td&&i.host!==u&&Jt("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const l={...i,host:u,ssl:s,emulatorOptions:r};if(!Kt(l,a)&&(n._setSettings(l),r.mockUserToken)){let p,g;if(typeof r.mockUserToken=="string")p=r.mockUserToken,g=Te.MOCK_USER;else{p=Gp(r.mockUserToken,(d=n._app)==null?void 0:d.options.projectId);const A=r.mockUserToken.sub||r.mockUserToken.user_id;if(!A)throw new D(R.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");g=new Te(A)}n._authCredentials=new Tg(new rh(p,g))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ot{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new Ot(this.firestore,e,this._query)}}class ce{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new At(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ce(this.firestore,e,this._key)}toJSON(){return{type:ce._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,r){if(Cr(t,ce._jsonSchema))return new ce(e,r||null,new L(J.fromString(t.referencePath)))}}ce._jsonSchemaVersion="firestore/documentReference/1.0",ce._jsonSchema={type:ae("string",ce._jsonSchemaVersion),referencePath:ae("string")};class At extends Ot{constructor(e,t,r){super(e,t,jo(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ce(this.firestore,null,new L(e))}withConverter(e){return new At(this.firestore,e,this._path)}}function AE(n,e,...t){if(n=Ce(n),sh("collection","path",e),n instanceof ii){const r=J.fromString(e,...t);return nu(r),new At(n,null,r)}{if(!(n instanceof ce||n instanceof At))throw new D(R.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(J.fromString(e,...t));return nu(r),new At(n.firestore,null,r)}}function Id(n,e,...t){if(n=Ce(n),arguments.length===1&&(e=Lo.newId()),sh("doc","path",e),n instanceof ii){const r=J.fromString(e,...t);return tu(r),new ce(n,null,new L(r))}{if(!(n instanceof ce||n instanceof At))throw new D(R.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(J.fromString(e,...t));return tu(r),new ce(n.firestore,n instanceof At?n.converter:null,new L(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zu="AsyncQueue";class Gu{constructor(e=Promise.resolve()){this.nc=[],this.rc=!1,this.sc=[],this.oc=null,this._c=!1,this.ac=!1,this.uc=[],this.F_=new Jh(this,"async_queue_retry"),this.cc=()=>{const r=Xi();r&&V(zu,"Visibility state changed to "+r.visibilityState),this.F_.y_()},this.lc=e;const t=Xi();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.cc)}get isShuttingDown(){return this.rc}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.hc(),this.Pc(e)}enterRestrictedMode(e){if(!this.rc){this.rc=!0,this.ac=e||!1;const t=Xi();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.cc)}}enqueue(e){if(this.hc(),this.rc)return new Promise((()=>{}));const t=new Xe;return this.Pc((()=>this.rc&&this.ac?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.nc.push(e),this.Tc())))}async Tc(){if(this.nc.length!==0){try{await this.nc[0](),this.nc.shift(),this.F_.reset()}catch(e){if(!Dn(e))throw e;V(zu,"Operation failed with retryable error: "+e)}this.nc.length>0&&this.F_.g_((()=>this.Tc()))}}Pc(e){const t=this.lc.then((()=>(this._c=!0,e().catch((r=>{throw this.oc=r,this._c=!1,tt("INTERNAL UNHANDLED ERROR: ",Hu(r)),r})).then((r=>(this._c=!1,r))))));return this.lc=t,t}enqueueAfterDelay(e,t,r){this.hc(),this.uc.indexOf(e)>-1&&(t=0);const s=ta.createAndSchedule(this,e,t,r,(i=>this.Ic(i)));return this.sc.push(s),s}hc(){this.oc&&F(47125,{Ec:Hu(this.oc)})}verifyOperationInProgress(){}async Rc(){let e;do e=this.lc,await e;while(e!==this.lc)}Ac(e){for(const t of this.sc)if(t.timerId===e)return!0;return!1}Vc(e){return this.Rc().then((()=>{this.sc.sort(((t,r)=>t.targetTimeMs-r.targetTimeMs));for(const t of this.sc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Rc()}))}dc(e){this.uc.push(e)}Ic(e){const t=this.sc.indexOf(e);this.sc.splice(t,1)}}function Hu(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}class oi extends ii{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new Gu,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Gu(e),this._firestoreClient=void 0,await e}}}function SE(n,e){const t=typeof n=="object"?n:Wl(),r=typeof n=="string"?n:Ps,s=ko(t,"firestore").getImmediate({identifier:r});if(!s._initialized){const i=$p("firestore");i&&vE(s,...i)}return s}function oa(n){if(n._terminated)throw new D(R.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||RE(n),n._firestoreClient}function RE(n){var r,s,i,a;const e=n._freezeSettings(),t=wE(n._databaseId,((r=n._app)==null?void 0:r.options.appId)||"",n._persistenceKey,(s=n._app)==null?void 0:s.options.apiKey,e);n._componentsProvider||(i=e.localCache)!=null&&i._offlineComponentProvider&&((a=e.localCache)!=null&&a._onlineComponentProvider)&&(n._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),n._firestoreClient=new mE(n._authCredentials,n._appCheckCredentials,n._queue,t,n._componentsProvider&&(function(l){const d=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(d),_online:d}})(n._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class De{constructor(e){this._byteString=e}static fromBase64String(e){try{return new De(_e.fromBase64String(e))}catch(t){throw new D(R.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new De(_e.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:De._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Cr(e,De._jsonSchema))return De.fromBase64String(e.bytes)}}De._jsonSchemaVersion="firestore/bytes/1.0",De._jsonSchema={type:ae("string",De._jsonSchemaVersion),bytes:ae("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wd{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new D(R.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ge(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aa{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ze{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new D(R.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new D(R.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return $(this._lat,e._lat)||$(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:ze._jsonSchemaVersion}}static fromJSON(e){if(Cr(e,ze._jsonSchema))return new ze(e.latitude,e.longitude)}}ze._jsonSchemaVersion="firestore/geoPoint/1.0",ze._jsonSchema={type:ae("string",ze._jsonSchemaVersion),latitude:ae("number"),longitude:ae("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Le{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(r,s){if(r.length!==s.length)return!1;for(let i=0;i<r.length;++i)if(r[i]!==s[i])return!1;return!0})(this._values,e._values)}toJSON(){return{type:Le._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Cr(e,Le._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new Le(e.vectorValues);throw new D(R.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Le._jsonSchemaVersion="firestore/vectorValue/1.0",Le._jsonSchema={type:ae("string",Le._jsonSchemaVersion),vectorValues:ae("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const PE=/^__.*__$/;class bE{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new rn(e,this.data,this.fieldMask,t,this.fieldTransforms):new Vr(e,this.data,t,this.fieldTransforms)}}function vd(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw F(40011,{dataSource:n})}}class ca{constructor(e,t,r,s,i,a){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=s,i===void 0&&this.mc(),this.fieldTransforms=i||[],this.fieldMask=a||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}i(e){return new ca({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}gc(e){var s;const t=(s=this.path)==null?void 0:s.child(e),r=this.i({path:t,arrayElement:!1});return r.yc(e),r}wc(e){var s;const t=(s=this.path)==null?void 0:s.child(e),r=this.i({path:t,arrayElement:!1});return r.mc(),r}Sc(e){return this.i({path:void 0,arrayElement:!0})}bc(e){return xs(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}mc(){if(this.path)for(let e=0;e<this.path.length;e++)this.yc(this.path.get(e))}yc(e){if(e.length===0)throw this.bc("Document fields must not be empty");if(vd(this.dataSource)&&PE.test(e))throw this.bc('Document fields cannot begin and end with "__"')}}class CE{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||ni(e)}V(e,t,r,s=!1){return new ca({dataSource:e,methodName:t,targetDoc:r,path:ge.emptyPath(),arrayElement:!1,hasConverter:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Ad(n){const e=n._freezeSettings(),t=ni(n._databaseId);return new CE(n._databaseId,!!e.ignoreUndefinedProperties,t)}function VE(n,e,t,r,s,i={}){const a=n.V(i.merge||i.mergeFields?2:0,e,t,s);Pd("Data must be an object, but it was:",a,r);const u=Sd(r,a);let l,d;if(i.merge)l=new ke(a.fieldMask),d=a.fieldTransforms;else if(i.mergeFields){const p=[];for(const g of i.mergeFields){const A=ai(e,g,t);if(!a.contains(A))throw new D(R.INVALID_ARGUMENT,`Field '${A}' is specified in your field mask but missing from your input data.`);OE(p,A)||p.push(A)}l=new ke(p),d=a.fieldTransforms.filter((g=>l.covers(g.field)))}else l=null,d=a.fieldTransforms;return new bE(new Ve(u),l,d)}class ua extends aa{_toFieldTransform(e){return new g_(e.path,new Er)}isEqual(e){return e instanceof ua}}function DE(n,e,t,r=!1){return la(t,n.V(r?4:3,e))}function la(n,e){if(Rd(n=Ce(n)))return Pd("Unsupported field value:",e,n),Sd(n,e);if(n instanceof aa)return(function(r,s){if(!vd(s.dataSource))throw s.bc(`${r._methodName}() can only be used with update() and set()`);if(!s.path)throw s.bc(`${r._methodName}() is not currently supported inside arrays`);const i=r._toFieldTransform(s);i&&s.fieldTransforms.push(i)})(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.bc("Nested arrays are not supported");return(function(r,s){const i=[];let a=0;for(const u of r){let l=la(u,s.Sc(a));l==null&&(l={nullValue:"NULL_VALUE"}),i.push(l),a++}return{arrayValue:{values:i}}})(n,e)}return(function(r,s){if((r=Ce(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return f_(s.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const i=te.fromDate(r);return{timestampValue:Os(s.serializer,i)}}if(r instanceof te){const i=new te(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:Os(s.serializer,i)}}if(r instanceof ze)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof De)return{bytesValue:Uh(s.serializer,r._byteString)};if(r instanceof ce){const i=s.databaseId,a=r.firestore._databaseId;if(!a.isEqual(i))throw s.bc(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:Ho(r.firestore._databaseId||s.databaseId,r._key.path)}}if(r instanceof Le)return(function(a,u){const l=a instanceof Le?a.toArray():a;return{mapValue:{fields:{[fh]:{stringValue:ph},[bs]:{arrayValue:{values:l.map((p=>{if(typeof p!="number")throw u.bc("VectorValues must only contain numeric values.");return Zs(u.serializer,p)}))}}}}}})(r,s);if(Hh(r))return r._toProto(s.serializer);throw s.bc(`Unsupported field value: ${Ws(r)}`)})(n,e)}function Sd(n,e){const t={};return ah(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):tn(n,((r,s)=>{const i=la(s,e.gc(r));i!=null&&(t[r]=i)})),{mapValue:{fields:t}}}function Rd(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof te||n instanceof ze||n instanceof De||n instanceof ce||n instanceof aa||n instanceof Le||Hh(n))}function Pd(n,e,t){if(!Rd(t)||!ih(t)){const r=Ws(t);throw r==="an object"?e.bc(n+" a custom object"):e.bc(n+" "+r)}}function ai(n,e,t){if((e=Ce(e))instanceof wd)return e._internalPath;if(typeof e=="string")return kE(n,e);throw xs("Field path arguments must be of type string or ",n,!1,void 0,t)}const NE=new RegExp("[~\\*/\\[\\]]");function kE(n,e,t){if(e.search(NE)>=0)throw xs(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new wd(...e.split("."))._internalPath}catch{throw xs(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function xs(n,e,t,r,s){const i=r&&!r.isEmpty(),a=s!==void 0;let u=`Function ${e}() called with invalid data`;t&&(u+=" (via `toFirestore()`)"),u+=". ";let l="";return(i||a)&&(l+=" (found",i&&(l+=` in field ${r}`),a&&(l+=` in document ${s}`),l+=")"),new D(R.INVALID_ARGUMENT,u+n+l)}function OE(n,e){return n.some((t=>t.isEqual(e)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class LE{convertValue(e,t="none"){switch(Ct(e)){case 0:return null;case 1:return e.booleanValue;case 2:return se(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(bt(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw F(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const r={};return tn(e,((s,i)=>{r[s]=this.convertValue(i,t)})),r}convertVectorValue(e){var r,s,i;const t=(i=(s=(r=e.fields)==null?void 0:r[bs].arrayValue)==null?void 0:s.values)==null?void 0:i.map((a=>se(a.doubleValue)));return new Le(t)}convertGeoPoint(e){return new ze(se(e.latitude),se(e.longitude))}convertArray(e,t){return(e.values||[]).map((r=>this.convertValue(r,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const r=Ys(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(pr(e));default:return null}}convertTimestamp(e){const t=Pt(e);return new te(t.seconds,t.nanos)}convertDocumentKey(e,t){const r=J.fromString(e);Q(Gh(r),9688,{name:e});const s=new mr(r.get(1),r.get(3)),i=new L(r.popFirst(5));return s.isEqual(t)||tt(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bd extends LE{constructor(e){super(),this.firestore=e}convertBytes(e){return new De(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new ce(this.firestore,null,t)}}function ha(){return new ua("serverTimestamp")}const Wu="@firebase/firestore",Ku="4.15.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cd{constructor(e,t,r,s,i){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new ce(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new ME(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return((e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const t=this._document.data.field(ai("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class ME extends Cd{data(){return super.data()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function FE(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new D(R.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class da{}class fa extends da{}function xE(n,e,...t){let r=[];e instanceof da&&r.push(e),r=r.concat(t),(function(i){const a=i.filter((l=>l instanceof ma)).length,u=i.filter((l=>l instanceof pa)).length;if(a>1||a>0&&u>0)throw new D(R.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(r);for(const s of r)n=s._apply(n);return n}class pa extends fa{constructor(e,t,r){super(),this._field=e,this._op=t,this._value=r,this.type="where"}static _create(e,t,r){return new pa(e,t,r)}_apply(e){const t=this._parse(e);return Vd(e._query,t),new Ot(e.firestore,e.converter,_o(e._query,t))}_parse(e){const t=Ad(e.firestore);return(function(i,a,u,l,d,p,g){let A;if(d.isKeyField()){if(p==="array-contains"||p==="array-contains-any")throw new D(R.INVALID_ARGUMENT,`Invalid Query. You can't perform '${p}' queries on documentId().`);if(p==="in"||p==="not-in"){Yu(g,p);const k=[];for(const O of g)k.push(Qu(l,i,O));A={arrayValue:{values:k}}}else A=Qu(l,i,g)}else p!=="in"&&p!=="not-in"&&p!=="array-contains-any"||Yu(g,p),A=DE(u,a,g,p==="in"||p==="not-in");return oe.create(d,p,A)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}class ma extends da{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new ma(e,t)}_parse(e){const t=this._queryConstraints.map((r=>r._parse(e))).filter((r=>r.getFilters().length>0));return t.length===1?t[0]:Me.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(s,i){let a=s;const u=i.getFlattenedFilters();for(const l of u)Vd(a,l),a=_o(a,l)})(e._query,t),new Ot(e.firestore,e.converter,_o(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class ga extends fa{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new ga(e,t)}_apply(e){const t=(function(s,i,a){if(s.startAt!==null)throw new D(R.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new D(R.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new yr(i,a)})(e._query,this._field,this._direction);return new Ot(e.firestore,e.converter,i_(e._query,t))}}function UE(n,e="asc"){const t=e,r=ai("orderBy",n);return ga._create(r,t)}class _a extends fa{constructor(e,t,r){super(),this.type=e,this._limit=t,this._limitType=r}static _create(e,t,r){return new _a(e,t,r)}_apply(e){return new Ot(e.firestore,e.converter,Vs(e._query,this._limit,this._limitType))}}function BE(n){return Vg("limit",n),_a._create("limit",n,"F")}function Qu(n,e,t){if(typeof(t=Ce(t))=="string"){if(t==="")throw new D(R.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!vh(e)&&t.indexOf("/")!==-1)throw new D(R.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const r=e.path.child(J.fromString(t));if(!L.isDocumentKey(r))throw new D(R.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return lu(n,new L(r))}if(t instanceof ce)return lu(n,t._key);throw new D(R.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Ws(t)}.`)}function Yu(n,e){if(!Array.isArray(n)||n.length===0)throw new D(R.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function Vd(n,e){const t=(function(s,i){for(const a of s)for(const u of a.getFlattenedFilters())if(i.indexOf(u.op)>=0)return u.op;return null})(n.filters,(function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new D(R.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new D(R.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}function jE(n,e,t){let r;return r=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,r}class sr{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Wt extends Cd{constructor(e,t,r,s,i,a){super(e,t,r,s,a),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Es(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(ai("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new D(R.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=Wt._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}Wt._jsonSchemaVersion="firestore/documentSnapshot/1.0",Wt._jsonSchema={type:ae("string",Wt._jsonSchemaVersion),bundleSource:ae("string","DocumentSnapshot"),bundleName:ae("string"),bundle:ae("string")};class Es extends Wt{data(e={}){return super.data(e)}}class _n{constructor(e,t,r,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new sr(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((r=>{e.call(t,new Es(this._firestore,this._userDataWriter,r.key,r,new sr(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new D(R.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(s,i){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map((u=>{const l=new Es(s._firestore,s._userDataWriter,u.doc.key,u.doc,new sr(s._snapshot.mutatedKeys.has(u.doc.key),s._snapshot.fromCache),s.query.converter);return u.doc,{type:"added",doc:l,oldIndex:-1,newIndex:a++}}))}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((u=>i||u.type!==3)).map((u=>{const l=new Es(s._firestore,s._userDataWriter,u.doc.key,u.doc,new sr(s._snapshot.mutatedKeys.has(u.doc.key),s._snapshot.fromCache),s.query.converter);let d=-1,p=-1;return u.type!==0&&(d=a.indexOf(u.doc.key),a=a.delete(u.doc.key)),u.type!==1&&(a=a.add(u.doc),p=a.indexOf(u.doc.key)),{type:qE(u.type),doc:l,oldIndex:d,newIndex:p}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new D(R.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=_n._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Lo.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],r=[],s=[];return this.docs.forEach((i=>{i._document!==null&&(t.push(i._document),r.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function qE(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return F(61501,{type:n})}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */_n._jsonSchemaVersion="firestore/querySnapshot/1.0",_n._jsonSchema={type:ae("string",_n._jsonSchemaVersion),bundleSource:ae("string","QuerySnapshot"),bundleName:ae("string"),bundle:ae("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ya(n){n=Xt(n,ce);const e=Xt(n.firestore,oi),t=oa(e);return yE(t,n._key).then((r=>GE(e,n,r)))}function $E(n){n=Xt(n,Ot);const e=Xt(n.firestore,oi),t=oa(e),r=new bd(e);return FE(n._query),EE(t,n._query).then((s=>new _n(e,r,n,s)))}function Ea(n,e,t){n=Xt(n,ce);const r=Xt(n.firestore,oi),s=jE(n.converter,e,t),i=Ad(r);return zE(r,[VE(i,"setDoc",n._key,s,n.converter!==null,t).toMutation(n._key,Ze.none())])}function zE(n,e){const t=oa(n);return TE(t,e)}function GE(n,e,t){const r=t.docs.get(e._key),s=new bd(n);return new Wt(n,s,e._key,r,new sr(t.hasPendingWrites,t.fromCache),e.converter)}(function(e,t=!0){yg(bn),vn(new Qt("firestore",((r,{instanceIdentifier:s,options:i})=>{const a=r.getProvider("app").getImmediate(),u=new oi(new Ig(r.getProvider("auth-internal")),new Ag(a,r.getProvider("app-check-internal")),qg(a,s),a);return i={useFetchStreams:t,...i},u._setSettings(i),u}),"PUBLIC").setMultipleInstances(!0)),wt(Wu,Ku,e),wt(Wu,Ku,"esm2020")})();const HE={BASE_URL:"/flappy-petya/",DEV:!1,MODE:"production",PROD:!0,SSR:!1,VITE_FIREBASE_API_KEY:"AIzaSyAinHxEW40BUbIph2uF8HCblIj7ajl3D20",VITE_FIREBASE_APP_ID:"1:669258802189:web:9f0fb296ed6e26a9c5e144",VITE_FIREBASE_AUTH_DOMAIN:"flappy-petya.firebaseapp.com",VITE_FIREBASE_MESSAGING_SENDER_ID:"669258802189",VITE_FIREBASE_PROJECT_ID:"flappy-petya",VITE_FIREBASE_STORAGE_BUCKET:"flappy-petya.firebasestorage.app"};function Be(n){var e;return((e=HE[n])==null?void 0:e.trim())??""}function Dd(){return!!(Be("VITE_FIREBASE_API_KEY")&&Be("VITE_FIREBASE_AUTH_DOMAIN")&&Be("VITE_FIREBASE_PROJECT_ID")&&Be("VITE_FIREBASE_APP_ID"))}function WE(){return{apiKey:Be("VITE_FIREBASE_API_KEY"),authDomain:Be("VITE_FIREBASE_AUTH_DOMAIN"),projectId:Be("VITE_FIREBASE_PROJECT_ID"),storageBucket:Be("VITE_FIREBASE_STORAGE_BUCKET"),messagingSenderId:Be("VITE_FIREBASE_MESSAGING_SENDER_ID"),appId:Be("VITE_FIREBASE_APP_ID")}}let eo=null,Nd=null;function Lt(){return Dd()}function Mt(){return Nd}function kd(){!Dd()||eo||(eo=Hl(WE()),Nd=SE(eo))}function Od(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const KE=Od,Ld=new Rr("auth","Firebase",Od());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Us=new Do("@firebase/auth");function QE(n,...e){Us.logLevel<=G.WARN&&Us.warn(`Auth (${bn}): ${n}`,...e)}function Ts(n,...e){Us.logLevel<=G.ERROR&&Us.error(`Auth (${bn}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rt(n,...e){throw Ta(n,...e)}function Ge(n,...e){return Ta(n,...e)}function Md(n,e,t){const r={...KE(),[e]:t};return new Rr("auth","Firebase",r).create(e,{appName:n.name})}function St(n){return Md(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Ta(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return Ld.create(n,...e)}function x(n,e,...t){if(!n)throw Ta(e,...t)}function Ye(n){const e="INTERNAL ASSERTION FAILED: "+n;throw Ts(e),new Error(e)}function st(n,e){n||Ye(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bo(){var n;return typeof self<"u"&&((n=self.location)==null?void 0:n.href)||""}function YE(){return Ju()==="http:"||Ju()==="https:"}function Ju(){var n;return typeof self<"u"&&((n=self.location)==null?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function JE(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(YE()||Qp()||"connection"in navigator)?navigator.onLine:!0}function XE(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lr{constructor(e,t){this.shortDelay=e,this.longDelay=t,st(t>e,"Short delay should be less than long delay!"),this.isMobile=Hp()||Yp()}get(){return JE()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ia(n,e){st(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fd{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Ye("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Ye("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Ye("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ZE={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eT=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],tT=new Lr(3e4,6e4);function ci(n,e){return n.tenantId&&!e.tenantId?{...e,tenantId:n.tenantId}:e}async function On(n,e,t,r,s={}){return xd(n,s,async()=>{let i={},a={};r&&(e==="GET"?a=r:i={body:JSON.stringify(r)});const u=Pr({key:n.config.apiKey,...a}).slice(1),l=await n._getAdditionalHeaders();l["Content-Type"]="application/json",n.languageCode&&(l["X-Firebase-Locale"]=n.languageCode);const d={method:e,headers:l,...i};return Kp()||(d.referrerPolicy="no-referrer"),n.emulatorConfig&&br(n.emulatorConfig.host)&&(d.credentials="include"),Fd.fetch()(await Bd(n,n.config.apiHost,t,u),d)})}async function xd(n,e,t){n._canInitEmulator=!1;const r={...ZE,...e};try{const s=new nT(n),i=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const a=await i.json();if("needConfirmation"in a)throw as(n,"account-exists-with-different-credential",a);if(i.ok&&!("errorMessage"in a))return a;{const u=i.ok?a.errorMessage:a.error.message,[l,d]=u.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw as(n,"credential-already-in-use",a);if(l==="EMAIL_EXISTS")throw as(n,"email-already-in-use",a);if(l==="USER_DISABLED")throw as(n,"user-disabled",a);const p=r[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw Md(n,p,d);rt(n,p)}}catch(s){if(s instanceof ot)throw s;rt(n,"network-request-failed",{message:String(s)})}}async function Ud(n,e,t,r,s={}){const i=await On(n,e,t,r,s);return"mfaPendingCredential"in i&&rt(n,"multi-factor-auth-required",{_serverResponse:i}),i}async function Bd(n,e,t,r){const s=`${e}${t}?${r}`,i=n,a=i.config.emulator?Ia(n.config,s):`${n.config.apiScheme}://${s}`;return eT.includes(t)&&(await i._persistenceManagerAvailable,i._getPersistenceType()==="COOKIE")?i._getPersistence()._getFinalTarget(a).toString():a}class nT{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(Ge(this.auth,"network-request-failed")),tT.get())})}}function as(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const s=Ge(n,e,r);return s.customData._tokenResponse=t,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function rT(n,e){return On(n,"POST","/v1/accounts:delete",e)}async function Bs(n,e){return On(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hr(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function sT(n,e=!1){const t=Ce(n),r=await t.getIdToken(e),s=wa(r);x(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,a=i==null?void 0:i.sign_in_provider;return{claims:s,token:r,authTime:hr(to(s.auth_time)),issuedAtTime:hr(to(s.iat)),expirationTime:hr(to(s.exp)),signInProvider:a||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function to(n){return Number(n)*1e3}function wa(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return Ts("JWT malformed, contained fewer than 3 sections"),null;try{const s=Ul(t);return s?JSON.parse(s):(Ts("Failed to decode base64 JWT payload"),null)}catch(s){return Ts("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function Xu(n){const e=wa(n);return x(e,"internal-error"),x(typeof e.exp<"u","internal-error"),x(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vr(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof ot&&iT(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function iT({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oT{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Co{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=hr(this.lastLoginAt),this.creationTime=hr(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function js(n){var g;const e=n.auth,t=await n.getIdToken(),r=await vr(n,Bs(e,{idToken:t}));x(r==null?void 0:r.users.length,e,"internal-error");const s=r.users[0];n._notifyReloadListener(s);const i=(g=s.providerUserInfo)!=null&&g.length?jd(s.providerUserInfo):[],a=cT(n.providerData,i),u=n.isAnonymous,l=!(n.email&&s.passwordHash)&&!(a!=null&&a.length),d=u?l:!1,p={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:a,metadata:new Co(s.createdAt,s.lastLoginAt),isAnonymous:d};Object.assign(n,p)}async function aT(n){const e=Ce(n);await js(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function cT(n,e){return[...n.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function jd(n){return n.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function uT(n,e){const t=await xd(n,{},async()=>{const r=Pr({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=n.config,a=await Bd(n,s,"/v1/token",`key=${i}`),u=await n._getAdditionalHeaders();u["Content-Type"]="application/x-www-form-urlencoded";const l={method:"POST",headers:u,body:r};return n.emulatorConfig&&br(n.emulatorConfig.host)&&(l.credentials="include"),Fd.fetch()(a,l)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function lT(n,e){return On(n,"POST","/v2/accounts:revokeToken",ci(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yn{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){x(e.idToken,"internal-error"),x(typeof e.idToken<"u","internal-error"),x(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Xu(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){x(e.length!==0,"internal-error");const t=Xu(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(x(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:s,expiresIn:i}=await uT(e,t);this.updateTokensAndExpiration(r,s,Number(i))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:s,expirationTime:i}=t,a=new yn;return r&&(x(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),s&&(x(typeof s=="string","internal-error",{appName:e}),a.accessToken=s),i&&(x(typeof i=="number","internal-error",{appName:e}),a.expirationTime=i),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new yn,this.toJSON())}_performRefresh(){return Ye("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pt(n,e){x(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class Oe{constructor({uid:e,auth:t,stsTokenManager:r,...s}){this.providerId="firebase",this.proactiveRefresh=new oT(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new Co(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await vr(this,this.stsTokenManager.getToken(this.auth,e));return x(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return sT(this,e)}reload(){return aT(this)}_assign(e){this!==e&&(x(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Oe({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){x(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await js(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Ne(this.auth.app))return Promise.reject(St(this.auth));const e=await this.getIdToken();return await vr(this,rT(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const r=t.displayName??void 0,s=t.email??void 0,i=t.phoneNumber??void 0,a=t.photoURL??void 0,u=t.tenantId??void 0,l=t._redirectEventId??void 0,d=t.createdAt??void 0,p=t.lastLoginAt??void 0,{uid:g,emailVerified:A,isAnonymous:b,providerData:k,stsTokenManager:O}=t;x(g&&O,e,"internal-error");const N=yn.fromJSON(this.name,O);x(typeof g=="string",e,"internal-error"),pt(r,e.name),pt(s,e.name),x(typeof A=="boolean",e,"internal-error"),x(typeof b=="boolean",e,"internal-error"),pt(i,e.name),pt(a,e.name),pt(u,e.name),pt(l,e.name),pt(d,e.name),pt(p,e.name);const W=new Oe({uid:g,auth:e,email:s,emailVerified:A,displayName:r,isAnonymous:b,photoURL:a,phoneNumber:i,tenantId:u,stsTokenManager:N,createdAt:d,lastLoginAt:p});return k&&Array.isArray(k)&&(W.providerData=k.map(K=>({...K}))),l&&(W._redirectEventId=l),W}static async _fromIdTokenResponse(e,t,r=!1){const s=new yn;s.updateFromServerResponse(t);const i=new Oe({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await js(i),i}static async _fromGetAccountInfoResponse(e,t,r){const s=t.users[0];x(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?jd(s.providerUserInfo):[],a=!(s.email&&s.passwordHash)&&!(i!=null&&i.length),u=new yn;u.updateFromIdToken(r);const l=new Oe({uid:s.localId,auth:e,stsTokenManager:u,isAnonymous:a}),d={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new Co(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(i!=null&&i.length)};return Object.assign(l,d),l}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zu=new Map;function Je(n){st(n instanceof Function,"Expected a class definition");let e=Zu.get(n);return e?(st(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,Zu.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qd{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}qd.type="NONE";const el=qd;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Is(n,e,t){return`firebase:${n}:${e}:${t}`}class En{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:s,name:i}=this.auth;this.fullUserKey=Is(this.userKey,s.apiKey,i),this.fullPersistenceKey=Is("persistence",s.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await Bs(this.auth,{idToken:e}).catch(()=>{});return t?Oe._fromGetAccountInfoResponse(this.auth,t,e):null}return Oe._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new En(Je(el),e,r);const s=(await Promise.all(t.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let i=s[0]||Je(el);const a=Is(r,e.config.apiKey,e.name);let u=null;for(const d of t)try{const p=await d._get(a);if(p){let g;if(typeof p=="string"){const A=await Bs(e,{idToken:p}).catch(()=>{});if(!A)break;g=await Oe._fromGetAccountInfoResponse(e,A,p)}else g=Oe._fromJSON(e,p);d!==i&&(u=g),i=d;break}}catch{}const l=s.filter(d=>d._shouldAllowMigration);return!i._shouldAllowMigration||!l.length?new En(i,e,r):(i=l[0],u&&await i._set(a,u.toJSON()),await Promise.all(t.map(async d=>{if(d!==i)try{await d._remove(a)}catch{}})),new En(i,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tl(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Hd(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if($d(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Kd(e))return"Blackberry";if(Qd(e))return"Webos";if(zd(e))return"Safari";if((e.includes("chrome/")||Gd(e))&&!e.includes("edge/"))return"Chrome";if(Wd(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function $d(n=we()){return/firefox\//i.test(n)}function zd(n=we()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Gd(n=we()){return/crios\//i.test(n)}function Hd(n=we()){return/iemobile/i.test(n)}function Wd(n=we()){return/android/i.test(n)}function Kd(n=we()){return/blackberry/i.test(n)}function Qd(n=we()){return/webos/i.test(n)}function va(n=we()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function hT(n=we()){var e;return va(n)&&!!((e=window.navigator)!=null&&e.standalone)}function dT(){return Jp()&&document.documentMode===10}function Yd(n=we()){return va(n)||Wd(n)||Qd(n)||Kd(n)||/windows phone/i.test(n)||Hd(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jd(n,e=[]){let t;switch(n){case"Browser":t=tl(we());break;case"Worker":t=`${tl(we())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${bn}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fT{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=i=>new Promise((a,u)=>{try{const l=e(i);a(l)}catch(l){u(l)}});r.onAbort=t,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function pT(n,e={}){return On(n,"GET","/v2/passwordPolicy",ci(n,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mT=6;class gT{constructor(e){var r;const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??mT,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _T{constructor(e,t,r,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new nl(this),this.idTokenSubscription=new nl(this),this.beforeStateQueue=new fT(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Ld,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(i=>this._resolvePersistenceManagerAvailable=i)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Je(t)),this._initializationPromise=this.queue(async()=>{var r,s,i;if(!this._deleted&&(this.persistenceManager=await En.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((s=this._popupRedirectResolver)!=null&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((i=this.currentUser)==null?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Bs(this,{idToken:e}),r=await Oe._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var i;if(Ne(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(u=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(u,u))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let r=t,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(i=this.redirectUser)==null?void 0:i._redirectEventId,u=r==null?void 0:r._redirectEventId,l=await this.tryRedirectSignIn(e);(!a||a===u)&&(l!=null&&l.user)&&(r=l.user,s=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(r)}catch(a){r=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return x(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await js(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=XE()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Ne(this.app))return Promise.reject(St(this));const t=e?Ce(e):null;return t&&x(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&x(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Ne(this.app)?Promise.reject(St(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Ne(this.app)?Promise.reject(St(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Je(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await pT(this),t=new gT(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Rr("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await lT(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Je(e)||this._popupRedirectResolver;x(t,this,"argument-error"),this.redirectPersistenceManager=await En.create(this,[Je(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)==null?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((t=this.currentUser)==null?void 0:t.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,s){if(this._deleted)return()=>{};const i=typeof t=="function"?t:t.next.bind(t);let a=!1;const u=this._isInitialized?Promise.resolve():this._initializationPromise;if(x(u,this,"internal-error"),u.then(()=>{a||i(this.currentUser)}),typeof t=="function"){const l=e.addObserver(t,r,s);return()=>{a=!0,l()}}else{const l=e.addObserver(t);return()=>{a=!0,l()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return x(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Jd(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var s;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await((s=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:s.getHeartbeatsHeader());t&&(e["X-Firebase-Client"]=t);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var t;if(Ne(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:t.getToken());return e!=null&&e.error&&QE(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function ui(n){return Ce(n)}class nl{constructor(e){this.auth=e,this.observer=null,this.addObserver=im(t=>this.observer=t)}get next(){return x(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Aa={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function yT(n){Aa=n}function ET(n){return Aa.loadJS(n)}function TT(){return Aa.gapiScript}function IT(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wT(n,e){const t=ko(n,"auth");if(t.isInitialized()){const s=t.getImmediate(),i=t.getOptions();if(Kt(i,e??{}))return s;rt(s,"already-initialized")}return t.initialize({options:e})}function vT(n,e){const t=(e==null?void 0:e.persistence)||[],r=(Array.isArray(t)?t:[t]).map(Je);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function AT(n,e,t){const r=ui(n);x(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const s=!1,i=Xd(e),{host:a,port:u}=ST(e),l=u===null?"":`:${u}`,d={url:`${i}//${a}${l}/`},p=Object.freeze({host:a,port:u,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!r._canInitEmulator){x(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),x(Kt(d,r.config.emulator)&&Kt(p,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=d,r.emulatorConfig=p,r.settings.appVerificationDisabledForTesting=!0,br(a)?$l(`${i}//${a}${l}`):RT()}function Xd(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function ST(n){const e=Xd(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const i=s[1];return{host:i,port:rl(r.substr(i.length+1))}}else{const[i,a]=r.split(":");return{host:i,port:rl(a)}}}function rl(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function RT(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zd{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Ye("not implemented")}_getIdTokenResponse(e){return Ye("not implemented")}_linkToIdToken(e,t){return Ye("not implemented")}_getReauthenticationResolver(e){return Ye("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Tn(n,e){return Ud(n,"POST","/v1/accounts:signInWithIdp",ci(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const PT="http://localhost";class Zt extends Zd{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Zt(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):rt("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s,...i}=t;if(!r||!s)return null;const a=new Zt(r,s);return a.idToken=i.idToken||void 0,a.accessToken=i.accessToken||void 0,a.secret=i.secret,a.nonce=i.nonce,a.pendingToken=i.pendingToken||null,a}_getIdTokenResponse(e){const t=this.buildRequest();return Tn(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,Tn(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Tn(e,t)}buildRequest(){const e={requestUri:PT,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Pr(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ef{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mr extends ef{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gt extends Mr{constructor(){super("facebook.com")}static credential(e){return Zt._fromParams({providerId:gt.PROVIDER_ID,signInMethod:gt.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return gt.credentialFromTaggedObject(e)}static credentialFromError(e){return gt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return gt.credential(e.oauthAccessToken)}catch{return null}}}gt.FACEBOOK_SIGN_IN_METHOD="facebook.com";gt.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _t extends Mr{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Zt._fromParams({providerId:_t.PROVIDER_ID,signInMethod:_t.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return _t.credentialFromTaggedObject(e)}static credentialFromError(e){return _t.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return _t.credential(t,r)}catch{return null}}}_t.GOOGLE_SIGN_IN_METHOD="google.com";_t.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yt extends Mr{constructor(){super("github.com")}static credential(e){return Zt._fromParams({providerId:yt.PROVIDER_ID,signInMethod:yt.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return yt.credentialFromTaggedObject(e)}static credentialFromError(e){return yt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return yt.credential(e.oauthAccessToken)}catch{return null}}}yt.GITHUB_SIGN_IN_METHOD="github.com";yt.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Et extends Mr{constructor(){super("twitter.com")}static credential(e,t){return Zt._fromParams({providerId:Et.PROVIDER_ID,signInMethod:Et.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Et.credentialFromTaggedObject(e)}static credentialFromError(e){return Et.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return Et.credential(t,r)}catch{return null}}}Et.TWITTER_SIGN_IN_METHOD="twitter.com";Et.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bT(n,e){return Ud(n,"POST","/v1/accounts:signUp",ci(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kt{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,s=!1){const i=await Oe._fromIdTokenResponse(e,r,s),a=sl(r);return new kt({user:i,providerId:a,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const s=sl(r);return new kt({user:e,providerId:s,_tokenResponse:r,operationType:t})}}function sl(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function CT(n){var s;if(Ne(n.app))return Promise.reject(St(n));const e=ui(n);if(await e._initializationPromise,(s=e.currentUser)!=null&&s.isAnonymous)return new kt({user:e.currentUser,providerId:null,operationType:"signIn"});const t=await bT(e,{returnSecureToken:!0}),r=await kt._fromIdTokenResponse(e,"signIn",t,!0);return await e._updateCurrentUser(r.user),r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qs extends ot{constructor(e,t,r,s){super(t.code,t.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,qs.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,s){return new qs(e,t,r,s)}}function tf(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?qs._fromErrorAndOperation(n,i,e,r):i})}async function VT(n,e,t=!1){const r=await vr(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return kt._forOperation(n,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function DT(n,e,t=!1){const{auth:r}=n;if(Ne(r.app))return Promise.reject(St(r));const s="reauthenticate";try{const i=await vr(n,tf(r,s,e,n),t);x(i.idToken,r,"internal-error");const a=wa(i.idToken);x(a,r,"internal-error");const{sub:u}=a;return x(n.uid===u,r,"user-mismatch"),kt._forOperation(n,s,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&rt(r,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function NT(n,e,t=!1){if(Ne(n.app))return Promise.reject(St(n));const r="signIn",s=await tf(n,r,e),i=await kt._fromIdTokenResponse(n,r,s);return t||await n._updateCurrentUser(i.user),i}function kT(n,e,t,r){return Ce(n).onIdTokenChanged(e,t,r)}function OT(n,e,t){return Ce(n).beforeAuthStateChanged(e,t)}function LT(n,e,t,r){return Ce(n).onAuthStateChanged(e,t,r)}const $s="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nf{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem($s,"1"),this.storage.removeItem($s),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const MT=1e3,FT=10;class rf extends nf{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Yd(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),s=this.localCache[t];r!==s&&e(t,s,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((a,u,l)=>{this.notifyListeners(a,l)});return}const r=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const a=this.storage.getItem(r);!t&&this.localCache[r]===a||this.notifyListeners(r,a)},i=this.storage.getItem(r);dT()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,FT):s()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},MT)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}rf.type="LOCAL";const xT=rf;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sf extends nf{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}sf.type="SESSION";const of=sf;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function UT(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class li{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const r=new li(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:s,data:i}=t.data,a=this.handlersMap[s];if(!(a!=null&&a.size))return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const u=Array.from(a).map(async d=>d(t.origin,i)),l=await UT(u);t.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:l})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}li.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sa(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class BT{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,a;return new Promise((u,l)=>{const d=Sa("",20);s.port1.start();const p=setTimeout(()=>{l(new Error("unsupported_event"))},r);a={messageChannel:s,onMessage(g){const A=g;if(A.data.eventId===d)switch(A.data.status){case"ack":clearTimeout(p),i=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),u(A.data.response);break;default:clearTimeout(p),clearTimeout(i),l(new Error("invalid_response"));break}}},this.handlers.add(a),s.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:d,data:t},[s.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function He(){return window}function jT(n){He().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function af(){return typeof He().WorkerGlobalScope<"u"&&typeof He().importScripts=="function"}async function qT(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function $T(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)==null?void 0:n.controller)||null}function zT(){return af()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cf="firebaseLocalStorageDb",GT=1,zs="firebaseLocalStorage",uf="fbase_key";class Fr{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function hi(n,e){return n.transaction([zs],e?"readwrite":"readonly").objectStore(zs)}function HT(){const n=indexedDB.deleteDatabase(cf);return new Fr(n).toPromise()}function lf(){const n=indexedDB.open(cf,GT);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(zs,{keyPath:uf})}catch(s){t(s)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(zs)?e(r):(r.close(),await HT(),e(await lf()))})})}async function il(n,e,t){const r=hi(n,!0).put({[uf]:e,value:t});return new Fr(r).toPromise()}async function WT(n,e){const t=hi(n,!1).get(e),r=await new Fr(t).toPromise();return r===void 0?null:r.value}function ol(n,e){const t=hi(n,!0).delete(e);return new Fr(t).toPromise()}const KT=800,QT=3;class hf{constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.dbPromise?this.dbPromise:(this.dbPromise=lf(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>QT)throw r;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return af()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=li._getInstance(zT()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var t,r;if(this.activeServiceWorker=await qT(),!this.activeServiceWorker)return;this.sender=new BT(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(t=e[0])!=null&&t.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||$T()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await il(e,$s,"1"),await ol(e,$s)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>il(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>WT(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>ol(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const i=hi(s,!1).getAll();return new Fr(i).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:s,value:i}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),KT)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}hf.type="LOCAL";const YT=hf;new Lr(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function JT(n,e){return e?Je(e):(x(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ra extends Zd{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Tn(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Tn(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Tn(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function XT(n){return NT(n.auth,new Ra(n),n.bypassAuthState)}function ZT(n){const{auth:e,user:t}=n;return x(t,e,"internal-error"),DT(t,new Ra(n),n.bypassAuthState)}async function eI(n){const{auth:e,user:t}=n;return x(t,e,"internal-error"),VT(t,new Ra(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class df{constructor(e,t,r,s,i=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:s,tenantId:i,error:a,type:u}=e;if(a){this.reject(a);return}const l={auth:this.auth,requestUri:t,sessionId:r,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(u)(l))}catch(d){this.reject(d)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return XT;case"linkViaPopup":case"linkViaRedirect":return eI;case"reauthViaPopup":case"reauthViaRedirect":return ZT;default:rt(this.auth,"internal-error")}}resolve(e){st(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){st(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tI=new Lr(2e3,1e4);class fn extends df{constructor(e,t,r,s,i){super(e,t,s,i),this.provider=r,this.authWindow=null,this.pollId=null,fn.currentPopupAction&&fn.currentPopupAction.cancel(),fn.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return x(e,this.auth,"internal-error"),e}async onExecution(){st(this.filter.length===1,"Popup operations only handle one event");const e=Sa();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Ge(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(Ge(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,fn.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if((r=(t=this.authWindow)==null?void 0:t.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Ge(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,tI.get())};e()}}fn.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nI="pendingRedirect",ws=new Map;class rI extends df{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=ws.get(this.auth._key());if(!e){try{const r=await sI(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}ws.set(this.auth._key(),e)}return this.bypassAuthState||ws.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function sI(n,e){const t=aI(e),r=oI(n);if(!await r._isAvailable())return!1;const s=await r._get(t)==="true";return await r._remove(t),s}function iI(n,e){ws.set(n._key(),e)}function oI(n){return Je(n._redirectPersistence)}function aI(n){return Is(nI,n.config.apiKey,n.name)}async function cI(n,e,t=!1){if(Ne(n.app))return Promise.reject(St(n));const r=ui(n),s=JT(r,e),a=await new rI(r,s,t).execute();return a&&!t&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uI=600*1e3;class lI{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!hI(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!ff(e)){const s=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";t.onError(Ge(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=uI&&this.cachedEventUids.clear(),this.cachedEventUids.has(al(e))}saveEventToCache(e){this.cachedEventUids.add(al(e)),this.lastProcessedEventTime=Date.now()}}function al(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function ff({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function hI(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return ff(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function dI(n,e={}){return On(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fI=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,pI=/^https?/;async function mI(n){if(n.config.emulator)return;const{authorizedDomains:e}=await dI(n);for(const t of e)try{if(gI(t))return}catch{}rt(n,"unauthorized-domain")}function gI(n){const e=bo(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const a=new URL(n);return a.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&a.hostname===r}if(!pI.test(t))return!1;if(fI.test(n))return r===n;const s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _I=new Lr(3e4,6e4);function cl(){const n=He().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function yI(n){return new Promise((e,t)=>{var s,i,a;function r(){cl(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{cl(),t(Ge(n,"network-request-failed"))},timeout:_I.get()})}if((i=(s=He().gapi)==null?void 0:s.iframes)!=null&&i.Iframe)e(gapi.iframes.getContext());else if((a=He().gapi)!=null&&a.load)r();else{const u=IT("iframefcb");return He()[u]=()=>{gapi.load?r():t(Ge(n,"network-request-failed"))},ET(`${TT()}?onload=${u}`).catch(l=>t(l))}}).catch(e=>{throw vs=null,e})}let vs=null;function EI(n){return vs=vs||yI(n),vs}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const TI=new Lr(5e3,15e3),II="__/auth/iframe",wI="emulator/auth/iframe",vI={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},AI=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function SI(n){const e=n.config;x(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?Ia(e,wI):`https://${n.config.authDomain}/${II}`,r={apiKey:e.apiKey,appName:n.name,v:bn},s=AI.get(n.config.apiHost);s&&(r.eid=s);const i=n._getFrameworks();return i.length&&(r.fw=i.join(",")),`${t}?${Pr(r).slice(1)}`}async function RI(n){const e=await EI(n),t=He().gapi;return x(t,n,"internal-error"),e.open({where:document.body,url:SI(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:vI,dontclear:!0},r=>new Promise(async(s,i)=>{await r.restyle({setHideOnLeave:!1});const a=Ge(n,"network-request-failed"),u=He().setTimeout(()=>{i(a)},TI.get());function l(){He().clearTimeout(u),s(r)}r.ping(l).then(l,()=>{i(a)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const PI={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},bI=500,CI=600,VI="_blank",DI="http://localhost";class ul{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function NI(n,e,t,r=bI,s=CI){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let u="";const l={...PI,width:r.toString(),height:s.toString(),top:i,left:a},d=we().toLowerCase();t&&(u=Gd(d)?VI:t),$d(d)&&(e=e||DI,l.scrollbars="yes");const p=Object.entries(l).reduce((A,[b,k])=>`${A}${b}=${k},`,"");if(hT(d)&&u!=="_self")return kI(e||"",u),new ul(null);const g=window.open(e||"",u,p);x(g,n,"popup-blocked");try{g.focus()}catch{}return new ul(g)}function kI(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const OI="__/auth/handler",LI="emulator/auth/handler",MI=encodeURIComponent("fac");async function ll(n,e,t,r,s,i){x(n.config.authDomain,n,"auth-domain-config-required"),x(n.config.apiKey,n,"invalid-api-key");const a={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:bn,eventId:s};if(e instanceof ef){e.setDefaultLanguage(n.languageCode),a.providerId=e.providerId||"",sm(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[p,g]of Object.entries({}))a[p]=g}if(e instanceof Mr){const p=e.getScopes().filter(g=>g!=="");p.length>0&&(a.scopes=p.join(","))}n.tenantId&&(a.tid=n.tenantId);const u=a;for(const p of Object.keys(u))u[p]===void 0&&delete u[p];const l=await n._getAppCheckToken(),d=l?`#${MI}=${encodeURIComponent(l)}`:"";return`${FI(n)}?${Pr(u).slice(1)}${d}`}function FI({config:n}){return n.emulator?Ia(n,LI):`https://${n.authDomain}/${OI}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const no="webStorageSupport";class xI{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=of,this._completeRedirectFn=cI,this._overrideRedirectResult=iI}async _openPopup(e,t,r,s){var a;st((a=this.eventManagers[e._key()])==null?void 0:a.manager,"_initialize() not called before _openPopup()");const i=await ll(e,t,r,bo(),s);return NI(e,i,Sa())}async _openRedirect(e,t,r,s){await this._originValidation(e);const i=await ll(e,t,r,bo(),s);return jT(i),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:i}=this.eventManagers[t];return s?Promise.resolve(s):(st(i,"If manager is not set, promise should be"),i)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await RI(e),r=new lI(e);return t.register("authEvent",s=>(x(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(no,{type:no},s=>{var a;const i=(a=s==null?void 0:s[0])==null?void 0:a[no];i!==void 0&&t(!!i),rt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=mI(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Yd()||zd()||va()}}const UI=xI;var hl="@firebase/auth",dl="1.13.2";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class BI{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){x(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jI(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function qI(n){vn(new Qt("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:a,authDomain:u}=r.options;x(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const l={apiKey:a,authDomain:u,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Jd(n)},d=new _T(r,s,i,l);return vT(d,t),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),vn(new Qt("auth-internal",e=>{const t=ui(e.getProvider("auth").getImmediate());return(r=>new BI(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),wt(hl,dl,jI(n)),wt(hl,dl,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $I=300,zI=ql("authIdTokenMaxAge")||$I;let fl=null;const GI=n=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>zI)return;const s=t==null?void 0:t.token;fl!==s&&(fl=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function HI(n=Wl()){const e=ko(n,"auth");if(e.isInitialized())return e.getImmediate();const t=wT(n,{popupRedirectResolver:UI,persistence:[YT,xT,of]}),r=ql("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(r,location.origin);if(location.origin===i.origin){const a=GI(i.toString());OT(t,a,()=>a(t.currentUser)),kT(t,u=>a(u))}}const s=Bl("auth");return s&&AT(t,`http://${s}`),t}function WI(){var n;return((n=document.getElementsByTagName("head"))==null?void 0:n[0])??document}yT({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=s=>{const i=Ge("internal-error");i.customData=s,t(i)},r.type="text/javascript",r.charset="UTF-8",WI().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});qI("Browser");let In=null,er=null;function KI(n){return new Promise(e=>{const t=LT(n,r=>{t(),e(r)})})}function di(){return(In==null?void 0:In.uid)??null}async function QI(){if(!Lt())return null;if(In)return In.uid;if(er)return er;er=(async()=>{kd();const n=HI();let e=await KI(n);return e||(e=(await CT(n)).user),In=e,e.uid})();try{return await er}catch(n){return console.error("Firebase anonymous auth failed",n),null}finally{er=null}}const fi=10;function pi(){return{easy:0,medium:0,hard:0}}function Pa(n=""){return{name:n,bests:pi()}}const at={profile:Pa(),localRecords:[],leaderboards:{},isReady:!1,isLeaderboardLoading:!1};function it(){return at.profile}function en(n){at.profile=n}function YI(){return at.localRecords}function pf(n){at.localRecords=n}function JI(n){return at.leaderboards[n]}function ba(n,e){at.leaderboards[n]=e}function ro(n){at.isReady=n}function XI(){return at.isLeaderboardLoading}function Gs(n){at.isLeaderboardLoading=n}const mf="flappy-petya-player-name",gf="flappy-petya-records";function Ca(){try{const n=localStorage.getItem(mf);return(n==null?void 0:n.trim())??""}catch{return""}}function ZI(n){const e=n.trim();if(e)try{localStorage.setItem(mf,e)}catch{}}function Ar(){try{const n=localStorage.getItem(gf);if(!n)return[];const e=JSON.parse(n);return Array.isArray(e)?Da(e.filter(nw)):[]}catch{return[]}}function ew(n){try{localStorage.setItem(gf,JSON.stringify(Da(n)))}catch{}}function tw(n,e,t){const r=n.trim();if(!r||t<=0)return Ar();const s=Ar(),i=s.findIndex(u=>u.name===r&&u.level===e);i>=0?s[i].score=Math.max(s[i].score,t):s.push({name:r,level:e,score:t}),s.sort((u,l)=>l.score-u.score);const a=Da(s);return ew(a),a}function Va(n,e){const t=n.trim(),r=Ar().find(s=>s.name===t&&s.level===e);return(r==null?void 0:r.score)??0}function nw(n){if(!n||typeof n!="object")return!1;const e=n;return typeof e.name=="string"&&typeof e.level=="string"&&typeof e.score=="number"&&e.score>=0}function Da(n){return[...new Set(n.map(t=>t.level))].flatMap(t=>n.filter(r=>r.level===t).sort((r,s)=>s.score-r.score).slice(0,fi))}function _f(n,e){return Id(n,"players",e)}function rw(n){const e=pi(),t=n.bests;if(t&&typeof t=="object"){const s=t;typeof s.easy=="number"&&(e.easy=s.easy),typeof s.medium=="number"&&(e.medium=s.medium),typeof s.hard=="number"&&(e.hard=s.hard)}const r={name:typeof n.name=="string"?n.name.trim():"",bests:e};return(n.selectedDifficulty==="easy"||n.selectedDifficulty==="medium"||n.selectedDifficulty==="hard")&&(r.selectedDifficulty=n.selectedDifficulty),r}async function yf(n,e){const t=await ya(_f(n,e));return t.exists()?rw(t.data()):null}async function mi(n,e,t){await Ea(_f(n,e),{name:t.name,bests:t.bests,selectedDifficulty:t.selectedDifficulty??null,updatedAt:ha()},{merge:!0})}async function sw(n,e,t,r){const s={...r,name:t};return await mi(n,e,s),s}async function iw(n,e,t,r,s){const i={...s,bests:{...s.bests,[t]:Math.max(s.bests[t],r)}};return await mi(n,e,i),i}function ow(n,e,t){return{...Pa(n),name:n,bests:e,selectedDifficulty:t}}function aw(n,e){return AE(n,"leaderboard",e,"scores")}function Ef(n,e,t){return Id(n,"leaderboard",e,"scores",t)}async function Na(n,e,t=fi){return(await $E(xE(aw(n,e),UE("score","desc"),BE(t)))).docs.map(s=>{const i=s.data();return typeof i.name!="string"||typeof i.score!="number"?null:{name:i.name.trim(),level:e,score:i.score}}).filter(s=>!!(s!=null&&s.name))}async function ka(n,e,t,r,s){const i=Ef(n,t,e),a=await ya(i),u=a.exists()&&Number(a.data().score)||0,l=Math.max(u,s);l<=0||await Ea(i,{name:r,score:l,updatedAt:ha()},{merge:!0})}async function cw(n,e,t){const r=["easy","medium","hard"];await Promise.all(r.map(async s=>{const i=Ef(n,s,e);(await ya(i)).exists()&&await Ea(i,{name:t,updatedAt:ha()},{merge:!0})}))}function uw(n){const e=pi();return["easy","medium","hard"].forEach(r=>{e[r]=Va(n,r)}),e}async function lw(n,e){const t=await yf(n,e);if(t!=null&&t.name)return t;const r=Ca(),s=ow(r,r?uw(r):pi());if(await mi(n,e,s),!r)return s;const i=Ar().filter(a=>a.name===r);return await Promise.all(i.map(a=>ka(n,e,a.level,r,a.score))),s}const ir=[];let so=!1,je=null;function hw(){const n=Ca(),e=Ar(),t=Pa(n);n&&["easy","medium","hard"].forEach(s=>{t.bests[s]=Va(n,s)}),en(t),pf(e)}function Oa(n){ir.push(n),La()}async function La(){if(!(so||ir.length===0||!Lt()||!je||!Mt())){for(so=!0;ir.length>0;){const e=ir.shift();if(e)try{await e()}catch(t){console.error("Firebase storage task failed",t),ir.unshift(e);break}}so=!1}}async function Tf(){const n=Mt();if(n){Gs(!0);try{const e=["easy","medium","hard"];(await Promise.all(e.map(async r=>({level:r,records:await Na(n,r)})))).forEach(({level:r,records:s})=>{ba(r,s)})}catch(e){console.error("Failed to load leaderboards",e)}finally{Gs(!1)}}}async function dw(){if(hw(),!Lt()){ro(!0);return}try{kd(),je=await QI();const n=Mt();if(!n||!je){ro(!0);return}let e=await yf(n,je);e!=null&&e.name?await _w(je,e):e=await lw(n,je),en(e),await Tf(),La()}catch(n){console.error("Storage initialization failed",n)}finally{ro(!0)}}function fw(){return XI()}function pl(){return it().name||Ca()}function pw(){return it().selectedDifficulty}function ml(n){const e=n.trim();if(!e)return;const t={...it(),name:e};en(t),ZI(e);const r=je??di();!r||!Lt()||Oa(async()=>{const s=Mt();if(!s)return;const i=await sw(s,r,e,it());en(i),await cw(s,r,e),await Tf()})}function mw(n){const e={...it(),selectedDifficulty:n};en(e);const t=je??di();!t||!Lt()||Oa(async()=>{const r=Mt();r&&await mi(r,t,e)})}function gl(n,e){const t=it(),r=n.trim();return t.name&&t.name===r?t.bests[e]??0:Va(r,e)}function gw(n){const e=n.name.trim();return e?["easy","medium","hard"].filter(r=>n.bests[r]>0).map(r=>({name:e,level:r,score:n.bests[r]})):[]}async function _w(n,e){const t=e.name.trim();if(!t)return;const r=Mt();if(!r)return;const s=["easy","medium","hard"];await Promise.all(s.map(i=>ka(r,n,i,t,e.bests[i])))}function yw(n,...e){const t=new Map;return e.forEach(r=>{r.forEach(s=>{if(s.level!==n)return;const i=s.name.trim();if(!i)return;const a={name:i,level:n,score:s.score},u=t.get(i);(!u||a.score>u.score)&&t.set(i,a)})}),[...t.values()].sort((r,s)=>s.score-r.score)}function _l(n,e=fi){if(!Lt()){const r=YI().filter(i=>i.level===n),s=gw(it());return yw(n,r,s).slice(0,e)}const t=JI(n);return t===void 0?[]:t.slice(0,e)}function Ew(n,e,t){const r=n.trim();if(!r||t<=0)return;const s=tw(r,e,t);pf(s);const i=it();i.name===r&&en({...i,bests:{...i.bests,[e]:Math.max(i.bests[e],t)}});const a=je??di();!a||!Lt()||Oa(async()=>{const u=Mt();if(!u)return;const l=it(),d=l.name===r?l:{...l,name:r};await ka(u,a,e,r,t);const p=await iw(u,a,e,t,d);en(p);const g=await Na(u,e);ba(e,g)})}async function yl(n){if(!Lt())return;const e=Mt(),t=je??di();if(!(!e||!t)){Gs(!0);try{const r=await Na(e,n);ba(n,r),La()}catch(r){console.error("Failed to refresh leaderboard",r)}finally{Gs(!1)}}}const If=24,wf=12,Sr="bold 18px system-ui, sans-serif",or=20,Vo=10;function Ft(n,e,t,r,s,i="center"){n.save(),n.font=s.font,n.textAlign=i,n.textBaseline="middle",n.lineJoin="round",n.lineWidth=s.strokeWidth,n.strokeStyle=q.outline,n.fillStyle=s.fill,n.strokeText(e,t,r),n.fillText(e,t,r),n.restore()}const vf='bold 28px "Arial Rounded MT Bold", system-ui, sans-serif',Tw=28,Iw=6,ww=24,vw=16,Af="ППР",Sf=20,Rf=4;function Aw(n,e,t,r){Ft(n,e,t,r,{font:vf,fill:q.accent,strokeWidth:5})}function Pf(n){return`bold ${Math.max(10,Math.round(n*.75))}px "Arial Rounded MT Bold", system-ui, sans-serif`}function bf(n,e,t){const r=t*(Sf/e.naturalHeight),s=Pf(t);n.save(),n.font=s;const i=n.measureText(Af).width;return n.restore(),{width:r+Rf+i,iconWidth:r,textWidth:i}}function Sw(n,e,t,r,s){const{width:i,iconWidth:a,textWidth:u}=bf(n,e,s),l=t-i/2,d=r-s/2,p=Pf(s);n.drawImage(e,0,0,Sf,e.naturalHeight,l,d,a,s),Ft(n,Af,l+a+Rf+u/2,r,{font:p,fill:q.text,strokeWidth:4})}function Rw(n,e,t,r,s,i){const a=i-vw*2;let u=ww;const l=bf(n,t,u).width;l>a&&(u=Math.max(12,Math.round(u*(a/l))));const d=s-Tw/2-Iw-u/2;Sw(n,t,r,d,u),Ft(n,e,r,s,{font:vf,fill:q.accent,strokeWidth:5})}function El(n,e,t,r){Ft(n,e,t,r,{font:'bold 22px "Arial Rounded MT Bold", system-ui, sans-serif',fill:q.text,strokeWidth:4})}function Pw(n,e,t,r){const s=e.toString();n.save(),n.font="bold 32px system-ui, sans-serif";const u=n.measureText(s).width+14*2,l=40;n.fillStyle="rgba(0, 0, 0, 0.15)",n.beginPath(),n.roundRect(t-u/2,r-l/2,u,l,8),n.fill(),Ft(n,s,t,r,{font:"bold 32px system-ui, sans-serif",fill:q.text,strokeWidth:4}),n.restore()}function bw(n,e,t,r,s){const i=e.naturalWidth/e.naturalHeight,a=s*i;n.drawImage(e,t-a/2,r-s/2,a,s)}function Cw(n,e,t,r,s){const u=r-100,l=s-90/2;n.fillStyle=q.panel,n.strokeStyle=q.panelBorder,n.lineWidth=3,n.beginPath(),n.roundRect(u,l,200,90,10),n.fill(),n.stroke();const d="14px system-ui, sans-serif",p="bold 22px system-ui, sans-serif",g=l+30,A=l+62;return n.save(),n.font=d,n.fillStyle=q.outline,n.textAlign="left",n.textBaseline="middle",n.fillText("Счёт",u+20,g),n.fillText("Рекорд",u+20,A),n.font=p,n.textAlign="right",n.fillText(e.toString(),u+200-20,g),n.fillText(t.toString(),u+200-20,A),n.restore(),{width:200,height:90}}function cs(n,e){n.save(),n.font=Sr;const t=n.measureText(e).width;return n.restore(),{x:0,y:0,width:t+If*2,height:36+wf}}function us(n,e,t,r=!1){n.fillStyle=r?q.accent:q.panel,n.strokeStyle=r?q.outline:q.panelBorder,n.lineWidth=2,n.beginPath(),n.roundRect(t.x,t.y,t.width,t.height,8),n.fill(),n.stroke(),Ft(n,e,t.x+t.width/2,t.y+t.height/2,{font:Sr,fill:r?q.text:q.outline,strokeWidth:2})}function Vw(n,e,t,r){const s=r*.22,i=t-r*.2,a=r*.82,u=r*.4,l=t+r*.02,d=e-a/2;n.save(),n.fillStyle=q.accent,n.strokeStyle=q.outline,n.lineWidth=1.5,n.lineJoin="round",n.beginPath(),n.arc(e,i,s,0,Math.PI*2),n.fill(),n.stroke(),n.beginPath(),n.roundRect(d,l,a,u,u/2),n.fill(),n.stroke(),n.restore()}function Dw(n,e){const t=or+Vo;n.save(),n.font=Sr;const r=n.measureText(e).width;return n.restore(),{x:0,y:0,width:If*2+t+r,height:36+wf}}function Nw(n,e,t){n.fillStyle=q.panel,n.strokeStyle=q.panelBorder,n.lineWidth=2,n.beginPath(),n.roundRect(t.x,t.y,t.width,t.height,8),n.fill(),n.stroke();const r=t.y+t.height/2,s=q.outline;n.save(),n.font=Sr;const i=n.measureText(e).width,a=or+Vo+i,u=t.x+(t.width-a)/2;Vw(n,u+or/2,r,or),Ft(n,e,u+or+Vo+i/2,r,{font:Sr,fill:s,strokeWidth:2}),n.restore()}const ls=32,kw=320,Ow=200,Lw=12,Mw=36,Tl=6;function Cf(n){return Math.max(Ow,Math.min(kw,n-Lw*2))}function Il(n,e,t,r){const s=Cf(t),i=n-s/2,a=(s-Tl*(r-1))/r;return Array.from({length:r},(u,l)=>({x:i+l*(a+Tl),y:e,width:a,height:Mw}))}function wl(n,e,t,r){const s=t.width<88?12:14;n.fillStyle=r?q.accent:q.panel,n.strokeStyle=r?q.outline:q.panelBorder,n.lineWidth=2,n.beginPath(),n.roundRect(t.x,t.y,t.width,t.height,8),n.fill(),n.stroke(),Ft(n,e,t.x+t.width/2,t.y+t.height/2,{font:`bold ${s}px system-ui, sans-serif`,fill:r?q.text:q.outline,strokeWidth:2})}function Fw(n,e,t){if(n.measureText(e).width<=t)return e;let r=e;for(;r.length>1&&n.measureText(`${r}…`).width>t;)r=r.slice(0,-1);return`${r}…`}function xw(n,e,t,r,s,i=!1){const a=Cf(s),u=t-a/2,l=32,d=a<260?12:14,p=`bold ${d}px system-ui, sans-serif`,g=`${d}px system-ui, sans-serif`,A=e.slice(0,fi),b=Math.max(A.length,1),k=l+b*ls;n.fillStyle=q.panel,n.strokeStyle=q.panelBorder,n.lineWidth=3,n.beginPath(),n.roundRect(u,r,a,k,10),n.fill(),n.stroke();const O=12,N=u+O,W=u+a-O,K=a*.68,X=r+l/2;if(n.save(),n.font=p,n.fillStyle=q.outline,n.textBaseline="middle",n.textAlign="left",n.fillText("Игрок",N,X),n.textAlign="right",n.fillText("Очки",W,X),n.strokeStyle=q.panelBorder,n.lineWidth=1,n.beginPath(),n.moveTo(u+O,r+l),n.lineTo(u+a-O,r+l),n.stroke(),n.font=g,A.length===0){n.textAlign="center",n.fillText(i?"Загрузка...":"Пока нет рекордов",t,r+l+ls/2),n.restore();return}A.forEach((ve,de)=>{const ue=r+l+de*ls+ls/2;n.textAlign="left",n.fillText(Fw(n,ve.name,K),N,ue),n.textAlign="right",n.fillText(ve.score.toString(),W,ue)}),n.restore()}const vl=480;function Al(){const n=document.documentElement;return{width:n.clientWidth||window.innerWidth,height:n.clientHeight||window.innerHeight}}function Sl(n=Al().width,e=Al().height){const t=Math.max(1,Math.round(n)),r=Math.max(1,Math.round(e)),s=window.devicePixelRatio||1,i=r/vl,a=t/i,u=vl;return{cssWidth:t,cssHeight:r,bufferWidth:Math.round(t*s),bufferHeight:Math.round(r*s),dpr:s,scale:i,logicalWidth:a,logicalHeight:u}}function Rl(n,e,t){n.style.width=`${t.cssWidth}px`,n.style.height=`${t.cssHeight}px`,n.width=t.bufferWidth,n.height=t.bufferHeight,e.setTransform(t.dpr*t.scale,0,0,t.dpr*t.scale,0,0)}function Uw(n,e,t,r){const s=n.getBoundingClientRect();if(s.width<=0||s.height<=0)return{x:0,y:0};const i=window.visualViewport,a=(i==null?void 0:i.offsetLeft)??0,u=(i==null?void 0:i.offsetTop)??0,l=e-a,d=t-u;return{x:(l-s.left)/s.width*r.logicalWidth,y:(d-s.top)/s.height*r.logicalHeight}}function Bw(n){return"touches"in n}function jw(n){if(Bw(n)){const e=n.touches[0]??n.changedTouches[0];return e?{x:e.clientX,y:e.clientY}:null}return{x:n.clientX,y:n.clientY}}function io(n,e,t){const r=jw(e);return r?Uw(n,r.x,r.y,t):null}function zt(n,e){return e.x<n.x&&n.x<e.x+e.width&&e.y<n.y&&n.y<e.y+e.height}const qw="app-loader",$w="app-loader--hidden",zw=400;function Pl(){const n=document.getElementById(qw);if(!n)return;n.classList.add($w),n.setAttribute("aria-busy","false");const e=()=>{n.remove()};n.addEventListener("transitionend",e,{once:!0}),window.setTimeout(e,zw)}const bl="Игрок",Gw=20,Hw="Играть";class Ww{constructor(){M(this,"root");M(this,"input");M(this,"submitBtn");M(this,"resolve",null);this.root=document.createElement("div"),this.root.className="name-overlay",this.root.hidden=!0;const e=document.createElement("div");e.className="name-dialog";const t=document.createElement("p");t.className="name-dialog__title",t.textContent="Введите имя",this.input=document.createElement("input"),this.input.className="name-dialog__input",this.input.type="text",this.input.maxLength=Gw,this.input.placeholder=bl,this.input.autocomplete="off",this.input.enterKeyHint="go",this.submitBtn=document.createElement("button"),this.submitBtn.className="name-dialog__button",this.submitBtn.type="button",this.submitBtn.textContent="Играть",e.append(t,this.input,this.submitBtn),this.root.append(e),document.body.append(this.root),this.submitBtn.addEventListener("click",()=>this.confirm()),this.input.addEventListener("keydown",r=>{r.key==="Enter"&&(r.preventDefault(),this.confirm())})}prompt(e="",t={}){return this.input.value=e,this.submitBtn.textContent=t.submitLabel??Hw,this.root.hidden=!1,this.input.focus(),this.input.select(),new Promise(r=>{this.resolve=r})}hide(){this.root.hidden=!0}confirm(){var t;const e=this.input.value.trim()||bl;this.hide(),(t=this.resolve)==null||t.call(this,{name:e,confirmed:!0}),this.resolve=null}}const wn={Easy:"easy",Medium:"medium",Hard:"hard"},mt=[{id:wn.Easy,label:"Легкий",pipeGap:140,pipeSpeed:ds/1.5,fgScrollSpeed:$i/1.5},{id:wn.Medium,label:"Средний",pipeGap:110,pipeSpeed:ds/1.5,fgScrollSpeed:$i/1.5},{id:wn.Hard,label:"Сложный",pipeGap:Ol,pipeSpeed:ds,fgScrollSpeed:$i}];function Cl(n){return mt.find(t=>t.id===n)??mt[2]}const Kw="/flappy-petya/static/goose.png",Qw="/flappy-petya/static/petya-splash.png",Yw="/flappy-petya/static/game-over-goose.png",Jw="/flappy-petya/static/logo.png",Vl="Ещё раз",Dl="Играть",Nl="Рекорды",kl="Назад",Xw=100;function hs(n){return new Promise((e,t)=>{const r=new Image;r.addEventListener("load",()=>e(r)),r.addEventListener("error",()=>t(new Error(`Failed to load ${n}`))),r.src=n})}class Zw{constructor(){M(this,"canvas");M(this,"ctx");M(this,"viewport");M(this,"sprites");M(this,"gameOverImg");M(this,"logoImg");M(this,"resizeTimer",null);M(this,"resizeObserver",null);M(this,"goose",new wp);M(this,"pipes",new Pp);M(this,"nameInput",new Ww);M(this,"currentState",ee.Splash);M(this,"fgpos",0);M(this,"frames",0);M(this,"score",0);M(this,"playerName",pl());M(this,"personalBest",0);M(this,"isAwaitingName",!1);M(this,"okBtn",{x:0,y:0,width:0,height:0});M(this,"recordsBtn",{x:0,y:0,width:0,height:0});M(this,"playerNameBtn",{x:0,y:0,width:0,height:0});M(this,"backBtn",{x:0,y:0,width:0,height:0});M(this,"recordsTabBtns",[]);M(this,"recordsLevelTab",wn.Medium);M(this,"difficultyTabBtns",[]);M(this,"playBtn",{x:0,y:0,width:0,height:0});M(this,"selectedDifficulty",wn.Medium);M(this,"fgScrollSpeed",Cl(wn.Medium).fgScrollSpeed);M(this,"hasSavedCurrentScore",!1);M(this,"lastFrameTime",0);M(this,"onResize",()=>{this.resizeTimer!==null&&clearTimeout(this.resizeTimer),this.resizeTimer=setTimeout(()=>{this.resizeTimer=null,this.resize()},Xw)});M(this,"onPress",e=>{if(!this.isAwaitingName)switch(e.cancelable&&e.preventDefault(),this.currentState){case ee.Splash:{const t=io(this.canvas,e,this.viewport);if(!t)break;if(zt(t,this.recordsBtn)){this.recordsLevelTab=this.selectedDifficulty,this.currentState=ee.Records,yl(this.recordsLevelTab);break}if(this.playerName&&zt(t,this.playerNameBtn)){this.editPlayerName();break}if(zt(t,this.playBtn)){this.startGameWithNamePrompt();break}const r=this.difficultyTabBtns.findIndex(s=>zt(t,s));r>=0&&this.applyDifficulty(mt[r].id);break}case ee.Records:{const t=io(this.canvas,e,this.viewport);if(!t)break;if(zt(t,this.backBtn)){this.currentState=ee.Splash;break}const r=this.recordsTabBtns.findIndex(s=>zt(t,s));r>=0&&(this.recordsLevelTab=mt[r].id,yl(this.recordsLevelTab));break}case ee.Game:this.goose.jump();break;case ee.Score:{const t=io(this.canvas,e,this.viewport);t&&zt(t,this.okBtn)&&(this.pipes.reset(),this.currentState=ee.Splash,this.score=0,this.hasSavedCurrentScore=!1,this.layoutUi());break}}})}start(){this.canvas=document.createElement("canvas"),this.viewport=Sl();const e=this.canvas.getContext("2d");if(!e){alert("Your browser doesn't support HTML5, please update to latest version");return}this.ctx=e,Rl(this.canvas,this.ctx,this.viewport),document.body.appendChild(this.canvas),this.bindInput(),this.bindResizeTracking(),Promise.all([hs(Kw),hs(Qw),hs(Yw),hs(Jw),dw()]).then(([t,r,s,i])=>{this.sprites=Op(t,r),this.gameOverImg=s,this.logoImg=i,this.syncStateFromStorage(),this.layoutUi(),Pl(),this.run()}).catch(t=>{console.error(t),Pl(),alert("Не удалось загрузить игровые ресурсы")})}layoutUi(){const{logicalWidth:e,logicalHeight:t}=this.viewport,r=jc(t),s=Uc(t),i=Bc(t),a=cs(this.ctx,Vl);this.okBtn={x:(e-a.width)/2,y:r.retryButtonY,width:a.width,height:a.height};const u=cs(this.ctx,Nl);if(this.recordsBtn={x:(e-u.width)/2,y:s.footerStartY,width:u.width,height:u.height},this.playerName){const p=Dw(this.ctx,this.playerName);this.playerNameBtn={x:(e-p.width)/2,y:this.recordsBtn.y+this.recordsBtn.height+bp,width:p.width,height:p.height}}const l=cs(this.ctx,kl);this.backBtn={x:(e-l.width)/2,y:i.backButtonY,width:l.width,height:l.height},this.recordsTabBtns=Il(e/2,i.tabsY,e,mt.length),this.difficultyTabBtns=Il(e/2,s.difficultyTabsY,e,mt.length);const d=cs(this.ctx,Dl);this.playBtn={x:(e-d.width)/2,y:s.playButtonY,width:d.width,height:d.height}}bindInput(){const e={passive:!1};if(window.PointerEvent){this.canvas.addEventListener("pointerdown",this.onPress,e);return}this.canvas.addEventListener("mousedown",this.onPress),this.canvas.addEventListener("touchstart",this.onPress,e)}bindResizeTracking(){var e,t;window.addEventListener("resize",this.onResize),window.addEventListener("orientationchange",this.onResize),(e=window.visualViewport)==null||e.addEventListener("resize",this.onResize),(t=window.visualViewport)==null||t.addEventListener("scroll",this.onResize),this.resizeObserver=new ResizeObserver(()=>{this.onResize()}),this.resizeObserver.observe(document.documentElement),requestAnimationFrame(()=>{this.resize()})}resize(){this.viewport=Sl(),Rl(this.canvas,this.ctx,this.viewport),this.layoutUi()}syncStateFromStorage(){this.playerName=pl();const e=pw();e?this.applyDifficulty(e,!1):this.applyDifficulty(this.selectedDifficulty,!1),this.playerName&&(this.personalBest=gl(this.playerName,this.selectedDifficulty))}applyDifficulty(e,t=!0){const r=Cl(e);this.selectedDifficulty=e,this.fgScrollSpeed=r.fgScrollSpeed,this.pipes.setDifficulty(r),t&&mw(e)}async editPlayerName(){if(this.isAwaitingName)return;this.isAwaitingName=!0;const e=await this.nameInput.prompt(this.playerName,{submitLabel:"Сохранить"});this.isAwaitingName=!1,e.confirmed&&(this.playerName=e.name,ml(e.name),this.layoutUi())}async startGameWithNamePrompt(){if(this.isAwaitingName)return;if(this.playerName){this.beginGame(this.playerName);return}this.isAwaitingName=!0;const e=await this.nameInput.prompt("");this.isAwaitingName=!1,e.confirmed&&this.beginGame(e.name)}beginGame(e){this.playerName=e,ml(e),this.personalBest=gl(this.playerName,this.selectedDifficulty),this.score=0,this.hasSavedCurrentScore=!1,this.layoutUi(),this.currentState=ee.Game,this.pipes.reset(),this.pipes.seedInitial(this.viewport.logicalWidth,this.viewport.logicalHeight),this.goose.jump()}run(){const e=t=>{this.lastFrameTime===0&&(this.lastFrameTime=t);const r=t-this.lastFrameTime;this.lastFrameTime=t;const s=Math.min(r/hp,dp);this.update(s),this.render(),requestAnimationFrame(e)};requestAnimationFrame(e)}update(e){const{logicalHeight:t}=this.viewport;this.frames+=e,this.currentState!==ee.Score?this.fgpos=(this.fgpos-this.fgScrollSpeed*e)%Ml:this.hasSavedCurrentScore||(Ew(this.playerName,this.selectedDifficulty,this.score),this.personalBest=Math.max(this.personalBest,this.score),this.hasSavedCurrentScore=!0),this.currentState===ee.Game&&this.pipes.update(this.viewport.logicalWidth,t,this.goose,e,()=>{this.currentState=ee.Score},()=>{this.score++}),this.goose.update(this.currentState,t,pn,this.frames,e,()=>{this.currentState===ee.Game&&(this.currentState=ee.Score)})}render(){const{ctx:e,viewport:t,sprites:r}=this,{logicalWidth:s,logicalHeight:i}=t,a=s/2,u=Uc(i),l=jc(i),d=Bc(i);Ap(e,s,i),this.pipes.draw(e),this.currentState!==ee.Splash&&this.currentState!==ee.Records&&this.goose.draw(e,r),Sp(e,s,i,this.fgpos),this.currentState===ee.Splash&&(Rw(e,"Flappy Petya",this.logoImg,a,u.titleY,s),El(e,"Выбери уровень",a,u.subtitleY),mt.forEach((p,g)=>{wl(e,p.label,this.difficultyTabBtns[g],p.id===this.selectedDifficulty)}),us(e,Dl,this.playBtn,!0),us(e,Nl,this.recordsBtn),this.playerName&&Nw(e,this.playerName,this.playerNameBtn)),this.currentState===ee.Records&&(Aw(e,"Рекорды",a,d.titleY),mt.forEach((p,g)=>{wl(e,p.label,this.recordsTabBtns[g],p.id===this.recordsLevelTab)}),xw(e,_l(this.recordsLevelTab),a,d.tableStartY,s,fw()&&_l(this.recordsLevelTab).length===0),us(e,kl,this.backBtn)),this.currentState===ee.Score?(El(e,"Игра окончена",a,l.subtitleY),bw(e,this.gameOverImg,a,l.imageY,l.imageHeight),Cw(e,this.score,this.personalBest,a,l.panelY),us(e,Vl,this.okBtn)):this.currentState===ee.Game&&Pw(e,this.score,a,kp(i))}}const ev=new Zw;ev.start();
