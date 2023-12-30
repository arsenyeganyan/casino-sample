fetch('http://localhost:8000/sport/news/football/', {
    method: 'GET',
    headers: {
        'Authorization': `Token 0682d074fd68f526a0cca0ef19601db61cf825c7`
    }
})
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err))