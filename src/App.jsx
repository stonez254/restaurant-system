import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart3, ChefHat, ClipboardList, LayoutDashboard, Menu as MenuIcon, Settings,
  ShoppingBag, Table2, Truck, Users, Package, MessageSquare, PanelLeftClose,
  PanelLeftOpen, Search, Plus, Minus, Trash2, X, CheckCircle2, Clock3,
  Utensils, Bike, ReceiptText
} from "lucide-react";

const modules = [
  ["Dashboard", LayoutDashboard], ["POS", ShoppingBag], ["Tables", Table2],
  ["Orders", ClipboardList], ["Kitchen", ChefHat], ["Delivery", Truck],
  ["Menu", MenuIcon], ["Inventory", Package], ["Customers", Users],
  ["Complaints", MessageSquare], ["Analytics", BarChart3], ["Staff", Users],
  ["Settings", Settings]
];

const categories = ["Starters","Mains","Sides","Desserts","Drinks"];
const menuItems = [
  ["Chicken Samosa","Starters",250],["Beef Samosa","Starters",280],["Vegetable Spring Rolls","Starters",300],
  ["Chicken Wings","Starters",650],["Garlic Bread","Starters",350],["Beef Skewers","Starters",550],
  ["Fish Fingers","Starters",600],["Soup of the Day","Starters",300],["Chicken Tikka","Starters",700],["Bruschetta","Starters",450],
  ["Grilled Chicken","Mains",950],["Chicken Curry","Mains",850],["Beef Steak","Mains",1250],["Beef Pilau","Mains",750],
  ["Chicken Biryani","Mains",850],["Fish and Chips","Mains",900],["Grilled Tilapia","Mains",1100],["Beef Burger","Mains",800],
  ["Chicken Burger","Mains",750],["Chicken Alfredo","Mains",900],["Spaghetti Bolognese","Mains",850],["Vegetable Pasta","Mains",700],
  ["Chicken Fried Rice","Mains",800],["Beef Fried Rice","Mains",850],["Mixed Grill","Mains",1450],
  ["Plain Rice","Sides",250],["Ugali","Sides",200],["Chips","Sides",300],["Mashed Potatoes","Sides",300],["Sauteed Vegetables","Sides",300],
  ["Coleslaw","Sides",180],["Kachumbari","Sides",180],["Beef Sausage","Sides",250],["Chapati","Sides",100],["Ndengu","Sides",250],
  ["Chocolate Cake","Desserts",450],["Cheesecake","Desserts",500],["Ice Cream","Desserts",350],["Fruit Salad","Desserts",400],["Brownie","Desserts",400],
  ["Pancakes","Desserts",450],["Mango Pudding","Desserts",400],["Banana Split","Desserts",500],["Fresh Fruit Platter","Desserts",550],["Vanilla Cake","Desserts",400],
  ["Soda","Drinks",150],["Fresh Juice","Drinks",300],["Passion Juice","Drinks",300],["Mango Juice","Drinks",300],["Mineral Water","Drinks",100],
  ["Tea","Drinks",180],["Coffee","Drinks",220],["Cappuccino","Drinks",350],["Milkshake","Drinks",450],["Iced Tea","Drinks",280],
  ["Lemonade","Drinks",250],["Ginger Tea","Drinks",220],["Hot Chocolate","Drinks",350],["Energy Drink","Drinks",250],["Sparkling Water","Drinks",250]
].map(([name,category,price],i)=>({id:i+1,name,category,price}));

const initialTables = Array.from({length:12},(_,i)=>({id:i+1,name:"T"+(i+1),seats:i%3===0?6:4,status:"Vacant",orderId:null}));
const channels=["Dine In","Take Away","Delivery"];
const statuses=["Placed","In Prep","Ready","Served/Out for Delivery"];

function money(n){return "KSh "+Number(n||0).toLocaleString("en-KE",{minimumFractionDigits:2,maximumFractionDigits:2});}
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}

export default function App(){
  const [collapsed,setCollapsed]=useState(false);
  const [active,setActive]=useState("Dashboard");
  const [menu,setMenu]=useState(()=>read("restaurant-menu",menuItems));
  const [tables,setTables]=useState(()=>read("restaurant-tables",initialTables));
  const [orders,setOrders]=useState(()=>read("restaurant-orders",[]));
  const [cart,setCart]=useState([]);
  const [channel,setChannel]=useState("Dine In");
  const [selectedTable,setSelectedTable]=useState(null);
  const [search,setSearch]=useState("");
  const [category,setCategory]=useState("All");

  useEffect(()=>localStorage.setItem("restaurant-menu",JSON.stringify(menu)),[menu]);
  useEffect(()=>localStorage.setItem("restaurant-tables",JSON.stringify(tables)),[tables]);
  useEffect(()=>localStorage.setItem("restaurant-orders",JSON.stringify(orders)),[orders]);

  const todaySales=orders.filter(o=>o.status==="Served/Out for Delivery").reduce((s,o)=>s+o.total,0);
  const occupied=tables.filter(t=>t.status!=="Vacant").length;
  const openOrders=orders.filter(o=>!["Served/Out for Delivery"].includes(o.status)).length;

  function addItem(item,modifier="Standard"){
    setCart(c=>{
      const key=item.id+"-"+modifier; const found=c.find(x=>x.key===key);
      if(found)return c.map(x=>x.key===key?{...x,qty:x.qty+1}:x);
      return [...c,{key,id:item.id,name:item.name,price:item.price,qty:1,modifier}];
    });
  }
  function changeQty(key,d){setCart(c=>c.map(x=>x.key===key?{...x,qty:x.qty+d}:x).filter(x=>x.qty>0));}
  function removeCart(key){setCart(c=>c.filter(x=>x.key!==key));}
  function placeOrder(){
    if(!cart.length)return;
    const id="ORD-"+String(Date.now()).slice(-6);
    const subtotal=cart.reduce((s,x)=>s+x.price*x.qty,0);
    const order={id,channel,table:selectedTable?selectedTable.name:null,items:cart,total:subtotal,status:"Placed",createdAt:new Date().toISOString()};
    setOrders(o=>[order,...o]);
    if(selectedTable)setTables(ts=>ts.map(t=>t.id===selectedTable.id?{...t,status:"Order Placed",orderId:id}:t));
    setCart([]);setSelectedTable(null);setActive("Orders");
  }
  function updateOrder(id,status){
    setOrders(os=>os.map(o=>o.id===id?{...o,status}:o));
    const order=orders.find(o=>o.id===id);
    if(order?.table && (status==="Served/Out for Delivery")){
      setTables(ts=>ts.map(t=>t.name===order.table?{...t,status:"Dirty/Needs Cleaning",orderId:null}:t));
    } else if(order?.table && status==="Ready"){
      setTables(ts=>ts.map(t=>t.name===order.table?{...t,status:"Bill Printed",orderId:id}:t));
    }
  }
  function toggleTable(t){
    if(t.status==="Vacant"){setSelectedTable(t);setChannel("Dine In");setActive("POS");}
    else if(t.status==="Dirty/Needs Cleaning")setTables(ts=>ts.map(x=>x.id===t.id?{...x,status:"Vacant"}:x));
  }

  return <div className="app">
    <aside className={collapsed?"sidebar collapsed":"sidebar"}>
      <div className="brand"><div className="brand-mark">R</div>{!collapsed&&<div><strong>Restaurant POS</strong><span>Web Management System</span></div>}</div>
      <nav>{modules.map(([label,Icon])=><button className={active===label?"nav-item active":"nav-item"} onClick={()=>setActive(label)} key={label} title={label}><Icon size={19}/>{!collapsed&&<span>{label}</span>}</button>)}</nav>
      <button className="collapse" onClick={()=>setCollapsed(!collapsed)}>{collapsed?<PanelLeftOpen size={19}/>:<PanelLeftClose size={19}/>} {!collapsed&&<span>Collapse menu</span>}</button>
    </aside>
    <main className="main">
      <header className="topbar"><div><p className="eyebrow">RESTAURANT OPERATIONS</p><h1>{active}</h1></div><div className="status"><span className="dot"/> System ready</div></header>
      {active==="Dashboard"&&<Dashboard sales={todaySales} openOrders={openOrders} occupied={occupied} lowStock={0} orders={orders} tables={tables} onPOS={()=>setActive("POS")}/>}
      {active==="POS"&&<POS cart={cart} addItem={addItem} changeQty={changeQty} removeCart={removeCart} placeOrder={placeOrder} channel={channel} setChannel={setChannel} selectedTable={selectedTable} setSelectedTable={setSelectedTable} tables={tables} search={search} setSearch={setSearch} category={category} setCategory={setCategory} menu={menu}/>}
      {active==="Tables"&&<Tables tables={tables} onTable={toggleTable}/>}
      {active==="Orders"&&<Orders orders={orders} updateOrder={updateOrder}/>}
      {active==="Kitchen"&&<Kitchen orders={orders} updateOrder={updateOrder}/>}
      {active==="Delivery"&&<Delivery orders={orders} updateOrder={updateOrder}/>}
      {active==="Menu"&&<MenuManager menu={menu} setMenu={setMenu}/>}
      {!["Dashboard","POS","Tables","Orders","Kitchen","Delivery","Menu"].includes(active)&&<ModulePreview name={active}/>}
    </main>
  </div>
}

function Dashboard({sales,openOrders,occupied,lowStock,orders,tables,onPOS}){
 return <section className="content"><div className="welcome"><div><h2>Good day</h2><p>Run orders, tables and kitchen activity from one control center.</p></div><button className="primary" onClick={onPOS}>Open POS</button></div>
 <div className="stats">{[["Today's Sales",money(sales),"Completed sales"],["Open Orders",openOrders,"Pending fulfillment"],["Occupied Tables",occupied,"Dining floor"],["Low Stock",lowStock,"Needs attention"]].map(c=><article className="card" key={c[0]}><span>{c[0]}</span><strong>{c[1]}</strong><small>{c[2]}</small></article>)}</div>
 <div className="grid"><article className="panel"><div className="panel-head"><h3>Order activity</h3><span>Live</span></div>{orders.length?<div className="list">{orders.slice(0,6).map(o=><div className="list-row" key={o.id}><div><strong>{o.id}</strong><small>{o.channel}{o.table?" • "+o.table:""}</small></div><span className={"pill "+o.status.toLowerCase().replaceAll(" ","-")}>{o.status}</span><b>{money(o.total)}</b></div>)}</div>:<Empty icon={ClipboardList} title="No orders yet" text="Orders created from the POS will appear here."/>}</article>
 <article className="panel"><div className="panel-head"><h3>Floor status</h3><span>Live</span></div><div className="table-mini">{tables.map(t=><div className={"mini-table "+t.status.toLowerCase().replaceAll(/[^a-z]+/g,"-")} key={t.id}><b>{t.name}</b><small>{t.status}</small></div>)}</div></article></div></section>
}

function POS({menu,cart,addItem,changeQty,removeCart,placeOrder,channel,setChannel,selectedTable,setSelectedTable,tables,search,setSearch,category,setCategory}){
 const filtered=useMemo(()=>menu.filter(x=>(category==="All"||x.category===category)&&x.name.toLowerCase().includes(search.toLowerCase())),[menu,category,search]);
 const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
 return <section className="content pos-layout"><div className="pos-main"><div className="toolbar"><div className="search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search menu..."/></div><div className="chips"><button className={category==="All"?"chip active":"chip"} onClick={()=>setCategory("All")}>All</button>{categories.map(c=><button className={category===c?"chip active":"chip"} onClick={()=>setCategory(c)} key={c}>{c}</button>)}</div></div><div className="menu-grid">{filtered.map(item=><button className="menu-item" onClick={()=>addItem(item)} key={item.id}><span className="menu-category">{item.category}</span><strong>{item.name}</strong><b>{money(item.price)}</b><span className="add"><Plus size={14}/></span></button>)}</div></div>
 <aside className="cart-panel"><div className="cart-head"><div><h3>Current Order</h3><small>{cart.reduce((s,x)=>s+x.qty,0)} items</small></div><ReceiptText size={20}/></div><div className="channel-tabs">{channels.map(c=><button className={channel===c?"active":""} onClick={()=>setChannel(c)} key={c}>{c==="Dine In"?<Utensils size={14}/>:c==="Delivery"?<Bike size={14}/>:<ShoppingBag size={14}/>} {c}</button>)}</div>{channel==="Dine In"&&<select className="select" value={selectedTable?.id||""} onChange={e=>setSelectedTable(tables.find(x=>x.id===Number(e.target.value))||null)}><option value="">Select vacant table</option>{tables.filter(t=>t.status==="Vacant"||(selectedTable&&t.id===selectedTable.id)).map(t=><option value={t.id} key={t.id}>{t.name} • {t.seats} seats</option>)}</select>}<div className="cart-items">{cart.length?cart.map(x=><div className="cart-row" key={x.key}><div><strong>{x.name}</strong><small>{x.modifier}</small></div><b>{money(x.price*x.qty)}</b><div className="qty"><button onClick={()=>changeQty(x.key,-1)}><Minus size={12}/></button><span>{x.qty}</span><button onClick={()=>changeQty(x.key,1)}><Plus size={12}/></button></div><button className="icon-btn danger" onClick={()=>removeCart(x.key)}><Trash2 size={14}/></button></div>):<Empty icon={ShoppingBag} title="Cart is empty" text="Tap a menu item to add it."/>}</div><div className="cart-total"><span>Total</span><strong>{money(total)}</strong></div><button className="checkout" disabled={!cart.length||channel==="Dine In"&&!selectedTable} onClick={placeOrder}>Place Order</button></aside></section>
}

function Tables({tables,onTable}){return <section className="content"><div className="section-head"><div><h2>Dining Floor</h2><p>Tap a vacant table to open an order. Tap dirty tables to mark them clean.</p></div><div className="legend">{["Vacant","Seated","Order Placed","Bill Printed","Dirty/Needs Cleaning"].map(s=><span key={s}><i className={s.toLowerCase().replaceAll(/[^a-z]+/g,"-")}/>{s}</span>)}</div></div><div className="floor-grid">{tables.map(t=><button className={"floor-table "+t.status.toLowerCase().replaceAll(/[^a-z]+/g,"-")} onClick={()=>onTable(t)} key={t.id}><Table2 size={25}/><strong>{t.name}</strong><span>{t.seats} seats</span><small>{t.status}</small></button>)}</div></section>}

function Orders({orders,updateOrder}){return <section className="content"><div className="section-head"><div><h2>Order Queue</h2><p>Central view for dine-in, takeaway and delivery.</p></div><span className="count">{orders.length} total</span></div><div className="order-list">{orders.length?orders.map(o=><OrderCard key={o.id} order={o} update={updateOrder}/>):<Empty icon={ClipboardList} title="No orders" text="New POS orders will appear here."/>}</div></section>}
function OrderCard({order,update}){return <article className="order-card"><div className="order-title"><div><strong>{order.id}</strong><span>{order.channel}{order.table?" • "+order.table:""} • {new Date(order.createdAt).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</span></div><span className={"pill "+order.status.toLowerCase().replaceAll(" ","-")}>{order.status}</span></div><div className="order-items">{order.items.map(x=><div key={x.key}><span>{x.qty} × {x.name}</span><small>{x.modifier}</small></div>)}</div><div className="order-foot"><b>{money(order.total)}</b><div>{order.status==="Placed"&&<button onClick={()=>update(order.id,"In Prep")}>Start Prep</button>}{order.status==="In Prep"&&<button onClick={()=>update(order.id,"Ready")}>Mark Ready</button>}{order.status==="Ready"&&<button onClick={()=>update(order.id,"Served/Out for Delivery")}>Complete</button>}</div></div></article>}

function Kitchen({orders,updateOrder}){const active=orders.filter(o=>o.status!=="Served/Out for Delivery");return <section className="content"><div className="section-head"><div><h2>Kitchen Display</h2><p>Digital tickets sorted by workflow.</p></div></div><div className="kds-grid">{active.length?active.map(o=><article className={"ticket "+(Date.now()-new Date(o.createdAt).getTime()>20*60000?"late":"")} key={o.id}><div className="ticket-head"><b>{o.id}</b><span>{o.channel}{o.table?" • "+o.table:""}</span></div><div>{o.items.map(x=><p key={x.key}><b>{x.qty}×</b> {x.name}<small>{x.modifier}</small></p>)}</div><div className="ticket-foot"><span><Clock3 size={14}/> {Math.max(0,Math.floor((Date.now()-new Date(o.createdAt).getTime())/60000))} min</span>{o.status==="Placed"&&<button onClick={()=>updateOrder(o.id,"In Prep")}>Start</button>}{o.status==="In Prep"&&<button onClick={()=>updateOrder(o.id,"Ready")}>Ready</button>}{o.status==="Ready"&&<button onClick={()=>updateOrder(o.id,"Served/Out for Delivery")}>Done</button>}</div></article>):<Empty icon={ChefHat} title="Kitchen is clear" text="Placed orders will appear as digital tickets."/>}</div></section>}

function Delivery({orders,updateOrder}){const list=orders.filter(o=>o.channel==="Delivery");return <section className="content"><div className="section-head"><div><h2>Delivery Dispatch</h2><p>Track delivery orders from preparation to completion.</p></div></div><div className="order-list">{list.length?list.map(o=><OrderCard key={o.id} order={o} update={updateOrder}/>):<Empty icon={Truck} title="No delivery orders" text="Delivery orders placed through the POS will appear here."/>}</div></section>}

function MenuManager({menu,setMenu}){const [q,setQ]=useState("");const filtered=menu.filter(x=>x.name.toLowerCase().includes(q.toLowerCase()));function add(){const name=prompt("Menu item name");if(!name)return;const price=Number(prompt("Price (KSh)"));if(!price)return;setMenu(m=>[...m,{id:Date.now(),name,price,category:"Mains"}])}return <section className="content"><div className="section-head"><div><h2>Menu</h2><p>{menu.length} items across {categories.length} categories.</p></div><button className="primary dark" onClick={add}><Plus size={16}/> Add Item</button></div><div className="toolbar"><div className="search"><Search size={17}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search menu..."/></div></div><div className="admin-grid">{filtered.map(x=><article className="admin-item" key={x.id}><div><span>{x.category}</span><strong>{x.name}</strong></div><b>{money(x.price)}</b></article>)}</div></section>}

function ModulePreview({name}){return <section className="content"><div className="module"><div className="module-icon"><Settings size={28}/></div><h2>{name}</h2><p>This module is connected to the shared POS data model. Its dedicated workflows are next in the build.</p></div></section>}
function Empty({icon:Icon,title,text}){return <div className="empty"><Icon size={30}/><strong>{title}</strong><p>{text}</p></div>}
