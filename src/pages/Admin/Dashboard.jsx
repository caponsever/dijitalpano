import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Save, Plus, Trash2, GripVertical, Image as ImageIcon, Type } from 'lucide-react';

const Dashboard = () => {
    const { settings, slides, updateSettings, addSlide, removeSlide, updateSlide } = useStore();

    // Local state for form inputs to avoid excessive re-renders, or just bind directly for simplicity in prototype
    const [localSettings, setLocalSettings] = useState(settings);

    // Sync local state with store when store updates (e.g. after initial load)
    React.useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleSettingChange = (e) => {
        const { name, value } = e.target;
        setLocalSettings(prev => ({ ...prev, [name]: value }));
    };

    const [saving, setSaving] = useState(false);

    const saveSettings = async () => {
        setSaving(true);
        try {
            await updateSettings(localSettings);
            alert('Ayarlar başarıyla kaydedildi!');
        } catch (error) {
            alert('Hata: Ayarlar kaydedilemedi. İnternet bağlantınızı kontrol edin.\n' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleReset = async () => {
        if (!window.confirm('Okul adını "Teknopark Ankara..." olarak değiştirmek istiyor musunuz?')) return;

        const defaultSettings = {
            ...localSettings,
            schoolName: 'Teknopark Ankara İvedik OSB Mesleki ve Teknik Anadolu Lisesi'
        };

        setLocalSettings(defaultSettings); // Update local UI immediately
        setSaving(true);
        try {
            await updateSettings(defaultSettings);
            alert('Okul adı sıfırlandı ve kaydedildi!');
        } catch (error) {
            alert('Hata: Sıfırlama kaydedilemedi.\n' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleAddSlide = (type) => {
        const newSlide = {
            id: Date.now().toString(),
            type,
            content: type === 'image' ? 'https://via.placeholder.com/1920x1080' : 'New Announcement',
            duration: 10,
            title: 'New Slide'
        };
        addSlide(newSlide);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">

            {/* General Settings Section */}
            <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Genel Ayarlar v1.1</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handleReset}
                            disabled={saving}
                            className="px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Varsayılan Adı Yükle
                        </button>
                        <button
                            onClick={saveSettings}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            <Save size={18} />
                            {saving ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">School Name</label>
                        <input
                            type="text"
                            name="schoolName"
                            value={localSettings.schoolName}
                            onChange={handleSettingChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">City (for Weather)</label>
                        <input
                            type="text"
                            name="city"
                            value={localSettings.city}
                            onChange={handleSettingChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div className="col-span-full space-y-2">
                        <label className="text-sm font-medium text-gray-700">Ticker Text (Announcements)</label>
                        <textarea
                            name="tickerText"
                            value={localSettings.tickerText}
                            onChange={handleSettingChange}
                            rows={3}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <p className="text-xs text-gray-500">Separate multiple announcements with |</p>
                    </div>
                </div>
            </section>

            {/* Slides Management Section */}
            <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Slides ({slides.length})</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleAddSlide('image')}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <ImageIcon size={18} />
                            Add Image
                        </button>
                        <button
                            onClick={() => handleAddSlide('text')}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <Type size={18} />
                            Add Text
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {slides.map((slide) => (
                        <div key={slide.id} className="flex items-start gap-4 p-4 border rounded-lg bg-gray-50 group">
                            <div className="mt-2 text-gray-400 cursor-move">
                                <GripVertical size={20} />
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                                {/* Preview */}
                                <div className="md:col-span-2 h-20 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                                    {slide.type === 'image' ? (
                                        <img src={slide.content} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <Type className="text-gray-400" />
                                    )}
                                </div>

                                {/* Controls */}
                                <div className="md:col-span-10 space-y-3">
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-xs font-medium text-gray-500">Title</label>
                                            <input
                                                type="text"
                                                value={slide.title}
                                                onChange={(e) => updateSlide(slide.id, { title: e.target.value })}
                                                className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="w-24">
                                            <label className="text-xs font-medium text-gray-500">Duration (s)</label>
                                            <input
                                                type="number"
                                                value={slide.duration}
                                                onChange={(e) => updateSlide(slide.id, { duration: parseInt(e.target.value) || 5 })}
                                                className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-gray-500">Content {slide.type === 'image' ? '(Image URL)' : '(Text)'}</label>
                                        {slide.type === 'image' ? (
                                            <input
                                                type="text"
                                                value={slide.content}
                                                onChange={(e) => updateSlide(slide.id, { content: e.target.value })}
                                                className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <textarea
                                                value={slide.content}
                                                onChange={(e) => updateSlide(slide.id, { content: e.target.value })}
                                                rows={2}
                                                className="w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => removeSlide(slide.id)}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
