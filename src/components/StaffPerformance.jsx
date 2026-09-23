import React,{useMemo} from "react";
import {Users,Clock3,ShoppingCart,AlertCircle} from "lucide-react";
import Empty from "./Empty";
export default function StaffPerformance({staff,shifts,setShifts,orders,complaints}){
 const activeStaff=staff.filter(s=>s.active);
 const open=shifts.filter(s=>s.status==="Open");
 const startShift=(s)=>setShifts(xs=>[{id:"SHIFT-"+Date.now(),staffId:s.id,status:"Open",startedAt:new Date().toISOString()},...xs]);
 const closeShift=(id)=>setShifts(xs=>xs.map(x=>x.id===id?{...x,status:"Closed",endedAt:new Date().toISOString()}:x));
 const stats=useMemo(()=>activeStaff.map(s=>{const mine=orders.filter(o=>o.staffId===s.id);const sales=mine.reduce((a,o)=>a+Number(o.total||0),0);const issues=complaints.filter(c=>c.staffId===s.id).length;return {...s,count:mine.length,sales,issues}}),[activeStaff,orders,complaints]);
 return <section className="content"><div className="section-head"><div><h2>Staff Performance</h2><p>Track shifts, orders, sales and linked service issues.</p></div></div>
 <div className="stats"><div className="card"><Users size={18}/><span>Active Staff</span><strong>{activeStaff.length}</strong></div><div className="card"><Clock3 size={18}/><span>Open Shifts</span><strong>{open.length}</strong></div><div className="card"><ShoppingCart size={18}/><span>Orders Assigned</span><strong>{orders.filter(o=>o.staffId).length}</strong></div><div className="card"><AlertCircle size={18}/><span>Linked Issues</span><strong>{complaints.filter(c=>c.staffId).length}</strong></div></div>
 <div className="admin-grid">{activeStaff.length?activeStaff.map(s=>{const shift=open.find(x=>x.staffId===s.id);return <article className="admin-item" key={s.id}><div><span>{s.role}</span><strong>{s.name}</strong><small>{shift?"Shift open since "+new Date(shift.startedAt).toLocaleTimeString():"No active shift"}</small></div>{shift?<button onClick={()=>closeShift(shift.id)}>Close Shift</button>:<button onClick={()=>startShift(s)}>Start Shift</button>}</article>}):<Empty icon={Users} title="No active staff" text="Enable staff members to manage shifts."/>}</div>
 <div className="panel"><div className="panel-head"><h3>Performance Snapshot</h3></div>{stats.map(s=><div className="movement-row" key={s.id}><strong>{s.name}</strong><span>{s.role}</span><span>{s.count} orders</span><span>KSh {s.sales.toLocaleString("en-KE",{minimumFractionDigits:2})}</span><span>{s.issues} issues</span></div>)}</div>
 </section>;
}
