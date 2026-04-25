const STORAGE_KEY = 'dailyFocusGoals';
const DATE_KEY = 'dailyFocusDate';
const PREV_DAY_KEY = 'previousDayGoals';

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

function renderGoals() {
    const goals = getGoals();
    goalsList.innerHTML = '';
    
    const completedCount = goals.filter(g => g.completed).length;
    goalsProgress.textContent = `${completedCount}/${goals.length}`;
    
    if (goals.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    goals.forEach((goal, index) => {
        const li = document.createElement('li');
        li.className = `goal-item${goal.completed ? ' completed' : ''}`;
        li.innerHTML = `
            <button class="goal-checkbox" data-index="${index}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 12l5 5L20 7"/>
                </svg>
            </button>
            <span class="goal-text">${escapeHtml(goal.text)}</span>
            <button class="goal-delete" data-index="${index}">
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
    goals.push({ text, completed: false });
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
    
    const completedCount = prevGoals.filter(g => g.completed).length;
    
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
    
    if (checkbox) {
        const index = parseInt(checkbox.dataset.index);
        toggleGoal(index);
    } else if (deleteBtn) {
        const index = parseInt(deleteBtn.dataset.index);
        deleteGoal(index);
    }
});

document.getElementById('dismissReview').addEventListener('click', dismissReview);

document.addEventListener('DOMContentLoaded', () => {
    checkForNewDay();
    renderGoals();
    renderReview();
    updateCountdown();
    setInterval(updateCountdown, 1000);
});