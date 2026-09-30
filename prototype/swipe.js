// One vertical deck. Only transform and opacity change during navigation.
const deck=document.querySelector('#projects');
const cards=[...deck.querySelectorAll('.project-stage')];
let current=0;
let lastMove=-Infinity;
let dragStart=null;
let wheelAmount=0;
let wheelTimer;
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
cards.forEach((card,i)=>{
 card.querySelector('.project-info').remove();
 card.querySelectorAll('.stack-sheet,.under-poster').forEach(el=>el.remove());
 const caption=document.createElement('div');caption.className='reel-caption';
 const title=document.createElement('h2');title.textContent=projects[i].name;
 const goal=document.createElement('p');goal.textContent=goals[i];
 const foot=document.createElement('span');foot.className='caption-footer';foot.innerHTML=`<span>${durations[i]} <small>BUILD TIME · SAMPLE</small></span><span>${projects[i].year} <small>DESIGN & DEVELOPMENT</small></span>`;
 const label=document.createElement('span');label.className='goal-label';label.textContent='THE INTENTION';caption.append(label,goal,foot);card.querySelector('.project-poster').append(caption);
 card.setAttribute('aria-label',`${i+1} of ${cards.length}: ${projects[i].name}`);
 card.querySelector('.poster-title').textContent=projects[i].name;
 card.setAttribute('role','group');card.setAttribute('aria-roledescription','slide');
});
function positionCards(offset=0){
 const height=deck.clientHeight+24;
 cards.forEach((card,i)=>{const distance=i-current;const adjacent=Math.abs(distance)<=1;card.style.visibility=adjacent?'visible':'hidden';card.style.transform=`translate3d(0,${distance*height+offset}px,0)`;card.style.opacity=distance===0||offset!==0&&adjacent?'1':'0';});
}
function showProject(index,force=false){
 const next=Math.max(0,Math.min(cards.length-1,index));
 if(!force&&(next===current||performance.now()-lastMove<520))return;
 current=next;if(!force)lastMove=performance.now();
 cards.forEach((card,i)=>{card.classList.toggle('is-current',i===current);card.classList.toggle('is-before',i<current);card.classList.toggle('is-after',i>current);card.style.setProperty('--distance',Math.min(Math.abs(i-current),3));card.setAttribute('aria-hidden',i!==current);card.inert=i!==current;});
 positionCards();
 document.querySelector('#deck-title').textContent=projects[current].name;
 document.querySelector('#deck-count').textContent=`${String(current+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
 document.querySelector('#previous-project').disabled=current===0;
 document.querySelector('#next-project').disabled=current===cards.length-1;
}
document.querySelector('#previous-project').onclick=()=>showProject(current-1);
document.querySelector('#next-project').onclick=()=>showProject(current+1);
function canNavigate(e){return !document.querySelector('#work-panel').hidden&&!document.querySelector('dialog[open]')&&!e.target.closest?.('input,textarea,select,[contenteditable=true]');}
document.addEventListener('keydown',e=>{if(!canNavigate(e))return;const directions={ArrowDown:1,ArrowRight:1,PageDown:1,ArrowUp:-1,ArrowLeft:-1,PageUp:-1};if(e.code==='Space'&&!e.target.closest?.('button,a')){e.preventDefault();showProject(current+(e.shiftKey?-1:1));}else if(e.key in directions){e.preventDefault();showProject(current+directions[e.key]);}else if(e.key==='Home'||e.key==='End'){e.preventDefault();showProject(e.key==='Home'?0:cards.length-1);}});
deck.addEventListener('wheel',e=>{if(!canNavigate(e)||e.ctrlKey||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;e.preventDefault();clearTimeout(wheelTimer);wheelTimer=setTimeout(()=>wheelAmount=0,120);if(performance.now()-lastMove<580){wheelAmount=0;return;}wheelAmount+=e.deltaY*(e.deltaMode===1?16:1);if(Math.abs(wheelAmount)>45){showProject(current+(wheelAmount>0?1:-1));wheelAmount=0;}},{passive:false});
deck.addEventListener('pointerdown',e=>{if(e.button!==0||!canNavigate(e))return;dragStart={x:e.clientX,y:e.clientY,id:e.pointerId,time:performance.now()};deck.setPointerCapture(e.pointerId);});
let dragFrame;
function paintDrag(dy){const atEdge=(current===0&&dy>0)||(current===cards.length-1&&dy<0);positionCards(reduceMotion.matches?0:dy*(atEdge?.18:1));}
deck.addEventListener('pointermove',e=>{if(!dragStart||e.pointerId!==dragStart.id)return;const dy=e.clientY-dragStart.y;deck.classList.add('dragging');cancelAnimationFrame(dragFrame);dragFrame=requestAnimationFrame(()=>paintDrag(dy));});
function finishDrag(e){
 if(!dragStart)return;
 cancelAnimationFrame(dragFrame);
 const dy=e.clientY-dragStart.y,dx=e.clientX-dragStart.x;
 const velocity=Math.abs(dy)/Math.max(1,performance.now()-dragStart.time);
 dragStart=null;
 paintDrag(dy);
 void deck.offsetWidth;
 deck.classList.remove('dragging');
 if(e.type!=='pointercancel'&&Math.abs(dy)>Math.abs(dx)&&(Math.abs(dy)>deck.clientHeight*.16||Math.abs(dy)>35&&velocity>.45))showProject(current+(dy<0?1:-1),true);
 else positionCards();
}
deck.addEventListener('pointerup',finishDrag);deck.addEventListener('pointercancel',finishDrag);deck.addEventListener('lostpointercapture',()=>{if(!dragStart)return;cancelAnimationFrame(dragFrame);dragStart=null;deck.classList.remove('dragging');positionCards();});
addEventListener('resize',()=>{if(!dragStart)positionCards();});
showProject(0,true);
requestAnimationFrame(()=>requestAnimationFrame(()=>deck.classList.add('deck-ready')));
