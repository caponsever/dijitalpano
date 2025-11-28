import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Trash2, Save } from 'lucide-react';

const DutyAdmin = () => {
    const { dutyTeachers, updateDutyTeachers } = useStore();
    const [teachers, setTeachers] = useState(dutyTeachers);

    const handleChange = (id, field, value) => {
        setTeachers(teachers.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const addRow = () => {
        const newId = Date.now().toString();
        setTeachers([...teachers, { id: newId, name: '', location: '', date: new Date().toISOString().split('T')[0] }]);
    };

    const removeRow = (id) => {
        setTeachers(teachers.filter(item => item.id !== id));
    };

    const handleSave = () => {
        updateDutyTeachers(teachers);
        alert('Nöbetçi listesi kaydedildi!');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const lines = text.split('\n');
            const newTeachers = [];

            // Skip header if exists, assuming simple CSV: Name,Location,Date
            lines.forEach((line, index) => {
                if (!line.trim()) return;
                const parts = line.split(',');
                if (parts.length >= 3) {
                    newTeachers.push({
                        id: Date.now().toString() + index,
                        name: parts[0].trim(),
                        location: parts[1].trim(),
                        date: parts[2].trim() // Expected format YYYY-MM-DD
                    });
                }
            });

            if (newTeachers.length > 0) {
                if (window.confirm(`${newTeachers.length} kayıt bulundu. Mevcut listenin üzerine yazılsın mı?`)) {
                    setTeachers(newTeachers);
                } else {
                    setTeachers([...teachers, ...newTeachers]);
                }
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Nöbetçi Öğretmenler</h2>
                <div className="flex gap-2">
                    <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                        <span className="text-sm">CSV Yükle</span>
                        <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                    </label>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Save size={18} />
                        Kaydet
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="p-3 font-medium text-gray-600">Öğretmen Adı</th>
                            <th className="p-3 font-medium text-gray-600">Nöbet Yeri</th>
                            <th className="p-3 font-medium text-gray-600">Tarih</th>
                            <th className="p-3 font-medium text-gray-600 w-20">İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map((item) => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">
                                    <input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) => handleChange(item.id, 'name', e.target.value)}
                                        className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
                                        placeholder="Ad Soyad"
                                    />
                                </td>
                                <td className="p-3">
                                    <input
                                        type="text"
                                        value={item.location}
                                        onChange={(e) => handleChange(item.id, 'location', e.target.value)}
                                        className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
                                        placeholder="Örn: Bahçe"
                                    />
                                </td>
                                <td className="p-3">
                                    <input
                                        type="date"
                                        value={item.date}
                                        onChange={(e) => handleChange(item.id, 'date', e.target.value)}
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
                Ekle
            </button>
        </div>
    );
};

export default DutyAdmin;
