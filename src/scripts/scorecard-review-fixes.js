const scorecardRoot=document.querySelector('[data-scorecard-app]');
if(scorecardRoot instanceof HTMLElement){
 const cleanOptions=()=>scorecardRoot.querySelectorAll('.scorecard-option strong').forEach((node)=>{node.textContent=(node.textContent||'').replace(/^\d+\s*[—-]\s*/,'');});
 const cleanSpanishRecommendation=()=>{if(document.documentElement.dataset.language!=='es')return;const node=scorecardRoot.querySelector('[data-scorecard-recommendation]');if(node instanceof HTMLElement)node.textContent=node.textContent.replace('Artist World Building','desarrollo de universo artístico');};
 const refresh=()=>{cleanOptions();cleanSpanishRecommendation();};
 new MutationObserver(refresh).observe(scorecardRoot,{childList:true,subtree:true,characterData:true});
 window.addEventListener('fhugawz:languagechange',refresh);
 refresh();
}