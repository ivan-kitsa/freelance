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
document.addEventListener('DOMContentLoaded', function() {
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
        inBasket: false
    }))
    BASKETS_LIST = BASKETS.map((product, index) => ({
        ...product,
        id: index + 1 + WREATHS_LIST.length,
        allCost: product.cost,
        discountPercent: 0,
        count: 1,
        inBasket: false
    }))

    PAGE_OPTIONS.currentList = WREATHS_LIST

    console.log(WREATHS_LIST)
    console.log(BASKETS_LIST)
}

const PAGE_OPTIONS = {
    currentList: [],
    basketList: [],
    basketIsOpen: false
}

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
    const wrapper = document.getElementById('catalog')
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
                <label class='counter' for='count-${item.id}'>
                    <input type='number' id='count-${item.id}' value=${item.count} 
                           oninput={onInputCounter(event)} onblur={onBlurCounter(event)}>
                    <img src='./images/minus.svg' alt='-'>
                    <img src='./images/plus.svg' alt='+'>
                </label>
            </div>
            <div className='button-wrapper' id='button-wrapper-${item.id}'>
                ${!item.inBasket ?
                `<button class='button' onclick={setToBasket(${item.id})}>Добавить в корзину</button>` :
                `<button class='button checked'>В корзине</button>`}
            </div>
        </div>`
    ))

    wrapper.innerHTML = products.join('')
}

basketListCreator = () => {
    const wrapper = document.getElementById('basket-products-wrapper')
    const products = PAGE_OPTIONS.basketList.map((item) => (
        `<div class='basket-product' id=${item.id}>
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
                    <label for='basket-count-${item.id}' class='counter'>
                        <input type='number' id='basket-count-${item.id}' value=${item.count}
                               oninput={onInputCounter(event)} onblur={onBlurCounter(event)}>
                        <img src='./images/minus.svg' alt='-'>
                        <img src='./images/plus.svg' alt='+'>
                    </label>
                </div>
            </div>
            <div class='remove-wrapper'>
                <img src='./images/remove.svg' alt='remove'>
            </div>
        </div>`
    ))

    wrapper.innerHTML = products.join('')
}

onBlurCounter = (e) => {
    if (isNaN(parseInt(e.target.value))) {
        const id = e.target.id.replace('count-','')
        const currentProduct = PAGE_OPTIONS.currentList.filter((item) => (item.id === +id))[0]

        e.target.value = 1
        currentProduct.count = 1

        costControl(currentProduct, 1)
    }
}

onInputCounter = (e) => {
    const id = e.target.id.replace('count-','').replace('basket-','')
    const currentProduct = PAGE_OPTIONS.currentList.filter((item) => (item.id === +id))[0]
    const basketProduct = PAGE_OPTIONS.basketList.filter((item) => (item.id === +id))[0]
    const count = e.target.value

    setCount(currentProduct, +count)

    if (basketProduct) {
        setCount(basketProduct, +count)
    }
}

setCount = (currentProduct, currentCount) => {
    const prevCount = currentProduct.count
    const inputNode = document.getElementById(`count-${currentProduct.id}`)

    if (isNaN(currentCount) || currentCount === 0) {
        currentProduct.count = prevCount
        inputNode.value = ''

        costControl(currentProduct, prevCount)
        return
    }

    if (currentCount > 9999) {
        currentProduct.count = prevCount
        inputNode.value = prevCount

        costControl(currentProduct, prevCount)
        return
    }

    currentProduct.count = currentCount
    costControl(currentProduct, currentCount)
}

costControl = (currentProduct, count) => {
    const discountAreaNode = document.getElementById(`discount-area-${currentProduct.id}`)
    const allCostNode = document.getElementById(`all-cost-${currentProduct.id}`)

    if (count >= 100) {
        currentProduct.discountPercent = 10
        currentProduct.allCost = (currentProduct.cost * 0.9 * count).toFixed(2).replace('.00', '')
        discountAreaNode.innerHTML = `Общая стоимость: <span class='discount-flag'>-${currentProduct.discountPercent}%</span>`
    } else if (count >= 50) {
        currentProduct.discountPercent = 5
        currentProduct.allCost = (currentProduct.cost * 0.95 * count).toFixed(2).replace('.00', '')
        discountAreaNode.innerHTML = `Общая стоимость: <span class='discount-flag'>-${currentProduct.discountPercent}%</span>`
    } else {
        currentProduct.discountPercent = 0
        currentProduct.allCost = currentProduct.cost * count
        discountAreaNode.innerHTML = 'Общая стоимость:'
    }

    allCostNode.innerText = `${!count ? currentProduct.cost : currentProduct.allCost} BYN`
}

setToBasket = (productId) => {
    const product = PAGE_OPTIONS.currentList.filter((product) => (product.id === productId))[0]
    const addButtonWrapper = document.getElementById(`button-wrapper-${productId}`)
    const basketButton = document.getElementById('basket-button')

    product.inBasket = true
    addButtonWrapper.innerHTML = `<button class='button checked'>В корзине</button>`

    PAGE_OPTIONS.basketList = [...PAGE_OPTIONS.basketList, product]

    if (PAGE_OPTIONS.basketList.length  && !basketButton.classList.contains('active')) {
        basketButton.classList.add('active')
    }

    basketAnim()
}

basketAnim = () => {
    const basketButton = document.getElementById('basket-button')

    basketButton.classList.remove('animate')
    setTimeout(() => {
        basketButton.classList.add('animate')
    }, 10);
}

basketHandler = (e) => {
    const classList = e.target.classList
    const basketWrapper = document.getElementById('basket-wrapper')
    const body = document.querySelector('body')

    if (classList.contains('opened')) {
        productListCreator()
        classList.remove('opened')
        basketWrapper.classList.remove('opened')
        body.classList.remove('overflow')
    } else {
        basketListCreator()
        classList.add('opened')
        basketWrapper.classList.add('opened')
        body.classList.add('overflow')
    }
}

sendPayment = (e) => {
    e.preventDefault()

}
