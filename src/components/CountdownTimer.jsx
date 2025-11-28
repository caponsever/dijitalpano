import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Timer } from 'lucide-react';

const CountdownTimer = () => {
    const { bellSchedule } = useStore();
    const [status, setStatus] = useState({ message: '', time: '' });

    useEffect(() => {
        const calculateTime = () => {
            if (!bellSchedule || bellSchedule.length === 0) {
                setStatus({ message: 'Ders Programı Girilmedi', time: '--:--' });
                return;
            }

            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            const currentSeconds = now.getSeconds();

            // Sort schedule just in case
            const sortedSchedule = [...bellSchedule].sort((a, b) => {
                const [ah, am] = a.startTime.split(':').map(Number);
                const [bh, bm] = b.startTime.split(':').map(Number);
                return (ah * 60 + am) - (bh * 60 + bm);
            });

            let found = false;

            for (let i = 0; i < sortedSchedule.length; i++) {
                const lesson = sortedSchedule[i];
                const [sh, sm] = lesson.startTime.split(':').map(Number);
                const [eh, em] = lesson.endTime.split(':').map(Number);

                const startMins = sh * 60 + sm;
                const endMins = eh * 60 + em;

                // Check if inside a lesson
                if (currentMinutes >= startMins && currentMinutes < endMins) {
                    const diffMins = endMins - currentMinutes - 1;
                    const diffSecs = 60 - currentSeconds;

                    setStatus({
                        message: `${lesson.name} Bitişine`,
                        time: `${diffMins.toString().padStart(2, '0')}:${diffSecs.toString().padStart(2, '0')}`
                    });
                    found = true;
                    break;
                }

                // Check if in break before this lesson
                if (currentMinutes < startMins) {
                    const diffMins = startMins - currentMinutes - 1;
                    const diffSecs = 60 - currentSeconds;

                    setStatus({
                        message: `${lesson.name} Başlamasına`,
                        time: `${diffMins.toString().padStart(2, '0')}:${diffSecs.toString().padStart(2, '0')}`
                    });
                    found = true;
                    break;
                }
            }

            if (!found) {
                // After last lesson
                setStatus({ message: 'Okul Bitti', time: '--:--' });
            }
        };

        calculateTime();
        const interval = setInterval(calculateTime, 1000);
        return () => clearInterval(interval);
    }, [bellSchedule]);

    return (
        <div className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-4 border border-blue-400/30 backdrop-blur-sm">
            <div className="p-2 bg-white/20 rounded-full">
                <Timer size={24} className="animate-pulse" />
            </div>
            <div>
                <div className="text-xs font-medium text-blue-100 uppercase tracking-wider">{status.message}</div>
                <div className="text-3xl font-bold font-mono leading-none">{status.time}</div>
            </div>
        </div>
    );
};

export default CountdownTimer;
