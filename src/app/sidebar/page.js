'use client';

import { useState, useEffect } from 'react';
import {X} from 'lucide-react';

export default function Sidebar({showSidebar, setShowSidebar}) {
  
  return (<div className="sidebar-container">
    <div className="sidebar-title"><h2>Options</h2>
    <X className="btn-close-sidebar" onClick={() => setShowSidebar(false) }/></div>
  <div className="sb-option-div-container">
    <div className="sb-option-div"><p>Manage All Sets</p></div>
    <div className="sb-option-div"><p>See Archive</p></div>
    <div className="sb-option-div"><p>Log Out</p></div>
  </div>
  </div>
  );
}
