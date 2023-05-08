import puppeteer from "puppeteer";
import db from "./db.js";

export const createTableIfNotExists = async () => {
  try {
    await db.query('CREATE TABLE IF NOT EXISTS scrapedata (id SERIAL PRIMARY KEY, title VARCHAR(255), image_url VARCHAR(255))');
    console.log('Table created successfully')
  } catch (err) {
    console.error('Error creating table:', err);
  }
}

export const scrapeSite = async () => {
  try {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    const apartments = [];
    
    let currentPage = 1;
    while (apartments.length < 500) {
      await page.goto(`https://www.sreality.cz/en/search/for-sale/apartments?page=${currentPage}`);
      console.log(`Scraping page ${currentPage}, ${apartments.length} apartments found so far.`);

      await page.waitForSelector('.property');

      const apartmentElements = await page.$$('.property');
      for (let i = 0; i < apartmentElements.length && apartments.length < 500; i++) {
        const titleElement = await apartmentElements[i].$('.basic h2 a');
        const title = titleElement ? (await titleElement.evaluate(el => el.textContent)).trim() : '';
        const divParentElement = await apartmentElements[i].$('._2xzMRvpz7TDA2twKCXTS4R');
        const aElements = await divParentElement.$$('a');
        const imgUrls = [];
        for (let j = 0; j < aElements.length; j++) {
          const imgUrl = await aElements[j].$eval('img', el => el.src);
          imgUrls.push(imgUrl);
        }

        apartments.push({ title, imgUrls });
      }

      const nextPageButton = await page.$('.paging-full .paging-next');
      if (!nextPageButton) {
        break;
      }

      currentPage++;
      await nextPageButton.click();
    }

    await browser.close();
    return apartments;
  } catch (error) {
    console.error('Error scraping site:', error);
    return [];
  }
};

export const saveScrapes = async (scrapes: any[]): Promise<boolean> => {  
  console.log('Saving scrapes')
  const client = await db.connect();
  await client.query('DELETE FROM scrapedata');
  for (let i = 0; i < scrapes.length; i++) {
    const { title, imgUrls } = scrapes[i];
    try {
      await client.query('INSERT INTO scrapedata (title, image_url) VALUES ($1, $2)', [title, imgUrls[0]]);
    } catch (err) {
      console.error(`Error inserting data for ${title}:`, err);
      return false; // Return false if any insert query fails
    }
  }
  client.release();
  return true; // Return true after all insert queries have succeeded
};

export const getScrapes = async (pages: number): Promise<any> => {
  const client = await db.connect();
  try {
    const res = await client.query(`SELECT * FROM scrapedata LIMIT 20 OFFSET ${(pages - 1) * 20}`);
    return res;
  } catch (err) {
    console.error('Error getting scrapes:', err);
    return {
      rows: [],
      rowCount: 0
    };
  } finally {
    client.release();
  }
};




