# Backend/app/services/solar_ai_service.py
import random

def analyze_roof_potential(pincode: str, roof_area_sqft: int) -> dict:
    """MOCK AI: Simulates analyzing a roof for solar potential."""
    # Simple logic: 1 kW of solar panels needs about 100 sq. ft. of shadow-free area.
    max_system_size_kw = roof_area_sqft / 100
    
    # Simulate optimal panel tilt angle based on latitude (very rough estimation)
    # Pincode starting digit gives a rough idea of the region.
    latitude_map = {
        "1": 28, "2": 26, "3": 27, "4": 22, 
        "5": 19, "6": 11, "7": 15, "8": 9
    }
    # Get the base latitude or default to a central value
    base_latitude = latitude_map.get(pincode[0], 20)
    best_tilt_angle = base_latitude + random.uniform(-2, 2) # Add slight variation
    
    # Simulate average daily sunlight hours based on tilt and region
    sunlight_hours_per_day = 5.5 - (abs(best_tilt_angle - 23.5) / 15) # Mock calculation
    
    # Generation efficiency is a function of getting optimal sunlight
    efficiency = (sunlight_hours_per_day / 6.0) * 100
    
    return {
        "tool": "SolarAI",
        "location_pincode": pincode,
        "roof_area_sqft": roof_area_sqft,
        "recommendations": {
            "max_installable_capacity_kw": round(max_system_size_kw, 1),
            "optimal_panel_orientation": "South-facing",
            "recommended_tilt_angle_degrees": round(best_tilt_angle, 1)
        },
        "projections": {
            "avg_daily_sunlight_hours": round(sunlight_hours_per_day, 1),
            "estimated_generation_efficiency_percent": round(efficiency, 2)
        }
    }