const WREATHS_LIST = [
    {
        id: 1,
        name: 'В5 (Венок)',
        description: 'Краткое описание продукта',
        cost: 5,
        allCost: 5,
        discountPercent: 0,
        count: 1,
        inBasket: false
    },
    {
        id: 2,
        name: 'В2 (Венок)',
        description: 'Краткое описание продукта',
        cost: 2,
        allCost: 2,
        discountPercent: 0,
        count: 1,
        inBasket: false
    },
    {
        id: 3,
        name: 'В7 (Венок)',
        description: 'Краткое описание продукта',
        cost: 7,
        allCost: 7,
        discountPercent: 0,
        count: 1,
        inBasket: false
    }
]

const BASKETS_LIST = [
    {
        id: 1,
        name: 'К5 (Куранты)',
        description: 'Краткое описание продукта',
        cost: 5,
        allCost: 5,
        discountPercent: 0,
        count: 1,
        inBasket: false
    },
    {
        id: 2,
        name: 'К1 (Куранты)',
        description: 'Краткое описание продукта',
        cost: 1,
        allCost: 1,
        discountPercent: 0,
        count: 1,
        inBasket: false
    },
    {
        id: 3,
        name: 'К8 (Куранты)',
        description: 'Краткое описание продукта',
        cost: 8,
        allCost: 8,
        discountPercent: 0,
        count: 1,
        inBasket: false
    },
]

const PAGE_OPTIONS = {
    currentList: WREATHS_LIST,
    basketList: [],
    basketIsOpen: false
}

let timer
debounce = (func, ms) => {
    clearTimeout(timer)
    timer = setTimeout(func, ms)
}

document.addEventListener('DOMContentLoaded', function() {
    productListCreator()
})

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
    const node = PAGE_OPTIONS.currentList.map((item) => (
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

    wrapper.innerHTML = node.join('')
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
    const id = e.target.id.replace('count-','')
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
        discountAreaNode.innerHTML = `Общая цена: <span class='discount-flag'>-${currentProduct.discountPercent}%</span>`
    } else if (count >= 50) {
        currentProduct.discountPercent = 5
        currentProduct.allCost = (currentProduct.cost * 0.95 * count).toFixed(2).replace('.00', '')
        discountAreaNode.innerHTML = `Общая цена: <span class='discount-flag'>-${currentProduct.discountPercent}%</span>`
    } else {
        currentProduct.discountPercent = 0
        currentProduct.allCost = currentProduct.cost * count
        discountAreaNode.innerHTML = 'Общая цена:'
    }

    allCostNode.innerText = `${!count ? currentProduct.cost : currentProduct.allCost} BYN`
}

setToBasket = (productId) => {
    const product = PAGE_OPTIONS.currentList[productId - 1]
    const buttonWrapper = document.getElementById(`button-wrapper-${productId}`)

    product.inBasket = true
    buttonWrapper.innerHTML = `<button class='button checked'>В корзине</button>`

    PAGE_OPTIONS.basketList = [...PAGE_OPTIONS.basketList, product]
    console.log(PAGE_OPTIONS.basketList)
}

basketListCreator = () => {
    //TODO: make a generator of products for basket

    // const wrapper = document.getElementById('products-selected')
    //
    // const node = PAGE_OPTIONS.paymentList.map((item) => (
    //     `<div class='product' id=${item.id}>
    //         <h3>${item.name}</h3>
    //         <p>${item.description}</p>
    //         <p>Стоимость за единицу: ${item.discountPrice}$</p>
    //         <label class='counter' for=${'count-' + item.id}>
    //             <span>Количество: </span>
    //             <input type='number'
    //                    id=${'count-' + item.id}
    //                    value=${item.count}
    //                    oninput={onChangeCounter(event)} />
    //         </label>
    //     </div>`
    // ))
    //
    // wrapper.innerHTML = node.join('')
}

basketHandler = (e) => {
    const classList = e.target.classList

    if (classList.contains('opened')) {
        classList.remove('opened')
        PAGE_OPTIONS.basketIsOpen = false
    } else {
        classList.add('opened')
        PAGE_OPTIONS.basketIsOpen = true
    }
}
