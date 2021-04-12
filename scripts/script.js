'use strict'

//// ADMIN PART ////
const WREATHS = [
    {
        name: 'В-1',
        description: 'высота 90 см, ширина 49 см, <br/> высота с ножками 122 см',
        cost: 1.51
    },
    {
        name: 'В-2',
        description: 'высота 104 см, ширина 57 см, <br/> высота с ножками 136 см',
        cost: 1.68
    },
    {
        name: 'В-3',
        description: 'высота 118 см, ширина 68 см, <br/> высота с ножками 150 см',
        cost: 1.94
    },
    {
        name: 'В-4',
        description: 'высота 132 см, ширина 74 см, <br/> высота с ножками 164 см',
        cost: 2.14
    },
    {
        name: 'В-5',
        description: 'высота 98 см, ширина 58 см, <br/> высота с ножками 130 см',
        cost: 2.10
    },
    {
        name: 'В-6',
        description: 'высота 132 см, ширина 66 см, <br/> высота с ножками 164 см',
        cost: 2.44
    },
    {
        name: 'В-7',
        description: 'высота 103 см, ширина 70 см, <br/> высота с ножками 135 см',
        cost: 3.36
    },
    {
        name: 'В-8',
        description: 'высота 116 см, ширина 76 см, <br/> высота с ножками 148 см',
        cost: 3.85
    },
]
const BASKETS = [
    {
        name: 'К-1',
        description: 'высота 55 см, ширина 19 см',
        cost: 1.36
    },
    {
        name: 'К-2',
        description: 'высота 115 см, ширина 50 см',
        cost: 3.74
    },
    {
        name: 'К-3',
        description: 'высота 63 см, ширина 19 см',
        cost: 1.42
    },
    {
        name: 'К-4',
        description: 'высота 70 см, ширина 29 см',
        cost: 2.52
    },
    {
        name: 'К-5',
        description: 'высота 78 см, ширина 47 см',
        cost: 2.76
    },
    {
        name: 'К-6',
        description: 'высота 88 см, ширина 30 см',
        cost: 2.63
    },
    {
        name: 'К-7',
        description: 'высота 89 см, ширина 22 см',
        cost: 2.20
    },
    {
        name: 'К-8',
        description: 'высота 36 см, ширина 23 см',
        cost: 1.10
    },
    {
        name: 'К-9',
        description: 'высота 78 см, ширина 39 см',
        cost: 2.44
    },
    {
        name: 'К-10',
        description: 'высота 19 см, ширина 33 см',
        cost: 1.12
    },
    {
        name: 'К-11',
        description: 'высота 92 см, ширина 42 см',
        cost: 3.19
    },
    {
        name: 'К-12',
        description: 'высота 96 см, ширина 38 см',
        cost: 2.81
    },
]

//// LOGIC PART ////
document.addEventListener('DOMContentLoaded', () => {
    dataCreator()
    productListCreator()
})

let WREATHS_LIST
let BASKETS_LIST
let timer

const debounce = (func, ms) => {
    clearTimeout(timer)
    timer = setTimeout(func, ms)
}

const $ = (id) => {
    return document.getElementById(id)
}

const dateProvider = () => {
    const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
    const dateObj = new Date()
    const month = monthNames[dateObj.getMonth()]
    const day = String(dateObj.getDate()).padStart(2, '0')
    const year = dateObj.getFullYear()
    const output = day + '\n' + month + '\n' + year

    return output
}

const dataCreator = () => {
    WREATHS_LIST = WREATHS.map((product, index) => ({
        ...product,
        id: index + 1,
        allCost: product.cost,
        discountPercent: 0,
        count: 1,
        inBasket: false,
        type: 'wreath'
    }))
    BASKETS_LIST = BASKETS.map((product, index) => ({
        ...product,
        id: index + 1 + WREATHS_LIST.length,
        allCost: product.cost,
        discountPercent: 0,
        count: 1,
        inBasket: false,
        type: 'basket'
    }))

    PAGE_OPTIONS.currentList = WREATHS_LIST
}

const PAGE_OPTIONS = {
    currentList: [],
    basketList: [],
    basketIsOpen: false,
    privacyConfirmed: false,
    price: 0
}

const basketButton = $('basket-button')
const basketProductsWrapper = $('basket-products-wrapper')
const basketWrapper = $('basket-wrapper')
const catalogWrapper = $('catalog')
const priceField = $('price')
const preloader = $('preloader')
const body = document.querySelector('body')

const setProductType = (e) => {
    const targetItem = e.target
    const nodeList = document.querySelectorAll('.product-type')

    if (!targetItem.classList.contains('active')) {
        switch (e.target.id) {
            case 'wreaths':
                PAGE_OPTIONS.currentList = WREATHS_LIST
                break

            case 'baskets':
                PAGE_OPTIONS.currentList = BASKETS_LIST
                break
        }

        nodeList.forEach((e) => {
            e.classList.remove('active')
        })

        targetItem.classList.add('active')
        productListCreator()
    }
}

const productListCreator = () => {
    const products = PAGE_OPTIONS.currentList.map((item) => (
        `<div class='product' id=${item.id}>
            <div class='photo-wrapper'>
                <picture>
                   <source srcset='./images/products/${item.type}/${item.name}.webp' type='image/webp'>
                   <img src='./images/products/${item.type}/${item.name}.jpg' alt=${item.name}>
                </picture>
            </div>
            <h3>${item.name}</h3>
            <p class='description'>${item.description}</p> 
            <div class='cost-wrapper'>
                <span id='discount-area-${item.id}'>
                    Общая стоимость: 
                    ${item.discountPercent ? `<span class='discount-flag'>-${item.discountPercent}%</span>` : ''} 
                </span>
                <span id='all-cost-${item.id}'>${item.allCost} BYN</span>
            </div>
            <div class='count-wrapper'>
                <span>Количество:</span>
                <div class='counter'>
                    <input type='number' id='count-${item.id}' value=${item.count} class='${item.type}'
                           oninput='onInputCounter(event)' onblur='onBlurCounter(event)'>
                    <img src='./images/minus.svg' alt='-' onclick='onButtonCounter(event)' id='${item.type}-${item.id}-down'>
                    <img src='./images/plus.svg' alt='+' onclick='onButtonCounter(event)' id='${item.type}-${item.id}-up'>
                </div>
            </div>
            <div class='button-wrapper' id='button-wrapper-${item.id}'>
                ${!item.inBasket ?
            `<button class='button' onclick='setToBasket(${item.id})'>Добавить в корзину</button>` :
            `<button class='button checked' onclick='removeFromBasket(event)' id='${item.type}-${item.id}-card-remove'>В корзине</button>`}
            </div>
        </div>`
    ))

    catalogWrapper.innerHTML = products.join('')
}

const basketListCreator = () => {
    const products = PAGE_OPTIONS.basketList.map((item) => (
        `<div class='basket-product' id='basket-${item.id}'>
            <div class='photo-wrapper'>
                <picture>
                   <source srcset='./images/products/${item.type}/${item.name}.webp' type='image/webp'>
                   <img src='./images/products/${item.type}/${item.name}.jpg' alt=${item.name}>
                </picture>
            </div>
            <div class='info-wrapper'>
                <h3>${item.name}</h3>
                <div class='cost-wrapper'>
                    <span id='basket-discount-area-${item.id}'>
                        Общая стоимость:
                        ${item.discountPercent ? `<span class='discount-flag'>-${item.discountPercent}%</span>` : ''} 
                    </span>
                    <span class='basket-all-cost' id='basket-all-cost-${item.id}'>${item.allCost} BYN</span>
                </div>
                <div class='count-wrapper'>
                    <span>Количество:</span>
                    <div class='counter'>
                        <input type='number' id='basket-count-${item.id}' value=${item.count} class='${item.type}'
                               oninput='onInputCounter(event)' onblur='onBlurCounter(event)'>
                        <img src='./images/minus.svg' alt='-' onclick='onButtonCounter(event)' id='${item.type}-${item.id}-down'>
                        <img src='./images/plus.svg' alt='+' onclick='onButtonCounter(event)' id='${item.type}-${item.id}-up'>
                    </div>
                </div>
            </div>
            <div class='remove-wrapper'>
                <img src='./images/remove.svg' alt='remove' onclick='removeFromBasket(event)' id='${item.type}-${item.id}-basket-remove'>
            </div>
        </div>`
    ))

    basketProductsWrapper.innerHTML = products.join('')
}

const onBlurCounter = (e) => {
    if (isNaN(parseInt(e.target.value))) {
        const typeOfProduct = e.target.className
        const id = e.target.id.replace('count-', '').replace('basket-', '')
        const basketProduct = PAGE_OPTIONS.basketList.find((item) => (item.id === +id))
        const currentProduct = getProductFromList(typeOfProduct, id)

        e.target.value = 1
        currentProduct.count = 1
        basketProduct ? basketProduct.count = 1 : null

        setCount(currentProduct, 1)

        if (basketProduct) {
            setCount(basketProduct, 1)
        }
    }
}

const onInputCounter = (e) => {
    const count = e.target.value
    const typeOfProduct = e.target.className
    const id = e.target.id.replace('count-', '').replace('basket-', '')
    const basketProduct = PAGE_OPTIONS.basketList.find((item) => (item.id === +id))
    const currentProduct = getProductFromList(typeOfProduct, id)

    setCount(currentProduct, +count)

    if (basketProduct) {
        setCount(basketProduct, +count)
    }
}

const onButtonCounter = (e) => {
    const infoArray = e.target.id.split('-')
    const typeOfProduct = infoArray[0]
    const id = infoArray[1]
    const direction = infoArray[2]

    const inputProduct = $(`count-${id}`)
    const inputBasket = $(`basket-count-${id}`)

    const basketProduct = PAGE_OPTIONS.basketList.find((item) => (item.id === +id))
    const currentProduct = getProductFromList(typeOfProduct, id)
    let count

    switch (direction) {
        case 'up':
            count = +currentProduct.count + 1
            break
        case 'down':
            count = +currentProduct.count - 1
            break
    }

    if (!count) {
        return
    }

    inputProduct ? inputProduct.value = count : null
    inputBasket ? inputBasket.value = count : null

    setCount(currentProduct, +count)

    if (basketProduct) {
        setCount(basketProduct, +count)
    }
}

const getProductFromList = (typeOfProduct, id) => {
    switch (typeOfProduct) {
        case 'wreath':
            const indexW = Number(id - 1)
            return  WREATHS_LIST[indexW]

        case 'basket':
            const indexB = Number(id - 1 - WREATHS_LIST.length)
            return  BASKETS_LIST[indexB]
    }
}

const setCount = (currentProduct, currentCount) => {
    const prevCount = currentProduct.count
    const inputProduct = $(`count-${currentProduct.id}`)
    const inputBasket = $(`basket-count-${currentProduct.id}`)
    const productInBasket = !!PAGE_OPTIONS.basketList.find((product) => (product.id === currentProduct.id))

    if (isNaN(currentCount) || currentCount === 0) {
        currentProduct.count = prevCount
        inputProduct && (inputProduct.value = '')
        inputBasket && (inputBasket.value = '')
        costControl(currentProduct, prevCount)
        return
    }

    if (currentCount > 9999) {
        currentProduct.count = prevCount
        inputProduct && (inputProduct.value = prevCount)
        inputBasket && (inputBasket.value = prevCount)
        costControl(currentProduct, prevCount)
        return
    }

    currentProduct.count = currentCount
    inputProduct && (inputProduct.value = currentCount)
    inputBasket && (inputBasket.value = currentCount)
    costControl(currentProduct, currentCount)

    if (productInBasket) {
        priceControl()
    }
}

const priceControl = () => {
    PAGE_OPTIONS.price = 0

    PAGE_OPTIONS.basketList.forEach((product) => {
        PAGE_OPTIONS.price += product.allCost
    })

    priceField.innerHTML = `${PAGE_OPTIONS.price.toFixed(2)} BYN`
}

const costControl = (currentProduct, count) => {
    const discountAreaCatalog = $(`discount-area-${currentProduct.id}`)
    const discountAreaBasket = $(`basket-discount-area-${currentProduct.id}`)
    const allCostCatalog = $(`all-cost-${currentProduct.id}`)
    const allCostBasket = $(`basket-all-cost-${currentProduct.id}`)

    // WITH DISCOUNT
    if (count >= 100) {
        currentProduct.discountPercent = 5
        currentProduct.allCost = +(currentProduct.cost * 0.95 * count).toFixed(2).replace('.00', '')
        discountAreaCatalog ?
            discountAreaCatalog.innerHTML = `Общая стоимость: <span class='discount-flag'>-${currentProduct.discountPercent}%</span>` : null
        discountAreaBasket ?
            discountAreaBasket.innerHTML = `Общая стоимость: <span class='discount-flag'>-${currentProduct.discountPercent}%</span>` : null
    } else {
        currentProduct.discountPercent = 0
        currentProduct.allCost = +(currentProduct.cost * count).toFixed(2).replace('.00', '')
        discountAreaCatalog ?
            discountAreaCatalog.innerHTML = 'Общая стоимость:' : null
        discountAreaBasket ?
            discountAreaBasket.innerHTML = 'Общая стоимость:' : null
    }

    allCostCatalog ?
        allCostCatalog.innerHTML = `${!count ? currentProduct.cost : currentProduct.allCost} BYN` : null
    allCostBasket ?
        allCostBasket.innerHTML = `${!count ? currentProduct.cost : currentProduct.allCost} BYN` : null
}

const setToBasket = (productId) => {
    const product = PAGE_OPTIONS.currentList.find((product) => (product.id === productId))
    const addButtonWrapper = $(`button-wrapper-${productId}`)

    product.inBasket = true
    addButtonWrapper.innerHTML = `<button class='button checked' onclick='removeFromBasket(event)' id='${product.type}-${product.id}-card-remove'>В корзине</button>`

    PAGE_OPTIONS.basketList = [...PAGE_OPTIONS.basketList, product]

    if (PAGE_OPTIONS.basketList.length && !basketButton.classList.contains('active')) {
        basketButton.classList.add('active')
    }

    priceControl()
    basketAnim()
    submitValidator()
}

const removeFromBasket = (e) => {
    const infoArray = e.target.id.split('-')
    const productType = infoArray[0]
    const productId = infoArray[1]
    const basketRemover = infoArray[2] === 'basket'

    const currentList = productType === 'wreath' ? WREATHS_LIST : BASKETS_LIST
    const productFromList = currentList.find((product) => (product.id === +productId))

    const addButtonWrapper = $(`button-wrapper-${productId}`)
    const basketProductCard = $(`basket-${productId}`)

    addButtonWrapper ? addButtonWrapper.innerHTML = `<button class='button' onclick={setToBasket(${productId})}>Добавить в корзину</button>` : ''
    basketProductCard && basketProductCard.remove()
    basketRemover && refreshProduct(productFromList)
    productFromList.inBasket = false

    PAGE_OPTIONS.basketList = PAGE_OPTIONS.basketList.filter((product) => (product.id !== +productId))

    if (!PAGE_OPTIONS.basketList.length) {
        !basketRemover && basketButton.classList.remove('active')
        basketProductsWrapper.innerHTML = `<div class='basket-product'><span class='empty-message'>Ваша корзина пуста</span></div>`
    }
    priceControl()
    submitValidator()
}

const refreshProduct = (product) => {
    product.inBasket = false
    product.count = 1
    product.allCost = product.cost
    product.discountPercent = 0
}

const basketAnim = () => {
    basketButton.classList.remove('animate')
    setTimeout(() => {
        basketButton.classList.add('animate')
    }, 10);
}

const basketHandler = (e) => {
    const classList = e.target.classList

    if (PAGE_OPTIONS.basketIsOpen) {
        productListCreator()
        classList.remove('opened')
        basketWrapper.classList.remove('opened')
        body.classList.remove('overflow')
        PAGE_OPTIONS.basketIsOpen = false

        if (!PAGE_OPTIONS.basketList.length) {
            basketButton.classList.remove('active')
        }
    } else {
        basketListCreator()
        classList.add('opened')
        basketWrapper.classList.add('opened')
        body.classList.add('overflow')
        PAGE_OPTIONS.basketIsOpen = true
    }
}

const formData = {
    companyName: null,
    email: null,
    phone: null,
    unp: null,

    country: null,
    city: null,
    index: null,
    address: null,

    bill: null,
    bank: null,
    bic: null,

    delivery: false,
    deliveryCountry: null,
    deliveryCity: null,
    deliveryIndex: null,
    deliveryAddress: null,
}

const getValue = (e) => {
    const value = e.target.value
    const id = e.target.id

    inputValidator(e.target)
    formData[id] = value

    if (value.length) {
        e.target.classList.add('active')
        return
    }

    e.target.classList.remove('active')
}

const inputValidator = (input) => {
    const isRequired = input.required
    const value = input.value

    if (isRequired && !value.length) {
        input.classList.add('error')
        return
    }

    input.classList.remove('error')
}

const deliveryHandler = (e) => {
    const deliveryWrapper = $('delivery-wrapper')
    const delivery = e.target.checked

    const inputArr = [$('deliveryCountry'), $('deliveryCity'), $('deliveryAddress')]
    inputArr.forEach((input) => {
        input.required = delivery
    })

    formData.delivery = delivery

    if (delivery) {
        deliveryWrapper.classList.remove('hidden')
        return
    }

    deliveryWrapper.classList.add('hidden')
}

const preloadHandler = (isActive) => {
    isActive ? preloader.classList.add('active') : preloader.classList.remove('active')
}

const privacyHandler = (e) => {
    PAGE_OPTIONS.privacyConfirmed = e.target.checked
    submitValidator()
}

const submitValidator = () => {
    const button = $('submit')

    if (!button) { return }

    if (!PAGE_OPTIONS.basketList.length || !PAGE_OPTIONS.privacyConfirmed) {
        button.classList.add('disabled')
        return
    }
    button.classList.remove('disabled')
}

const getOrderIndex = (e) => {
    e.preventDefault()

    const xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://api.countapi.xyz/hit/moth.by/order')
    xhr.responseType = 'json'
    xhr.onload = function () {
        console.log(`order index: ${this.response.value}`)
        preloadHandler(true)
        sendPayment(this.response.value)
    }
    xhr.send()
}

const openThanksPopup = () => {
    const popup = document.querySelector('.thanks-popup-wrapper')
    popup.classList.remove('hidden')
    preloadHandler(false)
}

const reloadPage = () => {
    document.location.reload()
}

const createDoc = (orderIndex) => {
    const {Packer, Document, Table, Paragraph, TextRun, ImageRun, WidthType, HeadingLevel, TableCell, TableRow,
        HorizontalPositionAlign, HorizontalPositionRelativeFrom, VerticalPositionAlign, VerticalPositionRelativeFrom,
        AlignmentType, VerticalAlign, BorderStyle} = docx

    const tableHeader = new TableRow({
        children: [
            new TableCell({
                children: [new Paragraph({
                    children: [new TextRun({
                        text: '№',
                        font: 'Arial',
                        bold: true,
                        size: 18
                    })],
                    spacing: {
                        before: 200,
                        after: 200
                    },
                    alignment: AlignmentType.CENTER,
                })],
                verticalAlign: VerticalAlign.CENTER,
                width: {size: 4, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
                children: [new Paragraph({
                    children: [new TextRun({
                        text: 'Наименование товара',
                        font: 'Arial',
                        bold: true,
                        size: 18
                    })],
                    spacing: {
                        before: 200,
                        after: 200
                    },
                    alignment: AlignmentType.CENTER,
                })],
                verticalAlign: VerticalAlign.CENTER,
                width: {size: 30, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
                children: [new Paragraph({
                    children: [new TextRun({
                        text: 'Кол-во (шт.)',
                        font: 'Arial',
                        bold: true,
                        size: 18
                    })],
                    spacing: {
                        before: 200,
                        after: 200
                    },
                    alignment: AlignmentType.CENTER,
                })],
                verticalAlign: VerticalAlign.CENTER,
                width: {size: 10, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
                children: [new Paragraph({
                    children: [new TextRun({
                        text: 'Цена',
                        font: 'Arial',
                        bold: true,
                        size: 18
                    })],
                    spacing: {
                        before: 200,
                        after: 200
                    },
                    alignment: AlignmentType.CENTER,
                })],
                verticalAlign: VerticalAlign.CENTER,
                width: {size:10, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
                children: [new Paragraph({
                    children: [new TextRun({
                        text: 'Сумма',
                        font: 'Arial',
                        bold: true,
                        size: 18
                    })],
                    spacing: {
                        before: 200,
                        after: 200
                    },
                    alignment: AlignmentType.CENTER,
                })],
                verticalAlign: VerticalAlign.CENTER,
                width: {size: 12, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
                children: [new Paragraph({
                    children: [new TextRun({
                        text: 'Ставка НДС, %',
                        font: 'Arial',
                        bold: true,
                        size: 18
                    })],
                    spacing: {
                        before: 200,
                        after: 200
                    },
                    alignment: AlignmentType.CENTER,
                })],
                verticalAlign: VerticalAlign.CENTER,
                width: {size: 10, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
                children: [new Paragraph({
                    children: [new TextRun({
                        text: 'Сумма \r НДС',
                        font: 'Arial',
                        bold: true,
                        size: 18
                    })],
                    spacing: {
                        before: 200,
                        after: 200
                    },
                    alignment: AlignmentType.CENTER,
                })],
                verticalAlign: VerticalAlign.CENTER,
                width: {size: 12, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
                children: [new Paragraph({
                    children: [new TextRun({
                        text: 'Всего с НДС',
                        font: 'Arial',
                        bold: true,
                        size: 18
                    })],
                    spacing: {
                        before: 200,
                        after: 200
                    },
                    alignment: AlignmentType.CENTER,
                })],
                verticalAlign: VerticalAlign.CENTER,
                width: {size: 12, type: WidthType.PERCENTAGE },
            }),
        ],
    })
    const tableBody = [tableHeader]

    PAGE_OPTIONS.basketList.forEach((product, index) => {
        tableBody.push(new TableRow({
            children: [
                new TableCell({
                    children: [new Paragraph({
                        children: [new TextRun({
                            text: (index + 1).toString(),
                            font: 'Arial'
                        })],
                        spacing: {
                            before: 100,
                            after: 100
                        },
                        alignment: AlignmentType.CENTER,
                    })],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {size: 4, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                    children: [new Paragraph({
                        children: [new TextRun({
                            text: product.name,
                            font: 'Arial'
                        })],
                        spacing: {
                            before: 200,
                            after: 200
                        },
                        alignment: AlignmentType.CENTER,
                    })],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {size: 30, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                    children: [new Paragraph({
                        children: [new TextRun({
                            text: product.count.toString(),
                            font: 'Arial'
                        })],
                        spacing: {
                            before: 200,
                            after: 200
                        },
                        alignment: AlignmentType.CENTER,
                    })],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {size: 10, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                    children: [new Paragraph({
                        children: [new TextRun({
                            text: product.cost.toFixed(2).toString(),
                            font: 'Arial'
                        })],
                        spacing: {
                            before: 200,
                            after: 200
                        },
                        alignment: AlignmentType.CENTER,
                    })],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {size:10, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                    children: [new Paragraph({
                        children: [new TextRun({
                            text: product.allCost.toFixed(2).toString(),
                            font: 'Arial'
                        })],
                        spacing: {
                            before: 200,
                            after: 200
                        },
                        alignment: AlignmentType.CENTER,
                    })],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {size: 12, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                    children: [new Paragraph({
                        children: [new TextRun({
                            text: '20%',
                            font: 'Arial'
                        })],
                        spacing: {
                            before: 200,
                            after: 200
                        },
                        alignment: AlignmentType.CENTER,
                    })],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {size: 10, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                    children: [new Paragraph({
                        children: [new TextRun({
                            text: (product.allCost * 0.2).toFixed(2).toString(),
                            font: 'Arial'
                        })],
                        spacing: {
                            before: 200,
                            after: 200
                        },
                        alignment: AlignmentType.CENTER,
                    })],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {size: 12, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                    children: [new Paragraph({
                        children: [new TextRun({
                            text: (product.allCost + product.allCost * 0.2).toFixed(2).toString(),
                            font: 'Arial'
                        })],
                        spacing: {
                            before: 200,
                            after: 200
                        },
                        alignment: AlignmentType.CENTER,
                    })],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {size: 12, type: WidthType.PERCENTAGE },
                }),
            ],
        }))
    })

    const tableFooter = new TableRow({
        children: [
            new TableCell({
                children: [
                    new Paragraph({
                        text: '',
                        spacing: {
                            after: 30,
                            before: 30
                        },
                        alignment: AlignmentType.CENTER,
                    })],
                verticalAlign: VerticalAlign.CENTER,
                width: {size: 4, type: WidthType.PERCENTAGE },
                borders: {
                    top: {
                        style: BorderStyle.NONE,
                        color: 'white'
                    },
                    bottom: {
                        style: BorderStyle.NONE,
                        color: 'white'
                    },
                    left: {
                        style: BorderStyle.NONE,
                        color: 'white'
                    },
                    right: {
                        style: BorderStyle.NONE,
                        color: 'white'
                    },
                },
            }),
            new TableCell({
                children: [new Paragraph({
                    text: '',
                    spacing: {
                        after: 30,
                        before: 30
                    },
                    alignment: AlignmentType.CENTER,
                })],
                verticalAlign: VerticalAlign.CENTER,
                width: {size: 30, type: WidthType.PERCENTAGE },
                borders: {
                    top: {
                        style: BorderStyle.NONE,
                        color: 'white'
                    },
                    bottom: {
                        style: BorderStyle.NONE,
                        color: 'white'
                    },
                    left: {
                        style: BorderStyle.NONE,
                        color: 'white'
                    },
                    right: {
                        style: BorderStyle.NONE,
                        color: 'white'
                    },
                },
            }),
            new TableCell({
                children: [new Paragraph({
                    text: '',
                    spacing: {
                        after: 30,
                        before: 30
                    },
                    alignment: AlignmentType.CENTER,
                })],
                verticalAlign: VerticalAlign.CENTER,
                width: {size: 10, type: WidthType.PERCENTAGE },
                borders: {
                    top: {
                        style: BorderStyle.NONE,
                        color: 'white'
                    },
                    bottom: {
                        style: BorderStyle.NONE,
                        color: 'white'
                    },
                    left: {
                        style: BorderStyle.NONE,
                        color: 'white'
                    },
                    right: {
                        style: BorderStyle.NONE,
                        color: 'white'
                    },
                },
            }),
            new TableCell({
                children: [new Paragraph({
                    children: [new TextRun({
                        text: 'Итого:',
                        font: 'Arial',
                        bold: true
                    })],
                    spacing: {
                        after: 30,
                        before: 30
                    },
                    alignment: AlignmentType.CENTER,
                })],
                verticalAlign: VerticalAlign.CENTER,
                width: {size: 10, type: WidthType.PERCENTAGE },
                borders: {
                    top: {
                        style: BorderStyle.NONE,
                        color: 'white'
                    },
                    bottom: {
                        style: BorderStyle.NONE,
                        color: 'white'
                    },
                    left: {
                        style: BorderStyle.NONE,
                        color: 'white'
                    },
                    right: {
                        style: BorderStyle.NONE,
                        color: 'white'
                    },
                },

            }),
            new TableCell({
                children: [new Paragraph({
                    children: [new TextRun({
                        text: PAGE_OPTIONS.price.toFixed(2).toString(),
                        font: 'Arial',
                        bold: true
                    })],
                    spacing: {
                        after: 30,
                        before: 30
                    },
                    alignment: AlignmentType.CENTER,
                })],
                verticalAlign: VerticalAlign.CENTER,
                width: {size: 12, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
                children: [new Paragraph({
                    text: '',
                    spacing: {
                        after: 30,
                        before: 30
                    },
                    alignment: AlignmentType.CENTER,
                })],
                verticalAlign: VerticalAlign.CENTER,
                width: {size: 10, type: WidthType.PERCENTAGE },
                borders: {
                    top: {
                        style: BorderStyle.NONE,
                        color: 'white'
                    },
                    bottom: {
                        style: BorderStyle.NONE,
                        color: 'white'
                    },
                    left: {
                        style: BorderStyle.NONE,
                        color: 'white'
                    },
                    right: {
                        style: BorderStyle.NONE,
                        color: 'white'
                    },
                }
            }),
            new TableCell({
                children: [new Paragraph({
                    children: [new TextRun({
                        text: (PAGE_OPTIONS.price * 0.2).toFixed(2).toString(),
                        font: 'Arial',
                        bold: true
                    })],
                    spacing: {
                        after: 30,
                        before: 30
                    },
                    alignment: AlignmentType.CENTER,
                })],
                verticalAlign: VerticalAlign.CENTER,
                width: {size: 12, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
                children: [new Paragraph({
                    children: [new TextRun({
                        text: (PAGE_OPTIONS.price + PAGE_OPTIONS.price * 0.2).toFixed(2).toString(),
                        font: 'Arial',
                        bold: true
                    })],
                    spacing: {
                        after: 30,
                        before: 30
                    },
                    alignment: AlignmentType.CENTER,
                })],
                verticalAlign: VerticalAlign.CENTER,
                width: {size: 12, type: WidthType.PERCENTAGE },
            }),
        ],
    })
    tableBody.push(tableFooter)

    const table = new Table({
        rows: tableBody
    })

    const info1 = new Paragraph({
        children: [
            new TextRun({
                text: 'ООО «Мос Солюшнс», УНП 193479009',
                color: '#000000',
                font: 'Arial',
                size: 21,
                bold: true
            })
        ],
        alignment: AlignmentType.LEFT,
        heading: HeadingLevel.HEADING_3,
        spacing: {
            after: 50,
        },
    })
    const info2 = new Paragraph({
        children: [
            new TextRun({
                text: 'РБ, г. Минск, пер. С. Ковалевской, 62',
                color: '#000000',
                font: 'Arial',
                size: 21,
                bold: true
            }),
        ],
        alignment: AlignmentType.LEFT,
        heading: HeadingLevel.HEADING_3,
        spacing: {
            after: 50,
        },
    })
    const info3 = new Paragraph({
        children: [
            new TextRun({
                text: 'Р/c BY35PJCB30120644421000000933',
                color: '#000000',
                font: 'Arial',
                size: 21,
                bold: true
            }),
        ],
        alignment: AlignmentType.LEFT,
        heading: HeadingLevel.HEADING_3,
        spacing: {
            after: 50,
        },
    })
    const info4 = new Paragraph({
        children: [
            new TextRun({
                text: 'в "Приорбанк" ОАО, БИК PJCBBY2X,',
                color: '#000000',
                font: 'Arial',
                size: 21,
                bold: true
            }),
        ],
        alignment: AlignmentType.LEFT,
        heading: HeadingLevel.HEADING_3,
        spacing: {
            after: 50
        },
    })
    const info5 = new Paragraph({
        children: [
            new TextRun({
                text: 'г. Минск, пр-т Дзержинского, 104',
                color: '#000000',
                font: 'Arial',
                size: 21,
                bold: true
            }),
        ],
        alignment: AlignmentType.LEFT,
        heading: HeadingLevel.HEADING_3,
        spacing: {
            after: 50,
        },
    })
    const image = new Paragraph({
        children: [
            new ImageRun({
                data: 'data:image/jpeg;base64,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',
                transformation: {
                    width: 90,
                    height: 90,
                },
                floating: {
                    horizontalPosition: {
                        relative: HorizontalPositionRelativeFrom.MARGIN,
                        align: HorizontalPositionAlign.RIGHT,
                    },
                    verticalPosition: {
                        relative: VerticalPositionRelativeFrom.MARGIN,
                        align: VerticalPositionAlign.TOP,
                    },
                },

            }),
        ],
    })
    const billTitle = new Paragraph({
        children: [
            new TextRun({
                text: `Счет №${orderIndex} от ${dateProvider()} г.`,
                bold: true,
                color: '#000000',
                font: 'Arial'
            }),
        ],
        alignment: AlignmentType.CENTER,
        heading: HeadingLevel.HEADING_1,
        spacing: {
            after: 600,
            before: 600
        },
    })
    const payerInfo = new Paragraph({
        children: [
            new TextRun({
                text: `Плательщик: ${formData.companyName}, `,
                font: 'Arial',
                italics: true,
                bold: true
            }),
            new TextRun({
                text: `УНП: ${formData.unp}, адрес: `,
                font: 'Arial',
                italics: true,
                bold: true
            }),
            new TextRun({
                text: `${formData.index ? `${formData.index}, ` : ''}`,
                font: 'Arial',
                italics: true,
                bold: true
            }),
            new TextRun({
                text: `${formData.country ? `${formData.country}` : ''}`,
                font: 'Arial',
                italics: true,
                bold: true
            }),
            new TextRun({
                text: `${formData.city ? `, ${formData.city}` : ''}`,
                font: 'Arial',
                italics: true,
                bold: true
            }),
            new TextRun({
                text: `${formData.address ? `, ${formData.address}` : ''}`,
                font: 'Arial',
                italics: true,
                bold: true
            }),
            new TextRun({
                text: `${formData.phone ? `, тел: ${formData.phone}` : ''}`,
                font: 'Arial',
                italics: true,
                bold: true
            }),
        ],
        alignment: AlignmentType.LEFT,
        spacing: {
            line: 300,
        },
    })
    const bankInfo = new Paragraph({
        children: [
            new TextRun({
                text: `Р/сч: ${formData.bill} `,
                font: 'Arial',
                italics: true,
                bold: true
            }),
            new TextRun({
                text: `в ${formData.bank} `,
                font: 'Arial',
                italics: true,
                bold: true
            }),
            new TextRun({
                text: `код ${formData.bic}`,
                font: 'Arial',
                italics: true,
                bold: true
            }),
        ],
        alignment: AlignmentType.LEFT,
        spacing: {
            after: 300,
        }
    })
    const purpose  = new Paragraph({
        children: [
            new TextRun({
                text: `Цель приобретения: Для собственного производства и/или потребления`,
                font: 'Arial',
                italics: true
            }),
        ],
        alignment: AlignmentType.LEFT,
        spacing: {
            after: 60,
        },
    })
    const validTime  = new Paragraph({
        children: [
            new TextRun({
                text: `Счет действителен в течение трех банковских дней`,
                font: 'Arial',
                italics: true
            }),
        ],
        alignment: AlignmentType.LEFT,
        spacing: {
            after: 300,
        },
    })
    const sumNDS  = new Paragraph({
        children: [
            new TextRun({
                text: `Сумма НДС: ${rubles((PAGE_OPTIONS.price * .2).toFixed(2))}`,
                font: 'Arial',
                bold: true
            }),
        ],
        alignment: AlignmentType.LEFT,
        spacing: {
            after: 200,
            before: 500
        },
    })
    const sumAll  = new Paragraph({
        children: [
            new TextRun({
                text: `Всего к оплате с НДС: ${rubles((PAGE_OPTIONS.price + PAGE_OPTIONS.price * .2).toFixed(2))}`,
                font: 'Arial',
                bold: true
            }),
        ],
        alignment: AlignmentType.LEFT,
    })
    const owner  = new Paragraph({
        children: [
            new TextRun({
                text: `Директор __________________ (Странадкина Е.С.)`,
                font: 'Arial',
                bold: true
            }),
        ],
        alignment: AlignmentType.LEFT,
        spacing: {
            before: 1500
        },
    })

    const doc = new Document({
        creator: 'Moth.by',
        title: `Счет №${orderIndex}`,
        sections: [
            {
                children: [
                    info1,
                    info2,
                    info3,
                    info4,
                    info5,
                    image,
                    billTitle,
                    payerInfo,
                    bankInfo,
                    purpose,
                    validTime,
                    table,
                    sumNDS,
                    sumAll,
                    owner,
            ]
        }]
    })

    Packer.toBlob(doc).then(blob => {
        saveAs(blob, `Заказ №${orderIndex}.docx`)
    })

    return doc
}

const sendPayment = async (orderIndex) => {
    const createdFile =  await docx.Packer.toBase64String(createDoc(orderIndex)).then(base64file => {
        return base64file
    })

    const emailClient =
        `<center>
            <table border='0' cellpadding='0' cellspacing='0' width='100%'
                   style='font-family: Arial, sans-serif; font-size: 14px; width: 100%; max-width: 980px; margin: 0 auto; padding: 0; border-collapse: collapse;'>
                <thead>
                    <tr>
                        <th align='left' colspan='10'>
                            <img src='https://moth.by/images/ms.jpg'
                                width='600'
                                style="max-width:600px;padding-bottom:0;display:inline!important;vertical-align:bottom;border:0;height:auto;outline:none;text-decoration:none"
                                alt='logo'/>
                        </th>
                        <th align='right' colspan='5' style='text-align: right; font-size: 14px'>
                            <p>+375 (29) 666-39-93</p>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr style='height: 32px; width: 100%'></tr>
                    <tr>
                        <td colspan='15' style='padding: 0'>
                            <span style='font-size: 14px'>Благодарим за интерес к нашей продукции! Ваш заказ получен и поступит в обработку в ближайшее время.</span>
                        </td>
                    </tr>
                    <tr style='height: 24px; width: 100%'></tr>
                    <tr>
                        <td colspan='15' style='background: #F8F8F8; padding: 12px; text-align: left; border: 1px solid #D8D8D8;'>
                            <b>Детализация заказа</b>
                        </td>
                    </tr>
                    <tr>
                        <td colspan='10' valign='top' style='min-width: 70%; border: 1px solid #D8D8D8; border-collapse: collapse; padding: 12px 12px 12px 12px'>
                            <p style='margin: 0; margin-bottom: 12px'><b>№ заказа:</b> ${orderIndex}</p>
                            <p style='margin: 0; margin-bottom: 12px'><b>Дата заказа:</b> ${dateProvider()}</p>
                            <p style='margin: 0; margin-bottom: 12px'><b>Доставка:</b> ${formData.delivery ? 'Да' : 'Нет'}</p>
                            ${formData.delivery ?
                                `<div>
                                    <p style='margin: 0; margin-bottom: 12px'><b>Адрес доставки:</b></p>
                                    <p style='margin: 0;'>${formData.deliveryCountry + ', '}${formData.deliveryCity + ', '}${formData.deliveryIndex ? formData.deliveryIndex + ', ' : ''}${formData.deliveryAddress}</p>
                                </div>` : ''}
                        </td>
                        <td colspan='5' valign='top' style='border: 1px solid #D8D8D8; border-collapse: collapse; padding: 12px 12px 12px 12px'>
                            <p style='margin: 0; margin-bottom: 12px'><b>Телефон:</b> ${formData.phone ? formData.phone : ''}</p>
                            <p style='margin: 0; margin-bottom: 12px'><b>Email:</b> ${formData.email}</p>
                        </td>
                    </tr>
                    <tr style='height: 24px; width: 100%'></tr>
                    <tr>
                        <td colspan='8' style='background: #F8F8F8; padding: 12px; text-align: left; border: 1px solid #D8D8D8;'>
                            <b>Название товара</b>
                        </td>
                        <td colspan='1' style='background: #F8F8F8; padding: 12px; text-align: center; border: 1px solid #D8D8D8;'>
                            <b>Кол-во (шт.)</b>
                        </td>
                        <td colspan='3' style='background: #F8F8F8; padding: 12px; text-align: right; border: 1px solid #D8D8D8;'>
                            <b>Цена</b>
                        </td>
                        <td colspan='3' style='background: #F8F8F8; padding: 12px; text-align: right; border: 1px solid #D8D8D8;'>
                            <b>Итого</b>
                        </td>
                    </tr>
                    ${PAGE_OPTIONS.basketList.map((item) => (
                        `<tr>
                            <td colspan='8' style='padding: 12px; text-align: left; border: 1px solid #D8D8D8;'>
                                <span>${item.name}</span>
                            </td>
                            <td colspan='1' style='padding: 12px; text-align: center; border: 1px solid #D8D8D8;'>
                                <span>${item.count}</span>
                            </td>
                            <td colspan='3' style=' padding: 12px; text-align: right; border: 1px solid #D8D8D8;'>
                                <span>${item.cost} BYN</span>
                            </td>
                            <td colspan='3' style='padding: 12px; text-align: right; border: 1px solid #D8D8D8;'>
                                <span>${item.allCost} BYN</span>
                            </td>
                        </tr>`)).join('')}
                    <tr>
                        <td colspan='12' style='padding: 12px; text-align: right; border: 1px solid #D8D8D8;'>
                            <b>Итого:</b>
                        </td>
                        <td colspan='3' style='padding: 12px; text-align: right; border: 1px solid #D8D8D8;'>
                            <b>${PAGE_OPTIONS.price.toFixed(2)} BYN</b>
                        </td>
                    </tr>
                    <tr style='height: 24px; width: 100%'></tr>
                    <tr>
                        <td colspan='15' style='padding: 0'>
                            <p style='font-size: 14px'>Цена указана без учета НДС</p>
                            <p style='font-size: 14px'>Если у Вас есть какие-либо вопросы, ответьте на это сообщение или позвоните нам.</p>
                        </td>
                    </tr>
                    <tr style='height: 12px; width: 100%'></tr>
                </tbody>
            </table>
        </center>`

    const emailBussiness =
        `<center>
            <table border='0' cellpadding='0' cellspacing='0' width='100%'
                   style='font-family: Arial, sans-serif; font-size: 14px; width: 100%; max-width: 980px; margin: 0 auto; padding: 0; border-collapse: collapse;'>
                <thead>
                    <tr>
                        <th align='left' colspan='15'>
                            <img src='https://moth.by/images/ms.jpg'
                                width='600'
                                style="max-width:600px;padding-bottom:0;display:inline!important;vertical-align:bottom;border:0;height:auto;outline:none;text-decoration:none"
                                alt='logo'/>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr style='height: 32px; width: 100%'></tr>
                    <tr>
                        <td colspan='15' style='background: #F8F8F8; padding: 12px; text-align: left; border: 1px solid #D8D8D8;'>
                            <b>Детализация заказа</b>
                        </td>
                    </tr>
                    <tr>
                        <td colspan='10' valign='top' style='min-width: 70%; border: 1px solid #D8D8D8; border-collapse: collapse; padding: 12px 12px 12px 12px'>
                            <p style='margin: 0; margin-bottom: 12px'><b>№ заказа:</b> ${orderIndex}</p>
                            <p style='margin: 0; margin-bottom: 12px'><b>Дата заказа:</b> ${dateProvider()}</p>
                            <p style='margin: 0; margin-bottom: 12px'><b>Доставка:</b> ${formData.delivery ? 'Да' : 'Нет'}</p>
                            ${formData.delivery ?
                                `<div>
                                    <p style='margin: 0; margin-bottom: 12px'><b>Адрес доставки:</b></p>
                                    <p style='margin: 0;'>${formData.deliveryCountry + ', '}${formData.deliveryCity + ', '}${formData.deliveryIndex ? formData.deliveryIndex + ', ' : ''}${formData.deliveryAddress}</p>
                                </div>` : ''}
                        </td>
                        <td colspan='5' valign='top' style='border: 1px solid #D8D8D8; border-collapse: collapse; padding: 12px 12px 12px 12px'>
                            <p style='margin: 0; margin-bottom: 12px'><b>Телефон:</b> ${formData.phone ? formData.phone : ''}</p>
                            <p style='margin: 0; margin-bottom: 12px'><b>Email:</b> ${formData.email}</p>
                            <p style='margin: 0; margin-bottom: 12px'><b>Название компании:</b></p>
                            <p style='margin: 0;'>${formData.companyName}</p>
                        </td>
                    </tr>
                    <tr style='height: 24px; width: 100%'></tr>
                    <tr>
                        <td colspan='8' style='background: #F8F8F8; padding: 12px; text-align: left; border: 1px solid #D8D8D8;'>
                            <b>Название товара</b>
                        </td>
                        <td colspan='1' style='background: #F8F8F8; padding: 12px; text-align: center; border: 1px solid #D8D8D8;'>
                            <b>Кол-во (шт.)</b>
                        </td>
                        <td colspan='3' style='background: #F8F8F8; padding: 12px; text-align: right; border: 1px solid #D8D8D8;'>
                            <b>Цена</b>
                        </td>
                        <td colspan='3' style='background: #F8F8F8; padding: 12px; text-align: right; border: 1px solid #D8D8D8;'>
                            <b>Итого</b>
                        </td>
                    </tr>
                    ${PAGE_OPTIONS.basketList.map((item) => (
                        `<tr>
                            <td colspan='8' style='padding: 12px; text-align: left; border: 1px solid #D8D8D8;'>
                                <span>${item.name}</span>
                            </td>
                            <td colspan='1' style='padding: 12px; text-align: center; border: 1px solid #D8D8D8;'>
                                <span>${item.count}</span>
                            </td>
                            <td colspan='3' style=' padding: 12px; text-align: right; border: 1px solid #D8D8D8;'>
                                <span>${item.cost} BYN</span>
                            </td>
                            <td colspan='3' style='padding: 12px; text-align: right; border: 1px solid #D8D8D8;'>
                                <span>${item.allCost} BYN</span>
                            </td>
                        </tr>`)).join('')}
                    <tr>
                        <td colspan='12' style='padding: 12px; text-align: right; border: 1px solid #D8D8D8;'>
                            <b>Итого:</b>
                        </td>
                        <td colspan='3' style='padding: 12px; text-align: right; border: 1px solid #D8D8D8;'>
                            <b>${PAGE_OPTIONS.price.toFixed(2)} BYN</b>
                        </td>
                    </tr>
                    <tr style='height: 24px; width: 100%'></tr>
                    <tr>
                        <td colspan='15' style='padding: 0'>
                            <p style='font-size: 14px'>Цена указана без учета НДС</p>
                        </td>
                    </tr>
                    <tr style='height: 12px; width: 100%'></tr>
                </tbody>
            </table>
        </center>`

    Email.send({
        SecureToken: 'cbf761d5-b401-40a3-b789-fdddf5ff3705',
        To: 'moth.by@gmail.com',
        From: 'website@gmail.com',
        Subject: `Заказ №${orderIndex}`,
        Body: emailBussiness,
        Attachments: [{
            name: `Заказ №${orderIndex}.docx`,
            data: createdFile
        }]
    }).then(message => {
        console.log(message)
        console.log('--------- bussiness ---------')
    })

    Email.send({
        SecureToken: 'cbf761d5-b401-40a3-b789-fdddf5ff3705',
        To: formData.email,
        From: 'moth.by@gmail.com',
        Subject: `Ваш заказ №${orderIndex}`,
        Body: emailClient,
        Attachments: [{
            name: `Заказ №${orderIndex}.docx`,
            data: createdFile
        }]
    }).then(message => {
        console.log(message)
        console.log('--------- client ---------')
        openThanksPopup()
    })
}
