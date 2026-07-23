const SOCIAL_HOSTS=["facebook.com","instagram.com","tiktok.com","twitter.com","x.com","linkedin.com","youtube.com","youtu.be"];
const NON_ARTICLE_SEGMENTS=new Set(["","news","blog","blogs","articles","article","category","categories","archive","archives","search","tag","tags","author","authors","latest","home","index","motorcycle-news","motorcycles","actualidad","lanzamientos"]);
export function isSocialUrl(value:string):boolean{try{const host=new URL(value).hostname.replace(/^www\./,"").toLowerCase();return SOCIAL_HOSTS.some(d=>host===d||host.endsWith(`.${d}`));}catch{return true;}}
export function isExactArticleUrl(value:string):boolean{
 try{
  const url=new URL(value);
  if(!["http:","https:"].includes(url.protocol)||isSocialUrl(value))return false;
  const segments=url.pathname.split("/").map(s=>s.trim().toLowerCase()).filter(Boolean);
  if(segments.length<2)return false;
  const last=(segments.at(-1)||"").replace(/\.(html?|php|aspx?)$/i,"").replace(/^\d+$/,"");
  if(!last||NON_ARTICLE_SEGMENTS.has(last))return false;
  if(/\/(category|categories|archive|archives|search|tag|tags|author|authors)(\/|$)/i.test(url.pathname))return false;
  if(/\/page\/\d+\/?$/i.test(url.pathname))return false;
  return /[a-zA-ZÀ-ÿ\u0600-\u06FF\u0900-\u097F]/.test(last)&&last.length>=8;
 }catch{return false;}
}