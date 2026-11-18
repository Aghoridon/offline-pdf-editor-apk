(function(){
  let fw=false, tc=false, tap=0;
  window.APMBSSpecialNote={
    open(){
      let w=document.getElementById("sn-ov");
      if(!w){w=document.createElement("div");w.id="sn-ov";w.style.cssText="display:none;position:fixed;inset:0;z-index:9750;background:#0f172a;";w.innerHTML='<iframe src="special-note.html" style="width:100%;height:100%;border:none;"></iframe>';document.body.appendChild(w);}
      w.style.display="block";
    },
    close(){const w=document.getElementById("sn-ov");if(w)w.style.display="none";}
  };
  function initUI(){
    if(document.getElementById("apmbs-menu"))return;
    const st=document.createElement("style");
    st.textContent=`#apmbs-menu{display:none;position:fixed;top:52px;left:10px;z-index:9800;width:290px;max-height:82vh;overflow-y:auto;background:#1e293b;border:1px solid #475569;border-radius:14px;box-shadow:0 18px 40px rgba(0,0,0,.7);padding:8px;color:#f8fafc}.m-btn{width:100%;text-align:left;background:#0f172a;color:#f1f5f9;border:1px solid #334155;border-radius:9px;padding:9px 11px;margin-bottom:6px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px}#fw-bar{display:none;background:#0b1324;border-bottom:1px solid #334155;padding:6px 10px;align-items:center;justify-content:space-between}.m-bg{display:none;position:fixed;inset:0;z-index:9600;background:rgba(2,6,23,.85);overflow-y:auto;padding:14px}.m-box{background:#1e293b;border:1px solid #475569;border-radius:14px;max-width:520px;margin:10px auto;padding:14px;color:#f8fafc}`;
    document.head.appendChild(st);
    for(const el of document.querySelectorAll("header,.header,.top-bar,div")){
      if(el.textContent&&el.textContent.includes("ऑफ़लाइन PDF एडिटर प्रो")&&el.children.length<=4){
        el.innerHTML=el.innerHTML.replace(/ऑफ़लाइन PDF एडिटर प्रो/g,'<span id="apmbs-trig" style="cursor:pointer;display:inline-flex;align-items:center;gap:6px;"><span style="background:#2563eb;padding:2px 6px;border-radius:6px;font-size:12px;">📄▾</span> APMBS ऑफ़लाइन PDF एडिटर प्रो</span>');
        break;
      }
    }
    const fwBar=document.createElement("div");fwBar.id="fw-bar";
    fwBar.innerHTML='<button id="fw-back" style="background:#2563eb;color:#fff;border:none;border-radius:7px;padding:6px 10px;font-size:12px;font-weight:700;">📑 पेज लिस्ट</button><span style="font-size:12px;color:#93c5fd;font-weight:700;">फुल-विड्थ मोड</span><button id="fw-tools" style="background:#0f172a;color:#fbbf24;border:1px solid #475569;border-radius:7px;padding:6px 9px;font-size:11.5px;font-weight:700;">▲ टूल्स छिपाएं</button>';
    document.body.insertBefore(fwBar,document.body.firstChild.nextSibling);

    const m=document.createElement("div");m.id="apmbs-menu";
    m.innerHTML='<div style="font-size:12px;font-weight:800;color:#93c5fd;padding:4px 6px 8px;border-bottom:1px solid #334155;margin-bottom:6px;display:flex;justify-content:space-between;"><span>APMBS मुख्य मेनू</span><span id="m-cls" style="cursor:pointer;color:#f87171;">✕</span></div><button class="m-btn" data-a="sn" style="border-color:#f59e0b;color:#fde68a;">📝 Special note</button><button class="m-btn" data-a="conv">🔄 फ़ाइल कन्वर्टर (30+)</button><button class="m-btn" data-a="open">📂 PDF खोलें / इम्पोर्ट</button><button class="m-btn" data-a="fw">📑 पेज लिस्ट / फुल-विड्थ</button><button class="m-btn" data-a="util">🛠️ PDF यूटिलिटी हब</button><button class="m-btn" data-a="exp">📤 Export All PDFs</button><button class="m-btn" data-a="plug">➕ कस्टम HTML मॉड्यूल</button><button class="m-btn" data-a="set">⚙️ सेटिंग्स / Feedback Mail</button><button class="m-btn" data-a="hlp">📖 यूज़र मैनुअल (Help)</button>';
    document.body.appendChild(m);
    const setM=document.createElement("div");setM.id="set-m";setM.className="m-bg";
    setM.innerHTML='<div class="m-box"><div style="display:flex;justify-content:space-between;margin-bottom:8px;"><b>⚙️ Settings & About</b><button onclick="this.closest(\'.m-bg\').style.display=\'none\'" style="background:#7f1d1d;color:#fff;border:none;border-radius:6px;padding:4px 9px;">✕</button></div><div style="font-size:12px;color:#93c5fd;margin-bottom:8px;">APMBS ऑफ़लाइन PDF एडिटर प्रो</div><input id="dev-em" type="email" placeholder="डेवलपर Email ID..." style="width:100%;background:#0f172a;color:#fff;border:1px solid #475569;border-radius:8px;padding:8px;margin-bottom:6px;"/><button id="sv-em" style="background:#10b981;color:#052e16;border:none;border-radius:8px;padding:7px 12px;font-weight:800;margin-bottom:10px;">ईमेल सेव करें</button><textarea id="fb-tx" rows="3" placeholder="समस्या/सुझाव लिखें..." style="width:100%;background:#0f172a;color:#fff;border:1px solid #475569;border-radius:8px;padding:8px;margin-bottom:6px;"></textarea><input type="file" id="fb-sh" accept="image/*" style="margin-bottom:8px;font-size:12px;"/><button id="sd-fb" style="width:100%;background:#2563eb;color:#fff;border:none;border-radius:8px;padding:10px;font-weight:700;">✉️ Screenshot सहित भेजें</button></div>';
    document.body.appendChild(setM);
    const hlpM=document.createElement("div");hlpM.id="hlp-m";hlpM.className="m-bg";
    hlpM.innerHTML='<div class="m-box"><div style="display:flex;justify-content:space-between;margin-bottom:8px;"><b>📖 ऑफ़लाइन यूज़र मैनुअल</b><button onclick="this.closest(\'.m-bg\').style.display=\'none\'" style="background:#7f1d1d;color:#fff;border:none;border-radius:6px;padding:4px 9px;">✕</button></div><div style="font-size:12.5px;line-height:1.6;"><p><b>1. Double-Touch:</b> प्रीव्यू पेज पर 2 बार टैप करें—साइडबार छिपेगा और पेज 100% चौड़ा खुलेगा।</p><p><b>2. Special note & कन्वर्टर:</b> ऊपर बाएँ <b>📄▾</b> से सभी मॉड्यूल खोलें।</p><p><b>3. सीमा:</b> अधिकतम 100 MB (सीमा 150 MB) व 200 पेज।</p></div></div>';
    document.body.appendChild(hlpM);
    function setFW(on){fw=on;document.querySelectorAll('[id*="page"],[class*="sidebar"],[class*="thumb"]').forEach(el=>{if(el.offsetWidth>60&&el.offsetWidth<260)el.style.display=on?"none":"";});fwBar.style.display=on?"flex":"none";}
    window.APMBSMenu={toggle(){m.style.display=m.style.display==="block"?"none":"block";}};
    document.addEventListener("click",e=>{if(e.target.closest("#apmbs-trig"))window.APMBSMenu.toggle();else if(e.target.id==="m-cls")m.style.display="none";});
    document.addEventListener("touchend",e=>{const sb=e.target.closest('[id*="page"],[class*="thumb"],[class*="sidebar"]');if(sb&&sb.getBoundingClientRect().left<160&&sb.getBoundingClientRect().top>180){const n=Date.now();if(n-tap<340){e.preventDefault();setFW(true);}tap=n;}},{passive:false});
    document.getElementById("fw-back").onclick=()=>setFW(false);
    document.getElementById("fw-tools").onclick=e=>{tc=!tc;e.target.textContent=tc?"▼ टूल्स दिखाएं":"▲ टूल्स छिपाएं";document.querySelectorAll("select,input[type='number'],input[type='color']").forEach(i=>{const r=i.closest("div");if(r&&r.getBoundingClientRect().top<360)r.style.display=tc?"none":"";});};
    let sb64="";
    document.getElementById("sv-em").onclick=()=>{const v=document.getElementById("dev-em").value.trim();localStorage.setItem("apmbs_dev_email",v);alert(v?"✅ Email सेव हो गया!":"साफ़ किया गया");};
    document.getElementById("fb-sh").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{sb64=r.result.split(",")[1]||"";};r.readAsDataURL(f);};
    document.getElementById("sd-fb").onclick=()=>{const em=document.getElementById("dev-em").value.trim()||localStorage.getItem("apmbs_dev_email")||"";if(!em){alert("पहले Email ID सेव करें");return;}const tx=document.getElementById("fb-tx").value||"Feedback";if(window.AndroidNativeBridge&&window.AndroidNativeBridge.sendFeedbackWithScreenshot)window.AndroidNativeBridge.sendFeedbackWithScreenshot(em,"APMBS PDF Pro Feedback",tx,sb64);else location.href="mailto:"+em+"?body="+encodeURIComponent(tx);};
    m.onclick=e=>{
      const b=e.target.closest(".m-btn");if(!b)return;const a=b.dataset.a;m.style.display="none";
      if(a==="sn")window.APMBSSpecialNote.open();
      else if(a==="conv"&&window.APMBSConverter)window.APMBSConverter.open();
      else if(a==="open"){const i=document.querySelector('input[type="file"][accept*="pdf"]');if(i)i.click();}
      else if(a==="fw")setFW(!fw);
      else if(a==="util"&&window.APMBSUtilities)window.APMBSUtilities.open();
      else if(a==="exp"){const d=Array.from(document.querySelectorAll("button")).find(x=>x.textContent.includes("PDF डाउनलोड"));if(d)d.click();}
      else if(a==="set"){document.getElementById("dev-em").value=localStorage.getItem("apmbs_dev_email")||"";setM.style.display="block";}
      else if(a==="hlp")hlpM.style.display="block";
      else if(a==="plug"){const fi=document.createElement("input");fi.type="file";fi.accept=".html";fi.onchange=async()=>{if(!fi.files[0])return;const h=await fi.files[0].text();const u=URL.createObjectURL(new Blob([h],{type:"text/html"}));window.APMBSSpecialNote.open();document.querySelector("#sn-ov iframe").src=u;};fi.click();}
    };
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initUI);else initUI();
})();
