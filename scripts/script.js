//// Admin part ////
const WREATHS = [
    {
        name: 'В5 (Венок)',
        description: 'Краткое описание продукта',
        cost: 5
    },
    {
        name: 'В2 (Венок)',
        description: 'Краткое описание продукта',
        cost: 2
    },
    {
        name: 'В7 (Венок)',
        description: 'Краткое описание продукта',
        cost: 7
    },
    {
        name: 'В9 (Венок)',
        description: 'Краткое описание продукта',
        cost: 5
    },
    {
        name: 'В11 (Венок)',
        description: 'Краткое описание продукта',
        cost: 2
    },
    {
        name: 'В8 (Венок)',
        description: 'Краткое описание продукта',
        cost: 7
    }
]
const BASKETS = [
    {
        name: 'К5 (Куранты)',
        description: 'Краткое описание продукта',
        cost: 5
    },
    {
        name: 'К11 (Куранты)',
        description: 'Краткое описание продукта',
        cost: 1,
    },
    {
        name: 'К8 (Куранты)',
        description: 'Краткое описание продукта',
        cost: 8
    },
    {
        name: 'К3 (Куранты)',
        description: 'Краткое описание продукта',
        cost: 5
    },
    {
        name: 'К1 (Куранты)',
        description: 'Краткое описание продукта',
        cost: 1,
    },
    {
        name: 'К9 (Куранты)',
        description: 'Краткое описание продукта',
        cost: 8
    }
]

//// Logic part ////
document.addEventListener('DOMContentLoaded', () => {
    dataCreator()
    productListCreator()
})

let WREATHS_LIST
let BASKETS_LIST
let timer

debounce = (func, ms) => {
    clearTimeout(timer)
    timer = setTimeout(func, ms)
}

$ = (id) => {
    return document.getElementById(id)
}

dateProvider = () => {
    const monthNamess = ["января", "февраля", "марта", "апреля", "мая", "июня",
        "июля", "августа", "сентября", "октября", "ноября", "декабря"]
    const dateObj = new Date()
    const month = monthNamess[dateObj.getMonth()]
    const day = String(dateObj.getDate()).padStart(2, '0')
    const year = dateObj.getFullYear()
    const output = day + '\n' + month + ',' + year

    return output
}

dataCreator = () => {
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
    price: 0
}

const basketButton = $('basket-button')
const basketProductsWrapper = $('basket-products-wrapper')
const basketWrapper = $('basket-wrapper')
const catalogWrapper = $('catalog')
const priceField = $('price')
const preloader = $('preloader')
const body = document.querySelector('body')

setProductType = (e) => {
    const id = e.target.id
    const targetItem = $(id)
    const nodeList = document.querySelectorAll('.product-type')

    switch (id) {
        case 'wreaths':
            PAGE_OPTIONS.currentList = WREATHS_LIST
            break

        case 'baskets':
            PAGE_OPTIONS.currentList = BASKETS_LIST
            break

        default:
            PAGE_OPTIONS.currentList = null
            break
    }

    if (!targetItem.classList.contains('active')) {
        nodeList.forEach((e) => {
            e.classList.remove('active')
        })

        targetItem.classList.add('active')
        productListCreator()
    }
}

productListCreator = () => {
    const products = PAGE_OPTIONS.currentList.map((item) => (
        `<div class='product' id=${item.id}>
            <div class='photo-wrapper'></div>
            <h3>${item.name}</h3>
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

basketListCreator = () => {
    const products = PAGE_OPTIONS.basketList.map((item) => (
        `<div class='basket-product' id='basket-${item.id}'>
            <div class='photo-wrapper'></div>
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

onBlurCounter = (e) => {
    if (isNaN(parseInt(e.target.value))) {
        const typeOfProduct = e.target.className
        const id = e.target.id.replace('count-', '').replace('basket-', '')
        const basketProduct = PAGE_OPTIONS.basketList.filter((item) => (item.id === +id))[0]
        let currentProduct

        switch (typeOfProduct) {
            case 'wreath':
                currentProduct = WREATHS_LIST.filter((item) => (item.id === +id))[0]
                break
            case 'basket':
                currentProduct = BASKETS_LIST.filter((item) => (item.id === +id))[0]
                break
        }

        e.target.value = 1
        currentProduct.count = 1
        basketProduct ? basketProduct.count = 1 : null

        setCount(currentProduct, 1)

        if (basketProduct) {
            setCount(basketProduct, 1)
        }
    }
}

onInputCounter = (e) => {
    const count = e.target.value
    const typeOfProduct = e.target.className
    const id = e.target.id.replace('count-', '').replace('basket-', '')
    const basketProduct = PAGE_OPTIONS.basketList.filter((item) => (item.id === +id))[0]
    let currentProduct

    switch (typeOfProduct) {
        case 'wreath':
            currentProduct = WREATHS_LIST.filter((item) => (item.id === +id))[0]
            break
        case 'basket':
            currentProduct = BASKETS_LIST.filter((item) => (item.id === +id))[0]
            break
    }

    setCount(currentProduct, +count)

    if (basketProduct) {
        setCount(basketProduct, +count)
    }
}

onButtonCounter = (e) => {
    const infoArray = e.target.id.split('-')
    const typeOfProduct = infoArray[0]
    const id = infoArray[1]
    const direction = infoArray[2]

    const inputProduct = $(`count-${id}`)
    const inputBasket = $(`basket-count-${id}`)

    const basketProduct = PAGE_OPTIONS.basketList.filter((item) => (item.id === +id))[0]
    let currentProduct
    let count

    switch (typeOfProduct) {
        case 'wreath':
            currentProduct = WREATHS_LIST.filter((item) => (item.id === +id))[0]
            break
        case 'basket':
            currentProduct = BASKETS_LIST.filter((item) => (item.id === +id))[0]
            break
    }

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

setCount = (currentProduct, currentCount) => {
    const prevCount = currentProduct.count
    const inputProduct = $(`count-${currentProduct.id}`)
    const inputBasket = $(`basket-count-${currentProduct.id}`)
    const productInBasket = !!PAGE_OPTIONS.basketList.filter((product) => (product.id === currentProduct.id))[0]

    if (isNaN(currentCount) || currentCount === 0) {
        currentProduct.count = prevCount
        inputProduct ? inputProduct.value = '' : null
        inputBasket ? inputBasket.value = '' : null
        costControl(currentProduct, prevCount)
        return
    }

    if (currentCount > 9999) {
        currentProduct.count = prevCount
        inputProduct ? inputProduct.value = prevCount : null
        inputBasket ? inputBasket.value = prevCount : null
        costControl(currentProduct, prevCount)
        return
    }

    currentProduct.count = currentCount
    inputProduct ? inputProduct.value = currentCount : null
    inputBasket ? inputBasket.value = currentCount : null
    costControl(currentProduct, currentCount)

    if (productInBasket) {
        priceControl()
    }
}

priceControl = () => {
    PAGE_OPTIONS.price = 0

    PAGE_OPTIONS.basketList.forEach((product) => {
        PAGE_OPTIONS.price += product.allCost
    })

    priceField.innerHTML = `${PAGE_OPTIONS.price.toFixed(2)} BYN`
}

costControl = (currentProduct, count) => {
    const discountAreaCatalog = $(`discount-area-${currentProduct.id}`)
    const discountAreaBasket = $(`basket-discount-area-${currentProduct.id}`)
    const allCostCatalog = $(`all-cost-${currentProduct.id}`)
    const allCostBasket = $(`basket-all-cost-${currentProduct.id}`)

    if (count >= 100) {
        currentProduct.discountPercent = 10
        currentProduct.allCost = +(currentProduct.cost * 0.9 * count).toFixed(2).replace('.00', '')
        discountAreaCatalog ? discountAreaCatalog.innerHTML = `Общая стоимость: <span class='discount-flag'>-${currentProduct.discountPercent}%</span>` : null
        discountAreaBasket ? discountAreaBasket.innerHTML = `Общая стоимость: <span class='discount-flag'>-${currentProduct.discountPercent}%</span>` : null
    } else if (count >= 50) {
        currentProduct.discountPercent = 5
        currentProduct.allCost = +(currentProduct.cost * 0.95 * count).toFixed(2).replace('.00', '')
        discountAreaCatalog ? discountAreaCatalog.innerHTML = `Общая стоимость: <span class='discount-flag'>-${currentProduct.discountPercent}%</span>` : null
        discountAreaBasket ? discountAreaBasket.innerHTML = `Общая стоимость: <span class='discount-flag'>-${currentProduct.discountPercent}%</span>` : null
    } else {
        currentProduct.discountPercent = 0
        currentProduct.allCost = +(currentProduct.cost * count)
        discountAreaCatalog ? discountAreaCatalog.innerHTML = 'Общая стоимость:' : null
        discountAreaBasket ? discountAreaBasket.innerHTML = 'Общая стоимость:' : null
    }

    allCostCatalog ? allCostCatalog.innerHTML = `${!count ? currentProduct.cost : currentProduct.allCost} BYN` : null
    allCostBasket ? allCostBasket.innerHTML = `${!count ? currentProduct.cost : currentProduct.allCost} BYN` : null
}

setToBasket = (productId) => {
    const product = PAGE_OPTIONS.currentList.filter((product) => (product.id === productId))[0]
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

removeFromBasket = (e) => {
    const infoArray = e.target.id.split('-')
    const productType = infoArray[0]
    const productId = infoArray[1]
    const basketRemover = infoArray[2] === 'basket'

    const currentList = productType === 'wreath' ? WREATHS_LIST : BASKETS_LIST
    const productFromList = currentList.filter((product) => (product.id === +productId))[0]

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

refreshProduct = (product) => {
    product.inBasket = false
    product.count = 1
    product.allCost = product.cost
    product.discountPercent = 0
}

basketAnim = () => {
    basketButton.classList.remove('animate')
    setTimeout(() => {
        basketButton.classList.add('animate')
    }, 10);
}

basketHandler = (e) => {
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
    phone: null,
    email: null,
    delivery: false,
    country: null,
    city: null,
    index: null,
    address: null
}

getValue = (e) => {
    const value = e.target.value
    const id = e.target.id

    debounce(() => {
        inputValidator(e.target)
        formData[id] = value
    }, 200)

    if (value.length) {
        e.target.classList.add('active')
        return
    }

    e.target.classList.remove('active')
}

inputValidator = (input) => {
    const isRequired = input.required
    const value = input.value

    if (isRequired && !value.length) {
        input.classList.add('error')
        return
    }

    input.classList.remove('error')
}

deliveryHandler = (e) => {
    const deliveryWrapper = $('delivery-wrapper')
    const delivery = e.target.checked

    const inputArr = [$('country'), $('city'), $('address')]
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

preloadHandler = (isActive) => {
    isActive ? preloader.classList.add('active') : preloader.classList.remove('active')
}

submitValidator = () => {
    const button = $('submit')

    if (!button) { return }

    if (!PAGE_OPTIONS.basketList.length) {
        button.classList.add('disabled')
        return
    }
    button.classList.remove('disabled')
}

getOrderIndex = (e) => {
    e.preventDefault()

    const xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://api.countapi.xyz/hit/ivan-kitsa.github.io/order')
    xhr.responseType = 'json'
    xhr.onload = function () {
        console.log(`order index: ${this.response.value}`)
        preloadHandler(true)
        sendPayment(this.response.value)
    }
    xhr.send()
}

sendPayment = async (orderIndex) => {
    const doc = new docx.Document()

    doc.addSection({
        properties: {},
        children: [
            new docx.Paragraph({
                children: [
                    new docx.TextRun("Hello World"),
                    new docx.TextRun({
                        text: "Foo Bar",
                        bold: true,
                    }),
                    new docx.TextRun({
                        text: "\tGithub is the best",
                        bold: true,
                    }),
                ],
            }),
        ],
    });

    const createdFile = await docx.Packer.toBase64String(doc).then(base64file => {
        return base64file
    })

    const emailClient =
        `<center>
            <table border='0' cellpadding='0' cellspacing='0' width='100%'
                   style='font-family: Arial, sans-serif; font-size: 14px; width: 100%; max-width: 980px; margin: 0 auto; padding: 0; border-collapse: collapse;'>
                <thead>
                    <tr>
                        <th align='left' colspan='10'>
                            <img src='https://ivan-kitsa.github.io/freelance/images/ms.jpg'
                                width='600'
                                style="max-width:600px;padding-bottom:0;display:inline!important;vertical-align:bottom;border:0;height:auto;outline:none;text-decoration:none"
                                alt='logo'/>
                                 
                        </th>
                        <th align='right' colspan='5' style='text-align: right; font-size: 14px'>
                            <p>+375-29-XXX-XX-XX</p>
                            <p>+375-29-XXX-XX-XX</p>
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
                        <td colspan='10' style='min-width: 70%; border: 1px solid #D8D8D8; border-collapse: collapse; padding: 12px 12px 12px 12px'>
                            <p style='margin: 0; margin-bottom: 12px'><b>№ заказа:</b> ${orderIndex}</p>
                            <p style='margin: 0; margin-bottom: 12px'><b>Дата заказа:</b> ${dateProvider()}</p>
                            <p style='margin: 0; margin-bottom: 12px'><b>Доставка:</b> ${formData.delivery ? 'Да' : 'Нет'}</p>
                            ${formData.delivery ?
                                `<div>
                                    <p style='margin: 0; margin-bottom: 12px'><b>Адрес доставки:</b></p>
                                    <p style='margin: 0;'>${formData.country + ', '}${formData.city + ', '}${formData.index ? formData.index + ', ' : ''}${formData.address}</p>
                                </div>` : ''}
                        </td>
                        <td colspan='5' style='border: 1px solid #D8D8D8; border-collapse: collapse; padding: 12px 12px 12px 12px'>
                            <p style='margin: 0; margin-bottom: 12px'><b>Телефон:</b> ${formData.phone ? formData.phone : ''}</p>
                            <p style='margin: 0; margin-bottom: 12px'><b>Email:</b> ${formData.email}</p>
                            <br>
                            <br>
                            <br>
                            <br>
                            <br>
                        </td>
                    </tr>
                    <tr style='height: 24px; width: 100%'></tr>
                    <tr>
                        <td colspan='8' style='background: #F8F8F8; padding: 12px; text-align: left; border: 1px solid #D8D8D8;'>
                            <b>Название товара</b>
                        </td>
                        <td colspan='1' style='background: #F8F8F8; padding: 12px; text-align: center; border: 1px solid #D8D8D8;'>
                            <b>Кол-во</b>
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
                        </tr>`
                    )).join('')}
                    <tr>
                        <td colspan='12' style='padding: 12px; text-align: right; border: 1px solid #D8D8D8;'>
                            <b>Итого:</b>
                        </td>
                        <td colspan='3' style='padding: 12px; text-align: right; border: 1px solid #D8D8D8;'>
                            <b>${PAGE_OPTIONS.price} BYN</b>
                        </td>
                    </tr>
                    <tr style='height: 24px; width: 100%'></tr>
                    <tr>
                        <td colspan='15' style='padding: 0'>
                            <span style='font-size: 14px'>Если у Вас есть какие-либо вопросы, ответьте на это сообщение или позвоните нам.</span>
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
                            <img src='https://ivan-kitsa.github.io/freelance/images/ms.jpg'
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
                        <td colspan='10' style='min-width: 70%; border: 1px solid #D8D8D8; border-collapse: collapse; padding: 12px 12px 12px 12px'>
                            <p style='margin: 0; margin-bottom: 12px'><b>№ заказа:</b> ${orderIndex}</p>
                            <p style='margin: 0; margin-bottom: 12px'><b>Дата заказа:</b> ${dateProvider()}</p>
                            <p style='margin: 0; margin-bottom: 12px'><b>Доставка:</b> ${formData.delivery ? 'Да' : 'Нет'}</p>
                            ${formData.delivery ?
                                `<div>
                                    <p style='margin: 0; margin-bottom: 12px'><b>Адрес доставки:</b></p>
                                    <p style='margin: 0;'>${formData.country + ', '}${formData.city + ', '}${formData.index ? formData.index + ', ' : ''}${formData.address}</p>
                                </div>` : ''}
                        </td>
                        <td colspan='5' style='border: 1px solid #D8D8D8; border-collapse: collapse; padding: 12px 12px 12px 12px'>
                            <p style='margin: 0; margin-bottom: 12px'><b>Телефон:</b> ${formData.phone ? formData.phone : ''}</p>
                            <p style='margin: 0; margin-bottom: 12px'><b>Email:</b> ${formData.email}</p>
                            <p style='margin: 0; margin-bottom: 12px'><b>Название компании:</b></p>
                            <p style='margin: 0;'>${formData.companyName}</p>
                            <br>
                            <br>
                            <br>
                            <br>
                        </td>
                    </tr>
                    <tr style='height: 24px; width: 100%'></tr>
                    <tr>
                        <td colspan='8' style='background: #F8F8F8; padding: 12px; text-align: left; border: 1px solid #D8D8D8;'>
                            <b>Название товара</b>
                        </td>
                        <td colspan='1' style='background: #F8F8F8; padding: 12px; text-align: center; border: 1px solid #D8D8D8;'>
                            <b>Кол-во</b>
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
                        </tr>`
                    )).join('')}
                    <tr>
                        <td colspan='12' style='padding: 12px; text-align: right; border: 1px solid #D8D8D8;'>
                            <b>Итого:</b>
                        </td>
                        <td colspan='3' style='padding: 12px; text-align: right; border: 1px solid #D8D8D8;'>
                            <b>${PAGE_OPTIONS.price} BYN</b>
                        </td>
                    </tr>
                    <tr style='height: 12px; width: 100%'></tr>
                </tbody>
            </table>
        </center>`

    Email.send({
        SecureToken: 'e494b8ef-bb2c-449f-a011-3ec97de46731',
        To: 'ivan@zenio.co',
        From: 'ookatss@gmail.com',
        Subject: `Ваш заказ №${orderIndex}`,
        Body: emailBussiness,
        Attachments: [{
            name: 'doc.docx',
            data: createdFile
        }]

    }).then(message => {
        console.log(message)
        preloadHandler(false)
    })
}
