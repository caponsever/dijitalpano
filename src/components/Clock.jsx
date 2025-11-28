import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const Clock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="text-right text-white">
            <div className="text-5xl font-bold tracking-tight font-mono">
                {format(time, 'HH:mm')}
            </div>
            <div className="text-lg opacity-90 font-medium">
                {format(time, 'd MMMM yyyy, EEEE', { locale: tr })}
            </div>
        </div>
    );
};

export default Clock;
