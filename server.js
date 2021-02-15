const express = require('express')
const puppeteer = require('puppeteer')
const replace = require('absolutify')

const app = express()

var headers = {
    // 'accept-language' : 'en\r\n',
    'x-requested-with': 'XMLHttpRequest',
    'user-agent': 'Mozilla/5.0'
}

app.get('/', async (req, res) => {
    const { url } = req.query

    if (!url) {
        return res.send('Not url provided')
    } else {
        // generate puppeteer screenshot 
        try {
            // If headless Chrome is not launching on Debian, use the following line instead
            // const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']})
            const browser = await puppeteer.launch()
            const page = await browser.newPage()
            // await page.setRequestInterception(true);
            await page.setExtraHTTPHeaders({
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
                'x-requested-with': 'XMLHttpRequest',
            })
            await page.goto(`https://${url}`)

            let document = await page.evaluate(() => document.documentElement.outerHTML)
            document = replace(document, `/?url=${url.split('/')[0]}`)

            return res.send(document)
        } catch (err) {
            console.log(err)

            return res.send(err)
        }
    }
})


app.listen(8080)