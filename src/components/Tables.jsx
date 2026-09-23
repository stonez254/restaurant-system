import React,{useMemo,useState} from "react";
import {Table2,UsersRound,Merge,ArrowRightLeft,Broom} from "lucide-react";
export default function Tables({tables,onTable,tableStatuses,onMerge,onTransfer,onClean}){
 const [selected,setSelected]=useState([]),[target,setTarget]=useState("");
 const active=useMemo(()=>tables.filter(t=>selected.includes(t.id)),[tables,selected]);
 const toggle=id=>setSelected(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id].slice(-2));
 const merge=()=>{if(active.length===2){onMerge(active[0],active[1]);setSelected([]);}};
 const transfer=()=>{if(active.length===1&&target){onTransfer(active[0],Number(target));setSelected([]);setTarget("");}};
 const click=t=>{if(t.status==="Vacant"||t.status==="Dirty/Needs Cleaning")onTable(t);else toggle(t.id)};
 return <section className="content">
  <div className="section-head"><div><h2>Dining Floor</h2><p>Tap occupied tables to select them. Vacant tables open the POS.</p></div><div className="legend">{tableStatuses.map(s=><span key={s}><i className={s.toLowerCase().replaceAll(/[^a-z]+/g,"-")}/>{s}</span>)}</div></div>
  <div className="table-tools panel"><div><strong>Table Controls</strong><small>Select up to two occupied/vacant tables for merging. Select one occupied table for transfer.</small></div><div className="table-actions"><button onClick={merge} disabled={active.length!==2}><Merge size={14}/> Merge</button><select className="select compact" value={target} onChange={e=>setTarget(e.target.value)}><option value="">Transfer to...</option>{tables.filter(t=>t.status==="Vacant"&&!selected.includes(t.id)).map(t=><option key={t.id} value={t.id}>{t.name} • {t.seats} seats</option>)}</select><button onClick={transfer} disabled={active.length!==1||!target}><ArrowRightLeft size={14}/> Transfer</button><button className="ghost" onClick={()=>setSelected([])}>Clear</button></div></div>
  <div className="floor-grid">{tables.map(t=><button className={"floor-table "+t.status.toLowerCase().replaceAll(/[^a-z]+/g,"-")+" "+(selected.includes(t.id)?"selected":"")} onClick={()=>click(t)} key={t.id}><Table2 size={25}/><strong>{t.name}</strong><span><UsersRound size={11}/> {t.seats} seats</span><small>{t.status}</small>{t.orderId&&<em>{t.orderId}</em>}{t.mergedGroupId&&<em>Group {t.mergedGroupId}</em>}{t.status==="Dirty/Needs Cleaning"&&<i className="clean-badge" onClick={e=>{e.stopPropagation();onClean(t)}}><Broom size={12}/></i>}</button>)}</div>
  <p className="table-hint">Selected tables get a dark outline. Merge works for two tables; transfer moves an active dine-in order to a vacant table.</p>
 </section>;
}