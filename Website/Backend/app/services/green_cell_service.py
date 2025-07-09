# Backend/app/services/green_cell_service.py
import random

def monitor_battery_health(capacity_ah: int, current_cycles: int, avg_dod_percent: float):
    """MOCK: Simulates monitoring solar battery health and lifecycle."""
    MAX_LIFECYCLE_CYCLES = 3000
    wear_factor = 1 + (avg_dod_percent / 100 - 0.5) * 0.5
    effective_cycles_used = current_cycles * wear_factor
    health_percentage = max(0, (1 - (effective_cycles_used / MAX_LIFECYCLE_CYCLES)) * 100)
    remaining_cycles = max(0, MAX_LIFECYCLE_CYCLES - effective_cycles_used)
    
    alert = "Healthy"
    if health_percentage < 80 and health_percentage >= 60:
        alert = "Performance degraded. Consider a health check-up."
    elif health_percentage < 60:
        alert = "Critical health. Plan for a replacement soon."
    
    current_efficiency = 95.0 - (100 - health_percentage) * 0.2

    return {
        "tool": "GreenCell",
        "battery_capacity_ah": capacity_ah,
        "current_health_percent": round(health_percentage, 2),
        "estimated_remaining_cycles": round(remaining_cycles),
        "current_charge_efficiency_percent": round(current_efficiency, 2),
        "maintenance_alert": alert
    }