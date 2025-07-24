function getTrashNoteFromLocalStorage(){
    let savedTrashNotes = JSON.parse(localStorage.getItem('trashNotes')) || [];
    if(savedTrashNotes === null){
        trashNotes = [];
    } else {
        trashNotes = savedTrashNotes;
    }
}

function renderTrashContent(){
        getTrashNoteFromLocalStorage();
        let trashContentRef = document.getElementById('trash_content');
        trashContentRef.innerHTML = '';

        for(let trashNotesIndex = 0; trashNotesIndex < trashNotes.length; trashNotesIndex++){
                trashContentRef.innerHTML += getTrashNotesTemplate(trashNotesIndex);
        }

}


function getTrashNotesTemplate(trashNotesIndex){
        return `<div class='single-note-container'>
                    <h3>${trashNotes[trashNotesIndex].title}</h3>
                    <p class='note-date'>${trashNotes[trashNotesIndex].date}</p>
                    <p>${trashNotes[trashNotesIndex].text.replace(/\n/g, '<br>')}</p>
                        <div class='single-note-buttons'>
                            <button onclick='deleteForever(${trashNotesIndex})'>Notiz vernichten</button>
                        </div>
                <div>`   
}

function deleteForever(trashNotesIndex) {
  const userConfirmation = window.confirm('Möchten Sie diese Notiz für immer löschen?')
  if(!userConfirmation){
    return;
  }

  let savedTrashNotes = JSON.parse(localStorage.getItem('trashNotes')) || [];
  savedTrashNotes.splice(trashNotesIndex, 1);

  localStorage.setItem('trashNotes', JSON.stringify(savedTrashNotes));

  renderTrashContent();
}

// Search function

function search(searchQuery) {
    let savedTrashNotes = JSON.parse(localStorage.getItem('trashNotes')) || [];
    return savedTrashNotes.filter(note => {
        let titleMatch = note.title?.toLowerCase().includes(searchQuery);
        let textMatch = note.text?.toLowerCase().includes(searchQuery); 
        return titleMatch || textMatch;
    });
}


function renderFilteredTrashNotes(filteredNotes) {
    let notesContainer = document.getElementById('trash_content');
    notesContainer.innerHTML = '';

    let savedTrashNotes = JSON.parse(localStorage.getItem('trashNotes')) || []; // Ensure we have the full list

    filteredNotes.forEach(note => {
        let trashNotesIndex = savedTrashNotes.findIndex(n => n.title === note.title && n.text === note.text); // ✅ Fix: Use savedTrashNotes

        if (trashNotesIndex !== -1) {
            let fullNoteHTML = getTrashNotesTemplate(trashNotesIndex); 
            notesContainer.innerHTML += fullNoteHTML;
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    let searchBar = document.querySelector('.search-bar');

    if (searchBar) {
        searchBar.addEventListener('input', function(){
            let searchQuery = searchBar.value.toLowerCase();
            console.log("Search Query:", searchQuery);
            let filteredNotes = search(searchQuery);
            renderFilteredTrashNotes(filteredNotes);
        });
    } else {
        console.error("Search bar not found! Make sure the class '.search-bar' exists in the HTML.");
    }
});

  