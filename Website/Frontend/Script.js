document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // SECTION 1: CORE UI LOGIC (THEME, PRELOADER, MODAL, CHATBOT)
    // This code handles the general look and feel of the site.
    // ===================================================================

    // --- THEME SWITCHER LOGIC ---
    const themeSwitcher = document.getElementById('theme-switcher');
    const body = document.body;

    if (themeSwitcher) {
        const applyTheme = (theme) => {
            const themeIcon = themeSwitcher.querySelector('i');
            if (theme === 'dark') {
                body.classList.add('dark-mode');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                }
                localStorage.setItem('theme', 'dark');
            } else {
                body.classList.remove('dark-mode');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
                localStorage.setItem('theme', 'light');
            }
        };

        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);

        themeSwitcher.addEventListener('click', () => {
            const currentTheme = localStorage.getItem('theme');
            applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    // --- PRELOADER ---
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        // Check if preloader has been shown in this session
        if (sessionStorage.getItem('preloaderShown')) {
            preloader.style.display = 'none'; // Hide immediately if already shown
        } else {
            sessionStorage.setItem('preloaderShown', 'true'); // Mark as shown for this session
            // Hide after the animation duration (4.5s based on your CSS)
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 4500); // This matches your CSS animation duration + fadeOutBackground
        }
    }


    // --- AUTH MODAL LOGIC ---
    const authModalOverlay = document.getElementById('auth-modal-overlay');
    if (authModalOverlay) {
        const signInBtn = document.getElementById('signin-btn');
        const signUpBtn = document.getElementById('signup-btn');
        const closeModalBtn = document.getElementById('close-modal-btn');
        const showSigninTab = document.getElementById('show-signin-tab');
        const showSignupTab = document.getElementById('show-signup-tab');
        const signinForm = document.getElementById('signin-form');
        const signupForm = document.getElementById('signup-form');
        const switchToSigninLink = document.getElementById('switch-to-signin-link');

        const openModal = () => authModalOverlay.classList.add('show');
        const closeModal = () => authModalOverlay.classList.remove('show');

        const showForm = (formToShow, tabToActivate) => {
            if (signinForm && signupForm && showSigninTab && showSignupTab) {
                signinForm.classList.remove('active');
                signupForm.classList.remove('active');
                showSigninTab.classList.remove('active');
                showSignupTab.classList.remove('active');
                formToShow.classList.add('active');
                tabToActivate.classList.add('active');
            }
        };

        if (signInBtn) signInBtn.addEventListener('click', () => { showForm(signinForm, showSigninTab); openModal(); });
        if (signUpBtn) signUpBtn.addEventListener('click', () => { showForm(signupForm, showSignupTab); openModal(); });
        if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
        authModalOverlay.addEventListener('click', (e) => { if (e.target === authModalOverlay) closeModal(); });
        if (showSigninTab) showSigninTab.addEventListener('click', () => showForm(signinForm, showSigninTab));
        if (showSignupTab) showSignupTab.addEventListener('click', () => showForm(signupForm, showSignupTab));
        if (switchToSigninLink) switchToSigninLink.addEventListener('click', (e) => { e.preventDefault(); showForm(signinForm, showSigninTab); });
    }

    // --- CHATBOT LOGIC ---
    const chatbotFab = document.getElementById('chatbot-fab');
    if (chatbotFab) {
        const chatbotPopup = document.getElementById('chatbot-popup');
        const closeChatbotBtn = document.getElementById('close-chatbot-btn');
        const chatbotBody = document.getElementById('chatbot-body');
        const chatbotInput = document.getElementById('chatbot-input');
        const chatbotSendBtn = document.getElementById('chatbot-send');

        if(chatbotFab) chatbotFab.addEventListener('click', () => chatbotPopup.classList.toggle('show'));
        if(closeChatbotBtn) closeChatbotBtn.addEventListener('click', () => chatbotPopup.classList.remove('show'));

        const addMessage = (text, sender) => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('chat-message', `${sender}-message`);
            messageDiv.textContent = text;
            chatbotBody.appendChild(messageDiv);
            chatbotBody.scrollTop = chatbotBody.scrollHeight;
        };

        const getBotResponse = (userInput) => {
            const lcInput = userInput.toLowerCase();
            if (lcInput.includes('hello') || lcInput.includes('hi')) return "Hi there! How can I assist you with your solar needs?";
            if (lcInput.includes('solar ai')) return "SolarAI uses AI to determine the best placement for your solar panels, maximizing energy generation.";
            if (lcInput.includes('pricing') || lcInput.includes('cost')) return "Our pricing varies. For a personalized quote, use the SolarPay tool.";
            if (lcInput.includes('subsidy') || lcInput.includes('subsidies')) return "SolarPay automatically checks for eligible government subsidies when you enter your details.";
            if (lcInput.includes('thank')) return "You're welcome! Is there anything else I can help you with?";
            return "I'm sorry, I'm not sure. You can try asking about 'pricing', 'Solar AI', or 'subsidies'.";
        };

        const handleSendMessage = () => {
            const userInput = chatbotInput.value.trim();
            if (userInput === '') return;
            addMessage(userInput, 'user');
            chatbotInput.value = '';
            setTimeout(() => addMessage(getBotResponse(userInput), 'bot'), 1000);
        };

        if (chatbotSendBtn) chatbotSendBtn.addEventListener('click', handleSendMessage);
        if (chatbotInput) chatbotInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSendMessage(); });
    }

    // --- Product Card Fade-in on Scroll (Index Page Only) ---
    const productCards = document.querySelectorAll('.product-card');
    if (productCards.length > 0) {
        const observerOptions = {
            root: null, // relative to the viewport
            rootMargin: '0px',
            threshold: 0.1 // 10% of the item visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible'); // Adds 'visible' class
                    observer.unobserve(entry.target); // Stop observing once visible
                }
            });
        }, observerOptions);

        productCards.forEach(card => {
            observer.observe(card);
        });
    }

    // ===================================================================
    // SECTION 2: API-DRIVEN TOOL LOGIC
    // This code connects the tool pages to the backend API.
    // ===================================================================

    const API_BASE_URL = 'http://127.0.0.1:8000/api/tools'; 

    // --- SOLAR PAY CALCULATOR LOGIC ---
    const solarPayForm = document.getElementById('solar-pay-form');
    if (solarPayForm) {
        const resultsContainer = document.getElementById('results-container'); 

        resultsContainer.innerHTML = '<p>Enter your system details and monthly bill above and click "Calculate Savings" to get a financial estimate.</p>';

        solarPayForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            resultsContainer.innerHTML = '<p>Calculating...</p>'; 

            const systemSizeKw = parseFloat(document.getElementById('system-size').value);
            const state = document.getElementById('state').value;
            const monthlyBillInr = parseFloat(document.getElementById('monthly-bill').value);

            if (isNaN(systemSizeKw) || systemSizeKw <= 0) {
                resultsContainer.innerHTML = '<p style="color: red;">Please enter a valid positive number for System Size (kW).</p>';
                return;
            }
            if (!state) { 
                resultsContainer.innerHTML = '<p style="color: red;">Please select your State.</p>';
                return;
            }
            if (isNaN(monthlyBillInr) || monthlyBillInr <= 0) {
                resultsContainer.innerHTML = '<p style="color: red;">Please enter a valid positive number for Average Monthly Electricity Bill.</p>';
                return;
            }

            const requestData = {
                system_size_kw: systemSizeKw,
                state: state,
                monthly_bill_inr: monthlyBillInr
            };

            try {
                const response = await fetch(`${API_BASE_URL}/solar-pay`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData)
                });
                if (!response.ok) {
                    const errorData = await response.json(); 
                    throw new Error(`Server returned an error: ${errorData.detail || response.statusText}`);
                }
                const data = await response.json();
                resultsContainer.innerHTML = `
                    <h3>Calculation Results:</h3>
                    <ul>
                        <li><strong>Total Estimated Cost:</strong> ₹${data.total_cost.toLocaleString('en-IN')}</li>
                        <li><strong>Government Subsidy:</strong> ₹${data.subsidy_amount.toLocaleString('en-IN')}</li>
                        <li><strong>Your Final Cost:</strong> ₹${data.final_cost.toLocaleString('en-IN')}</li>
                        <li><strong>Estimated Annual Savings:</strong> ₹${data.annual_savings.toLocaleString('en-IN')}</li>
                        <li><strong>Payback Period:</strong> ${data.payback_period_years} years</li>
                        ${data.loan_emi_per_month ? `<li><strong>Estimated Loan EMI per month:</strong> ₹${data.loan_emi_per_month.toLocaleString('en-IN')}</li>` : ''}
                    </ul>`;
            } catch (error) {
                resultsContainer.innerHTML = `<p style="color: red;">Error: Could not connect to backend or ${error.message}. <br>Please ensure your backend server is running at ${API_BASE_URL}.</p>`;
            }
        });
    }

    // --- ECO METER LOGIC ---
    const ecoMeterForm = document.getElementById('eco-meter-form');
    if (ecoMeterForm) {
        const resultsContainer = document.getElementById('eco-meter-results'); 

        resultsContainer.innerHTML = '<p>Enter your monthly solar generation above and click "Track Impact" to see your environmental contribution.</p>';

        ecoMeterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            resultsContainer.innerHTML = '<p>Calculating Impact...</p>'; 

            const kwh = parseFloat(document.getElementById('kwh-generated').value);

            if (isNaN(kwh) || kwh <= 0) {
                resultsContainer.innerHTML = '<p style="color: red;">Please enter a valid positive number for monthly kWh generated.</p>';
                return;
            }

            const apiUrl = `${API_BASE_URL}/eco-meter?kwh_generated_monthly=${kwh}`;
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    const errorData = await response.json(); 
                    throw new Error(`Server returned an error: ${errorData.detail || response.statusText}`);
                }
                const data = await response.json();
                resultsContainer.innerHTML = `
                    <h3>Your Monthly Green Impact:</h3>
                    <ul>
                        <li><strong>CO₂ Offset:</strong> ${data.co2_offset_monthly_kg} kg</li>
                        <li><strong>Yearly CO₂ Offset:</strong> ${data.co2_offset_yearly_tonnes} tonnes</li>
                        <li><strong>Equivalent to Planting:</strong> ${data.equivalent_trees_planted} trees</li>
                    </ul>
                    <p>${data.dashboard_message}</p>`;
            } catch (error) {
                resultsContainer.innerHTML = `<p style="color: red;">Error: Could not connect to backend or ${error.message}. <br>Please ensure your backend server is running at ${API_BASE_URL}.</p>`;
            }
        });
    }

    // --- GREEN CELL LOGIC ---
    const greenCellForm = document.getElementById('green-cell-form');
    if (greenCellForm) {
        const resultsContainer = document.getElementById('green-cell-results'); 

        resultsContainer.innerHTML = '<p>Enter your battery details above and click "Analyze Battery" to get a health report.</p>';

        greenCellForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            resultsContainer.innerHTML = '<p>Analyzing Battery...</p>'; 

            const capacity = parseFloat(document.getElementById('capacity-ah').value);
            const cycles = parseFloat(document.getElementById('current-cycles').value);
            const dod = parseFloat(document.getElementById('avg-dod').value);

            if (isNaN(capacity) || capacity <= 0 || isNaN(cycles) || cycles < 0 || isNaN(dod) || dod < 0 || dod > 100) {
                resultsContainer.innerHTML = '<p style="color: red;">Please enter valid numbers for all fields. Capacity and DOD should be positive, Cycles non-negative, and DOD between 0-100.</p>';
                return;
            }

            // ********************************************************************************
            const apiUrl = `${API_BASE_URL}/green-cell?capacity_ah=${capacity}&current_cycles=${cycles}&avg_dod_percent=${dod}`;
            // ********************************************************************************

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    const errorData = await response.json(); 
                    throw new Error(`Server returned an error: ${errorData.detail || response.statusText}`);
                }
                const data = await response.json();
                resultsContainer.innerHTML = `
                    <h3>Battery Health Report:</h3>
                    <ul>
                        <li><strong>Current Health:</strong> ${data.current_health_percent}%</li>
                        <li><strong>Estimated Remaining Cycles:</strong> ${data.estimated_remaining_cycles}</li>
                        <li><strong>Charge Efficiency:</strong> ${data.current_charge_efficiency_percent}%</li>
                        <li><strong>Maintenance Alert:</strong> <span style="font-weight: bold;">${data.maintenance_alert}</span></li>
                    </ul>`;
            } catch (error) {
                resultsContainer.innerHTML = `<p style="color: red;">Error: Could not connect to backend or ${error.message}. <br>Please ensure your backend server is running at ${API_BASE_URL}.</p>`;
            }
        });
    }

    // --- AGRI SOLAR LOGIC (Now interactive with user input) ---
    const agriSolarForm = document.getElementById('agri-solar-form');
    const agriSolarResults = document.getElementById('agri-solar-results'); 

    if (agriSolarForm && agriSolarResults) {
        agriSolarResults.innerHTML = '<p>Enter your details above and click "Get Advice" to see smart irrigation recommendations.</p>';

        agriSolarForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            agriSolarResults.innerHTML = '<p>Getting smart irrigation advice...</p>'; 

            const pumpHp = document.getElementById('pump-hp').value;
            const cropType = document.getElementById('crop-type').value;

            if (!pumpHp || !cropType || isNaN(pumpHp) || parseInt(pumpHp) <= 0) {
                agriSolarResults.innerHTML = '<p style="color: red;">Please enter valid pump horsepower (a positive number) and crop type.</p>';
                return;
            }

            const apiUrl = `${API_BASE_URL}/agri-solar?pump_hp=${pumpHp}&crop_type=${encodeURIComponent(cropType)}`;

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    const errorData = await response.json(); 
                    throw new Error(`Server returned an error: ${errorData.detail || response.statusText}`);
                }
                const data = await response.json(); 

                agriSolarResults.innerHTML = `
                    <p><strong>Weather Forecast:</strong> ${data.weather_prediction}</p>
                    <p style="font-size: 1.1rem; color: var(--primary-color); border-left: 3px solid var(--primary-color); padding-left: 10px;"><em>${data.irrigation_advice}</em></p>
                `;
            } catch (error) {
                agriSolarResults.innerHTML = `<p style="color: red;">Error generating advice: Could not connect to backend or ${error.message}. <br>Please ensure your backend server is running at ${API_BASE_URL}.</p>`;
            }
        });
    }

    // --- SOLAR AI LOGIC ---
    const solarAiForm = document.getElementById('solar-ai-form');
    if (solarAiForm) {
        const resultsContainer = document.getElementById('solar-ai-results'); 

        resultsContainer.innerHTML = '<p>Enter your pincode and available roof area above and click "Analyze Potential" to get AI-driven recommendations.</p>';

        solarAiForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            resultsContainer.innerHTML = '<p>AI is Analyzing...</p>';

            const pincode = document.getElementById('pincode').value;
            const roofArea = parseFloat(document.getElementById('roof-area').value);

            const pincodeRegex = /^[1-9][0-9]{5}$/;
            if (!pincodeRegex.test(pincode)) {
                resultsContainer.innerHTML = '<p style="color: red;">Please enter a valid 6-digit Indian Pincode (e.g., 400001).</p>';
                return;
            }
            if (isNaN(roofArea) || roofArea <= 50) {
                resultsContainer.innerHTML = '<p style="color: red;">Please enter a valid roof area (a number greater than 50 sq. ft.).</p>';
                return;
            }

            const apiUrl = `${API_BASE_URL}/solar-ai?pincode=${pincode}&roof_area_sqft=${roofArea}`;
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    const errorData = await response.json(); 
                    throw new Error(`Server returned an error: ${errorData.detail || response.statusText}`);
                }
                const data = await response.json();
                resultsContainer.innerHTML = `
                    <h3>AI Roof Analysis Report:</h3>
                    <ul>
                        <li><strong>Max Installable Capacity:</strong> ${data.recommendations.max_installable_capacity_kw} kW</li>
                        <li><strong>Optimal Panel Orientation:</strong> ${data.recommendations.optimal_panel_orientation}</li>
                        <li><strong>Recommended Tilt Angle:</strong> ${data.recommendations.recommended_tilt_angle_degrees}°</li>
                    </ul>
                    <h4>Projections:</h4>
                    <ul>
                        <li><strong>Avg. Daily Sunlight:</strong> ${data.projections.avg_daily_sunlight_hours} hours</li>
                        <li><strong>Estimated Efficiency:</strong> ${data.projections.estimated_generation_efficiency_percent}%</li>
                    </ul>`;
            } catch (error) {
                resultsContainer.innerHTML = `<p style="color: red;">Error: Could not connect to backend or ${error.message}. <br>Please ensure your backend server is running at ${API_BASE_URL}.</p>`;
            }
        });
    }

    // --- SOLAR ED LOGIC ---
    const solarEdTool = document.getElementById('solar-ed-tool');
    if (solarEdTool) {
        const contentContainer = document.getElementById('solar-ed-content');
        const topicButtons = document.querySelectorAll('.topic-btn');

        const loadTopicContent = async (topic) => {
            contentContainer.innerHTML = '<p>Loading content...</p>'; 
            topicButtons.forEach(btn => btn.classList.remove('active'));
            const activeBtn = document.querySelector(`.topic-btn[data-topic="${topic}"]`);
            if (activeBtn) activeBtn.classList.add('active');

            const apiUrl = `${API_BASE_URL}/solar-ed?topic=${topic}`;
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    const errorData = await response.json(); 
                    throw new Error(`Topic not found or server error: ${errorData.detail || response.statusText}`);
                }
                const data = await response.json();
                const linkHtml = data.link ? `<p><a href="${data.link}" target="_blank" rel="noopener noreferrer">Learn More on the Official Portal →</a></p>` : '';
                contentContainer.innerHTML = `
                    <h3>${data.title}</h3>
                    <p>${data.content}</p>
                    ${linkHtml}`;
                contentContainer.style.justifyContent = 'flex-start';
                contentContainer.style.alignItems = 'flex-start';
                contentContainer.style.textAlign = 'inherit'; 

            } catch (error) {
                contentContainer.innerHTML = `<p style="color: red;">Error: Could not connect to backend or ${error.message}. <br>Please ensure your backend server is running at ${API_BASE_URL}.</p>`;
                contentContainer.style.justifyContent = 'center';
                contentContainer.style.alignItems = 'center';
                contentContainer.style.textAlign = 'center';
            }
        };

        topicButtons.forEach(button => {
            button.addEventListener('click', () => {
                const topic = button.dataset.topic;
                loadTopicContent(topic);
            });
        });

        if (topicButtons.length > 0) {
            loadTopicContent('subsidies'); 
        } else {
            contentContainer.innerHTML = '<p style="color: red;">No educational topics available.</p>';
        }
    }

}); 