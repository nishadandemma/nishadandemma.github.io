export default class ConnectionsHelper {// extends Phaser.Scene {
    constructor(group1, group2, group3, group4) {
      //  super('WordleHelper');
        this.group1 = group1.sort();
        this.group2 = group2.sort();
        this.group3 = group3.sort();
        this.group4 = group4.sort();
        //this.scene = scene;
        this.length = this.group1.length
        this.current = 0;
        this.outcome = "playing";
        this.move2Group = [];
        this.move_out = [];
        this.result = ""
        this.init();
        this.category = "";
        this.color = "";
    }

    init () { 
        this.status = [];
        for (let i = 0; i < this.length; i++) {
            let row = Array(this.length).fill({status: ""});
            this.status.push(row);
        }
    }

    guess(grouping, realBoxes) {
        let currGrouping = grouping//.sort();//input will be box objects, will need to turn this reference to text only
        let boxes = realBoxes;
        if (this.arraysAreEqual(currGrouping, this.group1)) {
            this.category = this.group1.category;
            this.color = this.group1.color;
            this.result = "right";
        } else if (this.arraysAreEqual(currGrouping, this.group2)) {
            this.category = this.group2.category;
            this.color = this.group2.color;
            this.result = "right";
        } else if (this.arraysAreEqual(currGrouping, this.group3)) {
            this.category = this.group3.category;
            this.color = this.group3.color;
            this.result = "right";      
        } else if (this.arraysAreEqual(currGrouping, this.group4)) {
            this.category = this.group4.category;
            this.color = this.group4.color;
            this.result = "right";     
        } else {
            this.result = "wrong"
        }
        if (this.result === "right") {
            for (let i = 0; i < this.length; i++) {
                for (let j = 0; j < this.length; j++) {
                    if (i === this.current) {
                        if (currGrouping.includes(boxes[i][j])) {
                            this.status[i][j] = {status: "keep"};
                        }
                        else {
                            this.status[i][j] = {status: "move_out"}
                            this.move_out.push(boxes[i][j])
                        }
                    }
                    else if (i > this.current) {
                        if (currGrouping.includes(boxes[i][j])) {
                            this.status[i][j] = {status: "move2group"}
                            this.move2Group.push(boxes[i][j])
                        }
                        else {
                            this.status[i][j] = {status: "keep"}
                        }
                    }
                }
            }
        this.current += 1;
        }
    }

    arraysAreEqual(arr1, arr2) {
        const aValues = [];

        for (let i = 0; i < arr1.length; i++) {
            aValues.push(arr1[i].word);
        }
        return JSON.stringify(aValues.sort()) === JSON.stringify(arr2);
    }

    currentGroupLine() {
        return this.current;
    }

    currentResult() {
        return this.result;//[this.current];
    }

    currentMove2Group() {
        return this.move2Group;
    }

    currentMove_Out() {
        return this.move_out;
    }

    clearUp() {
        this.move2Group = [];
        this.move_out = []
    }

    returnWinnerGroup() {
        return [this.category, this.color]
    }

    setOutcome() {


    }
}