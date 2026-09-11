if(new URLSearchParams(window.location.search).get('debug')==='map')document.body.classList.add('debug-map');
var modalTrigger=null;
var bookGestureShieldUntil=0;
document.addEventListener('click',function(e){
  if(performance.now()>bookGestureShieldUntil)return;
  if(e.target.closest&&e.target.closest('.painting-backdrop-trigger')){e.preventDefault();e.stopImmediatePropagation();}
},true);
function openM(id){var m=document.getElementById('m-'+id);if(m){modalTrigger=document.activeElement;m.classList.add('open');document.body.style.overflow='hidden';if(id==='thoughts'&&typeof startRealBook==='function')startRealBook();if(id==='phone')startInstagramVideo();var close=m.querySelector('[data-close]');if(close&&id!=='thoughts')close.focus({preventScroll:true});}}
var instagramVideo=document.querySelector('[data-instagram-video]');
function startInstagramVideo(){if(!instagramVideo)return;instagramVideo.volume=.35;var play=instagramVideo.play();if(play&&play.catch)play.catch(function(){});}
function stopInstagramVideo(){if(!instagramVideo)return;instagramVideo.pause();}
var phoneModal=document.getElementById('m-phone');
var phoneClosing=false;
var resumeModal=document.getElementById('m-resume');
var resumeClosing=false;
function closeResume(){
  if(!resumeModal||!resumeModal.classList.contains('open')){finishCloseAll();return;}
  if(resumeClosing)return;
  resumeClosing=true;
  var sheet=resumeModal.querySelector('.clipboard-sheet');
  if(sheet)sheet.classList.add('is-leaving');
  var duration=window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:540;
  window.setTimeout(function(){if(sheet)sheet.classList.remove('is-leaving');resumeClosing=false;finishCloseAll();},duration);
}
function closePhone(){
  if(!phoneModal||!phoneModal.classList.contains('open')){finishCloseAll();return;}
  if(phoneClosing)return;
  phoneClosing=true;phoneModal.classList.add('is-closing');
  var duration=window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:520;
  window.setTimeout(function(){phoneModal.classList.remove('is-closing');phoneClosing=false;finishCloseAll();},duration);
}
var paintingJourney=document.querySelector('.painting-journey');
var journeyAnimations=[];
var journeyTimer=0;
function cancelPaintingJourney(){clearTimeout(journeyTimer);journeyAnimations.forEach(function(animation){animation.cancel();});journeyAnimations=[];if(paintingJourney){paintingJourney.classList.remove('is-active');paintingJourney.style.opacity='';}}
function finishCloseAll(){cancelPaintingJourney();document.querySelectorAll('.modal').forEach(function(m){m.classList.remove('open');});document.body.style.overflow='';stopInstagramVideo();if(typeof stopBookVideo==='function')stopBookVideo();var sceneBook=document.querySelector('.layer-book');if(sceneBook&&sceneBook.dataset.lifting==='true'&&typeof window.returnLayeredBook==='function')window.returnLayeredBook();if(modalTrigger&&modalTrigger.focus)modalTrigger.focus();modalTrigger=null;}
function finishThoughtsClose(){
  cancelPaintingJourney();document.querySelectorAll('.modal').forEach(function(m){m.classList.remove('open');});document.body.style.overflow='';
  var deskFlower=document.querySelector('.work-flower-entry');if(deskFlower)deskFlower.classList.remove('is-desk-hidden');
  var note=document.querySelector('.layer-note');var sceneBook=document.querySelector('.layer-book');
  var noteStack=Array.from(document.querySelectorAll('.layer-note,.action-highlights,.note-reactions,.body-hotspots,.hotspot-layer'));
  if(!note){finishCloseAll();return;}
  noteStack.forEach(function(layer){layer.style.zIndex='9';});
  var motion=window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:620;
  var covers=noteStack.map(function(layer){return layer.animate([{transform:'translate3d(0,108%,0)'},{transform:'translate3d(0,0,0)'}],{duration:motion,easing:'cubic-bezier(0.77,0,0.175,1)',fill:'forwards'});});
  var cover=covers[0];
  var bookReturn=null;
  if(sceneBook){sceneBook.style.zIndex='8';bookReturn=sceneBook.animate([{transform:'translate3d(0,24%,0) rotate(2deg) scale(1.025)'},{transform:getComputedStyle(sceneBook).transform}],{duration:motion,easing:'cubic-bezier(0.77,0,0.175,1)',fill:'forwards'});}
  cover.finished.then(function(){covers.forEach(function(a){a.cancel();});if(bookReturn)bookReturn.cancel();noteStack.forEach(function(layer){layer.style.transform='';layer.style.zIndex='';});if(sceneBook&&typeof window.resetLayeredBook==='function')window.resetLayeredBook();}).catch(function(){});
}
function closeAll(){var thoughts=document.getElementById('m-thoughts');if(thoughts&&thoughts.classList.contains('open')&&typeof closeRealBook==='function'){closeRealBook(finishThoughtsClose);return;}if(phoneModal&&phoneModal.classList.contains('open')){closePhone();return;}if(resumeModal&&resumeModal.classList.contains('open')){closeResume();return;}finishCloseAll();}

var workProjects=Array.from(document.querySelectorAll('[data-project]'));
var workIndex=0;
var workChanging=false;
function showWorkProject(index,instant){
  if(!workProjects.length)return;
  var nextIndex=(index+workProjects.length)%workProjects.length;
  var current=workProjects[workIndex];
  var next=workProjects[nextIndex];
  if(instant||current===next){workProjects.forEach(function(project,i){project.hidden=i!==nextIndex;project.classList.toggle('is-current',i===nextIndex);project.classList.remove('is-leaving','is-entering');});workIndex=nextIndex;return;}
  if(workChanging)return;
  workChanging=true;
  current.classList.add('is-leaving');
  setTimeout(function(){
    current.hidden=true;current.classList.remove('is-current','is-leaving','is-entering');
    next.hidden=false;next.classList.remove('is-current','is-leaving');next.classList.add('is-entering');
    requestAnimationFrame(function(){requestAnimationFrame(function(){next.classList.remove('is-entering');next.classList.add('is-current');});});
    workIndex=nextIndex;
    setTimeout(function(){workChanging=false;},360);
  },280);
}
function enterPainting(trigger){
  modalTrigger=trigger;
  var stage=document.querySelector('.stage');
  if(!paintingJourney||!stage||window.matchMedia('(prefers-reduced-motion: reduce)').matches){showWorkProject(0,true);openM('work');return;}
  cancelPaintingJourney();
  var rect=stage.getBoundingClientRect();
  var camera=paintingJourney.querySelector('.painting-camera');
  camera.style.inset='auto';camera.style.left=rect.left+'px';camera.style.top=rect.top+'px';camera.style.width=rect.width+'px';camera.style.height=rect.height+'px';
  document.body.style.overflow='hidden';
  var targetX=rect.left+rect.width*.835,targetY=rect.top+rect.height*.10;
  var dx=innerWidth*.5-targetX,dy=innerHeight*.5-targetY;
  var scale=Math.max(innerWidth/rect.width,innerHeight/rect.height)*3.6;
  var flowerDetail=trigger.querySelector('.focus-flower-lift');
  if(flowerDetail)journeyAnimations.push(flowerDetail.animate([
    {opacity:1,transform:'translate3d(0,0,0) rotate(0deg) scale(1)'},
    {opacity:1,transform:'translate3d(1px,-3px,0) rotate(1deg) scale(1.035)'},
    {opacity:1,transform:'translate3d(0,0,0) rotate(0deg) scale(1)'}
  ],{duration:260,easing:'cubic-bezier(0.23, 1, 0.32, 1)'}));
  journeyTimer=setTimeout(function(){
    paintingJourney.classList.add('is-active');paintingJourney.style.opacity='1';
    journeyAnimations.push(camera.animate([
      {transform:'translate3d(0,0,0) scale(1)'},
      {transform:'translate3d('+dx+'px,'+dy+'px,0) scale('+scale+')'}
    ],{duration:1500,easing:'cubic-bezier(0.77, 0, 0.175, 1)',fill:'forwards'}));
    journeyTimer=setTimeout(function(){
      showWorkProject(0,true);openM('work');
      var fade=paintingJourney.animate([{opacity:1},{opacity:0}],{duration:420,easing:'cubic-bezier(0.23, 1, 0.32, 1)',fill:'forwards'});
      journeyAnimations.push(fade);
      fade.finished.then(function(){cancelPaintingJourney();}).catch(function(){});
    },1500);
  },260);
}
var pendingWorkTrigger=null;
function clearActionHighlights(){document.querySelectorAll('[data-highlight-layer]').forEach(function(layer){layer.classList.remove('is-active','is-locked');});}
function requestWorkAccess(el){
  clearActionHighlights();
  if(sessionStorage.getItem('portfolio-work-unlocked')==='yes'){enterPainting(el);return;}
  pendingWorkTrigger=el;openM('password');
  setTimeout(function(){var input=document.querySelector('[data-password-input]');if(input)input.focus();},0);
}
var passwordForm=document.querySelector('[data-password-form]');
if(passwordForm)passwordForm.addEventListener('submit',function(e){
  e.preventDefault();var input=document.querySelector('[data-password-input]');var error=document.querySelector('[data-password-error]');
  if(input&&input.value==='shareh0ld3rv4lu3'){
    sessionStorage.setItem('portfolio-work-unlocked','yes');document.getElementById('m-password').classList.remove('open');document.body.style.overflow='';
    if(error)error.textContent='';var trigger=pendingWorkTrigger;pendingWorkTrigger=null;if(trigger)enterPainting(trigger);
  }else{if(error)error.textContent='The password is incorrect. Please try again.';if(input){input.select();input.focus();}}
});
document.querySelectorAll('[data-modal]').forEach(function(el){el.addEventListener('click',function(e){
  e.preventDefault();
  if(el.dataset.suppressClick==='true'){ delete el.dataset.suppressClick; return; }
  if(el.getAttribute('data-modal')==='work'){requestWorkAccess(el);return;}
  if(el.getAttribute('data-modal')==='resume')setResume(el.dataset.resume);
  if(el.focus)el.focus({preventScroll:true});
  openM(el.getAttribute('data-modal'));
});});
function setResume(src){var preview=document.querySelector('[data-resume-preview]');var download=document.querySelector('[data-resume-download]');var name=src.indexOf('design')>-1?'design':src.indexOf('front-end')>-1?'frontend':'product';if(preview)preview.src='assets/resume-previews/'+name+'.png';if(download)download.href=src;}
var resumeDownload=document.querySelector('[data-resume-download]');
if(resumeDownload)resumeDownload.addEventListener('click',function(){
  closeResume();
});
document.querySelectorAll('.mapped-hot[role="button"]').forEach(function(el){el.addEventListener('keydown',function(e){
  if(e.key==='Enter'||e.key===' '){e.preventDefault();el.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));}
});});
document.querySelectorAll('.mapped-hot[data-highlight]').forEach(function(region){
  var hit=region.querySelector('.mapped-hit');
  var highlight=document.querySelector('[data-highlight-layer="'+region.dataset.highlight+'"]');
  if(hit&&highlight)hit.addEventListener('pointerdown',function(e){
    if(e.pointerType&&e.pointerType!=='mouse'){
      highlight.classList.remove('is-locked');highlight.classList.add('is-active');
      setTimeout(function(){highlight.classList.remove('is-active');},700);
      return;
    }
    highlight.classList.add('is-locked');highlight.classList.remove('is-active');
  });
});
if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
  document.querySelectorAll('.mapped-hot').forEach(function(region){
    var hit=region.querySelector('.mapped-hit');
    if(!hit)return;
    var highlight=region.dataset.highlight&&document.querySelector('[data-highlight-layer="'+region.dataset.highlight+'"]');
    hit.addEventListener('pointerenter',function(){document.querySelectorAll('.mapped-hot.is-hovered').forEach(function(active){if(active!==region)active.classList.remove('is-hovered');});document.querySelectorAll('[data-highlight-layer].is-active,[data-highlight-layer].is-locked').forEach(function(active){if(active!==highlight)active.classList.remove('is-active','is-locked');});region.classList.add('is-hovered');if(highlight&&!highlight.classList.contains('is-locked'))highlight.classList.add('is-active');});
    hit.addEventListener('pointerleave',function(){region.classList.remove('is-hovered');if(highlight&&!highlight.classList.contains('is-locked'))highlight.classList.remove('is-active');});
  });
  document.querySelectorAll('[data-reaction]').forEach(function(hit){if(hit.dataset.reaction==='name'){hit.addEventListener('pointerenter',startNameStickerHover);hit.addEventListener('pointerleave',endNameStickerHover);return;}var target=document.querySelector('.smiley-reaction');hit.addEventListener('pointerenter',function(){target.classList.add('is-active');});hit.addEventListener('pointerleave',function(){target.classList.remove('is-active');});});
}
var nameStickerCount=0,nameStickerLocked=false,nameStickerTimer=0;
function placeNameSticker(){var stickers=document.querySelectorAll('.name-sticker');var sticker=stickers[nameStickerCount];if(!sticker){clearInterval(nameStickerTimer);nameStickerTimer=0;return;}nameStickerCount+=1;sticker.classList.add('is-placed');}
function clearNameStickers(){clearInterval(nameStickerTimer);nameStickerTimer=0;nameStickerCount=0;document.querySelectorAll('.name-sticker').forEach(function(sticker){sticker.classList.remove('is-placed');});}
function startNameStickerHover(){if(nameStickerLocked)return;clearNameStickers();placeNameSticker();nameStickerTimer=setInterval(placeNameSticker,180);}
function endNameStickerHover(){clearInterval(nameStickerTimer);nameStickerTimer=0;if(!nameStickerLocked)clearNameStickers();}
function toggleNameStickers(){if(nameStickerLocked){nameStickerLocked=false;clearNameStickers();return;}nameStickerLocked=true;clearInterval(nameStickerTimer);nameStickerTimer=0;document.querySelectorAll('.name-sticker').forEach(function(sticker){sticker.classList.add('is-placed');});nameStickerCount=document.querySelectorAll('.name-sticker').length;}
var nameReactionHit=document.querySelector('[data-reaction="name"]');if(nameReactionHit)nameReactionHit.addEventListener('click',toggleNameStickers);
var smileyReactionTimer=0;
function showSmileyReaction(){var target=document.querySelector('.smiley-reaction');if(!target)return;target.classList.add('is-active');clearTimeout(smileyReactionTimer);smileyReactionTimer=setTimeout(function(){target.classList.remove('is-active');},1300);}
if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches){document.querySelectorAll('[data-reaction="smiley"]').forEach(function(hit){hit.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse')return;showSmileyReaction();});});}
var workHome=document.querySelector('[data-work-home]');if(workHome)workHome.addEventListener('click',closeAll);
var workPrevious=document.querySelector('[data-work-previous]');if(workPrevious)workPrevious.addEventListener('click',function(){showWorkProject(workIndex-1,false);});
var workNext=document.querySelector('[data-work-next]');if(workNext)workNext.addEventListener('click',function(){showWorkProject(workIndex+1,false);});
  document.querySelectorAll('[data-close]').forEach(function(b){b.addEventListener('click',closeAll);});
  document.querySelectorAll('.modal').forEach(function(m){m.addEventListener('click',function(e){if(m.id!=='m-thoughts'&&e.target===m)closeAll();});});
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){closeAll();return;}
  if(e.code==='Space'&&thoughtsModal&&thoughtsModal.classList.contains('open')&&realBookReader&&realBookReader.classList.contains('is-open')&&!realBookClosing){
    var interactive=e.target.closest&&e.target.closest('input,textarea,select,button,a,[contenteditable="true"]');
    if(!interactive||e.target===bookVideo){e.preventDefault();if(e.repeat)return;if(bookVideo.paused)startBookVideo();else bookVideo.pause();return;}
  }
  if(e.key!=='Tab')return;
  var modal=document.querySelector('.modal.open');
  if(!modal)return;
  var focusable=Array.from(modal.querySelectorAll('button:not(:disabled),a[href],input,textarea,select,[tabindex]:not([tabindex="-1"])')).filter(function(el){return !el.hidden&&el.getClientRects().length;});
  if(!focusable.length)return;
  var first=focusable[0],last=focusable[focusable.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
});
  document.querySelectorAll('.copybtn').forEach(function(btn){
    btn.addEventListener('click',function(){
      var tgt=document.getElementById(btn.getAttribute('data-target'));
      if(!tgt)return;
      var t=tgt.innerText.trim();
      function done(){ var o=btn.textContent; btn.textContent='copied!'; setTimeout(function(){btn.textContent=o;},1500); }
      if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(t).then(done).catch(function(){fallback(t);done();}); }
      else { fallback(t); done(); }
    });
  });
function fallback(t){ var ta=document.createElement('textarea'); ta.value=t; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select(); try{document.execCommand('copy');}catch(e){} document.body.removeChild(ta); }

var layeredStage=document.querySelector('.stage');
var layeredBook=document.querySelector('.layer-book');
var layeredBookHit=document.querySelector('.book-peek-hit');
if(layeredStage&&layeredBook){
  var layeredReduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var layeredState={x:0,y:0,rotation:0};
  var layeredDrag=null;
  var layeredIntroTimer=0;
  var layeredLiftAnimation=null;
  var layeredLiftTimer=0;
  var layeredHoverAnimation=null;

  function layeredTransform(state){
    return 'translate(-4%,-14%) translate3d('+state.x+'px,'+state.y+'px,0) rotate('+(state.rotation-4)+'deg) scale(.94)';
  }
  function layeredApply(state){
    layeredState=state;
    layeredBook.classList.remove('has-intro-transition','is-moved');
    layeredBook.style.transform=layeredTransform(state);
  }
  function layeredRest(){
    return {x:layeredBook.offsetWidth*-.09,y:layeredBook.offsetHeight*.12,rotation:-8};
  }
  function layeredRead(){
    var value=getComputedStyle(layeredBook).transform;
    if(!value||value==='none')return {x:0,y:0,rotation:0};
    var matrix=new DOMMatrixReadOnly(value);
    return {x:matrix.e,y:matrix.f,rotation:Math.atan2(matrix.b,matrix.a)*180/Math.PI};
  }
  function layeredClamp(state){
    var stageWidth=layeredStage.clientWidth,stageHeight=layeredStage.clientHeight;
    var bookWidth=layeredBook.offsetWidth,bookHeight=layeredBook.offsetHeight;
    var baseLeft=0,baseTop=0;
    var visibleX=Math.min(56,bookWidth*.2),visibleY=Math.min(44,bookHeight*.4);
    return {
      x:Math.max(-baseLeft-bookWidth+visibleX,Math.min(stageWidth-baseLeft-visibleX,state.x)),
      y:Math.max(-baseTop-bookHeight+visibleY,Math.min(stageHeight-baseTop-visibleY,state.y)),
      rotation:state.rotation
    };
  }
  function layeredStartIntro(){
    layeredApply({x:0,y:0,rotation:0});
  }
  function resetLayeredBook(){
    clearTimeout(layeredLiftTimer);
    if(layeredLiftAnimation)layeredLiftAnimation.cancel();
    layeredLiftAnimation=null;
    layeredBook.dataset.lifting='';
    layeredBook.style.zIndex='2';
    layeredBook.style.filter='';
    layeredApply(layeredState);
  }
  window.resetLayeredBook=resetLayeredBook;
  function returnLayeredBook(){
    clearTimeout(layeredLiftTimer);
    if(layeredLiftAnimation)layeredLiftAnimation.cancel();
    layeredBook.style.zIndex='8';
    layeredLiftAnimation=layeredBook.animate([
      {transform:'translate(-6%,2%) translate3d('+layeredState.x+'px,'+layeredState.y+'px,0) rotate(-7deg) scale(.82)',filter:'drop-shadow(0 28px 18px rgba(35,18,8,.42))'},
      {transform:layeredTransform(layeredState),filter:'drop-shadow(0 10px 8px rgba(35,18,8,.28))'}
    ],{duration:480,easing:'cubic-bezier(0.77, 0, 0.175, 1)',fill:'forwards'});
    layeredLiftAnimation.finished.then(function(){resetLayeredBook();}).catch(function(){});
  }
  window.returnLayeredBook=returnLayeredBook;
  function liftAndOpenBook(){
    if(layeredBook.dataset.lifting==='true')return;
    layeredBook.dataset.lifting='true';
    var deskFlower=document.querySelector('.work-flower-entry');if(deskFlower)deskFlower.classList.add('is-desk-hidden');
    var noteStack=Array.from(layeredStage.querySelectorAll('.layer-note,.action-highlights,.note-reactions,.body-hotspots,.hotspot-layer'));
    if(layeredReduce){noteStack.forEach(function(layer){layer.style.transform='translate3d(0,108%,0)';});openM('thoughts');return;}
    noteStack.forEach(function(layer){layer.style.zIndex='9';});
    var noteFrames=[
      {transform:'translate3d(0,0,0) rotate(0deg)'},
      {transform:'translate3d(-2px,28%,0) rotate(.25deg)',offset:.28},
      {transform:'translate3d(2px,67%,0) rotate(-.2deg)',offset:.66},
      {transform:'translate3d(0,108%,0) rotate(0deg)'}
    ];
    var noteMoves=noteStack.map(function(layer){return layer.animate(noteFrames,{duration:560,easing:'steps(4,end)',fill:'forwards'});});
    layeredLiftAnimation=noteMoves[0];
    layeredLiftAnimation.finished.then(function(){noteMoves.forEach(function(a){a.cancel();});noteStack.forEach(function(layer){layer.style.transform='translate3d(0,108%,0)';layer.style.zIndex='9';});modalTrigger=layeredBook;openM('thoughts');}).catch(function(){});
  }
  layeredBook.addEventListener('transitionend',function(e){
    if(e.propertyName==='transform'&&layeredBook.classList.contains('is-moved'))layeredApply(layeredRest());
  });
  layeredBookHit.addEventListener('pointerdown',function(e){
    e.preventDefault();
    e.stopPropagation();
    bookGestureShieldUntil=performance.now()+1200;
    clearTimeout(layeredIntroTimer);
    layeredApply(layeredState);
    layeredBook.classList.add('is-dragging');
    layeredBookHit.setPointerCapture(e.pointerId);
    layeredDrag={id:e.pointerId,startX:e.clientX,startY:e.clientY,baseX:layeredState.x,baseY:layeredState.y,distance:0};
  });
  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    layeredBookHit.addEventListener('pointerenter',function(){
      if(layeredDrag||layeredBook.dataset.lifting==='true')return;
      if(layeredHoverAnimation)layeredHoverAnimation.cancel();
      var base=layeredTransform(layeredState),raised='translate3d(0,-5px,0) '+base;
      layeredHoverAnimation=layeredBook.animate([{transform:base},{transform:'translate3d(0,-7px,0) '+base,offset:.62},{transform:raised}],{duration:220,easing:'cubic-bezier(.22,.8,.3,1)',fill:'forwards'});
    });
    layeredBookHit.addEventListener('pointerleave',function(){
      if(layeredDrag||layeredBook.dataset.lifting==='true')return;
      if(layeredHoverAnimation)layeredHoverAnimation.cancel();
      layeredHoverAnimation=layeredBook.animate([{transform:getComputedStyle(layeredBook).transform},{transform:layeredTransform(layeredState)}],{duration:140,easing:'ease-out',fill:'forwards'});
    });
  }
  layeredBookHit.addEventListener('pointermove',function(e){
    if(!layeredDrag||layeredDrag.id!==e.pointerId)return;
    var dx=e.clientX-layeredDrag.startX,dy=e.clientY-layeredDrag.startY;
    layeredDrag.distance=Math.hypot(dx,dy);
    layeredApply(layeredClamp({x:layeredDrag.baseX+dx,y:layeredDrag.baseY+dy,rotation:layeredState.rotation}));
    layeredBook.classList.add('is-dragging');
  });
  layeredBookHit.addEventListener('pointerup',function(e){
    if(!layeredDrag||layeredDrag.id!==e.pointerId)return;
    e.stopPropagation();
    var wasTap=layeredDrag.distance<6;
    bookGestureShieldUntil=performance.now()+650;
    layeredDrag=null;
    layeredBook.classList.remove('is-dragging');
    if(wasTap)liftAndOpenBook();
  });
  layeredBookHit.addEventListener('pointercancel',function(){bookGestureShieldUntil=performance.now()+350;layeredDrag=null;layeredBook.classList.remove('is-dragging');});
  layeredBookHit.addEventListener('keydown',function(e){
    if(e.key==='Enter'||e.key===' '){e.preventDefault();modalTrigger=layeredBook;liftAndOpenBook();}
  });
  window.addEventListener('resize',function(){
    if(!layeredDrag)layeredApply(layeredClamp(layeredState));
  });
  layeredStartIntro();
}

var stage=document.querySelector('.stage');
var book=document.querySelector('.scene-book');
if(stage&&book){
  var reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var state={x:0,y:0,rotation:0,scale:1};
  var drag=null;
  var moved=false;
  var frame=0;
  var entranceTimer=0;

  function restingState(){
    return {x:stage.clientWidth*.45,y:stage.clientHeight*.015,rotation:7,scale:.54};
  }
  function transform(s){
    return 'translate3d('+s.x+'px,'+s.y+'px,0) rotate('+s.rotation+'deg) scale('+s.scale+')';
  }
  function apply(s){ state=s; book.style.transform=transform(s); }
  function readTransform(){
    var value=getComputedStyle(book).transform;
    if(!value||value==='none')return state;
    var matrix=new DOMMatrixReadOnly(value);
    return {x:matrix.e,y:matrix.f,rotation:Math.atan2(matrix.b,matrix.a)*180/Math.PI,scale:Math.hypot(matrix.a,matrix.b)};
  }
  function clamp(s){
    var w=stage.clientWidth,h=stage.clientHeight;
    return {x:Math.max(-w*.24,Math.min(w*.47,s.x)),y:Math.max(-h*.25,Math.min(h*.37,s.y)),rotation:s.rotation,scale:s.scale};
  }
  function finishEntrance(){ book.classList.add('is-ready'); }
  function enter(){
    var rest=restingState();
    if(reduceMotion){ apply(rest); finishEntrance(); return; }
    entranceTimer=setTimeout(function(){
      var animation=book.animate([
        {transform:transform(state)},
        {transform:transform({x:rest.x*.94,y:rest.y*1.08,rotation:5,scale:.61}),offset:.82},
        {transform:transform(rest)}
      ],{duration:1020,easing:'cubic-bezier(0.77, 0, 0.175, 1)',fill:'forwards'});
      animation.finished.then(function(){ apply(rest); animation.cancel(); finishEntrance(); }).catch(function(){});
    },650);
  }
  function settle(vx,vy){
    cancelAnimationFrame(frame);
    function tick(){
      vx*=.9; vy*=.9;
      var next=clamp({x:state.x+vx*14,y:state.y+vy*14,rotation:state.rotation+vx*.08,scale:state.scale});
      apply(next);
      if(Math.abs(vx)+Math.abs(vy)>.12){ frame=requestAnimationFrame(tick); return; }
      var final=clamp({x:state.x,y:state.y,rotation:Math.max(-14,Math.min(14,state.rotation)),scale:state.scale});
      var animation=book.animate([{transform:transform(state)},{transform:transform(final)}],{duration:180,easing:'cubic-bezier(0.23, 1, 0.32, 1)',fill:'forwards'});
      animation.finished.then(function(){apply(final);animation.cancel();}).catch(function(){});
    }
    frame=requestAnimationFrame(tick);
  }
  book.addEventListener('pointerdown',function(e){
    cancelAnimationFrame(frame);
    clearTimeout(entranceTimer);
    var animations=book.getAnimations();
    animations.forEach(function(a){try{a.commitStyles();}catch(error){}});
    if(animations.length)state=readTransform();
    animations.forEach(function(a){a.cancel();});
    apply(state);
    book.classList.add('is-ready','is-dragging');
    book.setPointerCapture(e.pointerId);
    moved=false;
    drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,lastX:e.clientX,lastY:e.clientY,lastTime:performance.now(),baseX:state.x,baseY:state.y,vx:0,vy:0};
  });
  book.addEventListener('pointermove',function(e){
    if(!drag||drag.id!==e.pointerId)return;
    var now=performance.now(),dt=Math.max(8,now-drag.lastTime);
    var dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;
    if(Math.hypot(dx,dy)>7){moved=true;book.classList.add('is-raised');}
    drag.vx=(e.clientX-drag.lastX)/dt; drag.vy=(e.clientY-drag.lastY)/dt;
    drag.lastX=e.clientX;drag.lastY=e.clientY;drag.lastTime=now;
    apply(clamp({x:drag.baseX+dx,y:drag.baseY+dy,rotation:state.rotation,scale:state.scale}));
  });
  book.addEventListener('pointerup',function(e){
    if(!drag||drag.id!==e.pointerId)return;
    var velocity={x:drag.vx,y:drag.vy};
    drag=null;book.classList.remove('is-dragging');
    if(moved){ book.dataset.suppressClick='true'; e.preventDefault(); settle(velocity.x,velocity.y); }
  });
  book.addEventListener('pointercancel',function(){
    if(!drag)return;
    drag=null;book.classList.remove('is-dragging');settle(0,0);
  });
  book.addEventListener('click',function(){ moved=false; });
  window.addEventListener('resize',function(){ if(!drag&&book.classList.contains('is-ready'))apply(clamp(state)); });
  enter();
}

var realBookReader=document.querySelector('[data-real-book-reader]');
var realBookTimer=0;
var realBookPage=0;
var realBookOpening=false;
var realBookTurning=false;
var realBookClosing=false;
var bookVideo=realBookReader&&realBookReader.querySelector('[data-book-video]');
var bookVideoArmed=false;
var realBookDesktopPages=['assets/tabletop/openpage2.png','assets/tabletop/openpage3.png','assets/tabletop/openpage4.png','assets/tabletop/openpage5.png'];
var realBookMobilePages=['assets/tabletop/mobile/openpage2.png','assets/tabletop/mobile/openpage3.png','assets/tabletop/mobile/openpage4.png','assets/tabletop/mobile/openpage5.png'];
var realBookInitialMobile=window.matchMedia('(max-width:600px)').matches;
var realBookPages=realBookInitialMobile?realBookMobilePages:realBookDesktopPages;
var realBookInitialRoot=realBookInitialMobile?'assets/tabletop/mobile/':'assets/tabletop/';
var realBookPreloadAssets=[realBookInitialRoot+'book-closed.png',realBookInitialRoot+'book-slightly-open.png',realBookInitialRoot+'book-half-open.png'].concat(realBookPages);
var realBookPreloads=realBookPreloadAssets.map(function(src){var image=new Image();image.src=src;return image;});
function stopBookVideo(){
  if(!bookVideo)return;
  bookVideo.pause();
}
function armBookVideo(){
  if(!bookVideo)return;
  bookVideo.removeAttribute('muted');bookVideo.defaultMuted=false;bookVideo.muted=false;bookVideo.volume=0;
  bookVideoArmed=true;
  var play=bookVideo.play();
  if(play&&play.catch)play.catch(function(){});
}
function startBookVideo(){
  if(!bookVideo)return;
  bookVideo.removeAttribute('muted');bookVideo.defaultMuted=false;bookVideo.muted=false;bookVideo.volume=.38;
  var play=bookVideo.play();
  if(play&&play.catch)play.catch(function(){});
}
function startRealBook(){
  if(!realBookReader)return;
  clearTimeout(realBookTimer);
  var frame=realBookReader.querySelector('[data-real-book-frame]');
  var prev=realBookReader.querySelector('.book-prev');
  var next=realBookReader.querySelector('.book-next');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile=window.matchMedia('(max-width:600px)').matches;
  var root=mobile?'assets/tabletop/mobile/':'assets/tabletop/';
  realBookPages=mobile?realBookMobilePages:realBookDesktopPages;
  var opening=reduce?[realBookPages[0]]:[
    root+'book-closed.png',
    root+'book-slightly-open.png',
    root+'book-half-open.png',
    realBookPages[0]
  ];
  var step=0;
  realBookPage=0;realBookOpening=true;
  realBookReader.classList.remove('is-closing','is-open');realBookReader.classList.toggle('is-mobile-opening',mobile);
  realBookClosing=false;prev.disabled=true;next.disabled=true;
  function showNext(){
    frame.src=opening[step];
    frame.classList.remove('is-turning');
    step+=1;
    if(step<opening.length){realBookTimer=setTimeout(showNext,reduce?0:(mobile?95:130));return;}
    realBookOpening=false;prev.disabled=true;next.disabled=false;
    var reveal=function(){realBookReader.classList.add('is-open');startBookVideo();};
    if(reduce){reveal();return;}
    var decoded=frame.decode?frame.decode():Promise.resolve();
    decoded.catch(function(){}).then(function(){realBookTimer=setTimeout(reveal,mobile?60:80);});
  }
  showNext();
}
if(realBookReader){
  var realFrame=realBookReader.querySelector('[data-real-book-frame]');
  var realTurn=realBookReader.querySelector('[data-real-book-turn]');
  var realPrev=realBookReader.querySelector('.book-prev');
  var realNext=realBookReader.querySelector('.book-next');
  var realSwipe=null;
  var edgeFlutter=null;
  function showRealPage(nextIndex,direction){
    if(realBookOpening||realBookTurning||nextIndex<0||nextIndex>=realBookPages.length||nextIndex===realBookPage)return;
    if(edgeFlutter){edgeFlutter.cancel();edgeFlutter=null;realTurn.hidden=true;realTurn.classList.remove('is-fluttering');realTurn.style.clipPath='';}
    var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var mobile=window.matchMedia('(max-width:600px)').matches;
    realBookTurning=true;realPrev.disabled=true;realNext.disabled=true;
    if(reduce){finishTurn();return;}
    realTurn.src=realBookPages[realBookPage];realTurn.hidden=false;
    realFrame.src=realBookPages[nextIndex];
    realTurn.style.transformOrigin='50% 50%';
    var out=realTurn.animate(mobile?[
      {transform:'translate3d(0,0,0)',clipPath:'inset(0 0 0 0)',opacity:1},
      {transform:'translate3d('+(direction>0?'-3%':'3%')+',0,0)',clipPath:direction>0?'inset(0 0 0 100%)':'inset(0 100% 0 0)',opacity:.96}
    ]:[
      {transform:'rotateY(0deg)'},
      {transform:'rotateY('+(direction>0?-96:96)+'deg)'}
    ],{duration:mobile?220:360,easing:'cubic-bezier(0.77,0,0.175,1)',fill:'forwards'});
    out.finished.then(function(){out.cancel();finishTurn();}).catch(function(){realBookTurning=false;realTurn.hidden=true;});
    function finishTurn(){
      realBookPage=nextIndex;realFrame.src=realBookPages[realBookPage];
      realTurn.hidden=true;realTurn.style.transformOrigin='';completeTurn();
    }
    function completeTurn(){
      realBookTurning=false;
      realPrev.disabled=realBookPage===0;
      realNext.disabled=realBookPage===realBookPages.length-1;
    }
  }
  realPrev.addEventListener('click',function(){showRealPage(realBookPage-1,-1);});
  realNext.addEventListener('click',function(){showRealPage(realBookPage+1,1);});
  function flutterEdge(button,direction){
    if(button.disabled||button.dataset.fluttered==='true'||realBookOpening||realBookTurning)return;
    button.dataset.fluttered='true';
    realTurn.src=realFrame.src;realTurn.hidden=false;realTurn.classList.add('is-fluttering');
    realTurn.style.clipPath=direction>0?'inset(0 0 0 50%)':'inset(0 50% 0 0)';
    realTurn.style.transformOrigin='50% 50%';
    var flutter=realTurn.animate([
      {transform:'perspective(1800px) rotateY(0deg)'},
      {transform:'perspective(1800px) rotateY('+(direction>0?-.38:.38)+'deg)',offset:.5},
      {transform:'perspective(1800px) rotateY(0deg)'}
    ],{duration:220,easing:'cubic-bezier(0.23, 1, 0.32, 1)'});
    flutter.finished.then(function(){flutter.cancel();realTurn.hidden=true;realTurn.classList.remove('is-fluttering');realTurn.style.clipPath='';}).catch(function(){realTurn.hidden=true;realTurn.classList.remove('is-fluttering');realTurn.style.clipPath='';});
  }
  realNext.addEventListener('pointerenter',function(){flutterEdge(realNext,1);});
  realPrev.addEventListener('pointerenter',function(){flutterEdge(realPrev,-1);});
  realNext.addEventListener('pointerleave',function(){delete realNext.dataset.fluttered;});
  realPrev.addEventListener('pointerleave',function(){delete realPrev.dataset.fluttered;});
  realBookReader.addEventListener('pointerdown',function(e){realSwipe={id:e.pointerId,x:e.clientX,y:e.clientY};});
  realBookReader.addEventListener('pointerup',function(e){
    if(!realSwipe||realSwipe.id!==e.pointerId)return;
    var dx=e.clientX-realSwipe.x,dy=e.clientY-realSwipe.y;realSwipe=null;
    if(e.target.closest('.book-video-shell,.book-arrow,.journal-close'))return;
    if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.25){showRealPage(realBookPage+(dx<0?1:-1),dx<0?1:-1);return;}
    if(Math.abs(dx)<12&&Math.abs(dy)<12&&e.target.closest('.real-book-frame,.real-book-turn,.real-book-stage')){var direction=e.clientX<window.innerWidth/2?-1:1;showRealPage(realBookPage+direction,direction);}
  });
  realBookReader.addEventListener('pointercancel',function(){realSwipe=null;});
}

var thoughtsModal=document.getElementById('m-thoughts');
if(thoughtsModal)thoughtsModal.addEventListener('click',function(e){
  if(!thoughtsModal.classList.contains('open'))return;
  if(e.target.closest('.book-arrow,.journal-close'))return;
  if(window.matchMedia('(max-width:600px)').matches){
    var safeTargets=[thoughtsModal.querySelector('.real-book-stage'),thoughtsModal.querySelector('.book-video-shell')];
    var inSafeZone=safeTargets.some(function(target){if(!target)return false;var rect=target.getBoundingClientRect();return e.clientX>=rect.left-8&&e.clientX<=rect.right+8&&e.clientY>=rect.top-8&&e.clientY<=rect.bottom+8;});
    if(inSafeZone)return;
  }else if(e.target.closest('.real-book-frame,.real-book-turn,.book-video-shell'))return;
  closeAll();
});

function closeRealBook(done){
  if(!realBookReader||realBookClosing){if(done)done();return;}
  realBookClosing=true;realBookOpening=false;realBookTurning=false;
  clearTimeout(realBookTimer);stopBookVideo();realBookReader.classList.remove('is-open');realBookReader.classList.add('is-closing');
  var frame=realBookReader.querySelector('[data-real-book-frame]');
  var turn=realBookReader.querySelector('[data-real-book-turn]');
  var prev=realBookReader.querySelector('.book-prev');
  var next=realBookReader.querySelector('.book-next');
  if(turn)turn.hidden=true;
  if(prev)prev.disabled=true;
  if(next)next.disabled=true;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile=window.matchMedia('(max-width:600px)').matches;
  var root=mobile?'assets/tabletop/mobile/':'assets/tabletop/';
  var closing=reduce?[root+'book-closed.png']:[
    root+'book-half-open.png',
    root+'book-slightly-open.png',
    root+'book-closed.png'
  ];
  var step=0;
  function showNext(){
    frame.src=closing[step++];
    frame.style.transform=step%2?'translate3d(-2px,1px,0) rotate(-.18deg)':'translate3d(1px,-1px,0) rotate(.12deg)';
    if(step<closing.length){realBookTimer=setTimeout(showNext,reduce?0:(mobile?95:130));return;}
    realBookTimer=setTimeout(function(){frame.style.transform='';realBookClosing=false;if(done)done();},reduce?0:(mobile?60:80));
  }
  showNext();
}

var siteLoader=document.querySelector('[data-site-loader]');
if(siteLoader){
  var dismissSiteLoader=function(){siteLoader.classList.add('is-ready');};
  if(document.readyState==='complete')dismissSiteLoader();
  else window.addEventListener('load',function(){window.setTimeout(dismissSiteLoader,80);},{once:true});
  window.setTimeout(dismissSiteLoader,6500);
}
