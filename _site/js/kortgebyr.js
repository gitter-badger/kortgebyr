function $(a){return document.getElementById(a)}function C(a){return document.getElementsByClassName(a)}function getInt(a){var b=$(a),c=b.value.trim();return!isNaN(parseFloat(c))&&isFinite(c)&&parseFloat(c)==parseInt(c,10)?($(a).style.background=color_good,parseInt(c,10)):($(a).style.background=color_error,null)}function setInt(a,b){$(a).value=parseInt(b,10),$(a).style.background=color_good}function mkcurregex(){var a,b=[];for(a in currency_map)b.push(currency_map[a]);for(a in currency_value)b.push(a);return RegExp("^ *([0-9][0-9., ]*)("+b.join("|")+")? *$","i")}function _getCurrency(a){var b=a.match(curregex);if(null===b)return null;var c=b[2]?b[2]:currency_map[gccode];if(c.toLowerCase()===currency_map[gccode].toLowerCase())c=gccode;else for(var d in currency_map)if(currency_map[d].toLowerCase()===c.toLowerCase()||d.toLowerCase()===c.toLowerCase()){c=d;break}return new Currency(parseFloat(b[1].replace(".","").replace(",",".")),c)}function getCurrency(a){var b=_getCurrency($(a).value);return null===b?($(k).style.background=color_error,null):($(a).style.background=color_good,b)}function changeCurrency(a){set_ccode(a.value),build()}function setCurrency(a,b){$(a).value=b.represent(),$(a).style.background=color_good}function getOption(a,b){return $(a).options[$(a).selectedIndex].id.substr(b.length)}function setOption(a,b){$(b+a).selected=!0}function getPercent(a){var b=$(a),c=b.value.replace("%","").replace(",",".").trim();return!isNaN(parseFloat(c))&&isFinite(c)?($(a).style.background=color_good,parseFloat(c)):($(a).style.background=color_error,null)}function setPercent(a,b){$(a).value=(parseFloat(b)+"%").replace(".",","),$(a).style.background=color_good}function getBool(a){return $(a).checked?!0:!1}function setBool(a,b){"number"==typeof b&&(b=b&&1),$(a).checked=b?!0:!1}function rnf(a){return"function"==typeof a?a():a}function init_acqs(){var a='<option id="acq_auto" value="0">Automatisk</option>',b=0;for(var c in acqs)acqs.hasOwnProperty(c)&&"nets"!==c&&(b++,a+='<option id="acq_'+c+'" value="'+b+'">'+acqs[c].name+"</option>",default_acquirer_fees[c]={},default_acquirer_fees[c].fee_fixed=acqs[c].fee_fixed,default_acquirer_fees[c].fee_variable=acqs[c].fee_variable,default_acquirer_fees[c].fee_monthly=acqs[c].fee_monthly,default_acquirer_fees[c].fee_setup=acqs[c].fee_setup);opts.acquirer_opts.dirty_bits=2*b,$("acquirer").innerHTML=a}function init_defaults(){for(var a in opts)opts[a].def&&opts[a].set(rnf(opts[a].def))}function price_total(a,b,c){return a.trans.scale(b).add(a.monthly).add(a.setup.scale(c/12))}function intersect(a,b){for(var c=[],d=0;d<a.length;d++)-1!==b.indexOf(a[d])&&c.push(a[d]);return c}function build(a){"init"==a&&(init_acqs(),init_defaults(),init_dirty_bits(),load_url(location.search));var b,c=0,d={};for(b in opts)d[b]=rnf(opts[b].get());for(b in sopts)d[b]=rnf(sopts[b].get());"init"==a&&(prevstate=d);for(b in d)null===d[b]&&(d[b]=prevstate[b]);var e=d.acquirer;d.acquirer!=prevstate.acquirer?setAcquirerPanel():"auto"!=e&&(acqs[e].fee_fixed=d.acquirer_fixed,acqs[e].fee_variable=d.acquirer_variable,acqs[e].fee_monthly=d.acquirer_monthly,acqs[e].fee_setup=d.acquirer_setup);var f=new Options(d.transactions,d.average_value,d.fraud_fighter,d.visasecure,d.recurring,d.multiacquirer,d.mobilepay),g=$("data");g.innerHTML="";var h=[],i=0,j='<p class="tooltip"><img src="/img/tooltip.gif"><span>',k="</span></p>";for(b in psps){var l=d.dankort,m=d.visa_mastercard,n=(d.forbrugsforeningen,d.diners_amex_jcb,d.mobilepay,d.paii,!1);if(!(l&&(psps[b].cards.indexOf("dankort")<0||psps[b].acquirers.indexOf("nets")<0&&!psps[b].is_acquirer)||!l&&!m||m&&1==psps[b].cards.length&&"dankort"==psps[b].cards[0]||psps[b].is_acquirer&&"auto"!=e)){var o=e,p=f,q=.18,r=.82;if(l||(q=1,r=0),m||(q=0,r=1,p.visasecure=!1),"yourpay"===b&&(q=1,r=0),"auto"==o){var s=null;for(var t in acqs)if("nets"!=t&&!(psps[b].acquirers.indexOf(t)<0))if(null!==s){var u=acqs[t].costfn(p);price_total(s,q,d.setup_loss).dkk()>price_total(u,q,d.setup_loss).dkk()&&(o=t,s=u)}else o=t,s=acqs[t].costfn(p)}if(!(m&&psps[b].acquirers.indexOf(o)<0)||psps[b].is_acquirer){var v=psps[b].costfn(p);if(null!==v){var w={},x={},y={},z={},A=[],B=[];if(w[psps[b].name]=v.setup,x[psps[b].name]=v.monthly,y[psps[b].name]=price_total(v,psps[b].is_acquirer?q:1,d.setup_loss),l&&psps[b].acquirers.indexOf("nets")>=0){var C=acqs.nets.costfn(p),D="nets ("+100*r+"% tr.)";w.nets=C.setup,x.nets=C.monthly,y[D]=price_total(C,r,d.setup_loss),B.push("nets"),A.push("dankort")}if(!psps[b].is_acquirer&&m){var E=acqs[o].costfn(p),F=acqs[o].name+" ("+100*q+"% tr.)";w[acqs[o].name]=E.setup,x[acqs[o].name]=E.monthly,y[F]=price_total(E,q,d.setup_loss),A=A.concat(intersect(psps[b].cards,acqs[o].cards)),B.push(o)}else m&&(A=A.concat(psps[b].cards));for(var G in y)z[G]=y[G].scale(1/d.transactions);var H=[],I=new Currency(0,"DKK"),J=[],K=new Currency(0,"DKK"),L=[],M=new Currency(0,"DKK"),N=[],O=new Currency(0,"DKK");for(var G in w)H.push(G+": "+w[G].print()),I=I.add(w[G]);for(var G in x)J.push(G+": "+x[G].print()),K=K.add(x[G]);for(var G in y)L.push(G+": "+y[G].print()),M=M.add(y[G]);for(var G in z)N.push(G+": "+z[G].print()),O=O.add(z[G]);var P="";for(var G in A){var Q=cards[A[G]].logo,R=cards[A[G]].name;P+='<img src="/img/cards/'+Q+'" alt="'+R+'" title="'+R+'" />'}var S=[];for(var G in B){var Q=acqs[B[G]].logo,R=acqs[B[G]].name;S.push('<img src="/img/acquirer/'+Q+'" alt="'+R+'" title="'+R+'" />')}if(S=S.join(""),0===S.length)var S="&nbsp;";var T;if(n)for(T=i;T<h.length&&!(M.dkk()<h[T]);++T);else{for(T=0;i>T&&!(M.dkk()<h[T]);++T);i++}h.splice(T,0,M.dkk());var U=g.insertRow(T),V=U.insertCell(0),W=U.insertCell(1),X=U.insertCell(2),Y=U.insertCell(3),Z=U.insertCell(4),_=U.insertCell(5),ab=U.insertCell(6);V.innerHTML='<a target="_blank" href='+psps[b].link+'><img src="/img/psp/'+psps[b].logo+'" alt="'+psps[b].name+'" title="'+psps[b].name+'" />'+psps[b].name+"</a>",W.innerHTML=S,X.innerHTML=P,Y.innerHTML=I.print()+j+H.join("<br />")+k,Z.innerHTML=K.print()+j+J.join("<br />")+k,_.innerHTML=M.print()+j+L.join("<br />")+k,ab.innerHTML=O.print()+j+N.join("<br />")+k,c++}}}}prevstate=d,"init"!==a&&save_url()}function base64_encode(a){if(0>a)return"";var b="",c=a;do b=base64_chars[c%64]+b,c=Math.floor(c/64);while(0!==c);return b}function init_dirty_bits(){var a=0;for(var b in opts)opts[b].dirty_bits&&!opts[b].inactive&&(a+=opts[b].dirty_bits);opts.dirty_bits.bits=a}function save_url(){var a,b="",c=0,d=0,e=0,f=0;for(var g in opts)opts[g].inactive||opts[g].dirty_bits||(a=g);e=opts.dirty_bits.get("url");for(var g in opts){var h=opts[g],i=0;if(h.dirty_bits&&(i=get_bit_range(e,f,f+h.dirty_bits-1,opts.dirty_bits.bits),f+=h.dirty_bits),!(h.inactive===!0||h.dirty_bits&&0===i))if("bits"===h.type){var j=h.get("url"),k=h.bits;do{var l=Math.min(c+k-1,5);d+=j>>>Math.max(k-(1+l-c),0)<<5-l,k-=1+l-c,j&=MAX_INT32>>>31-k,5===l||g===a?(b+=base64_chars.charAt(d),c=0,d=0):c+=l-c+1}while(k>0)}else if(d>0&&(b+=base64_chars.charAt(d),c=0,d=0),"string"===h.type)b+=";"+h.get("url");else if("currency"===h.type){var m=h.get("url").amounts;for(var n in m)b+=";"+m[n]+n}}history.replaceState({foo:"bar"},"","?"+b)}function get_bit_range(a,b,c,d){return(a&MAX_INT32>>>31-d+b)>>>d-1-c}function load_url(a){if(a=a.replace("?",""),""!==a){var b,c=0,d=0,e=0,f=0;for(var g in opts){var h=opts[g],i=0;if(h.inactive!==!0&&(!h.dirty_bits||(b=get_bit_range(e,f,f+h.dirty_bits-1,opts.dirty_bits.bits),f+=h.dirty_bits,0!==b)))if("bits"===h.type){for(var j=h.bits;;){if(c>a.length-1)return;var k=a.charAt(c);if(";"===k)break;var l=base64_chars.indexOf(k);if(-1===l)return;var m=d+j-1;if(m>5&&(m=5),j-=1+m-d,i+=get_bit_range(l,d,m,6)<<j,!(j>0)){d=m+1,d>5&&(d=0,c++);break}d=0,c++}h.set(i),"dirty_bits"===g&&(e=i)}else{d>0&&(d=0,c++),";"===a.charAt(c)&&c++;var n=a.indexOf(";",c);-1===n&&(n=a.length);var o=a.substring(c,n);c+=o.length,"string"===h.type?"acquirer_opts"===g?opts[g].set(o,e):opts[g].set(o):"currency"===h.type&&opts[g].set(_getCurrency(o))}}setAcquirerPanel()}}function setAcquirerPanel(){var a=opts.acquirer.get();"auto"!==a?(C("acquirer_description")[0].style.display="none",C("acquirer_options")[0].style.display="block",sopts.acquirer_fixed.set(acqs[a].fee_fixed),sopts.acquirer_variable.set(acqs[a].fee_variable),sopts.acquirer_setup.set(acqs[a].fee_setup),sopts.acquirer_monthly.set(acqs[a].fee_monthly)):(C("acquirer_description")[0].style.display="block",C("acquirer_options")[0].style.display="none")}var default_acquirer_fees={},default_currency="DKK",default_transactions=250,default_amount=500,color_error="#f88",color_good=null,curregex=mkcurregex(),opts={acquirer:{type:"bits",bits:4,get:function(a){return"url"===a?parseInt($("acquirer")[$("acquirer").selectedIndex].value):getOption("acquirer","acq_")},set:function(a){if("number"!=typeof a)setOption(a,"acq_");else for(var b=0;b<$("acquirer").length;b++)parseInt($("acquirer")[b].value)===a&&($("acquirer")[b].selected=!0)},def:"auto"},visasecure:{type:"bits",bits:1,get:function(){return+getBool("visasecure")},set:function(a){setBool("visasecure",a)},def:!0},fraud_fighter:{type:"bits",bits:1,get:function(){return+getBool("fraud_fighter")},set:function(a){setBool("fraud_fighter",a)},def:!1},recurring:{type:"bits",bits:1,get:function(){return+getBool("recurring")},set:function(a){setBool("recurring",a)},def:!1},multiacquirer:{type:"bits",bits:1,get:function(){return+getBool("multiacquirer")},set:function(a){setBool("multiacquirer",a)},def:!1},dankort:{type:"bits",bits:1,get:function(){return+getBool("dankort")},set:function(a){setBool("dankort",a)},def:!0},visa_mastercard:{type:"bits",bits:1,get:function(){return+getBool("visa_mastercard")},set:function(a){setBool("visa_mastercard",a)},def:!0},mobilepay:{type:"bits",bits:1,get:function(){return+getBool("mobilepay")},set:function(a){setBool("mobilepay",a)},def:!1},dirty_bits:{type:"bits",bits:0,get:function(){var a=0;for(var b in opts)opts.hasOwnProperty(b)&&opts[b].dirty_bits&&(a=(a<<opts[b].dirty_bits)+opts[b].get_dirty_bits());return a},set:function(){},def:""},currency:{type:"string",dirty_bits:1,get_dirty_bits:function(){return+(this.get()!==this.def)},get:function(){return get_ccode()},set:function(a){for(var b=$("currency").getElementsByTagName("select")[0],c=0;c<b.length;c++)if(b.options[c].value===a){b.selectedIndex=c;break}set_ccode(a)},def:"DKK"},transactions:{type:"string",dirty_bits:1,get_dirty_bits:function(){return+(this.get()!==this.def)},get:function(){return getInt("transactions")},set:function(a){setInt("transactions",a)},def:default_transactions},average_value:{type:"currency",dirty_bits:1,get_dirty_bits:function(){return+!this.get().is_equal_to(this.def)},get:function(){return getCurrency("average_value")},set:function(a){setCurrency("average_value",a)},def:new Currency(default_amount,default_currency)},acquirer_opts:{type:"string",dirty_bits:void 0,get_dirty_bits:function(){var a=0,b=0;for(var c in acqs)acqs.hasOwnProperty(c)&&"nets"!==c&&(a<<=1,acqs[c].fee_fixed.is_equal_to(default_acquirer_fees[c].fee_fixed)||(a+=1),a<<=1,acqs[c].fee_variable!==default_acquirer_fees[c].fee_variable&&(a+=1),b++);return a},get:function(){var a="";for(var b in acqs)if(acqs.hasOwnProperty(b)&&"nets"!==b){if(!acqs[b].fee_fixed.is_equal_to(default_acquirer_fees[b].fee_fixed)){var c=acqs[b].fee_fixed.amounts;for(var d in c)a+=c[d]+d+","}acqs[b].fee_variable!==default_acquirer_fees[b].fee_variable&&(a+=acqs[b].fee_variable+",")}return a.length>0&&(a=a.substring(0,a.length-1)),a},set:function(a,b){var c=0,d=0,e=a.split(",");for(var f in acqs)acqs.hasOwnProperty(f)&&"nets"!==f&&(get_bit_range(b,c,c,this.dirty_bits)&&(acqs[f].fee_fixed=_getCurrency(e[d]),d++),c++,get_bit_range(b,c,c,this.dirty_bits)&&(acqs[f].fee_variable=parseFloat(e[d].replace(",",".")),d++),c++)}},paii:{inactive:!0,type:"bits",bits:1,get:function(){return!1},set:function(){},def:!1},bitcoin:{inactive:!0,type:"bits",bits:1,get:function(){return!1},set:function(){},def:!1},setup_loss:{inactive:!0,type:"bits",bits:1,get:function(){return.16},set:function(){},def:.16}},sopts={acquirer_fixed:{get:function(){return getCurrency("acquirer_fixed")},set:function(a){setCurrency("acquirer_fixed",a)},def:function(){return acqs[opts.acquirer.get()].fee_fixed}},acquirer_variable:{get:function(){return getPercent("acquirer_variable")},set:function(a){setPercent("acquirer_variable",a)},def:function(){return acqs[opts.acquirer.get()].fee_variable}},acquirer_setup:{get:function(){return getCurrency("acquirer_setup")},set:function(a){setCurrency("acquirer_setup",a)},def:function(){return acqs[opts.acquirer.get()].fee_setup}},acquirer_monthly:{get:function(){return getCurrency("acquirer_monthly")},set:function(a){setCurrency("acquirer_monthly",a)},def:function(){return acqs[opts.acquirer.get()].fee_monthly}}},prevstate={};Object.size=function(a){var b,c=0;for(b in a)a.hasOwnProperty(b)&&c++;return c};var base64_chars="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/",MAX_INT32=2147483647;