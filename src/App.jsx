import React,{useEffect,useState} from "react";
import {Settings} from "lucide-react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./components/Dashboard";
import POS from "./components/POS";
import Tables from "./components/Tables";
import Orders from "./components/Orders";
import Kitchen from "./components/Kitchen";
import Delivery from "./components/Delivery";
import MenuManager from "./components/MenuManager";
import Staff from "./components/Staff";
import Customers from "./components/Customers";
import DeliveryRiders from "./components/DeliveryRiders";
import {initialStaff,staffRoles} from "./data/staff";
import {initialCustomers,customerTypes} from "./data/customers";
import {initialRiders,riderStatuses} from "./data/delivery";
import {menuItems,categories,modifiers} from "./data/menu";
import {initialTables,tableStatuses} from "./data/tables";
import {loadStore,saveStore} from "./lib/storage";
import {orderStatuses} from "./data/workflows";
import "./styles.css";

const money=n=>"KSh "+Number(n||0).toLocaleString("en-KE",{minimumFractionDigits:2,maximumFractionDigits:2});

export default function App(){
 const [collapsed,setCollapsed]=useState(false),[active,setActive]=useState("Dashboard");
 const [menu,setMenu]=useState(()=>loadStore("restaurant-menu",menuItems));
 const [tables,setTables]=useState(()=>loadStore("restaurant-tables",initialTables));
 const [orders,setOrders]=useState(()=>loadStore("restaurant-orders",[]));
 const [cart,setCart]=useState([]),[channel,setChannel]=useState("Dine In"),[selectedTable,setSelectedTable]=useState(null);
 const [staff,setStaff]=useState(()=>loadStore("restaurant-staff",initialStaff));
 const [customers,setCustomers]=useState(()=>loadStore("restaurant-customers",initialCustomers));
 const [riders,setRiders]=useState(()=>loadStore("restaurant-riders",initialRiders));
 useEffect(()=>saveStore("restaurant-menu",menu),[menu]); useEffect(()=>saveStore("restaurant-tables",tables),[tables]); useEffect(()=>saveStore("restaurant-orders",orders),[orders]); useEffect(()=>saveStore("restaurant-staff",staff),[staff]); useEffect(()=>saveStore("restaurant-customers",customers),[customers]); useEffect(()=>saveStore("restaurant-riders",riders),[riders]);

 const todaySales=orders.filter(o=>o.status===orderStatuses[3]).reduce((s,o)=>s+o.total,0);
 const occupied=tables.filter(t=>t.status!=="Vacant").length;
 const openOrders=orders.filter(o=>o.status!==orderStatuses[3]).length;

 function addItem(item,modifier=modifiers[0]){
  const mod=typeof modifier==="string"?modifiers.find(m=>m.name===modifier)||modifiers[0]:modifier;
  setCart(c=>{const key=item.id+"-"+mod.id,found=c.find(x=>x.key===key); if(found)return c.map(x=>x.key===key?{...x,qty:x.qty+1}:x);
   return [...c,{key,id:item.id,name:item.name,price:item.price+mod.price,qty:1,modifier:mod}];});
 }
 function changeQty(key,d){setCart(c=>c.map(x=>x.key===key?{...x,qty:x.qty+d}:x).filter(x=>x.qty>0))}
 function removeCart(key){setCart(c=>c.filter(x=>x.key!==key))}
 function placeOrder(){
  if(!cart.length||(channel==="Dine In"&&!selectedTable))return;
  const id="ORD-"+String(Date.now()).slice(-6),total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  const order={id,channel,table:selectedTable?.name||null,items:cart,total,status:orderStatuses[0],createdAt:new Date().toISOString()};
  setOrders(o=>[order,...o]);
  if(selectedTable)setTables(ts=>ts.map(t=>t.id===selectedTable.id?{...t,status:"Order Placed",orderId:id}:t));
  setCart([]);setSelectedTable(null);setActive("Orders");
 }
 function updateOrder(id,status){
  const order=orders.find(o=>o.id===id); setOrders(os=>os.map(o=>o.id===id?{...o,status}:o));
  if(order?.table&&status===orderStatuses[3])setTables(ts=>ts.map(t=>t.name===order.table?{...t,status:"Dirty/Needs Cleaning",orderId:null}:t));
  else if(order?.table&&status==="Ready")setTables(ts=>ts.map(t=>t.name===order.table?{...t,status:"Bill Printed",orderId:id}:t));
 }
 function toggleTable(t){
  if(t.status==="Vacant"){setSelectedTable(t);setChannel("Dine In");setActive("POS")}
  else if(t.status==="Dirty/Needs Cleaning")setTables(ts=>ts.map(x=>x.id===t.id?{...x,status:"Vacant",orderId:null}:x));
 }
 return <div className="app"><Sidebar collapsed={collapsed} setCollapsed={setCollapsed} active={active} setActive={setActive}/><main className="main"><Topbar active={active}/>
  {active==="Dashboard"&&<Dashboard money={money} sales={todaySales} openOrders={openOrders} occupied={occupied} lowStock={0} orders={orders} tables={tables} onPOS={()=>setActive("POS")}/>}
  {active==="POS"&&<POS menu={menu} categories={categories} modifiers={modifiers} cart={cart} addItem={addItem} changeQty={changeQty} removeCart={removeCart} placeOrder={placeOrder} channel={channel} setChannel={setChannel} selectedTable={selectedTable} setSelectedTable={setSelectedTable} tables={tables} money={money}/>}
  {active==="Tables"&&<Tables tables={tables} onTable={toggleTable} tableStatuses={tableStatuses}/>}
  {active==="Orders"&&<Orders orders={orders} update={updateOrder} money={money}/>}
  {active==="Kitchen"&&<Kitchen orders={orders} update={updateOrder} money={money}/>}
  {active==="Delivery"&&<Delivery orders={orders} update={updateOrder} money={money}/>}
  {active==="Menu"&&<MenuManager menu={menu} setMenu={setMenu} categories={categories} money={money}/>} {active==="Staff"&&<Staff staff={staff} setStaff={setStaff} roles={staffRoles}/>} {active==="Customers"&&<Customers customers={customers} setCustomers={setCustomers} types={customerTypes}/>} {active==="Delivery"&&<Delivery orders={orders} update={updateOrder} money={money}/>}
  {!["Dashboard","POS","Tables","Orders","Kitchen","Delivery","Menu"].includes(active)&&<ModulePreview name={active}/>}
 </main></div>;
}
function ModulePreview({name}){return <section className="content"><div className="module"><div className="module-icon"><Settings size={28}/></div><h2>{name}</h2><p>This module is connected to the shared POS data model. Its dedicated workflow is next in the build.</p></div></section>}
