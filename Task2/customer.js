const fs = require('fs')
const yargs = require('yargs')



readFileData = function (index) {
    try {
        data = fs.readFileSync('customers.json')
        if (data.toString().length == 0) throw new Error('Have No Data ...!')
        data = JSON.parse(data.toString())
        if (!Array.isArray(data)) throw new Error('')
    }
    catch (e) {
        data = []
        fs.writeFileSync('customers.json', "[]")
    }
    return data
}
showAllData = function () {
    data = readFileData()
    if (data.length > 0) console.table(data);
    else console.log("no Customers found")
}
addCustomer = function (customer) {
    data = readFileData()
    data.push(customer)
    fs.writeFileSync('customers.json', JSON.stringify(data))
}
showSingleCustomer = function (AccountNumber) {
    data = readFileData()
    result = data.find(element => {
        return element.accountnumber == AccountNumber
    })
    if (!result) console.log("no Customer")
    else return result
}

addBalance = function (index, newbalance) {
    data = readFileData()
    result = data.find(element => {
        return element.accountnumber == index
    })

    if (result) {
        BalanceNew = result.balance + newbalance
        result.balance = BalanceNew
        fs.writeFileSync('customers.json', JSON.stringify(data))

    }

}

DrawBalance = function (index, drawbalance) {
    data = readFileData()
    result = data.find(element => {
        return element.accountnumber == index
    })

    if (result) {
        if (drawbalance > result.balance) {
            console.log('not enough money')
        }
        else {
            BalanceNew = result.balance - drawbalance
            result.balance = BalanceNew
            fs.writeFileSync('customers.json', JSON.stringify(data))
        }
    }

}
yargs.command({
    command: "addBalance",
    builder: {
        accountnumber: { type: 'number', demandOption: true },
        balance: { type: 'number', demandOption: true }
    },
    handler: function (argv) {
        addBalance(argv.accountnumber, argv.balance)
    }
})

yargs.command({
    command: "DrawBalance",
    builder: {
        accountnumber: { type: 'number', demandOption: true },
        draw: { type: 'number', demandOption: true }
    },
    handler: function (argv) {
        DrawBalance(argv.accountnumber, argv.draw)
    }
})

yargs.command({
    command: "showSingle",
    builder: { accountnumber: { type: 'number', demandOption: true } },
    handler: function (argv) { showSingleNote(argv.accountnumber) }
})
yargs.command({
    command: 'showAllCustomers',
    describe: 'show all stored customer',
    handler: function () {
        showAllData()
    }
})
yargs.command({
    command: "addNewCustomer",
    describe: "add new customer to our file",
    builder: {
        name: { type: 'string', demandOption: true },
        balance: { type: 'number' },
        accountnumber: { type: 'number', demandOption: true }
    },
    handler: function (argv) {

        data = readFileData()
        accountnumbers = []
        data.forEach(element => {
            accountnumbers.push(element.accountnumber)
        });
        existnum = accountnumbers.includes(argv.accountnumber)

        if (!existnum) {
            let customer = { name: argv.name, balance: argv.balance, accountnumber: argv.accountnumber }
            addCustomer(customer)
        }
        else {
            console.log("this Number is exist before")
        }
    }
})
yargs.argv


