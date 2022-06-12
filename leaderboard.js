const request = require("request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");
const xlsx = require("json-as-xlsx")

const link =
  "https://www.espncricinfo.com/series/ipl-2021-1249214/match-results";

let leaderBoard = [];
let counter = 0;
request(link, cb);

function cb(error, response, html) {
  if (error) {
    console.log(error);
  } else {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    let allScorecardTags = document.querySelectorAll(
      ".ds-flex.ds-mx-4.ds-pt-2.ds-pb-3.ds-space-x-4.ds-border-t.ds-border-line-default-translucent a "
    );

    let count = 0;
    for (let i = 0; i < allScorecardTags.length; i++) {
      if (i % 4 == 2) {
        // console.log(allScorecardTags[i].href);
        count++;
        let link = allScorecardTags[i].href;
        // since domain name is missing we can add domain name to it
        let completeLink = "https://www.espncricinfo.com" + link;
        // console.log(completeLink);
        request(completeLink, cb2);
        counter++;
      }
    }
    // leaderBoard will be empty here as well
    // console.log("Line 36 ", leaderBoard);

    // console.log(allScorecardTags.length);
    console.log(count);
  }
}

function cb2(error, response, html) {
  if (error) {
    console.log(error);
  } else {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    let batmanRow = document.querySelectorAll(
      ".ds-border-b.ds-border-line.ds-text-tight-s "
    );
    for (let i = 0; i < batmanRow.length; i++) {
      let cells = batmanRow[i].querySelectorAll("td");
      if (cells.length == 8) {
        let name = cells[0].textContent;
        let runs = cells[2].textContent;
        let balls = cells[3].textContent;
        let fours = cells[5].textContent;
        let sixes = cells[6].textContent;
        // console.log(
        //   "Name : ",
        //   name,
        //   " runs: ",
        //   runs,
        //   " balls : ",
        //   balls,
        //   " four : ",
        //   fours,
        //   " sixes : ",
        //   sixes
        // );
        processPlayer(name, runs, balls, fours, sixes);
      }
    }
    // This will print updated leaderBoard every times
    counter--;
    // console.log("Line 76 ", counter);
    if (counter == 0) {
      console.log("Line 76 ", leaderBoard);
      let data = JSON.stringify(leaderBoard);
      fs.writeFileSync("BatsmenStats2.json", data);
  

let dataExcel = [
  {
    sheet: "Adults",
    columns: [
      { label: "Name", value: "Name" },
      { label: "Innings", value: "Innings" }, // Top level data
      { label: "Runs", value: "Runs"}, // Custom format
      { label: "Balls", value: "Balls" },
      { label: "Fours", value: "Fours" },
      { label: "Sixes", value: "Sixes" }, // Run functions
    ],
    content: leaderBoard
  },
  
]

let settings = {
  fileName: "CricketScoreInfo", // Name of the resulting spreadsheet
  extraLength: 2, // A bigger number means that columns will be wider
  writeOptions: {}, // Style options from https://github.com/SheetJS/sheetjs#writing-options
}

xlsx(dataExcel, settings) // Will download the excel file
    }
  }
}

// processPlayer("Rohit", "10", "4", "2", "4");
// processPlayer("Rohit", "10", "4", "2", "4");
// processPlayer("virat", "10", "4", "2", "4");
// processPlayer("virat", "10", "4", "2", "4");
// processPlayer("Rohit","10","4",'2','4','0');
console.log(leaderBoard);
function processPlayer(name, runs, balls, fours, sixes) {
  runs = Number(runs);
  balls = Number(balls);
  fours = Number(fours);
  sixes = Number(sixes);
  for (let i = 0; i < leaderBoard.length; i++) {
    let playerObj = leaderBoard[i];
    if (playerObj.Name == name) {
      playerObj.Runs += runs;
      playerObj.Innings += 1;
      playerObj.Balls += balls;
      playerObj.Fours += fours;
      playerObj.Sixes += sixes;
      return;
    }
  }

  let obj = {
    Name: name,
    Innings: 1,
    Runs: runs,
    Balls: balls,
    Fours: fours,
    Sixes: sixes,
  };
  leaderBoard.push(obj);
}

// console.log("Line 111 : ", leaderBoard);
// All tr
// .ds-border-b.ds-border-line.ds-text-tight-s
