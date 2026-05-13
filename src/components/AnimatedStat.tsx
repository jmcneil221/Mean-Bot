'use client';
import { useEffect, useState } from 'react';

export default function AnimatedStat({ target, prefix = '' }: { target: number; prefix?: string }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const step = Math.ceil(target / 100);
    const id = setInterval(() => {
      setCount(c => {
        if (c + step >= target) { 
          clearInterval(id); 
          return target; 
        }
        return c + step;
      });
    }, 12);
    return () => clearInterval(id);
  }, [target]);
  
  return <span>{prefix}{count}</span>;
}
