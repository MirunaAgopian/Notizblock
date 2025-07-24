document.getElementById('create_note').addEventListener('click', function(){
        let noteCotainer = document.getElementById('write_note');
        noteCotainer.classList.toggle('d-none');

});

document.getElementById('close').addEventListener('click', function(){
        let noteCotainer = document.getElementById('write_note');
        let noteTitleRef = document.getElementById('note_title');
        let noteTextRef = document.getElementById('note_text');

        noteTitle = noteTitleRef.value.trim();
        noteText = noteTextRef.value.trim();

        noteTitleRef.value = '';
        noteTextRef.value = '';
        
        noteCotainer.classList.toggle('d-none');
});

document.getElementById('save').addEventListener('click', function(){
        let noteCotainer = document.getElementById('write_note');
        noteCotainer.classList.toggle('d-none');
});

