let notes = [];
let trashNotes = [];
let archivedNotes = [];

function renderNotes(){
     let contentRef = document.getElementById('content');
     contentRef.innerHTML = '';
     for(let indexNote = 0; indexNote < notes.length; indexNote++){
        contentRef.innerHTML += getNoteTemplate(indexNote);
     }

}

function getNoteTemplate(indexNote){
        return `<div id='note_container' class='single-note-container'>
                        <h3 id='single_note_title'>${notes[indexNote].title}</h3>
                        <p class='note-date'>${notes[indexNote].date}</p>
                        <p id='single_note_text'>${notes[indexNote].text.replace(/\n/g, '<br>')}</p>
                                <div class='single-note-buttons'>
                                  <button onclick='pushNotesToArchive(${indexNote})'>Archivieren</button>
                                  <button onclick='editNote(${indexNote})'>Bearbeiten</button>
                                  <button onclick='pushNoteToTrash(${indexNote})'>Löschen</button>
                                </div>
                </div>`;
}

function addNote(){
        let noteTitleRef = document.getElementById('note_title');
        let noteTextRef = document.getElementById('note_text');

        let noteTitle = noteTitleRef.value.trim();
        let noteText = noteTextRef.value.trim();

        noteTitleRef.value = '';
        noteTextRef.value = '';

        if(noteTitle === '' || noteText === '') {
                alert('Bitte beide Felder ausfüllen');
                return;
        }

        notes.unshift({
                title: noteTitle, 
                text: noteText,
                date: addNoteDate(),
        });
        renderNotes();
        saveToLocalStorage();
}

function addNoteDate(){
        const noteDate = new Date();
        return new Intl.DateTimeFormat('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit', 
                minute: '2-digit'
        }).format(noteDate);
}


function saveToLocalStorage(){
        localStorage.setItem('notes', JSON.stringify(notes));
}

function getFromLocalStorage(){
        let savedNotes = JSON.parse(localStorage.getItem('notes'));
        if(savedNotes === null){
                notes = [];
        } else {
                notes = savedNotes;
        }

}

function renderSavedNotes(){
        getFromLocalStorage();
        renderNotes();
}

//Functions to delete the notes


function pushNoteToTrash(indexNote){
        let trashNote = notes.splice(indexNote, 1)[0];
        let savedTrashNotes = JSON.parse(localStorage.getItem('trashNotes')) || [];
        
        savedTrashNotes.unshift(trashNote);
        localStorage.setItem('trashNotes',JSON.stringify(savedTrashNotes));
        
        saveToLocalStorage();
        renderNotes();        
}

function pushNotesToArchive(indexNote){
        let archivedNote = notes.splice(indexNote, 1)[0];
        let savedArchivedNotes = JSON.parse(localStorage.getItem('archivedNotes')) || [];

        savedArchivedNotes.unshift(archivedNote);
        localStorage.setItem('archivedNotes', JSON.stringify(savedArchivedNotes));

        saveToLocalStorage();
        renderNotes();
}


//Functions for editing the notes

function editNote(indexNote){
        let savedNotes = JSON.parse(localStorage.getItem('notes')) || [];

        if(indexNote >= 0 && indexNote < savedNotes.length){
                openEditingModal(indexNote);
        } else {
                console.log('invalid index');
        }


}

function openEditingModal(indexNote){
        let modal = document.getElementById('modal');
        modal.classList.toggle('d-none');
        let editingContainer = document.getElementById('editing_container');
        editingContainer.innerHTML = renderEditingContainer(indexNote);

}


function renderEditingContainer(indexNote){
        return`<div id='edit_note_container' class='edit-note-container'>
                        <div class='title-date'>
                        <input id='edit_title' type='text' value='${notes[indexNote].title}' />
                        <p class='note-date'>${notes[indexNote].date}</p>
                        </div>
                        <textarea id='edit_text'>${notes[indexNote].text}</textarea>
                                <div class='single-note-buttons'>
                                  <button onclick='savedEditedNote(${indexNote})'>Speichern</button>
                                  <button onclick='closeModal()'>Abbrechen</button>
                                </div>
                </div>`;
}

function closeModal(){
        let container = document.getElementById('edit_note_container');
        let modal = document.getElementById('modal');
        modal.classList.toggle('d-none');
        container.style.display = 'none';
        
}

function savedEditedNote(indexNote){
        let savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
        let editedNoteTitleRef = document.getElementById('edit_title');
        let editedNoteTextRef = document.getElementById('edit_text');

        let editedNoteTitle = editedNoteTitleRef.value.trim();
        let editedNoteText = editedNoteTextRef.value.trim();

        savedNotes[indexNote].title = editedNoteTitle;
        savedNotes[indexNote].text = editedNoteText; 


        localStorage.setItem('notes', JSON.stringify(savedNotes));
        closeModal();
        renderSavedNotes();
}

//TO DO
//a search function for the search_btn in <nav>

function search(searchQuery) {
    let savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    return savedNotes.filter(note => {
        let titleMatch = note.title?.toLowerCase().includes(searchQuery);
        let textMatch = note.text?.toLowerCase().includes(searchQuery); 
        return titleMatch || textMatch;
    });

}


function renderFilteredNotes(filteredNotes){
        let notesContainer = document.getElementById('content');
        notesContainer.innerHTML = '';

        filteredNotes.forEach(note => {
        let indexNote = notes.findIndex(n => n.title === note.title && n.text === note.text);
    
        if (indexNote !== -1) {
                let fullNoteHTML = getNoteTemplate(indexNote); 
                notesContainer.innerHTML += fullNoteHTML;
    }
});
}

let searchBar = document.querySelector('.search-bar');
searchBar.addEventListener('input', function(){
        let searchQuery = searchBar.value.toLowerCase();
        let filteredNotes = search(searchQuery);
        renderFilteredNotes(filteredNotes);
});





