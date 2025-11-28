import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
    persist(
        (set) => ({
            settings: {
                schoolName: 'Yenikent Ahmet Çiçek Mesleki ve Teknik Anadolu Lisesi',
                city: 'Ankara',
                logoUrl: 'https://via.placeholder.com/150', // Default placeholder
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
            updateSettings: (newSettings) => set((state) => ({
                settings: { ...state.settings, ...newSettings }
            })),
            addSlide: (slide) => set((state) => ({
                slides: [...state.slides, slide]
            })),
            removeSlide: (id) => set((state) => ({
                slides: state.slides.filter((s) => s.id !== id)
            })),
            updateSlide: (id, updatedSlide) => set((state) => ({
                slides: state.slides.map((s) => s.id === id ? { ...s, ...updatedSlide } : s)
            })),
            reorderSlides: (newSlides) => set({ slides: newSlides }),

            // Bell Schedule
            bellSchedule: [
                { id: '1', name: '1. Ders', startTime: '08:30', endTime: '09:10' },
                { id: '2', name: '2. Ders', startTime: '09:25', endTime: '10:05' },
                { id: '3', name: '3. Ders', startTime: '10:15', endTime: '10:55' },
            ],
            updateBellSchedule: (schedule) => set({ bellSchedule: schedule }),

            // Duty Teachers
            dutyTeachers: [
                { id: '1', name: 'Ahmet Yılmaz', location: 'Bahçe', date: new Date().toISOString().split('T')[0] },
                { id: '2', name: 'Ayşe Demir', location: '1. Kat', date: new Date().toISOString().split('T')[0] },
            ],
            updateDutyTeachers: (teachers) => set({ dutyTeachers: teachers }),

            // Food Menu
            foodMenu: [
                { id: '1', date: new Date().toISOString().split('T')[0], items: ['Mercimek Çorbası', 'Tavuk Sote', 'Pilav', 'Ayran'] }
            ],
            updateFoodMenu: (menu) => set({ foodMenu: menu }),

            // Birthdays
            birthdays: [
                { id: '1', name: 'Ali Veli', date: new Date().toISOString().split('T')[0] } // Demo: Today
            ],
            updateBirthdays: (list) => set({ birthdays: list }),

            // Specific Days
            specificDays: [
                { id: '1', name: 'Öğretmenler Günü', startDate: '2025-11-24', endDate: '2025-11-24' },
                { id: '2', name: 'Bilişim Haftası (Demo)', startDate: '2025-11-25', endDate: '2025-11-30' }
            ],
            updateSpecificDays: (list) => set({ specificDays: list }),
        }),
        {
            name: 'digital-signage-storage', // unique name
        }
    )
);
