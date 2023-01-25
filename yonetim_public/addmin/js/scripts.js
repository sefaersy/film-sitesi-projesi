const subscriptionBuy = function(_id) {
    console.log(_id)

    fetch('/abonelik/satinal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({_id})
    })
    .then(async function(response) {
        const res = await response.json();
        if(res.type) {
            alertify.error(res.message)
        } else {
            alertify.success(res.message);
            setTimeout(() => {
                window.location.reload()
            }, 1000);
        }
        console.log(res.message);
    })
    .catch(function(error) {
      console.log(error);
    });
}

const creditBuy = function(_id) {
    console.log(_id)

    fetch('/kredi/satinal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({_id})
    })
    .then(async function(response) {
        const res = await response.json();
        alertify.success(res.message);
        console.log(res.message);
        setTimeout(() => {
            window.location.reload()
        }, 1000);
    })
    .catch(function(error) {
      console.log(error);
    });
}

const totalCredit = function() {
    fetch('/toplamkredi', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(async function(response) {
       console.log(await response.json());
    })
    .catch(function(error) {
      console.log(error);
    });
}

const filmRent = function(_id) {
    console.log(_id)
    fetch('/yonetim/kirala', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({_id})
    })
    .then(async function(response) {
        const res = await response.json();
        if(res.type) {
            alertify.error(res.message)
        } else {
            alertify.success(res.message);
            setTimeout(() => {
                window.location.reload()
            }, 1000);
        }
        console.log(res.message);
    })
    .catch(function(error) {
      console.log(error);
    });
}

const film_purchase = function(_id) {
    console.log(_id)
    fetch('/yonetim/satin-al', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({_id})
    })
    .then(async function(response) {
        const res = await response.json();
        if(res.type) {
            alertify.error(res.message);
        } else {
            alertify.success(res.message);
            setTimeout(() => {
                window.location.reload()
            }, 1000);
        }
        console.log(res.message);
        
    })
    .catch(function(error) {
      console.log(error);
    });
}

const search = function() {
    console.log("search");
    const searchInput = document.getElementById("search").value;
    window.location.href = "/yonetim/search?search=" + searchInput;
}