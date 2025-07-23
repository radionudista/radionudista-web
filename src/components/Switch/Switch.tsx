import React from 'react';
import './switch.css';

export default function Switch({ value , setValue}) {

  const changeLang = (val) => {
    setValue(val == 'es' ? 'pt' : 'es')
  }

  return (
    <div className="switch-wrapper">
      <div className={`selector ${value === 'es' ? 'left' : 'right'}`} />
      <button
        className={`option ${value === 'es' ? 'active' : ''}`}
        onClick={()=>changeLang(value)}
      >
        es
      </button>
      <button
        className={`option ${value === 'pt' ? 'active' : ''}`}
        onClick={()=>changeLang(value)}
      >
        pt
      </button>
    </div>
  );
}
