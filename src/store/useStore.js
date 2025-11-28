import { create } from 'zustand';
import { db } from '../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

const COLLECTION = 'appData';

export const useStore = create((set, get) => ({
    // Initial State (Defaults)
    settings: {
        schoolName: 'Yenikent Ahmet Çiçek Mesleki ve Teknik Anadolu Lisesi',
        city: 'Ankara',
        logoUrl: 'https://via.placeholder.com/150',
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

    // Initialization (Listeners)
    initialize: () => {
        const unsubSettings = onSnapshot(doc(db, COLLECTION, 'settings'), (doc) => {
            if (doc.exists()) set({ settings: doc.data() });
        });
        const unsubSlides = onSnapshot(doc(db, COLLECTION, 'slides'), (doc) => {
            if (doc.exists()) set({ slides: doc.data().list || [] });
        });
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
        const updated = { ...get().settings, ...newSettings };
        // Optimistic update
        set({ settings: updated });
        await setDoc(doc(db, COLLECTION, 'settings'), updated);
    },

    addSlide: async (slide) => {
        const newSlides = [...get().slides, slide];
        set({ slides: newSlides });
        await setDoc(doc(db, COLLECTION, 'slides'), { list: newSlides });
    },
    removeSlide: async (id) => {
        const newSlides = get().slides.filter((s) => s.id !== id);
        set({ slides: newSlides });
        await setDoc(doc(db, COLLECTION, 'slides'), { list: newSlides });
    },
    updateSlide: async (id, updatedSlide) => {
        const newSlides = get().slides.map((s) => s.id === id ? { ...s, ...updatedSlide } : s);
        set({ slides: newSlides });
        await setDoc(doc(db, COLLECTION, 'slides'), { list: newSlides });
    },
    reorderSlides: async (newSlides) => {
        set({ slides: newSlides });
        await setDoc(doc(db, COLLECTION, 'slides'), { list: newSlides });
    },

    updateBellSchedule: async (schedule) => {
        set({ bellSchedule: schedule });
        await setDoc(doc(db, COLLECTION, 'bellSchedule'), { list: schedule });
    },

    updateDutyTeachers: async (teachers) => {
        set({ dutyTeachers: teachers });
        await setDoc(doc(db, COLLECTION, 'dutyTeachers'), { list: teachers });
    },

    updateFoodMenu: async (menu) => {
        set({ foodMenu: menu });
        await setDoc(doc(db, COLLECTION, 'foodMenu'), { list: menu });
    },

    updateBirthdays: async (list) => {
        set({ birthdays: list });
        await setDoc(doc(db, COLLECTION, 'birthdays'), { list: list });
    },

    updateSpecificDays: async (list) => {
        set({ specificDays: list });
        await setDoc(doc(db, COLLECTION, 'specificDays'), { list: list });
    },
}));
