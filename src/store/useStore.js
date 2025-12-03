import { create } from 'zustand';
import { db } from '../firebase';
import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';

const COLLECTION = 'appData';

export const useStore = create((set, get) => ({
    // Initial State (Defaults)
    settings: {
        schoolName: 'Teknopark Ankara İvedik OSB Mesleki ve Teknik Anadolu Lisesi',
        city: 'Ankara',
        logoUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzU1NSI+TG9nbzwvdGV4dD48L3N2Zz4=',
        tickerText: '1 - 7 Kasım Türk Harf Devrimi Haftası | 10 Kasım Atatürk\'ün Ölüm Yıldönümü | 24 Kasım Öğretmenler Günü',
    },
    slides: [
        {
            id: '1',
            type: 'image',
            content: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1920',
            duration: 10,
            title: 'Welcome to Our School'
        },
        {
            id: '2',
            type: 'text',
            content: 'Öğretmenler Günü Kutlu Olsun!',
            duration: 10,
            title: 'Announcement'
        }
    ],
    bellSchedule: [
        { id: '1', name: '1. Ders', startTime: '08:30', endTime: '09:10' },
        { id: '2', name: '2. Ders', startTime: '09:25', endTime: '10:05' },
        { id: '3', name: '3. Ders', startTime: '10:15', endTime: '10:55' },
    ],
    dutyTeachers: [
        { id: '1', name: 'Ahmet Yılmaz', location: 'Bahçe', date: new Date().toISOString().split('T')[0] },
        { id: '2', name: 'Ayşe Demir', location: '1. Kat', date: new Date().toISOString().split('T')[0] },
    ],
    foodMenu: [
        { id: '1', date: new Date().toISOString().split('T')[0], items: ['Mercimek Çorbası', 'Tavuk Sote', 'Pilav', 'Ayran'] }
    ],
    birthdays: [
        { id: '1', name: 'Ali Veli', date: new Date().toISOString().split('T')[0] }
    ],
    specificDays: [
        { id: '1', name: 'Öğretmenler Günü', startDate: '2025-11-24', endDate: '2025-11-24' },
        { id: '2', name: 'Bilişim Haftası (Demo)', startDate: '2025-11-25', endDate: '2025-11-30' }
    ],
    connectionStatus: 'connecting', // 'connecting', 'online', 'offline'

    // Initialization (Listeners)
    initialize: () => {
        console.log('Store initializing...');

        // Firebase Listener
        const unsubSettings = onSnapshot(doc(db, COLLECTION, 'settings'), (doc) => {
            const source = doc.metadata.fromCache ? 'offline' : 'online';
            console.log(`Settings update. Source: ${source.toUpperCase()}`);
            set({ connectionStatus: source });

            if (doc.exists()) set({ settings: doc.data() });
        }, (error) => {
            console.error('Settings listener error:', error);
            set({ connectionStatus: 'offline' });
        });

        const unsubSlides = onSnapshot(doc(db, COLLECTION, 'slides'), (doc) => {
            console.log('Slides update received. Source:', doc.metadata.fromCache ? 'CACHE' : 'SERVER');
            if (doc.exists()) set({ slides: doc.data().list || [] });
            else set({ slides: [] });
        }, (error) => console.error('Slides listener error:', error));

        const unsubBell = onSnapshot(doc(db, COLLECTION, 'bellSchedule'), (doc) => {
            if (doc.exists()) set({ bellSchedule: doc.data().list || [] });
        });
        const unsubDuty = onSnapshot(doc(db, COLLECTION, 'dutyTeachers'), (doc) => {
            if (doc.exists()) set({ dutyTeachers: doc.data().list || [] });
        });
        const unsubFood = onSnapshot(doc(db, COLLECTION, 'foodMenu'), (doc) => {
            if (doc.exists()) set({ foodMenu: doc.data().list || [] });
        });
        const unsubBirthdays = onSnapshot(doc(db, COLLECTION, 'birthdays'), (doc) => {
            if (doc.exists()) set({ birthdays: doc.data().list || [] });
        });
        const unsubSpecificDays = onSnapshot(doc(db, COLLECTION, 'specificDays'), (doc) => {
            if (doc.exists()) set({ specificDays: doc.data().list || [] });
        });

        // Return cleanup function
        return () => {
            console.log('Store cleanup...');
            unsubSettings();
            unsubSlides();
            unsubBell();
            unsubDuty();
            unsubFood();
            unsubBirthdays();
            unsubSpecificDays();
        };
    },

    // Actions (Write to Firestore)
    updateSettings: async (newSettings) => {
        try {
            console.log('Updating settings...', newSettings);
            const updated = { ...get().settings, ...newSettings };
            // Optimistic update
            set({ settings: updated });
            await setDoc(doc(db, COLLECTION, 'settings'), updated);
            console.log('Settings updated in Firestore');
        } catch (error) {
            console.error('Error updating settings:', error);
            throw error;
        }
    },

    addSlide: async (slide) => {
        try {
            const newSlides = [...get().slides, slide];
            set({ slides: newSlides });
            await setDoc(doc(db, COLLECTION, 'slides'), { list: newSlides });
        } catch (error) {
            console.error('Error adding slide:', error);
        }
    },
    removeSlide: async (id) => {
        try {
            const newSlides = get().slides.filter((s) => s.id !== id);
            set({ slides: newSlides });
            await setDoc(doc(db, COLLECTION, 'slides'), { list: newSlides });
        } catch (error) {
            console.error('Error removing slide:', error);
        }
    },
    updateSlide: async (id, updatedSlide) => {
        try {
            const newSlides = get().slides.map((s) => s.id === id ? { ...s, ...updatedSlide } : s);
            set({ slides: newSlides });
            await setDoc(doc(db, COLLECTION, 'slides'), { list: newSlides });
        } catch (error) {
            console.error('Error updating slide:', error);
        }
    },
    reorderSlides: async (newSlides) => {
        try {
            set({ slides: newSlides });
            await setDoc(doc(db, COLLECTION, 'slides'), { list: newSlides });
        } catch (error) {
            console.error('Error reordering slides:', error);
        }
    },

    updateBellSchedule: async (schedule) => {
        try {
            set({ bellSchedule: schedule });
            await setDoc(doc(db, COLLECTION, 'bellSchedule'), { list: schedule });
        } catch (error) {
            console.error('Error updating schedule:', error);
        }
    },

    updateDutyTeachers: async (teachers) => {
        try {
            set({ dutyTeachers: teachers });
            await setDoc(doc(db, COLLECTION, 'dutyTeachers'), { list: teachers });
        } catch (error) {
            console.error('Error updating duty teachers:', error);
        }
    },

    updateFoodMenu: async (menu) => {
        try {
            set({ foodMenu: menu });
            await setDoc(doc(db, COLLECTION, 'foodMenu'), { list: menu });
        } catch (error) {
            console.error('Error updating food menu:', error);
        }
    },

    updateBirthdays: async (list) => {
        try {
            set({ birthdays: list });
            await setDoc(doc(db, COLLECTION, 'birthdays'), { list: list });
        } catch (error) {
            console.error('Error updating birthdays:', error);
        }
    },

    updateSpecificDays: async (list) => {
        try {
            set({ specificDays: list });
            await setDoc(doc(db, COLLECTION, 'specificDays'), { list: list });
        } catch (error) {
            console.error('Error updating specific days:', error);
        }
    },
}));
