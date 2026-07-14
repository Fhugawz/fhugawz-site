export const categoryIds=['artistIdentity','sonicDirection','visualNarrative','releasePreparation','audienceContent'];
export const questionKeys=categoryIds.flatMap((id)=>[0,1,2,3].map((i)=>`${id}-${i}`));
export function normalizeAnswers(value){
 if(!value||typeof value!=='object')return null;
 const keys=Object.keys(value);
 if(keys.length!==questionKeys.length||keys.some((key)=>!questionKeys.includes(key)))return null;
 const answers={};
 for(const key of questionKeys){const score=Number(value[key]);if(!Number.isInteger(score)||score<0||score>4)return null;answers[key]=score;}
 return answers;
}
export function calculateResult(answers){
 const categoryScores={};
 for(const id of categoryIds)categoryScores[id]=[0,1,2,3].reduce((sum,i)=>sum+answers[`${id}-${i}`],0);
 const total=Object.values(categoryScores).reduce((sum,score)=>sum+score,0);
 const values=Object.values(categoryScores),max=Math.max(...values),min=Math.min(...values);
 return{total,resultId:total<=20?'fragmented':total<=40?'emerging':total<=60?'disconnected':'ready',categoryScores,strongest:categoryIds.filter((id)=>categoryScores[id]===max),weakest:categoryIds.filter((id)=>categoryScores[id]===min)};
}
