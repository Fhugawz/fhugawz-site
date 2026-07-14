const names={artistIdentity:['Artist Identity','Identidad artística'],sonicDirection:['Sonic Direction','Dirección sonora'],visualNarrative:['Visual & Narrative World','Universo visual y narrativo'],releasePreparation:['Release Preparation','Preparación de lanzamiento'],audienceContent:['Audience & Content System','Audiencia y sistema de contenido']};
const levels={fragmented:['Fragmented Foundation','Fundamento fragmentado'],emerging:['Emerging Direction','Dirección emergente'],disconnected:['Defined but Disconnected','Definido pero desconectado'],ready:['Release-Ready System','Sistema listo para lanzamiento']};
const esc=(v)=>String(v).replace(/[&<>"']/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function visitorEmail(email,language,result){
 const es=language==='es',i=es?1:0;
 const rows=Object.entries(result.categoryScores).map(([id,score])=>`<li>${esc(names[id][i])}: <strong>${score}/16</strong></li>`).join('');
 const weak=result.weakest.map((id)=>names[id][i]).join(', ');
 return{to:email,subject:es?'Tus resultados del Scorecard de Fhugawz':'Your Fhugawz Scorecard results',html:`<h1>${esc(levels[result.resultId][i])}</h1><p>${es?'Puntuación total':'Total score'}: <strong>${result.total}/80</strong></p><ul>${rows}</ul><p>${es?'Área prioritaria':'Priority area'}: ${esc(weak)}</p><p>${es?'Recibimos tu diagnóstico. Puedes responder a este correo si deseas conversar sobre los próximos pasos.':'We received your diagnosis. Reply to this email if you would like to discuss next steps.'}</p>`};
}
export function ownerEmail(email,language,result,marketingConsent){
 const rows=Object.entries(result.categoryScores).map(([id,score])=>`${names[id][0]}: ${score}/16`).join('<br>');
 return{subject:`New Scorecard lead — ${result.total}/80`,html:`<h1>New Scorecard lead</h1><p>Email: ${esc(email)}</p><p>Language: ${esc(language)}</p><p>Marketing consent: ${marketingConsent?'Yes':'No'}</p><p>Result: ${esc(levels[result.resultId][0])}</p><p>${rows}</p><p>Priority: ${esc(result.weakest.map((id)=>names[id][0]).join(', '))}</p>`};
}
