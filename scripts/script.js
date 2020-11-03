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

const basketButton = document.getElementById('basket-button')
const basketProductsWrapper = document.getElementById('basket-products-wrapper')
const basketWrapper = document.getElementById('basket-wrapper')
const catalogWrapper = document.getElementById('catalog')
const priceField = document.getElementById('price')
const body = document.querySelector('body')

setProductType = (e) => {
    const id = e.target.id
    const targetItem = document.getElementById(id)
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
        const id = e.target.id.replace('count-','').replace('basket-','')
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
    const id = e.target.id.replace('count-','').replace('basket-','')
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

    const inputProduct = document.getElementById(`count-${id}`)
    const inputBasket = document.getElementById(`basket-count-${id}`)

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
    const inputProduct = document.getElementById(`count-${currentProduct.id}`)
    const inputBasket = document.getElementById(`basket-count-${currentProduct.id}`)
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
    let price = 0

    PAGE_OPTIONS.basketList.forEach((product) => {
        price += product.allCost
    })

    priceField.innerHTML = `${price.toFixed(2)} BYN`
}

costControl = (currentProduct, count) => {
    const discountAreaCatalog = document.getElementById(`discount-area-${currentProduct.id}`)
    const discountAreaBasket = document.getElementById(`basket-discount-area-${currentProduct.id}`)
    const allCostCatalog = document.getElementById(`all-cost-${currentProduct.id}`)
    const allCostBasket = document.getElementById(`basket-all-cost-${currentProduct.id}`)

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
    const addButtonWrapper = document.getElementById(`button-wrapper-${productId}`)

    product.inBasket = true
    addButtonWrapper.innerHTML = `<button class='button checked' onclick='removeFromBasket(event)' id='${product.type}-${product.id}-card-remove'>В корзине</button>`

    PAGE_OPTIONS.basketList = [...PAGE_OPTIONS.basketList, product]

    if (PAGE_OPTIONS.basketList.length  && !basketButton.classList.contains('active')) {
        basketButton.classList.add('active')
    }

    priceControl()
    basketAnim()
}

removeFromBasket = (e) => {
    const infoArray = e.target.id.split('-')
    const productType = infoArray[0]
    const productId = infoArray[1]
    const basketRemover = infoArray[2] === 'basket'

    const currentList = productType === 'wreath' ? WREATHS_LIST : BASKETS_LIST
    const productFromList = currentList.filter((product) => (product.id === +productId))[0]

    const addButtonWrapper = document.getElementById(`button-wrapper-${productId}`)
    const basketProductCard = document.getElementById(`basket-${productId}`)

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

sendPayment = (e) => {
    e.preventDefault()
}
