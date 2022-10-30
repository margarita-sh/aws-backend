const AWS = require('aws-sdk');
const {v4: uuidv4} = require('uuid');
const {insertItems, createProductObject, createStocksObject, PRODUCTS_TABLE, STOCKS_TABLE} = require('./utils');

const MAX_ITEMS_PUT = 25

AWS.config.update({
    region: 'us-east-1'
});
const ddb = new AWS.DynamoDB({
    apiVersion: '2012-08-10'
});


const products = require('../assets/products.json')
const preparedProducts = products.map(({description, img, price, title}) => {
    return {
        PutRequest: createProductObject(uuidv4(), description, img, price, title)
    }
})
const preparedStocks = preparedProducts.map((item, index) => {
    return {
        PutRequest: createStocksObject(item.PutRequest.Item.id.S, products[index].count)
    }
})

function getInsertItems(productItems, stockItems, startPosition, amount) {
    const productsSliced = productItems.slice(startPosition, startPosition + amount)
    const stocksSliced = stockItems.slice(startPosition, startPosition + amount)
    const products = {
        RequestItems: {
            [PRODUCTS_TABLE]: productsSliced
        },
    }
    const stocks = {
        RequestItems: {
            [STOCKS_TABLE]: stocksSliced
        },
    }

    return {
        products,
        stocks
    }
}

(async () => {
    const iterations = Math.ceil(preparedProducts.length / MAX_ITEMS_PUT)
    for(let i = 0; i < iterations; i++) {
        const { products, stocks } = getInsertItems(preparedProducts, preparedStocks, i * MAX_ITEMS_PUT, MAX_ITEMS_PUT)
        console.log(`Insert batch: ${i+1}/${iterations}`);

        await insertItems(ddb, products)
        await insertItems(ddb, stocks)
    }
})()
