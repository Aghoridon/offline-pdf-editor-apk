(function(){
  const MAX_SAFE=100, MAX_HARD=150, MAX_PG=200;
  const TO_PDF={
    image:[{id:"jpg",l:"JPG",e:".jpg"},{id:"jpeg",l:"JPEG",e:".jpeg"},{id:"png",l:"PNG",e:".png"},{id:"webp",l:"WebP",e:".webp"},{id:"bmp",l:"BMP",e:".bmp"},{id:"gif",l:"GIF",e:".gif"},{id:"heic",l:"HEIC/TIFF",e:".heic,.heif,.tif,.tiff"}],
    doc:[{id:"docx",l:"DOCX",e:".docx"},{id:"odt",l:"ODT",e:".odt"},{id:"rtf",l:"RTF",e:".rtf"},{id:"txt",l:"TXT",e:".txt"},{id:"md",l:"Markdown",e:".md"},{id:"tex",l:"LaTeX",e:".tex"},{id:"doc",l:"DOC",e:".doc"}],
    data:[{id:"xlsx",l:"XLSX",e:".xlsx"},{id:"xls",l:"XLS",e:".xls"},{id:"ods",l:"ODS",e:".ods"},{id:"csv",l:"CSV",e:".csv"},{id:"pptx",l:"PPTX",e:".pptx"},{id:"odp",l:"ODP",e:".odp"}],
    ebook:[{id:"html",l:"HTML",e:".html,.htm"},{id:"mhtml",l:"MHTML",e:".mhtml,.mht"},{id:"epub",l:"EPUB",e:".epub"},{id:"fb2",l:"FB2",e:".fb2"}],
    vector:[{id:"svg",l:"SVG",e:".svg"}]
  };
  const FROM_PDF={
    image:[{id:"jpg",l:"JPG",m:"image/jpeg"},{id:"png",l:"PNG",m:"image/png"},{id:"webp",l:"WebP",m:"image/webp"},{id:"bmp",l:"BMP",m:"image/bmp"},{id:"tiff",l:"TIFF",m:"image/tiff"}],
    doc:[{id:"txt",l:"TXT",m:"text/plain"},{id:"md",l:"Markdown",m:"text/markdown"},{id:"rtf",l:"RTF",m:"application/rtf"},{id:"docx",l:"DOCX",m:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"},{id:"odt",l:"ODT",m:"application/vnd.oasis.opendocument.text"}],
    data:[{id:"csv",l:"CSV",m:"text/csv"},{id:"xlsx",l:"XLSX",m:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},{id:"json",l:"JSON",m:"application/json"},{id:"xml",l:"XML",m:"application/xml"}],
    ebook:[{id:"html",l:"HTML",m:"text/html"},{id:"epub",l:"EPUB",m:"application/epub+zip"},{id:"fb2",l:"FB2",m:"application/x-fictionbook+xml"}],
    audio:[{id:"wav",l:"WAV Audio",m:"audio/wav"},{id:"mp3",l:"MP3 Audio",m:"audio/mpeg"}],
    vector:[{id:"svg",l:"SVG",m:"image/svg+xml"}]
  };
  const Zip={
    tbl:null,
    crcT(){if(this.tbl)return this.tbl;const t=new Uint32Array(256);for(let i=0;i<256;i++){let c=i;for(let k=0;k<8;k++)c=(c&1)?(0xEDB88320^(c>>>1)):(c>>>1);t[i]=c;}return this.tbl=t;},
    crc(b){const t=this.crcT();let c=0xFFFFFFFF;for(let i=0;i<b.length;i++)c=(c>>>8)^t[(c^b[i])&0xFF];return(c^0xFFFFFFFF)>>>0;},
    async read(ab){
      const v=new DataView(ab),u=new Uint8Array(ab),out={},dec=new TextDecoder();
      let eo=-1;for(let i=u.length-22;i>=Math.max(0,u.length-65557);i--)if(v.getUint32(i,true)===0x06054b50){eo=i;break;}
      if(eo<0)return out;const tot=v.getUint16(eo+10,true);let cd=v.getUint32(eo+16,true);
      for(let i=0;i<tot;i++){
        if(v.getUint32(cd,true)!==0x02014b50)break;
        const m=v.getUint16(cd+10,true),cs=v.getUint32(cd+20,true),nl=v.getUint16(cd+28,true),el=v.getUint16(cd+30,true),cl=v.getUint16(cd+32,true),lo=v.getUint32(cd+42,true);
        const nm=dec.decode(u.subarray(cd+46,cd+46+nl));cd+=46+nl+el+cl;
        const ds=lo+30+v.getUint16(lo+26,true)+v.getUint16(lo+28,true),cmp=u.subarray(ds,ds+cs);
        try{if(m===0)out[nm]=cmp;else if(m===8&&typeof DecompressionStream!=="undefined"){const d=new DecompressionStream("deflate-raw"),w=d.writable.getWriter();w.write(cmp);w.close();out[nm]=new Uint8Array(await new Response(d.readable).arrayBuffer());}}catch(e){}
      }return out;
    },
    build(files){
      const enc=new TextEncoder(),loc=[],cds=[];let off=0;
      for(const f of files){
        const nb=enc.encode(f.n),db=f.d instanceof Uint8Array?f.d:enc.encode(f.d),cr=this.crc(db);
        const lh=new Uint8Array(30+nb.length),lv=new DataView(lh.buffer);
        lv.setUint32(0,0x04034b50,true);lv.setUint16(4,20,true);lv.setUint32(14,cr,true);lv.setUint32(18,db.length,true);lv.setUint32(22,db.length,true);lv.setUint16(26,nb.length,true);lh.set(nb,30);
        const ch=new Uint8Array(46+nb.length),cv=new DataView(ch.buffer);
        cv.setUint32(0,0x02014b50,true);cv.setUint16(4,20,true);cv.setUint16(6,20,true);cv.setUint32(16,cr,true);cv.setUint32(20,db.length,true);cv.setUint32(24,db.length,true);cv.setUint16(28,nb.length,true);cv.setUint32(42,off,true);ch.set(nb,46);
        loc.push(lh,db);cds.push(ch);off+=lh.length+db.length;
      }
      const cs=cds.reduce((s,c)=>s+c.length,0),eo=new Uint8Array(22),ev=new DataView(eo.buffer);
      ev.setUint32(0,0x06054b50,true);ev.setUint16(8,files.length,true);ev.setUint16(10,files.length,true);ev.setUint32(12,cs,true);ev.setUint32(16,off,true);
      const res=new Uint8Array(off+cs+22);let p=0;for(const c of loc){res.set(c,p);p+=c.length;}for(const c of cds){res.set(c,p);p+=c.length;}res.set(eo,p);return res;
    }
  };
  function saveB(bytes,name,mime){
    const u=bytes instanceof Uint8Array?bytes:new Uint8Array(bytes);let s="";
    for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));
    if(window.AndroidBlobDownloader&&window.AndroidBlobDownloader.saveBase64File){window.AndroidBlobDownloader.saveBase64File(btoa(s),name,mime,"APMBS_Converted");return;}
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([u],{type:mime}));a.download=name;document.body.appendChild(a);a.click();a.remove();
  }
  async function txtToPdf(title,txt){
    const doc=await PDFLib.PDFDocument.create(),lines=(txt||" ").replace(/\r/g,"").split("\n"),pages=[[]];
    const c=document.createElement("canvas");c.width=794;c.height=1123;const ctx=c.getContext("2d");ctx.font="17px 'Noto Sans Devanagari',sans-serif";
    for(const ln of lines){
      const ws=ln.split(/\s+/);let cur="";
      for(const w of ws){const t=cur?cur+" "+w:w;if(ctx.measureText(t).width>680&&cur){pages[pages.length-1].push(cur);cur=w;if(pages[pages.length-1].length>=32&&pages.length<MAX_PG)pages.push([]);}else cur=t;}
      pages[pages.length-1].push(cur);if(pages[pages.length-1].length>=32&&pages.length<MAX_PG)pages.push([]);
    }
    for(let i=0;i<pages.length;i++){
      ctx.fillStyle="#fff";ctx.fillRect(0,0,794,1123);ctx.fillStyle="#0f172a";ctx.font="bold 20px 'Noto Sans Devanagari',sans-serif";
      if(i===0)ctx.fillText(title.slice(0,55),54,58);ctx.font="17px 'Noto Sans Devanagari',sans-serif";
      pages[i].forEach((l,idx)=>ctx.fillText(l,54,(i===0?96:64)+idx*29));
      const png=Uint8Array.from(atob(c.toDataURL("image/png").split(",")[1]),ch=>ch.charCodeAt(0));
      const emb=await doc.embedPng(png);doc.addPage([595.28,841.89]).drawImage(emb,{x:0,y:0,width:595.28,height:841.89});
    }
    return await doc.save();
  }
  function buildDocx(title,txt){
    const esc=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    const body=txt.split("\n").map(p=>`<w:p><w:r><w:t xml:space="preserve">${esc(p)}</w:t></w:r></w:p>`).join("");
    const doc=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>${esc(title)}</w:t></w:r></w:p>${body}</w:body></w:document>`;
    const ct=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`;
    const rel=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
    return Zip.build([{n:"[Content_Types].xml",d:ct},{n:"_rels/.rels",d:rel},{n:"word/document.xml",d:doc}]);
  }
  async function extractTxt(f){
    const nm=f.name.toLowerCase(),ab=await f.arrayBuffer();
    if(nm.endsWith(".docx")||nm.endsWith(".odt")||nm.endsWith(".xlsx")||nm.endsWith(".pptx")||nm.endsWith(".epub")){
      const z=await Zip.read(ab),dec=new TextDecoder();let out="";
      for(const k of Object.keys(z))if(k.endsWith(".xml")||k.endsWith(".xhtml")||k.endsWith(".html"))out+=dec.decode(z[k]).replace(/<[^>]+>/g," ")+"\n";
      return out.replace(/\s+/g," ").trim()||"Empty Document";
    }
    return new TextDecoder("utf-8",{fatal:false}).decode(ab);
  }
  async function imgsToPdf(files){
    const doc=await PDFLib.PDFDocument.create();
    for(const f of files){
      const u=URL.createObjectURL(f),im=new Image();
      await new Promise((r,j)=>{im.onload=r;im.onerror=j;im.src=u;});
      const c=document.createElement("canvas");c.width=im.naturalWidth||800;c.height=im.naturalHeight||1000;
      c.getContext("2d").drawImage(im,0,0);URL.revokeObjectURL(u);
      const png=Uint8Array.from(atob(c.toDataURL("image/png").split(",")[1]),ch=>ch.charCodeAt(0));
      const emb=await doc.embedPng(png);doc.addPage([emb.width,emb.height]).drawImage(emb,{x:0,y:0,width:emb.width,height:emb.height});
    }
    return await doc.save();
  }
  async function pdfToTxt(f){
    const ab=await f.arrayBuffer();
    if(window.pdfjsLib){
      const pdf=await pdfjsLib.getDocument({data:ab}).promise,n=Math.min(pdf.numPages,MAX_PG);let out="";
      for(let i=1;i<=n;i++){const p=await pdf.getPage(i),tc=await p.getTextContent();out+=`--- Page ${i} ---\n`+tc.items.map(x=>x.str).join(" ")+"\n\n";}
      return out.trim()||"No selectable text (Scanned PDF)";
    }
    const raw=new TextDecoder("latin1").decode(ab),m=raw.match(/\(([^()]{2,})\)/g);
    return m?m.map(x=>x.slice(1,-1)).join(" "):"PDF Text Extracted";
  }
  let mod="to",cat="image",fmt="jpg";
  function openConv(){
    let m=document.getElementById("conv-m");
    if(!m){
      m=document.createElement("div");m.id="conv-m";m.className="m-bg";
      m.innerHTML='<div class="m-box"><div style="display:flex;justify-content:space-between;margin-bottom:8px;"><b>🔄 ऑफ़लाइन फ़ाइल कन्वर्टर (30+)</b><button onclick="this.closest(\'.m-bg\').style.display=\'none\'" style="background:#7f1d1d;color:#fff;border:none;border-radius:6px;padding:4px 9px;">✕</button></div><div style="display:flex;gap:6px;margin-bottom:8px;"><button id="cm-to" style="flex:1;padding:7px;border-radius:7px;border:none;background:#2563eb;color:#fff;font-weight:700;">अन्य → PDF</button><button id="cm-fr" style="flex:1;padding:7px;border-radius:7px;border:none;background:#334155;color:#fff;font-weight:700;">PDF → अन्य</button></div><select id="c-cat" style="width:100%;background:#0f172a;color:#fff;border:1px solid #475569;border-radius:8px;padding:8px;margin-bottom:6px;"></select><select id="c-fmt" style="width:100%;background:#0f172a;color:#fff;border:1px solid #475569;border-radius:8px;padding:8px;margin-bottom:8px;"></select><input id="c-in" type="file" multiple style="width:100%;margin-bottom:8px;font-size:12px;"/><div id="c-st" style="font-size:12px;color:#34d399;margin-bottom:8px;">100% ऑफ़लाइन | सीमा: 100 MB (200 पेज)</div><button id="c-go" style="width:100%;background:#10b981;color:#052e16;border:none;border-radius:8px;padding:10px;font-weight:800;">⚡ कन्वर्ट और सेव करें</button></div>';
      document.body.appendChild(m);
      const cats={image:"🖼️ इमेज",doc:"📄 डॉक्यूमेंट",data:"📊 डेटा/स्लाइड",ebook:"📚 ई-बुक",audio:"🔊 ऑडियो (TTS)",vector:"📐 वेक्टर"};
      const sC=document.getElementById("c-cat"),sF=document.getElementById("c-fmt");
      const ref=()=>{const src=mod==="to"?TO_PDF:FROM_PDF;sC.innerHTML=Object.keys(src).map(k=>`<option value="${k}">${cats[k]||k}</option>`).join("");cat=sC.value;refF();};
      const refF=()=>{const src=mod==="to"?TO_PDF:FROM_PDF;sF.innerHTML=(src[cat]||[]).map(x=>`<option value="${x.id}">${x.l}</option>`).join("");fmt=sF.value;};
      sC.onchange=()=>{cat=sC.value;refF();};sF.onchange=()=>{fmt=sF.value;};
      document.getElementById("cm-to").onclick=()=>{mod="to";ref();};document.getElementById("cm-fr").onclick=()=>{mod="from";ref();};
      ref();
      document.getElementById("c-go").onclick=async()=>{
        const fs=Array.from(document.getElementById("c-in").files||[]),st=document.getElementById("c-st");
        if(!fs.length){st.textContent="⚠️ फ़ाइल चुनें";return;}
        const mb=fs.reduce((s,f)=>s+f.size,0)/1048576;
        if(mb>MAX_HARD){st.textContent="❌ 150 MB से बड़ी फ़ाइल";return;}
        if(mb>MAX_SAFE&&!confirm(`फ़ाइल ${mb.toFixed(1)} MB है (100 MB से अधिक)। जारी रखें?`))return;
        st.textContent="⏳ प्रोसेसिंग हो रही है...";
        try{
          const bn=fs[0].name.replace(/\.[^.]+$/,"");
          if(mod==="to"){
            const pdf=cat==="image"?await imgsToPdf(fs):await txtToPdf(bn,await extractTxt(fs[0]));
            saveB(pdf,bn+"_APMBS.pdf","application/pdf");st.textContent="✅ PDF तैयार और सेव!";
          }else{
            if(cat==="audio"){
              const t=await pdfToTxt(fs[0]);
              if(window.AndroidNativeBridge&&window.AndroidNativeBridge.textToAudioFile)window.AndroidNativeBridge.textToAudioFile(t.slice(0,3800),"hi-IN",1.0,bn+"."+fmt);
              st.textContent="✅ ऑफ़लाइन ऑडियो निर्यात शुरू!";return;
            }
            if(cat==="image"&&window.pdfjsLib){
              const pdf=await pdfjsLib.getDocument({data:await fs[0].arrayBuffer()}).promise,n=Math.min(pdf.numPages,MAX_PG);
              for(let i=1;i<=n;i++){const p=await pdf.getPage(i),vp=p.getViewport({scale:1.8}),c=document.createElement("canvas");c.width=vp.width;c.height=vp.height;await p.render({canvasContext:c.getContext("2d"),viewport:vp}).promise;const b=Uint8Array.from(atob(c.toDataURL(fmt==="jpg"?"image/jpeg":"image/png",0.92).split(",")[1]),ch=>ch.charCodeAt(0));saveB(b,`${bn}_p${i}.${fmt}`,fmt==="jpg"?"image/jpeg":"image/png");}
              st.textContent=`✅ ${n} पेज इमेज सेव!`;return;
            }
            const t=await pdfToTxt(fs[0]),enc=new TextEncoder();
            if(fmt==="docx")saveB(buildDocx(bn,t),bn+".docx","application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            else if(fmt==="json")saveB(enc.encode(JSON.stringify({title:bn,text:t},null,2)),bn+".json","application/json");
            else if(fmt==="html")saveB(enc.encode(`<!doctype html><html><meta charset="utf-8"><body><pre>${t}</pre></body></html>`),bn+".html","text/html");
            else saveB(enc.encode(t),bn+"."+fmt,"text/plain;charset=utf-8");
            st.textContent="✅ फ़ाइल कन्वर्ट होकर सेव हुई!";
          }
        }catch(e){st.textContent="❌ त्रुटि: "+e.message;}
      };
    }
    m.style.display="block";
  }
  window.APMBSConverter={open:openConv};
})();
