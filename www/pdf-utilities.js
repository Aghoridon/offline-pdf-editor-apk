(function(){
  function sv(b,n){
    const u=b instanceof Uint8Array?b:new Uint8Array(b);let s="";
    for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));
    if(window.AndroidBlobDownloader&&window.AndroidBlobDownloader.saveBase64File){window.AndroidBlobDownloader.saveBase64File(btoa(s),n,"application/pdf","APMBS_Offline_PDFs");return;}
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([u],{type:"application/pdf"}));a.download=n;document.body.appendChild(a);a.click();a.remove();
  }
  const DB={
    open(){return new Promise((r,j)=>{const q=indexedDB.open("APMBS_Bin",1);q.onupgradeneeded=()=>q.result.createObjectStore("items",{keyPath:"id"});q.onsuccess=()=>r(q.result);q.onerror=()=>j(q.error);});},
    async add(name,bytes){const db=await this.open();const tx=db.transaction("items","readwrite");tx.objectStore("items").put({id:Date.now()+"_"+name,name,date:new Date().toLocaleString(),bytes});},
    async list(){const db=await this.open();return new Promise(r=>{const q=db.transaction("items").objectStore("items").getAll();q.onsuccess=()=>r(q.result||[]);});},
    async del(id){const db=await this.open();db.transaction("items","readwrite").objectStore("items").delete(id);}
  };
  window.APMBSRecycleBin=DB;
  function openUtil(){
    let m=document.getElementById("util-m");
    if(!m){
      m=document.createElement("div");m.id="util-m";m.className="m-bg";
      m.innerHTML='<div class="m-box"><div style="display:flex;justify-content:space-between;margin-bottom:8px;"><b>🛠️ PDF यूटिलिटी हब</b><button onclick="this.closest(\'.m-bg\').style.display=\'none\'" style="background:#7f1d1d;color:#fff;border:none;border-radius:6px;padding:4px 9px;">✕</button></div><select id="u-sel" style="width:100%;background:#0f172a;color:#fff;border:1px solid #475569;border-radius:8px;padding:8px;margin-bottom:8px;"><option value="write">✍️ नया PDF लिखें (Write PDF)</option><option value="search">🔍 PDF में शब्द खोजें (Search)</option><option value="gray">🌗 Grayscale / Invert (डार्क मोड)</option><option value="crop">✂️ पेज मार्जिन Crop करें</option><option value="nup">📑 2-in-1 Pages per Sheet</option><option value="unlock">🔓 Unlock / री-सेव PDF</option><option value="bin">🗑️ Recycle Bin (हटाई फ़ाइलें)</option></select><div id="u-body"></div><div id="u-st" style="font-size:12px;color:#34d399;margin-top:8px;"></div></div>';
      document.body.appendChild(m);
      const sel=document.getElementById("u-sel"),bd=document.getElementById("u-body"),st=document.getElementById("u-st");
      async function runTool(v){
        st.textContent="";
        if(v==="write"){
          bd.innerHTML='<input id="uw-t" placeholder="शीर्षक..." style="width:100%;background:#0f172a;color:#fff;border:1px solid #475569;border-radius:8px;padding:8px;margin-bottom:6px;"/><textarea id="uw-b" rows="4" placeholder="यहाँ लिखें..." style="width:100%;background:#0f172a;color:#fff;border:1px solid #475569;border-radius:8px;padding:8px;margin-bottom:6px;"></textarea><button id="uw-g" style="width:100%;background:#10b981;color:#052e16;border:none;border-radius:8px;padding:9px;font-weight:800;">📄 PDF बनाएं</button>';
          document.getElementById("uw-g").onclick=async()=>{
            const t=document.getElementById("uw-t").value||"APMBS_Note",tx=document.getElementById("uw-b").value||" ";
            const doc=await PDFLib.PDFDocument.create(),c=document.createElement("canvas");c.width=794;c.height=1123;const x=c.getContext("2d");
            x.fillStyle="#fff";x.fillRect(0,0,794,1123);x.fillStyle="#0f172a";x.font="bold 22px sans-serif";x.fillText(t,50,60);x.font="17px sans-serif";
            tx.split("\n").slice(0,32).forEach((l,i)=>x.fillText(l,50,100+i*29));
            const emb=await doc.embedPng(Uint8Array.from(atob(c.toDataURL("image/png").split(",")[1]),ch=>ch.charCodeAt(0)));
            doc.addPage([595.28,841.89]).drawImage(emb,{x:0,y:0,width:595.28,height:841.89});
            sv(await doc.save(),t.replace(/\s+/g,"_")+".pdf");st.textContent="✅ नया PDF सेव हुआ!";
          };
        }
        else if(v==="search"){
          bd.innerHTML='<input id="us-f" type="file" accept=".pdf" style="margin-bottom:6px;font-size:12px;"/><input id="us-q" placeholder="खोजने वाला शब्द..." style="width:100%;background:#0f172a;color:#fff;border:1px solid #475569;border-radius:8px;padding:8px;margin-bottom:6px;"/><button id="us-g" style="width:100%;background:#2563eb;color:#fff;border:none;border-radius:8px;padding:9px;font-weight:700;">🔍 खोजें</button><div id="us-r" style="font-size:12px;margin-top:6px;max-height:140px;overflow-y:auto;"></div>';
          document.getElementById("us-g").onclick=async()=>{
            const f=document.getElementById("us-f").files[0],q=(document.getElementById("us-q").value||"").toLowerCase(),r=document.getElementById("us-r");
            if(!f||!q||!window.pdfjsLib)return;const pdf=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise,hits=[];
            for(let i=1;i<=pdf.numPages;i++){const tc=await(await pdf.getPage(i)).getTextContent();if(tc.items.map(x=>x.str).join(" ").toLowerCase().includes(q))hits.push("पेज "+i);}
            r.textContent=hits.length?"मिला: "+hits.join(", "):"कोई परिणाम नहीं मिला";
          };
        }
        else if(v==="gray"){
          bd.innerHTML='<input id="ug-f" type="file" accept=".pdf" style="margin-bottom:6px;font-size:12px;"/><select id="ug-m" style="width:100%;background:#0f172a;color:#fff;border:1px solid #475569;border-radius:8px;padding:8px;margin-bottom:6px;"><option value="grayscale(100%)">Grayscale (B&W)</option><option value="invert(100%) hue-rotate(180deg)">Dark Mode (Invert)</option></select><button id="ug-g" style="width:100%;background:#10b981;color:#052e16;border:none;border-radius:8px;padding:9px;font-weight:800;">🌗 लागू करें</button>';
          document.getElementById("ug-g").onclick=async()=>{
            const f=document.getElementById("ug-f").files[0],flt=document.getElementById("ug-m").value;
            if(!f||!window.pdfjsLib)return;st.textContent="⏳ प्रोसेसिंग...";
            const pdf=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise,out=await PDFLib.PDFDocument.create();
            for(let i=1;i<=Math.min(pdf.numPages,100);i++){const p=await pdf.getPage(i),vp=p.getViewport({scale:1.5}),c=document.createElement("canvas");c.width=vp.width;c.height=vp.height;const x=c.getContext("2d");x.filter=flt;await p.render({canvasContext:x,viewport:vp}).promise;const emb=await out.embedJpg(Uint8Array.from(atob(c.toDataURL("image/jpeg",0.88).split(",")[1]),ch=>ch.charCodeAt(0)));out.addPage([vp.width,vp.height]).drawImage(emb,{x:0,y:0,width:vp.width,height:vp.height});}
            sv(await out.save(),"Filtered_"+f.name);st.textContent="✅ फ़िल्टर PDF सेव!";
          };
        }
        else if(v==="crop"){
          bd.innerHTML='<input id="uc-f" type="file" accept=".pdf" style="margin-bottom:6px;font-size:12px;"/><input id="uc-m" type="number" value="30" placeholder="मार्जिन (pt)" style="width:100%;background:#0f172a;color:#fff;border:1px solid #475569;border-radius:8px;padding:8px;margin-bottom:6px;"/><button id="uc-g" style="width:100%;background:#10b981;color:#052e16;border:none;border-radius:8px;padding:9px;font-weight:800;">✂️ Crop करें</button>';
          document.getElementById("uc-g").onclick=async()=>{
            const f=document.getElementById("uc-f").files[0],mg=Number(document.getElementById("uc-m").value||30);if(!f)return;
            const d=await PDFLib.PDFDocument.load(await f.arrayBuffer(),{ignoreEncryption:true});
            d.getPages().forEach(p=>{const{width:w,height:h}=p.getSize();p.setCropBox(mg,mg,Math.max(50,w-mg*2),Math.max(50,h-mg*2));});
            sv(await d.save(),"Cropped_"+f.name);st.textContent="✅ Crop PDF सेव!";
          };
        }
        else if(v==="nup"){
          bd.innerHTML='<input id="un-f" type="file" accept=".pdf" style="margin-bottom:6px;font-size:12px;"/><button id="un-g" style="width:100%;background:#10b981;color:#052e16;border:none;border-radius:8px;padding:9px;font-weight:800;">📑 2 पेज एक शीट पर जोड़ें</button>';
          document.getElementById("un-g").onclick=async()=>{
            const f=document.getElementById("un-f").files[0];if(!f)return;
            const src=await PDFLib.PDFDocument.load(await f.arrayBuffer(),{ignoreEncryption:true}),out=await PDFLib.PDFDocument.create(),pgs=src.getPages();
            for(let i=0;i<pgs.length;i+=2){
              const sh=out.addPage([841.89,595.28]),e1=await out.embedPage(pgs[i]);
              sh.drawPage(e1,{x:15,y:20,width:395,height:555});
              if(pgs[i+1]){const e2=await out.embedPage(pgs[i+1]);sh.drawPage(e2,{x:430,y:20,width:395,height:555});}
            }
            sv(await out.save(),"2in1_"+f.name);st.textContent="✅ 2-in-1 PDF सेव!";
          };
        }
        else if(v==="unlock"){
          bd.innerHTML='<input id="uu-f" type="file" accept=".pdf" style="margin-bottom:6px;font-size:12px;"/><button id="uu-g" style="width:100%;background:#10b981;color:#052e16;border:none;border-radius:8px;padding:9px;font-weight:800;">🔓 Unlock व री-सेव PDF</button>';
          document.getElementById("uu-g").onclick=async()=>{
            const f=document.getElementById("uu-f").files[0];if(!f)return;
            const d=await PDFLib.PDFDocument.load(await f.arrayBuffer(),{ignoreEncryption:true});
            sv(await d.save(),"Unlocked_"+f.name);st.textContent="✅ अनलॉक PDF सेव हुआ!";
          };
        }
        else if(v==="bin"){
          const items=await DB.list();
          bd.innerHTML='<input id="ub-f" type="file" accept=".pdf" style="margin-bottom:5px;font-size:12px;"/><button id="ub-a" style="width:100%;background:#334155;color:#fff;border:none;border-radius:7px;padding:7px;margin-bottom:8px;font-size:12px;font-weight:700;">📥 PDF को Recycle Bin में सुरक्षित रखें</button>'+(items.length?items.map(it=>`<div style="display:flex;justify-content:space-between;align-items:center;background:#0f172a;padding:6px 8px;border-radius:7px;margin-bottom:5px;font-size:12px;"><span>${it.name}</span><span><button data-r="${it.id}" style="background:#2563eb;color:#fff;border:none;border-radius:5px;padding:3px 7px;margin-right:4px;">Restore</button><button data-d="${it.id}" style="background:#7f1d1d;color:#fff;border:none;border-radius:5px;padding:3px 7px;">✕</button></span></div>`).join(""):'<div style="font-size:12px;color:#94a3b8;">Recycle Bin खाली है।</div>');
          document.getElementById("ub-a").onclick=async()=>{const f=document.getElementById("ub-f").files[0];if(!f)return;await DB.add(f.name,new Uint8Array(await f.arrayBuffer()));runTool("bin");};
          bd.querySelectorAll("[data-r]").forEach(b=>b.onclick=()=>{const it=items.find(x=>x.id===b.dataset.r);if(it)sv(it.bytes,it.name);});
          bd.querySelectorAll("[data-d]").forEach(b=>b.onclick=async()=>{await DB.del(b.dataset.d);runTool("bin");});
        }
      }
      sel.onchange=()=>runTool(sel.value);runTool("write");
    }
    m.style.display="block";
  }
  window.APMBSUtilities={open:openUtil};
})();
