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
import Inventory from "./components/Inventory";
import Payments from "./components/Payments";
import Complaints from "./components/Complaints";
import Analytics from "./components/Analytics";
import {initialStaff,staffRoles} from "./data/staff";
import {initialCustomers,customerTypes} from "./data/customers";
import {initialRiders,riderStatuses} from "./data/delivery";
import {menuItems,categories,modifiers} from "./data/menu";
import {initialTables,tableStatuses} from "./data/tables";
import {loadStore,saveStore} from "./lib/storage";
import {orderStatuses} from "./data/workflows";
import {initialIngredients} from "./data/inventory";
import {initialRecipes} from "./data/recipes";
import {initialPayments} from "./data/payments";
import {initialComplaints,initialAdjustments,complaintTypes,complaintStatuses,resolutions} from "./data/complaints";
import "./styles.css";
const money=n=>"KSh "+Number(n||0).toLocaleString("en-KE",{minimumFractionDigits:2,maximumFractionDigits:2});
export default function App(){
 const [collapsed,setCollapsed]=useState(false),[active,setActive]=useState("Dashboard");
 const [menu,setMenu]=useState(()=>loadStore("restaurant-menu",menuItems)),[tables,setTables]=useState(()=>loadStore("restaurant-tables",initialTables)),[orders,setOrders]=useState(()=>loadStore("restaurant-orders",[]));
 const [cart,setCart]=useState([]),[channel,setChannel]=useState("Dine In"),[selectedTable,setSelectedTable]=useState(null);
 const [staff,setStaff]=useState(()=>loadStore("restaurant-staff",initialStaff)),[customers,setCustomers]=useState(()=>loadStore("restaurant-customers",initialCustomers)),[riders,setRiders]=useState(()=>loadStore("restaurant-riders",initialRiders));
 const [ingredients,setIngredients]=useState(()=>loadStore("restaurant-ingredients",initialIngredients)),[recipes]=useState(()=>loadStore("restaurant-recipes",initialRecipes)),[movements,setMovements]=useState(()=>loadStore("restaurant-stock-movements",[]));
 const [payments,setPayments]=useState(()=>loadStore("restaurant-payments",initialPayments)),[complaints,setComplaints]=useState(()=>loadStore("restaurant-complaints",initialComplaints)),[adjustments,setAdjustments]=useState(()=>loadStore("restaurant-adjustments",initialAdjustments));
 useEffect(()=>saveStore("restaurant-menu",menu),[menu]);useEffect(()=>saveStore("restaurant-tables",tables),[tables]);useEffect(()=>saveStore("restaurant-orders",orders),[orders]);useEffect(()=>saveStore("restaurant-staff",staff),[staff]);useEffect(()=>saveStore("restaurant-customers",customers),[customers]);useEffect(()=>saveStore("restaurant-riders",riders),[riders]);useEffect(()=>saveStore("restaurant-ingredients",ingredients),[ingredients]);useEffect(()=>saveStore("restaurant-recipes",recipes),[recipes]);useEffect(()=>saveStore("restaurant-stock-movements",movements),[movements]);useEffect(()=>saveStore("restaurant-payments",payments),[payments]);useEffect(()=>saveStore("restaurant-complaints",complaints),[complaints]);useEffect(()=>saveStore("restaurant-adjustments",adjustments),[adjustments]);
 const todaySales=orders.filter(o=>o.status===orderStatuses[3]).reduce((s,o)=>s+o.total,0),occupied=tables.filter(t=>t.status!=="Vacant").length,lowStock=ingredients.filter(i=>i.stock<=i.reorderLevel).length,openOrders=orders.filter(o=>o.status!==orderStatuses[3]).length;
 function addItem(item,modifier=modifiers[0]){const mod=typeof modifier==="string"?modifiers.find(m=>m.name===modifier)||modifiers[0]:modifier;setCart(c=>{const key=item.id+"-"+mod.id,found=c.find(x=>x.key===key);if(found)return c.map(x=>x.key===key?{...x,qty:x.qty+1}:x);return [...c,{key,id:item.id,name:item.name,price:item.price+mod.price,qty:1,modifier:mod}];})}
 function changeQty(key,d){setCart(c=>c.map(x=>x.key===key?{...x,qty:x.qty+d}:x).filter(x=>x.qty>0))}function removeCart(key){setCart(c=>c.filter(x=>x.key!==key))}
 function placeOrder(){if(!cart.length||(channel==="Dine In"&&!selectedTable))return;const required={};cart.forEach(x=>(recipes[x.id]||[]).forEach(r=>{required[r.ingredientId]=(required[r.ingredientId]||0)+r.qty*x.qty;}));const shortages=Object.entries(required).filter(([id,qty])=>{const i=ingredients.find(x=>x.id===id);return !i||i.stock<qty;});if(shortages.length){alert("Insufficient stock: "+shortages.map(([id,qty])=>{const i=ingredients.find(x=>x.id===id);return(i?.name||id)+" ("+qty+" "+(i?.unit||"")+")";}).join(", "));return}setIngredients(xs=>xs.map(i=>required[i.id]?{...i,stock:i.stock-required[i.id]}:i));setMovements(ms=>[...Object.entries(required).map(([ingredientId,qty])=>({id:"MOV-"+Date.now()+"-"+ingredientId,ingredientId,type:"Sale",qty,cost:(ingredients.find(i=>i.id===ingredientId)?.cost||0)*qty,createdAt:new Date().toISOString()})),...ms]);const id="ORD-"+String(Date.now()).slice(-6),total=cart.reduce((s,x)=>s+x.price*x.qty,0),order={id,channel,table:selectedTable?.name||null,items:cart,total,status:orderStatuses[0],createdAt:new Date().toISOString()};setOrders(o=>[order,...o]);if(selectedTable)setTables(ts=>ts.map(t=>t.id===selectedTable.id?{...t,status:"Order Placed",orderId:id}:t));setCart([]);setSelectedTable(null);setActive("Orders")}
 function updateOrder(id,status){const order=orders.find(o=>o.id===id);setOrders(os=>os.map(o=>o.id===id?{...o,status}:o));if(order?.table&&status===orderStatuses[3])setTables(ts=>ts.map(t=>t.name===order.table?{...t,status:"Dirty/Needs Cleaning",orderId:null}:t));else if(order?.table&&status==="Ready")setTables(ts=>ts.map(t=>t.name===order.table?{...t,status:"Bill Printed",orderId:id}:t))}
 function toggleTable(t){if(t.status==="Vacant"){setSelectedTable(t);setChannel("Dine In");setActive("POS")}else if(t.status==="Dirty/Needs Cleaning")setTables(ts=>ts.map(x=>x.id===t.id?{...x,status:"Vacant",orderId:null}:x))}
 return <div className="app"><Sidebar collapsed={collapsed} setCollapsed={setCollapsed} active={active} setActive={setActive}/><main className="main"><Topbar active={active}/>
 {active==="Dashboard"&&<Dashboard money={money} sales={todaySales} openOrders={openOrders} occupied={occupied} lowStock={lowStock} orders={orders} tables={tables} onPOS={()=>setActive("POS")}/>}
 {active==="POS"&&<POS menu={menu} categories={categories} modifiers={modifiers} cart={cart} addItem={addItem} changeQty={changeQty} removeCart={removeCart} placeOrder={placeOrder} channel={channel} setChannel={setChannel} selectedTable={selectedTable} setSelectedTable={setSelectedTable} tables={tables} money={money}/>}
 {active==="Tables"&&<Tables tables={tables} onTable={toggleTable} tableStatuses={tableStatuses}/>}
 {active==="Orders"&&<Orders orders={orders} update={updateOrder} money={money}/>}
 {active==="Kitchen"&&<Kitchen orders={orders} update={updateOrder} money={money}/>}
 {active==="Delivery"&&<Delivery orders={orders} update={updateOrder} money={money} riders={riders} setRiders={setRiders} riderStatuses={riderStatuses}/>}
 {active==="Menu"&&<MenuManager menu={menu} setMenu={setMenu} categories={categories} money={money}/>}
 {active==="Inventory"&&<Inventory ingredients={ingredients} setIngredients={setIngredients} movements={movements} setMovements={setMovements} money={money}/>}
 {active==="Payments"&&<Payments orders={orders} payments={payments} setPayments={setPayments} setOrders={setOrders} money={money}/>}
 {active==="Complaints"&&<Complaints orders={orders} complaints={complaints} setComplaints={setComplaints} adjustments={adjustments} setAdjustments={setAdjustments} types={complaintTypes} statuses={complaintStatuses} resolutions={resolutions} money={money}/>}
 {active==="Analytics"&&<Analytics orders={orders} menu={menu} recipes={recipes} ingredients={ingredients} movements={movements} adjustments={adjustments}/>}
 {active==="Staff"&&<Staff staff={staff} setStaff={setStaff} roles={staffRoles}/>}
 {active==="Customers"&&<Customers customers={customers} setCustomers={setCustomers} types={customerTypes}/>}
 {![ "Dashboard","POS","Tables","Orders","Kitchen","Delivery","Menu","Inventory","Payments","Complaints","Analytics","Staff","Customers"].includes(active)&&<ModulePreview name={active}/>}
 </main></div>;
}
function ModulePreview({name}){return <section className="content"><div className="module"><div className="module-icon"><Settings size={28}/></div><h2>{name}</h2><p>This module is connected to the shared POS data model. Its dedicated workflow is next in the build.</p></div></section>}
