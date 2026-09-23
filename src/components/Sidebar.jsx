import React from "react";
import { BarChart3, ChefHat, ClipboardList, LayoutDashboard, Menu as MenuIcon, Settings, ShoppingBag, Table2, Truck, Users, Package, MessageSquare, PanelLeftClose, PanelLeftOpen, CreditCard } from "lucide-react";

export const modules=[
  ["Dashboard",LayoutDashboard],["POS",ShoppingBag],["Tables",Table2],["Orders",ClipboardList],
  ["Kitchen",ChefHat],["Delivery",Truck],["Menu",MenuIcon],["Inventory",Package],
  ["Customers",Users],["Payments",CreditCard],["Complaints",MessageSquare],["Analytics",BarChart3],["Staff",Users],["Staff Performance",BarChart3],["Operations",Settings],["Settings",Settings]
];

export default function Sidebar({collapsed,setCollapsed,active,setActive}){
 return <aside className={collapsed?"sidebar collapsed":"sidebar"}>
  <div className="brand"><div className="brand-mark">R</div>{!collapsed&&<div><strong>Restaurant POS</strong><span>Web Management System</span></div>}</div>
  <nav>{modules.map(([label,Icon])=><button className={active===label?"nav-item active":"nav-item"} onClick={()=>setActive(label)} key={label} title={label}><Icon size={19}/>{!collapsed&&<span>{label}</span>}</button>)}</nav>
  <button className="collapse" onClick={()=>setCollapsed(!collapsed)}>{collapsed?<PanelLeftOpen size={19}/>:<PanelLeftClose size={19}/>} {!collapsed&&<span>Collapse menu</span>}</button>
 </aside>
}