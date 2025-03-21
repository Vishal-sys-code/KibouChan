// KibouChan - Mental Health App
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const journalText = document.getElementById('journal-text');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultSection = document.getElementById('result-section');
    const emotionResult = document.getElementById('emotion-result');
    const suggestionText = document.getElementById('suggestion-text');
    const emotionIcon = document.getElementById('emotion-icon');
    const saveBtn = document.getElementById('save-btn');
    const resetBtn = document.getElementById('reset-btn');
    const viewHistoryBtn = document.getElementById('view-history-btn');
    const historyContainer = document.getElementById('history-container');
    const timelineContainer = document.getElementById('timeline-container');

    // Current emotion data
    let currentEmotion = null;

    // Emotion Icons Map
    const emotionIcons = {
        'joy': '<i class="fas fa-smile-beam"></i>',
        'sadness': '<i class="fas fa-sad-tear"></i>',
        'anger': '<i class="fas fa-angry"></i>',
        'optimism': '<i class="fas fa-smile"></i>',
        'default': '<i class="fas fa-smile"></i>'
    };

    // Get background color based on emotion
    const getEmotionColor = (emotion) => {
        const colors = {
            'joy': '#ffd166',
            'sadness': '#118ab2',
            'anger': '#ef476f',
            'optimism': '#06d6a0'
        };
        return colors[emotion] || '#ffb6e1';
    };

    // Event Listeners
    analyzeBtn.addEventListener('click', analyzeEmotion);
    saveBtn.addEventListener('click', saveJournalEntry);
    resetBtn.addEventListener('click', resetForm);
    viewHistoryBtn.addEventListener('click', toggleHistory);

    // Functions
    async function analyzeEmotion() {
        const text = journalText.value.trim();
        
        if (!text) {
            alert('Please write something about how you feel first.');
            return;
        }
        
        try {
            // Show loading state
            analyzeBtn.textContent = 'Analyzing...';
            analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
            analyzeBtn.disabled = true;
            
            // Create form data
            const formData = new FormData();
            formData.append('text', text);
            
            // Send to API
            const response = await fetch('/predict', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Failed to analyze emotion');
            }
            
            const data = await response.json();
            
            // Update UI with results
            emotionResult.textContent = data.emotion;
            suggestionText.textContent = data.suggestion;
            currentEmotion = data.emotion;
            
            // Update emotion icon
            emotionIcon.innerHTML = emotionIcons[currentEmotion] || emotionIcons.default;
            emotionIcon.style.backgroundColor = getEmotionColor(currentEmotion);
            
            // Show results section
            resultSection.classList.remove('hidden');
            
            // Reset button state
            analyzeBtn.innerHTML = '<i class="fas fa-search-heart"></i> Analyze My Feelings';
            analyzeBtn.disabled = false;
            
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error analyzing your emotion. Please try again.');
            
            // Reset button state
            analyzeBtn.innerHTML = '<i class="fas fa-search-heart"></i> Analyze My Feelings';
            analyzeBtn.disabled = false;
        }
    }
    
    async function saveJournalEntry() {
        const text = journalText.value.trim();
        
        if (!text || !currentEmotion) {
            alert('Something went wrong. Please try analyzing your emotion again.');
            return;
        }
        
        try {
            // Show loading state
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            saveBtn.disabled = true;
            
            // Create form data
            const formData = new FormData();
            formData.append('text', text);
            
            // Send to API
            const response = await fetch('/journal', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Failed to save journal entry');
            }
            
            const data = await response.json();
            
            // Show success message
            alert('Your journal entry has been saved!');
            
            // Reset form
            resetForm();
            
            // Reset button state
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Save to Journal';
            saveBtn.disabled = false;
            
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error saving your journal entry. Please try again.');
            
            // Reset button state
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Save to Journal';
            saveBtn.disabled = false;
        }
    }
    
    function resetForm() {
        journalText.value = '';
        resultSection.classList.add('hidden');
        currentEmotion = null;
    }
    
    async function toggleHistory() {
        if (historyContainer.classList.contains('hidden')) {
            // Show history
            historyContainer.classList.remove('hidden');
            viewHistoryBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Hide History';
            
            // Load history data
            await loadHistoryData();
        } else {
            // Hide history
            historyContainer.classList.add('hidden');
            viewHistoryBtn.innerHTML = '<i class="fas fa-history"></i> View History';
        }
    }
    
    async function loadHistoryData() {
        try {
            // Show loading state
            timelineContainer.innerHTML = '<p class="empty-state"><i class="fas fa-spinner fa-spin"></i> Loading your history...</p>';
            
            // Fetch history data
            const response = await fetch('/history');
            
            if (!response.ok) {
                throw new Error('Failed to fetch history');
            }
            
            const data = await response.json();
            
            // Display history data
            if (data.entries && data.entries.length > 0) {
                renderTimeline(data.entries);
            } else {
                timelineContainer.innerHTML = '<p class="empty-state">No entries yet. Start by sharing how you feel!</p>';
            }
            
        } catch (error) {
            console.error('Error:', error);
            timelineContainer.innerHTML = '<p class="empty-state">There was an error loading your history. Please try again.</p>';
        }
    }
    
    function renderTimeline(entries) {
        timelineContainer.innerHTML = '';
        
        entries.forEach(entry => {
            // Format date
            const date = new Date(entry.timestamp);
            const formattedDate = date.toLocaleString();
            
            // Get emotion icon
            const icon = emotionIcons[entry.emotion] || emotionIcons.default;
            
            // Create timeline item
            const timelineItem = document.createElement('div');
            timelineItem.className = `timeline-item ${entry.emotion}`;
            
            // Create timeline content
            timelineItem.innerHTML = `
                <div class="timeline-date">${formattedDate}</div>
                <span class="timeline-emotion ${entry.emotion}">${icon} ${entry.emotion}</span>
                <p class="timeline-text">${entry.text}</p>
            `;
            
            // Add to container
            timelineContainer.appendChild(timelineItem);
        });
    }
}); 