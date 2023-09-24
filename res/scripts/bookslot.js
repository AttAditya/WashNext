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

async function cancelSlot(category, machine_id, slotid) {
    if (!confirm("Are you sure?")) {
        return;
    }

    let data = {
        slotid: slotid
    };

    await fetch(`/api/machine/${category}/${machine_id}/cancel`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(req => req.json()).then(server_res => {
        if (server_res.OK) {
            alert(server_res.msg);
            location.reload();
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
                    <button class="button is-primary m-2">
                        ${machine.key}
                    </button>
                </a>
            `;
        }
    }).catch(err => {
        alert("Could not connect to the servers! Please refresh!");
        console.log(err);
    });
}

async function showMachineDetails(category, machine_id) {
    await fetch(`/api/machine/${category}/${machine_id}`).then(req => req.json()).then(server_res => {
        document.getElementById("status").innerHTML += `
            ${server_res.status}
        `;
        
        for (let slot of server_res.schedule) {
            let slot_time = slot.time[0] + slot.time[1] + ":" + slot.time[2] + slot.time[3];
            let slot_date = new Date(`${slot.date.split("-")[1]}/${slot.date.split("-")[2]}/${slot.date.split("-")[0]}`);

            document.getElementById("schedule").innerHTML += `
                <div class="column is-4">
                    <div class="box has-background-primary has-text-centered">
                        <div class="has-text-right">
                            <button class="delete" onclick="cancelSlot('${category}', '${machine_id}', '${slot.slotid}');"></button>
                        </div>
                        <h1 class="title has-text-weight-bold has-text-white is-size-1">
                            ${slot_time}
                        </h1>
                        <h2 class="subtitle has-text-white mb-0">
                            ${slot_date.getDate()}/${slot_date.getMonth()}/${slot_date.getFullYear()}
                        </h2>
                        <h3 class="has-text-white">
                            ${slot.user}
                        </h3>
                    </div>
                </div>
            `;
        }
    }).catch(err => {
        alert("Could not connect to the servers! Please refresh!");
        console.log(err);
    });
}

