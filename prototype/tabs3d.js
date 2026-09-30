document.body.classList.add('dimensional-tabs');
let chosen=0;
const stack=document.querySelector('#tiles');
const detailPanel=document.querySelector('#tab-detail');
let scrollFrame;
function chooseTab(index,scroll=true){
 const cards=[...stack.querySelectorAll('.tile')];if(!cards.length)return;
 chosen=Math.max(0,Math.min(index,cards.length-1));
 const compact=innerWidth<680;
 cards.forEach((card,i)=>{
  card.classList.toggle('selected',i===chosen);
  card.setAttribute('aria-pressed',i===chosen);
  card.style.setProperty('--shift',`${i<chosen?0:i===chosen?(compact?8:32):(compact?128:162)}px`);
 });
 const card=cards[chosen];const name=card.dataset.project?projects[Number(card.dataset.project)].name:'Say hello';
 document.querySelector('#stack-status').textContent=`${String(chosen+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')} — ${name.toUpperCase()}`;
 cancelAnimationFrame(scrollFrame);
 if(scroll)scrollFrame=requestAnimationFrame(()=>{
  if(card.isConnected)stack.scrollTo({left:card.offsetLeft-stack.offsetLeft-(compact?38:150),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 });
}

let sourceCard;
let fileAnimation;
let motionVersion=0;
let coverRevealTimer;
const reducedMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function rectTransform(from,to){return `translate(${from.left-to.left}px,${from.top-to.top}px) scale(${from.width/to.width},${from.height/to.height})`;}
function folderDetail(p){
 if(p.kind)return detail(p);
 const template=document.createElement('template');
 template.innerHTML=detail(p);
 const copy=template.content.querySelector('.project-copy');
 copy.querySelector('.eyebrow').textContent=p.type;
 copy.querySelector('h2').textContent=p.name;
 const caption=document.createElement('p');caption.className='project-statement';caption.innerHTML=p.title;copy.querySelector('h2').after(caption);
 const preview=template.content.querySelector('.preview');preview.classList.add('device-preview');
 let live=null;try{const url=new URL(p.liveUrl);if(['https:','http:'].includes(url.protocol))live=url.href;}catch{}
 if(live){const link=document.createElement('a');link.href=live;link.target='_blank';link.rel='noopener noreferrer';link.className='visit-project';link.textContent='Visit live website ↗';copy.append(link);const previewLink=document.createElement('a');previewLink.href=live;previewLink.target='_blank';previewLink.rel='noopener noreferrer';previewLink.className='device-link';previewLink.setAttribute('aria-label',`Visit ${p.name} website in a new tab`);preview.replaceWith(previewLink);previewLink.append(preview);}
 else{const status=document.createElement('span');status.className='project-offline';status.textContent='Concept preview · not live';copy.append(status);}
 return template.innerHTML;
}
async function openFile(card){
 if(detailPanel.open)return;
 const version=++motionVersion;
 const p=projects[Number(card.dataset.project)];
 sourceCard=card;
 const start=card.getBoundingClientRect();
 document.querySelector('#inline-title').textContent=`${p.name.toUpperCase()} / ${p.kind?'PERSONAL FILE':'SAMPLE PROJECT'}`;
 document.querySelector('#inline-content').innerHTML=folderDetail(p);
 detailPanel.dataset.page='details';
 const pageNav=document.createElement('nav');pageNav.className='file-page-nav';pageNav.setAttribute('aria-label','Folder pages');pageNav.innerHTML='<button data-file-page="details" aria-pressed="true">01 / Details</button><button data-file-page="preview" aria-pressed="false">02 / Preview ↗</button>';
 if(!p.kind)document.querySelector('#inline-content').prepend(pageNav);
 document.querySelector('#cover-project-name').innerHTML=p.kind?'':`<img src="covers/project-${Number(card.dataset.project)}.svg" alt="">`;
 detailPanel.style.setProperty('--file-color',p.color);
 detailPanel.classList.remove('revealed');
 detailPanel.showModal();
 detailPanel.scrollTop=0;
 document.body.classList.add('file-is-open');
 card.classList.add('source-open');
 const end=detailPanel.getBoundingClientRect();
 if(!reducedMotion()){
  const lifted={left:start.left+12,top:start.top-75,width:start.width*1.08,height:start.height*1.08};
  fileAnimation=detailPanel.animate([{transform:rectTransform(start,end),opacity:1,offset:0},{transform:rectTransform(lifted,end),opacity:1,offset:.32},{transform:'translate(0,0) scale(1)',opacity:1,offset:1}],{duration:690,easing:'cubic-bezier(.2,.85,.2,1)',fill:'both'});
  clearTimeout(coverRevealTimer);
  coverRevealTimer=setTimeout(()=>{if(version===motionVersion)detailPanel.classList.add('revealed');},240);
  await fileAnimation.finished.catch(()=>{});
  if(version!==motionVersion)return;
  fileAnimation.cancel();
 }
 detailPanel.classList.add('revealed');
 document.querySelector('#inline-close').focus({preventScroll:true});
}
async function closeFile(){
 if(!detailPanel.open)return;
 const version=++motionVersion;
 clearTimeout(coverRevealTimer);
 const current=detailPanel.getBoundingClientRect();
 fileAnimation?.cancel();
 const base=detailPanel.getBoundingClientRect();
 const target=sourceCard?.isConnected?sourceCard.getBoundingClientRect():current;
 detailPanel.classList.remove('revealed');
 if(!reducedMotion()){
  fileAnimation=detailPanel.animate([{transform:rectTransform(current,base),opacity:1},{transform:rectTransform(target,base),opacity:.65}],{duration:380,easing:'cubic-bezier(.5,0,.3,1)',fill:'both'});
  await fileAnimation.finished.catch(()=>{});
  if(version!==motionVersion)return;
 }
 detailPanel.close();
 fileAnimation?.cancel();
 document.body.classList.remove('file-is-open');
 sourceCard?.classList.remove('source-open');
 sourceCard?.focus({preventScroll:true});
}
stack.addEventListener('click',e=>{const card=e.target.closest('.tile');if(!card)return;const i=[...stack.children].indexOf(card);chooseTab(i,false);if(card.dataset.project)openFile(card);});
document.querySelector('#inline-close').onclick=closeFile;
detailPanel.addEventListener('cancel',e=>{e.preventDefault();closeFile();});
detailPanel.addEventListener('click',e=>{if(e.target===detailPanel){const r=detailPanel.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeFile();}});
document.querySelector('#stack-prev').onclick=()=>chooseTab(chosen-1);
document.querySelector('#stack-next').onclick=()=>chooseTab(chosen+1);
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{chosen=0;chooseTab(0,false);stack.scrollLeft=0;}));
stack.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();chooseTab(chosen+(e.key==='ArrowRight'?1:-1));stack.children[chosen].focus({preventScroll:true});}});
chooseTab(0,false);

let compactStack=innerWidth<680;addEventListener('resize',()=>{const next=innerWidth<680;if(next!==compactStack){compactStack=next;chooseTab(chosen,false);}});

detailPanel.addEventListener('click',e=>{const button=e.target.closest('[data-file-page]');if(!button)return;detailPanel.dataset.page=button.dataset.filePage;detailPanel.querySelectorAll('[data-file-page]').forEach(b=>b.setAttribute('aria-pressed',b===button));detailPanel.scrollTop=0;});
