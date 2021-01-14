(this["webpackJsonplfq-app"]=this["webpackJsonplfq-app"]||[]).push([[0],{421:function(t,e,n){},422:function(t,e,n){},423:function(t,e,n){},437:function(t,e,n){},438:function(t,e,n){},470:function(t,e){},724:function(t,e,n){},725:function(t,e,n){},727:function(t,e,n){"use strict";n.r(e);var a=n(7),i=n(0),r=n.n(i),c=n(13),s=n.n(c),o=(n(421),n(422),n(423),n(35));var u=n(200),l=Object(u.b)(new function(){return new Worker(n.p+"static/js/worker.223b8333.worker.js")}),p="SET_INPUT_SAMPLES",d="SET_INPUT_CONDITIONS",O="SET_INPUT_COMPARISONS",j="SET_VIEW_FIGURE_OPTIONS";function b(t,e){return{type:t,data:e}}var f=Object(o.b)(null,(function(t){return{onDataUpload:function(e){t(function(t){return function(e){new Response(t).arrayBuffer().then((function(t){return l.onDataUpload(Object(u.a)(t,[t]))})).then((function(){return l.getSamples()})).then((function(t){e(b(p,t))}))}}(e))}}}))((function(t){var e=t.onDataUpload;return Object(a.jsxs)("div",{children:[Object(a.jsxs)("label",{htmlFor:"dataUpload",children:["(1) Upload data to begin analysis:"," "]}),Object(a.jsx)("input",{type:"file",id:"dataUpload",name:"dataUpload",onInput:function(t){return e(t.target.files[0])}}),Object(a.jsx)("ul",{children:Object(a.jsx)("li",{children:"View log-transformed intensity distributions per sample as violin plot or boxplot."})})]})})),h=n(22),m=n(18),g=n(118),x=n.n(g);n(437);x.a.setAppElement("#root");var v=Object(o.b)((function(t){return{samples:t.input.samples}}),(function(t){return{onReplicatesSelect:function(e){t(function(t){return function(e){l.onReplicatesSelect(t).then((function(){e(b(d,Object.keys(t)))}))}}(e))}}}))((function(t){var e=t.samples,n=t.onReplicatesSelect,i=r.a.useState(!1),c=Object(m.a)(i,2),s=c[0],o=c[1],u=r.a.useState([]),l=Object(m.a)(u,2),p=l[0],d=l[1],O=r.a.useState(""),j=Object(m.a)(O,2),b=j[0],f=j[1],g=r.a.useState({}),v=Object(m.a)(g,2),S=v[0],y=v[1];return Object(a.jsxs)("div",{children:[Object(a.jsx)("span",{children:"(2) "}),Object(a.jsx)("button",{onClick:function(){return o(!0)},children:"Select replicates"}),Object(a.jsx)("ul",{children:Object(a.jsx)("li",{children:"View log-transformed intensity distributions per condition as violin plot or boxplot."})}),Object(a.jsxs)(x.a,{isOpen:s,id:"input-replicate-modal",style:{overlay:{zIndex:1e3}},children:[Object(a.jsx)("h1",{id:"input-replicate-modal-head",children:"Select replicates"}),Object(a.jsxs)("div",{id:"input-replicate-modal-left",children:[Object(a.jsx)("p",{children:"Samples present in data:"}),Object(a.jsx)("select",{multiple:!0,onChange:function(t){d(Array.from(t.target.selectedOptions).map((function(t){return t.value})))},children:e.map((function(t){return Object(a.jsx)("option",{value:t,children:t},t)}))})]}),Object(a.jsxs)("div",{children:[Object(a.jsx)("p",{children:"New condition wtih selected samples as replicates:"}),Object(a.jsx)("label",{htmlFor:"conditionName",children:"Condition name: "}),Object(a.jsx)("input",{type:"text",id:"conditionName",name:"conditionName",value:b,onChange:function(t){return f(t.target.value)}}),Object(a.jsx)("br",{}),Object(a.jsx)("button",{onClick:function(){0!==b.length&&(y(Object.assign({},S,Object(h.a)({},b,p))),f(""))},children:"Add condition"}),Object(a.jsx)("br",{}),Object(a.jsx)("hr",{style:{margin:"2rem"}}),Object(a.jsx)("button",{onClick:function(){return y({})},children:"Reset conditions"})]}),Object(a.jsxs)("div",{id:"input-replicate-modal-right",children:[Object(a.jsx)("p",{children:"Conditions and replicates:"}),Object(a.jsx)("div",{children:Object.entries(S).map((function(t){var e=Object(m.a)(t,2),n=e[0],i=e[1];return Object(a.jsxs)("p",{children:[n,": ",i.join(", ")]},n)}))})]}),Object(a.jsx)("div",{id:"input-replicate-modal-foot",children:Object(a.jsx)("button",{onClick:function(){n(S),o(!1)},children:"OK"})})]})]})}));n(438);x.a.setAppElement("#root");var S=Object(o.b)((function(t){return{conditions:t.input.conditions}}),(function(t){return{onComparisonSelect:function(e){var n=Array.from(e.keys()).reduce((function(t,n){return Object.assign(t,Object(h.a)({},n,Array.from(e.get(n))))}),{});t(function(t){return function(e){l.onComparisonsSelect(t).then((function(){e(b(O,t))}))}}(n))}}}))((function(t){var e=t.conditions,n=t.onComparisonSelect,i=r.a.useState(!1),c=Object(m.a)(i,2),s=c[0],o=c[1],u=new Map;return Object(a.jsxs)("div",{children:[Object(a.jsx)("span",{children:"(3) "}),Object(a.jsx)("button",{onClick:function(){return o(!0)},children:"Select comparisons"}),Object(a.jsxs)("ul",{children:[Object(a.jsx)("li",{children:"View enriched and depleted proteins per comparison as volcano plot."}),Object(a.jsx)("li",{children:"View distribution of p values and adjusted p values."}),Object(a.jsx)("li",{children:"View mean intensities, log fold changes, p values as data table."})]}),Object(a.jsxs)(x.a,{isOpen:s,id:"input-comparison-modal",style:{overlay:{zIndex:1e3}},children:[Object(a.jsx)("h1",{id:"input-comparison-modal-head",children:"Select comparisons"}),Object(a.jsx)("table",{children:Object(a.jsxs)("tbody",{children:[Object(a.jsxs)("tr",{children:[Object(a.jsx)("td",{}),e.map((function(t){return Object(a.jsx)("td",{children:t},"".concat(t," B"))}))]}),e.map((function(t){return Object(a.jsxs)("tr",{children:[Object(a.jsx)("td",{children:t},"".concat(t," A")),e.map((function(e){return Object(a.jsx)("td",{children:Object(a.jsx)("input",{type:"checkbox",onChange:function(n){return function(t,e,n){n?(u.has(t)||u.set(t,new Set),u.get(t).add(e)):u.has(t)&&u.get(t).has(e)&&u.get(t).delete(e)}(t,e,n.target.checked)},disabled:t===e})},"".concat(t,",").concat(e))}))]},"".concat(t," row"))}))]})}),Object(a.jsx)("div",{id:"input-comparison-modal-foot",children:Object(a.jsx)("button",{onClick:function(){n(u),o(!1)},children:"OK"})})]})]})}));var y=function(t){var e=t.id;return Object(a.jsxs)("div",{id:e,className:"input-container",children:[Object(a.jsx)(f,{}),Object(a.jsx)(v,{}),Object(a.jsx)(S,{})]})},N=n(32),M=n.n(N),_=n(75),I=n(396),T=n.n(I),w=n(31),A=n(181),E=n(79),P=n(397),k=n(398),C=n(98),L=n(400),R=n.n(L),U=n(80),D=n.n(U);function V(t){for(var e=t.map((function(t,e){return{index:e,p:t}})).sort((function(t,e){return t.p-e.p})),n=e.length-1;n>=0;n--)e[n].padj=Math.min(1,Math.min(e.length*e[n].p/(n+1),n<e.length-1?e[n+1].padj:1));return e.sort((function(t,e){return t.index-e.index})).map((function(t){return t.padj}))}var F=function(){function t(e,n){Object(P.a)(this,t),this.data=e,this.rawData=e,this.samples=n,this.snapshots=new Map,this.replicates=new Map,this.comparisons=new Map,this.removeContaminants=this.removeContaminants.bind(this),this.logTransform=this.logTransform.bind(this),this.removeAllNaN=this.removeAllNaN.bind(this),this.setReplicates=this.setReplicates.bind(this)}return Object(k.a)(t,[{key:"removeContaminants",value:function(){console.log("removing contaminants"),this.data=this.data.where((function(t){return!t["Potential contaminant"]&&!t.Reverse})).subset([].concat(Object(w.a)(t.COMMON_COLUMNS),Object(w.a)(this.samples.map((function(t){return"LFQ intensity ".concat(t)}))))).bake(),this.snapshots.set(t.SNAPSHOT_KEYS.REMOVE_CONTAMINANTS,this.data)}},{key:"logTransform",value:function(){var e=this;console.log("log transforming"),this.data=new C.a({columns:Object(E.a)(Object(E.a)({},t.COMMON_COLUMNS.reduce((function(t,n){return Object.assign(t,Object(h.a)({},n,e.data.getSeries(n)))}),{})),this.samples.reduce((function(t,n){return Object.assign(t,Object(h.a)({},"LFQ intensity ".concat(n),e.data.getSeries("LFQ intensity ".concat(n)).select((function(t){return t>0?Math.log2(t):NaN}))))}),{})),index:this.data.getIndex()}).bake(),this.snapshots.set(t.SNAPSHOT_KEYS.LOG_TRANSFORM,this.data)}},{key:"removeAllNaN",value:function(){var t=this;console.log("removing all NaN"),this.data=this.data.where((function(e){return!t.samples.every((function(t){return isNaN(e["LFQ intensity ".concat(t)])}))})).bake()}},{key:"normalizeMedians",value:function(){var e=this;console.log("normalizing medians");var n=new Map;this.samples.map((function(t){return n.set(t,e.data.getSeries("LFQ intensity ".concat(t)).where((function(t){return!Number.isNaN(t)})).median())}));var a=Math.max.apply(null,Array.from(n.values()));this.data=new C.a({columns:Object(E.a)(Object(E.a)({},t.COMMON_COLUMNS.reduce((function(t,n){return Object.assign(t,Object(h.a)({},n,e.data.getSeries(n)))}),{})),this.samples.reduce((function(t,i){return Object.assign(t,Object(h.a)({},"LFQ intensity ".concat(i),e.data.getSeries("LFQ intensity ".concat(i)).select((function(t){return t*a/n.get(i)}))))}),{})),index:this.data.getIndex()}).bake(),this.snapshots.set(t.SNAPSHOT_KEYS.MEDIAN_NORMALIZATION,this.data)}},{key:"setReplicates",value:function(t){this.replicates.clear();for(var e=0,n=Object.entries(t);e<n.length;e++){var a=Object(m.a)(n[e],2),i=a[0],r=a[1];this.replicates.set(i,r)}}},{key:"imputeMissingValues",value:function(){var e=this;console.log("imputing missing values"),this.data=new C.a({columns:Object(E.a)(Object(E.a)({},t.COMMON_COLUMNS.reduce((function(t,n){return Object.assign(t,Object(h.a)({},n,e.data.getSeries(n)))}),{})),this.samples.reduce((function(t,n){var a=e.data.getSeries("LFQ intensity ".concat(n)).where((function(t){return!Number.isNaN(t)})).bake(),i=a.average(),r=a.std();return t["LFQ intensity ".concat(n)]=e.data.getSeries("LFQ intensity ".concat(n)).select((function(t){return Number.isNaN(t)?R.a.uniform(i-3*r,i-2*r)():t})),t}),{})),index:this.data.getIndex()}).bake(),this.snapshots.set(t.SNAPSHOT_KEYS.IMPUTE_MISSING_VALUES,this.data)}},{key:"makeComparisons",value:function(e){var n=this;console.log("making comparisons");for(var a=function(){var e=Object(m.a)(r[i],2),a=e[0],c=e[1];n.comparisons.has(a)||n.comparisons.set(a,new Map);var s,o=Object(A.a)(c);try{var u=function(){var e=s.value,i=C.a.zip([a,e].map((function(t){return C.a.zip(n.replicates.get(t).map((function(t){return n.data.getSeries("LFQ intensity ".concat(t))})),(function(t){return t.toArray()}))})),(function(t){var n,i=Object(m.a)(t,2),r=i[0],c=i[1],s=D()(r).mean(),o=D()(c).mean(),u=function(t,e){var n=D()(t).mean(),a=D()(e).mean(),i=D()(t).stdev(!0),r=D()(e).stdev(!0),c=Math.sqrt(Math.pow(i,2)/t.length+Math.pow(r,2)/e.length),s=Math.floor(Math.pow(Math.pow(i,2)/t.length+Math.pow(r,2)/e.length,2)/(Math.pow(i,4)/(Math.pow(t.length,2)*(t.length-1))+Math.pow(r,4)/(Math.pow(e.length,2)*(e.length-1)))),o=(a-n)/c;return{t:o,p:2*D.a.studentt.cdf(-Math.abs(o),s),df:s}}(r,c).p;return n={},Object(h.a)(n,"mean ".concat(a),s),Object(h.a)(n,"mean ".concat(e),o),Object(h.a)(n,"log FC",o-s),Object(h.a)(n,"p value",u),n})).withSeries(t.COMMON_COLUMNS.reduce((function(t,e){return Object.assign(t,Object(h.a)({},e,n.data.getSeries(e)))}),{})).withIndex(n.data.getIndex()).bake().withSeries({"adjusted p value":function(t){return new C.b({index:t.getIndex(),values:V(t.getSeries("p value").toArray())})}}).bake();n.comparisons.get(a).set(e,i)};for(o.s();!(s=o.n()).done;)u()}catch(l){o.e(l)}finally{o.f()}},i=0,r=Object.entries(e);i<r.length;i++)a()}}]),t}();F.SNAPSHOT_KEYS={REMOVE_CONTAMINANTS:"REMOVE_CONTAMINANTS",LOG_TRANSFORM:"LOG_TRANSFORM",MEDIAN_NORMALIZATION:"MEDIAN_NORMALIZATION",IMPUTE_MISSING_VALUES:"IMPUTE_MISSING_VALUES"},F.COMMON_COLUMNS=["id","uniprotID","gene"];var Q=F,H={PRE_POST_IMPUTATION_VIOLIN:"PRE_POST_IMPUTATION_VIOLIN",PRE_POST_IMPUTATION_BOXPLOT:"PRE_POST_IMPUTATION_BOXPLOT",VOLCANO:"VOLCANO",P_VALUE_HISTOGRAM:"P_VALUE_HISTOGRAM"};function G(t){return K.apply(this,arguments)}function K(){return(K=Object(_.a)(M.a.mark((function t(e){var n,a;return M.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:n=e.type,a={data:[],layout:{}},t.t0=n,t.next=t.t0===H.PRE_POST_IMPUTATION_VIOLIN?5:t.t0===H.PRE_POST_IMPUTATION_BOXPLOT?9:t.t0===H.VOLCANO?13:t.t0===H.P_VALUE_HISTOGRAM?17:21;break;case 5:return t.next=7,Y(e);case 7:return a=t.sent,t.abrupt("break",21);case 9:return t.next=11,B(e);case 11:return a=t.sent,t.abrupt("break",21);case 13:return t.next=15,X(e);case 15:return a=t.sent,t.abrupt("break",21);case 17:return t.next=19,q(e);case 19:return a=t.sent,t.abrupt("break",21);case 21:return a.layout.autosize=!0,t.abrupt("return",a);case 23:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function Y(t){return z.apply(this,arguments)}function z(){return(z=Object(_.a)(M.a.mark((function t(e){var n,a,i,r,c;return M.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=e.samples,a=e.conditions,i=function(t){return Object.assign(t,{type:"violin",width:1,points:!1})},r={data:[],layout:{}},void 0==n||void 0!=a){t.next=11;break}return t.next=6,Promise.all([].concat(Object(w.a)(n.map((function(t){return l.getData("LFQ intensity ".concat(t),Q.SNAPSHOT_KEYS.MEDIAN_NORMALIZATION).then((function(e){return i({name:"pre",x:e,y0:t,legendgroup:"pre",side:"positive"})}))}))),Object(w.a)(n.map((function(t){return l.getData("LFQ intensity ".concat(t),Q.SNAPSHOT_KEYS.IMPUTE_MISSING_VALUES).then((function(e){return i({name:"post",x:e,y0:t,legendgroup:"post",side:"negative"})}))})))));case 6:t.t0=t.sent,t.t1={},r={data:t.t0,layout:t.t1},t.next=20;break;case 11:if(void 0!=n||void 0==a){t.next=20;break}return t.next=14,l.getReplicates();case 14:return c=t.sent,t.next=17,Promise.all([].concat(Object(w.a)(a.map((function(t){return Promise.all(c.get(t).map((function(t){return l.getData("LFQ intensity ".concat(t),Q.SNAPSHOT_KEYS.MEDIAN_NORMALIZATION)}))).then((function(t){return t.flat()})).then((function(e){return i({name:"pre",x:e,y0:t,legendgroup:"pre",side:"positive"})}))}))),Object(w.a)(a.map((function(t){return Promise.all(c.get(t).map((function(t){return l.getData("LFQ intensity ".concat(t),Q.SNAPSHOT_KEYS.IMPUTE_MISSING_VALUES)}))).then((function(t){return t.flat()})).then((function(e){return i({name:"post",x:e,y0:t,legendgroup:"post",side:"negative"})}))})))));case 17:t.t2=t.sent,t.t3={},r={data:t.t2,layout:t.t3};case 20:return Object.assign(r.layout,{title:"log2 intensities pre- and post-imputation",xaxis:{title:"log2 intensity"},yaxis:{automargin:!0}}),t.abrupt("return",r);case 22:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function B(t){return Z.apply(this,arguments)}function Z(){return(Z=Object(_.a)(M.a.mark((function t(e){var n,a,i,r,c;return M.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=e.samples,a=e.conditions,i=function(t){return Object.assign(t,{type:"box"})},r={data:[],layout:{}},void 0==n||void 0!=a){t.next=11;break}return t.next=6,Promise.all([].concat(Object(w.a)(n.map((function(t){return l.getData("LFQ intensity ".concat(t),Q.SNAPSHOT_KEYS.MEDIAN_NORMALIZATION).then((function(e){return i({name:"pre",y:e,x0:t,legendgroup:"pre"})}))}))),Object(w.a)(n.map((function(t){return l.getData("LFQ intensity ".concat(t),Q.SNAPSHOT_KEYS.IMPUTE_MISSING_VALUES).then((function(e){return i({name:"post",y:e,x0:t,legendgroup:"post"})}))})))));case 6:t.t0=t.sent,t.t1={},r={data:t.t0,layout:t.t1},t.next=20;break;case 11:if(void 0!=n||void 0==a){t.next=20;break}return t.next=14,l.getReplicates();case 14:return c=t.sent,t.next=17,Promise.all([].concat(Object(w.a)(a.map((function(t){return Promise.all(c.get(t).map((function(t){return l.getData("LFQ intensity ".concat(t),Q.SNAPSHOT_KEYS.MEDIAN_NORMALIZATION)}))).then((function(t){return t.flat()})).then((function(e){return i({name:"pre",y:e,x0:t,legendgroup:"pre"})}))}))),Object(w.a)(a.map((function(t){return Promise.all(c.get(t).map((function(t){return l.getData("LFQ intensity ".concat(t),Q.SNAPSHOT_KEYS.IMPUTE_MISSING_VALUES)}))).then((function(t){return t.flat()})).then((function(e){return i({name:"post",y:e,x0:t,legendgroup:"post"})}))})))));case 17:t.t2=t.sent,t.t3={},r={data:t.t2,layout:t.t3};case 20:return Object.assign(r.layout,{title:"log2 intensities pre- and post-imputation",xaxis:{automargin:!0},yaxis:{title:"log2 intensity"},boxmode:"group",boxgap:-1,boxgroupgap:0}),t.abrupt("return",r);case 22:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function X(t){return J.apply(this,arguments)}function J(){return(J=Object(_.a)(M.a.mark((function t(e){var n,a,i;return M.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=e.comparisons,a=e.highlightGenes,n){t.next=3;break}return t.abrupt("return",{data:[],layout:{}});case 3:return i=new Set((a||[]).map((function(t){return t.toLowerCase()}))),t.next=6,Promise.all([l.getComparisonData(n,"log FC"),l.getComparisonData(n,"adjusted p value"),l.getComparisonData(n,"gene")]).then((function(t){var e=Object(m.a)(t,3),n=e[0],a=e[1],r=e[2];return{type:"scattergl",mode:"markers",x:n,y:a.map((function(t){return-1*Math.log10(t)})),hovertext:r,marker:{color:r.map((function(t){return i.has(t.toLowerCase())?1:0}))}}}));case 6:return t.t0=t.sent,t.t1=[t.t0],t.t2={title:"".concat(n[1]," vs. ").concat(n[0]),xaxis:{title:"log2 (".concat(n[1]," / ").concat(n[0],")")},yaxis:{title:"-log10 (p_adjusted)"}},t.abrupt("return",{data:t.t1,layout:t.t2});case 10:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function q(t){return W.apply(this,arguments)}function W(){return(W=Object(_.a)(M.a.mark((function t(e){var n;return M.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=e.comparisons){t.next=3;break}return t.abrupt("return",{data:[],layout:{}});case 3:return t.next=5,l.getComparisonData(n,"p value");case 5:return t.t0=t.sent,t.t1={start:0,end:1,size:.025},t.t2={type:"histogram",name:"p value",x:t.t0,opacity:.5,xbins:t.t1},t.next=10,l.getComparisonData(n,"adjusted p value");case 10:return t.t3=t.sent,t.t4={start:0,end:1,size:.025},t.t5={type:"histogram",name:"adjusted p value",x:t.t3,opacity:.5,xbins:t.t4},t.t6=[t.t2,t.t5],t.t7={title:"".concat(n[1]," vs. ").concat(n[0]," p values"),barmode:"overlay",xaxis:{title:"p"},yaxis:{title:"count"}},t.abrupt("return",{data:t.t6,layout:t.t7});case 16:case"end":return t.stop()}}),t)})))).apply(this,arguments)}var $=Object(o.b)((function(t){return{figureOptions:t.view.figureOptions}}),null)((function(t){var e=t.id,n=t.figureOptions,i=r.a.useState({data:[],layout:{autosize:!0}}),c=Object(m.a)(i,2),s=c[0],o=c[1];return r.a.useEffect(Object(_.a)(M.a.mark((function t(){return M.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!n){t.next=6;break}return t.t0=o,t.next=4,G(n);case 4:t.t1=t.sent,(0,t.t0)(t.t1);case 6:case"end":return t.stop()}}),t)}))),[n]),s?Object(a.jsx)("div",{id:e,className:"main-container",children:Object(a.jsx)(T.a,{className:"main-plot",data:s.data,layout:s.layout,useResizeHandler:!0,style:{width:"100%",height:"100%"}})}):"loading..."})),tt=n(401),et=n.n(tt);var nt=Object(o.b)((function(t){return{figureOptions:t.view.figureOptions}}),null)((function(t){var e=t.id,n=(t.samples,t.figureOptions),i=r.a.useState(),c=Object(m.a)(i,2),s=c[0],o=c[1];return r.a.useEffect(Object(_.a)(M.a.mark((function t(){return M.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!n.comparisons){t.next=6;break}return t.t0=o,t.next=4,l.getComparisonsTable(n.comparisons);case 4:t.t1=t.sent,(0,t.t0)(t.t1);case 6:case"end":return t.stop()}}),t)}))),[n.comparisons]),Object(a.jsx)("div",{id:e,children:Object(a.jsx)(et.a,{title:n.comparisons?"".concat(n.comparisons[1]," vs. ").concat(n.comparisons[0]):"no data: make and select a comparison",data:s,columns:s?Object.keys(s[0]):[],options:{selectableRows:"none"}})})}));n(724);var at=Object(o.b)((function(t){return{samples:t.input.samples,conditions:t.input.conditions,comparisons:t.input.comparisons}}),null)((function(t){var e,n=t.samples,i=t.conditions,c=t.comparisons,s=t.figureType,o=t.onOptionsChange,u=r.a.useState("samples"),l=Object(m.a)(u,2),p=l[0],d=l[1];switch(s){case H.PRE_POST_IMPUTATION_VIOLIN:case H.PRE_POST_IMPUTATION_BOXPLOT:var O=function(t){d(t.currentTarget.value),o({samples:void 0,conditions:void 0})};e=Object(a.jsxs)(a.Fragment,{children:[Object(a.jsxs)("div",{children:[Object(a.jsx)("input",{type:"radio",id:"figureTypeSamples",name:"figureType",value:"samples",checked:"samples"===p,onChange:O}),Object(a.jsx)("label",{htmlFor:"figureTypeSamples",children:"Samples"}),Object(a.jsx)("br",{}),Object(a.jsx)("input",{type:"radio",id:"figureTypeConditions",name:"figureType",value:"conditions",checked:"conditions"===p,onChange:O}),Object(a.jsx)("label",{htmlFor:"figureTypeConditions",children:"Conditions"})]}),Object(a.jsx)("select",{multiple:!0,onChange:function(t){o(Object(h.a)({},p,Array.from(t.target.selectedOptions).map((function(t){return t.value}))))},children:{samples:n,conditions:i}[p].map((function(t){return Object(a.jsx)("option",{value:t,children:t},t)}))})]});break;case H.VOLCANO:case H.P_VALUE_HISTOGRAM:e=Object(a.jsxs)(a.Fragment,{children:[Object(a.jsx)("select",{multiple:!0,onChange:function(t){o({comparisons:JSON.parse(t.target.value)})},children:Object.entries(c||{}).map((function(t){var e=Object(m.a)(t,2),n=e[0];return e[1].map((function(t){return Object(a.jsxs)("option",{value:JSON.stringify([n,t]),children:[t," vs. ",n]},JSON.stringify([n,t]))}))})).flat()}),Object(a.jsx)("textarea",{onChange:function(t){return o({highlightGenes:t.target.value.split("\n").filter((function(t){return""!==t}))})}})]})}return Object(a.jsx)("div",{className:"figure-sample-condition-selector",children:e})}));n(725);var it=Object(o.b)(null,(function(t){return{onOptionsSet:function(e){t(b(j,e))},onDownloadClick:function(){t((function(t){l.downloadData().then((function(t){var e=new Blob([t],{type:"application/vnd.ms-excel"}),n=document.createElement("a");n.href=window.URL.createObjectURL(e),n.download="results.xlsx",n.click()}))}))}}}))((function(t){var e=t.id,n=t.onOptionsSet,i=t.onDownloadClick,c=r.a.useState({}),s=Object(m.a)(c,2),o=s[0],u=s[1];return Object(a.jsxs)("div",{id:e,className:"view-container",children:[Object(a.jsx)("p",{children:"Select data to view."}),Object(a.jsxs)("div",{className:"figure-options",children:[Object(a.jsx)("select",{onChange:function(t){u(Object.assign({},o,{type:t.target.value}))},defaultValue:"default",children:[Object(a.jsx)("option",{disabled:!0,value:"default",children:"-- select an option --"},"default")].concat(Object(w.a)(Object.keys(H).map((function(t){return Object(a.jsx)("option",{value:t,children:t},t)}))))}),Object(a.jsx)(at,{figureType:o.type,onOptionsChange:function(t){return u(Object.assign({},o,t))}}),Object(a.jsx)("button",{onClick:function(){return n(o)},children:"View data"}),Object(a.jsx)("button",{onClick:i,children:"Download data"})]})]})}));var rt=function(){return Object(a.jsxs)("div",{id:"app-container",children:[Object(a.jsx)(y,{id:"input-container"}),Object(a.jsx)(it,{id:"view-container"}),Object(a.jsx)(nt,{id:"sidepanel-container"}),Object(a.jsx)($,{id:"mainpanel-container"})]})},ct=n(86),st=n(405),ot={input:{samples:[],conditions:[]},view:{figureOptions:{}},side:{},main:{}};function ut(t,e){switch(e.type){case p:return Object.assign({},t,{samples:e.data});case d:return Object.assign({},t,{conditions:e.data});case O:return Object.assign({},t,{comparisons:e.data})}return t}function lt(t,e){switch(e.type){case j:return Object.assign({},t,{figureOptions:e.data})}return t}var pt="undefined"!==typeof window&&window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__||ct.c,dt=Object(ct.d)((function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:ot,e=arguments.length>1?arguments[1]:void 0,n=Object(E.a)({},t);switch(e.type){case p:case d:case O:n.input=ut(t.input,e);break;case j:n.view=lt(t.view,e)}return n}),pt(Object(ct.a)(st.a)));s.a.render(Object(a.jsx)(r.a.StrictMode,{children:Object(a.jsx)(o.a,{store:dt,children:Object(a.jsx)(rt,{})})}),document.getElementById("root"))}},[[727,1,2]]]);
//# sourceMappingURL=main.6aeffd07.chunk.js.map