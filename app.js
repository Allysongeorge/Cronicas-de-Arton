const $ = s => document.querySelector(s);
const ATTRS = ["Força","Destreza","Constituição","Inteligência","Sabedoria","Carisma"];
const RACES = ["Humano","Anão","Dahllan","Elfo","Goblin","Lefou","Minotauro","Qareen","Golem","Hynne","Kliren","Medusa","Osteon","Sereia/Tritão","Sílfide","Suraggel","Trog"];
const RACE_MODS = {
  "Anão":{"Constituição":2,"Sabedoria":1,"Destreza":-1},
  "Dahllan":{"Sabedoria":2,"Destreza":1,"Inteligência":-1},
  "Elfo":{"Inteligência":2,"Destreza":1,"Constituição":-1},
  "Goblin":{"Destreza":2,"Inteligência":1,"Carisma":-1},
  "Golem":{"Força":2,"Constituição":1,"Carisma":-1},
  "Hynne":{"Destreza":2,"Carisma":1,"Força":-1},
  "Kliren":{"Inteligência":2,"Carisma":1,"Força":-1},
  "Medusa":{"Destreza":2,"Carisma":1},
  "Minotauro":{"Força":2,"Constituição":1,"Sabedoria":-1},
  "Qareen":{"Carisma":2,"Inteligência":1,"Sabedoria":-1},
  "Sílfide":{"Carisma":2,"Destreza":1,"Força":-2},
  "Trog":{"Constituição":2,"Força":1,"Inteligência":-1}
};
const POINT_COST = {"-1":-1,"0":0,"1":1,"2":2,"3":4,"4":7};
const CLASS_PROGRESSION = {
  "Arcanista":{hpFirstLevel:8,hpPerLevel:2,pmPerLevel:6},
  "Bárbaro":{hpFirstLevel:24,hpPerLevel:6,pmPerLevel:3},
  "Bardo":{hpFirstLevel:12,hpPerLevel:3,pmPerLevel:4},
  "Bucaneiro":{hpFirstLevel:16,hpPerLevel:4,pmPerLevel:3},
  "Caçador":{hpFirstLevel:16,hpPerLevel:4,pmPerLevel:4},
  "Cavaleiro":{hpFirstLevel:20,hpPerLevel:5,pmPerLevel:3},
  "Clérigo":{hpFirstLevel:16,hpPerLevel:4,pmPerLevel:5},
  "Druida":{hpFirstLevel:16,hpPerLevel:4,pmPerLevel:4},
  "Guerreiro":{hpFirstLevel:20,hpPerLevel:5,pmPerLevel:3},
  "Inventor":{hpFirstLevel:12,hpPerLevel:3,pmPerLevel:4},
  "Ladino":{hpFirstLevel:12,hpPerLevel:3,pmPerLevel:4},
  "Lutador":{hpFirstLevel:20,hpPerLevel:5,pmPerLevel:3},
  "Nobre":{hpFirstLevel:16,hpPerLevel:4,pmPerLevel:4},
  "Paladino":{hpFirstLevel:20,hpPerLevel:5,pmPerLevel:3}
};
const CLASS_SKILL_RULES = {
 "Arcanista": {required:["Misticismo","Vontade"],choose:2,options:["Conhecimento","Diplomacia","Enganação","Guerra","Iniciativa","Intimidação","Intuição","Investigação","Nobreza","Ofício","Percepção"]},
 "Bárbaro": {required:["Fortitude","Luta"],choose:4,options:["Adestramento","Atletismo","Cavalgar","Iniciativa","Intimidação","Ofício","Percepção","Pontaria","Sobrevivência","Vontade"]},
 "Bardo": {required:["Atuação","Reflexos"],choose:6,options:["Acrobacia","Cavalgar","Conhecimento","Diplomacia","Enganação","Furtividade","Iniciativa","Intuição","Investigação","Jogatina","Ladinagem","Luta","Misticismo","Nobreza","Percepção","Pontaria","Vontade"]},
 "Bucaneiro": {required:["Reflexos"],alternatives:[["Luta","Pontaria"]],choose:4,options:["Acrobacia","Atletismo","Atuação","Enganação","Fortitude","Furtividade","Iniciativa","Intimidação","Jogatina","Luta","Ofício","Percepção","Pilotagem","Pontaria"]},
 "Caçador": {required:["Sobrevivência"],alternatives:[["Luta","Pontaria"]],choose:6,options:["Adestramento","Atletismo","Cavalgar","Cura","Fortitude","Furtividade","Iniciativa","Investigação","Luta","Ofício","Percepção","Pontaria","Reflexos"]},
 "Cavaleiro": {required:["Fortitude","Luta"],choose:2,options:["Adestramento","Atletismo","Cavalgar","Diplomacia","Guerra","Iniciativa","Intimidação","Nobreza","Percepção","Vontade"]},
 "Clérigo": {required:["Religião","Vontade"],choose:2,options:["Conhecimento","Cura","Diplomacia","Fortitude","Iniciativa","Intuição","Luta","Misticismo","Nobreza","Ofício","Percepção"]},
 "Druida": {required:["Sobrevivência","Vontade"],choose:4,options:["Adestramento","Atletismo","Cavalgar","Conhecimento","Cura","Fortitude","Iniciativa","Intuição","Luta","Misticismo","Ofício","Percepção","Religião"]},
 "Guerreiro": {required:["Fortitude"],alternatives:[["Luta","Pontaria"]],choose:2,options:["Adestramento","Atletismo","Cavalgar","Guerra","Iniciativa","Intimidação","Luta","Ofício","Percepção","Pontaria","Reflexos"]},
 "Inventor": {required:["Ofício","Vontade"],choose:4,options:["Conhecimento","Cura","Diplomacia","Fortitude","Iniciativa","Investigação","Luta","Misticismo","Ofício","Pilotagem","Percepção","Pontaria"]},
 "Ladino": {required:["Ladinagem","Reflexos"],choose:8,options:["Acrobacia","Atletismo","Atuação","Cavalgar","Conhecimento","Diplomacia","Enganação","Furtividade","Iniciativa","Intimidação","Intuição","Investigação","Jogatina","Luta","Ofício","Percepção","Pilotagem","Pontaria"],specialist:true},
 "Lutador": {required:["Fortitude","Luta"],choose:4,options:["Acrobacia","Adestramento","Atletismo","Enganação","Furtividade","Iniciativa","Intimidação","Ofício","Percepção","Pontaria","Reflexos"]},
 "Nobre": {required:["Vontade"],alternatives:[["Diplomacia","Intimidação"]],choose:4,options:["Adestramento","Atuação","Cavalgar","Conhecimento","Diplomacia","Enganação","Fortitude","Guerra","Iniciativa","Intimidação","Intuição","Investigação","Jogatina","Luta","Nobreza","Ofício","Percepção","Pontaria"]},
 "Paladino": {required:["Luta","Vontade"],choose:2,options:["Adestramento","Atletismo","Cavalgar","Cura","Diplomacia","Fortitude","Guerra","Iniciativa","Intuição","Nobreza","Percepção","Religião"]}
};
const SKILLS = [
 ["Acrobacia","Des"],["Adestramento","Car"],["Atletismo","For"],["Atuação","Car"],["Cavalgar","Des"],["Conhecimento","Int"],["Cura","Sab"],["Diplomacia","Car"],["Enganação","Car"],["Fortitude","Con"],["Furtividade","Des"],["Guerra","Int"],["Iniciativa","Des"],["Intimidação","Car"],["Intuição","Sab"],["Investigação","Int"],["Jogatina","Car"],["Ladinagem","Des"],["Luta","For"],["Misticismo","Int"],["Nobreza","Int"],["Ofício","Int"],["Percepção","Sab"],["Pilotagem","Des"],["Pontaria","Des"],["Reflexos","Des"],["Religião","Sab"],["Sobrevivência","Sab"],["Vontade","Sab"]
];
const TABS = {
 overview:["Visão geral","A visão rápida do seu aventureiro."],
 attributes:["Atributos e perícias","Ajuste atributos, treinamento e bônus."],
 combat:["Combate","Recursos, defesa, ataques e testes rápidos."],
 inventory:["Inventário","Equipamentos, carga e tesouros."],
 notes:["Notas e história","Detalhes que fazem seu herói ser único."]
};
const fresh = () => ({
 id: crypto.randomUUID(), name:"Novo aventureiro", player:"", race:"", raceChoices:{}, className:"", origin:"", deity:"", level:1, xp:0,
 attrs:{Força:0,Destreza:0,Constituição:0,Inteligência:0,Sabedoria:0,Carisma:0},
 baseAttrs:{Força:0,Destreza:0,Constituição:0,Inteligência:0,Sabedoria:0,Carisma:0},
 hp:16,hpMax:16,hpFirstLevel:16,hpPerLevel:4,hpBonus:0,pm:3,pmMax:3,pmPerLevel:3,pmBonus:0,
 defenseBonus:0,armorPenalty:0,athleticsSwim:false,speed:9,initiativeBonus:0,
 skills:{}, classSkills:{alternatives:{},choices:[],intChoices:[],specialistChoices:[]}, attacks:[{name:"Ataque principal",bonus:0,damage:"1d6",crit:"x2"}], items:[{name:"Equipamento inicial",qty:1,weight:0}], money:0,
 notes:"", appearance:"", personality:"", goals:""
});
let db = {characters:[fresh()],active:null}, c, currentTab="overview";
try { const stored=JSON.parse(localStorage.getItem("cronicas-arton-v1")); if(stored?.characters?.length) db=stored; } catch(e) {}
if(!db.active) db.active=db.characters[0].id;
c=db.characters.find(x=>x.id===db.active)||db.characters[0];
// Migra fichas antigas sem apagar nomes, itens, perícias ou atributos já salvos.
db.characters.forEach(x=>{
 if(!x.attrs)x.attrs={Força:0,Destreza:0,Constituição:0,Inteligência:0,Sabedoria:0,Carisma:0};
 if(!x.baseAttrs)x.baseAttrs={...x.attrs};
 if(!x.raceChoices)x.raceChoices={};
 if(!x.skills)x.skills={};
 if(!x.classSkills||typeof x.classSkills!=="object")x.classSkills={alternatives:{},choices:[],intChoices:[],specialistChoices:[]};
 if(!x.classSkills.alternatives)x.classSkills.alternatives={};
 if(!Array.isArray(x.classSkills.choices))x.classSkills.choices=[];
 if(!Array.isArray(x.classSkills.intChoices))x.classSkills.intChoices=[];
 if(!Array.isArray(x.classSkills.specialistChoices))x.classSkills.specialistChoices=[];
 const ruleForSavedClass=CLASS_SKILL_RULES[x.className];
 (ruleForSavedClass?.alternatives||[]).forEach((options,i)=>{if(!options.includes(x.classSkills.alternatives[i]))x.classSkills.alternatives[i]=options[0];});
 if(!Array.isArray(x.attacks))x.attacks=[];
 if(!Array.isArray(x.items))x.items=[];
 if(x.hpBonus===undefined)x.hpBonus=0;
 if(x.pmBonus===undefined)x.pmBonus=0;
 if(x.athleticsSwim===undefined)x.athleticsSwim=false;
});
function esc(v){return String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));}
function n(v,min=-999,max=99999){v=Number(v);return Math.max(min,Math.min(max,Number.isFinite(v)?v:min));}
function signed(v){return v>=0?"+"+v:String(v);}
function racialMods(){
 const out={};
 const add=(attr,value)=>{out[attr]=(out[attr]||0)+value;};
 Object.entries(RACE_MODS[c.race]||{}).forEach(([attr,value])=>add(attr,value));
 const choices=c.raceChoices||{};
 if(c.race==="Suraggel"){
  if((choices.suraggel||"Aggelus")==="Sulfure") { add("Destreza",2); add("Inteligência",1); }
  else { add("Sabedoria",2); add("Carisma",1); }
 }
 if(["Humano","Lefou","Osteon","Sereia/Tritão"].includes(c.race)){
  const selected=[];
  for(let i=1;i<=3;i++){
   const attr=choices["bonus"+i];
   const excluded=(c.race==="Lefou"&&attr==="Carisma")||(c.race==="Osteon"&&attr==="Constituição");
   if(attr&&ATTRS.includes(attr)&&!selected.includes(attr)&&!excluded){selected.push(attr);add(attr,1);}
  }
  if(c.race==="Lefou")add("Carisma",-1);
  if(c.race==="Osteon")add("Constituição",-1);
 }
 return out;
}
function mod(a){
 const names={For:"Força",Des:"Destreza",Con:"Constituição",Int:"Inteligência",Sab:"Sabedoria",Car:"Carisma"};
 const attr=names[a]||a;
 const base=c.baseAttrs?.[attr]??c.attrs?.[attr]??0;
 return n(base+(racialMods()[attr]||0),-20,30);
}
function pointTotal(){return ATTRS.reduce((total,attr)=>total+(POINT_COST[String(n(c.baseAttrs?.[attr]??c.attrs?.[attr]??0,-1,4))]??0),0);}
function trainBonus(){return c.level<=6?2:c.level<=14?4:6;}
function ensureClassSkills(){
 if(!c.classSkills||typeof c.classSkills!=="object")c.classSkills={alternatives:{},choices:[],intChoices:[],specialistChoices:[]};
 if(!c.classSkills.alternatives)c.classSkills.alternatives={};
 if(!Array.isArray(c.classSkills.choices))c.classSkills.choices=[];
 if(!Array.isArray(c.classSkills.intChoices))c.classSkills.intChoices=[];
 if(!Array.isArray(c.classSkills.specialistChoices))c.classSkills.specialistChoices=[];
 const rule=CLASS_SKILL_RULES[c.className];
 (rule?.alternatives||[]).forEach((options,i)=>{if(!options.includes(c.classSkills.alternatives[i]))c.classSkills.alternatives[i]=options[0];});
 return c.classSkills;
}
function baseClassSkillSet(){
 const rule=CLASS_SKILL_RULES[c.className], data=ensureClassSkills();
 const set=new Set(rule?.required||[]);
 (rule?.alternatives||[]).forEach((options,i)=>{const chosen=data.alternatives[i];if(options.includes(chosen))set.add(chosen);});
 return set;
}
function intSkillCount(){return Math.max(0,mod("Inteligência"));}
function specialistSkillCount(){return c.className==="Ladino"?Math.max(1,mod("Inteligência")):0;}
function normalizeClassSkills(){
 const rule=CLASS_SKILL_RULES[c.className], data=ensureClassSkills();
 if(!rule)return;
 const used=baseClassSkillSet(), classChoices=[];
 for(let i=0;i<rule.choose;i++){
  const value=data.choices[i]||"";
  if(value&&rule.options.includes(value)&&!used.has(value)&&!c.skills[value]?.trained){classChoices[i]=value;used.add(value);}else classChoices[i]="";
 }
 data.choices=classChoices;
 const intChoices=[];
 for(let i=0;i<intSkillCount();i++){
  const value=data.intChoices[i]||"";
  if(value&&SKILLS.some(([name])=>name===value)&&!used.has(value)&&!c.skills[value]?.trained){intChoices[i]=value;used.add(value);}else intChoices[i]="";
 }
 data.intChoices=intChoices;
 const specialistChoices=[];
 for(let i=0;i<specialistSkillCount();i++){
  const value=data.specialistChoices[i]||"";
  if(value&&SKILLS.some(([name])=>name===value)&&!used.has(value)&&!c.skills[value]?.trained){specialistChoices[i]=value;used.add(value);}else specialistChoices[i]="";
 }
 data.specialistChoices=specialistChoices;
}
function autoTrainedSkills(){
 normalizeClassSkills();
 const rule=CLASS_SKILL_RULES[c.className], data=ensureClassSkills(), set=baseClassSkillSet();
 if(!rule)return set;
 data.choices.forEach(value=>{if(value)set.add(value);});
 data.intChoices.forEach(value=>{if(value)set.add(value);});
 data.specialistChoices.forEach(value=>{if(value)set.add(value);});
 return set;
}
function isSkillTrained(name){return !!(c.skills[name]?.trained||autoTrainedSkills().has(name));}
function classSkillOptions(type,index){
 const rule=CLASS_SKILL_RULES[c.className];
 if(!rule)return [];
 normalizeClassSkills();
 const data=ensureClassSkills(), used=baseClassSkillSet();
 [["class",data.choices],["int",data.intChoices],["specialist",data.specialistChoices]].forEach(([group,values])=>values.forEach((value,i)=>{if(value&&!(group===type&&i===index))used.add(value);}));
 if(type==="alt"){
  Object.entries(data.alternatives).forEach(([i,value])=>{if(Number(i)!==index&&value)used.add(value);});
  const selected=data.alternatives[index];
  return (rule.alternatives[index]||[]).filter(value=>((!used.has(value)&&!c.skills[value]?.trained)||value===selected));
 }
 if(type==="class"){
  const selected=data.choices[index];
  return rule.options.filter(value=>((!used.has(value)&&!c.skills[value]?.trained)||value===selected));
 }
 const list=type==="int"?data.intChoices:data.specialistChoices;
 const selected=list[index];
 return SKILLS.map(([name])=>name).filter(value=>((!used.has(value)&&!c.skills[value]?.trained)||value===selected));
}
function classTrainingCard(){
 const rule=CLASS_SKILL_RULES[c.className];
 if(!rule)return `<p class="notice">Escolha uma classe em <b>Editar identidade</b> para aplicar as perícias obrigatórias e selecionar as escolhas adicionais.</p>`;
 normalizeClassSkills();
 const data=ensureClassSkills();
 const altHtml=(rule.alternatives||[]).map((options,i)=>{
  const selected=data.alternatives[i]||options[0], list=[...new Set([selected,...classSkillOptions("alt",i)])].filter(Boolean);
  return `<label>Perícia obrigatória (escolha uma)<select data-class-alt="${i}">${list.map(name=>`<option value="${esc(name)}" ${name===selected?"selected":""}>${esc(name)}</option>`).join("")}</select></label>`;
 }).join("");
 const makeSlots=(type,count,prefix)=>Array.from({length:count},(_,i)=>{
  const selected=data[type][i]||"", options=[...new Set([selected,...classSkillOptions(type==="intChoices"?"int":type==="specialistChoices"?"specialist":"class",i)])].filter(Boolean);
  return `<label>${prefix} ${i+1} de ${count}<select data-${type==="choices"?"class-choice":type==="intChoices"?"int-choice":"specialist-choice"}="${i}"><option value="">Selecione uma perícia</option>${options.map(name=>`<option value="${esc(name)}" ${name===selected?"selected":""}>${esc(name)}</option>`).join("")}</select></label>`;
 }).join("");
 const classSlots=makeSlots("choices",rule.choose,"Escolha da classe");
 const intCount=intSkillCount(), intSlots=makeSlots("intChoices",intCount,"Escolha por Inteligência");
 const specialistCount=specialistSkillCount(), specialistSlots=makeSlots("specialistChoices",specialistCount,"Especialista — escolha");
 const fixed=[...(rule.required||[]),...(rule.alternatives||[]).map((options,i)=>data.alternatives[i]||options[0])];
 return `<p class="notice">Perícias obrigatórias: <b>${fixed.map(esc).join(", ")}</b>. As escolhas abaixo contam como treinadas e recebem o bônus de treinamento. A quantidade por Inteligência considera o atributo final após os ajustes raciais.</p><div class="form-grid">${altHtml}${classSlots}${intSlots}${specialistSlots}</div><p class="notice">Escolhas preenchidas: ${data.choices.filter(Boolean).length}/${rule.choose} da classe; ${data.intChoices.filter(Boolean).length}/${intCount} por Inteligência${specialistCount?`; ${data.specialistChoices.filter(Boolean).length}/${specialistCount} de Especialista`:""}. Você pode deixar opções vazias e completá-las depois.</p>`;
}
function skillTotal(name,attr){
 const skill=c.skills[name]||{};
 const usesArmorPenalty=["Acrobacia","Furtividade","Ladinagem"].includes(name)||(name==="Atletismo"&&c.athleticsSwim);
 const armorPenalty=usesArmorPenalty?n(c.armorPenalty,-99,0):0;
 return Math.floor(n(c.level,1,20)/2)+mod(attr)+(isSkillTrained(name)?trainBonus():0)+n(skill.extra||0,-99,99)+armorPenalty;
}
function derived(){
 const level=n(c.level,1,20), con=mod("Constituição");
 const hpMax=Math.max(1,n(c.hpFirstLevel,0)+con)+Math.max(0,level-1)*Math.max(1,n(c.hpPerLevel,0)+con)+n(c.hpBonus,0);
 const pmMax=n(c.pmPerLevel,0)*level+n(c.pmBonus,0);
 const defense=10+mod("Destreza")+n(c.defenseBonus,-99,999);
 return {hpMax:Math.max(1,hpMax),pmMax:Math.max(0,pmMax),defense,initiative:skillTotal("Iniciativa","Des")};
}
function applyClassProgression(className){const progression=CLASS_PROGRESSION[className];if(!progression)return false;Object.assign(c,progression);return true;}
function setCharacterField(key,value){
 const oldHpMax=derived().hpMax, oldPmMax=derived().pmMax;
 if(key==="level"){updateLevel(value);return;}
 if(key==="race"){if(c.race!==value)c.raceChoices={};c.race=value;}
 else if(key==="className"){
  if(c.className!==value){
   c.classSkills={alternatives:{},choices:[],intChoices:[],specialistChoices:[]};
   c.className=value;
   if(value)applyClassProgression(value);
  }
  ensureClassSkills();
 }
 else c[key]=value;
 const next=derived();
 c.hp=n(c.hp+next.hpMax-oldHpMax,0,next.hpMax);
 c.pm=n(c.pm+next.pmMax-oldPmMax,0,next.pmMax);
}
function updateLevel(newLevel){
 const oldLevel=n(c.level,1,20);
 c.level=n(newLevel,1,20);
 const gained=c.level-oldLevel;
 if(gained>0){
  c.hp=n(c.hp,0,99999)+gained*Math.max(1,n(c.hpPerLevel,0)+mod("Constituição"));
  c.pm=n(c.pm,0,99999)+gained*n(c.pmPerLevel,0);
 }
 const d=derived();c.hp=n(c.hp,0,d.hpMax);c.pm=n(c.pm,0,d.pmMax);
}
function save(){
 try{db.active=c?.id||db.active;localStorage.setItem("cronicas-arton-v1",JSON.stringify(db));$("#saveStatus").textContent="Salvo neste navegador";}
 catch(e){$("#saveStatus").textContent="Falha ao salvar — exporte o backup";}
}
function toast(msg){$("#saveStatus").textContent=msg;setTimeout(()=>{$("#saveStatus").textContent="Salvo neste navegador"},2400);}
function syncSelect(){
 $("#characterSelect").innerHTML=db.characters.map(x=>`<option value="${esc(x.id)}" ${x.id===c.id?"selected":""}>${esc(x.name||"Sem nome")}</option>`).join("");
}
function field(label,key,value,type="text",wide=false,placeholder=""){
 return `<label class="${wide?"wide":""}">${label}<input data-field="${key}" type="${type}" value="${esc(value??"")}" placeholder="${esc(placeholder)}"></label>`;
}
function selectField(label,key,value,options){
 return `<label>${label}<select id="${key}" data-field="${key}">${options.map(o=>`<option ${o===value?"selected":""}>${esc(o)}</option>`).join("")}</select></label>`;
}
function card(title,body,meta=""){return `<section class="card"><div class="card-title"><h3>${title}</h3><small>${meta}</small></div>${body}</section>`;}
function identityFields(){
 return `<div class="form-grid">
 ${field("Nome do personagem","name",c.name)}
 ${field("Nome do jogador","player",c.player)}
 <label>Raça<select data-field="race"><option value="">Escolha uma raça</option>${RACES.map(race=>`<option value="${esc(race)}" ${c.race===race?"selected":""}>${esc(race)}</option>`).join("")}</select></label>
 <label>Classe<select data-field="className"><option value="">Escolha uma classe</option>${Object.keys(CLASS_PROGRESSION).map(name=>`<option value="${esc(name)}" ${c.className===name?"selected":""}>${esc(name)}</option>`).join("")}</select></label>
 ${field("Origem","origin",c.origin)}
 ${field("Divindade","deity",c.deity)}
 ${field("Nível","level",c.level,"number")}
 ${field("Experiência","xp",c.xp,"number")}
 </div>`;
}
function resource(label,key,maxKey,color){
 const calc=derived(), max=maxKey==="hpMax"?calc.hpMax:maxKey==="pmMax"?calc.pmMax:n(c[maxKey],0,99999), val=n(c[key],0,max||99999), pct=max?Math.min(100,val/max*100):0; c[key]=val;
 return `<section class="card resource"><div class="overline">${label}</div><strong>${val} <small>/ ${max}</small></strong><div class="bar"><i style="width:${pct}%;background:${color}"></i></div><div class="resource-controls"><button data-adjust="${key}" data-delta="-1">−</button><input data-field="${key}" type="number" value="${val}" aria-label="${label} atual"><button data-adjust="${key}" data-delta="1">+</button><small>ATUAL</small></div></section>`;
}
function attrBlock(){
 return `<div class="attr-list">${ATTRS.map(a=>`<div class="attr"><span class="attr-name">${a}</span><input type="number" min="-1" max="4" data-attr="${a}" value="${esc(c.baseAttrs?.[a]??c.attrs[a]??0)}" aria-label="${a} base"><span class="modifier" title="Valor final com raça">${signed(mod(a))}</span></div>`).join("")}</div>`;
}
function raceOptions(){
 const choices=c.raceChoices||(c.raceChoices={});
 const bonusSelect=(i,excluded=[])=>`<label>Bônus racial +1 (${i})<select data-race-choice="bonus${i}"><option value="">Escolha atributo</option>${ATTRS.filter(a=>!excluded.includes(a)&&![1,2,3].some(j=>j!==i&&choices["bonus"+j]===a)).map(a=>`<option value="${esc(a)}" ${choices["bonus"+i]===a?"selected":""}>${esc(a)}</option>`).join("")}</select></label>`;
 let html="";
 if(c.race==="Suraggel")html+=`<label>Variante de suraggel<select data-race-choice="suraggel"><option value="Aggelus" ${(!choices.suraggel||choices.suraggel==="Aggelus")?"selected":""}>Aggelus</option><option value="Sulfure" ${choices.suraggel==="Sulfure"?"selected":""}>Sulfure</option></select></label>`;
 if(["Humano","Lefou","Osteon","Sereia/Tritão"].includes(c.race)){
  const excluded=c.race==="Lefou"?["Carisma"]:c.race==="Osteon"?["Constituição"]:[];
  html+=bonusSelect(1,excluded)+bonusSelect(2,excluded)+bonusSelect(3,excluded);
 }
 return html?`<div class="form-grid" style="margin-top:14px">${html}</div>`:"";
}
function overview(){
 const d=derived();
 return `<div class="dashboard">
 <section class="card profile"><div class="portrait">✦</div><div class="profile-body"><span class="tag">${esc(c.className||"Classe a definir")} · Nível ${n(c.level,1,20)}</span><h3>${esc(c.name)}</h3><p>${esc([c.race,c.origin].filter(Boolean).join(" · ")||"Raça e origem a definir")}</p><div class="details">
 <div class="detail"><span>Jogador</span><b>${esc(c.player||"Não informado")}</b></div><div class="detail"><span>Divindade</span><b>${esc(c.deity||"Nenhuma")}</b></div><div class="detail"><span>Experiência</span><b>${n(c.xp,0)}</b></div><div class="detail"><span>Deslocamento</span><b>${n(c.speed,0)} m</b></div>
 </div></div></section>
 <div class="right-stack">
 <div class="resources">${resource("PONTOS DE VIDA","hp","hpMax","#9d4740")}${resource("PONTOS DE MANA","pm","pmMax","#6c8c9b")}${`<section class="card resource"><div class="overline">DEFESA</div><strong>${d.defense}</strong><div class="notice">10 + Destreza + outros bônus</div><div class="resource-controls"><button data-adjust="defenseBonus" data-delta="-1">−</button><input data-field="defenseBonus" type="number" value="${n(c.defenseBonus)}" aria-label="Outros bônus de Defesa"><button data-adjust="defenseBonus" data-delta="1">+</button><small>BÔNUS</small></div></section>`}</div>
 <div class="stats"><div class="stat"><span>Nível</span><strong>${n(c.level,1,20)}</strong></div><div class="stat"><span>Bônus treino</span><strong>+${trainBonus()}</strong></div><div class="stat"><span>Iniciativa</span><strong>${signed(skillTotal("Iniciativa","Des")+n(c.initiativeBonus))}</strong></div><div class="stat"><span>Perícias treinadas</span><strong>${SKILLS.filter(([name])=>isSkillTrained(name)).length}</strong></div></div>
 ${card("Atributos",`<div class="attributes">${attrBlock()}<div><p class="notice">No Tormenta20, os atributos usam valores diretos: 0 representa a média humana. Os totais de perícia usam metade do nível, atributo-chave e bônus de treinamento quando aplicável.</p><button class="primary" data-goto="attributes">Editar perícias ↗</button></div></div>`)}
 </div></div>`;
}
function attributesPage(){
 const rows=SKILLS.map(([name,a])=>{const skill=c.skills[name]||{},auto=autoTrainedSkills().has(name);return `<div class="skill-row"><span>${name} <small>(${a})</small></span><label class="trained"><input type="checkbox" data-trained="${name}" ${isSkillTrained(name)?"checked":""} ${auto?'disabled title="Treinada pela classe ou Inteligência"':""}>Treinado</label><input type="number" data-skill-extra="${name}" value="${n(skill.extra||0)}" aria-label="Bônus extra ${name}"><span class="total">${signed(skillTotal(name,a))}</span></div>`}).join("");
 return `<div class="grid-two">${card("Atributos e raça",`<p class="notice">Distribuição por pontos: comece com todos os atributos em 0 e use até 10 pontos. Custos acumulados: 1 custa 1, 2 custa 2, 3 custa 4 e 4 custa 7. Reduzir um atributo para −1 concede 1 ponto adicional. Os valores à direita incluem os ajustes raciais.</p><div class="stats" style="margin-bottom:14px"><div class="stat"><span>Pontos usados</span><strong>${pointTotal()}</strong></div><div class="stat"><span>Disponíveis</span><strong>${10-pointTotal()}</strong></div></div><div class="attributes">${attrBlock()}</div>${raceOptions()}<p class="notice">Escolhas raciais: humano e sereia/tritão recebem +1 em três atributos diferentes; lefou não pode escolher Carisma; osteon não pode escolher Constituição. Suraggel escolhe Aggelus ou Sulfure.</p><button id="resetAttributes">Redefinir atributos para 0</button>`)}${card("Progressão e ajustes",`<div class="form-grid">${field("Nível","level",c.level,"number")}${field("PV base no 1º nível","hpFirstLevel",c.hpFirstLevel,"number")}${field("PV por nível seguinte","hpPerLevel",c.hpPerLevel,"number")}${field("PM por nível","pmPerLevel",c.pmPerLevel,"number")}${field("Bônus fixo de PV","hpBonus",c.hpBonus||0,"number")}${field("Bônus fixo de PM","pmBonus",c.pmBonus||0,"number")}${field("Penalidade de armadura (negativa)","armorPenalty",c.armorPenalty||0,"number")}${field("Bônus de Defesa","defenseBonus",c.defenseBonus,"number")}${field("Deslocamento (m)","speed",c.speed,"number")}${field("Bônus de Iniciativa","initiativeBonus",c.initiativeBonus,"number")}</div><p class="notice">PV máximos: PV base do 1º nível + Constituição; níveis seguintes: PV base por nível + Constituição, com mínimo de 1 PV por nível, mais bônus fixos. PM máximos = PM por nível × nível + bônus fixos. A penalidade de armadura afeta Acrobacia, Furtividade e Ladinagem; em Atletismo, somente natação.</p>`)}</div>
 ${card("Treinamento por classe",classTrainingCard())}
 ${card("Perícias",`<div class="skill-row skill-head"><span>Perícia / atributo-chave</span><span>Treinamento</span><span>Bônus extra</span><span>Total</span></div><div class="skills"><label style="display:flex;align-items:center;gap:8px;margin:8px 0;font-size:12px;letter-spacing:0"><input type="checkbox" data-swim style="width:16px" ${c.athleticsSwim?"checked":""}> Aplicar penalidade de armadura em Atletismo (somente natação)</label>${rows}</div>`,`Metade do nível + atributo + treinamento + extras`)} `;
}
function combatPage(){
 const d=derived();
 return `<div class="combat-stats"><div class="combat-stat"><label>DEFESA TOTAL</label><input readonly value="${d.defense}"></div><div class="combat-stat"><label>INICIATIVA</label><input readonly value="${signed(skillTotal("Iniciativa","Des")+n(c.initiativeBonus))}"></div><div class="combat-stat"><label>DESLOCAMENTO (m)</label><input type="number" data-field="speed" value="${n(c.speed)}"></div></div>
 <div class="grid-two">${card("Recursos de combate",`${resource("PONTOS DE VIDA","hp","hpMax","#9d4740")}${resource("PONTOS DE MANA","pm","pmMax","#6c8c9b")}<p class="notice">Os máximos calculados dependem dos parâmetros de PV/PM por nível. Os valores atuais podem ser ajustados durante a sessão.</p>`)}
 ${card("Rolagem rápida",`<div class="form-grid">${selectField("Tipo de teste","rollSkill","Atletismo",SKILLS.map(s=>s[0]))}<label>Dificuldade (opcional)<input id="dc" type="number" placeholder="Ex.: 15"></label></div><p class="roll-result" id="rollResult">1d20 + modificador</p><button class="primary" id="rollBtn">Rolar teste</button><div class="notice" id="rollExplain">Role um d20 e some o total da perícia selecionada.</div>`)}</div>
 ${card("Ataques",`<div class="notice">Registre seus ataques e consulte os bônus rapidamente. Os campos são editáveis nesta primeira versão.</div><div id="attacks">${c.attacks.map((a,i)=>`<div class="item-row"><label>Nome<input data-attack="${i}" data-akey="name" value="${esc(a.name)}"></label><label>Bônus<input type="number" data-attack="${i}" data-akey="bonus" value="${n(a.bonus)}"></label><label>Dano<input data-attack="${i}" data-akey="damage" value="${esc(a.damage)}"></label><button data-remove-attack="${i}" aria-label="Excluir ataque">×</button></div>`).join("")}</div><button id="addAttack">＋ Adicionar ataque</button>`)}`;
}
function inventoryPage(){
 const items=c.items||[], total=items.reduce((sum,x)=>sum+n(x.qty,0)*n(x.weight,0),0);
 return `<div class="grid-two">${card("Equipamento e itens",`<div class="item-row"><label>Item<input id="newItemName" placeholder="Ex.: Poção de cura"></label><label>Qtd.<input id="newItemQty" type="number" min="1" value="1"></label><label>Peso (kg)<input id="newItemWeight" type="number" min="0" step=".1" value="0"></label><button id="addItem">＋</button></div><div class="item-list">${items.map((it,i)=>`<div class="item"><div><strong>${esc(it.name)}</strong><small>${n(it.qty,0)} un. · ${n(it.weight,0)} kg cada</small></div><b>${n(it.qty,0)*n(it.weight,0)} kg</b><button data-remove-item="${i}">Remover</button></div>`).join("")||`<p class="notice">Seu inventário está vazio.</p>`}</div>`)}
 ${card("Tesouro",`<label>Dinheiro (TO / valor total)<input type="number" data-field="money" value="${n(c.money,0)}"></label><div class="stats" style="margin-top:14px"><div class="stat"><span>Itens</span><strong>${items.length}</strong></div><div class="stat"><span>Peso total</span><strong>${total.toFixed(1)} kg</strong></div></div><p class="notice">O limite de carga será implementado após definirmos os parâmetros completos de equipamento e capacidade.</p>`)}</div>`;
}
function notesPage(){
 return `<div class="grid-two">${card("História do personagem",`<div class="form-grid">${field("Aparência","appearance",c.appearance,"text",true,"Como o herói se apresenta?")}<label class="wide">Personalidade<textarea data-field="personality">${esc(c.personality)}</textarea></label><label class="wide">Objetivos e motivações<textarea data-field="goals">${esc(c.goals)}</textarea></label></div>`)}${card("Anotações da campanha",`<label>Notas<textarea data-field="notes">${esc(c.notes)}</textarea></label><p class="notice">Dica: exporte um backup JSON depois de mudanças importantes.</p>`)}</div>`;
}
function render(){
 normalizeClassSkills();
 syncSelect();
 $("#recordCode").textContent="AR-"+String(db.characters.indexOf(c)+1).padStart(3,"0");
 $("#breadcrumb").textContent=TABS[currentTab][0].toUpperCase();
 $("#pageTitle").textContent=TABS[currentTab][0];
 $("#pageSubtitle").textContent=TABS[currentTab][1];
 $("#editIdentity").classList.toggle("hidden",currentTab!=="overview");
 document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("active",b.dataset.tab===currentTab));
 const views={overview,attributes:attributesPage,combat:combatPage,inventory:inventoryPage,notes:notesPage};
 $("#view").innerHTML=views[currentTab]();
 bindDynamic();
 save();
}
function bindDynamic(){
 document.querySelectorAll("[data-field]").forEach(el=>el.addEventListener("change",()=>{
  const key=el.dataset.field;
  const value=el.type==="number"?n(el.value,-999,99999):el.value;
  setCharacterField(key,value);
  render();
 }));
 document.querySelectorAll("[data-attr]").forEach(el=>el.addEventListener("change",()=>{
  const attr=el.dataset.attr,oldValue=c.baseAttrs[attr]??0,oldHpMax=derived().hpMax;
  const proposed=n(el.value,-1,4),previous=c.baseAttrs[attr]??0;
  c.baseAttrs[attr]=proposed;c.attrs[attr]=proposed;
  const negativeCount=ATTRS.filter(a=>(c.baseAttrs[a]??0)===-1).length;
  if(pointTotal()>10||negativeCount>1){c.baseAttrs[attr]=previous;c.attrs[attr]=previous;alert("A distribuição padrão permite até 10 pontos e apenas um atributo em −1 para ganhar 1 ponto extra.");render();return;}
  const nextHpMax=derived().hpMax;
  if(attr==="Constituição")c.hp=n(c.hp+nextHpMax-oldHpMax,0,nextHpMax);
  render();
 }));
 document.querySelectorAll("[data-race-choice]").forEach(el=>el.addEventListener("change",()=>{
  const oldHpMax=derived().hpMax,oldPmMax=derived().pmMax;
  c.raceChoices[el.dataset.raceChoice]=el.value;
  const next=derived();c.hp=n(c.hp+next.hpMax-oldHpMax,0,next.hpMax);c.pm=n(c.pm+next.pmMax-oldPmMax,0,next.pmMax);
  render();
 }));
 $("#resetAttributes")?.addEventListener("click",()=>{c.baseAttrs={Força:0,Destreza:0,Constituição:0,Inteligência:0,Sabedoria:0,Carisma:0};c.attrs={...c.baseAttrs};render();});
 document.querySelectorAll("[data-class-alt]").forEach(el=>el.addEventListener("change",()=>{const data=ensureClassSkills();data.alternatives[el.dataset.classAlt]=el.value;normalizeClassSkills();render();}));
 document.querySelectorAll("[data-class-choice]").forEach(el=>el.addEventListener("change",()=>{const data=ensureClassSkills();data.choices[n(el.dataset.classChoice,0,50)]=el.value;normalizeClassSkills();render();}));
 document.querySelectorAll("[data-int-choice]").forEach(el=>el.addEventListener("change",()=>{const data=ensureClassSkills();data.intChoices[n(el.dataset.intChoice,0,50)]=el.value;normalizeClassSkills();render();}));
 document.querySelectorAll("[data-specialist-choice]").forEach(el=>el.addEventListener("change",()=>{const data=ensureClassSkills();data.specialistChoices[n(el.dataset.specialistChoice,0,50)]=el.value;normalizeClassSkills();render();}));
 document.querySelectorAll("[data-trained]").forEach(el=>el.addEventListener("change",()=>{const name=el.dataset.trained;c.skills[name]=c.skills[name]||{};c.skills[name].trained=el.checked;render();}));
 document.querySelectorAll("[data-skill-extra]").forEach(el=>el.addEventListener("change",()=>{const name=el.dataset.skillExtra;c.skills[name]=c.skills[name]||{};c.skills[name].extra=n(el.value,-99,99);render();}));
 document.querySelectorAll("[data-swim]").forEach(el=>el.addEventListener("change",()=>{c.athleticsSwim=el.checked;render();}));
 document.querySelectorAll("[data-adjust]").forEach(el=>el.addEventListener("click",()=>{const key=el.dataset.adjust;c[key]=n(c[key],-999,99999)+n(el.dataset.delta);const d=derived();c.hp=n(c.hp,0,d.hpMax);c.pm=n(c.pm,0,d.pmMax);render();}));
 document.querySelectorAll("[data-goto]").forEach(el=>el.addEventListener("click",()=>{currentTab=el.dataset.goto;render();}));
 document.querySelectorAll("[data-remove-item]").forEach(el=>el.addEventListener("click",()=>{c.items.splice(n(el.dataset.removeItem,0),1);render();}));
 document.querySelectorAll("[data-remove-attack]").forEach(el=>el.addEventListener("click",()=>{c.attacks.splice(n(el.dataset.removeAttack,0),1);render();}));
 document.querySelectorAll("[data-attack]").forEach(el=>el.addEventListener("change",()=>{const attack=c.attacks[n(el.dataset.attack,0)];attack[el.dataset.akey]=el.type==="number"?n(el.value):el.value;save();}));
 $("#addItem")?.addEventListener("click",()=>{const name=$("#newItemName").value.trim();if(!name)return;c.items.push({name,qty:n($("#newItemQty").value,1,999),weight:n($("#newItemWeight").value,0,999)});render();});
 $("#addAttack")?.addEventListener("click",()=>{c.attacks.push({name:"Novo ataque",bonus:0,damage:"1d6",crit:"x2"});render();});
 $("#rollBtn")?.addEventListener("click",()=>{
  const skill=$("#rollSkill").value,def=SKILLS.find(x=>x[0]===skill),total=skillTotal(skill,def[1]),die=1+Math.floor(Math.random()*20),result=die+total,dc=$("#dc").value;
  $("#rollResult").textContent=`${die} ${total>=0?"+":""}${total} = ${result}`;
  $("#rollExplain").textContent=dc?`CD ${dc}: ${result>=n(dc)?"Sucesso":"Falha"} (resultado natural ${die}).`:`Resultado do teste de ${skill}.`;
 });
}
$("#nav").addEventListener("click",e=>{const b=e.target.closest("[data-tab]");if(b){currentTab=b.dataset.tab;render();}});
$("#characterSelect").addEventListener("change",()=>{c=db.characters.find(x=>x.id===$("#characterSelect").value)||db.characters[0];db.active=c.id;currentTab="overview";render();});
$("#newCharacter").addEventListener("click",()=>{const x=fresh();x.name="Novo aventureiro "+(db.characters.length+1);db.characters.push(x);db.active=x.id;c=x;currentTab="overview";render();});
$("#deleteCharacter").addEventListener("click",()=>{if(db.characters.length===1){alert("Mantenha ao menos uma ficha no arquivo.");return;}if(confirm(`Excluir a ficha de ${c.name}?`)){db.characters=db.characters.filter(x=>x.id!==c.id);c=db.characters[0];db.active=c.id;currentTab="overview";render();}});
$("#editIdentity").addEventListener("click",()=>{
 const dlg=document.createElement("dialog");
 dlg.style.cssText="background:#191a16;color:#eee8db;border:1px solid #c7a66a;border-radius:8px;padding:24px;width:min(600px,90vw)";
 dlg.innerHTML=`<form><h2>Identidade do aventureiro</h2>${identityFields()}<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px"><button type="button" id="cancelIdentity">Cancelar</button><button type="button" class="primary" id="saveIdentity">Salvar identidade</button></div></form>`;
 document.body.appendChild(dlg);dlg.showModal();
 dlg.querySelector("#cancelIdentity").addEventListener("click",()=>{dlg.close();dlg.remove();});
 dlg.querySelector("#saveIdentity").addEventListener("click",()=>{
  dlg.querySelectorAll("[data-field]").forEach(el=>{const key=el.dataset.field;const value=el.type==="number"?n(el.value,-999,99999):el.value;setCharacterField(key,value);});
  dlg.close();dlg.remove();render();toast("Identidade salva");
 });
});
$("#exportBtn").addEventListener("click",()=>{const blob=new Blob([JSON.stringify({format:"cronicas-arton-backup",version:1,exportedAt:new Date().toISOString(),data:db},null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="cronicas-arton-backup.json";a.click();URL.revokeObjectURL(a.href);toast("Backup exportado");});
$("#importBtn").addEventListener("click",()=>$("#importFile").click());
$("#importFile").addEventListener("change",async e=>{const f=e.target.files[0];if(!f)return;try{const obj=JSON.parse(await f.text()),imported=obj.data||obj;if(!Array.isArray(imported.characters)||!imported.characters.length)throw new Error("Arquivo sem fichas válidas");if(confirm("Importar este backup e substituir as fichas atuais neste navegador?")){db=imported;db.characters.forEach(x=>{if(!x.attrs)x.attrs={Força:0,Destreza:0,Constituição:0,Inteligência:0,Sabedoria:0,Carisma:0};if(!x.baseAttrs)x.baseAttrs={...x.attrs};if(!x.raceChoices)x.raceChoices={};if(!x.skills)x.skills={};if(!x.classSkills||typeof x.classSkills!=="object")x.classSkills={alternatives:{},choices:[],intChoices:[],specialistChoices:[]};if(!x.classSkills.alternatives)x.classSkills.alternatives={};if(!Array.isArray(x.classSkills.choices))x.classSkills.choices=[];if(!Array.isArray(x.classSkills.intChoices))x.classSkills.intChoices=[];if(!Array.isArray(x.classSkills.specialistChoices))x.classSkills.specialistChoices=[];const classRule=CLASS_SKILL_RULES[x.className];(classRule?.alternatives||[]).forEach((options,i)=>{if(!options.includes(x.classSkills.alternatives[i]))x.classSkills.alternatives[i]=options[0];});if(!Array.isArray(x.attacks))x.attacks=[];if(!Array.isArray(x.items))x.items=[];if(x.hpBonus===undefined)x.hpBonus=0;if(x.pmBonus===undefined)x.pmBonus=0;if(x.athleticsSwim===undefined)x.athleticsSwim=false;});c=db.characters.find(x=>x.id===db.active)||db.characters[0];db.active=c.id;currentTab="overview";render();toast("Backup importado");}}catch(err){alert("Não foi possível importar: "+err.message);}e.target.value="";});
$("#printBtn").addEventListener("click",()=>window.print());
render();
