process.on('message', (msg) => {
    if (msg == 'start') {
        let randomsArray = [];
        let cant = process.argv[2]
        for (let i=0; i<cant; i++) {
            let num = Math.floor(Math.random() * (1000)+1);
            randomsArray.push(num)
        }
        const cuenta = {};
        randomsArray.forEach(i => {
            cuenta[i] = (cuenta[i] || 0) + 1;
        });
        cuenta.cantidad = cant
        let cuentaMap = Object.keys(cuenta).map((key) => [Number(key), cuenta[key]]);
        process.send({ type: "random", data: cuentaMap });
    }
})