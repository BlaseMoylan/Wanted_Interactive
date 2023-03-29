var dataList;
var currentPerson;
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
    searchDataSet()
}
// function runSearch(){
//     const searchResults = searchDataSet();
// come back later
    // if (searchResults.length > 1) {
    //     displayPeople('Search Results', searchResults);
    // }
    // else if (searchResults.length === 1) {
    //     const person = searchResults[0];
    //     mainMenu(person);
    // }
    // else {
    //     alert('No one was found in the search.');
    // }

function directory(selection){
    switch(selection){
        case "id":
            searchWithId()
            break
        case "name":
            searchWithName()
            break
        case "traits":
            searchWithTraits()
            break
        case "search_ID":
            idSearchLogic()
            break
        case "search_Name":
            nameSearchLogic()
            break
        case "family":
            familySearchLogic()
            break
        case "descendants":
            let descendants=descendantSearch(currentPerson,dataList)
            deleteChildren("buttonArea")
            let options=["family","info","restart"]
            makeButton(options,"buttonArea")
            addListener(options)
            peopleResults("descendants",descendants)
            break
        case "restart":
            deleteChildren("buttonArea")
            searchDataSet()
            break
        case "info":
            deleteChildren("buttonArea")
            displayInfo(currentPerson)
            break
        default:
            searchTraitLogic(selection)
    }
}
function searchDataSet(){
    document.getElementById("userPrompt").innerHTML="Select search type.";
    let options=["id","name","traits"]
    makeButton(options,"buttonArea")
    addListener(options)
    debugger
   
}

function searchWithId(){
    console.log("chose id")
    deleteChildren("buttonArea")
    document.getElementById("userPrompt").innerHTML="Please enter the id of the person you want to search for.";
    makeSearchBar("searchText")
    makeButton(["search_ID"],"searchArea")
    addListener(["search_ID"])
}
function idSearchLogic(){
    let text=document.getElementById("searchText").value;
        let data=dataList.filter(d=>d.id==text)
        currentPerson=data[0]
        displayInfo(currentPerson)
        
}
function searchWithName(){
    console.log("chose name")
    deleteChildren("buttonArea")
    document.getElementById("userPrompt").innerHTML="Please enter the first and last name of the person you want to search for.";
    makeSearchBar("searchText")
    makeButton(["search_Name"],"searchArea")
    addListener(["search_Name"])
}
function nameSearchLogic(){
    let text=document.getElementById("searchText").value;
        let data=dataList.filter(d=>d.firstName+" "+d.lastName==text)
        currentPerson=data[0]
        displayInfo(currentPerson)
}
function findSpouse(person, people){
    let spouse = people.filter(p => person.currentSpouse == p.id).map(p =>{return {"firstName": p.firstName, "lastName": p.lastName, "relationship": "Spouse"}})
    return spouse
}

function findChild(person,people){
    let child=people.filter(p=>p.parents.includes(person.id)).map(p => {return {"firstName": p.firstName, "lastName": p.lastName, "relationship": "Child"}})
    return child
}

function findSibling(person,people){
    let siblings = people.filter(p =>(p.id != person.id && (person.parents.length > 0 ? p.parents.includes(person.parents[0]) : false || person.parents.length > 1 ? p.parents.includes(person.parents[1]) : false))).map(p=>{
        return {"firstName": p.firstName, "lastName": p.lastName, "relationship": "Sibling"}
    })
    return siblings
}

function findParent(person, people){
    let parent = people.filter(p => person.parents.includes(p.id)).map(p =>{return {"firstName": p.firstName, "lastName": p.lastName, "relationship": "Parent"}})
    return parent
}
function familySearchLogic(){
    let family = []
    family = family.concat(currentPerson.parents.length > 0 ? findParent(currentPerson, dataList) : [])
    family = family.concat(findChild(currentPerson,dataList))
    family = family.concat(currentPerson.currentSpouse != null ? findSpouse(currentPerson, dataList) : [])
    family = family.concat(findSibling(currentPerson, dataList))
    deleteChildren("buttonArea")
    let options=["info","descendants","restart"]
    makeButton(options,"buttonArea")
    addListener(options)
    peopleResults("family",family)
}
function descendantSearch(searchedPerson,people){
    let laterDescendants=[]
    let descendants = people.filter(person => {
        if(person.parents.includes(searchedPerson.id)){
            person.relationship="child"
            laterDescendants=descendantSearch(person,people)
            return true
        }})

    if(laterDescendants.length>0){
        for(person in laterDescendants){
            laterDescendants[person].relationship="Grand"+laterDescendants[person].relationship
        }
        descendants=descendants.concat(laterDescendants)
    }

    return descendants
}
function searchWithTraits(){
    let options=["gender","date of birth","height","weight","eyeColor","occupation", "done", "reset","restart"]
    deleteChildren("buttonArea")
    document.getElementById("userPrompt").innerHTML="select Trait to filter by."
    makeButton(options,"buttonArea")
    addListener(options)
}
function searchTraitLogic(selection){
    switch (selection){
        case "gender":
            

        case "data of Birth":

        case "hieght":

        case "weight":

        case "eyeColor":

        case "occupation":

        case "done":

        case"reset":
    }
        

}
function deleteChildren(parent){
    parent=document.getElementById(parent)
    while(parent.firstChild){
        parent.removeChild(parent.firstChild)
    }
}
function makeButton(words,parent){
    parent=document.getElementById(parent)
    for(let option in words){
        let test=document.createElement("BUTTON")
        test.setAttribute("id",words[option])
        test.setAttribute("class","button-style")
        let text=document.createElement("P")
        text.innerHTML=words[option]
        test.appendChild(text)
        parent.appendChild(test)
    }
    
}
function makeSearchBar(idName){
    let test=document.createElement("INPUT")
    test.setAttribute("id",idName)
    test.setAttribute("type","text")
    test.setAttribute("name","search")
    test.setAttribute("placeholder","type here...")
    document.getElementById("searchArea").appendChild(test)
}
function displayInfo(person){
    let personInfo = `Name: ${person.firstName} ${person.lastName}\nGender: ${person.gender}\nDate of Birth: ${person.dob}\nHeight: ${person.height}\nWeight: ${person.weight}\nEye Color: ${person.eyeColor}\nOccupation: ${person.occupation}`
    document.getElementById("userPrompt").innerHTML=personInfo
    deleteChildren("searchArea")
    let newOptions=["family","descendants","restart"]
    makeButton(newOptions,"buttonArea")
    addListener(newOptions)
}
function peopleResults(displayTitle, peopleToDisplay) {
    let formatedPeopleDisplayText
    if(peopleToDisplay.length == 0){
        formatedPeopleDisplayText = "None"
    }
    else if(peopleToDisplay[0].hasOwnProperty("relationship")){
        formatedPeopleDisplayText = peopleToDisplay.map(person => `${person.relationship}: ${person.firstName} ${person.lastName}`).join('\n');
    }
    else{
        formatedPeopleDisplayText = peopleToDisplay.map(person => `${person.firstName} ${person.lastName}`).join('\n');
    }
    document.getElementById("userPrompt").innerHTML=`${displayTitle}\n\n${formatedPeopleDisplayText}`;
}
function addListener(options){
    for(let option in options){
        document.getElementById(options[option]).addEventListener("click",()=>directory(options[option]))
    }
}