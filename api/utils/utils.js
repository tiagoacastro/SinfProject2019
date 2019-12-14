
async function getNotMappedProducts(companyID, productKeys, mappedProducts) {
    let unmapped = productKeys;
    let index;
    mappedProducts.forEach(row => {
        if (companyID == 1 && (index = productKeys.indexOf(row.reference_1)) != -1) {
            unmapped.splice(index, 1);
        } else if (companyID == 2 && (index = productKeys.indexOf(row.reference_2)) != -1) {
            unmapped.splice(index, 1);
        }
    })

    return unmapped;
}

async function getNotMappedEntities(supplier, entityKeys, mappedEntities) {
    let unmapped = entityKeys;
    let index;
    mappedEntities.forEach(row => {
        if (supplier && (index = entityKeys.indexOf(row.reference_1)) != -1) {
            unmapped.splice(index, 1);
        } else if (!supplier && (index = entityKeys.indexOf(row.reference_2)) != -1) {
            unmapped.splice(index, 1);
        }
    })

    return unmapped;
}

module.exports = { getNotMappedProducts, getNotMappedEntities };