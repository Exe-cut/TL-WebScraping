const puppeteer = require('puppeteer')
const { jsPDF } = require('jspdf')


function existent(result, productsDetail) {
    for (let l = 0; l < productsDetail.length; l++) {
        let value = result.split(':')[0].trim()
        let product = productsDetail[l].split(':')[0].trim()
        if (product == value) {
            return true
        }
    }
    return false
}

let scrape = async () => {
    const browser = await puppeteer.launch()
    let page = await browser.newPage()

    await page.goto('https://www.telhanorte.com.br/')
    page.on('console', msg => {
        for (let i = 0; i < msg.args.length; ++i)
            console.log(`${i}: ${msg.args[i]}`);
    });
    // Get all subcategories links
    const categories = await page.$$eval('div.x-nav-menu__dropdown-inner-row > ul > li > a', categories =>
        categories.map(categories => categories.getAttribute('href'))
    )
    browser.close()

    const productsCategories = []
    let productsDetail = ['initial']
    for (let i = 0; i < categories.length; i++) {
        console.log('Categoria:', categories[i])
        LENGHT_LIMIT = 4
        if (categories[i].split('/').length == LENGHT_LIMIT) {
            const browser = await puppeteer.launch()
            let page = await browser.newPage()
            await page.setDefaultNavigationTimeout(0);
            await page.goto(`https://www.telhanorte.com.br${categories[i]}`)
            const productsLink = await page.$$eval('div.x-category__products > div > ul > li > article > div.x-shelf__img-container > a', products =>
                products.map(products => products.getAttribute('href'))

            )
            console.log(productsLink)
            for (let j = 0; j < productsLink.length; j++) {
                console.log(`${j} - ${productsLink[j]}`)
                await page.setDefaultNavigationTimeout(0);
                await page.goto(`https:${productsLink[j]}`)
                const result = await page.$$eval('tr.m-description__content-open.js--desc-content', productsDescription => {
                    return productsDescription.map(productsDescription => `${productsDescription.cells[0].textContent}:${productsDescription.cells[1].textContent}`)
                })
                for (let k = 0; k < result.length; k++) {
                    if (result[k].split(':')[0] != '') {
                        push = existent(result[k], productsDetail)
                        if (!push) {
                            productsDetail.push(result[k])
                        }
                        console.log(productsDetail)
                    }
                }
                let doc = new jsPDF()
                productsDetail.forEach(value => {
                    doc.setFontSize(10)
                    let splitText = doc.splitTextToSize(productsDetail, 200)
                    doc.text(15, i+1, splitText)
                    doc.save(`pdfs/all.pdf`)
                })
                
            }
            browser.close()
            // productsCategories.push(`${categories[i]}%${productsDetail}`)
            // productsCategories.forEach((value, index) => {
            //     value = value.split('%')
            //     title = value[0].split('/')
            //     table = value[1]
            //     let doc = new jsPDF()
            //     doc.setFontSize(10)
            //     let splitText = doc.splitTextToSize(value[1], 200)
            //     doc.text(50, 15, value[0])
            //     doc.text(15, 50, splitText)
            //     doc.save(`pdfs/${title[1]}-${title[2]}-${title[3]}.pdf`)           
            // });
            


        }
        console.log('ProductsCategory:', productsCategories)
    }
    browser.close()
};
scrape().then((value) => {
    console.log(value)
})