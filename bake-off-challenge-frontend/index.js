// your code here!
console.log("🥧")
document.addEventListener("DOMContentLoaded", () => {

    /////////////////////////////////////////////////
    //       DOM selectors & main code
    const allBakes = document.querySelector('#bakes-container');
    const showBakeDiv = document.querySelector('#detail')
    const newBakeForm = document.querySelector('#new-bake-form')
    const modal = document.querySelector("#modal")
    const judgeButton = document.querySelector('#judge-bake-button')

    displayBakesSidebar();
    

    







    ////////////////////////////////////////////////
    //      event listeners

    function addSidebarListener(li) {
        li.addEventListener('click', (e) => {
            displayBakeDetails(e.target.dataset.id)
        })
    }

    newBakeForm.addEventListener('submit', (e) => {
        e.preventDefault()
        let updateObj = {
        name: e.target.name.value,
        image_url: e.target.image_url.value,
        description: e.target.description.value
        }
        fetch('http://localhost:3000/bakes', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateObj),
        })
        .then(response => response.json())
        .then(bakeData => {
            createAndAppendBakeLi(bakeData);
            newBakeForm.reset();
            modal.style.display = "none"
            displayBakeDetails(bakeData.id);
        })
    })

    function addScoreFormListener(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let configObj = { score: e.target.score.value };
            fetch(`http://localhost:3000/bakes/${e.target.dataset.id}/ratings`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer 699a9ff1-88ca-4d77-a26e-e4bc31cfc261"
                },
                body: JSON.stringify(configObj)
            })
            .then(response => response.json())
            .then( bakeData => {
                let scoreField = document.querySelector('#score-form input')
                scoreField.value = bakeData.score
            })
        })
    }

    judgeButton.addEventListener('click', (e) => {
        fetch('http://localhost:3000/bakes/winner')
        .then(response => response.json())
        .then(winnerData => {
            let winId = winnerData.id
            let allBakeLis = allBakes.querySelectorAll('li')
            // debugger
            allBakeLis.forEach(li => {
                // debugger
                if (li.dataset.id === winId.toString()) {
                    li.className = "item winner"
                }
            })
        })
    })




    ///////////////////////////////////////////////
    //        render helpers

    function displayBakesSidebar() {

        fetch('http://localhost:3000/bakes')
        .then(response => response.json())
        .then(bakesData => {
            bakesData.forEach(bake => {
                createAndAppendBakeLi(bake)
            })
            displayBakeDetails(bakesData[0].id);
        })
    }

    function createAndAppendBakeLi(bake) {
        let bakeLi = document.createElement('li')
        bakeLi.textContent = bake.name
        bakeLi.className = "item"
        bakeLi.dataset.id = bake.id
        addSidebarListener(bakeLi)
        allBakes.appendChild(bakeLi)
    }

    function displayBakeDetails(id) {
        showBakeDiv.innerHTML = ""
        fetch(`http://localhost:3000/bakes/${id}`)
        .then(response => response.json())
        .then(bakeData => {
            let image = document.createElement('img');
            image.src = bakeData.image_url;
            image.alt = bakeData.name;
            let header = document.createElement('h1');
            header.textContent = bakeData.name;
            let p = document.createElement('p')
            p.className = "description"
            p.textContent = bakeData.description
            let form = document.createElement('form')
            form.id = "score-form"
            form.dataset.id = bakeData.id
            let formInput = document.createElement('input')
            formInput.type = "number"
            formInput.value = bakeData.score
            formInput.name = "score"
            formInput.min = "0"
            formInput.max = "10"
            formInput.step = "0"
            let formSubmit = document.createElement('input');
            formSubmit.type = 'submit';
            formSubmit.value = "Rate";
            form.append(formInput, formSubmit);
            addScoreFormListener(form);
            showBakeDiv.append(image, header, p, form)
        })
    }





    ///////////////////////////////////////////////
    //       misc helpers







})