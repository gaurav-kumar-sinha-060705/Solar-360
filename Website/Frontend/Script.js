document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // SECTION 1: CORE UI & INTERACTIVITY
    // ===================================================================

    // --- THEME SWITCHER ---
    const themeSwitcher = document.getElementById('theme-switcher');
    const body = document.body;
    if (themeSwitcher) {
        const applyTheme = (theme) => {
            const themeIcon = themeSwitcher.querySelector('i');
            if (theme === 'dark') {
                body.classList.add('dark-mode');
                if (themeIcon) { themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); }
                localStorage.setItem('theme', 'dark');
            } else {
                body.classList.remove('dark-mode');
                if (themeIcon) { themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon'); }
                localStorage.setItem('theme', 'light');
            }
        };
        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);
        themeSwitcher.addEventListener('click', () => {
            const currentTheme = localStorage.getItem('theme') || 'light';
            applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    // --- PRELOADER ---
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        if (sessionStorage.getItem('preloaderShown')) {
            preloader.style.display = 'none';
        } else {
            sessionStorage.setItem('preloaderShown', 'true');
            setTimeout(() => { preloader.style.display = 'none'; }, 4500);
        }
    }

    // --- AUTH MODAL UI ---
    const authModalOverlay = document.getElementById('auth-modal-overlay');
    if (authModalOverlay) {
        const signInBtn = document.getElementById('signin-btn');
        const signUpBtn = document.getElementById('signup-btn');
        const closeModalBtn = document.getElementById('close-modal-btn');
        const showSigninTab = document.getElementById('show-signin-tab');
        const showSignupTab = document.getElementById('show-signup-tab');
        const signinForm = document.getElementById('signin-form');
        const signupForm = document.getElementById('signup-form');
        const switchToSignupLink = document.getElementById('switch-to-signup-link');
        const switchToSigninLink = document.getElementById('switch-to-signin-link-2');

        const openModal = () => authModalOverlay.classList.add('show');
        const closeModal = () => authModalOverlay.classList.remove('show');

        const showForm = (formToShow, tabToActivate) => {
            if (signinForm && signupForm && showSigninTab && showSignupTab) {
                document.querySelectorAll('.auth-message').forEach(msg => msg.textContent = '');
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
        if (switchToSignupLink) switchToSignupLink.addEventListener('click', (e) => { e.preventDefault(); showForm(signupForm, showSignupTab); });
        if (switchToSigninLink) switchToSigninLink.addEventListener('click', (e) => { e.preventDefault(); showForm(signinForm, showSigninTab); });
    }

    // --- CHATBOT UI ---
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
        const handleSendMessage = () => {
            const userInput = chatbotInput.value.trim();
            if (userInput === '') return;
            addMessage(userInput, 'user');
            chatbotInput.value = '';
            setTimeout(() => addMessage(getBotResponse(userInput), 'bot'), 1000);
        };
        const getBotResponse = (input) => {
            const lcInput = input.toLowerCase();
            if (lcInput.includes('hello') || lcInput.includes('hi')) return "Hi there! How can I assist you?";
            if (lcInput.includes('solar ai')) return "SolarAI helps find the best placement for solar panels using AI analysis.";
            if (lcInput.includes('pricing') || lcInput.includes('cost')) return "Use the SolarPay tool for a personalized financial quote and subsidy information.";
            if (lcInput.includes('subsidy')) return "SolarPay automatically checks government subsidies for you.";
            if (lcInput.includes('thank')) return "You're welcome! Let me know if you need anything else.";
            return "I'm not sure about that. Try asking about 'pricing', 'Solar AI', or 'subsidies'.";
        };
        if (chatbotSendBtn) chatbotSendBtn.addEventListener('click', handleSendMessage);
        if (chatbotInput) chatbotInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSendMessage(); });
    }

    // --- PRODUCT CARD FADE-IN ---
    const productCards = document.querySelectorAll('.product-card');
    if (productCards.length > 0) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        productCards.forEach(card => observer.observe(card));
    }


    // ===================================================================
    // SECTION 2: API & BACKEND LOGIC (FOR LOCAL SERVER)
    // ===================================================================

    const API_BASE_URL = '';
    const API_TOOLS_URL = `${API_BASE_URL}/api/tools`;

    // --- AUTHENTICATION API LOGIC ---
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    const signinMessageDiv = document.getElementById('signin-message');
    const signupMessageDiv = document.getElementById('signup-message');
    const navAuthButtons = document.getElementById('nav-auth-buttons');
    const navUserInfo = document.getElementById('nav-user-info');
    const userDisplayName = document.getElementById('user-display-name');
    const logoutBtn = document.getElementById('logout-btn');

    const updateAuthUI = async () => {
        const token = localStorage.getItem('access_token');
        if (!navAuthButtons || !navUserInfo) return;

        if (token) {
            try {
                const response = await fetch(`${API_BASE_URL}/users/me/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const user = await response.json();
                    userDisplayName.textContent = `Hi, ${user.full_name.split(' ')[0]}!`;
                    navAuthButtons.style.display = 'none';
                    navUserInfo.style.display = 'flex';
                } else {
                    localStorage.removeItem('access_token');
                    navAuthButtons.style.display = 'flex';
                    navUserInfo.style.display = 'none';
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                navAuthButtons.style.display = 'flex';
                navUserInfo.style.display = 'none';
            }
        } else {
            navAuthButtons.style.display = 'flex';
            navUserInfo.style.display = 'none';
        }
    };
    updateAuthUI();

    if (signinForm) {
        signinForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            signinMessageDiv.textContent = 'Logging in...';
            const formData = new URLSearchParams(new FormData(signinForm));
            try {
                const response = await fetch(`${API_BASE_URL}/token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formData
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.detail || 'Login failed');
                localStorage.setItem('access_token', data.access_token);
                signinMessageDiv.textContent = 'Login successful!';
                setTimeout(() => {
                    document.getElementById('close-modal-btn')?.click();
                    updateAuthUI();
                }, 1000);
            } catch (error) {
                signinMessageDiv.textContent = `Error: ${error.message}`;
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            signupMessageDiv.textContent = 'Registering...';
            const payload = {
                full_name: document.getElementById('signup-fullname').value,
                email: document.getElementById('signup-email').value,
                password: document.getElementById('signup-password').value
            };
            try {
                const response = await fetch(`${API_BASE_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.detail || 'Registration failed');
                signupMessageDiv.textContent = 'Registration successful! You can now log in.';
                setTimeout(() => {
                    document.getElementById('show-signin-tab')?.click();
                    document.getElementById('signin-email').value = payload.email;
                }, 1500);
            } catch (error) {
                signupMessageDiv.textContent = `Error: ${error.message}`;
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('access_token');
            updateAuthUI();
            alert('You have been logged out.');
        });
    }

    // --- ALL TOOLS API LOGIC ---

    // Generic error handler for tool forms
    const handleToolError = (container, error) => {
        container.innerHTML = `<p style="color: red;"><b>Error:</b> Could not connect to the backend. <br>Please ensure your local server is running at <b>${API_BASE_URL}</b>.<br><small>(${error.message})</small></p>`;
    };

    // --- SOLAR PAY ---
    const solarPayForm = document.getElementById('solar-pay-form');
    if (solarPayForm) {
        const results = document.getElementById('results-container');
        solarPayForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            results.innerHTML = '<p>Calculating...</p>';
            const payload = {
                system_size_kw: parseFloat(document.getElementById('system-size').value),
                state: document.getElementById('state').value,
                monthly_bill_inr: parseFloat(document.getElementById('monthly-bill').value)
            };
            try {
                const response = await fetch(`${API_TOOLS_URL}/solar-pay`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.detail);
                results.innerHTML = `<h3>Calculation Results:</h3><ul><li><strong>Total Estimated Cost:</strong> ₹${data.total_cost.toLocaleString('en-IN')}</li><li><strong>Government Subsidy:</strong> ₹${data.subsidy_amount.toLocaleString('en-IN')}</li><li><strong>Your Final Cost:</strong> ₹${data.final_cost.toLocaleString('en-IN')}</li><li><strong>Annual Savings:</strong> ₹${data.annual_savings.toLocaleString('en-IN')}</li><li><strong>Payback Period:</strong> ${data.payback_period_years} years</li></ul>`;
            } catch (err) { handleToolError(results, err); }
        });
    }

    // --- ECO METER ---
    const ecoMeterForm = document.getElementById('eco-meter-form');
    if (ecoMeterForm) {
        const results = document.getElementById('eco-meter-results');
        ecoMeterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            results.innerHTML = '<p>Calculating Impact...</p>';
            const kwh = document.getElementById('kwh-generated').value;
            try {
                const response = await fetch(`${API_TOOLS_URL}/eco-meter?kwh_generated_monthly=${kwh}`);
                const data = await response.json();
                if (!response.ok) throw new Error(data.detail);
                results.innerHTML = `<h3>Your Green Impact:</h3><ul><li><strong>CO₂ Offset (Monthly):</strong> ${data.co2_offset_monthly_kg} kg</li><li><strong>Equivalent Trees Planted:</strong> ${data.equivalent_trees_planted}</li></ul><p>${data.dashboard_message}</p>`;
            } catch (err) { handleToolError(results, err); }
        });
    }

    // --- GREEN CELL ---
    const greenCellForm = document.getElementById('green-cell-form');
    if (greenCellForm) {
        const results = document.getElementById('green-cell-results');
        greenCellForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            results.innerHTML = '<p>Analyzing Battery...</p>';
            const params = new URLSearchParams({
                capacity_ah: document.getElementById('capacity-ah').value,
                current_cycles: document.getElementById('current-cycles').value,
                avg_dod_percent: document.getElementById('avg-dod').value
            }).toString();
            try {
                const response = await fetch(`${API_TOOLS_URL}/green-cell?${params}`);
                const data = await response.json();
                if (!response.ok) throw new Error(data.detail);
                results.innerHTML = `<h3>Battery Health Report:</h3><ul><li><strong>Health:</strong> ${data.current_health_percent}%</li><li><strong>Remaining Cycles:</strong> ${data.estimated_remaining_cycles}</li><li><strong>Efficiency:</strong> ${data.current_charge_efficiency_percent}%</li><li><strong>Alert:</strong> ${data.maintenance_alert}</li></ul>`;
            } catch (err) { handleToolError(results, err); }
        });
    }

    // --- AGRI SOLAR ---
    const agriSolarForm = document.getElementById('agri-solar-form');
    if (agriSolarForm) {
        const results = document.getElementById('agri-solar-results');
        agriSolarForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            results.innerHTML = '<p>Getting Advice...</p>';
            const params = new URLSearchParams({
                pump_hp: document.getElementById('pump-hp').value,
                crop_type: document.getElementById('crop-type').value
            }).toString();
            try {
                const response = await fetch(`${API_TOOLS_URL}/agri-solar?${params}`);
                const data = await response.json();
                if (!response.ok) throw new Error(data.detail);
                results.innerHTML = `<p><strong>Weather:</strong> ${data.weather_prediction}</p><p><em>${data.irrigation_advice}</em></p>`;
            } catch (err) { handleToolError(results, err); }
        });
    }

    // --- SOLAR AI ---
    const solarAiForm = document.getElementById('solar-ai-form');
    if (solarAiForm) {
        const results = document.getElementById('solar-ai-results');
        solarAiForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            results.innerHTML = '<p>AI is Analyzing...</p>';
            const params = new URLSearchParams({
                pincode: document.getElementById('pincode').value,
                roof_area_sqft: document.getElementById('roof-area').value
            }).toString();
            try {
                const response = await fetch(`${API_TOOLS_URL}/solar-ai?${params}`);
                const data = await response.json();
                if (!response.ok) throw new Error(data.detail);
                results.innerHTML = `<h3>AI Analysis Report:</h3><ul><li><strong>Max Capacity:</strong> ${data.recommendations.max_installable_capacity_kw} kW</li><li><strong>Orientation:</strong> ${data.recommendations.optimal_panel_orientation}</li><li><strong>Tilt Angle:</strong> ${data.recommendations.recommended_tilt_angle_degrees}°</li></ul>`;
            } catch (err) { handleToolError(results, err); }
        });
    }
    
    // --- SOLAR ED ---
    const solarEdTool = document.getElementById('solar-ed-tool');
    if (solarEdTool) {
        const contentContainer = document.getElementById('solar-ed-content');
        const topicButtons = document.querySelectorAll('.topic-btn');
        const loadTopicContent = async (topic) => {
            contentContainer.innerHTML = '<p>Loading content...</p>';
            contentContainer.style.textAlign = 'center';
            topicButtons.forEach(btn => btn.classList.remove('active'));
            const activeBtn = document.querySelector(`.topic-btn[data-topic="${topic}"]`);
            if (activeBtn) activeBtn.classList.add('active');

            try {
                const response = await fetch(`${API_TOOLS_URL}/solar-ed?topic=${topic}`);
                const data = await response.json();
                if (!response.ok) throw new Error(data.detail);
                const linkHtml = data.link ? `<p><a href="${data.link}" target="_blank" rel="noopener noreferrer">Learn More →</a></p>` : '';
                contentContainer.style.textAlign = 'left';
                contentContainer.innerHTML = `<h3>${data.title}</h3><p>${data.content}</p>${linkHtml}`;
            } catch (err) { handleToolError(contentContainer, err); }
        };

        topicButtons.forEach(button => {
            button.addEventListener('click', () => loadTopicContent(button.dataset.topic));
        });
    }
});

