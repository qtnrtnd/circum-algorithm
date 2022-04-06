const e=document.querySelector("canvas"),t=e.getContext("2d"),a={canvas:e,ctx:t,paramsWindow:document.getElementById("params")},i=function(e,t){return Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2))},n=function(e,t,a,i,n){let l;return l=t<0?1-Math.pow(1-e*a,-1*t):Math.pow(e*a,t),Math.round(1e3*(i+l*(n-i)))/1e3},l=function(e,t,a,i=0,n=!1){let l,o,s=Math.max(e.x>t.x?e.x-t.x:t.x-e.x,1),u=(e.x>t.x?e.y-t.y:t.y-e.y)/s,r=e.y-u*e.x;return n?(o=a.y+i,l=(o-r)/u):(l=a.x+i,o=u*l+r),{x:l,y:o}},o=function(e,t,a,n=params.smoothness.initial){let o,s,u={x:(e.x+t.x)/2,y:(e.y+t.y)/2},r={x:(t.x+a.x)/2,y:(t.y+a.y)/2},p={x:(u.x+r.x)/2,y:(u.y+r.y)/2},m=i(u,p),c=i(p,r),h=Math.max(u.x,p.x)-Math.min(u.x,p.x)>=Math.max(u.y,p.y)-Math.min(u.y,p.y),d=Math.max(r.x,p.x)-Math.min(r.x,p.x)>=Math.max(r.y,p.y)-Math.min(r.y,p.y);return o=h?u.x<p.x?1:-1:u.y<p.y?1:-1,s=d?r.x>p.x?1:-1:r.y>p.y?1:-1,{cpl:l(u,r,p,-o*m*.552*n,!h),cpr:l(u,r,p,s*c*.552*n,!d),x:p.x,y:p.y}},s=function(e,t={pointsInterval:!1,pointsHeight:!1,circlesRotation:!1}){a.ctx.clearRect(0,0,e.resolution.value,e.resolution.value),e.alphaBackground.value||(a.ctx.fillStyle="white",a.ctx.fillRect(0,0,a.canvas.width,a.canvas.height));const i=function(e){let t=e.iterations.value,a=1/Math.max(t-1,1),i=[];for(let l=0;l<t;l++)i.push(n(l,e.circleSpacingEase.value,a,e.smallestCircleScale.value/2,e.biggestCircleScale.value/2));return i}(e),l=function(e,t){let a=[];const i=e.biggestCircleScale.value/2,n=e.pointsPerCircle.value;for(let l=0;l<t.length;l++){let o;o=e.adaptativePointsPerCircle.value?Math.floor(e.pointsPerCircle.min+t[l]/i*(n-e.pointsPerCircle.min)):n,a.push(o)}return a}(e,i);if(t.pointsInterval||e.randomizePointsInterval.value&&!e.pointsIntervalRandomizationSeed.value){let t=[];for(let a=0;a<e.iterations.value;a++)t.push(Array.apply(null,Array(l[a])).map((()=>2*Math.random()-1)));e.pointsIntervalRandomizationSeed.value=t}if(t.pointsHeight||e.randomizePointsHeight.value&&!e.pointsHeightRandomizationSeed.value){let t=[];for(let a=0;a<e.iterations.value;a++)t.push(Array.apply(null,Array(l[a])).map((()=>2*Math.random()-1)));e.pointsHeightRandomizationSeed.value=t}if(t.circlesRotation||"randomization"===e.circlesRotationVariationType.value&&!e.circlesRotationRandomizationSeed.value){let t=[];for(let a=0;a<e.iterations.value;a++)t.push(Math.random());e.circlesRotationRandomizationSeed.value=t}i.forEach(((t,i)=>{let s=e.strokeWidth.value,u=Math.max(n(i,e.strokeWidthEase.value,1/(e.iterations.value-1),e.strokeWidthMinFactor.value,e.strokeWidthMaxFactor.value),.001);e.linkStrokeWidthToEase.value&&(s*=u),a.ctx.lineWidth=s;let r=function(e,t,i,l,s,u,r){r.adaptativePointsPerCircle.value&&t!==i.length&&(t=i.length);let p=360/t,m=1/r.iterations.value,c=(r.biggestCircleScale.value/2-e)*r.distanceFromCenter.value,h=a.canvas.width/2+c*Math.cos(r.originRotate.value*Math.PI/180),d=a.canvas.height/2+c*Math.sin(r.originRotate.value*Math.PI/180),v=[],g=[],x=1,V=1,y=s||0;"progression"===r.circlesRotationVariationType.value&&(y=Math.round(u/(r.iterations.value-1)*100)/100),r.linkPointsIntervalRandomizationFactorToEase.value&&(x=n(u,r.pointsIntervalRandomizationEase.value,m,r.pointsIntervalRandomizationMinFactor.value,r.pointsIntervalRandomizationMaxFactor.value)),r.linkPointsHeightRandomizationFactorToEase.value&&(V=n(u,r.pointsHeightRandomizationEase.value,m,r.pointsHeightRandomizationMinFactor.value,r.pointsHeightRandomizationMaxFactor.value));for(let a=0;a<t;a++){let t=(r.randomizePointsInterval.value?p/2*(i?i[a]:0)*r.pointsIntervalRandomizationFactor.value*x:0)+(r.circlesRotationVariationType.value?360*y*r.circlesRotationVariationFactor.value:0),n=r.randomizePointsHeight.value?(l?l[a]:0)*e*r.pointsHeightRandomizationFactor.value*V:0,o=h+(e+n)*Math.cos((a*p+t)*Math.PI/180),s=d+(e+n)*Math.sin((a*p+t)*Math.PI/180);v.push({x:o,y:s,angle:a*p})}return v.forEach(((e,t)=>{let a=t>0?v[t-1]:v[v.length-1],i=t<v.length-1?v[t+1]:v[0];g.push(o(a,e,i,r.smoothness.value))})),g}(t,l[i],e.pointsIntervalRandomizationSeed.value[i],e.pointsHeightRandomizationSeed.value[i],e.circlesRotationRandomizationSeed.value[i],i,e);a.ctx.beginPath(),r.forEach(((t,i)=>{if(0===i&&a.ctx.moveTo(t.x,t.y),0===e.smoothness.value)a.ctx.lineTo(t.x,t.y);else if(i>0){let e=r[i-1].cpr,n=t.cpl;a.ctx.bezierCurveTo(e.x,e.y,n.x,n.y,t.x,t.y)}})),e.smoothness.value>0?a.ctx.bezierCurveTo(r[r.length-1].cpr.x,r[r.length-1].cpr.y,r[0].cpl.x,r[0].cpl.y,r[0].x,r[0].y):a.ctx.closePath(),a.ctx.stroke()}))};let u;const r=function(e){let t=u[e];t.inputValue&&(t.value=t.inputValue)};u={resolution:{group:"downloadImage",label:"resolution",type:"number",initial:window.innerHeight,min:1,max:6e3,get value(){return this.computedValue},set value(e){let t=Math.max(Math.min(e,this.max),this.min);this.computedValue=this.inputValue=a.canvas.width=a.canvas.height=t,r("biggestCircleScale"),r("strokeWidth")}},biggestCircleScale:{type:"range",initial:.75,min:0,max:2,step:.001,stepValues:[.25,1/3,.5,2/3,.75,1],get value(){return this.computedValue},set value(e){let t=this.inputValue=Math.max(Math.min(e,this.max),this.min);this.computedValue=t*u.resolution.value,r("smallestCircleScale")}},smallestCircleScale:{type:"range",initial:.4,min:0,max:1,step:.001,stepValues:[.25,1/3,.5,2/3,.75],get value(){return this.computedValue},set value(e){let t=this.inputValue=Math.max(Math.min(e,this.max),this.min);this.computedValue=t*u.biggestCircleScale.value}},originRotate:{group:"origin",type:"range",label:"rotate",initial:60,min:0,max:360,step:.001,stepValues:[45,90,135,180,225,270,315],get value(){return this.computedValue},set value(e){this.computedValue=this.inputValue=Math.max(Math.min(e,this.max),this.min)}},distanceFromCenter:{group:"origin",type:"range",label:"distanceFromCenter",initial:1,min:0,max:1,step:.001,get value(){return this.computedValue},set value(e){this.computedValue=this.inputValue=Math.max(Math.min(e,this.max),this.min)}},iterations:{type:"number",initial:20,min:1,step:1,get value(){return this.computedValue},set value(e){this.computedValue=this.inputValue=Math.max(e,this.min)}},circleSpacingEase:{group:"circleSpacing",label:"ease",type:"range",initial:.5,min:0,max:1,step:.001,stepValues:[.5],get value(){return this.computedValue},set value(e){let t=Math.max(Math.min(e,this.max),this.min);this.inputValue=t,t=t<.5?-1*(1+(.5-t)/.5*9):1+(t-.5)/.5*9,this.computedValue=t}},pointsPerCircle:{group:"pointsPerCircle",type:"number",initial:20,min:4,step:1,get value(){return this.computedValue},set value(e){this.computedValue=this.inputValue=Math.max(e,this.min)}},adaptativePointsPerCircle:{group:"pointsPerCircle",label:"adaptative",type:"select",listOfValues:[{value:!0,text:"true"},{value:!1,text:"false",selected:!0}],initial:!1,get value(){return this.computedValue},set value(e){let t;try{t=JSON.parse(e)}catch{t=e}this.computedValue=this.inputValue=t}},smoothness:{type:"range",initial:0,min:0,max:1,step:.001,get value(){return this.computedValue},set value(e){this.computedValue=this.inputValue=Math.max(Math.min(e,this.max),this.min)}},randomizePointsInterval:{group:"randomizePointsInterval",type:"select",listOfValues:[{value:!0,text:"true"},{value:!1,text:"false",selected:!0}],disableInputsForValue:{false:"*"},initial:!1,get value(){return this.computedValue},set value(e){let t;try{t=JSON.parse(e)}catch{t=e}this.computedValue=this.inputValue=t}},pointsIntervalRandomizationFactor:{group:"randomizePointsInterval",type:"range",label:"randomizationFactor",initial:1,min:0,max:1,step:.001,get value(){return this.computedValue},set value(e){this.computedValue=this.inputValue=Math.max(Math.min(e,this.max),this.min)}},pointsIntervalRandomizationSeed:{group:"randomizePointsInterval",type:"button",text:"seed",initial:!1,get value(){return this.computedValue},set value(e){this.computedValue=e},onClick:function(){requestAnimationFrame((()=>{s(u,{pointsInterval:!0})}))}},linkPointsIntervalRandomizationFactorToEase:{group:"randomizePointsInterval",type:"select",label:"linkToEase",listOfValues:[{value:!0,text:"true"},{value:!1,text:"false",selected:!0}],disableInputsForValue:{false:["pointsIntervalRandomizationEase","pointsIntervalRandomizationMinFactor","pointsIntervalRandomizationMaxFactor"]},initial:!1,get value(){return this.computedValue},set value(e){let t;try{t=JSON.parse(e)}catch{t=e}this.computedValue=this.inputValue=t}},pointsIntervalRandomizationEase:{group:"randomizePointsInterval",label:"ease",type:"range",initial:.5,min:0,max:1,step:.001,stepValues:[.5],get value(){return this.computedValue},set value(e){let t=Math.max(Math.min(e,this.max),this.min);this.inputValue=t,t=t<.5?-1*(1+(.5-t)/.5*9):1+(t-.5)/.5*9,this.computedValue=t}},pointsIntervalRandomizationMinFactor:{group:"randomizePointsInterval",type:"range",label:"from",initial:0,min:0,max:1,step:.001,get value(){return this.computedValue},set value(e){this.computedValue=this.inputValue=Math.max(Math.min(e,this.max),this.min)}},pointsIntervalRandomizationMaxFactor:{group:"randomizePointsInterval",type:"range",label:"to",initial:1,min:0,max:1,step:.001,get value(){return this.computedValue},set value(e){this.computedValue=this.inputValue=Math.max(Math.min(e,this.max),this.min)}},randomizePointsHeight:{group:"randomizePointsHeight",type:"select",listOfValues:[{value:!0,text:"true"},{value:!1,text:"false",selected:!0}],disableInputsForValue:{false:"*"},initial:!1,get value(){return this.computedValue},set value(e){let t;try{t=JSON.parse(e)}catch{t=e}this.computedValue=this.inputValue=t}},pointsHeightRandomizationFactor:{group:"randomizePointsHeight",type:"range",label:"randomizationFactor",initial:1,min:0,max:1,step:.001,get value(){return this.computedValue},set value(e){this.computedValue=this.inputValue=Math.max(Math.min(e,this.max),this.min)}},pointsHeightRandomizationSeed:{group:"randomizePointsHeight",type:"button",text:"seed",initial:!1,get value(){return this.computedValue},set value(e){this.computedValue=e},onClick:function(){requestAnimationFrame((()=>{s(u,{pointsHeight:!0})}))}},linkPointsHeightRandomizationFactorToEase:{group:"randomizePointsHeight",type:"select",label:"linkToEase",listOfValues:[{value:!0,text:"true"},{value:!1,text:"false",selected:!0}],disableInputsForValue:{false:["pointsHeightRandomizationEase","pointsHeightRandomizationMinFactor","pointsHeightRandomizationMaxFactor"]},initial:!1,get value(){return this.computedValue},set value(e){let t;try{t=JSON.parse(e)}catch{t=e}this.computedValue=this.inputValue=t}},pointsHeightRandomizationEase:{group:"randomizePointsHeight",label:"ease",type:"range",initial:.5,min:0,max:1,step:.001,stepValues:[.5],get value(){return this.computedValue},set value(e){let t=Math.max(Math.min(e,this.max),this.min);this.inputValue=t,t=t<.5?-1*(1+(.5-t)/.5*9):1+(t-.5)/.5*9,this.computedValue=t}},pointsHeightRandomizationMinFactor:{group:"randomizePointsHeight",type:"range",label:"from",initial:0,min:0,max:1,step:.001,get value(){return this.computedValue},set value(e){this.computedValue=this.inputValue=Math.max(Math.min(e,this.max),this.min)}},pointsHeightRandomizationMaxFactor:{group:"randomizePointsHeight",type:"range",label:"to",initial:1,min:0,max:1,step:.001,get value(){return this.computedValue},set value(e){this.computedValue=this.inputValue=Math.max(Math.min(e,this.max),this.min)}},circlesRotationVariationType:{group:"circlesRotationVariation",label:"type",type:"select",listOfValues:[{value:!1,text:"none",selected:!0},{value:"randomization",text:"randomization"},{value:"progression",text:"progression"}],disableInputsForValue:{false:"*",progression:["circlesRotationRandomizationSeed"]},initial:!1,get value(){return this.computedValue},set value(e){let t;try{t=JSON.parse(e)}catch{t=e}this.computedValue=this.inputValue=t,t&&requestAnimationFrame((()=>{s(u,{circlesRotation:!0})}))}},circlesRotationVariationFactor:{group:"circlesRotationVariation",type:"range",label:"variationFactor",initial:.5,min:0,max:1,step:.001,get value(){return this.computedValue},set value(e){this.computedValue=this.inputValue=Math.max(Math.min(e,this.max),this.min)}},circlesRotationRandomizationSeed:{group:"circlesRotationVariation",type:"button",text:"seed",initial:!1,get value(){return this.computedValue},set value(e){this.computedValue=e},onClick:function(){requestAnimationFrame((()=>{s(u,{circlesRotation:!0})}))}},strokeWidth:{group:"strokeWidth",type:"number",initial:2,max:100,min:0,step:.001,get value(){return this.computedValue},set value(e){let t=this.inputValue=Math.max(Math.min(e,this.max),this.min);this.computedValue=u.resolution.value*t/2048}},linkStrokeWidthToEase:{group:"strokeWidth",type:"select",label:"linkToEase",listOfValues:[{value:!0,text:"true"},{value:!1,text:"false",selected:!0}],disableInputsForValue:{false:["strokeWidthEase","strokeWidthMinFactor","strokeWidthMaxFactor"]},initial:!1,get value(){return this.computedValue},set value(e){let t;try{t=JSON.parse(e)}catch{t=e}this.computedValue=this.inputValue=t}},strokeWidthEase:{group:"strokeWidth",label:"ease",type:"range",initial:.5,min:0,max:1,step:.001,stepValues:[.5],get value(){return this.computedValue},set value(e){let t=Math.max(Math.min(e,this.max),this.min);this.inputValue=t,t=t<.5?-1*(1+(.5-t)/.5*9):1+(t-.5)/.5*9,this.computedValue=t}},strokeWidthMinFactor:{group:"strokeWidth",type:"range",label:"from",initial:0,min:0,max:1,step:.001,get value(){return this.computedValue},set value(e){this.computedValue=this.inputValue=Math.max(Math.min(e,this.max),this.min)}},strokeWidthMaxFactor:{group:"strokeWidth",type:"range",label:"to",initial:1,min:0,max:1,step:.001,get value(){return this.computedValue},set value(e){this.computedValue=this.inputValue=Math.max(Math.min(e,this.max),this.min)}},clipCircles:{type:"select",label:"type",listOfValues:[{value:"in",text:"in"},{value:"out",text:"out"},{value:!1,text:"none",selected:!0}],initial:!1,get value(){return this.computedValue},set value(e){let t;try{t=JSON.parse(e)}catch{t=e}this.computedValue=this.inputValue=t}},alphaBackground:{type:"select",listOfValues:[{value:!0,text:"true"},{value:!1,text:"false",selected:!0}],initial:!1,get value(){return this.computedValue},set value(e){let t;try{t=JSON.parse(e)}catch{t=e}this.computedValue=this.inputValue=t}},downloadImage:{group:"downloadImage",type:"button",text:"download",onClick:function(){a.canvas.toBlob((e=>{let t=document.createElement("a");t.href=URL.createObjectURL(e),t.setAttribute("download",""),t.click(),URL.revokeObjectURL(t.href)}),"image/png")}}};const p=function(e){let t=[0],a="";return Array.from(e).forEach(((e,a)=>{e.toUpperCase()===e&&t.push(a)})),t.forEach(((i,n)=>{a+="<span>"+e.slice(i,t[n+1])+"</span>"})),a};let m=null,c=!1;document.addEventListener("keydown",(e=>{c||(m=e.key,c=!0)})),document.addEventListener("keyup",(()=>{m=null,c=!1}));const h=function(e,t){const a=e[t],i=a.group;if(a.hasOwnProperty("group")){const t=document.querySelectorAll("."+i+" select"),a={};t.forEach((t=>{const n=e[t.getAttribute("data-var")];if(n.hasOwnProperty("disableInputsForValue")){const e=n.value.toString();document.querySelectorAll("."+i+" [data-var]:not([data-var='"+n.paramName+"'])").forEach((t=>{let i=t.getAttribute("data-var"),l=!0;n.disableInputsForValue.hasOwnProperty(e)&&(n.disableInputsForValue[e].includes(i)||"*"===n.disableInputsForValue[e])&&(l=!1),a[i]=a.hasOwnProperty(i)?a[i]&&l:l}))}}));for(let e in a){const t=document.querySelector("[data-var='"+e+"']");if(t.disabled=!a[e],!t.parentElement.classList.contains(i)){const i=t.parentElement.querySelector("legend");i&&(a[e]?i.classList.remove("disabled"):i.classList.add("disabled"))}}}},d=function(e){const t=e.target;let a,i=t.getAttribute("data-var"),n=u[i],l=t.value;if("range"===t.type&&n.hasOwnProperty("stepValues")&&"Control"!==m){let e=10*(l+Math.abs(t.min))/(t.max+Math.abs(t.min)),a=!1,i=0;for(;i<n.stepValues.length&&!a;){let l=10*(n.stepValues[i]+Math.abs(t.min))/(t.max+Math.abs(t.min));e>l-.022&&e<l+.022&&(n.value=t.value=n.stepValues[i],a=!0),i++}a||(n.value=l)}else n.value=l;h(u,i),"pointsPerCircle"===i||"adaptativePointsPerCircle"===i||("circleSpacingEase"===i||"smallestCircleScale"===i)&&u.adaptativePointsPerCircle.value?a={pointsInterval:!0,pointsHeight:!0}:"iterations"===i&&(a={pointsInterval:!0,pointsHeight:!0,circlesRotation:!0}),requestAnimationFrame((()=>{s(u,a)}))};let v=document.createElement("input");v.type="number",v.style.fontSize="1.9vh",document.documentElement.append(v);const g=v.offsetHeight;v.remove(),document.body.style.setProperty("--number-input-height",g+"px"),v.type="range",v.style.removeProperty("font-size"),document.documentElement.append(v);const x=v.offsetHeight;v.remove(),document.body.style.setProperty("--range-input-height",x+"px"),function(e){for(let t in e){let i,n,l=e[t];if(l.paramName=t,l.hasOwnProperty("initial")&&(l.value=l.initial),l.hasOwnProperty("group")){let e=document.querySelector("."+l.group);if(e)i=e;else{i=document.createElement("fieldset"),i.classList.add(l.group);let e=document.createElement("legend");e.innerHTML=p(l.group),i.append(e)}}else{i=document.createElement("fieldset");let e=document.createElement("legend");e.innerHTML=p(t),i.append(e)}if("button"===l.type)n=document.createElement("button"),n.innerHTML=l.text,n.addEventListener("click",l.onClick),n.setAttribute("data-var",t);else if("select"===l.type)n=document.createElement("select"),l.listOfValues.forEach((e=>{n.innerHTML+=`<option ${e.hasOwnProperty("selected")&&e.selected?"selected":""} value="${e.value}">${e.text}</option>`})),n.addEventListener("input",d),n.setAttribute("data-var",t);else{n=document.createElement("input"),n.type=l.type,l.hasOwnProperty("step")&&(n.step=l.step),l.hasOwnProperty("min")&&(n.min=l.min),l.hasOwnProperty("max")&&(n.max=l.max),n.value=l.inputValue,n.addEventListener("input",d),n.setAttribute("data-var",t);let e=document.createElement("div");e.classList.add("input-container"),"range"===n.type?e.classList.add("range"):"number"===n.type&&e.classList.add("number"),e.append(n),n=e}if(l.hasOwnProperty("label")){let e=document.createElement("fieldset"),t=document.createElement("legend");t.innerHTML=p(l.label),e.append(t),e.append(n),n=e}i.append(n),a.paramsWindow.append(i)}for(let t in e)h(e,t)}(u),requestAnimationFrame((()=>{s(u)}));
//# sourceMappingURL=index.e8378d63.js.map