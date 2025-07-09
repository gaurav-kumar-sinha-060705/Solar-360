# Backend/app/services/solar_pay_service.py

from .. import schemas
from typing import Optional

# These constants represent typical values and government policies.
# In a production app, these might come from a config file or a database.
NATIONAL_SUBSIDY_TIERS = {
    "tier1_kw": 2, "tier1_rate_per_kw": 18000,
    "tier2_kw": 1, "tier2_rate_per_kw": 9000,
    "max_kw_for_subsidy": 3
}
AVG_COST_PER_KW_INR = 60000
AVG_SOLAR_GENERATION_PER_KW_PER_YEAR_KWH = 1500
AVG_LOAN_INTEREST_RATE_ANNUAL = 0.09 # 9%
LOAN_TENURE_YEARS = 5

def calculate_solar_finance(data: schemas.SolarPayInput) -> schemas.SolarPayOutput:
    """Calculates solar rooftop financing details based on Indian government schemes."""
    system_size = data.system_size_kw
    
    # 1. Calculate Subsidy based on national portal guidelines
    subsidy_amount = 0.0
    if system_size <= NATIONAL_SUBSIDY_TIERS["max_kw_for_subsidy"]:
        if system_size <= NATIONAL_SUBSIDY_TIERS["tier1_kw"]:
            subsidy_amount = system_size * NATIONAL_SUBSIDY_TIERS["tier1_rate_per_kw"]
        else:
            subsidy_amount = (NATIONAL_SUBSIDY_TIERS["tier1_kw"] * NATIONAL_SUBSIDY_TIERS["tier1_rate_per_kw"]) + \
                             ((system_size - NATIONAL_SUBSIDY_TIERS["tier1_kw"]) * NATIONAL_SUBSIDY_TIERS["tier2_rate_per_kw"])

    # 2. Calculate Costs
    total_cost = system_size * AVG_COST_PER_KW_INR
    final_cost_after_subsidy = total_cost - subsidy_amount
    
    # 3. Calculate Savings
    # A simplified model. A more complex one would use state-wise tariff slabs.
    # Assuming average cost per unit derived from bill; e.g., bill of 2500 for ~400 units is ~6.25/unit
    avg_unit_cost = data.monthly_bill_inr / (data.monthly_bill_inr / 6.0) if data.monthly_bill_inr > 0 else 6.0
    annual_generation_kwh = system_size * AVG_SOLAR_GENERATION_PER_KW_PER_YEAR_KWH
    annual_savings = annual_generation_kwh * avg_unit_cost
    
    # 4. Calculate Payback Period
    payback_period_years = final_cost_after_subsidy / annual_savings if annual_savings > 0 else float('inf')

    # 5. Calculate Loan EMI (optional, assuming 90% financing)
    loan_amount = final_cost_after_subsidy * 0.90
    monthly_interest_rate = AVG_LOAN_INTEREST_RATE_ANNUAL / 12
    number_of_payments = LOAN_TENURE_YEARS * 12
    
    # EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    if monthly_interest_rate > 0:
        emi = (loan_amount * monthly_interest_rate * (1 + monthly_interest_rate)**number_of_payments) / \
              ((1 + monthly_interest_rate)**number_of_payments - 1)
        loan_emi_per_month: Optional[float] = round(emi, 2)
    else:
        loan_emi_per_month = None

    return schemas.SolarPayOutput(
        total_cost=round(total_cost, 2),
        subsidy_amount=round(subsidy_amount, 2),
        final_cost=round(final_cost_after_subsidy, 2),
        annual_savings=round(annual_savings, 2),
        payback_period_years=round(payback_period_years, 1),
        loan_emi_per_month=loan_emi_per_month
    )