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
        if (sessionStorage.getItem('preloaderShown')) {
            preloader.style.display = 'none';
        } else {
            sessionStorage.setItem('preloaderShown', 'true');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 4500);
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
        const switchToSigninLink1 = document.getElementById('switch-to-signin-link');
        const switchToSigninLink2 = document.getElementById('switch-to-signin-link-2');

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
        if (switchToSigninLink1) switchToSigninLink1.addEventListener('click', (e) => { e.preventDefault(); showForm(signinForm, showSigninTab); });
        if (switchToSigninLink2) switchToSigninLink2.addEventListener('click', (e) => { e.preventDefault(); showForm(signinForm, showSigninTab); });


        // --- AUTH API LOGIC (DEPLOYMENT READY) ---
        const signinMessageDiv = document.getElementById('signin-message');
        const signupMessageDiv = document.getElementById('signup-message');
        const navAuthButtons = document.getElementById('nav-auth-buttons');
        const navUserInfo = document.getElementById('nav-user-info');
        const userDisplayName = document.getElementById('user-display-name');
        const logoutBtn = document.getElementById('logout-btn');

        // Single, relative base URL for all API calls
        const API_BASE_URL = '/api';

        const updateAuthUI = async () => {
            const token = localStorage.getItem('access_token');
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
                    console.error('Error verifying token:', error);
                    localStorage.removeItem('access_token');
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
                signinMessageDiv.style.color = 'blue';

                const formData = new URLSearchParams();
                formData.append('username', document.getElementById('signin-email').value);
                formData.append('password', document.getElementById('signin-password').value);

                try {
                    const response = await fetch(`${API_BASE_URL}/token`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: formData
                    });

                    if (response.ok) {
                        const data = await response.json();
                        localStorage.setItem('access_token', data.access_token);
                        signinMessageDiv.textContent = 'Login successful!';
                        signinMessageDiv.style.color = 'green';
                        setTimeout(() => {
                            closeModal();
                            updateAuthUI();
                        }, 1000);
                    } else {
                        const errorData = await response.json();
                        signinMessageDiv.textContent = `Error: ${errorData.detail || response.statusText}`;
                        signinMessageDiv.style.color = 'red';
                    }
                } catch (error) {
                    signinMessageDiv.textContent = 'Network error. Please try again.';
                    signinMessageDiv.style.color = 'red';
                }
            });
        }

        if (signupForm) {
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                signupMessageDiv.textContent = 'Registering...';
                signupMessageDiv.style.color = 'blue';

                const full_name = document.getElementById('signup-fullname').value;
                const email = document.getElementById('signup-email').value;
                const password = document.getElementById('signup-password').value;

                try {
                    const response = await fetch(`${API_BASE_URL}/register`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ full_name, email, password })
                    });

                    if (response.ok) {
                        signupMessageDiv.textContent = `Registration successful! You can now log in.`;
                        signupMessageDiv.style.color = 'green';
                        setTimeout(() => {
                            showForm(signinForm, showSigninTab);
                            document.getElementById('signin-email').value = email;
                            document.getElementById('signin-message').textContent = '';
                        }, 1500);
                    } else {
                        const errorData = await response.json();
                        signupMessageDiv.textContent = `Error: ${errorData.detail || response.statusText}`;
                        signupMessageDiv.style.color = 'red';
                    }
                } catch (error) {
                    signupMessageDiv.textContent = 'Network error. Please try again.';
                    signupMessageDiv.style.color = 'red';
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
    }

    // --- CHATBOT LOGIC (No backend connection, no changes needed) ---
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

    // --- Product Card Fade-in on Scroll ---
    const productCards = document.querySelectorAll('.product-card');
    if (productCards.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        productCards.forEach(card => observer.observe(card));
    }

    // ===================================================================
    // SECTION 2: API-DRIVEN TOOL LOGIC (DEPLOYMENT READY)
    // ===================================================================
    const API_TOOLS_BASE_URL = '/api/tools'; // Relative URL for all tools

    // --- SOLAR PAY CALCULATOR LOGIC ---
    const solarPayForm = document.getElementById('solar-pay-form');
    if (solarPayForm) {
        const resultsContainer = document.getElementById('results-container');
        resultsContainer.innerHTML = '<p>Enter your system details and monthly bill above and click "Calculate Savings" to get a financial estimate.</p>';
        solarPayForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            resultsContainer.innerHTML = '<p>Calculating...</p>';
            const requestData = {
                system_size_kw: parseFloat(document.getElementById('system-size').value),
                state: document.getElementById('state').value,
                monthly_bill_inr: parseFloat(document.getElementById('monthly-bill').value)
            };
            try {
                const response = await fetch(`${API_TOOLS_BASE_URL}/solar-pay`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestData)
                });
                if (!response.ok) throw new Error((await response.json()).detail);
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
                resultsContainer.innerHTML = `<p style="color: red;">Error: ${error.message}.</p>`;
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
                resultsContainer.innerHTML = '<p style="color: red;">Please enter a valid positive number.</p>';
                return;
            }
            try {
                const response = await fetch(`${API_TOOLS_BASE_URL}/eco-meter?kwh_generated_monthly=${kwh}`);
                if (!response.ok) throw new Error((await response.json()).detail);
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
                resultsContainer.innerHTML = `<p style="color: red;">Error: ${error.message}.</p>`;
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
            try {
                const response = await fetch(`${API_TOOLS_BASE_URL}/green-cell?capacity_ah=${capacity}¤t_cycles=${cycles}&avg_dod_percent=${dod}`);
                if (!response.ok) throw new Error((await response.json()).detail);
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
                resultsContainer.innerHTML = `<p style="color: red;">Error: ${error.message}.</p>`;
            }
        });
    }

    // --- AGRI SOLAR LOGIC ---
    const agriSolarForm = document.getElementById('agri-solar-form');
    if (agriSolarForm) {
        const resultsContainer = document.getElementById('agri-solar-results');
        resultsContainer.innerHTML = '<p>Enter your details above and click "Get Advice" to see smart irrigation recommendations.</p>';
        agriSolarForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const pumpHp = document.getElementById('pump-hp').value;
            const cropType = document.getElementById('crop-type').value;
            try {
                const response = await fetch(`${API_TOOLS_BASE_URL}/agri-solar?pump_hp=${pumpHp}&crop_type=${encodeURIComponent(cropType)}`);
                if (!response.ok) throw new Error((await response.json()).detail);
                const data = await response.json();
                resultsContainer.innerHTML = `
                    <p><strong>Weather Forecast:</strong> ${data.weather_prediction}</p>
                    <p style="font-size: 1.1rem; color: var(--primary-color); border-left: 3px solid var(--primary-color); padding-left: 10px;"><em>${data.irrigation_advice}</em></p>`;
            } catch (error) {
                resultsContainer.innerHTML = `<p style="color: red;">Error: ${error.message}.</p>`;
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
            try {
                const response = await fetch(`${API_TOOLS_BASE_URL}/solar-ai?pincode=${pincode}&roof_area_sqft=${roofArea}`);
                if (!response.ok) throw new Error((await response.json()).detail);
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
                resultsContainer.innerHTML = `<p style="color: red;">Error: ${error.message}.</p>`;
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
            document.querySelector(`.topic-btn[data-topic="${topic}"]`)?.classList.add('active');
            try {
                const response = await fetch(`${API_TOOLS_BASE_URL}/solar-ed?topic=${topic}`);
                if (!response.ok) throw new Error((await response.json()).detail);
                const data = await response.json();
                const linkHtml = data.link ? `<p><a href="${data.link}" target="_blank" rel="noopener noreferrer">Learn More on the Official Portal →</a></p>` : '';
                contentContainer.innerHTML = `
                    <h3>${data.title}</h3>
                    <p>${data.content}</p>
                    ${linkHtml}`;
            } catch (error) {
                contentContainer.innerHTML = `<p style="color: red;">Error: ${error.message}.</p>`;
            }
        };

        topicButtons.forEach(button => {
            button.addEventListener('click', () => loadTopicContent(button.dataset.topic));
        });

        if (topicButtons.length > 0) {
            loadTopicContent('subsidies');
        }
    }
});
