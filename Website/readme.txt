Website/
├── Backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                  # FastAPI instance
│   │   ├── models.py                # SQLAlchemy DB models
│   │   ├── schemas.py               # Pydantic schemas
│   │   ├── crud.py                  # Database CRUD operations
│   │   ├── database.py              # DB engine/session setup
│   │   ├── auth.py                  # Auth logic (login, signup)
│   │   ├── services/                # Business logic for tools
│   │   │   ├── solar_pay.py
│   │   │   ├── solar_ed.py
│   │   │   ├── green_cell.py
│   │   │   ├── eco_meter.py
│   │   │   ├── agri_solar.py
│   │   │   └── solar_ai.py
│   │   └── routers/                 # API route handlers
│   │       ├── users.py             # Auth routes
│   │       ├── tools.py             # Common tool routes using service layer
│   ├── requirements.txt
│
├── Frontend/
│   ├── index.html
│   ├── agri_solar.html
│   ├── eco_meter.html
│   ├── green_cell.html
│   ├── solar_ai.html
│   ├── solar_ed.html
│   ├── solar_pay.html
│   ├── style.css
│   ├── script.js
│   └── assets/
│       ├── images/
│       └── icons/
│
├── venv/                            # Python virtual environment
│   └── ...
│
└── readme.txt                        # Project documentation



What is Solar360 Doing?
Solar360 is our all-in-one smart solar ecosystem. We're not just building a tool — we're building a movement to empower India with smarter, greener, and more cost-effective solar solutions.

At the Future Design Hackathon, here’s what we’re working on:

🚀 Our Goal:
To revolutionize the solar energy experience in India using smart tools, real-time data, AI, and government integration — making solar energy more accessible, educational, and impactful for every Indian.

🛠️ What We’re Building:
1. Solar AI
Optimizes solar panel placement using AI + geolocation + roof analysis.

Users upload roof data or scan with a mobile cam.

The system recommends best panel positions & angles.

Shows sunlight hours, efficiency, and cost savings.

2. SolarPay
Calculates savings, subsidies, and ROI from solar usage.

Real-time calculator using Indian rates & gov schemes.

Users see break-even time, yearly savings, and financing help.

3. GreenCell
Monitors solar battery health and lifecycle.

Tracks charge cycles, efficiency, and degradation.

Gives alerts for maintenance and performance boosts.

4. EcoMeter
Tracks environmental impact of your solar use.

CO₂ saved, trees equivalent, energy offset.

Visual dashboard + shareable green badge.

5. AgriSolar
Smart solar irrigation & farming assistant.

Weather prediction + water need estimator.

Auto-start solar pumps + crop-based water analytics.

6. SolarEd
Teaches India everything about solar in simple terms.

Regional languages support.

Short interactive lessons, quizzes, and how-to guides.

Includes policy updates and subsidy info.

💡 Extra Features:
🌗 Dark/Light Mode

🤖 Chatbot Support

🇮🇳 Built for Indian users with Indian government schemes

☁️ Cloud-based dashboard for users and vendors

📱 Mobile-friendly and scalable

This is Solar360: Smarter Energy, Not Harder.