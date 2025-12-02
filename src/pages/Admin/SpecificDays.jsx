import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Trash2, Save } from 'lucide-react';

const SpecificDays = () => {
    const { specificDays, updateSpecificDays } = useStore();
    const [list, setList] = useState(specificDays || []);

    React.useEffect(() => {
        setList(specificDays || []);
    }, [specificDays]);

    const handleChange = (id, field, value) => {
        setList(list.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const addRow = () => {
        const newId = Date.now().toString();
        setList([...list, { id: newId, name: '', startDate: new Date().toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0] }]);
    };

    const removeRow = (id) => {
        setList(list.filter(item => item.id !== id));
    };

    const handleSave = () => {
        updateSpecificDays(list);
        alert('Belirli günler listesi kaydedildi!');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const lines = text.split('\n');
            const newList = [];

            // Format: Name,StartDate,EndDate
            lines.forEach((line, index) => {
                if (!line.trim()) return;
                const parts = line.split(',');
                if (parts.length >= 3) {
                    newList.push({
                        id: Date.now().toString() + index,
                        name: parts[0].trim(),
                        startDate: parts[1].trim(),
                        endDate: parts[2].trim()
                    });
                }
            });

            if (newList.length > 0) {
                if (window.confirm(`${newList.length} kayıt bulundu. Mevcut listenin üzerine yazılsın mı?`)) {
                    setList(newList);
                } else {
                    setList([...list, ...newList]);
                }
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Belirli Günler ve Haftalar</h2>
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
                            <th className="p-3 font-medium text-gray-600">Gün/Hafta Adı</th>
                            <th className="p-3 font-medium text-gray-600">Başlangıç</th>
                            <th className="p-3 font-medium text-gray-600">Bitiş</th>
                            <th className="p-3 font-medium text-gray-600 w-20">İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((item) => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">
                                    <input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) => handleChange(item.id, 'name', e.target.value)}
                                        className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
                                        placeholder="Örn: Yeşilay Haftası"
                                    />
                                </td>
                                <td className="p-3">
                                    <input
                                        type="date"
                                        value={item.startDate}
                                        onChange={(e) => handleChange(item.id, 'startDate', e.target.value)}
                                        className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
                                    />
                                </td>
                                <td className="p-3">
                                    <input
                                        type="date"
                                        value={item.endDate}
                                        onChange={(e) => handleChange(item.id, 'endDate', e.target.value)}
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

export default SpecificDays;
