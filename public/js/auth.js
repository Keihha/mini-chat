const singoutGoogle = document.querySelector('#google_sing_out');
const formIn = document.querySelector('#forme');

const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8081/log'
    : '-';


formIn.addEventListener('submit', event => {
    event.preventDefault();
    const formData = {};
    
    for(let el of formIn.elements){
        if(el.name.length > 0){
            formData[el.name] = el.value;
        };
    };
    fetch(url + '/', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'Content-Type': 'application/json'}
    })
        .then(resp => resp.json())
        .then(({msg, token}) => {
            if(msg){
                return console.error(msg);
            }
            console.log(token);
            localStorage.setItem('token', token);
        })
        .catch(err => {
            console.log(err);
        })
});



function handleCredentialResponse(response) {
    //google token: id token

    const body = {id_token: response.credential};
    // console.log('id_token: ', response.credential);

    fetch(url + 'google', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(body)
    })
        .then(resp => resp.json() )
        .then(({token, user}) => {
            localStorage.setItem('email', user.email);
            localStorage.setItem('token', token);
            location.reload();
        })
        .catch(console.warn());
}



singoutGoogle.onclick = () => {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        localStorage.clear();
        location.reload();
    });
}