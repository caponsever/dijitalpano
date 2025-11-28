import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import Carousel from '../../components/Carousel';
import WeatherWidget from '../../components/WeatherWidget';
import NewsTicker from '../../components/NewsTicker';
import Clock from '../../components/Clock';
import CountdownTimer from '../../components/CountdownTimer';
import { motion, AnimatePresence } from 'framer-motion';

// Sub-components for new slides
const ScheduleSlide = ({ schedule }) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const isCurrent = (start, end) => {
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);
        const startMins = sh * 60 + sm;
        const endMins = eh * 60 + em;
        return currentTime >= startMins && currentTime <= endMins;
    };

    return (
        <div className="w-full h-full bg-white p-12 flex flex-col">
            <h2 className="text-4xl font-bold text-blue-900 mb-8 border-b-4 border-blue-500 pb-4">Ders Programı</h2>
            <div className="flex-1 overflow-hidden">
                <table className="w-full text-2xl">
                    <thead className="bg-gray-100 text-gray-600">
                        <tr>
                            <th className="p-4 text-left">Ders</th>
                            <th className="p-4 text-left">Giriş</th>
                            <th className="p-4 text-left">Çıkış</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map((s) => (
                            <tr
                                key={s.id}
                                className={`border-b ${isCurrent(s.startTime, s.endTime) ? 'bg-green-100 text-green-800 font-bold' : 'text-gray-700'}`}
                            >
                                <td className="p-4">{s.name}</td>
                                <td className="p-4">{s.startTime}</td>
                                <td className="p-4">{s.endTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const DutySlide = ({ teachers }) => (
    <div className="w-full h-full bg-white p-12 flex flex-col">
        <h2 className="text-4xl font-bold text-blue-900 mb-8 border-b-4 border-blue-500 pb-4">Nöbetçi Öğretmenler</h2>
        <div className="grid grid-cols-2 gap-8">
            {teachers.map((t) => (
                <div key={t.id} className="bg-blue-50 p-6 rounded-xl border-l-8 border-blue-500 shadow-sm">
                    <div className="text-3xl font-bold text-gray-800">{t.name}</div>
                    <div className="text-xl text-blue-600 mt-2 font-medium">{t.location}</div>
                </div>
            ))}
        </div>
    </div>
);

const FoodSlide = ({ menu }) => {
    const today = new Date().toISOString().split('T')[0];
    const todaysMenu = menu.find(m => m.date === today);

    return (
        <div className="w-full h-full bg-white p-12 flex flex-col">
            <h2 className="text-4xl font-bold text-blue-900 mb-8 border-b-4 border-blue-500 pb-4">Günün Menüsü</h2>
            {todaysMenu ? (
                <div className="flex flex-col gap-6 items-center justify-center h-full">
                    {todaysMenu.items.map((item, idx) => (
                        <div key={idx} className="text-5xl font-medium text-gray-700 bg-orange-50 w-full text-center py-6 rounded-xl shadow-sm border border-orange-100">
                            {item}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-3xl text-gray-400">
                    Bugün için yemek listesi girilmemiş.
                </div>
            )}
        </div>
    );
};

const BirthdaySlide = ({ birthdays }) => {
    const today = new Date().toISOString().split('T')[0];
    // Simple check for day/month match would be better for real app, but strict date match for demo
    const todaysBirthdays = birthdays.filter(b => b.date === today);

    if (todaysBirthdays.length === 0) return null;

    return (
        <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 p-12 flex flex-col items-center justify-center text-white">
            <h2 className="text-6xl font-bold mb-12 drop-shadow-md">İyi ki Doğdun! 🎂</h2>
            <div className="space-y-8 text-center">
                {todaysBirthdays.map((b) => (
                    <div key={b.id} className="text-7xl font-bold drop-shadow-lg">
                        {b.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

const SpecificDaysBanner = ({ text }) => {
    if (!text) return null;
    return (
        <div className="bg-red-600 text-white px-6 py-3 text-center font-bold text-xl shadow-md z-20 relative">
            {text}
        </div>
    );
};

const PublicDisplay = () => {
    const { settings, slides, bellSchedule, dutyTeachers, foodMenu, birthdays, specificDays } = useStore();

    // Calculate active specific day
    const today = new Date().toISOString().split('T')[0];
    const activeSpecificDay = specificDays?.find(day =>
        today >= day.startDate && today <= day.endDate
    );

    // State to manage which "Main View" is active
    // 0: Carousel (Slides)
    // 1: Schedule
    // 2: Duty Teachers
    // 3: Food Menu
    // 4: Birthdays (if any)
    const [viewIndex, setViewIndex] = useState(0);

    useEffect(() => {
        // Cycle through views every 15 seconds
        const interval = setInterval(() => {
            setViewIndex(prev => {
                const next = prev + 1;
                // Skip Birthday view (index 4) if no birthdays today
                const today = new Date().toISOString().split('T')[0];
                const hasBirthdays = birthdays.some(b => b.date === today);

                if (next === 4 && !hasBirthdays) return 0;
                if (next > 4) return 0;
                return next;
            });
        }, 15000);

        return () => clearInterval(interval);
    }, [birthdays]);

    return (
        <div className="h-screen flex flex-col bg-gray-900 overflow-hidden font-sans">
            {/* Header */}
            <header className="h-24 bg-gradient-to-r from-blue-900 to-slate-900 flex items-center justify-between px-8 shadow-lg z-10 relative">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white rounded-full p-1 shadow-md">
                        <img
                            src={settings.logoUrl}
                            alt="Logo"
                            className="w-full h-full object-contain rounded-full"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Logo'; }}
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-wide leading-tight">
                            {settings.schoolName}
                        </h1>
                        <p className="text-blue-200 text-sm font-medium tracking-wider uppercase">Dijital Bilgi Ekranı</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <CountdownTimer />
                    <Clock />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative flex bg-gray-100">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={viewIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full"
                    >
                        {viewIndex === 0 && <Carousel slides={slides} />}
                        {viewIndex === 1 && <ScheduleSlide schedule={bellSchedule} />}
                        {viewIndex === 2 && <DutySlide teachers={dutyTeachers} />}
                        {viewIndex === 3 && <FoodSlide menu={foodMenu} />}
                        {viewIndex === 4 && <BirthdaySlide birthdays={birthdays} />}
                    </motion.div>
                </AnimatePresence>

                {/* Weather Overlay */}
                <div className="absolute bottom-8 right-8 z-20 w-80">
                    <WeatherWidget city={settings.city} />
                </div>
            </main>

            {/* Specific Days Banner */}
            <SpecificDaysBanner text={activeSpecificDay?.name} />

            {/* Footer / Ticker */}
            <footer className="h-14 bg-blue-950 z-20 relative shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
                <NewsTicker text={settings.tickerText} />
            </footer>
        </div>
    );
};

export default PublicDisplay;
