const cloudList = document.querySelector('#cloud-list');
const form = document.querySelector('#add-skybase-form');

function renderCloud(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let location = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    location.textContent = doc.data().location;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(location);
    li.appendChild(cross);

    cloudList.appendChild(li);

    //deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id =e.target.parentElement.getAttribute('data-id');
        db.collection('skybase').doc(id).delete();
    })
}
//getting data
// db.collection('skybase').get().then((snapshot) => {
//     snapshot.docs.forEach(doc => {
//         renderCloud(doc);
//     })
// });
//saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('skybase').add({
        name: form.name.value,
        location: form.location.value
    });
    form.name.value = '',
    form.location.value = ''
});
//real time listener

db.collection('skybase').orderBy('location').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added'){
            renderCloud(change.doc);
        }else if(change.type == 'removed'){
            let li = cloudList.querySelector('[data-id=' + change.doc.id + ']');
            cloudList.removeChild(li);
        }
    })
})
