class Card {

    constructor(game, value) {
        this.game = game;
        this.value = value;
        this.status = 'close';

        this.$card = this.createCard();
        this.bindKeyEvents();
    }

    createCard() {
        const el = document.createElement('div');
        el.classList.add('card');
        el.classList.add('image');
        return el;
    }

    bindKeyEvents() {
        this.$card.addEventListener('click', () => this.clickOnCard());
    }

    clickOnCard() {
        if (this.game.getSelectedCard().length > 1) {
            this.game.closeSelectedCards();
        }

        switch (this.status) {
            case 'close':
                this.selectCard();
                break;
            case 'select':
                this.closeCard();
                break;
        }

        this.game.updateGame();
    }

    selectCard() {
        this.$card.classList.remove('image');
        this.$card.innerHTML = this.value;
        this.status = 'select';
    }

    closeCard() {
        this.$card.classList.add('image');
        this.$card.innerHTML = '';
        this.status = 'close';
    }

    openCard() {
        this.$card.classList.add('open');
        this.status = 'open';
    }

}

class Game {

    constructor() {
        this.$zone = document.querySelector('#game .elements');
        this.cards = [];
        this.createCards();
    }

    createCards() {
        this.generateCards();
        this.cards.sort(() => Math.random() - 0.5);
        this.cards.forEach(card => this.$zone.append(card.$card));
    }

    generateCards() {
        for (let i = 0; i < 8; i++) {
            const el = this.generateCard(this.random(0, 9));
            this.generateCard(el.value);
        }
    }

    generateCard(value) {
        const card = new Card(this, value);
        this.cards.push(card);
        return card;
    }

    random(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getSelectedCard() {
        return this.cards.filter(card => card.status === 'select');
    }

    getClosedCard() {
        return this.cards.filter(card => card.status === 'close');
    }

    closeSelectedCards() {
        this.getSelectedCard().forEach(card => card.closeCard());
    }

    openSelectedCard() {
        this.getSelectedCard().forEach(card => card.openCard());
    }

    updateGame() {
        if (this.getSelectedCard().length === 2 &&
            this.getSelectedCard()[0].value === this.getSelectedCard()[1].value) {
            this.openSelectedCard();
        }
        if (this.getClosedCard().length === 0 && confirm('Вы выиграли! Начать с начала?')) {
            this.newGame();
        }

    }

    newGame() {
        this.cards.forEach(card => card.$card.remove());
        this.cards = [];
        this.createCards();
    }

}

const game = new Game();
