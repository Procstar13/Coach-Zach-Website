// Chat Widget Component for Coach Zach Soccer Training Website
// This file can be included in any page to add the chat functionality

class ChatWidget {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.lastSubmissionTime = 0;
        this.rateLimitMs = 30000; // 30 seconds
        this.sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
        this.sessionId = null;
        this.pollingInterval = null;
        
        this.init();
    }

    init() {
        this.createWidgetHTML();
        this.bindEvents();
        this.loadChatHistory();
        this.addWelcomeMessage();
        this.checkSessionTimeout();
        this.startPollingForUpdates();
    }

    createWidgetHTML() {
        // Create chat widget HTML
        const widgetHTML = `
            <div id="chat-widget" class="chat-widget">
                <!-- Chat Bubble -->
                <div id="chat-bubble" class="chat-bubble">
                    <span class="chat-icon">⚽</span>
                    <span class="chat-text">Text Coach Zach!</span>
                </div>

                <!-- Chat Interface -->
                <div id="chat-interface" class="chat-interface">
                    <!-- Chat Header -->
                    <div class="chat-header">
                        <div class="chat-title">
                            <span class="chat-icon">⚽</span>
                            <span>Coach Zach</span>
                        </div>
                        <button id="close-chat" class="close-btn">×</button>
                    </div>

                    <!-- Chat Messages -->
                    <div id="chat-messages" class="chat-messages">
                        <!-- Messages will be populated here -->
                    </div>

                    <!-- Chat Form -->
                    <div id="chat-form" class="chat-form">
                        <form id="lead-form">
                            <div class="form-group">
                                <label for="parent-name">Parent/Player Name *</label>
                                <input type="text" id="parent-name" name="parentName" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="player-age">Player Age *</label>
                                <input type="number" id="player-age" name="playerAge" min="3" max="18" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="inquiry-type">Inquiry Type *</label>
                                <select id="inquiry-type" name="inquiryType" required>
                                    <option value="">Select inquiry type</option>
                                    <option value="1-on-1 Training">1-on-1 Training</option>
                                    <option value="Group Training">Group Training</option>
                                    <option value="Pricing">Pricing</option>
                                    <option value="Skill Assessment">Skill Assessment</option>
                                    <option value="General Question">General Question</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="customer-phone">Your Phone Number (optional)</label>
                                <input type="tel" id="customer-phone" name="customerPhone" placeholder="(480) 555-1234">
                            </div>
                            
                            <div class="form-group">
                                <label for="message">Additional Message (optional)</label>
                                <textarea id="message" name="message" rows="2" placeholder="Tell me about your goals, experience level, or any specific questions..."></textarea>
                            </div>
                            
                            <div class="form-group checkbox-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="opt-in" name="optIn" required>
                                    <span class="checkmark"></span>
                                    I consent to receive SMS messages from Coach Zach regarding my soccer training inquiry. I understand that message and data rates may apply.
                                </label>
                            </div>
                            
                            <button type="submit" class="submit-btn">
                                <span class="btn-text">Send Message</span>
                                <span class="btn-loading" style="display: none;">Sending...</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        // Insert widget into the page
        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    bindEvents() {
        // Chat bubble click
        document.getElementById('chat-bubble').addEventListener('click', () => {
            this.toggleChat();
        });

        // Close button
        document.getElementById('close-chat').addEventListener('click', () => {
            this.closeChat();
        });

        // Form submission
        document.getElementById('lead-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });

        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.chat-widget')) {
                this.closeChat();
            }
        });

        // Prevent chat from closing when clicking inside
        document.querySelector('.chat-interface').addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.isOpen = true;
        document.getElementById('chat-interface').classList.add('open');
        document.getElementById('chat-bubble').style.display = 'none';
    }

    closeChat() {
        this.isOpen = false;
        document.getElementById('chat-interface').classList.remove('open');
        document.getElementById('chat-bubble').style.display = 'flex';
    }

    addWelcomeMessage() {
        const welcomeMessage = {
            id: 'welcome',
            from: 'coach',
            text: 'Hi 👋 I\'m Coach Zach. Before we connect, can you share a few quick details?',
            timestamp: new Date().toISOString()
        };
        this.messages.push(welcomeMessage);
        this.displayMessage(welcomeMessage);
    }

    async handleFormSubmission() {
        // Rate limiting
        const now = Date.now();
        if (now - this.lastSubmissionTime < this.rateLimitMs) {
            this.showError('Please wait a moment before sending another message.');
            return;
        }

        const form = document.getElementById('lead-form');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Validate required fields including opt-in
        if (!data.parentName || !data.playerAge || !data.inquiryType || !data.optIn) {
            this.showError('Please fill in all required fields and consent to receive SMS messages.');
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Add customer message to chat
            const customerMessage = {
                id: Date.now().toString(),
                from: 'customer',
                text: `Submitted: ${data.inquiryType} for ${data.parentName} (Age: ${data.playerAge})`,
                timestamp: new Date().toISOString()
            };
            this.messages.push(customerMessage);
            this.displayMessage(customerMessage);

            // Send SMS via API
            const response = await fetch('/api/send-sms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                this.showSuccess('✅ Message sent! Coach Zach will text you soon.');
                
                // Store session ID for updates
                if (result.sessionId) {
                    this.sessionId = result.sessionId;
                    this.saveChatHistory();
                }
                
                // Hide the form and show waiting message
                this.showWaitingState();
                form.reset();
            } else {
                throw new Error(result.error || 'Failed to send message');
            }

        } catch (error) {
            console.error('Submission error:', error);
            this.showError('Failed to send message. Please try again.');
        } finally {
            this.setLoadingState(false);
        }

        this.lastSubmissionTime = now;
    }

    showWaitingState() {
        const chatForm = document.getElementById('chat-form');
        chatForm.innerHTML = `
            <div class="waiting-state">
                <div class="waiting-icon">⏳</div>
                <h3>Message Sent!</h3>
                <p>Coach Zach has received your inquiry and will respond by text message soon.</p>
                <p><strong>Keep this chat open</strong> to see his replies in real-time!</p>
            </div>
        `;
    }

    setLoadingState(loading) {
        const submitBtn = document.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        if (loading) {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
        } else {
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message show';
        successDiv.textContent = message;
        
        const form = document.getElementById('lead-form');
        form.parentNode.insertBefore(successDiv, form);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    showError(message) {
        // For now, just log the error
        // You could add a more sophisticated error display
        console.error(message);
        alert(message);
    }

    displayMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.from}-message`;
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${message.text}</p>
            </div>
            <div class="message-time">${this.formatTime(message.timestamp)}</div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Play notification sound for coach messages
        if (message.from === 'coach' && message.id !== 'welcome') {
            this.playNotificationSound();
        }
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return date.toLocaleDateString();
    }

    playNotificationSound() {
        // Create a simple notification sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    }

    startPollingForUpdates() {
        // Poll for updates every 5 seconds
        this.pollingInterval = setInterval(async () => {
            if (this.sessionId) {
                await this.checkForUpdates();
            }
        }, 5000);
    }

    async checkForUpdates() {
        try {
            const response = await fetch(`/api/chat-session?sessionId=${this.sessionId}`);
            if (response.ok) {
                const result = await response.json();
                if (result.success && result.session) {
                    // Check if there are new messages
                    const newMessages = result.session.messages.filter(msg => 
                        !this.messages.find(existing => existing.id === msg.id)
                    );
                    
                    // Add new messages to the chat
                    newMessages.forEach(message => {
                        this.messages.push(message);
                        this.displayMessage(message);
                    });
                    
                    if (newMessages.length > 0) {
                        this.saveChatHistory();
                    }
                }
            }
        } catch (error) {
            console.error('Error checking for updates:', error);
        }
    }

    saveChatHistory() {
        try {
            const chatData = {
                messages: this.messages,
                sessionId: this.sessionId,
                timestamp: Date.now()
            };
            sessionStorage.setItem('chatHistory', JSON.stringify(chatData));
        } catch (error) {
            console.error('Failed to save chat history:', error);
        }
    }

    loadChatHistory() {
        try {
            const saved = sessionStorage.getItem('chatHistory');
            if (saved) {
                const chatData = JSON.parse(saved);
                
                // Check if session is still valid (24 hours)
                if (Date.now() - chatData.timestamp < this.sessionTimeout) {
                    this.messages = chatData.messages;
                    this.sessionId = chatData.sessionId;
                    
                    // Clear existing messages and redisplay
                    document.getElementById('chat-messages').innerHTML = '';
                    this.messages.forEach(msg => this.displayMessage(msg));
                    
                    // If we have a session ID, show waiting state
                    if (this.sessionId) {
                        this.showWaitingState();
                    }
                } else {
                    // Session expired, clear storage
                    sessionStorage.removeItem('chatHistory');
                }
            }
        } catch (error) {
            console.error('Failed to load chat history:', error);
        }
    }

    checkSessionTimeout() {
        // Check for expired sessions every hour
        setInterval(() => {
            const saved = sessionStorage.getItem('chatHistory');
            if (saved) {
                try {
                    const chatData = JSON.parse(saved);
                    if (Date.now() - chatData.timestamp >= this.sessionTimeout) {
                        sessionStorage.removeItem('chatHistory');
                        console.log('Chat session expired and cleared');
                    }
                } catch (error) {
                    console.error('Error checking session timeout:', error);
                }
            }
        }, 60 * 60 * 1000); // Check every hour
    }

    // Method to add incoming messages from webhook
    addIncomingMessage(text) {
        const message = {
            id: Date.now().toString(),
            from: 'coach',
            text: text,
            timestamp: new Date().toISOString()
        };
        this.messages.push(message);
        this.displayMessage(message);
        this.saveChatHistory();
    }

    // Cleanup method
    destroy() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.chatWidget = new ChatWidget();
    });
} else {
    window.chatWidget = new ChatWidget();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatWidget;
}
