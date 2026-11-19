(function(){
  if(window.__apmbsFix5)return;window.__apmbsFix5=true;

  function openNote(){
    var ov=document.getElementById('apmbsNoteOv');
    if(!ov){ov=document.createElement('div');ov.id='apmbsNoteOv';ov.style.cssText='position:fixed;inset:0;z-index:999998;background:#0f172a;display:flex';var f=document.createElement('iframe');f.id='apmbsNoteFrame';f.src='special-note.html?t='+Date.now();f.style.cssText='width:100%;height:100%;border:none';ov.appendChild(f);document.body.appendChild(ov);}
    ov.style.display='flex';
  }
  function closeNote(){var ov=document.getElementById('apmbsNoteOv');if(ov)ov.style.display='none';}

  window.addEventListener('message',function(e){
    if(!e.data)return;
    if(e.data.type==='APMBS_CLOSE_NOTE'){closeNote();return;}
    if(e.data.type==='APMBS_EXPORT_FILE'){
      var d=e.data,fr=document.getElementById('apmbsNoteFrame');
      function reply(m){if(fr&&fr.contentWindow)fr.contentWindow.postMessage({type:'APMBS_EXPORT_DONE',msg:m},'*');}
      try{
        if(window.AndroidBridge){
          if(d.mode==='share'&&window.AndroidBridge.shareFile){
            var res=window.AndroidBridge.shareFile(d.b64,d.filename,d.mime);
            reply(res||'✅ सेव व शेयर खुला: '+d.filename);return;
          }
          if(d.mode==='save'&&window.AndroidBridge.saveFile){
            var sp=window.AndroidBridge.saveFile(d.b64,d.filename,d.mime);
            reply('✅ सेव हुआ: '+(sp||'Download/APMBS_Notes/'+d.filename));return;
          }
        }
        var bin=atob(d.b64),arr=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);
        var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([arr],{type:d.mime}));a.download=d.filename;document.body.appendChild(a);a.click();a.remove();
        reply('✅ Downloads में सेव: '+d.filename);
      }catch(err){reply('त्रुटि: '+err.message);}
    }
  });

  function mainCanvas(){
    var cs=Array.from(document.querySelectorAll('canvas'));
    cs.sort(function(a,b){return (b.clientWidth*b.clientHeight)-(a.clientWidth*a.clientHeight);});
    return cs[0]||null;
  }
  var pScale=1,pDist=0,pStart=1;
  function applyTf(w){if(!w)return;var px=parseFloat(w.dataset.px||'0'),py=parseFloat(w.dataset.py||'0');w.style.transformOrigin='top center';w.style.transform='translate('+px+'px,'+py+'px) scale('+pScale.toFixed(3)+')';}
  function resetTf(){pScale=1;var c=mainCanvas();if(c&&c.parentElement){c.parentElement.dataset.px='0';c.parentElement.dataset.py='0';c.parentElement.style.transform='';}}
  function scrollFullPage(dx,dy){
    var c=mainCanvas(),p=c?c.parentElement:null,sc=false;
    while(p&&p!==document.body){var st=getComputedStyle(p);if((st.overflowY==='auto'||st.overflowY==='scroll'||st.overflowX==='auto'||st.overflowX==='scroll')&&(p.scrollHeight>p.clientHeight+4||p.scrollWidth>p.clientWidth+4)){p.scrollTop+=dy;p.scrollLeft+=dx;sc=true;break;}p=p.parentElement;}
    window.scrollBy(dx,dy);
    if(!sc&&c&&c.parentElement){var w=c.parentElement;w.dataset.px=String(Math.max(-600,Math.min(600,parseFloat(w.dataset.px||'0')-dx)));w.dataset.py=String(Math.max(-900,Math.min(400,parseFloat(w.dataset.py||'0')-dy)));applyTf(w);}
  }
  function wirePinch(){
    var c=mainCanvas();if(!c||!c.parentElement)return;var st=c.parentElement;if(st.dataset.pw)return;st.dataset.pw='1';
    st.addEventListener('touchstart',function(e){if(e.touches.length===2){e.preventDefault();pDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);pStart=pScale;}},{passive:false});
    st.addEventListener('touchmove',function(e){if(e.touches.length===2&&pDist>0){e.preventDefault();var d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);pScale=Math.max(0.6,Math.min(3.5,pStart*(d/pDist)));applyTf(st);}},{passive:false});
    var lt=0;st.addEventListener('touchend',function(e){if(e.touches.length<2)pDist=0;if(e.touches.length===0&&e.changedTouches.length===1){var now=Date.now();if(now-lt<280&&pScale!==1)resetTf();lt=now;}});
  }

  var damp=false,rx=0,ry=0,vx=0,vy=0;
  document.addEventListener('touchstart',function(e){if(!e.isTrusted||e.touches.length!==1)return;var c=mainCanvas();if(!c||e.target!==c)return;var sel=Array.from(document.querySelectorAll('button')).some(function(b){return /चुनें\s*\/\s*मूव|Select/i.test(b.textContent||'')&&getComputedStyle(b).backgroundColor!=='rgba(0, 0, 0, 0)';});if(sel){damp=true;rx=vx=e.touches[0].clientX;ry=vy=e.touches[0].clientY;}},true);
  document.addEventListener('touchmove',function(e){if(!e.isTrusted||!damp||e.touches.length!==1)return;var t=e.touches[0];vx+=(t.clientX-rx)*0.48;vy+=(t.clientY-ry)*0.48;rx=t.clientX;ry=t.clientY;e.stopImmediatePropagation();try{var nt=new Touch({identifier:t.identifier,target:t.target,clientX:vx,clientY:vy,pageX:vx+scrollX,pageY:vy+scrollY,radiusX:8,radiusY:8,force:.5});t.target.dispatchEvent(new TouchEvent('touchmove',{touches:[nt],targetTouches:[nt],changedTouches:[nt],bubbles:true,cancelable:true}));}catch(err){}},true);
  document.addEventListener('touchend',function(e){if(e.isTrusted)damp=false;},true);

  var css=document.createElement('style');
  css.textContent=[
    '#apmbsTop{position:sticky!important;top:0!important;z-index:9995!important;background:#0f172a!important;display:flex!important;justify-content:space-between!important;align-items:center!important;width:100%!important;padding:6px 8px!important;box-sizing:border-box!important}',
    '#apmbsTop > *:first-child{margin-right:auto!important}',
    '#apmbsTop > *:nth-child(2){margin:0 auto!important;text-align:center!important}',
    '#apmbsTop > *:last-child{margin-left:auto!important}',
    'body.fw canvas#pdfCanvas,body.fw .page-wrapper>canvas,body.fs canvas#pdfCanvas,body.fs .page-wrapper>canvas{width:97vw!important;max-width:97vw!important;height:auto!important}',
    'body.fp canvas#pdfCanvas,body.fp .page-wrapper>canvas{width:auto!important;max-width:66vw!important;max-height:70vh!important;height:auto!important}',
    'body.fs [data-apmbs-chrome="1"],body.thide [data-apmbs-chrome="1"]{display:none!important}',
    '[data-apmbs-sidebar="1"].sb-hide{display:none!important}',
    '#navPad{position:fixed;right:12px;bottom:16px;z-index:99990;background:rgba(15,23,42,.95);border:1px solid #38bdf8;border-radius:12px;padding:7px;display:none;flex-direction:column;gap:5px}',
    '#navPad button{background:#1e293b;color:#fff;border:1px solid #475569;border-radius:7px;min-width:40px;height:36px;font-size:14px;font-weight:700}',
    '#navTog{position:fixed;left:12px;bottom:16px;z-index:99990;background:#0284c7;color:#fff;border:none;border-radius:18px;padding:8px 12px;font-size:12px;font-weight:700}',
    '#pgList{position:fixed;inset:46px 0 0 0;z-index:9990;background:#0b1120;color:#fff;display:none;flex-direction:column;padding:12px;overflow-y:auto}'
  ].join('\n');
  document.head.appendChild(css);

  var modes=[{c:'fp',l:'फिट-पेज मोड'},{c:'fw',l:'फुल-विड्थ मोड'},{c:'fs',l:'फुल-स्क्रीन व्यू'}],mi=0;
  function byTxt(re){return Array.from(document.querySelectorAll('button,span,div')).find(function(e){return e.children.length<=1&&re.test((e.textContent||'').trim());});}

  function findOuterSidebar(){
    var mc=mainCanvas();
    var ws=mc?mc.parentElement:byTxt(/ऑफ़लाइन PDF एडिटर में स्वागत है/);
    var p=ws;
    while(p&&p!==document.body){
      var par=p.parentElement;
      if(par&&par!==document.body){
        var sib=Array.from(par.children).find(function(ch){
          return ch!==p && !ch.closest("#pgList") && !ch.closest("#navPad") && /पेज\s*\(\d+\)|\+\s*पेज/.test(ch.textContent||"");
        });
        if(sib){
          sib.setAttribute("data-apmbs-sidebar","1");
          par.setAttribute("data-apmbs-row","1");
          return sib;
        }
      }
      p=par;
    }
    return document.querySelector("[data-apmbs-sidebar='1']");
  }

  function tagLayoutBlocks(){
    var sb=findOuterSidebar();
    var mc=mainCanvas();
    var ws=mc?mc.parentElement:byTxt(/ऑफ़लाइन PDF एडिटर में स्वागत है/);
    var chain=[];var p=ws;while(p&&p!==document.body){chain.push(p);p=p.parentElement;}
    chain.concat([document.body]).forEach(function(anc){
      Array.from(anc.children).forEach(function(ch){
        if(ch.id==="apmbsTop"||ch.id==="apmbsNoteOv"||ch.id==="apmbsManOv"||ch.id==="navPad"||ch.id==="navTog"||ch.id==="pgList")return;
        if(ch.getAttribute("data-apmbs-sidebar")==="1"||ch.getAttribute("data-apmbs-row")==="1")return;
        if(chain.indexOf(ch)!==-1||(mc&&ch.contains(mc))||(sb&&ch.contains(sb)))return;
        if(/APMBS|PDF खोलें|ज़ूम|मर्ज|फ़ॉन्ट/.test(ch.textContent||""))ch.setAttribute("data-apmbs-chrome","1");
      });
    });
    return sb;
  }

  function showLeftSidePanel(show){
    var sb=findOuterSidebar();
    if(!sb)return;
    var row=sb.parentElement;
    if(show){
      sb.classList.remove("sb-hide");
      sb.style.setProperty("display","flex","important");
      sb.style.setProperty("flex-direction","column","important");
      if(row)row.style.setProperty("display","flex","important");
    }else{
      sb.classList.add("sb-hide");
      sb.style.setProperty("display","none","important");
    }
  }

  function setMode(idx){
    mi=((idx%3)+3)%3;
    modes.forEach(function(m){document.body.classList.remove(m.c);});
    document.body.classList.add(modes[mi].c);
    resetTf();
    tagLayoutBlocks();
    showLeftSidePanel(mi===0);
    var np=document.getElementById("navPad");if(np)np.style.display=(mi===1||mi===2)?"flex":"none";
    var mb=byTxt(/फुल-विड्थ मोड|फिट-पेज मोड|फुल-स्क्रीन व्यू/);if(mb)mb.textContent=modes[mi].l;
    var tb=byTxt(/टूल्स दिखाएं|टूल्स छिपाएं/);
    if(tb)tb.textContent=(mi===2||document.body.classList.contains("thide"))?"▼ टूल्स दिखाएं":"▲ टूल्स छिपाएं";
  }

  function togList(force){
    var lm=document.getElementById("pgList");if(!lm){lm=document.createElement("div");lm.id="pgList";document.body.appendChild(lm);}
    var open=typeof force==="boolean"?force:(lm.style.display==="none"||!lm.style.display);
    var lb=byTxt(/पेज लिस्ट|पेज व्यू/);
    if(!open){lm.style.display="none";if(lb)lb.textContent="📑 पेज लिस्ट";return;}
    var mc=mainCanvas(),th=Array.from(document.querySelectorAll("canvas")).filter(function(x){return x!==mc;});
    lm.innerHTML="<div style='display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:10px;flex-wrap:wrap'><b style='color:#38bdf8'>📑 पेज लिस्ट (ग्रिड व्यू)</b><div style='display:flex;gap:6px'><button id='bSideV' type='button' style='background:#059669;color:#fff;border:none;border-radius:7px;padding:8px 12px;font-weight:700;font-size:12.5px;cursor:pointer'>📋 साइड पैनल व्यू</button><button id='b2p' type='button' style='background:#0284c7;color:#fff;border:none;border-radius:7px;padding:8px 12px;font-weight:700;font-size:12.5px;cursor:pointer'>📄 पेज व्यू</button></div></div><div id='tGrid' style='display:grid;grid-template-columns:1fr 1fr;gap:10px'></div>";
    var gr=document.getElementById("tGrid"),list=th.length?th:(mc?[mc]:[]);
    list.forEach(function(cv,i){
      var d=document.createElement("div");d.style.cssText="background:#1e293b;border:2px solid #38bdf8;border-radius:9px;padding:8px;text-align:center";
      var im=document.createElement("img");try{im.src=cv.toDataURL();}catch(e){}im.style.cssText="width:100%;height:150px;object-fit:contain;background:#fff;border-radius:5px";
      var lb2=document.createElement("div");lb2.textContent="पेज "+(i+1);lb2.style.cssText="margin-top:6px;font-weight:700";
      d.appendChild(im);d.appendChild(lb2);d.addEventListener("click",function(){if(cv!==mc)cv.click();togList(false);});gr.appendChild(d);
    });
    function activateSidePanel(ev){
      if(ev){ev.preventDefault();ev.stopPropagation();}
      togList(false);
      document.body.classList.remove("thide");
      setMode(0);
      showLeftSidePanel(true);
    }
    document.getElementById("bSideV").addEventListener("click",activateSidePanel);
    document.getElementById("b2p").addEventListener("click",function(){togList(false);});
    lm.style.display="flex";if(lb)lb.textContent="📄 पेज व्यू";
  }

  document.addEventListener('click',function(e){
    var el=e.target.closest('a,button,[role="button"],div,span,svg,img');if(!el)return;
    if(el.closest('#apmbsManOv')||el.closest('#apmbsNoteOv')||el.closest('#navPad')||el.closest('#pgList'))return;
    var r=el.getBoundingClientRect();
    if(r.top<115&&r.left<75&&r.width>18&&r.width<70&&r.height>18&&r.height<70&&mi!==0){e.preventDefault();e.stopImmediatePropagation();setMode(0);return;}
    var hr=el.getAttribute('href')||'',tx=(el.textContent||'').trim();if(tx.length>55)return;
    if(hr.indexOf('special-note.html')!==-1||/special\s*note|new\s*note|नया\s*नोट|स्पेशल\s*नोट/i.test(tx)){e.preventDefault();e.stopImmediatePropagation();openNote();return;}
    if(/^📑?\s*(पेज लिस्ट|पेज व्यू)$/i.test(tx)){e.preventDefault();e.stopImmediatePropagation();togList();return;}
    if(/^(फुल-विड्थ मोड|फिट-पेज मोड|फुल-स्क्रीन व्यू)$/i.test(tx)){e.preventDefault();e.stopImmediatePropagation();setMode(mi+1);return;}
  },true);

  function init(){
    tagLayoutBlocks();
    if(!document.getElementById('navPad')){
      var tg=document.createElement('button');tg.id='navTog';tg.textContent='🧭 नेविगेशन पैड';document.body.appendChild(tg);
      var np=document.createElement('div');np.id='navPad';
      np.innerHTML='<div style="display:flex;gap:4px"><button id="nPp">⏮️ पेज</button><button id="nUp">⬆️</button><button id="nNp">पेज ⏭️</button></div><div style="display:flex;justify-content:center;gap:5px"><button id="nLt">⬅️</button><button id="nDn">⬇️</button><button id="nRt">➡️</button></div><div style="display:flex;gap:4px"><button id="nZo">🔍-</button><button id="nZi">🔍+</button><button id="nCl" style="background:#991b1b">✖️</button></div>';
      document.body.appendChild(np);
      tg.addEventListener('click',function(){np.style.display=(np.style.display==='none'||!np.style.display)?'flex':'none';});
      document.getElementById('nCl').addEventListener('click',function(){np.style.display='none';});
      document.getElementById('nUp').addEventListener('click',function(){scrollFullPage(0,-240);});
      document.getElementById('nDn').addEventListener('click',function(){scrollFullPage(0,240);});
      document.getElementById('nLt').addEventListener('click',function(){scrollFullPage(-180,0);});
      document.getElementById('nRt').addEventListener('click',function(){scrollFullPage(180,0);});
      document.getElementById('nPp').addEventListener('click',function(){scrollFullPage(0,-500);});
      document.getElementById('nNp').addEventListener('click',function(){scrollFullPage(0,500);});
      document.getElementById('nZi').addEventListener('click',function(){var b=byTxt(/^\+$/);if(b)b.click();else{pScale=Math.min(3.5,pScale+.25);var c=mainCanvas();if(c)applyTf(c.parentElement);}});
      document.getElementById('nZo').addEventListener('click',function(){var b=byTxt(/^-$/);if(b)b.click();else{pScale=Math.max(.6,pScale-.25);var c=mainCanvas();if(c)applyTf(c.parentElement);}});
    }
    wirePinch();
    var mb=byTxt(/फुल-विड्थ मोड|फिट-पेज मोड|फुल-स्क्रीन व्यू/);if(mb&&mb.parentElement)mb.parentElement.id='apmbsTop';
    var tb=byTxt(/टूल्स दिखाएं|टूल्स छिपाएं/);
    if(tb&&!tb.dataset.w){tb.dataset.w='1';tb.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();tagLayoutBlocks();var h=!document.body.classList.contains('thide');document.body.classList.toggle('thide',h);setMode(mi);},true);}
    setMode(0);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  setTimeout(init,800);
})();
