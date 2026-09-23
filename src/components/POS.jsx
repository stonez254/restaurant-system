import React, {useMemo, useState} from "react";
import {Search,Plus,Minus,Trash2,ReceiptText,Utensils,Bike,ShoppingBag} from "lucide-react";
import Empty from "./Empty";

export default function POS({menu,categories,modifiers,cart,addItem,changeQty,removeCart,placeOrder,channel,setChannel,selectedTable,setSelectedTable,tables,money}){
 const [search,setSearch]=useState(""); const [category,setCategory]=useState("All"); const [modifier,setModifier]=useState("standard");
 const filtered=useMemo(()=>menu.filter(x=>x.active!==false&&(category==="All"||x.category===category)&&x.name.toLowerCase().includes(search.toLowerCase())),[menu,category,search]);
 const selectedModifier=modifiers.find(x=>x.id===modifier)||modifiers[0]; const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
 return <section className="content pos-layout"><div className="pos-main">
  <div className="toolbar"><div className="search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search menu..."/></div><div className="chips"><button className={category==="All"?"chip active":"chip"} onClick={()=>setCategory("All")}>All</button>{categories.map(c=><button className={category===c?"chip active":"chip"} onClick={()=>setCategory(c)} key={c}>{c}</button>)}</div></div>
  <div className="modifier-bar"><span>Modifier</span>{modifiers.map(m=><button key={m.id} className={modifier===m.id?"modifier active":"modifier"} onClick={()=>setModifier(m.id)}>{m.name}{m.price?" +"+money(m.price):""}</button>)}</div>
  <div className="menu-grid">{filtered.map(item=><button className="menu-item" onClick={()=>addItem(item,selectedModifier)} key={item.id}><span className="menu-category">{item.category}</span><strong>{item.name}</strong><b>{money(item.price+selectedModifier.price)}</b><span className="add"><Plus size={14}/></span></button>)}</div>
 </div>
 <aside className="cart-panel"><div className="cart-head"><div><h3>Current Order</h3><small>{cart.reduce((s,x)=>s+x.qty,0)} items</small></div><ReceiptText size={20}/></div>
  <div className="channel-tabs">{["Dine In","Take Away","Delivery"].map(c=><button className={channel===c?"active":""} onClick={()=>setChannel(c)} key={c}>{c==="Dine In"?<Utensils size={14}/>:c==="Delivery"?<Bike size={14}/>:<ShoppingBag size={14}/>} {c}</button>)}</div>
  {channel==="Dine In"&&<select className="select" value={selectedTable?.id||""} onChange={e=>setSelectedTable(tables.find(x=>x.id===Number(e.target.value))||null)}><option value="">Select vacant table</option>{tables.filter(t=>t.status==="Vacant"||(selectedTable&&t.id===selectedTable.id)).map(t=><option value={t.id} key={t.id}>{t.name} • {t.seats} seats</option>)}</select>}
  <div className="cart-items">{cart.length?cart.map(x=><div className="cart-row" key={x.key}><div><strong>{x.name}</strong><small>{x.modifier?.name||x.modifier||"Standard"}</small></div><b>{money(x.price*x.qty)}</b><div className="qty"><button onClick={()=>changeQty(x.key,-1)}><Minus size={12}/></button><span>{x.qty}</span><button onClick={()=>changeQty(x.key,1)}><Plus size={12}/></button></div><button className="icon-btn danger" onClick={()=>removeCart(x.key)}><Trash2 size={14}/></button></div>):<Empty icon={ShoppingBag} title="Cart is empty" text="Tap a menu item to add it."/>}</div>
  <div className="cart-total"><span>Total</span><strong>{money(total)}</strong></div><button className="checkout" disabled={!cart.length||channel==="Dine In"&&!selectedTable} onClick={placeOrder}>Place Order</button>
 </aside></section>
}