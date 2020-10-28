const WREATHS_LIST = [
    {
        id: 1,
        name: 'Венок 1',
        description: 'Краткое описание продукта',
        startPrice: 100,
        discountPrice: 100,
        count: 0
    },
    {
        id: 2,
        name: 'Венок 2',
        description: 'Краткое описание продукта',
        startPrice: 200,
        discountPrice: 200,
        count: 0
    },
    {
        id: 3,
        name: 'Венок 3',
        description: 'Краткое описание продукта',
        startPrice: 50,
        discountPrice: 50,
        count: 0
    }
]

const BASKETS_LIST = [
    {
        id: 1,
        name: 'Корзина 1',
        description: 'Краткое описание продукта',
        startPrice: 300,
        discountPrice: 300,
        count: 0
    },
    {
        id: 2,
        name: 'Корзина 2',
        description: 'Краткое описание продукта',
        startPrice: 120,
        discountPrice: 120,
        count: 0
    },
    {
        id: 3,
        name: 'Корзина 3',
        description: 'Краткое описание продукта',
        startPrice: 150,
        discountPrice: 150,
        count: 0
    }
]

const PAGE_OPTIONS = {
    currentList: null,
    paymentList: null,
    basketIsEmpty: true,
    basketIsOpen: false
}

let timer
debounce = (func, ms) => {
    clearTimeout(timer)
    timer = setTimeout(func, ms)
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
    const wrapper = document.getElementById('products-catalog')

    const node = PAGE_OPTIONS.currentList.map((item) => (
        `<div class='product' id=${item.id}>
            <h4>${item.name}</h4>
            <p>${item.description}</p>
            <p>Стоимость за единицу: ${item.discountPrice}$</p>
            <label class='counter' for=${'count-' + item.id}>
                <span>Количество: </span>
                <input type='number'
                       id=${'count-' + item.id}
                       value=${item.count}
                       oninput={onChangeCounter(event)} />
            </label>
        </div>`
    ))

    wrapper.innerHTML = node.join('')
}

onChangeCounter = (e) => {
    const count = e.target.value
    const id = e.target.id.replace('count-','')
    const currentItem = PAGE_OPTIONS.currentList.filter((item) => (item.id === +id))[0]

    debounce(() => {
        setCount(currentItem, +count)
        discountControl(currentItem, +count)
        setPaymentList()
    }, 500)
}

setCount = (currentItem, value) => {
    currentItem.count = value
}

discountControl = (currentItem, count) => {
    if (count >= 100) {
        currentItem.discountPrice = currentItem.startPrice * 0.85
    } else if (count >= 50) {
        currentItem.discountPrice = currentItem.startPrice * 0.9
    } else {
        currentItem.discountPrice = currentItem.startPrice
    }

    productListCreator()
}

setPaymentList = () => {
    const goToBasketButton =  document.getElementById('go-to-basket')
    const paymentList = PAGE_OPTIONS.currentList.filter((product) => (product.count))
    PAGE_OPTIONS.paymentList = paymentList
    PAGE_OPTIONS.basketIsEmpty = !paymentList.length

    if (paymentList.length) {
        goToBasketButton.classList.add('active')
    } else {
        goToBasketButton.classList.remove('active')
    }

    if (PAGE_OPTIONS.basketIsOpen) {
        paymentListCreator()
    }
}

paymentListCreator = () => {
    const wrapper = document.getElementById('products-selected')

    const node = PAGE_OPTIONS.paymentList.map((item) => (
        `<div class='product' id=${item.id}>
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <p>Стоимость за единицу: ${item.discountPrice}$</p>
            <label class='counter' for=${'count-' + item.id}>
                <span>Количество: </span>
                <input type='number'
                       id=${'count-' + item.id}
                       value=${item.count}
                       oninput={onChangeCounter(event)} />
            </label>
        </div>`
    ))

    wrapper.innerHTML = node.join('')
}

onSubmitProductsForm = (e) => {
    e.preventDefault()
    openBasket()
}

openBasket = () => {
    paymentListCreator()
    document.querySelector('.basket-section').classList.add('open')
    PAGE_OPTIONS.basketIsOpen = true
}

closeBasket = () => {
    productListCreator()
    document.querySelector('.basket-section').classList.remove('open')
    PAGE_OPTIONS.basketIsOpen = false
}
