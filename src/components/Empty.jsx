import React from "react";
export default function Empty({icon:Icon,title,text}){return <div className="empty"><Icon size={30}/><strong>{title}</strong><p>{text}</p></div>}