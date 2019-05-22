const express = require("express")
const shell = require("shelljs")

const app = express()
const port = 3000

app.get('/system', (req, res) => {
    const command = req.query.command

    let result = {}
    if (command) {
        const output = shell.exec(command)
        console.log(`/system: output for command "${command}" is: ${output}`)
        result.output = output
    } else {
        console.error('/system: No "command" parameter specified')
        result.error = 'Please specify a command with the "command" GET parameter'
    }
    res.send(result)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))