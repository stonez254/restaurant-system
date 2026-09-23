import React,{useMemo,useState} from "react";
import {BarChart3,TrendingUp,TrendingDown,Wallet,Package,Receipt,Clock} from "lucide-react";

const ranges=[["Today",1],["7 Days",7],["30 Days",30]];
const money=n=>"KSh "+Number(n||0).toLocaleString("en-KE",{minimumFractionDigits:2,maximumFractionDigits:2});

export default function Analytics({orders,menu,recipes,ingredients,movements,adjustments}){
 const [range,setRange]=useState(7);
 const now=Date.now(), cutoff=now-range*86400000;
 const data=useMemo(()=>{
  const inRange=o=>new Date(o.createdAt).getTime()>=cutoff;
  const selected=orders.filter(inRange);
  const menuMap=Object.fromEntries(menu.map(x=>[x.id,x]));
  const ingredientMap=Object.fromEntries(ingredients.map(x=>[x.id,x]));
  let revenue=0,cogs=0;
  const channels={},categories={},items={},hours={};
  selected.forEach(o=>{
   revenue+=Number(o.total||0);
   const h=new Date(o.createdAt).getHours(); hours[h]=(hours[h]||0)+Number(o.total||0);
   channels[o.channel]=(channels[o.channel]||0)+Number(o.total||0);
   (o.items||[]).forEach(item=>{
    const sales=Number(item.price||0)*Number(item.qty||0);
    const cat=menuMap[item.id]?.category||"Other";
    categories[cat]=(categories[cat]||0)+sales;
    items[item.id]=items[item.id]||{name:item.name,qty:0,sales:0};
    items[item.id].qty+=Number(item.qty||0); items[item.id].sales+=sales;
    (recipes[item.id]||[]).forEach(r=>{cogs+=(Number(r.qty)||0)*Number(item.qty||0)*Number(ingredientMap[r.ingredientId]?.cost||0);});
   });
  });
  const refunds=(adjustments||[]).filter(a=>a.type==="Refund"&&new Date(a.createdAt).getTime()>=cutoff).reduce((s,a)=>s+Number(a.amount||0),0);
  const waste=(movements||[]).filter(m=>m.type==="Waste"&&new Date(m.createdAt).getTime()>=cutoff).reduce((s,m)=>s+Number(m.cost||0),0);
  return {selected,revenue,cogs,refunds,waste,net:revenue-refunds,gross:revenue-cogs,channels,categories,hours,items:Object.values(items).sort((a,b)=>b.sales-a.sales)};
 },[orders,menu,recipes,ingredients,movements,adjustments,cutoff]);
 const maxChannel=Math.max(1,...Object.values(data.channels));
 const maxCategory=Math.max(1,...Object.values(data.categories));
 const maxHour=Math.max(1,...Object.values(data.hours));
 const peak=Object.entries(data.hours).sort((a,b)=>b[1]-a[1])[0];
 return <section className="content">
  <div className="section-head"><div><h2>Analytics & Profit Intelligence</h2><p>Sales, estimated COGS, profit and operating trends from local POS data.</p></div><div className="range-tabs">{ranges.map(([label,days])=><button key={days} className={range===days?"active":""} onClick={()=>setRange(days)}>{label}</button>)}</div></div>
  <div className="stats analytics-stats">
   <Metric icon={Receipt} label="Gross Sales" value={money(data.revenue)}/>
   <Metric icon={Wallet} label="Net Sales" value={money(data.net)}/>
   <Metric icon={Package} label="Est. COGS" value={money(data.cogs)}/>
   <Metric icon={TrendingUp} label="Gross Profit" value={money(data.gross)}/>
   <Metric icon={TrendingDown} label="Waste Cost" value={money(data.waste)}/>
   <Metric icon={Receipt} label="Refunds" value={money(data.refunds)}/>
   <Metric icon={BarChart3} label="Orders" value={data.selected.length}/>
   <Metric icon={Clock} label="Peak Hour" value={peak?formatHour(Number(peak[0])):"—"}/>
  </div>
  <div className="analytics-grid">
   <Panel title="Sales by Channel">{Object.entries(data.channels).length?Object.entries(data.channels).map(([k,v])=><Bar key={k} label={k} value={v} max={maxChannel}/>):<EmptyAnalytics/>}</Panel>
   <Panel title="Sales by Category">{Object.entries(data.categories).length?Object.entries(data.categories).sort((a,b)=>b[1]-a[1]).map(([k,v])=><Bar key={k} label={k} value={v} max={maxCategory}/>):<EmptyAnalytics/>}</Panel>
   <Panel title="Peak Ordering Periods">{Object.entries(data.hours).length?Object.entries(data.hours).sort((a,b)=>Number(a[0])-Number(b[0])).map(([h,v])=><Bar key={h} label={formatHour(Number(h))} value={v} max={maxHour}/>):<EmptyAnalytics/>}</Panel>
   <Panel title="Top-Selling Items"><div className="analytics-table">{data.items.length?data.items.slice(0,8).map((x,i)=><div className="analytics-row" key={x.name+i}><span><b>{i+1}.</b> {x.name}</span><span>{x.qty} sold</span><strong>{money(x.sales)}</strong></div>):<EmptyAnalytics/>}</div></Panel>
  </div>
  <div className="panel profit-note"><div className="panel-head"><h3>Profit calculation</h3></div><div className="profit-body"><div><span>Net Sales</span><b>{money(data.net)}</b></div><div><span>Estimated COGS</span><b>- {money(data.cogs)}</b></div><div><span>Estimated Gross Profit</span><b>{money(data.net-data.cogs)}</b></div><p>COGS is estimated from the current ingredient cost and recipe quantities. Historical batch costing and labor/overhead/rider payouts will be added to the intelligence layer later.</p></div></div>
 </section>;
}
function Metric({icon:Icon,label,value}){return <div className="card analytics-card"><Icon size={18}/><span>{label}</span><strong>{value}</strong></div>}
function Panel({title,children}){return <div className="panel analytics-panel"><div className="panel-head"><h3>{title}</h3></div><div className="analytics-body">{children}</div></div>}
function Bar({label,value,max}){return <div className="bar-row"><div><span>{label}</span><b>{money(value)}</b></div><i><em style={{width:(value/max*100)+"%"}}/></i></div>}
function EmptyAnalytics(){return <div className="analytics-empty">No sales data for this period.</div>}
function formatHour(h){const suffix=h>=12?"PM":"AM",x=h%12||12;return x+" "+suffix;}
