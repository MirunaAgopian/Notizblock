function getArchivedNotesFromLocalStorage(){
    let savedArchivedNotes = JSON.parse(localStorage.getItem('archivedNotes'));
    if(savedArchivedNotes === null){
        archivedNotes = [];
    } else {
        archivedNotes = savedArchivedNotes;
    }
}

function renderArchivedContent(){
    getArchivedNotesFromLocalStorage();
    let archivedContentRef = document.getElementById('archived_content');
    archivedContentRef.innerHTML = '';

    for(let archivedNotesIndex = 0; archivedNotesIndex < archivedNotes.length; archivedNotesIndex++){
        archivedContentRef.innerHTML += getArchivedNotesTemplate(archivedNotesIndex);
    }

}

function getArchivedNotesTemplate(archivedNotesIndex){
    return `<div class='single-note-container'>
                        <h3 id='single_note_title'>${archivedNotes[archivedNotesIndex].title}</h3>
                        <p class='note-date'>${archivedNotes[archivedNotesIndex].date}</p>
                        <p id='single_note_text'>${archivedNotes[archivedNotesIndex].text.replace(/\n/g, '<br>')}</p>
                                <div class='single-note-buttons'>
                                  <button onclick='restoreArchivedNotes(${archivedNotesIndex})'>Wiederherstellen</button>
                                  <button onclick='pushArchivedNotesToTrash(${archivedNotesIndex})'>Löschen</button>
                                </div>
                <div>`;
}


function pushArchivedNotesToTrash(archivedNotesIndex){
    //here I get the elements from localStorage by means of the arrays and pass them into new variables
    let savedArchivedNotes = JSON.parse(localStorage.getItem('archivedNotes')) || [];
    let savedTrashNotes = JSON.parse(localStorage.getItem('trashNotes')) || [];

    if(archivedNotesIndex >= 0 && archivedNotesIndex < savedArchivedNotes.length){
        removedArchivedNotes = savedArchivedNotes.splice(archivedNotesIndex, 1)[0];

        savedTrashNotes.unshift(removedArchivedNotes);

        //here I pass the data from the newly created variables back again into the arrays on the localStorage
        localStorage.setItem('archivedNotes', JSON.stringify(savedArchivedNotes));
        localStorage.setItem('trashNotes', JSON.stringify(savedTrashNotes));


    } else {
        console.error('Invalid index');
        return; 
    }
    renderArchivedContent();
}

function restoreArchivedNotes(archivedNotesIndex){
    let savedArchivedNotes = JSON.parse(localStorage.getItem('archivedNotes')) || [];
    let savedNotes = JSON.parse(localStorage.getItem('notes')) || [];

    let restoredArchivedNotes = savedArchivedNotes.splice(archivedNotesIndex, 1)[0];
    savedNotes.unshift(restoredArchivedNotes);

    localStorage.setItem('archivedNotes', JSON.stringify(savedArchivedNotes));
    localStorage.setItem('notes', JSON.stringify(savedNotes));

    renderArchivedContent();
    renderSavedNotes();
}

// Search function

function search(searchQuery) {
    let savedArchivedNotes = JSON.parse(localStorage.getItem('archivedNotes')) || [];
    return savedArchivedNotes.filter(note => {
        let titleMatch = note.title?.toLowerCase().includes(searchQuery);
        let textMatch = note.text?.toLowerCase().includes(searchQuery); 
        return titleMatch || textMatch;
    });
}


function renderFilteredArchivedNotes(filteredNotes){
        let notesContainer = document.getElementById('archived_content');
        notesContainer.innerHTML = '';

        filteredNotes.forEach(note => {
        let archivedNotesIndex = archivedNotes.findIndex(n => n.title === note.title && n.text === note.text);
    
        if (archivedNotesIndex !== -1) {
                let fullNoteHTML = getArchivedNotesTemplate(archivedNotesIndex); 
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
            renderFilteredArchivedNotes(filteredNotes);
        });
    } else {
        console.error("Search bar not found! Make sure the class '.search-bar' exists in the HTML.");
    }
});