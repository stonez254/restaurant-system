export const rolePermissions={
 Manager:["Dashboard","POS","Tables","Orders","Kitchen","Delivery","Menu","Inventory","Customers","Payments","Complaints","Analytics","Staff","Staff Performance","Operations","Settings"],
 Cashier:["Dashboard","POS","Tables","Orders","Customers","Payments","Complaints"],
 Server:["Dashboard","POS","Tables","Orders","Customers"],
 Kitchen:["Dashboard","Orders","Kitchen"],
 Rider:["Dashboard","Delivery"]
};
export const canAccess=(role,module)=>role==="Manager"||(rolePermissions[role]||[]).includes(module);