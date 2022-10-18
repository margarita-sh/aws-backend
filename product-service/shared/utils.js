module.exports.PRODUCTS_TABLE = process.env.PRODUCTS_TABLE
module.exports.STOCKS_TABLE = process.env.STOCKS_TABLE
module.exports.createProductObject = (uuidv4, description, img, price, title) => {
    return {
        Item: {
            id: {
                S: uuidv4
            },
            description: {
                S: description
            },
            img: {
                S: img
            },
            price: {
                N: price.toString()
            },
            title: {
                S: title
            },
        }
    }
}

module.exports.createStocksObject = (productId, count) => {
    return {
        Item: {
            product_id: {
                S: productId
            },
            count: {
                N: count.toString()
            },
        }
    }
}

module.exports.createInsertObject = (product, stock) => {
    return {
        RequestItems: {
            [exports.PRODUCTS_TABLE]: [{
                PutRequest: product
            }],
            [exports.STOCKS_TABLE]: [{
                PutRequest: stock
            }]
        },
    }
}

module.exports.insertItems = async (ddb, items) => {
    return new Promise((resolve, reject) => {
        ddb.batchWriteItem(items, function (err) {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}