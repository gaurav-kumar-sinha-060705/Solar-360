# Backend/app/services/agri_solar_service.py
import random

def get_smart_irrigation_advice(pump_hp: int, crop_type: str) -> dict:
    """MOCK: Simulates a smart assistant for solar irrigation."""
    # Simplified water needs based on crop type
    water_needs = {"rice": 10, "wheat": 7, "sugarcane": 12, "cotton": 8}
    water_need_factor = water_needs.get(crop_type.lower(), 6) # Default for other crops
    
    # Simulate a weather forecast
    weather_forecast = random.choice(["Sunny and Clear", "Partly Cloudy", "Light Overcast"])
    
    # Adjust recommended pump runtime based on weather
    pump_runtime_hours = water_need_factor - (3 if "Cloudy" in weather_forecast else 0)
    pump_runtime_hours = max(2, pump_runtime_hours) # Ensure a minimum runtime
    
    advice = f"For your '{crop_type.title()}' crop, with a forecast of '{weather_forecast}', we recommend auto-scheduling the {pump_hp}HP pump to run for approximately {pump_runtime_hours} hours today for optimal soil moisture."

    return {
        "tool": "AgriSolar",
        "input_pump_hp": pump_hp,
        "input_crop_type": crop_type,
        "weather_prediction": weather_forecast,
        "water_need_estimation": f"{water_need_factor} (on a scale of 1-15)",
        "irrigation_advice": advice
    }