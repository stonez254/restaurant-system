import React, { useState } from "react";
import { BarChart3, ChefHat, ClipboardList, LayoutDashboard, Menu, Settings, ShoppingBag, Table2, Truck, Users, Package, MessageSquare, PanelLeftClose, PanelLeftOpen } from "lucide-react";

const modules = [
  ["Dashboard", LayoutDashboard],
  ["POS", ShoppingBag],
  ["Tables", Table2],
  ["Orders", ClipboardList],
  ["Kitchen", ChefHat],
  ["Delivery", Truck],
  ["Menu", Menu],
  ["Inventory", Package],
  ["Customers", Users],
  ["Complaints", MessageSquare],
  ["Analytics", BarChart3],
  ["Staff", Users],
  ["Settings", Settings],
];

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("Dashboard");

  return (
    <div className="app">
      <aside className={collapsed ? "sidebar collapsed" : "sidebar"}>
        <div className="brand">
          <div className="brand-mark">R</div>
          {!collapsed && <div><strong>Restaurant POS</strong><span>Web Management System</span></div>}
        </div>
        <nav>
          {modules.map(([label, Icon]) => (
            <button className={active === label ? "nav-item active" : "nav-item"} onClick={() => setActive(label)} key={label} title={label}>
              <Icon size={19}/>{!collapsed && <span>{label}</span>}
            </button>
          ))}
        </nav>
        <button className="collapse" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <PanelLeftOpen size={19}/> : <PanelLeftClose size={19}/>}
          {!collapsed && <span>Collapse menu</span>}
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <div><p className="eyebrow">RESTAURANT OPERATIONS</p><h1>{active}</h1></div>
          <div className="status"><span className="dot"></span> System ready</div>
        </header>

        {active === "Dashboard" ? <Dashboard /> : <ModulePreview name={active} />}
      </main>
    </div>
  );
}

function Dashboard() {
  const cards = [
    ["Today's Sales", "KSh 0.00", "Revenue"],
    ["Open Orders", "0", "Pending fulfillment"],
    ["Occupied Tables", "0", "Dining floor"],
    ["Low Stock", "0", "Needs attention"],
  ];
  return <section className="content">
    <div className="welcome"><div><h2>Good day</h2><p>Your restaurant control center is ready. Start by configuring your menu and tables.</p></div><button className="primary">Open POS</button></div>
    <div className="stats">{cards.map(c => <article className="card" key={c[0]}><span>{c[0]}</span><strong>{c[1]}</strong><small>{c[2]}</small></article>)}</div>
    <div className="grid">
      <article className="panel"><div className="panel-head"><h3>Order activity</h3><span>Today</span></div><div className="empty"><ClipboardList size={30}/><strong>No orders yet</strong><p>Orders created from the POS will appear here.</p></div></article>
      <article className="panel"><div className="panel-head"><h3>Floor status</h3><span>Live</span></div><div className="empty"><Table2 size={30}/><strong>No tables configured</strong><p>Add your dining tables to begin table management.</p></div></article>
    </div>
  </section>;
}

function ModulePreview({ name }) {
  return <section className="content"><div className="module"><div className="module-icon"><ShoppingBag size={28}/></div><h2>{name}</h2><p>This module is part of the Restaurant POS ecosystem and will be built on the shared data model.</p><button className="primary">Configure {name}</button></div></section>;
}