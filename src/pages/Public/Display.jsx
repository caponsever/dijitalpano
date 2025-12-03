import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../store/useStore';
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

// Re-implemented SlideView using EXACT styles from Carousel.jsx
const SlideView = ({ slide }) => {
    return (
        <div className="relative w-full h-full overflow-hidden bg-black">
            {slide.type === 'image' ? (
                <img
                    src={slide.content}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-slate-900 p-20">
                    <div className="text-center space-y-8 max-w-5xl">
                        <h2 className="text-6xl font-bold text-white leading-tight drop-shadow-lg">
                            {slide.content}
                        </h2>
                        {slide.title && (
                            <p className="text-3xl text-blue-200 font-light tracking-wide">
                                {slide.title}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Slide Title Overlay for Images - EXACTLY as in Carousel.jsx */}
            {slide.type === 'image' && slide.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-12 pt-32 pb-20 z-30">
                    <h3 className="text-4xl font-bold text-white drop-shadow-md">{slide.title}</h3>
                </div>
            )}

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-blue-500 z-20"
                style={{
                    width: '100%',
                    animation: `progress ${slide.duration || 10}s linear`
                }}
            />
            <style>{`
                @keyframes progress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
            `}</style>
        </div>
    );
};

const SpecificDaysBanner = ({ text }) => {
    if (!text) return null;
    return (
        <div className="absolute bottom-14 left-0 right-0 bg-red-600 text-white px-6 py-3 text-center font-bold text-xl shadow-md z-50">
            {text}
        </div>
    );
};

const PublicDisplay = () => {
    const { settings, slides, bellSchedule, dutyTeachers, foodMenu, birthdays, specificDays, connectionStatus } = useStore();

    // Calculate active specific day
    const today = new Date().toISOString().split('T')[0];
    const activeSpecificDay = specificDays?.find(day =>
        today >= day.startDate && today <= day.endDate
    );

    // Build Playlist
    const playlist = useMemo(() => {
        const list = [];

        // 1. Add all slides (User created content)
        if (slides && slides.length > 0) {
            list.push(...slides.map(s => ({ ...s, module: 'slide' })));
        }

        // 2. Add fixed modules
        list.push({ id: 'schedule', module: 'schedule', duration: 15 });
        list.push({ id: 'duty', module: 'duty', duration: 15 });
        list.push({ id: 'food', module: 'food', duration: 15 });

        // 3. Add Birthday if applicable
        const hasBirthdays = birthdays.some(b => b.date === today);
        if (hasBirthdays) {
            list.push({ id: 'birthday', module: 'birthday', duration: 15 });
        }

        return list;
    }, [slides, birthdays, today]);

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (playlist.length === 0) return;

        // Ensure index is valid if playlist shrinks
        if (currentIndex >= playlist.length) {
            setCurrentIndex(0);
            return;
        }

        const currentItem = playlist[currentIndex];
        const duration = (currentItem.duration || 10) * 1000;

        const timer = setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % playlist.length);
        }, duration);

        return () => clearTimeout(timer);
    }, [currentIndex, playlist]);

    const currentItem = playlist[currentIndex] || {};

    return (
    return (
        <div className="h-[100dvh] flex flex-col bg-gray-900 overflow-hidden font-sans">
            {/* Header */}
            <header className="h-24 bg-gradient-to-r from-blue-900 to-slate-900 flex items-center justify-between px-8 shadow-lg z-50 relative shrink-0">
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
                        <p className="text-blue-200 text-sm font-medium tracking-wider uppercase">Dijital Bilgi Ekranı v1.1</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className={`w-3 h-3 rounded-full ${connectionStatus === 'online' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'} transition-colors duration-500`} title={connectionStatus === 'online' ? 'Online' : 'Offline'} />
                    <CountdownTimer />
                    <Clock />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 relative flex bg-gray-100 z-0 overflow-hidden">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentItem.id || currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 w-full h-full"
                    >
                        {currentItem.module === 'slide' && <SlideView slide={currentItem} />}
                        {currentItem.module === 'schedule' && <ScheduleSlide schedule={bellSchedule} />}
                        {currentItem.module === 'duty' && <DutySlide teachers={dutyTeachers} />}
                        {currentItem.module === 'food' && <FoodSlide menu={foodMenu} />}
                        {currentItem.module === 'birthday' && <BirthdaySlide birthdays={birthdays} />}
                    </motion.div>
                </AnimatePresence>

                {/* Weather Overlay */}
                <div className="absolute bottom-8 right-8 z-50 w-80">
                    <WeatherWidget city={settings.city} />
                </div>
            </main>

            {/* Specific Days Banner (Overlay) */}
            <SpecificDaysBanner text={activeSpecificDay?.name} />

            {/* Footer / Ticker */}
            <footer className="h-14 bg-blue-950 z-50 relative shadow-[0_-4px_20px_rgba(0,0,0,0.3)] shrink-0">
                <NewsTicker text={settings.tickerText} />
            </footer>
        </div>
    );
};

export default PublicDisplay;
