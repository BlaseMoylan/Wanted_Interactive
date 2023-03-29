var dataList;
var currentPerson;
var usedFilter = [];

//----------Starting Logic----------//

function start(people){
    dataList=people
    welcome()
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

function searchDataSet(){
    document.getElementById("userPrompt").innerHTML="Select search type.";
    let options=["id","name","traits"]
    makeButton(options,"buttonArea")
    addListener(options)
}

//----------Button Function Directory----------//

function directory(selection){
    switch(selection){
        case "id":
            searchWithId()
            break
        case "name":
            searchWithName()
            break
        case "traits":
            usedFilter = []
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
            traitDirectory(selection)
    }
}

//----------ID Logic----------//

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
    // if(data.length>0){
    //     document.getElementById("userPrompt").innerHTML="Please enter the id of the person you want to search for.";
    // }
    // currentPerson=data[0]
    displayInfo(currentPerson)
}

//----------Name Logic----------//

function searchWithName(){
    console.log("chose name")
    deleteChildren("buttonArea")
    document.getElementById("userPrompt").innerHTML="Please enter the first and last name of the person you want to search for.";
    makeSearchBar("searchText")
    makeButton(["search_Name"],"searchArea")
    addListener(["search_Name"])
}

function nameSearchLogic(){
    let text=document.getElementById("searchText").value.toLowerCase();
    let data=dataList.filter(d=>(d.firstName+" "+d.lastName).toLowerCase()==text)
    currentPerson=data[0]
    displayInfo(currentPerson)
}

//----------Family search Logic----------//

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

//----------Descendant Search Logic----------//

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

//----------Trait Logic----------//

function searchWithTraits(filterList = []){
    let options=["gender","date of birth","height","weight","eyeColor","occupation", "reset","restart"]
    deleteChildren("buttonArea")
    let message = "select Trait to filter by."
    if(filterList.length>0){
        document.getElementById("userPrompt").innerHTML = ""
        let people = filterList.map(p=>p.firstName+" "+p.lastName)
        for(let person in people){
            let parent = document.getElementById("userPrompt")
            let personButton = document.createElement("BUTTON")
            personButton.addEventListener("click", () => sendToInfo(people[person]))
            personButton.setAttribute("class","button-style-people")
            let text=document.createElement("P")
            text.innerHTML=people[person]
            personButton.appendChild(text)
            parent.appendChild(personButton)
        }
        let message = document.createElement("P")
        message.innerHTML = "select Trait to filter by."
        document.getElementById("userPrompt").appendChild(message)
    }
    else{
        document.getElementById("userPrompt").innerHTML = message
    }
    makeButton(options,"buttonArea")
    checkforUsedButtons()
    addListener(options)
}

function sendToInfo(person){
    currentPerson = dataList.filter(p=>p.firstName+" "+p.lastName == person)[0]
    deleteChildren("buttonArea")
    displayInfo(currentPerson)
}

function checkforUsedButtons(){
    for(let used in usedFilter){
        document.getElementById(usedFilter[used][0]).disabled = true
    }
}

function traitDirectory(selection){
    switch(selection){
        case "submit":
            let radioButtons = document.querySelectorAll('input[name="filter"]')
            result = filterList(radioButtons)
            deleteChildren("radioArea")
            searchWithTraits(result)
            break
        case "back":
            deleteChildren("radioArea")
            usedFilter.pop()
            searchWithTraits()
            break
        case "reset":
            usedFilter = []
            searchWithTraits()
            break
        default:
            searchTraitLogic(selection)
    }
}

function filterList(radioButtons){
    for(let selection in radioButtons){
        if(radioButtons[selection].checked){
            for(let filter in usedFilter)
                if(usedFilter[filter].length<2){
                    usedFilter[filter].push(radioButtons[selection].value)
                }
        }
    }

    let filterList = [...dataList]
    if(usedFilter.length>0){
        for(let used in usedFilter){
            filterList = filterList.filter(p => p[usedFilter[used][0]]==usedFilter[used][1])
        }
    }
    return filterList
}

function searchTraitLogic(selection){
    usedFilter.push([selection])
    let options=dataList.map(person=>person[selection]).filter(function(value,index,filterMappedArray){return filterMappedArray.indexOf(value) === index})

    deleteChildren("buttonArea")
    document.getElementById("userPrompt").innerHTML = "Select option to filter by."
    makeRadioButton(options,"radioArea")
    let buttonMenu = ["submit", "back"]
    makeButton(buttonMenu, "buttonArea")
    addListener(buttonMenu)
}

//----------Display Text Area Logic----------//

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

//----------Make and delete Element----------//

function deleteChildren(parent){
    parent=document.getElementById(parent)
    while(parent.firstChild){
        parent.removeChild(parent.firstChild)
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

function makeRadioButton(options,parent){
    parent=document.getElementById(parent)
    for(let option in options){
        let line=document.createElement("DIV")
        line.setAttribute("class","radio-option")
        let test=document.createElement("INPUT")
        test.setAttribute("type","radio")
        test.setAttribute("name","filter")
        test.setAttribute("value",options[option])
        test.setAttribute("class","radio-button-style")
        let text=document.createElement("label")
        text.innerHTML=options[option]
        line.appendChild(test)
        line.appendChild(text)
        parent.appendChild(line)

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

function addListener(options){
    for(let option in options){
        document.getElementById(options[option]).addEventListener("click",()=>directory(options[option]))
    }
}