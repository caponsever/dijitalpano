import React, { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind } from 'lucide-react';

const WeatherWidget = ({ city = 'Ankara' }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    // Map WMO codes to icons
    const getWeatherIcon = (code) => {
        if (code === 0 || code === 1) return <Sun className="text-yellow-400" size={48} />;
        if (code === 2 || code === 3) return <Cloud className="text-gray-400" size={48} />;
        if (code >= 45 && code <= 48) return <Cloud className="text-gray-600" size={48} />;
        if (code >= 51 && code <= 67) return <CloudRain className="text-blue-400" size={48} />;
        if (code >= 71 && code <= 77) return <CloudSnow className="text-white" size={48} />;
        if (code >= 95) return <CloudLightning className="text-purple-400" size={48} />;
        return <Sun className="text-yellow-400" size={48} />;
    };

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // First get coordinates for the city
                const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=tr&format=json`);
                const geoData = await geoRes.json();

                if (!geoData.results || geoData.results.length === 0) {
                    setLoading(false);
                    return;
                }

                const { latitude, longitude } = geoData.results[0];

                // Then get weather
                const weatherRes = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
                );
                const weatherData = await weatherRes.json();

                setWeather({
                    temp: Math.round(weatherData.current.temperature_2m),
                    code: weatherData.current.weather_code,
                    wind: weatherData.current.wind_speed_10m,
                    min: Math.round(weatherData.daily.temperature_2m_min[0]),
                    max: Math.round(weatherData.daily.temperature_2m_max[0]),
                });
            } catch (error) {
                console.error('Weather fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
        const interval = setInterval(fetchWeather, 600000); // Update every 10 mins
        return () => clearInterval(interval);
    }, [city]);

    if (loading || !weather) return <div className="animate-pulse bg-white/10 h-32 rounded-xl"></div>;

    return (
        <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-4 text-white border border-white/10 shadow-xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {getWeatherIcon(weather.code)}
                    <div>
                        <div className="text-4xl font-bold">{weather.temp}°</div>
                        <div className="text-sm opacity-80">{city}</div>
                    </div>
                </div>
                <div className="text-right space-y-1">
                    <div className="text-sm flex items-center justify-end gap-1">
                        <Wind size={14} /> {weather.wind} km/s
                    </div>
                    <div className="text-sm opacity-80">
                        H: {weather.max}° L: {weather.min}°
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
