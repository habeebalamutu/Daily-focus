const STORAGE_KEY = 'dailyFocusGoals';
const DATE_KEY = 'dailyFocusDate';
const PREV_DAY_KEY = 'previousDayGoals';
const THEME_KEY = 'dailyFocusTheme';

const quotes = [
    "The secret of getting ahead is getting started.",
    "Focus on being productive instead of busy.",
    "Small steps every day lead to big results.",
    "Your only limit is your mind.",
    "Done is better than perfect.",
    "The best time to start was yesterday. The next best time is now.",
    "Progress, not perfection.",
    "Dream big. Start small.",
    "You don't have to be great to start, but you have to start to be great.",
    "Every accomplishment starts with the decision to try.",
    "Success is the sum of small efforts repeated day in and day out.",
    "The way to get started is to quit talking and begin doing.",
    "Don't watch the clock; do what it does. Keep going.",
    "Believe you can and you're halfway there.",
    "It always seems impossible until it's done.",
    "The only way to do great work is to love what you do.",
    "Start where you are. Use what you have. Do what you can.",
    "Your limitation—it's only your imagination.",
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
    "Dream it. Wish it. Do it.",
    "Success doesn't just find you. You have to go out and get it.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Don't stop when you're tired. Stop when you're done.",
    "Wake up with determination. Go to bed with satisfaction.",
    "Do something today that your future self will thank you for.",
    "Little things make big days.",
    "It's going to be hard, but hard does not mean impossible.",
    "Don't wait for opportunity. Create it.",
    "Sometimes we're tested not to show our weaknesses, but to discover our strengths.",
    "The key to success is to focus on goals, not obstacles.",
    "In the middle of every difficulty lies opportunity.",
    "You are never too old to set another goal or to dream a new dream.",
    "Act as if what you do makes a difference. It does.",
    "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    "The best way to predict the future is to create it.",
    "Don't be afraid to give up the good to go for the great.",
    "I find that the harder I work, the more luck I seem to have.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "Nothing is impossible, the word itself says 'I'm possible'!",
    "The only limit to our realization of tomorrow is our doubts of today.",
    "It does not matter how slowly you go as long as you do not stop.",
    "Perseverance is not a long race; it is many short races one after the other.",
    "We generate fears while we sit. We overcome them by action.",
    "Either you run the day, or the day runs you.",
    "Begin to be now what you will be hereafter."
];

const goalInput = document.getElementById('goalInput');
const saveBtn = document.getElementById('saveBtn');
const goalsList = document.getElementById('goalsList');
const emptyState = document.getElementById('emptyState');
const goalsProgress = document.getElementById('goalsProgress');
const charCount = document.getElementById('charCount');
const dateDisplay = document.getElementById('dateDisplay');
const countdownTimer = document.getElementById('countdownTimer');
const countdown = document.getElementById('countdown');
const reviewSection = document.getElementById('reviewSection');
const reviewList = document.getElementById('reviewList');
const quoteDisplay = document.getElementById('quoteDisplay');
const themeToggle = document.getElementById('themeToggle');
const exportBtn = document.getElementById('exportBtn');

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const now = new Date();
dateDisplay.textContent = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

function getTodayKey() {
    return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
}

function getGoals() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveGoals(goals) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

function checkForNewDay() {
    const storedDate = localStorage.getItem(DATE_KEY);
    const todayKey = getTodayKey();
    const previousGoals = getGoals();
    
    if (storedDate && storedDate !== todayKey && previousGoals.length > 0) {
        localStorage.setItem(PREV_DAY_KEY, JSON.stringify(previousGoals));
    }
    
    localStorage.setItem(DATE_KEY, todayKey);
}

function getPreviousGoals() {
    return JSON.parse(localStorage.getItem(PREV_DAY_KEY) || '[]');
}

function clearPreviousGoals() {
    localStorage.removeItem(PREV_DAY_KEY);
}

function getDailyQuote() {
    const storedDate = localStorage.getItem(DATE_KEY);
    const todayKey = getTodayKey();
    
    if (storedDate === todayKey) {
        const savedQuote = localStorage.getItem('dailyQuote');
        if (savedQuote) return savedQuote;
    }
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    localStorage.setItem('dailyQuote', randomQuote);
    return randomQuote;
}

function renderQuote() {
    const quote = getDailyQuote();
    quoteDisplay.textContent = `"${quote}"`;
}

function applyTheme(dark) {
    if (dark) {
        document.documentElement.style.setProperty('--ink', '#f5f5f5');
        document.documentElement.style.setProperty('--paper', '#1a1a1a');
        document.documentElement.style.setProperty('--paper-dark', '#2a2a2a');
        document.documentElement.style.setProperty('--border', '#3a3a3a');
        document.documentElement.style.setProperty('--muted', '#888888');
        themeToggle.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
    } else {
        document.documentElement.style.setProperty('--ink', '#1a1a1a');
        document.documentElement.style.setProperty('--paper', '#faf9f7');
        document.documentElement.style.setProperty('--paper-dark', '#f0eeeb');
        document.documentElement.style.setProperty('--border', '#e0ddd8');
        document.documentElement.style.setProperty('--muted', '#8a8a8a');
        themeToggle.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    }
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
}

function isNightTime() {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6;
}

function applyAutoTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    // If user has manually set a theme, respect it; otherwise auto-detect
    if (savedTheme === 'light' || savedTheme === 'dark') {
        applyTheme(savedTheme === 'dark');
    } else {
        applyTheme(isNightTime());
    }
}

function toggleTheme() {
    const currentDark = document.documentElement.style.getPropertyValue('--paper') === '#1a1a1a';
    applyTheme(!currentDark);
}

function renderGoals() {
    let goals = getGoals();
    goalsList.innerHTML = '';
    
    const completedCount = goals.filter(g => g.completed).length;
    goalsProgress.textContent = `${completedCount}/${goals.length}`;
    
    if (goals.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    // Sort: uncompleted first, completed at bottom (create copy to preserve original indices)
    const sortedGoals = [...goals].sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
    });
    
    sortedGoals.forEach((goal, sortedIndex) => {
        // Find original index in the actual goals array
        const originalIndex = goals.indexOf(goal);
        const li = document.createElement('li');
        li.className = `goal-item${goal.completed ? ' completed' : ''}`;
        li.innerHTML = `
            <button class="goal-checkbox" data-index="${originalIndex}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 12l5 5L20 7"/>
                </svg>
            </button>
            <span class="goal-text">${escapeHtml(goal.text)}</span>
            <button class="goal-notes" data-index="${originalIndex}" title="Add notes">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
            </button>
            <button class="goal-delete" data-index="${originalIndex}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            </button>
        `;
        goalsList.appendChild(li);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function addGoal() {
    const text = goalInput.value.trim();
    if (!text) return;
    
    const goals = getGoals();
    goals.push({ text, completed: false, notes: '' });
    saveGoals(goals);
    
    goalInput.value = '';
    charCount.textContent = '0';
    renderGoals();
    goalInput.focus();
}

function toggleGoal(index) {
    const goals = getGoals();
    goals[index].completed = !goals[index].completed;
    saveGoals(goals);
    renderGoals();
}

function deleteGoal(index) {
    const goals = getGoals();
    goals.splice(index, 1);
    saveGoals(goals);
    renderGoals();
}

function showNotesModal(index) {
    const goals = getGoals();
    const goal = goals[index];
    const notes = goal.notes || '';
    const hasNotes = notes.trim().length > 0;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <span class="modal-title">Notes for: "${escapeHtml(goal.text)}"</span>
                <button class="modal-close">&times;</button>
            </div>
            <textarea class="modal-textarea" placeholder="Add notes...">${escapeHtml(notes)}</textarea>
            <button class="modal-save">${hasNotes ? 'Edit Notes' : 'Save Notes'}</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    const textarea = modal.querySelector('.modal-textarea');
    textarea.focus();
    
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-save').addEventListener('click', () => {
        goals[index].notes = textarea.value;
        saveGoals(goals);
        modal.remove();
    });
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

function exportGoals() {
    const goals = getGoals();
    
    if (goals.length === 0) {
        alert('No goals to export. Add some goals first!');
        return;
    }
    
    const date = dateDisplay.textContent;
    
    let content = `Daily Focus - ${date}\n`;
    content += `${'='.repeat(30)}\n\n`;
    
    goals.forEach((goal, i) => {
        const status = goal.completed ? '[✓]' : '[ ]';
        content += `${i + 1}. ${status} ${goal.text}\n`;
        if (goal.notes) {
            content += `   Notes: ${goal.notes}\n`;
        }
    });
    const completed = goals.filter(g => g.completed).length;
    content += `\nProgress: ${completed}/${goals.length} completed\n`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-focus-${getTodayKey()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

function updateCountdown() {
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    const diff = endOfDay - now;
    
    if (diff <= 0) {
        countdownTimer.textContent = '00:00:00';
        const currentGoals = getGoals();
        if (currentGoals.length > 0) {
            localStorage.setItem(PREV_DAY_KEY, JSON.stringify(currentGoals));
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        localStorage.setItem(DATE_KEY, getTodayKey());
        renderGoals();
        renderReview();
        return;
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    countdownTimer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (hours < 2) {
        countdown.classList.add('urgent');
    } else {
        countdown.classList.remove('urgent');
    }
}

function renderReview() {
    const prevGoals = getPreviousGoals();
    
    if (prevGoals.length === 0) {
        reviewSection.classList.remove('active');
        return;
    }
    
    reviewSection.classList.add('active');
    reviewList.innerHTML = '';
    
    prevGoals.forEach((goal, index) => {
        const li = document.createElement('li');
        li.className = `review-item${goal.completed ? ' completed' : ''}`;
        li.innerHTML = `
            <span class="review-status">${goal.completed ? '✓' : '✗'}</span>
            <span class="review-text">${escapeHtml(goal.text)}</span>
        `;
        reviewList.appendChild(li);
    });
}

function dismissReview() {
    clearPreviousGoals();
    reviewSection.classList.remove('active');
}

goalInput.addEventListener('input', () => {
    charCount.textContent = goalInput.value.length;
});

saveBtn.addEventListener('click', addGoal);
goalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addGoal();
});

goalsList.addEventListener('click', (e) => {
    const checkbox = e.target.closest('.goal-checkbox');
    const deleteBtn = e.target.closest('.goal-delete');
    const notesBtn = e.target.closest('.goal-notes');
    
    if (checkbox) {
        const index = parseInt(checkbox.dataset.index);
        toggleGoal(index);
    } else if (deleteBtn) {
        const index = parseInt(deleteBtn.dataset.index);
        deleteGoal(index);
    } else if (notesBtn) {
        const index = parseInt(notesBtn.dataset.index);
        showNotesModal(index);
    }
});

document.getElementById('dismissReview').addEventListener('click', dismissReview);
themeToggle.addEventListener('click', toggleTheme);
exportBtn.addEventListener('click', exportGoals);

document.addEventListener('DOMContentLoaded', () => {
    checkForNewDay();
    renderQuote();
    renderGoals();
    renderReview();
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    applyAutoTheme();
    
    // Check theme every minute for auto night/day switching
    setInterval(() => {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (!savedTheme || savedTheme === 'auto') {
            applyTheme(isNightTime());
        }
    }, 60000);
});

document.getElementById('dismissReview').addEventListener('click', dismissReview);