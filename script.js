if(new URLSearchParams(window.location.search).get('debug')==='map')document.body.classList.add('debug-map');
var modalTrigger=null;
var bookGestureShieldUntil=0;
document.addEventListener('click',function(e){
  if(performance.now()>bookGestureShieldUntil)return;
  if(e.target.closest&&e.target.closest('.painting-backdrop-trigger,.painting-map')){e.preventDefault();e.stopImmediatePropagation();}
},true);
function openM(id){var m=document.getElementById('m-'+id);if(m){modalTrigger=document.activeElement;m.classList.add('open');document.body.style.overflow='hidden';if(id==='thoughts'&&typeof startRealBook==='function')startRealBook();if(id==='phone')startInstagramVideo();var close=m.querySelector('[data-close]');if(close&&id!=='thoughts')close.focus({preventScroll:true});}}
var instagramVideo=document.querySelector('[data-instagram-video]');
function startInstagramVideo(){if(!instagramVideo)return;instagramVideo.muted=true;var play=instagramVideo.play();if(play&&play.catch)play.catch(function(){});}
function stopInstagramVideo(){if(!instagramVideo)return;instagramVideo.pause();}
var phoneModal=document.getElementById('m-phone');
var phoneClosing=false;
var resumeModal=document.getElementById('m-resume');
var resumeClosing=false;
if(resumeModal)resumeModal.addEventListener('click',function(e){
  if(e.target===resumeModal||!e.target.closest('.clipboard-sheet'))closeResume();
});
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
  // Disable mix-blend-mode during animation so Chrome uses GPU compositing
  var blendLayers=document.querySelectorAll('[data-highlight-layer]');
  blendLayers.forEach(function(l){l.style.mixBlendMode='normal';});
  var motion=window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:620;
  var covers=noteStack.map(function(layer){return layer.animate([{transform:'translate3d(0,108%,0)'},{transform:'translate3d(0,0,0)'}],{duration:motion,easing:'cubic-bezier(0.77,0,0.175,1)',fill:'forwards'});});
  var cover=covers[0];
  var bookReturn=null;
  if(sceneBook){sceneBook.style.zIndex='8';bookReturn=sceneBook.animate([{transform:'translate3d(0,24%,0) rotate(2deg) scale(1.025)'},{transform:getComputedStyle(sceneBook).transform}],{duration:motion,easing:'cubic-bezier(0.77,0,0.175,1)',fill:'forwards'});}
  cover.finished.then(function(){covers.forEach(function(a){a.cancel();});if(bookReturn)bookReturn.cancel();noteStack.forEach(function(layer){layer.style.transform='';layer.style.zIndex='';});blendLayers.forEach(function(l){l.style.mixBlendMode='';});if(sceneBook&&typeof window.resetLayeredBook==='function')window.resetLayeredBook();}).catch(function(){});
}
function closeAll(){var wiModal=document.getElementById('m-workindex');if(wiModal&&wiModal.classList.contains('open')&&typeof window.closeWorkIndex==='function'){window.closeWorkIndex(finishThoughtsClose);return;}var thoughts=document.getElementById('m-thoughts');if(thoughts&&thoughts.classList.contains('open')&&typeof closeRealBook==='function'){closeRealBook(finishThoughtsClose);return;}if(phoneModal&&phoneModal.classList.contains('open')){closePhone();return;}if(resumeModal&&resumeModal.classList.contains('open')){closeResume();return;}finishCloseAll();}

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
function spinWorkFlower(trigger){
  // The daisy makes one full gentle turn as the notebook opens (skipped for reduced motion).
  if(!trigger||!trigger.querySelectorAll||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  // a gentle part turn, not a full spin; never stacks if clicked again mid-turn
  if(trigger.__turning)return;trigger.__turning=true;
  var parts=trigger.querySelectorAll('.focus-flower-lift,.work-flower-stroke,.work-flower-bloom');
  var anims=Array.prototype.map.call(parts,function(part){
    return part.animate([{rotate:'0deg'},{rotate:'150deg'}],{duration:900,easing:'cubic-bezier(.22,.61,.36,1)',composite:'add'});
  });
  Promise.all(anims.map(function(a){return a.finished;})).then(function(){trigger.__turning=false;},function(){trigger.__turning=false;});
}
function enterPainting(trigger){
  modalTrigger=trigger;
  if(typeof window.openWorkIndex==='function'){
    spinWorkFlower(trigger);
    // Same approach as clicking the composition book; only the destination differs.
    if(typeof window.liftAndOpenBook==='function'){window.__bookDestination=function(){window.openWorkIndex();};window.liftAndOpenBook();}
    else window.openWorkIndex();
    return;
  }
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
  if(window.warmWorkIndex)window.warmWorkIndex();
  pendingWorkTrigger=el;openM('password');
  setTimeout(function(){var input=document.querySelector('[data-password-input]');if(input)input.focus();},0);
}
var passwordForm=document.querySelector('[data-password-form]');
if(passwordForm)passwordForm.addEventListener('submit',function(e){
  e.preventDefault();var input=document.querySelector('[data-password-input]');var error=document.querySelector('[data-password-error]');
  if(input&&input.value==='shareh0ld3rv4lu3'){
    sessionStorage.setItem('portfolio-work-unlocked','yes');document.getElementById('m-password').classList.remove('open');document.body.style.overflow='';
    if(error)error.textContent='';var trigger=pendingWorkTrigger;pendingWorkTrigger=null;
    // iOS zooms in on the field. Order matters: blur first (keyboard leaves), on the next frame pin the scale,
    // hold the pin until visualViewport reports scale 1 (min 250ms, max 1500ms), restore pinch-zoom, then play.
    // Not zoomed (desktop, android, no visualViewport): play immediately. The frames are pre-decoded, so no stall.
    if(input)input.blur();
    var vp=document.querySelector('meta[name="viewport"]'),vpOld=vp&&vp.getAttribute('content');
    var vv=window.visualViewport;
    var zoomed=!!(vp&&vv&&vv.scale>1.01);
    if(!zoomed){if(trigger)enterPainting(trigger);}
    else requestAnimationFrame(function(){
      vp.setAttribute('content','width=device-width, initial-scale=1, maximum-scale=1');
      var t0=Date.now(),started=false;
      function play(){if(started)return;started=true;if(trigger)enterPainting(trigger);}
      (function check(){
        var el=Date.now()-t0;
        if((vv.scale<=1.01&&el>=250)||el>=1500){vp.setAttribute('content',vpOld);play();return;}
        setTimeout(check,50);
      })();
    });
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
['design','frontend','product'].forEach(function(n){new Image().src='assets/resume-previews/'+n+'.png';});
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
function startNameStickerHover(){if(nameStickerLocked)return;clearNameStickers();placeNameSticker();nameStickerTimer=setInterval(placeNameSticker,240);}
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
    layeredBook.style.zIndex='';
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
  // The approach (flower hides, the note slides away, the composition book is bared) is shared by every
  // entry that opens a book. By default it ends in the journal; the work-index diverts only the destination.
  function openBookDestination(){var d=window.__bookDestination;window.__bookDestination=null;if(d)d();else openM('thoughts');}
  function liftAndOpenBook(){
    if(layeredBook.dataset.lifting==='true')return;
    layeredBook.dataset.lifting='true';
    var deskFlower=document.querySelector('.work-flower-entry');if(deskFlower)deskFlower.classList.add('is-desk-hidden');
    var noteStack=Array.from(layeredStage.querySelectorAll('.layer-note,.action-highlights,.note-reactions,.body-hotspots,.hotspot-layer'));
    if(layeredReduce){noteStack.forEach(function(layer){layer.style.transform='translate3d(0,108%,0)';});openBookDestination();return;}
    noteStack.forEach(function(layer){layer.style.zIndex='9';});
    layeredBook.style.zIndex='3';
    var noteFrames=[
      {transform:'translate3d(0,0,0) rotate(0deg)'},
      {transform:'translate3d(-2px,28%,0) rotate(.25deg)',offset:.28},
      {transform:'translate3d(2px,67%,0) rotate(-.2deg)',offset:.66},
      {transform:'translate3d(0,108%,0) rotate(0deg)'}
    ];
    var noteMoves=noteStack.map(function(layer){return layer.animate(noteFrames,{duration:560,easing:'steps(4,end)',fill:'forwards'});});
    layeredLiftAnimation=noteMoves[0];
    layeredLiftAnimation.finished.then(function(){noteMoves.forEach(function(a){a.cancel();});noteStack.forEach(function(layer){layer.style.transform='translate3d(0,108%,0)';layer.style.zIndex='9';});modalTrigger=layeredBook;openBookDestination();}).catch(function(){});
  }
  window.liftAndOpenBook=liftAndOpenBook;
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
  bookVideo.currentTime=0;
  bookVideo.removeAttribute('muted');bookVideo.defaultMuted=false;bookVideo.muted=false;bookVideo.volume=.38;
  if(bookMuteBtn){bookMuteBtn.textContent='🔊';bookMuteBtn.setAttribute('aria-label','Mute');}
  var play=bookVideo.play();
  if(play&&play.catch)play.catch(function(){});
}
var bookMuteBtn=realBookReader&&realBookReader.querySelector('.book-mute-btn');
if(bookMuteBtn&&bookVideo){
  bookMuteBtn.addEventListener('click',function(e){
    e.stopPropagation();
    bookVideo.muted=!bookVideo.muted;
    bookMuteBtn.textContent=bookVideo.muted?'🔇':'🔊';
    bookMuteBtn.setAttribute('aria-label',bookVideo.muted?'Unmute':'Mute');
  });
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
  // Pre-decode all opening frames so swaps are instant (no blank flash on mobile)
  var openingDecoded=reduce?Promise.resolve():Promise.all(opening.map(function(src){
    var img=new Image();img.src=src;
    return (img.decode?img.decode():Promise.resolve()).catch(function(){});
  }));
  function showNext(){
    frame.src=opening[step];
    frame.classList.remove('is-turning');
    step+=1;
    if(step<opening.length){realBookTimer=setTimeout(showNext,reduce?0:(mobile?110:130));return;}
    realBookOpening=false;prev.disabled=true;next.disabled=false;
    var reveal=function(){realBookReader.classList.add('is-open');startBookVideo();};
    if(reduce){reveal();return;}
    var decoded=frame.decode?frame.decode():Promise.resolve();
    decoded.catch(function(){}).then(function(){realBookTimer=setTimeout(reveal,mobile?60:80);});
  }
  openingDecoded.then(function(){showNext();});
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
    realTurn.style.clipPath=direction>0?'inset(0 0 0 50%)':'inset(0 50% 0 0)';
    realTurn.style.transformOrigin='50% 50%';
    var out=realTurn.animate(mobile?[
      {transform:'scaleX(1)'},
      {transform:'scaleX(0)'}
    ]:[
      {transform:'rotateY(0deg)'},
      {transform:'rotateY('+(direction>0?-96:96)+'deg)'}
    ],{duration:mobile?220:360,easing:'cubic-bezier(0.77,0,0.175,1)',fill:'forwards'});
    out.finished.then(function(){out.cancel();finishTurn();}).catch(function(){realBookTurning=false;realTurn.hidden=true;});
    function finishTurn(){
      realBookPage=nextIndex;realFrame.src=realBookPages[realBookPage];
      realTurn.hidden=true;realTurn.style.transformOrigin='';realTurn.style.clipPath='';completeTurn();
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

// Repeating hint: pulse "see my work" label on touch devices until first tap
(function(){
  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  var entry=document.querySelector('.work-flower-entry');
  if(!entry)return;
  function startHint(){entry.classList.add('has-hint');}
  function stopHint(){entry.classList.remove('has-hint');}
  entry.addEventListener('click',stopHint,{once:true});
  var loaderEl=document.getElementById('loader');
  if(!loaderEl){setTimeout(startHint,800);return;}
  var obs=new MutationObserver(function(){
    if(!document.getElementById('loader')){obs.disconnect();setTimeout(startHint,800);}
  });
  obs.observe(document.body,{childList:true});
})();

// External links via data-ext-href — avoids iOS about:blank bug from SVG <a>
document.querySelectorAll('[data-ext-href]').forEach(function(el){
  el.addEventListener('click',function(e){
    e.preventDefault();
    e.stopPropagation();
    window.open(el.dataset.extHref,'_blank','noopener,noreferrer');
  });
  el.addEventListener('keydown',function(e){
    if(e.key==='Enter'||e.key===' '){e.preventDefault();window.open(el.dataset.extHref,'_blank','noopener,noreferrer');}
  });
});

/* ===== Work index (additive): reuses the book-opening frame sequence, then shows the list ===== */
(function(){
  var modal=document.getElementById('m-workindex');
  if(!modal)return;
  var stage=modal.querySelector('[data-wi-stage]');
  var frame=modal.querySelector('[data-wi-frame]');
  var timer=0;
  var run=0;
  // The four stop-motion frames are large; fetch and decode them once, ahead of time (on idle, and again the
  // moment the password box opens), and keep the decoded images alive so the open never waits on them.
  var warmed={};
  function wiFrames(){
    var mobile=window.matchMedia('(max-width:600px)').matches;
    var root=mobile?'assets/tabletop/mobile/':'assets/tabletop/';
    return [root+'book-closed.png',root+'book-slightly-open.png',root+'book-half-open.png','assets/tabletop/open-comp-blank.png'];
  }
  function warm(src){
    if(!warmed[src]){var img=new Image();img.src=src;warmed[src]={img:img,ready:(img.decode?img.decode():Promise.resolve()).catch(function(){})};}
    return warmed[src].ready;
  }
  function warmWorkIndex(){return Promise.all(wiFrames().map(warm));}
  window.warmWorkIndex=warmWorkIndex;
  function warmLater(){var go=function(){warmWorkIndex();};if(window.requestIdleCallback)requestIdleCallback(go,{timeout:4000});else setTimeout(go,2500);}
  if(document.readyState==='complete')warmLater();else window.addEventListener('load',warmLater);
  function openWorkIndex(instant){
    var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var mobile=window.matchMedia('(max-width:600px)').matches;
    var all=wiFrames(),spread=all[3];
    var frames=(reduce||instant===true)?[spread]:all;
    var mine=++run,step=0;
    clearTimeout(timer);closing=false;frame.style.transform='';
    stage.classList.remove('is-open','is-leaving');
    openM('workindex');
    function show(){
      if(mine!==run||!modal.classList.contains('open'))return;
      frame.src=frames[step];step+=1;
      if(step<frames.length){timer=setTimeout(show,mobile?110:130);return;}
      timer=setTimeout(function(){
        if(mine!==run||!modal.classList.contains('open'))return;
        stage.classList.add('is-open');
        if(!stage.hasAttribute('tabindex'))stage.setAttribute('tabindex','-1');stage.style.outline='none';stage.focus({preventScroll:true});
      },reduce?0:80);
    }
    Promise.all(frames.map(warm)).then(show);
  }
  var closing=false;
  // Mirrors closeRealBook(): same frames, same timings, same frame jitter, then back to the page.
  function closeWorkIndex(done){
    if(closing)return;
    closing=true;run+=1;clearTimeout(timer);
    stage.classList.remove('is-open','is-leaving');
    var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var mobile=window.matchMedia('(max-width:600px)').matches;
    var root=mobile?'assets/tabletop/mobile/':'assets/tabletop/';
    var seq=reduce?[root+'book-closed.png']:[root+'book-half-open.png',root+'book-slightly-open.png',root+'book-closed.png'];
    var step=0;
    function next(){
      frame.src=seq[step++];
      frame.style.transform=step%2?'translate3d(-2px,1px,0) rotate(-.18deg)':'translate3d(1px,-1px,0) rotate(.12deg)';
      if(step<seq.length){timer=setTimeout(next,reduce?0:(mobile?95:130));return;}
      timer=setTimeout(function(){frame.style.transform='';closing=false;if(window.location.hash==='#work-index'&&history.replaceState)history.replaceState(null,'',window.location.pathname+window.location.search);if(done)done();},reduce?0:(mobile?60:80));
    }
    next();
  }
  window.closeWorkIndex=closeWorkIndex;
  window.openWorkIndex=openWorkIndex;
  var diving=false;
  var DIVE_MS=740;
  // Dive-in: the camera dollies toward the clicked tile. Depth is faked with three scale rates:
  // paper spread (far), clicked tile ink + marker (near), other tiles (fade out early).
  function diveInto(link,href){
    var sr=stage.getBoundingClientRect(),lr=link.getBoundingClientRect();
    var cx=lr.left+lr.width/2-sr.left,cy=lr.top+lr.height/2-sr.top;
    var dx=window.innerWidth/2-(lr.left+lr.width/2),dy=window.innerHeight/2-(lr.top+lr.height/2);
    var far=3.2,near=1.3;
    var ease='cubic-bezier(.5,0,.85,.35)';
    var wash=document.createElement('div');wash.className='wi-wash';modal.appendChild(wash);
    var art=link.querySelector('.wi-art'),hl=link.querySelector('.wi-hl');
    var opts={duration:DIVE_MS,easing:ease,fill:'forwards'};
    var anims=[];
    stage.style.transformOrigin=cx+'px '+cy+'px';
    stage.style.transition='none';
    // translate leads (the tile reaches centre early), scale accelerates (the fall): separate easings
    anims.push(stage.animate([{translate:'0 0'},{translate:dx+'px '+dy+'px'}],{duration:DIVE_MS,easing:'cubic-bezier(.25,.1,.35,1)',fill:'forwards'}));
    anims.push(stage.animate([{scale:'1'},{scale:String(far)}],opts));
    Array.prototype.forEach.call(stage.querySelectorAll('.wi-entry'),function(en){
      if(en===link)return;
      anims.push(en.animate([{opacity:1},{opacity:0,offset:.35},{opacity:0}],{duration:DIVE_MS,easing:'linear',fill:'forwards'}));
    });
    if(art)anims.push(art.animate([{transform:'scale(1)'},{transform:'scale('+near+')'}],opts));
    if(hl){
      hl.style.transition='none';
      anims.push(hl.animate([{opacity:0,clipPath:'inset(0 100% 0 0)'},{opacity:.62,clipPath:'inset(0 0% 0 0)',offset:.35},{opacity:.9,clipPath:'inset(0 0 0 0)',offset:.6},{opacity:.4,clipPath:'inset(0 0 0 0)'}],{duration:DIVE_MS,easing:'linear',fill:'forwards'}));
    }
    anims.push(wash.animate([{opacity:0},{opacity:0,offset:.72},{opacity:1}],{duration:DIVE_MS,easing:'ease-in',fill:'forwards'}));
    var go=function(){window.location.href=href;};
    Promise.all(anims.map(function(a){return a.finished;})).then(function(){setTimeout(go,60);},go);
  }
  stage.addEventListener('click',function(e){
    var link=e.target.closest('a.wi-entry');
    if(!link)return;
    if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0)return;
    var href=link.getAttribute('href');
    if(/^mailto:/i.test(href))return;
    e.preventDefault();
    if(diving)return;
    // the case opens in a windows 98 browser growing from the exact pixel clicked (keyboard: the entry's centre)
    if(window.wwOpen){
      var lr=link.getBoundingClientRect(),px=e.detail?e.clientX:lr.left+lr.width/2,py=e.detail?e.clientY:lr.top+lr.height/2;
      if(window.wwOpen(link,px,py))return;
    }
    diving=true;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!stage.animate){
      stage.style.transition='opacity 140ms linear';stage.style.opacity='0';
      setTimeout(function(){window.location.href=href;},150);
      return;
    }
    diveInto(link,href);
  });
  // Coming back via the browser's back button restores the page from cache: undo the dive.
  window.addEventListener('pageshow',function(ev){
    if(!ev.persisted)return;
    diving=false;
    stage.getAnimations({subtree:true}).forEach(function(a){a.cancel();});
    stage.style.transformOrigin='';stage.style.transition='';stage.style.opacity='';
    var w=modal.querySelector('.wi-wash');if(w)w.remove();
  });
  // Tapping the painting around the open spread closes it. The sheet/stage/frame boxes are larger than the book
  // (and fill the screen on mobile), so a tap on them closes unless it lands on an opaque pixel of the book art.
  var hitCanvas=null,hitSrc='';
  function onBook(x,y){
    var r=frame.getBoundingClientRect(),nw=frame.naturalWidth,nh=frame.naturalHeight;if(!nw||!nh)return true;
    var s=Math.min(r.width/nw,r.height/nh),ox=r.left+(r.width-nw*s)/2,oy=r.top+(r.height-nh*s)/2;
    var ix=Math.floor((x-ox)/s),iy=Math.floor((y-oy)/s);if(ix<0||iy<0||ix>=nw||iy>=nh)return false;
    try{
      if(hitSrc!==frame.currentSrc){hitCanvas=document.createElement('canvas');hitCanvas.width=nw;hitCanvas.height=nh;hitCanvas.getContext('2d',{willReadFrequently:true}).drawImage(frame,0,0);hitSrc=frame.currentSrc;}
      return hitCanvas.getContext('2d').getImageData(ix,iy,1,1).data[3]>40;
    }catch(err){return true;}
  }
  modal.addEventListener('click',function(e){
    if(diving||closing||!stage.classList.contains('is-open'))return;
    var t=e.target;if(t!==modal&&t!==stage&&t!==frame&&t!==modal.querySelector('.wi-sheet')&&t!==modal.querySelector('.wi-list'))return;
    if(t===modal||!onBook(e.clientX,e.clientY))closeAll();
  });
  function fromHash(){if(window.location.hash==='#work-index'&&!modal.classList.contains('open'))openWorkIndex();}
  window.addEventListener('hashchange',fromHash);
  // Arriving from a case page ("↑ notebook"): the book plays its real opening flip into the spread.
  // Back from a case page ("notebook"): the reverse of the dive. The spread is already open, the camera starts
  // close on that project's tile and pulls back out to the whole page. No close, no re-open flip.
  function zoomOutFrom(slug){
    // the page arrives covered in the desk canvas; the cover lifts only once the spread is decoded,
    // so there is no flash of the desk scene or the closed book
    var root=document.documentElement,spreadSrc='assets/tabletop/open-comp-blank.png',pre=new Image();pre.src=spreadSrc;
    (pre.decode?pre.decode():Promise.resolve()).catch(function(){}).then(function(){
      openWorkIndex(true);frame.src=spreadSrc;stage.classList.add('is-open');
      zoomRun(slug);
      requestAnimationFrame(function(){root.classList.remove('wi-boot');});
    });
  }
  // Back from a case page: no paper wash. The desk canvas covers the arrival, the decoded spread settles in
  // over 220ms (a slight pull-back), and the tile she came from keeps its marker for a moment.
  function zoomRun(slug){
    var link=slug&&stage.querySelector('.wi-entry[data-wi-slug="'+slug+'"]');
    if(link){link.classList.add('ww-from');setTimeout(function(){link.classList.remove('ww-from');},1400);}
    if(!stage.animate||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    stage.style.transition='none';
    var a=stage.animate([{opacity:0,scale:'1.04'},{opacity:1,scale:'1'}],{duration:220,easing:'cubic-bezier(.2,.7,.3,1)'});
    a.finished.then(function(){stage.style.transition='';},function(){stage.style.transition='';});
  }
  if(window.location.hash==='#work-index'){
    var fromSlug=null;try{fromSlug=sessionStorage.getItem('wi-from');sessionStorage.removeItem('wi-from');}catch(e){}
    zoomOutFrom(fromSlug);
  }
})();

// touch devices can't hover: show the book's "open me" for ~3s after the desk settles, and again each time a modal closes back to the desk
(function(){
  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  var arc=document.querySelector('.book-arc');if(!arc)return;
  var t=0;
  function hint(){clearTimeout(t);arc.classList.add('is-hint');t=setTimeout(function(){arc.classList.remove('is-hint');},3000);}
  function atRest(){return !document.querySelector('.modal.open');}
  window.addEventListener('load',function(){setTimeout(function(){if(atRest())hint();},1200);},{once:true});
  var was=!atRest();
  new MutationObserver(function(){var open=!atRest();if(was&&!open)setTimeout(function(){if(atRest())hint();},400);was=open;}).observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
})();

// Work window: a windows 98 browser that grows out of the exact pixel you clicked on the notebook,
// loads the case page (?win=1 hides its own chrome), walks prev/next, minimizes to a taskbar, drags and resizes.
(function(){
  var modal=document.getElementById('m-workindex');if(!modal)return;
  var stage=modal.querySelector('[data-wi-stage]');
  var cases=Array.prototype.filter.call(modal.querySelectorAll('a.wi-entry'),function(a){return !/^mailto:/i.test(a.getAttribute('href'));}).map(function(a){
    var href=a.getAttribute('href'),m=href.match(/work\/([^\/]+)\//),img=a.querySelector('.wi-hand');
    return {link:a,href:href,slug:m?m[1]:'',name:img?img.getAttribute('alt'):m[1]};
  });
  if(!cases.length)return;
  var SV={
    ie:'<svg class="ww-ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.2a5.8 5.8 0 1 0 5.6 7.3h-3a2.9 2.9 0 0 1-5.4-1h8.5A5.8 5.8 0 0 0 8 2.2zm-2.7 5a2.8 2.8 0 0 1 5.4 0z" fill="#1d64d6"/><path d="M1.2 11.6C.4 8.4 6.3 3.6 11.7 2c2.6-.8 3.8.1 3.2 1.9" fill="none" stroke="#f2b705" stroke-width="1.3"/></svg>',
    min:'<svg viewBox="0 0 8 7" aria-hidden="true"><rect x="1" y="5" width="6" height="2"/></svg>',
    max:'<svg viewBox="0 0 9 9" aria-hidden="true" style="width:9px;height:9px"><path d="M0 0h9v9H0zM1 2v6h7V2z" fill-rule="evenodd"/></svg>',
    rest:'<svg viewBox="0 0 9 9" aria-hidden="true" style="width:9px;height:9px"><path d="M2 0h7v6H7V2H2zM0 3h6v6H0zm1 2v3h4V5z" fill-rule="evenodd"/></svg>',
    x:'<svg viewBox="0 0 8 7" aria-hidden="true"><path d="M0 0h2l2 2 2-2h2v1L5 3.5 8 6v1H6L4 5 2 7H0V6l3-2.5L0 1z"/></svg>',
    back:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2 10l8-7v4h8v6h-8v4z" fill="#2f9e2f" stroke="#0b4f0b" stroke-width="1"/></svg>',
    fwd:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M18 10l-8-7v4H2v6h8v4z" fill="#2f9e2f" stroke="#0b4f0b" stroke-width="1"/></svg>',
    stop:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 2h8l4 4v8l-4 4H6l-4-4V6z" fill="#d81e1e" stroke="#6b0000"/><path d="M7 7l6 6M13 7l-6 6" stroke="#fff" stroke-width="2"/></svg>',
    refresh:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M15.5 7.5A6 6 0 1 0 16 12" fill="none" stroke="#1d64d6" stroke-width="2.4"/><path d="M12 7.8h5.6V2.2z" fill="#1d64d6"/></svg>',
    home:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2l8 7h-2.5v9h-4v-5h-3v5h-4V9H2z" fill="#e8c85a" stroke="#6b4e00"/><rect x="13" y="3" width="2" height="4" fill="#a33"/></svg>',
    page:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 1h7l3 3v11H3z" fill="#fff" stroke="#000"/><path d="M10 1v3h3" fill="none" stroke="#000"/><circle cx="8" cy="10" r="3" fill="#1d64d6"/></svg>',
    globe:'<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="#3a8ee6" stroke="#0a3d8a"/><path d="M4 5c2 1 3-1 4 1s-2 3 0 5M10 3c-1 2 2 2 3 4" fill="none" stroke="#2c9b33" stroke-width="2"/></svg>',
    drop:'<svg viewBox="0 0 7 4" aria-hidden="true"><path d="M0 0h7L3.5 4z"/></svg>',
    go:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h9V4l4 4-4 4V8" fill="#2f9e2f" stroke="#0b4f0b"/></svg>',
    throb:'<svg viewBox="0 0 26 26" aria-hidden="true"><path d="M13 2c3 3 3 8 0 11-3-3-3-8 0-11z" fill="#f2492c"/><path d="M24 13c-3 3-8 3-11 0 3-3 8-3 11 0z" fill="#7cc242"/><path d="M13 24c-3-3-3-8 0-11 3 3 3 8 0 11z" fill="#20a0e8"/><path d="M2 13c3-3 8-3 11 0-3 3-8 3-11 0z" fill="#ffc20e"/></svg>',
    win:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1 3l6-1v6H1z" fill="#f2492c"/><path d="M8 2l7-1v7H8z" fill="#7cc242"/><path d="M1 9h6v6l-6-1z" fill="#20a0e8"/><path d="M8 9h7v7l-7-1z" fill="#ffc20e"/></svg>'
  };
  var dim=document.createElement('div');dim.className='ww-dim';
  var w=document.createElement('div');w.className='ww';w.setAttribute('role','dialog');w.setAttribute('aria-modal','true');w.tabIndex=-1;
  w.innerHTML=
    '<div class="ww-bar">'+SV.ie+'<span class="ww-title"></span><span class="ww-ctl">'+
      '<button type="button" class="ww-min" aria-label="minimize" title="Minimize">'+SV.min+'</button>'+
      '<button type="button" class="ww-max" aria-label="maximize" title="Maximize">'+SV.max+'</button>'+
      '<button type="button" class="ww-x" aria-label="close" title="Close">'+SV.x+'</button></span></div>'+
    '<div class="ww-menu" aria-hidden="true"><span>File</span><span>Edit</span><span>View</span><span>Favorites</span><span>Tools</span><span>Help</span></div>'+
    '<div class="ww-tools">'+
      '<button type="button" class="ww-prev">'+SV.back+'<span>Previous</span></button>'+
      '<button type="button" class="ww-next">'+SV.fwd+'<span>Next</span></button>'+
      '<button type="button" class="ww-stop ww-opt" title="Stop">'+SV.stop+'<span>Stop</span></button>'+
      '<button type="button" class="ww-refresh" title="Refresh">'+SV.refresh+'<span>Refresh</span></button>'+
      '<button type="button" class="ww-home" title="Back to the notebook">'+SV.home+'<span>Home</span></button>'+
      '<span class="ww-fill"></span><span class="ww-throb">'+SV.throb+'</span></div>'+
    '<div class="ww-addr"><label>Address</label><span class="ww-field">'+SV.page+'<span class="ww-url"></span><span class="ww-drop">'+SV.drop+'</span></span><button type="button" class="ww-go" title="Reload this page">'+SV.go+'Go</button></div>'+
    '<div class="ww-view"><iframe title="case study" loading="eager"></iframe></div>'+
    '<div class="ww-status"><div class="ww-msg">'+SV.page+'<span></span></div><div class="ww-prog"><i></i></div><div class="ww-zone">'+SV.globe+'Internet</div></div>'+
    '<span class="ww-grip" data-e="se" aria-hidden="true"></span>'+
    ['n','s','e','w','ne','nw','se','sw'].map(function(e){return '<span class="ww-h" data-e="'+e+'" aria-hidden="true"></span>';}).join('');
  var task=document.createElement('div');task.className='ww-task';
  task.innerHTML='<button type="button" class="ww-start" aria-haspopup="menu" aria-expanded="false">'+SV.win+'Start</button><div class="ww-menu98" role="menu" hidden><div class="ww-side"><b>mikaela</b>98</div><div class="ww-items"></div></div><button type="button" class="ww-tb">'+SV.ie+'<span></span></button><span class="ww-clock"></span>';
  document.body.appendChild(dim);document.body.appendChild(w);document.body.appendChild(task);
  var $=function(s){return w.querySelector(s);};
  var titleEl=$('.ww-title'),urlEl=$('.ww-url'),msgEl=$('.ww-msg span'),progEl=$('.ww-prog i'),frame=$('iframe');
  var bPrev=$('.ww-prev'),bNext=$('.ww-next'),bMax=$('.ww-max'),tb=task.querySelector('.ww-tb');
  var TASK_H=28,state='closed',cur=-1,rect=null,saved=null,isMax=false,loadTimer=0,pollTimer=0,progAnim=null,anim=null,origin=null;
  var reduce=function(){return window.matchMedia('(prefers-reduced-motion: reduce)').matches;};
  var mobile=function(){return window.matchMedia('(max-width:600px)').matches;};
  function caseOf(slug){for(var i=0;i<cases.length;i++)if(cases[i].slug===slug||cases[i].link.getAttribute('data-wi-slug')===slug)return i;return -1;}
  function absHref(c){return new URL(c.href,document.baseURI).href;}
  function vw(){return document.documentElement.clientWidth;}
  function vh(){return window.innerHeight;}
  function place(r){w.style.left=r.x+'px';w.style.top=r.y+'px';w.style.width=r.w+'px';w.style.height=r.h+'px';}
  function clamp(r){
    var W=vw(),H=vh()-(mobile()?0:TASK_H),minW=Math.min(380,W),minH=Math.min(260,H);
    r.w=Math.max(minW,Math.min(r.w,W));r.h=Math.max(minH,Math.min(r.h,H));
    r.x=Math.max(0,Math.min(r.x,W-r.w));r.y=Math.max(0,Math.min(r.y,H-r.h));return r;
  }
  function defRect(){var W=vw(),H=vh(),ww=Math.min(1120,W-96),hh=Math.min(820,H-72);return {x:Math.round((W-ww)/2),y:Math.round((H-hh)/2),w:ww,h:hh};}
  function applyGeom(){
    // desktop keeps the taskbar on screen under a maximized window, like windows 98
    if(mobile()||isMax){w.classList.add('max');place({x:0,y:0,w:vw(),h:vh()-(mobile()?0:TASK_H)});}
    else{w.classList.remove('max');rect=clamp(rect||defRect());place(rect);}
    bMax.innerHTML=(isMax||mobile())?SV.rest:SV.max;bMax.setAttribute('aria-label',isMax?'restore':'maximize');bMax.title=isMax?'Restore':'Maximize';
    bMax.disabled=mobile();
  }
  function status(t){msgEl.textContent=t;}
  function setChrome(i,docTitle){
    var c=cases[i],name=docTitle||c.name;
    titleEl.textContent=name+' - Microsoft Internet Explorer';
    w.setAttribute('aria-label',name);
    urlEl.textContent='http://mikaela.world/work/'+c.slug+'/';
    tb.querySelector('span').textContent=name+' - Microsoft Internet...';
    var p=cases[i-1],n=cases[i+1];
    bPrev.disabled=!p;bNext.disabled=!n;
    bPrev.title=p?'previous: '+p.name:'';bNext.title=n?'next: '+n.name:'';
  }
  function finishLoad(){
    clearTimeout(loadTimer);clearInterval(pollTimer);loadTimer=0;
    w.classList.remove('loading');if(progAnim){progAnim.cancel();progAnim=null;}progEl.style.width='0';status('Done');
  }
  function load(i){
    cur=i;var c=cases[i];setChrome(i);
    w.classList.add('loading');status('Opening page http://mikaela.world/work/'+c.slug+'/...');
    if(progEl.animate){if(progAnim)progAnim.cancel();progAnim=progEl.animate([{width:'0%'},{width:'70%',offset:.4},{width:'92%'}],{duration:2400,easing:'ease-out',fill:'forwards'});}
    var target=absHref(c),url=target+(target.indexOf('?')<0?'?':'&')+'win=1';
    clearTimeout(loadTimer);clearInterval(pollTimer);
    // the case page has to be parsed within 3s, otherwise fall back to a plain visit
    loadTimer=setTimeout(function(){if(state!=='closed'&&cur===i)window.location.href=target;},3000);
    pollTimer=setInterval(function(){
      try{var d=frame.contentDocument;if(d&&d.readyState!=='loading'&&frame.contentWindow.location.pathname.indexOf('/work/'+c.slug+'/')>=0){clearTimeout(loadTimer);loadTimer=0;clearInterval(pollTimer);}}catch(e){}
    },80);
    // replace, never push: the window's page swaps must not pile up entries in the tab's history
    var live=false;try{live=frame.contentWindow.location.href!=='about:blank';}catch(e){}
    if(live)frame.contentWindow.location.replace(url);else frame.src=url;
  }
  function onFrameLoad(){
    if(state==='closed'||!frame.getAttribute('src'))return;
    var path='',title='';
    try{path=frame.contentWindow.location.pathname;title=(frame.contentDocument.title||'').split(' · ')[0];}catch(e){}
    var m=path.match(/\/work\/([^\/]+)\//),i=m?caseOf(m[1]):-1;
    if(i<0){if(path){var to=frame.contentWindow.location.href;close(true);window.location.href=to;}return;}
    if(i!==cur){cur=i;setHash(true);}
    setChrome(i,title);finishLoad();
  }
  frame.addEventListener('load',onFrameLoad);
  function freshFrame(){var f=document.createElement('iframe');f.title='case study';f.addEventListener('load',onFrameLoad);frame.replaceWith(f);frame=f;}
  function setHash(replace){
    var h='#work/'+cases[cur].slug;if(window.location.hash===h)return;
    if(replace||history.state&&history.state.ww)history.replaceState({ww:1},'',h);else history.pushState({ww:1},'',h);
  }
  var growSeq=0;
  function grow(fromX,fromY,reverse,done){
    var r=w.getBoundingClientRect();
    if(reduce()||!w.animate){growSeq++;if(done)done();return;}
    var dx=fromX-r.left,dy=fromY-r.top;
    var k=[{transform:'translate('+dx+'px,'+dy+'px) scale(.02)',opacity:.4},{transform:'translate(0,0) scale(1)',opacity:1}];
    w.style.transformOrigin='0 0';
    if(anim)anim.cancel();
    var ms=reverse?190:260,fired=false,my=++growSeq,fin=function(){if(fired||my!==growSeq)return;fired=true;anim=null;if(done)done();};
    anim=w.animate(reverse?k.slice().reverse():k,{duration:ms,easing:reverse?'cubic-bezier(.5,0,.9,.5)':'cubic-bezier(.15,.75,.3,1)'});
    anim.onfinish=fin;setTimeout(fin,ms+120); // a busy main thread can starve onfinish; the window must still settle
  }
  function clock(){var d=new Date(),h=d.getHours(),mm=('0'+d.getMinutes()).slice(-2);task.querySelector('.ww-clock').textContent=((h%12)||12)+':'+mm+' '+(h<12?'AM':'PM');}
  function open(i,x,y){
    var c=cases[i];if(!c)return;
    cases.forEach(function(k){k.link.classList.remove('ww-from');});
    origin={x:x,y:y};
    var wasClosed=state==='closed';
    if(wasClosed&&!mobile())isMax=true; // desktop opens at full size; restore/drag bring back a normal window
    state='open';taskSync();
    w.classList.add('open');w.classList.remove('inactive');dim.classList.add('on');
    applyGeom();
    if(wasClosed||cur!==i)load(i);
    setHash(false);
    grow(x,y,false);
    w.focus({preventScroll:true});
  }
  function entryPoint(i){var r=cases[i].link.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};}
  function close(noHistory){
    if(state==='closed')return;
    var i=cur,p=(i>=0&&cases[i].link.getClientRects().length)?entryPoint(i):(origin||{x:vw()/2,y:vh()/2});
    var wasMin=state==='min';
    state='closed';taskSync();dim.classList.remove('on');
    var end=function(){
      w.classList.remove('open','loading');finishLoad();freshFrame();cur=-1;
      if(i>=0){var l=cases[i].link;l.classList.add('ww-from');l.focus({preventScroll:true});setTimeout(function(){l.classList.remove('ww-from');},1400);}
    };
    if(!noHistory){if(history.state&&history.state.ww)history.back();else if(/^#work\//.test(window.location.hash))history.replaceState(null,'','#work-index');}
    if(wasMin)end();else grow(p.x,p.y,true,end);
  }
  function minimize(){
    if(state!=='open')return;
    state='min';clock();taskSync();dim.classList.remove('on');
    var r=tb.getBoundingClientRect();
    grow(r.left+r.width/2,r.top+r.height/2,true,function(){if(state==='min'){w.classList.remove('open');tb.focus({preventScroll:true});}});
  }
  function restore(){
    if(state!=='min')return;
    var r=tb.getBoundingClientRect();
    state='open';taskSync();dim.classList.add('on');w.classList.add('open');applyGeom();
    grow(r.left+r.width/2,r.top+r.height/2,false);w.focus({preventScroll:true});
  }
  // taskbar: always there on desktop while the window exists (its button pressed while the window is up); phones only when minimized
  function taskSync(){clock();task.classList.toggle('on',state==='min'||(state==='open'&&!mobile()));tb.classList.toggle('act',state==='open');}
  function toggleMax(){if(mobile())return;isMax=!isMax;applyGeom();}
  function go(d){var j=cur+d;if(state!=='open'||!cases[j])return;load(j);setHash(true);}
  window.wwOpen=function(link,x,y){var i=-1;for(var k=0;k<cases.length;k++)if(cases[k].link===link)i=k;if(i<0)return false;open(i,x,y);return true;};
  window.wwState=function(){return {state:state,slug:cur>=0?cases[cur].slug:null,rect:w.getBoundingClientRect()};};
  $('.ww-x').addEventListener('click',function(){close();});
  $('.ww-min').addEventListener('click',minimize);
  bMax.addEventListener('click',toggleMax);
  bPrev.addEventListener('click',function(){go(-1);});
  bNext.addEventListener('click',function(){go(1);});
  $('.ww-home').addEventListener('click',function(){close();});
  $('.ww-refresh').addEventListener('click',function(){if(cur>=0)load(cur);});
  $('.ww-stop').addEventListener('click',function(){if(w.classList.contains('loading')){try{frame.contentWindow.stop();}catch(e){}finishLoad();}});
  // Start: a windows 98 start menu with every case, the notebook, and shut down (closes the window)
  var startB=task.querySelector('.ww-start'),menu=task.querySelector('.ww-menu98'),items=menu.querySelector('.ww-items');
  items.innerHTML=cases.map(function(c,i){return '<button type="button" role="menuitem" data-i="'+i+'">'+SV.ie+'<span>'+c.name+'</span></button>';}).join('')+
    '<hr><button type="button" role="menuitem" data-act="home">'+SV.home+'<span>Notebook</span></button><button type="button" role="menuitem" data-act="off">'+SV.x.replace('viewBox','style="width:16px;height:14px" viewBox')+'<span>Shut Down...</span></button>';
  function menuOpen(on){menu.hidden=!on;startB.setAttribute('aria-expanded',on?'true':'false');startB.classList.toggle('act',on);}
  startB.addEventListener('click',function(e){e.stopPropagation();menuOpen(menu.hidden);});
  items.addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;menuOpen(false);
    var act=b.getAttribute('data-act');
    if(act){close();return;}
    var i=+b.getAttribute('data-i');
    if(state==='min')restore();
    if(state==='open'&&i!==cur){load(i);setHash(true);}
  });
  document.addEventListener('pointerdown',function(e){if(!menu.hidden&&!e.target.closest('.ww-menu98,.ww-start'))menuOpen(false);},true);
  $('.ww-go').addEventListener('click',function(){if(cur>=0)load(cur);});
  tb.addEventListener('click',function(){if(state==='min')restore();else if(state==='open')minimize();});
  dim.addEventListener('pointerdown',function(){w.classList.add('inactive');});
  w.addEventListener('pointerdown',function(){w.classList.remove('inactive');});
  // drag by the title bar, resize from any edge or corner; the iframe goes inert while the pointer is captured
  function grab(e,edge){
    if(e.button!==0||mobile()||(isMax&&edge))return;
    if(!edge&&e.target.closest('button'))return;
    e.preventDefault();
    if(isMax){ // dragging a maximized window restores it under the pointer, like windows does
      isMax=false;rect=rect||defRect();rect.x=e.clientX-rect.w*(e.clientX/vw());rect.y=0;applyGeom();
    }
    var sx=e.clientX,sy=e.clientY,r0={x:rect.x,y:rect.y,w:rect.w,h:rect.h},el=e.currentTarget;
    el.setPointerCapture(e.pointerId);w.classList.add('busy');
    var W=vw(),H=vh()-(mobile()?0:TASK_H),minW=Math.min(380,W),minH=Math.min(260,H);
    function mv(ev){
      var dx=ev.clientX-sx,dy=ev.clientY-sy,r={x:r0.x,y:r0.y,w:r0.w,h:r0.h};
      if(!edge){r.x=Math.max(0,Math.min(r0.x+dx,W-r0.w));r.y=Math.max(0,Math.min(r0.y+dy,H-r0.h));}
      else{
        if(edge.indexOf('e')>=0)r.w=Math.max(minW,Math.min(r0.w+dx,W-r0.x));
        if(edge.indexOf('s')>=0)r.h=Math.max(minH,Math.min(r0.h+dy,H-r0.y));
        if(edge.indexOf('w')>=0){var nx=Math.max(0,Math.min(r0.x+dx,r0.x+r0.w-minW));r.w=r0.w+(r0.x-nx);r.x=nx;}
        if(edge.indexOf('n')>=0){var ny=Math.max(0,Math.min(r0.y+dy,r0.y+r0.h-minH));r.h=r0.h+(r0.y-ny);r.y=ny;}
      }
      rect=r;place(r);
    }
    function up(){el.removeEventListener('pointermove',mv);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',up);w.classList.remove('busy');}
    el.addEventListener('pointermove',mv);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
  }
  $('.ww-bar').addEventListener('pointerdown',function(e){grab(e,'');});
  $('.ww-bar').addEventListener('dblclick',function(e){if(!e.target.closest('button'))toggleMax();});
  Array.prototype.forEach.call(w.querySelectorAll('[data-e]'),function(h){h.addEventListener('pointerdown',function(e){grab(e,h.getAttribute('data-e'));});});
  window.addEventListener('resize',function(){if(state!=='closed'){applyGeom();taskSync();}});
  // keys: esc minimizes / restores before anything else; tab stays inside it
  document.addEventListener('keydown',function(e){
    // esc tucks the window into the taskbar like a real computer; esc again brings it back. only X closes.
    if(e.key==='Escape'&&state!=='closed'){e.preventDefault();e.stopImmediatePropagation();if(state==='open')minimize();else restore();return;}
    if(state!=='open')return;
    if(e.key==='Tab'){
      var f=Array.prototype.filter.call(w.querySelectorAll('button:not(:disabled),iframe'),function(el){return el.getClientRects().length;});
      if(!f.length)return;e.stopImmediatePropagation();
      var a=document.activeElement,k=f.indexOf(a);
      if(e.shiftKey&&(k<=0)){e.preventDefault();f[f.length-1].focus();}
      else if(!e.shiftKey&&(k<0||k===f.length-1)){e.preventDefault();f[0].focus();}
    }
  },true);
  // the case page inside the window forwards its hotkeys (esc, left, right)
  window.addEventListener('message',function(e){
    if(e.origin!==window.location.origin||!e.data||!e.data.ww||e.source!==frame.contentWindow)return;
    if(e.data.ww==='esc')minimize();else if(e.data.ww==='prev')go(-1);else if(e.data.ww==='next')go(1);
  });
  // back/forward: #work/<slug> opens that case in the window, anything else closes it
  function fromHash(){
    var m=window.location.hash.match(/^#work\/([^\/]+)$/),i=m?caseOf(m[1]):-1;
    if(i>=0){
      if(!modal.classList.contains('open')&&window.openWorkIndex)window.openWorkIndex(true);
      if(state==='closed'||cur!==i){var p=entryPoint(i);if(!p.x){p={x:vw()/2,y:vh()/2};}
        if(state==='closed')open(i,p.x,p.y);else{load(i);if(state==='min')restore();}}
    }else if(state!=='closed')close(true);
  }
  window.addEventListener('hashchange',fromHash);
  window.addEventListener('popstate',fromHash);
  if(/^#work\/[^\/]+$/.test(window.location.hash)){var dl=caseOf(window.location.hash.slice(6));if(dl>=0){window.openWorkIndex(true);setTimeout(fromHash,450);}}
  // closing the notebook takes a minimized window with it
  var closeWI=window.closeWorkIndex;
  window.closeWorkIndex=function(done){if(state!=='closed')close(true);if(/^#work\//.test(window.location.hash))history.replaceState(null,'','#work-index');return closeWI(done);};
  setInterval(function(){if(state==='min')clock();},30000);
})();
