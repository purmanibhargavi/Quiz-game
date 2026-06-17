// Dataset containing Single Select, Multi-Select, and Fill-in-the-Blanks questions
const quizData = [
    {
        type: "single",
        question: "Which programming language is known as the 'backbone of web development'?",
        options: ["Python", "C++", "JavaScript", "PHP"],
        answer: 2 // Index of "JavaScript"
    },
    {
        type: "multi",
        question: "Select ALL frontend frameworks/libraries from the list below: (Select all that apply)",
        options: ["React", "Django", "Vue", "Laravel"],
        answer: [0, 2] // Indices of React and Vue
    },
    {
        type: "blank",
        question: "The 'M' in the popular stack acronym 'MERN' stands for __________.",
        answer: "MongoDB"
    }
];

let currentQuestionIndex = 0;
let score = 0;

// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const endScreen = document.getElementById('end-screen');
const startBtn = document.getElementById('start-btn');
const submitBtn = document.getElementById('submit-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const textInputContainer = document.getElementById('text-input-container');
const blankInput = document.getElementById('blank-input');
const progressText = document.getElementById('progress');
const scoreCounter = document.getElementById('score-counter');
const finalScoreText = document.getElementById('final-score-text');

// Event Listeners
startBtn.addEventListener('click', startQuiz);
submitBtn.addEventListener('click', evaluateAnswer);
nextBtn.addEventListener('click', loadNextQuestion);
restartBtn.addEventListener('click', resetQuiz);

function startQuiz() {
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    currentQuestionIndex = 0;
    score = 0;
    updateHeader();
    showQuestion();
}

function showQuestion() {
    submitBtn.classList.remove('hidden');
    nextBtn.classList.add('hidden');
    optionsContainer.innerHTML = '';
    blankInput.value = '';
    
    const currentQuestion = quizData[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;

    if (currentQuestion.type === "single" || currentQuestion.type === "multi") {
        optionsContainer.classList.remove('hidden');
        textInputContainer.classList.add('hidden');

        currentQuestion.options.forEach((option, index) => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('option-wrapper');

            const input = document.createElement('input');
            input.type = currentQuestion.type === "single" ? "radio" : "checkbox";
            input.name = "quiz-option";
            input.value = index;
            input.id = `option-${index}`;

            const label = document.createElement('label');
            label.htmlFor = `option-${index}`;
            label.textContent = option;
            label.style.cursor = 'pointer';
            label.style.width = '100%';

            wrapper.appendChild(input);
            wrapper.appendChild(label);
            
            // Allow clicking anywhere on the wrapper card to select
            wrapper.addEventListener('click', (e) => {
                if (e.target !== input) input.checked = !input.checked;
            });

            optionsContainer.appendChild(wrapper);
        });
    } else if (currentQuestion.type === "blank") {
        optionsContainer.classList.add('hidden');
        textInputContainer.classList.remove('hidden');
    }
}

function evaluateAnswer() {
    const currentQuestion = quizData[currentQuestionIndex];
    let isCorrect = false;

    if (currentQuestion.type === "single") {
        const selected = document.querySelector('input[name="quiz-option"]:checked');
        if (!selected) return alert("Please select an answer!");

        const selectedIndex = parseInt(selected.value);
        const wrappers = document.querySelectorAll('.option-wrapper');
        
        if (selectedIndex === currentQuestion.answer) {
            isCorrect = true;
            wrappers[selectedIndex].classList.add('correct');
        } else {
            wrappers[selectedIndex].classList.add('wrong');
            wrappers[currentQuestion.answer].classList.add('correct');
        }

    } else if (currentQuestion.type === "multi") {
        const selectedBoxes = document.querySelectorAll('input[name="quiz-option"]:checked');
        if (selectedBoxes.length === 0) return alert("Please select at least one answer!");

        const selectedIndices = Array.from(selectedBoxes).map(box => parseInt(box.value));
        const wrappers = document.querySelectorAll('.option-wrapper');
        
        // Check if selections precisely match correct answers array
        const matchesAll = currentQuestion.answer.every(ans => selectedIndices.includes(ans)) && 
                           selectedIndices.length === currentQuestion.answer.length;

        if (matchesAll) {
            isCorrect = true;
        }

        // Color-code all correct and selected choices
        wrappers.forEach((wrapper, idx) => {
            if (currentQuestion.answer.includes(idx)) {
                wrapper.classList.add('correct');
            } else if (selectedIndices.includes(idx)) {
                wrapper.classList.add('wrong');
            }
        });

    } else if (currentQuestion.type === "blank") {
        const userAnswer = blankInput.value.trim().toLowerCase();
        if (!userAnswer) return alert("Please type an answer!");

        if (userAnswer === currentQuestion.answer.toLowerCase()) {
            isCorrect = true;
            blankInput.style.borderColor = "var(--success-color)";
        } else {
            blankInput.style.borderColor = "var(--error-color)";
            alert(`Incorrect! The correct answer is: ${currentQuestion.answer}`);
        }
    }

    if (isCorrect) {
        score++;
    }

    updateHeader();
    submitBtn.classList.add('hidden');
    nextBtn.classList.remove('hidden');
}

function loadNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        updateHeader();
        showQuestion();
    } else {
        showEndScreen();
    }
}

function updateHeader() {
    progressText.textContent = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;
    scoreCounter.textContent = `Score: ${score}`;
}

function showEndScreen() {
    quizScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    finalScoreText.textContent = `You scored ${score} out of ${quizData.length}!`;
}

function resetQuiz() {
    endScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
}