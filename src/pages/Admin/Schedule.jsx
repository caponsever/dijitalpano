import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Trash2, Save } from 'lucide-react';

const ScheduleAdmin = () => {
    const { bellSchedule, updateBellSchedule } = useStore();
    const [schedule, setSchedule] = useState(bellSchedule);

    const handleChange = (id, field, value) => {
        setSchedule(schedule.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const addRow = () => {
        const newId = (Math.max(...schedule.map(s => parseInt(s.id) || 0), 0) + 1).toString();
        setSchedule([...schedule, { id: newId, name: `${schedule.length + 1}. Ders`, startTime: '', endTime: '' }]);
    };

    const removeRow = (id) => {
        setSchedule(schedule.filter(item => item.id !== id));
    };

    const handleSave = () => {
        updateBellSchedule(schedule);
        alert('Ders programı kaydedildi!');
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Ders Saatleri</h2>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Save size={18} />
                    Kaydet
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="p-3 font-medium text-gray-600">Ders Adı</th>
                            <th className="p-3 font-medium text-gray-600">Giriş</th>
                            <th className="p-3 font-medium text-gray-600">Çıkış</th>
                            <th className="p-3 font-medium text-gray-600 w-20">İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map((item) => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">
                                    <input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) => handleChange(item.id, 'name', e.target.value)}
                                        className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
                                    />
                                </td>
                                <td className="p-3">
                                    <input
                                        type="time"
                                        value={item.startTime}
                                        onChange={(e) => handleChange(item.id, 'startTime', e.target.value)}
                                        className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
                                    />
                                </td>
                                <td className="p-3">
                                    <input
                                        type="time"
                                        value={item.endTime}
                                        onChange={(e) => handleChange(item.id, 'endTime', e.target.value)}
                                        className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
                                    />
                                </td>
                                <td className="p-3 text-center">
                                    <button
                                        onClick={() => removeRow(item.id)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button
                onClick={addRow}
                className="mt-4 flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
                <Plus size={18} />
                Yeni Ders Ekle
            </button>
        </div>
    );
};

export default ScheduleAdmin;
