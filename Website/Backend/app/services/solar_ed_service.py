# Backend/app/services/solar_ed_service.py
def get_educational_content(topic: str) -> dict:
    """
    Serves simple educational content from a predefined dictionary.
    In a real app, this would come from a database or a Content Management System (CMS).
    """
    content_library = {
        "subsidies": {
            "title": "Understanding Solar Subsidies in India",
            "content": "The Government of India, under the National Rooftop Solar scheme, provides a Central Financial Assistance (CFA) to homeowners. The current subsidy is ₹18,000/kW for the first 2 kW and ₹9,000/kW for an additional 1 kW. The subsidy is capped at 3 kW for systems up to 10kW. This can be applied for through the national portal.",
            "link": "https://solarrooftop.gov.in/"
        },
        "net_metering": {
            "title": "What is Net Metering?",
            "content": "Net metering is a billing mechanism that credits solar energy system owners for the electricity they add to the grid. When your solar panels produce more electricity than you consume during the day, the surplus is exported to the grid. Your electricity meter runs in reverse, providing a credit against the electricity you consume from the grid at night or on cloudy days.",
            "link": "https://mnre.gov.in/solar/schemes/grid-connected/rooftop-solar"
        },
        "panel_types": {
            "title": "Types of Solar Panels: Monocrystalline vs. Polycrystalline",
            "content": "Monocrystalline panels are made from a single crystal of silicon, offering higher efficiency and a sleek, black appearance. They perform better in low-light conditions. Polycrystalline panels are made from multiple silicon fragments, making them less efficient but more cost-effective. They have a blueish hue. Thin-film panels are another type, suitable for flexible surfaces but generally less efficient than crystal-based panels.",
            "link": "https://www.irena.org/solar"
        },
        "roi_payback": {
            "title": "ROI and Payback Period for Solar",
            "content": "Return on Investment (ROI) for solar refers to the financial benefit gained relative to the initial cost. The payback period is the time it takes for your cumulative energy savings to equal your initial investment. In India, with subsidies and high electricity tariffs, payback periods can often range from 4 to 7 years, after which your electricity is virtually free.",
            "link": "https://www.teriin.org/article/solar-rooftop-potential-india"
        },
        "maintenance_tips": {
            "title": "Basic Solar Panel Maintenance Tips",
            "content": "To ensure optimal performance, regularly clean your solar panels to remove dust and debris. Check for any shading issues from new trees or constructions. Inspect wiring for damage and ensure the inverter is operating correctly. Professional inspections every 1-2 years can identify potential issues early.",
            "link": "https://en.wikipedia.org/wiki/Photovoltaic_system_maintenance"
        }
    }
    
    # Return the content for the requested topic, or an error dictionary if not found.
    return content_library.get(topic, {
        "title": "Topic Not Found",
        "content": "We couldn't find information on that topic. Please try another one. Available topics are: Subsidies, Net Metering, Panel Types, ROI & Payback, Maintenance Tips.",
        "link": None
    })