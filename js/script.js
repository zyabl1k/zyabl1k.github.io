// Text

const Rules1 = "Правила игры";
const Rules2 = "При нажатии на кнопку ты получаешь загадку. У тебя будет 3 попытки написать правильный ответ. В случае правильного ответа ты получаешь приятные слова, если проиграешь, то загадка меняется.";

// Parse JSON
fetch('Photos.json')
    .then(response => response.json())
    .then(data => {
        const cards = data.photos.map(photo => `
            <div class="cards__single" onclick="flipCard(this)">
                <div class="cards__front">
                    <img class="cards__image" src="${photo.Url}" alt="Bon Iver album" />
                    <div class="text_holder">
                        <h1 class="cards__artist"><strong>${photo.FontTitle}</strong></h1>
                        <p class="cards__album">
                            ${photo.FrontText}
                        </p>
                    </div>
                </div>
                
                <div class="cards__back">
                    <h1><strong>${photo.BackTitle}</strong></h1>
                    <p class="cards__year">${photo.BackText}</p>
                </div>
            </div>
        `);

        document.getElementById('cardsHolder').innerHTML = cards.join('');
    });

// Flip Cards
function flipCard(card) {
    card.classList.toggle("flip");
}

// Modal
function openModal(header, content) {
    const modal = `
        <div class="modal" id="ModalWind">
            <div class="modalHolder">
                <div class="modalHeader">
                    <h1 style="font-size: 24px">${header}</h1>
                    <button onclick="closeModal()"><img width="20px" src="./assets/img/default/close.svg" alt="Close"></button>
                </div>
            <div class="modalContent">
                <p>
                    ${content}
                </p>
            </div>
        </div>
    </div>
    `
    document.body.innerHTML += modal;
}

function closeModal() {
    const modal = document.getElementById("ModalWind");
    document.body.removeChild(modal);
}

// Start Quest

const quest = document.getElementById("startQuest");
let lives = 3;
let RightAnswers = 0;
let QuestionsCount = 7;

let count = 0;

function renderQuest() {
    if(count >= QuestionsCount) {
        alert("Конец игры");
        closeGame();
        return;
    }
    fetch('Quest.json')
    .then(response => response.json())
    .then(data => {
        const question = data.questions[count];
        openModalQuest(question.question, question.answer);
    });
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function openModalQuest(content, answer) {
    const modal = `
        <div class="modal" id="ModalWind">
            <div class="modalHolder">
                <div class="modalHeader">
                    <h1 id="modalTitle" style="font-size: 24px">Жизни: </h1>
                    <h1 id="modalScore">Ты набрала ${RightAnswers} очков</h1>
                    <button onclick="closeModal()"><img width="20px" src="./assets/img/default/close.svg" alt="Close"></button>
                </div>
            <div class="modalContentQuest">
                <p id="Question">
                    ${content}  
                </p>
                <input id="answerInput">
                <button id="CheckAnswerBTN" onclick="takeAnswer('${answer}')" class="test">Проверить</button>
            </div>
        </div>
    </div>
    `
    document.body.innerHTML += modal;
    renderLives();
}

function takeAnswer(answer) {
    let input = document.getElementById("answerInput").value;

    if(input === answer) {
        RightAnswers++;
        document.getElementById('modalScore').textContent = `Ты набрала ${RightAnswers} очков`;
        let count = getRandomInt(QuestionsCount);
        fetch('Quest.json')
        .then(response => response.json())
        .then(data => {
            const prize = data.prizes[count];
            alert(`${prize.prize}`);
            rerenderQuest();
        });
    } else {
        alert("Ответ неверный, попробуй снова(")
        lives--;
        console.log(lives);
        renderLives();
    }
}

function rerenderQuest() {
    count++;
    document.getElementById('answerInput').value = '';
    fetch('Quest.json')
    .then(response => response.json())
    .then(data => {
        const question = data.questions[count];
        document.getElementById('Question').textContent = question.question;
        document.getElementById('CheckAnswerBTN').setAttribute('onclick', `takeAnswer('${question.answer}')`)
    });
}

function closeGame() {
    lives = 3;
    RightAnswers = 0;
    QuestionsCount = 7;
    closeModal();
}

function renderLives() {
    let haerts = document.getElementById('modalTitle');
    haerts.innerHTML = 'Жизни: ';
    if(lives === 0) {
        alert(`Ты проиграла, игра окончена, ты набрала ${RightAnswers} очков, ${RightAnswers > 5 ? 'ты была очень близко, горжусь!' : 'в следующий раз получится лучше!'}`)
        closeGame();
    }
    for (let i = 0; i < lives; i++) {
        haerts.innerHTML += `❤️`;
    }
}


