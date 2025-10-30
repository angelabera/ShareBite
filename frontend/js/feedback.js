// Feedback Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const feedbackForm = document.getElementById('feedback-form');
    
    // Helper function to get current theme for SweetAlert2
    const getSwalTheme = () => {
        const isDark = document.body.classList.contains('dark-mode');
        return {
            background: isDark ? '#1f2937' : '#ffffff',
            color: isDark ? '#f9fafb' : '#1f2937',
            backdrop: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.4)'
        };
    };
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('feedback-name').value;
            const email = document.getElementById('feedback-email').value;
            const type = document.getElementById('feedback-type').value;
            const subject = document.getElementById('feedback-subject').value;
            const message = document.getElementById('feedback-message').value;
            
            // Validate form
            if (!name || !email || !type || !subject || !message) {
                const theme = getSwalTheme();
                Swal.fire({
                    icon: 'error',
                    title: 'Missing Information',
                    text: 'Please fill in all fields',
                    confirmButtonColor: '#0080ff',
                    background: theme.background,
                    color: theme.color,
                    backdrop: theme.backdrop
                });
                return;
            }
            
            // Prepare feedback data
            const feedbackData = {
                name: name,
                email: email,
                type: type,
                subject: subject,
                message: message,
                timestamp: new Date().toISOString()
            };
            
            try {
                // Show loading state
                const theme = getSwalTheme();
                Swal.fire({
                    title: 'Submitting Feedback...',
                    text: 'Please wait',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    background: theme.background,
                    color: theme.color,
                    backdrop: theme.backdrop,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                
                // Store feedback locally (in a real app, this would be sent to a server)
                const existingFeedback = JSON.parse(localStorage.getItem('sharebite_feedback') || '[]');
                existingFeedback.push(feedbackData);
                localStorage.setItem('sharebite_feedback', JSON.stringify(existingFeedback));
                
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                Swal.fire({
                    icon: 'success',
                    title: 'Thank You!',
                    html: `
                        <p>Your feedback has been submitted successfully.</p>
                        <p>We appreciate you taking the time to help us improve ShareBite!</p>
                    `,
                    confirmButtonColor: '#0080ff',
                    confirmButtonText: 'Great!',
                    background: theme.background,
                    color: theme.color,
                    backdrop: theme.backdrop
                });
                
                // Reset form
                feedbackForm.reset();
                
                // Optional: Send email notification (would require backend implementation)
                console.log('Feedback submitted:', feedbackData);
                
            } catch (error) {
                console.error('Error submitting feedback:', error);
                const theme = getSwalTheme();
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed',
                    text: 'There was an error submitting your feedback. Please try again later.',
                    confirmButtonColor: '#0080ff',
                    background: theme.background,
                    color: theme.color,
                    backdrop: theme.backdrop
                });
            }
        });
    }
    
    // Add animation to feedback type select
    const feedbackType = document.getElementById('feedback-type');
    if (feedbackType) {
        feedbackType.addEventListener('change', function() {
            this.style.transform = 'scale(1.02)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    }
    
    // Character counter for textarea
    const feedbackMessage = document.getElementById('feedback-message');
    if (feedbackMessage) {
        const counterDiv = document.createElement('div');
        counterDiv.className = 'character-counter';
        const isDark = document.body.classList.contains('dark-mode');
        const defaultColor = isDark ? 'rgba(255, 255, 255, 0.5)' : '#9E9E9E';
        counterDiv.style.cssText = `text-align: right; font-size: 0.85rem; color: ${defaultColor}; margin-top: -0.8rem; margin-bottom: 1rem;`;
        feedbackMessage.parentNode.insertBefore(counterDiv, feedbackMessage.nextSibling);
        
        feedbackMessage.addEventListener('input', function() {
            const length = this.value.length;
            const maxLength = 1000;
            counterDiv.textContent = `${length} / ${maxLength} characters`;
            
            if (length > maxLength) {
                counterDiv.style.color = '#ff4444';
                this.value = this.value.substring(0, maxLength);
            } else if (length > maxLength * 0.9) {
                counterDiv.style.color = '#ff9800';
            } else {
                const isDark = document.body.classList.contains('dark-mode');
                counterDiv.style.color = isDark ? 'rgba(255, 255, 255, 0.5)' : '#9E9E9E';
            }
        });
    }
});

// Export function to get all feedback (for admin panel in future)
function getAllFeedback() {
    return JSON.parse(localStorage.getItem('sharebite_feedback') || '[]');
}

// Export function to clear feedback (for testing)
function clearAllFeedback() {
    localStorage.removeItem('sharebite_feedback');
    console.log('All feedback cleared');
}

