import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Trash2, Save } from 'lucide-react';

const FoodAdmin = () => {
    const { foodMenu, updateFoodMenu } = useStore();
    const [menu, setMenu] = useState(foodMenu);

    React.useEffect(() => {
        setMenu(foodMenu);
    }, [foodMenu]);

    const handleChange = (id, itemsString) => {
        const items = itemsString.split(',').map(i => i.trim());
        setMenu(menu.map(item => item.id === id ? { ...item, items } : item));
    };

    const handleDateChange = (id, date) => {
        setMenu(menu.map(item => item.id === id ? { ...item, date } : item));
    };

    const addRow = () => {
        const newId = Date.now().toString();
        setMenu([...menu, { id: newId, date: new Date().toISOString().split('T')[0], items: [] }]);
    };

    const removeRow = (id) => {
        setMenu(menu.filter(item => item.id !== id));
    };

    const handleSave = () => {
        updateFoodMenu(menu);
        alert('Yemek listesi kaydedildi!');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const lines = text.split('\n');
            const newMenu = [];

            // Format: Date,Item1|Item2|Item3
            lines.forEach((line, index) => {
                if (!line.trim()) return;
                const parts = line.split(',');
                if (parts.length >= 2) {
                    const date = parts[0].trim();
                    const items = parts[1].split('|').map(i => i.trim());
                    newMenu.push({
                        id: Date.now().toString() + index,
                        date,
                        items
                    });
                }
            });

            if (newMenu.length > 0) {
                if (window.confirm(`${newMenu.length} kayıt bulundu. Mevcut listenin üzerine yazılsın mı?`)) {
                    setMenu(newMenu);
                } else {
                    setMenu([...menu, ...newMenu]);
                }
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Yemek Listesi</h2>
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
                            <th className="p-3 font-medium text-gray-600 w-40">Tarih</th>
                            <th className="p-3 font-medium text-gray-600">Menü (Virgülle ayırın)</th>
                            <th className="p-3 font-medium text-gray-600 w-20">İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menu.map((item) => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">
                                    <input
                                        type="date"
                                        value={item.date}
                                        onChange={(e) => handleDateChange(item.id, e.target.value)}
                                        className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
                                    />
                                </td>
                                <td className="p-3">
                                    <input
                                        type="text"
                                        value={item.items.join(', ')}
                                        onChange={(e) => handleChange(item.id, e.target.value)}
                                        className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
                                        placeholder="Çorba, Ana Yemek, Pilav, Tatlı"
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

export default FoodAdmin;
