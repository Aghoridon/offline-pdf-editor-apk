(function(){
  if(window.__apmbsBookV3)return;window.__apmbsBookV3=true;
  var chs=[
    {n:'अध्याय 1',t:'100% ऑफ़लाइन सुरक्षा, फ़ाइल सीमा और स्टोरेज लोकेशन',it:[
      ['100% ऑफ़लाइन कार्यप्रणाली','आपकी कोई भी PDF, फ़ोटो, हस्ताक्षर या नोट किसी सर्वर पर नहीं जाता। सारा काम फ़ोन के अंदर ऑफ़लाइन होता है।'],
      ['फ़ाइल और पेज सीमा','एक बार में 100 MB से 150 MB तक की PDF और 200 पेजों तक के दस्तावेज़ आसानी से एडिट कर सकते हैं।'],
      ['फ़ाइलें कहाँ सेव होती हैं','PDF डाउनलोड फ़ोन के Download/ फ़ोल्डर में और Note & Code Studio की फ़ाइलें Download/APMBS_Notes/ में सेव होती हैं।']
    ]},
    {n:'अध्याय 2',t:'ऊपरी हेडर पट्टी और तीनों व्यू मोड (Top Bar & View Modes)',it:[
      ['📑 पेज लिस्ट / 📄 पेज व्यू (बायां कोना)','सभी पेजों की साइड-बाय-साइड ग्रिड सूची खोलता है। अंदर दिए हरे "📋 साइड पैनल व्यू" या नीले "📄 पेज व्यू" से वापस लौटें।'],
      ['बीच वाला व्यू स्विचर','इससे 3 मोड बदलें: (1) फिट-पेज मोड — बाईं ओर थंबनेल पैनल + पेज, (2) फुल-विड्थ मोड — 97% चौड़ा पेज, (3) फुल-स्क्रीन व्यू — सारे टूलबार छिपाकर केवल दस्तावेज़।'],
      ['ऊपरी बायां नीला पेज आइकन','फुल-विड्थ या फुल-स्क्रीन मोड से तुरंत सामान्य फिट-पेज मोड में लौटने के लिए ऊपर बाएं कोने के नीले पेज आइकन पर टैप करें।'],
      ['▲ टूल्स छिपाएं / ▼ टूल्स दिखाएं (दायां कोना)','स्क्रीन पर ज़्यादा जगह बनाने के लिए एडिटिंग टूलबार को छिपाता और वापस दिखाता है।']
    ]},
    {n:'अध्याय 3',t:'नेविगेशन पैड (🧭), दो-उंगली Pinch Zoom और साइड पैनल',it:[
      ['दो-उंगली Pinch Zoom','पेज पर दो उंगलियों को फैलाकर या सिकोड़कर ज़ूम इन/आउट करें। डबल-टैप करने से ज़ूम 100% रीसेट हो जाता है।'],
      ['🧭 नेविगेशन पैड (⬆️ ⬇️ ⬅️ ➡️)','नीचे बाएं बटन से नेविगेशन पैड खोलें। इसकी ⬆️ ⬇️ ⬅️ ➡️ कीज़ बड़े फुल-पेज को चारों दिशाओं में स्क्रॉल करती हैं।'],
      ['बायां साइड पैनल (पेज + पेज)','फिट-पेज मोड में बाईं ओर दिखने वाले पैनल से नया पेज जोड़ें, पेज घुमाएं, ऊपर-नीचे खिसकाएं या हटाएं।']
    ]},
    {n:'अध्याय 4',t:'PDF फ़ाइल टूल्स, मर्ज, स्प्लिट और ऑफ़लाइन ड्राफ्ट',it:[
      ['📂 PDF खोलें और + खाली पेज','फ़ोन स्टोरेज से कोई भी PDF खोलें या नया सादा A4 पेज जोड़ें।'],
      ['🔗 मर्ज (Merge) और ✂️ स्प्लिट / निकालें','मर्ज से कई PDF जोड़कर एक बनाएं, और स्प्लिट से चुनिंदा पेजों को अलग करके नई PDF निकालें।'],
      ['💾 ड्राफ्ट सेव और 📁 सेव ड्राफ्ट','अधूरे काम को ऑफ़लाइन IndexedDB में सुरक्षित रखें ताकि बाद में वहीं से दोबारा एडिट कर सकें।'],
      ['⬇️ PDF डाउनलोड','सभी बदलावों के साथ अंतिम PDF तैयार करके फ़ोन के Download फ़ोल्डर में सेव करें।']
    ]},
    {n:'अध्याय 5',t:'हिंदी/English टेक्स्ट, नीला रिसाइज़ बॉक्स और व्हाइटआउट',it:[
      ['🖱️ चुनें / मूव और नीला बॉक्स','टेक्स्ट के चारों ओर बनने वाले नीले बॉक्स के कोने वाले हैंडल की टच सेंसिटिविटी मीडियम रखी गई है ताकि उंगली से आकार आराम से सेट हो।'],
      ['🔤 हिंदी / Eng टेक्स्ट और व्हाइटआउट','देवनागरी (हिंदी) या English में लिखें, या व्हाइटआउट से पुराने हिस्से को छिपाकर ऊपर नया टेक्स्ट लिखें।'],
      ['फ़ॉन्ट, .TTF फ़ॉन्ट, साइज और स्टाइल','Noto Sans हिंदी या कस्टम .TTF फ़ॉन्ट चुनें, और साइज, रंग, बैकग्राउंड भरें, मोटाई, Bold (B) व Italic (I) सेट करें।']
    ]},
    {n:'अध्याय 6',t:'ऊपर बाएं ड्रॉपडाउन मेनू (📄▾) के सभी विशेष मॉड्यूल',it:[
      ['मॉड्यूल मेनू कैसे खोलें','हेडर में "APMBS ऑफ़लाइन PDF एडिटर प्रो" के ठीक बाईं ओर बने छोटे तीर (📄▾) पर टैप करने से सभी अतिरिक्त मॉड्यूल की सूची खुलती है।'],
      ['मुख्य मॉड्यूल','इसमें Special Note & Code Studio, 30+ फ़ॉर्मेट ऑफ़लाइन कन्वर्टर, प्रो PDF यूटिलिटी हब, ई-सिग्नेचर/वॉटरमार्क और यह यूज़र मैनुअल शामिल हैं।']
    ]},
    {n:'अध्याय 7',t:'30+ फ़ॉर्मेट ऑफ़लाइन फ़ाइल कन्वर्टर',it:[
      ['Image से PDF','JPG, PNG, WEBP, BMP, GIF, SVG और TIFF फ़ोटो को सिंगल या मल्टी-पेज PDF में बदलें।'],
      ['Office व डॉक्यूमेंट से PDF','Word (.docx), Excel (.xlsx), PowerPoint (.pptx), EPUB, HTML, Markdown (.md) और Text (.txt) को सीधे PDF बनाएं।'],
      ['PDF से अन्य फ़ॉर्मेट','PDF को वापस Word (.docx), Text (.txt), Images (JPG/PNG) और ऑफ़लाइन ऑडियो वॉयस रीडर में बदलें।']
    ]},
    {n:'अध्याय 8',t:'प्रो PDF यूटिलिटी हब (8 एडवांस्ड टूल्स)',it:[
      ['Write PDF और In-PDF Search','सीधे टाइप करके हिंदी-सपोर्टेड नया PDF बनाएं और सैकड़ों पेजों की PDF के अंदर कोई भी शब्द तुरंत खोजें।'],
      ['Grayscale, Dark Mode, Margin Crop और 2-in-1 Print','प्रिंटिंग के लिए ब्लैक-एंड-व्हाइट, रात में पढ़ने के लिए डार्क मोड, किनारों की क्रॉपिंग और एक शीट पर 2 पेज प्रिंट सेट करें।']
    ]},
    {n:'अध्याय 9',t:'APMBS Note & Code Studio (वर्ड प्रोसेसर + कोड एडिटर)',it:[
      ['📂 Open, फ़ॉन्ट पैक और A-/A+','फ़ोन से फ़ाइल खोलें, आधुनिक या हस्तलिखित हिंदी/English फ़ॉन्ट चुनें और A- / A+ से 12px से 32px तक साइज़ बदलें।'],
      ['दायां फॉर्मेटिंग पैनल (B, I, S, H1-H3, ☑, ❝)','किसी भी फॉर्मेट बटन पर टैप करने पर वह चमकदार नारंगी रंग से हाइलाइट होकर सक्रिय स्थिति दिखाता है।'],
      ['</> Code, 👁 प्रीव्यू, ▶ Run और Save/Share','</> Code से 1, 2, 3... सीधी लाइन नंबर के साथ कोडिंग करें, और Save/Share से PDF, DOCX, HTML, MD, TXT व Code में Download/APMBS_Notes/ में सेव करें।']
    ]}
  ];
  var ci=0;
  function box(){
    var ov=document.getElementById('apmbsBookOv');if(ov)return ov;
    ov=document.createElement('div');ov.id='apmbsBookOv';
    ov.style.cssText='position:fixed;inset:0;z-index:2147483647;background:#090d16;color:#f1f5f9;display:none;flex-direction:column;font-family:system-ui,sans-serif';
    ov.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:#1e293b;border-bottom:2px solid #38bdf8"><div><b style="color:#38bdf8;font-size:15px">📖 APMBS संपूर्ण यूज़र मैनुअल</b><div style="font-size:11px;color:#94a3b8">ऑफ़लाइन PDF एडिटर प्रो — संपूर्ण गाइड बुक</div></div><button id="abCls" style="background:#ef4444;color:#fff;border:none;border-radius:8px;padding:8px 13px;font-weight:800">✕ बंद करें</button></div><div style="padding:8px 12px;background:#111827;display:flex;gap:6px"><input id="abSrc" placeholder="🔍 फ़ीचर या बटन खोजें..." style="flex:1;padding:9px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#fff;font-size:13.5px"/><button id="abTocB" style="background:#0284c7;color:#fff;border:none;border-radius:8px;padding:9px 11px;font-weight:700;font-size:12.5px">📑 अध्याय</button></div><div id="abToc" style="display:none;background:#0f172a;border-bottom:1px solid #38bdf8;padding:10px;max-height:45vh;overflow-y:auto"></div><div id="abPg" style="flex:1;overflow-y:auto;padding:14px;line-height:1.7"></div><div style="display:flex;justify-content:space-between;align-items:center;padding:9px 12px;background:#1e293b;border-top:1px solid #334155"><button id="abPrv" style="background:#334155;color:#fff;border:none;border-radius:8px;padding:9px 12px;font-weight:700">⬅️ पिछला</button><b id="abCnt" style="color:#38bdf8;font-size:13px">अध्याय 1 / 9</b><button id="abNxt" style="background:#059669;color:#fff;border:none;border-radius:8px;padding:9px 12px;font-weight:700">अगला ➡️</button></div>';
    document.body.appendChild(ov);
    document.getElementById('abCls').onclick=function(){ov.style.display='none';};
    document.getElementById('abTocB').onclick=function(){var t=document.getElementById('abToc');t.style.display=t.style.display==='none'?'block':'none';};
    document.getElementById('abPrv').onclick=function(){if(ci>0)showCh(ci-1);};
    document.getElementById('abNxt').onclick=function(){if(ci<chs.length-1)showCh(ci+1);};
    document.getElementById('abSrc').oninput=function(e){
      var q=(e.target.value||'').trim().toLowerCase();if(!q){showCh(ci);return;}
      var h=[];chs.forEach(function(c){c.it.forEach(function(x){if((c.t+x[0]+x[1]).toLowerCase().indexOf(q)!==-1)h.push({n:c.n,a:x[0],b:x[1]});});});
      document.getElementById('abPg').innerHTML=h.length?h.map(function(x){return '<div style="background:#131c2e;border:1px solid #38bdf8;border-radius:10px;padding:12px;margin-bottom:10px"><div style="font-size:11px;color:#93c5fd">'+x.n+'</div><b style="color:#fbbf24">'+x.a+'</b><div style="font-size:13.8px;margin-top:4px">'+x.b+'</div></div>';}).join(''):'<div style="text-align:center;padding:30px;color:#94a3b8">कोई परिणाम नहीं मिला</div>';
    };
    var tc=document.getElementById('abToc');
    tc.innerHTML=chs.map(function(c,i){return '<div data-i="'+i+'" style="padding:8px 10px;margin-bottom:6px;background:#1e293b;border-radius:8px;font-size:13px"><b style="color:#38bdf8">'+c.n+':</b> '+c.t+'</div>';}).join('');
    tc.querySelectorAll('[data-i]').forEach(function(d){d.onclick=function(){tc.style.display='none';document.getElementById('abSrc').value='';showCh(parseInt(d.dataset.i,10));};});
    return ov;
  }
  function showCh(i){
    ci=Math.max(0,Math.min(chs.length-1,i));var c=chs[ci],pg=document.getElementById('abPg');
    pg.innerHTML='<div style="background:linear-gradient(135deg,#0f172a,#1e3a8a);border:1px solid #38bdf8;border-radius:12px;padding:13px;margin-bottom:12px"><div style="font-size:12px;color:#93c5fd;font-weight:800">'+c.n+'</div><h3 style="font-size:16.5px;color:#fff;margin-top:3px">'+c.t+'</h3></div>'+c.it.map(function(x){return '<div style="background:#131c2e;border:1px solid #293548;border-left:4px solid #38bdf8;border-radius:10px;padding:12px;margin-bottom:10px"><div style="font-weight:800;color:#fbbf24;font-size:14.5px;margin-bottom:4px">'+x[0]+'</div><div style="font-size:13.8px;color:#e2e8f0">'+x[1]+'</div></div>';}).join('');
    pg.scrollTop=0;document.getElementById('abCnt').textContent=c.n+' / '+chs.length;
  }
  window.openApmbsBookManual=function(){var ov=box();showCh(ci);ov.style.display='flex';};
  function killOld(){
    var hit=false;
    document.querySelectorAll('div,section,dialog').forEach(function(el){
      if(el.id==='apmbsBookOv'||el.closest('#apmbsBookOv'))return;
      var t=el.textContent||'';
      if(t.indexOf('Double-Touch:')!==-1&&t.indexOf('आफ़लाइन यूज़र मनुअल')!==-1){
        if(el.offsetParent!==null||getComputedStyle(el).display!=='none'){
          hit=true;el.style.setProperty('display','none','important');
          if(el.parentElement&&el.parentElement!==document.body&&getComputedStyle(el.parentElement).position==='fixed'){
            el.parentElement.style.setProperty('display','none','important');
          }
        }
      }
    });
    if(hit)window.openApmbsBookManual();
  }
  setInterval(killOld,200);
  document.addEventListener('change',function(e){if(e.target&&e.target.tagName==='SELECT'&&/मनुअल|मैनुअल|manual/i.test(e.target.options[e.target.selectedIndex].text+e.target.value)){e.target.selectedIndex=0;window.openApmbsBookManual();}},true);
  document.addEventListener('click',function(e){var el=e.target.closest('button,a,div,span,li,label');if(!el||el.closest('#apmbsBookOv')||el.children.length>2)return;if(/मनुअल|मैनुअल|user\s*manual/i.test((el.textContent||'').trim())){e.preventDefault();e.stopImmediatePropagation();window.openApmbsBookManual();}},true);
})();
