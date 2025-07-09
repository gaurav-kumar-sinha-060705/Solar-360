from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional

# --- User & Auth Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- Tool Input & Output Schemas ---

# 1. SolarPay Schemas
class SolarPayInput(BaseModel):
    system_size_kw: float
    state: str
    monthly_bill_inr: float

class SolarPayOutput(BaseModel):
    total_cost: float
    subsidy_amount: float
    final_cost: float
    annual_savings: float
    payback_period_years: float
    loan_emi_per_month: Optional[float]

# 2. EcoMeter Output Schema
class EcoMeterOutput(BaseModel):
    tool: str
    monthly_kwh_generated: float
    co2_offset_monthly_kg: float
    co2_offset_yearly_tonnes: float
    equivalent_trees_planted: float
    dashboard_message: str

# 3. GreenCell Output Schema
class GreenCellOutput(BaseModel):
    tool: str
    battery_capacity_ah: int
    current_health_percent: float
    estimated_remaining_cycles: int
    current_charge_efficiency_percent: float
    maintenance_alert: str

# 4. AgriSolar Output Schema
class AgriSolarOutput(BaseModel):
    tool: str
    input_pump_hp: int
    input_crop_type: str
    weather_prediction: str
    water_need_estimation: str
    irrigation_advice: str
    
# 5. SolarAI Output Schemas
class SolarAIRecommendations(BaseModel):
    max_installable_capacity_kw: float
    optimal_panel_orientation: str
    recommended_tilt_angle_degrees: float

class SolarAIProjections(BaseModel):
    avg_daily_sunlight_hours: float
    estimated_generation_efficiency_percent: float

class SolarAIOutput(BaseModel):
    tool: str
    location_pincode: str
    roof_area_sqft: int
    recommendations: SolarAIRecommendations
    projections: SolarAIProjections

# 6. SolarEd Output Schema
class SolarEdOutput(BaseModel):
    title: str
    content: str
    link: Optional[str] = None