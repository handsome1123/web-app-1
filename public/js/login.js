const formLogin = document.querySelector('#formLogin');
formLogin.onsubmit = async function(e){
    e.preventDefault();
    const email = formLogin['email'].value;
    const password = formLogin['password'].value;
    // alert("Hello Wolrd!");
    try {
        const options = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "email": email,
                "password": password
            }),
        };
        const response = await fetch('/login', options);
        if(response.ok){
            const data = await response.text();
            location.replace(data);
            // Notiflix.Report.success('Success', data, 'OK');
        }
        else if (response.status == 401){
            const data = await response.text();
            throw Error(data);
        }
        else{
            throw Error('Connection error');
        }
        
    } catch (err) {
        console.error(err.message);
        Notiflix.Report.failure('Error', err.message, 'Close');
    }
}