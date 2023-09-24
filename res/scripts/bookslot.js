async function bookSlot(category, machine_id, date, time, user) {
    let data = {
        date: date,
        time: time,
        user: user
    };

    await fetch(`/api/machine/${category}/${machine_id}/book`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(req => req.json()).then(server_res => {
        if (server_res.OK) {
            alert(server_res.msg);
        } else {
            alert(server_res.msg);
        }
    }).catch(err => {
        alert("Could not connect to the servers! Please try again!");
        console.log(err);
    });
}

async function showMachinesList(category, container) {
    await fetch(`/api/machines/${category}`).then(req => req.json()).then(server_res => {
        for (let machine of server_res) {
            container.innerHTML += `
                <a href="/machine/${category}/${machine.key}">
                    <button>${machine.key}</button>
                </a>
            `;
        }
    }).catch(err => {
        alert("Could not connect to the servers! Please refresh!");
        console.log(err);
    });
}

async function showMachineDetails(category, machine_id, container) {
    await fetch(`/api/machine/${category}/${machine_id}`).then(req => req.json()).then(server_res => {
        for (let slot of server_res.schedule) {
            container.innerHTML += `
                <h1>${slot.time}</h1>
                <h2>${slot.date}</h2>
                <h2>${slot.user}</h2>
            `;
        }
    }).catch(err => {
        alert("Could not connect to the servers! Please refresh!");
        console.log(err);
    });
}

