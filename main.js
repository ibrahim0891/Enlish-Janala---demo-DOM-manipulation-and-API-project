
let lessonButtons = Array.from(document.getElementById('lesson-button-container').children)
let wordCardContainer = document.getElementById("word-card-container")
let modalContainer = document.getElementById('modal-container')

let wordCardTemplate = (data) => {
    let { id, word, meaning, pronunciation } = data
    return `
    <div class="bg-white rounded-xl p-6 md:p-14 space-y-14">
        <div class="space-y-6">
            <h3 class="text-3xl font-semibold"> ${word}</h3>
            <p class="text-xl">Meaning / Pronounciation</p>
            <p class="text-3xl font-bangla "> <span class='${meaning ?? 'text-red-500'}'> ${meaning ?? 'অর্থ পাওয়া যায়নি'}</span> / ${pronunciation}"</p>
        </div>
        <div class="flex items-center justify-between">
            <button
                onclick="showDetails(${id})"
                class="bg-blue-50 bounce aspect-square w-14 p-3 rounded-md text-2xl flex items-center justify-center ">
                <i class="ph-info-fill"></i>
            </button>
            <button
                onclick="speakWord('${word}')"   
                class="bg-blue-50 bounce aspect-square w-14 p-3 rounded-md text-2xl flex items-center justify-center ">
                <i class="ph-speaker-high-fill"></i>
            </button>
        </div>
    </div>
  `
}

let unAvailableStateTemplate = `
    <!-- Unavailable state  -->
    <div class="font-bangla py-8 md:py-16 text-center space-y-4 bg-gray-100">
        <img src="./assets/alert-error.png" class="w-20 m-auto" alt="">
        <p class="text-xs text-gray-400"> এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <p class="text-xl md:text-4xl font-bangla"> নেক্সট Lesson এ যান</p>
    </div>
`
let notSeletedState = `
    <!-- No selectin state  -->
    <div class="font-bangla py-8 md:py-16 text-center space-y-4 bg-gray-100">
        <p class="text-sm text-gray-400"> আপনি এখনো কোন Lesson Select করেন নি</p>
        <p class="text-xl md:text-4xl font-bangla"> একটি Lesson Select করুন</p>
    </div>

`

let errorTemplate = ` 
    <div class="font-bangla py-16 text-center space-y-4 bg-red-100">
        <img src="./assets/alert-error.png" class="w-20 m-auto" alt="">
        <p class="text-xl text-red-400"> শার্ভার থেকে ডেটা লোড করা সম্ভব হয়নি </p>
        <p class="text-2xl md:text-4xl text-red-600 font-bangla"> দয়া করে ইন্টারনেট সংযোগ চেক করুন </p>
    </div>
`

let modalTemplate = (data) => {
    let { id, word, meaning, pronunciation, sentence, synonyms, } = data
    console.log(data);

    const synonymHtml = Array.isArray(synonyms)
        ? synonyms.map(synonym =>
            `<span class="px-6 py-3 bg-blue-50 rounded-md">${synonym}</span>`
        ).join('')
        : '';

    return `
     <div class="bg-white p-6 md:rounded-3xl text-left w-screen  lg:max-w-[735px] aspect-auto">
        <div class="border border-gray-200 rounded-xl space-y-2 md:space-y-8 p-8 pb-12  mb-6 ">
            <h2 class="text-2xl md:text-4xl font-semibold"> ${word}(🎙️${pronunciation})</h2>
            <div class=" space-y-1 md:space-y-2">
                <h5 class=" text-lg md:text-2xl font-semibold"> Meaning</h5>
                <p class=" text-lg md:text-2xl font-medium"> ${meaning}</p>
            </div>
            <div class=" space-y-1 md:space-y-2">
                <h5 class=" text-lg md:text-2xl font-semibold"> Example</h5>
                <p class=" text-lg md:text-2xl font-medium"> ${sentence}</p>
            </div>
            <div class="space-y-2 md:space-y-8">
                <h5 class=" text-lg md:text-2xl font-semibold"> সমার্থক শব্দ গুলো</h5>
                <div class=" text-lg md:text-2xl space-x-4 overflow-auto">
                    ${synonymHtml}
                </div>
            </div>
        </div>
        <button class="text-gray-400 text-sm"> Click outside of the box to close the modal</button>
    </div>
  `
}

let loaderTemplate = `<div class='py-24'><l-ring size="40" stroke="5" bg-opacity="0" speed="2" color="black" ></l-ring> </div>`

wordCardContainer.innerHTML = notSeletedState

lessonButtons.forEach(button => {
    button.addEventListener('click', (e) => {

        //make the button work like tab
        lessonButtons.forEach(button => {
            if (!button.classList.contains('btn-outline')) {
                button.classList.add('btn-outline')
            }
        })
        e.currentTarget.classList.remove('btn-outline')

        //contruct the url from the button index based on click
        let level = lessonButtons.indexOf(e.target) + 1
        let levelUrl = `https://openapi.programming-hero.com/api/level/${level}`

        //clear privious content and show loader content
        wordCardContainer.innerHTML = ''
        wordCardContainer.innerHTML = loaderTemplate

        //fetch data of a word
        fetch(levelUrl).then(res => res.json()).then(res => {
            let data = res.data;

            //show unavaliable state if api sends and empty array
            if (data.length == 0) {
                wordCardContainer.innerHTML = unAvailableStateTemplate
            } else {
                wordCardContainer.innerHTML = '' //clear existing content like loader and others
                let container = document.createElement('div')
                container.classList.add('bg-gray-100', 'grid', 'md:grid-cols-3', 'gap-8','p-4','rounded-lg', 'md:p-8')

                //itarate api data and feed word to template to get a hydrated html string 
                data.forEach(word => {
                    container.innerHTML += wordCardTemplate(word)
                })
                wordCardContainer.appendChild(container)
            }
        }, (error) => {
            //show the error template if promise don't get resolved for network or other issus
            wordCardContainer.innerHTML = errorTemplate
        })
    })
});



let showDetails = (id) => {
    let wordDetailUrl = `https://openapi.programming-hero.com/api/word/${id}`
    modalContainer.classList.remove('hidden')
    let modalLoader = `
        <div class='bg-white p-6 md:rounded-3xl text-left w-full md:w-auto rounded-none   min-w-[250px] aspect-1/1 flex items-center justify-center'>
            <l-ring size="40" stroke="5" bg-opacity="0" speed="2" color="black"></l-ring>
        </div>
    `
    modalContainer.innerHTML = modalLoader

    //fake waiting time to let user enjoy our beautiful loading spinner 
    setTimeout(() => {
        fetch(wordDetailUrl).then(res => res.json()).then(word => {
            modalContainer.innerHTML = modalTemplate(word.data)
            modalContainer.addEventListener('click', (e) => {
                if (e.target.id) {
                    e.target.classList.add('hidden')
                }
            })
        })
    }, 1000);

}


let speakWord = (word) => {
  let utterance = new SpeechSynthesisUtterance(word)
  utterance.lang = 'en-EN'
  window.speechSynthesis.speak(utterance)
}




// lessonButtons.forEach(button => { 
//     button.addEventListener('click', (e) => {
//         lessonButtons.forEach(btn=>{
//             if (btn.classList.contains('active')) {
//                 btn.classList.remove('active') 
//             } 
//         })
//         e.currentTarget.classList.add('active') 
//     })
// });


let sidebar = document.getElementById('sidebar')

let openSidebar = () => {
  sidebar.style.width = '66%'
}
let closeSidebar = () => {
    sidebar.style.width = '0px'
    console.log('sidbar closed');
}