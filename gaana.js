//node gaana.js --url=https://gaana.com/ --config=config.json

//requiring modules
let minimist = require("minimist");
let fs = require("fs");
let puppeteer = require("puppeteer");

// getting command line arguments and reading config.json file
let args = minimist(process.argv);
let configJSON = fs.readFileSync(args.config ,"utf-8");
let configJSO = JSON.parse(configJSON);
-
(async () => {

    //launching browser
    const browser = await puppeteer.launch({headless:false , args: ['--start-maximized'], defaultViewport : null});
    
    //opening tab
    const pages = await browser.pages();
    const page = pages[0];
   
    //opening url
    await page.goto(args.url);
   
    //click on my music
    await page.evaluate(() => {
        let elements = document.getElementsByClassName('link');
            console.log('sdfdfx', elements);
            elements[8].click();
    });
    
    //click on login signup
    await page.waitForSelector("._inner > button");
    await page.click("._inner > button");

    //add credentials
    await page.waitForSelector("input[id='login_id']");
    await page.type("input[id='login_id']", configJSO.email, { delay: 20 });

    await page.waitForSelector(".row_b > button");
    await page.click(".row_b > button");

    await page.waitForSelector("input[id='login_pw']");
    await page.type("input[id='login_pw']", configJSO.password, { delay: 20 });

    await page.keyboard.press('Enter');

    //create new playlist
    await page.waitForSelector(".mMusic_listing > button");
    await page.click(".mMusic_listing > button");

    await page.waitForSelector("input[name='playlistname']");
    await page.type("input[name='playlistname']", configJSO.playlist, { delay: 20 });

    await page.keyboard.press('Enter');

    //searching and adding songs to playlist
    for(let i = 0 ; i < configJSO.song.length ; i++){
    await page.waitForSelector(".sbox.sm-hide > button");
    
    await page.type(".sbox.sm-hide > button", configJSO.song[i], { delay: 20 });
    await page.keyboard.press('Enter');

    await page.waitForSelector(".card_wrap > li:nth-child(1)");
    await page.click(".card_wrap > li:nth-child(1)");

    await page.waitForSelector("button[title='More Options']");
    await page.click("button[title='More Options']");

    await page.waitForSelector("#scrollpad > div > button:nth-child(2)");
    await page.click("#scrollpad > div > button:nth-child(2)");

    await page.waitForSelector("._ul > li:nth-child(1)");
    await page.click("._ul > li:nth-child(1)");
}

    //close the browser
    await browser.close();
  })();