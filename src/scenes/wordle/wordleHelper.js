// "Every great game begins with a single scene. Let's make this one unforgettable!"
export default class WordleHelper {// extends Phaser.Scene {
    constructor(word, attempts = 6) {
      //  super('WordleHelper');

        this.word = word.toLowerCase();
        this.length = word.length;
        this.attempts = attempts;
        this.current = 0;
        this.outcome = "playing";

        this.init();
    }
//
    init () { 
        this.status = [];

        for (let i = 0; i < this.attempts; i++) {
            let row = Array(this.length).fill({letter: "", color: ""});
            this.status.push(row);
        }

    }

    guess(word) {
        this.nope = this.word.split("");
        this.matches = [];
        this.taken = [];
        for (let i = 0; i < this.length; i++) {
            if (word.includes(this.word[i])) {
                this.matches.push(this.word[i]);
            }
        }
        for (let i = 0; i < this.length; i++) {
            let currentChar = word.charAt(i).toLowerCase();
            if (this.isSameCharacter(currentChar, i)) {
                if (!this.taken.includes(i)) {
                    this.removeFromNope(currentChar)
                    this.taken.push(i);
                }

                this.status[this.current][i] = {letter: currentChar, color: 0x00ff00 };
            } 
        }

        for (let i = 0; i < this.length; i++) {
            let currentChar = word.charAt(i).toLowerCase();
            if (this.isSomeWhereElse(currentChar) && this.matches.includes(currentChar)) {
                this.status[this.current][i] = {letter: currentChar, color: 0xffa500 };
                this.matches.splice(this.matches.indexOf(currentChar), 1);
            }
            else if (!this.taken.includes(i))
                this.status[this.current][i] = {letter: currentChar, color: 0xcccccc };
        }
        this.setOutcome()
    }

    next () {
        if (this.current < this.attempts)
            this.current++;
    }

    setOutcome () {
        if (this.nope.length === 0)
            this.outcome = "win";
        else if (this.current+1 === this.attempts)
            this.outcome = "lose"
    }

    wrong () {
       for (let i = 0; i < this.length; i++) {
            this.status[this.current][i].setTween();

       } 
    }

    removeFromNope(char) {
        this.nope.splice(this.nope.indexOf(char), 1)
    }

    isSameCharacter (char, i) {
        return char === this.word.charAt(i);
    }

    isSomeWhereElse(char) {
        return this.nope.includes(char)
    }

    reset () {
        this.current--;
        this.status[this.current] = Array(this.length).fill({letter: "", color: ""});
    }

    currentStatus() {
        return this.status[this.current];
    }

}
