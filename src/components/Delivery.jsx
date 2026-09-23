import React from "react";
import { Truck } from "lucide-react";
import Empty from "./Empty";
import { OrderCard } from "./Orders";
export default function Delivery({orders,update,money}){const list=orders.filter(o=>o.channel==="Delivery");return <section className="content"><div className="section-head"><div><h2>Delivery Dispatch</h2><p>Track delivery orders from preparation to completion.</p></div></div><div className="order-list">{list.length?list.map(o=><OrderCard key={o.id} order={o} update={update} money={money}/>):<Empty icon={Truck} title="No delivery orders" text="Delivery orders placed through the POS will appear here."/>}</div></section>}