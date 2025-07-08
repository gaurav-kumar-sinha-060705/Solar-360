document.addEventListener('DOMContentLoaded', () => {

    // --- THEME SWITCHER LOGIC ---
    const themeSwitcher = document.getElementById('theme-switcher');
    const body = document.body;

    const applyTheme = (theme) => {
        const themeIcon = themeSwitcher.querySelector('i');
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    };

    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    themeSwitcher.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme');
        applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    // --- PRELOADER ---
    const preloader = document.querySelector('.preloader');

    // This block handles the "run once" and anchor scrolling logic
    if (sessionStorage.getItem('preloaderShown')) {
        // If preloader was already shown, hide it instantly
        if (preloader) {
            preloader.style.display = 'none';
        }
        // And check for anchor link to scroll to
        if (window.location.hash) {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                // A small delay ensures the layout is ready before scrolling
                setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    } else {
        // If this is the first visit of the session, run the preloader
        if (preloader) {
            sessionStorage.setItem('preloaderShown', 'true'); // Set the flag
            setTimeout(() => {
                preloader.style.display = 'none';
                // Check for anchor link after the preloader has finished
                if (window.location.hash) {
                    const targetElement = document.querySelector(window.location.hash);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }, 4500); // Your preloader timeout
        }
    }

    // --- INTERSECTION OBSERVER (for card animations) ---
    const cards = document.querySelectorAll('.product-card');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    cards.forEach(card => observer.observe(card));

    // --- AUTH MODAL LOGIC ---
    const authModalOverlay = document.getElementById('auth-modal-overlay');
    const signInBtn = document.getElementById('signin-btn');
    const signUpBtn = document.getElementById('signup-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    
    const showSigninTab = document.getElementById('show-signin-tab');
    const showSignupTab = document.getElementById('show-signup-tab');
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    const switchToSigninLink = document.getElementById('switch-to-signin-link');

    function openModal() { authModalOverlay.classList.add('show'); }
    function closeModal() { authModalOverlay.classList.remove('show'); }

    function showForm(formToShow, tabToActivate) {
        signinForm.classList.remove('active');
        signupForm.classList.remove('active');
        showSigninTab.classList.remove('active');
        showSignupTab.classList.remove('active');

        formToShow.classList.add('active');
        tabToActivate.classList.add('active');
    }

    if(signInBtn) signInBtn.addEventListener('click', () => {
        showForm(signinForm, showSigninTab);
        openModal();
    });
    if(signUpBtn) signUpBtn.addEventListener('click', () => {
        showForm(signupForm, showSignupTab);
        openModal();
    });

    if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if(authModalOverlay) authModalOverlay.addEventListener('click', (e) => {
        if (e.target === authModalOverlay) {
            closeModal();
        }
    });

    if(showSigninTab) showSigninTab.addEventListener('click', () => showForm(signinForm, showSigninTab));
    if(showSignupTab) showSignupTab.addEventListener('click', () => showForm(signupForm, showSignupTab));
    if(switchToSigninLink) switchToSigninLink.addEventListener('click', (e) => {
        e.preventDefault();
        showForm(signinForm, showSigninTab);
    });

    // --- CHATBOT LOGIC ---
    const chatbotFab = document.getElementById('chatbot-fab');
    const chatbotPopup = document.getElementById('chatbot-popup');
    const closeChatbotBtn = document.getElementById('close-chatbot-btn');
    const chatbotBody = document.getElementById('chatbot-body');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSendBtn = document.getElementById('chatbot-send');

    if(chatbotFab) chatbotFab.addEventListener('click', () => chatbotPopup.classList.toggle('show'));
    if(closeChatbotBtn) closeChatbotBtn.addEventListener('click', () => chatbotPopup.classList.remove('show'));

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', `${sender}-message`);
        messageDiv.textContent = text;
        chatbotBody.appendChild(messageDiv);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    function getBotResponse(userInput) {
        const lcInput = userInput.toLowerCase();
        if (lcInput.includes('hello') || lcInput.includes('hi')) {
            return "Hi there! How can I assist you with your solar needs?";
        } else if (lcInput.includes('solar ai')) {
            return "SolarAI uses advanced satellite imagery and AI to determine the best placement for your solar panels, maximizing your energy generation.";
        } else if (lcInput.includes('pricing') || lcInput.includes('cost')) {
            return "Our pricing varies based on system size and your location. For a personalized quote, please sign up and provide your address.";
        } else if (lcInput.includes('subsidy') || lcInput.includes('subsidies')) {
            return "We help you find all eligible government subsidies! SolarPay automatically checks local and national schemes when you enter your details.";
        } else if (lcInput.includes('thank')) {
            return "You're welcome! Is there anything else I can help you with?";
        } else {
            return "I'm sorry, I'm not sure how to answer that. You can try asking about 'pricing', 'Solar AI', or 'subsidies'.";
        }
    }

    function handleSendMessage() {
        if(!chatbotInput || !chatbotBody) return;
        const userInput = chatbotInput.value.trim();
        if (userInput === '') return;

        addMessage(userInput, 'user');
        chatbotInput.value = '';

        setTimeout(() => {
            const botResponse = getBotResponse(userInput);
            addMessage(botResponse, 'bot');
        }, 1000);
    }

    if(chatbotSendBtn) chatbotSendBtn.addEventListener('click', handleSendMessage);
    if(chatbotInput) chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
});