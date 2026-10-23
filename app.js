const $ = s => document.querySelector(s);
const ATTRS = ["Força","Destreza","Constituição","Inteligência","Sabedoria","Carisma"];
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
const RACE_MODS = {
  "Anão": {"Constituição":2,"Sabedoria":1,"Destreza":-1},
  "Dahllan": {"Sabedoria":2,"Destreza":1,"Inteligência":-1},
  "Elfo": {"Inteligência":2,"Destreza":1,"Constituição":-1},
  "Goblin": {"Destreza":2,"Inteligência":1,"Carisma":-1},
  "Golem": {"Força":2,"Constituição":1,"Carisma":-1},
  "Hynne": {"Destreza":2,"Carisma":1,"Força":-1},
  "Kliren": {"Inteligência":2,"Carisma":1,"Força":-1},
  "Medusa": {"Destreza":2,"Carisma":1},
  "Minotauro": {"Força":2,"Constituição":1,"Sabedoria":-1},
  "Qareen": {"Carisma":2,"Inteligência":1,"Sabedoria":-1},
  "Sílfide": {"Carisma":2,"Destreza":1,"Força":-2},
  "Trog": {"Constituição":2,"Força":1,"Inteligência":-1}
};
const fresh = () => ({
 id: crypto.randomUUID(), name:"Novo aventureiro", player:"", race:"", className:"", origin:"", deity:"", level:1, xp:0,
 attrs:{Força:2,Destreza:1,Constituição:2,Inteligência:0,Sabedoria:0,Carisma:0},
 hp:18,hpMax:18,hpFirstLevel:16,hpPerLevel:4,pm:5,pmMax:5,pmPerLevel:5,defenseBonus:0,armorPenalty:0,speed:9,initiativeBonus:0,
 skills:{}, attacks:[{name:"Ataque principal",bonus:0,damage:"1d6",crit:"x2"}], items:[{name:"Equipamento inicial",qty:1,weight:0}], money:0,
 notes:"", appearance:"", personality:"", goals:""
});
let db = {characters:[fresh()],active:null}, c, currentTab="overview";
try { const stored=JSON.parse(localStorage.getItem("cronicas-arton-v1")); if(stored?.characters?.length) db=stored; } catch(e) {}
if(!db.active) db.active=db.characters[0].id;
c=db.characters.find(x=>x.id===db.active)||db.characters[0];
function esc(v){return String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));}
function n(v,min=-999,max=99999){v=Number(v);return Math.max(min,Math.min(max,Number.isFinite(v)?v:min));}
function signed(v){return v>=0?"+"+v:String(v);}
function mod(a){return n(c.attrs[a]??0,-20,30);}
function trainBonus(){return c.level<=6?2:c.level<=14?4:6;}
function skillTotal(name,attr){const s=c.skills[name]||{};return Math.floor(c.level/2)+mod(attr)+(s.trained?trainBonus():0)+n(s.extra||0,-99,99);}
function derived(){
 const hpMax=n(c.hpFirstLevel,0)+mod("Constituição")+(n(c.hpPerLevel,0)+mod("Constituição"))*Math.max(0,c.level-1);
 const pmMax=n(c.pmPerLevel,0)*c.level;
 const defense=10+mod("Destreza")+n(c.defenseBonus, -99,999);
 return {hpMax:Math.max(1,hpMax),pmMax:Math.max(0,pmMax),defense};
}
function save(){
 try{localStorage.setItem("cronicas-arton-v1",JSON.stringify(db));$("#saveStatus").textContent="Salvo neste navegador";}
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
 ${field("Raça","race",c.race,"text",false,"Ex.: Humano")}
 ${field("Classe","className",c.className,"text",false,"Ex.: Guerreiro")}
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
 return `<div class="attr-list">${ATTRS.map(a=>`<div class="attr"><span class="attr-name">${a}</span><input type="number" data-attr="${a}" value="${esc(c.attrs[a]??0)}" aria-label="${a}"><span class="modifier">${signed(mod(a))}</span></div>`).join("")}</div>`;
}
function overview(){
 const d=derived();
 return `<div class="dashboard">
 <section class="card profile"><div class="portrait">✦</div><div class="profile-body"><span class="tag">${esc(c.className||"Classe a definir")} · Nível ${n(c.level,1,20)}</span><h3>${esc(c.name)}</h3><p>${esc([c.race,c.origin].filter(Boolean).join(" · ")||"Raça e origem a definir")}</p><div class="details">
 <div class="detail"><span>Jogador</span><b>${esc(c.player||"Não informado")}</b></div><div class="detail"><span>Divindade</span><b>${esc(c.deity||"Nenhuma")}</b></div><div class="detail"><span>Experiência</span><b>${n(c.xp,0)}</b></div><div class="detail"><span>Deslocamento</span><b>${n(c.speed,0)} m</b></div>
 </div></div></section>
 <div class="right-stack">
 <div class="resources">${resource("PONTOS DE VIDA","hp","hpMax","#9d4740")}${resource("PONTOS DE MANA","pm","pmMax","#6c8c9b")}${`<section class="card resource"><div class="overline">DEFESA</div><strong>${d.defense}</strong><div class="notice">10 + Destreza + outros bônus</div><div class="resource-controls"><button data-adjust="defenseBonus" data-delta="-1">−</button><input data-field="defenseBonus" type="number" value="${n(c.defenseBonus)}" aria-label="Outros bônus de Defesa"><button data-adjust="defenseBonus" data-delta="1">+</button><small>BÔNUS</small></div></section>`}</div>
 <div class="stats"><div class="stat"><span>Nível</span><strong>${n(c.level,1,20)}</strong></div><div class="stat"><span>Bônus treino</span><strong>+${trainBonus()}</strong></div><div class="stat"><span>Iniciativa</span><strong>${signed(mod("Destreza")+n(c.initiativeBonus))}</strong></div><div class="stat"><span>Perícias</span><strong>${Object.values(c.skills).filter(s=>s.trained).length}</strong></div></div>
 ${card("Atributos",`<div class="attributes">${attrBlock()}<div><p class="notice">No Tormenta20, os atributos usam valores diretos: 0 representa a média humana. Os totais de perícia usam metade do nível, atributo-chave e bônus de treinamento quando aplicável.</p><button class="primary" data-goto="attributes">Editar perícias ↗</button></div></div>`)}
 </div></div>`;
}
function attributesPage(){
 const rows=SKILLS.map(([name,a])=>{const s=c.skills[name]||{};return `<div class="skill-row"><span>${name} <small>(${a})</small></span><label class="trained"><input type="checkbox" data-trained="${name}" ${s.trained?"checked":""}>Treinado</label><input type="number" data-skill-extra="${name}" value="${n(s.extra||0)}" aria-label="Bônus extra ${name}"><span class="total">${signed(skillTotal(name,a))}</span></div>`}).join("");
 return `<div class="grid-two">${card("Atributos",`<div class="attributes">${attrBlock()}</div>`)}${card("Parâmetros derivados",`<div class="form-grid">${field("Nível","level",c.level,"number")}${field("PV base no 1º nível","hpFirstLevel",c.hpFirstLevel,"number")}${field("PV por nível seguinte","hpPerLevel",c.hpPerLevel,"number")}${field("PM por nível*","pmPerLevel",c.pmPerLevel,"number")}${field("Bônus de Defesa","defenseBonus",c.defenseBonus,"number")}${field("Deslocamento (m)","speed",c.speed,"number")}${field("Bônus de Iniciativa","initiativeBonus",c.initiativeBonus,"number")}</div><p class="notice">* Campos provisórios configuráveis. Na próxima etapa vamos preencher as progressões por classe e revisar cada fórmula contra a edição do livro que você usa.</p>`)}</div>
 ${card("Perícias",`<div class="skill-row skill-head"><span>Perícia / atributo-chave</span><span>Treinamento</span><span>Bônus extra</span><span>Total</span></div><div class="skills">${rows}</div>`,"Metade do nível + atributo + treinamento + extras")}`;
}
function combatPage(){
 const d=derived();
 return `<div class="combat-stats"><div class="combat-stat"><label>DEFESA TOTAL</label><input readonly value="${d.defense}"></div><div class="combat-stat"><label>INICIATIVA</label><input readonly value="${signed(mod("Destreza")+n(c.initiativeBonus))}"></div><div class="combat-stat"><label>DESLOCAMENTO (m)</label><input type="number" data-field="speed" value="${n(c.speed)}"></div></div>
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
  const key=el.dataset.field, val=el.type==="number"?n(el.value,-999,99999):el.value;
  c[key]=val;
 if (key === "level") {
  updateLevel(val);
} else if (key === "race") {
  const oldMax = derived().hpMax;
  c.race = val;
  c.raceChoices = {};
  const newMax = derived().hpMax;
  c.hp = n(c.hp + (newMax - oldMax), 0, newMax);
} else {
  c[key] = val;
}
  render();
 }));
 document.querySelectorAll("[data-attr]").forEach(el=>el.addEventListener("change",()=>{c.attrs[el.dataset.attr]=n(el.value,-10,30);render();}));
 document.querySelectorAll("[data-trained]").forEach(el=>el.addEventListener("change",()=>{const name=el.dataset.trained;c.skills[name]=c.skills[name]||{};c.skills[name].trained=el.checked;render();}));
 document.querySelectorAll("[data-skill-extra]").forEach(el=>el.addEventListener("change",()=>{const name=el.dataset.skillExtra;c.skills[name]=c.skills[name]||{};c.skills[name].extra=n(el.value,-99,99);render();}));
 document.querySelectorAll("[data-adjust]").forEach(el=>el.addEventListener("click",()=>{const key=el.dataset.adjust;c[key]=n(c[key],-999,99999)+n(el.dataset.delta);render();}));
 document.querySelectorAll("[data-goto]").forEach(el=>el.addEventListener("click",()=>{currentTab=el.dataset.goto;render();}));
 document.querySelectorAll("[data-remove-item]").forEach(el=>el.addEventListener("click",()=>{c.items.splice(n(el.dataset.removeItem,0),1);render();}));
 document.querySelectorAll("[data-remove-attack]").forEach(el=>el.addEventListener("click",()=>{c.attacks.splice(n(el.dataset.removeAttack,0),1);render();}));
 document.querySelectorAll("[data-attack]").forEach(el=>el.addEventListener("change",()=>{const a=c.attacks[n(el.dataset.attack,0)];a[el.dataset.akey]=el.type==="number"?n(el.value):el.value;save();}));
 $("#addItem")?.addEventListener("click",()=>{const name=$("#newItemName").value.trim();if(!name)return; c.items.push({name,qty:n($("#newItemQty").value,1,999),weight:n($("#newItemWeight").value,0,999)});render();});
 $("#addAttack")?.addEventListener("click",()=>{c.attacks.push({name:"Novo ataque",bonus:0,damage:"1d6",crit:"x2"});render();});
 $("#rollBtn")?.addEventListener("click",()=>{
   const skill=$("#rollSkill").value, def=SKILLS.find(x=>x[0]===skill), total=skillTotal(skill,def[1]), die=1+Math.floor(Math.random()*20), result=die+total, dc=$("#dc").value;
   $("#rollResult").textContent=`${die} ${total>=0?"+":""}${total} = ${result}`;
   $("#rollExplain").textContent=dc?`CD ${dc}: ${result>=n(dc)?"Sucesso":"Falha"} (resultado natural ${die}).`:`Resultado do teste de ${skill}.`;
 });
}
$("#nav").addEventListener("click",e=>{const b=e.target.closest("[data-tab]");if(b){currentTab=b.dataset.tab;render();}});
$("#characterSelect").addEventListener("change",()=>{c=db.characters.find(x=>x.id===$("#characterSelect").value)||db.characters[0];currentTab="overview";render();});
$("#newCharacter").addEventListener("click",()=>{const x=fresh();x.name="Novo aventureiro "+(db.characters.length+1);db.characters.push(x);db.active=x.id;c=x;currentTab="overview";render();});
$("#deleteCharacter").addEventListener("click",()=>{if(db.characters.length===1){alert("Mantenha ao menos uma ficha no arquivo.");return;}if(confirm(`Excluir a ficha de ${c.name}?`)){db.characters=db.characters.filter(x=>x.id!==c.id);c=db.characters[0];db.active=c.id;currentTab="overview";render();}});
$("#editIdentity").addEventListener("click",()=>{const html=identityFields();const dlg=document.createElement("dialog");dlg.style.cssText="background:#191a16;color:#eee8db;border:1px solid #c7a66a;border-radius:8px;padding:24px;width:min(600px,90vw)";dlg.innerHTML=`<form method="dialog"><h2>Identidade do aventureiro</h2>${html}<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px"><button value="cancel">Cancelar</button><button class="primary" value="save">Salvar identidade</button></div></form>`;document.body.appendChild(dlg);dlg.showModal();dlg.addEventListener("close",()=>{if(dlg.returnValue==="save"){dlg.querySelectorAll("[data-field]").forEach(el=>{c[el.dataset.field]=el.type==="number"?n(el.value):el.value;});c.level=n(c.level,1,20);render();}dlg.remove();});});
$("#exportBtn").addEventListener("click",()=>{const blob=new Blob([JSON.stringify({format:"cronicas-arton-backup",version:1,exportedAt:new Date().toISOString(),data:db},null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="cronicas-arton-backup.json";a.click();URL.revokeObjectURL(a.href);toast("Backup exportado");});
$("#importBtn").addEventListener("click",()=>$("#importFile").click());
$("#importFile").addEventListener("change",async e=>{const f=e.target.files[0];if(!f)return;try{const obj=JSON.parse(await f.text()), imported=obj.data||obj;if(!Array.isArray(imported.characters)||!imported.characters.length)throw new Error("Arquivo sem fichas válidas");if(confirm("Importar este backup e substituir as fichas atuais neste navegador?")){db=imported;c=db.characters.find(x=>x.id===db.active)||db.characters[0];currentTab="overview";render();toast("Backup importado");}}catch(err){alert("Não foi possível importar: "+err.message);}e.target.value="";});
$("#printBtn").addEventListener("click",()=>window.print());
render();
