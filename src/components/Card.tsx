import React from 'react';
import './Card.css';

interface CardProps {
  title: string;
  status: string;
  icon: JSX.Element;
  color: string;
}

export default function Card({ title, status, icon, color }: CardProps) {
  return (
    <div className="bg-glassmorphism p-8 flex items-center justify-between">
      <div>
        <h2 className={`text-${color}-500`}>{title}</h2>
        <p>{status}</p>
      </div>
      {icon}
    </div>
  );
}
