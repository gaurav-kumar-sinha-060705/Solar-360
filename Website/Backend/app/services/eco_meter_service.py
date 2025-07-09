# Backend/app/services/eco_meter_service.py

# Emission factor for Indian grid: 0.71 kg CO2 per kWh (as of CEA 2022-23, simplified)
CO2_PER_KWH_KG = 0.71
# One mature tree absorbs ~21 kg of CO2 per year.
TREE_ABSORPTION_PER_YEAR_KG = 21

def track_environmental_impact(kwh_generated_monthly: float):
    """Calculates the positive environmental impact of solar generation."""
    co2_saved_monthly_kg = kwh_generated_monthly * CO2_PER_KWH_KG
    annual_co2_savings_kg = co2_saved_monthly_kg * 12
    trees_equivalent = annual_co2_savings_kg / TREE_ABSORPTION_PER_YEAR_KG

    return {
        "tool": "EcoMeter",
        "monthly_kwh_generated": kwh_generated_monthly,
        "co2_offset_monthly_kg": round(co2_saved_monthly_kg, 2),
        "co2_offset_yearly_tonnes": round(annual_co2_savings_kg / 1000, 2),
        "equivalent_trees_planted": round(trees_equivalent, 1),
        "dashboard_message": f"This month, your solar panels prevented {round(co2_saved_monthly_kg, 2)} kg of CO₂ emissions!"
    }