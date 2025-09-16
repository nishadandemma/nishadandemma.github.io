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
        this.detail = "";
        this.groupsTaken = [];
        this.g = [];
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
        if (this.arraysAreEqual(currGrouping, this.group1, 1)) {
            this.category = this.group1.category;
            this.color = this.group1.color;
            this.detail = this.group1.detail;
            this.groupsTaken.push(this.group1)
            this.result = "right";
        } else if (this.arraysAreEqual(currGrouping, this.group2, 2)) {
            this.category = this.group2.category;
            this.color = this.group2.color;
            this.detail = this.group2.detail;
            this.groupsTaken.push(this.group2)
            this.result = "right";
        } else if (this.arraysAreEqual(currGrouping, this.group3, 3)) {
            this.category = this.group3.category;
            this.color = this.group3.color;
            this.detail = this.group3.detail;
            this.groupsTaken.push(this.group3)
            this.result = "right";      
        } else if (this.arraysAreEqual(currGrouping, this.group4, 4)) {
            this.category = this.group4.category;
            this.color = this.group4.color;
            this.detail = this.group4.detail;
            this.groupsTaken.push(this.group4)
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
        //this.setOutcome();
    }

    arraysAreEqual(arr1, arr2, group) {
        const aValues = [];

        for (let i = 0; i < arr1.length; i++) {
            aValues.push(arr1[i].word);
            if (arr2.includes(arr1[i].word) ) {
                this.g[i] = group;
            }
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
        return [this.category, this.color, this.detail]
    }

    setOutcome (chancesLeft) {
        if (this.outcome !== "playing") return
        if (this.current === 4)
            this.outcome = "win";
        else if (chancesLeft < 0)
            this.outcome = "lose"
    }

    isThree () {
        let g1 = this.g[0];
        let g2 = null;
        let g1count = 1;
        let g2count = 0;
        for (let i = 1; i < 4; i++) {
            if (this.g[i] === g1) {g1count += 1}
            else if (this.g[i] === g2) {g2count += 1}
            else {
                g2 = this.g[i];
            }
        }
        // console.log(this.g)
        // console.log(g1)
        // console.log(g1count)
        // console.log(g2)
        // console.log(g2count)
        if (g1count === 3 || g2count === 3) {return true}
        else {return false}
    }

}