function moveOptions(fromId, toId) {
    const fromSelect = document.getElementById(fromId)
    const toSelect = document.getElementById(toId)

    Array.from(fromSelect.selectedOptions).forEach(option => {
        toSelect.appendChild(option)
    })
}


function moveToDisplayed() {
    moveOptions('available-fields', 'displayed-fields')
}


function moveToAvailable() {
    moveOptions('displayed-fields', 'available-fields')
}


function displayImportedData() {
    const availableFieldsSelect = document.getElementById('available-fields')
    const displayedFieldsSelect = document.getElementById('displayed-fields')

    availableFieldsSelect.innerHTML = ''
    displayedFieldsSelect.innerHTML = ''

    const allFields = Object.keys(productsData[0])

    allFields.forEach(field => {
        const option = document.createElement('option')
        option.value = field
        option.textContent = field
        availableFieldsSelect.appendChild(option)
    })
}


function parseJSON(file) {
    const reader = new FileReader()

    reader.onload = function (e) {
        try {
            data = JSON.parse(e.target.result)

            for (var prop in data.products) {
                productsData.push({
                    id: prop,
                    ...data.products[prop]
                })
            }

            displayImportedData()
        } catch (error) {
            console.error('Error parsing JSON:', error)
        }
    }

    reader.readAsText(file)
}


function parseCSV(file) {
    const hasHeader = document.getElementById('has-header')
    const charEncoding = document.getElementById('char-encoding').value
    const delimiter = document.getElementById('delimiter').value

    var delimiterSymbol = ""

    if (delimiter === "comma") delimiterSymbol = ","
    if (delimiter === "semicolon") delimiterSymbol = ";"
    if (delimiter === "tab") delimiterSymbol = "\t"
    if (delimiter === "pipe") delimiterSymbol = "|"
    if (delimiter === "colon") delimiterSymbol = ":"

    Papa.parse(file, {
        dynamicTyping: true,
        header: hasHeader.checked,
        delimiter: delimiterSymbol,
        encoding: charEncoding,

        complete: function (results) {
            if (results.data && results.data.length > 0) {
                productsData = results.data
                displayImportedData()
            } else {
                console.error('Error parsing CSV: Empty or invalid CSV file.')
            }
        },
        error: function (error) {
            console.error('Error parsing CSV:', error.message)
        }
    })
}


function loadData() {
    const displayedFieldsSelect = document.getElementById('displayed-fields')
    const displayedFields = Array.from(displayedFieldsSelect.options).map(option => option.value)
    const step3 = document.getElementById('step-3')

    if (step3.checked === false || displayedFields.length === 0) {
        displayedFields.push("title")
        displayedFields.push("price")
    }

    const sortedProducts = productsData.sort((a, b) => b.popularity - a.popularity)

    const productListTable = document.getElementById('product-list')

    productListTable.innerHTML = "<tr>"
        + "<th>sr no</th>"
        + displayedFields.map(field => `<th>${field}</th>`).join('')
        + "</tr>"

    sortedProducts.map((product, index) => {
        const productRow = document.createElement('tr')

        productRow.innerHTML = `<td>${index + 1}</td>`
            + displayedFields.map(field => `<td>${product[field]}</td>`).join('')

        productListTable.appendChild(productRow)
    })

    const headerElement = document.getElementsByTagName("h4")[0]
    const mainElement = document.getElementsByTagName("main")[0]
    const btnNext = document.getElementsByClassName("btn-next")[0]
    const btnCancel = document.getElementsByClassName("btn-cancel")[0]

    headerElement.style.display = "none"
    mainElement.style.display = "none"
    btnNext.style.display = "none"
    btnCancel.style.display = "none"
}


var productsData = []


const selectElements = document.getElementsByTagName("select")


Array.from(selectElements).forEach(ele => {
    ele.addEventListener("change", () => {
        const file = document.getElementById('file-input').files[0]
        const fileType = document.getElementById('file-type')

        if (file && fileType.value === "csv") {
            parseCSV(file)
        }
        if (file && fileType.value === "json") {
            parseJSON(file)
        }
    })
})


document.getElementById('file-input').addEventListener('change', function (event) {
    const file = event.target.files[0]
    const fileType = document.getElementById('file-type')

    if (file && fileType.value === "csv") {
        parseCSV(file)
    }
    if (file && fileType.value === "json") {
        parseJSON(file)
    }
})