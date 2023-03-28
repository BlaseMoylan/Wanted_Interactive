var dataList;
function start(people){
    dataList=people
    // put functions here 
    welcome()
    // runSearch()
}
function welcome(){
    document.getElementById("userPrompt").innerHTML="Welcome to most wanted\n click the button to begin";
    document.getElementById("startText").innerHTML="Continue";
    document.getElementById("startButton").setAttribute("onclick","continueSearch()")

}
function continueSearch(){
    document.getElementById("start").parentNode.removeChild(document.getElementById("start"))
    runSearch()
}
function runSearch(){
    const searchResults = searchDataSet();
// come back later
    if (searchResults.length > 1) {
        displayPeople('Search Results', searchResults);
    }
    else if (searchResults.length === 1) {
        const person = searchResults[0];
        mainMenu(person);
    }
    else {
        alert('No one was found in the search.');
    }
}
function searchDataSet(){
    document.getElementById("userPrompt").innerHTML="Select search type.";
    let options=["id","name","traits"]
    for(let option in options){
        makeButton(options[option])
    }
    document.getElementById("id").addEventListener("click",()=>searchWithId())
    document.getElementById("name").addEventListener("click",()=>searchWithName())
    document.getElementById("traits").addEventListener("click",()=>searchWithTraits())
}

function makeButton(words){
    let test=document.createElement("BUTTON")
    test.setAttribute("id",words)
    let text=document.createElement("P")
    text.innerHTML=words
    test.appendChild(text)
    document.getElementById("buttonArea").appendChild(test)
    
}
function searchWithId(){
    console.log("chose id")
}
function searchWithName(){
    console.log("chose name")
}
function searchWithTraits(){
    console.log("chose Traits")
}