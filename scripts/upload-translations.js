/**
 * Upload Translations Script
 * 
 * This script reads the translated CSV files and uploads the translations to WordPress
 * as meta data. This allows you to use the translations in your Next.js app.
 * 
 * Prerequisites:
 * 1. Run extract-product-content.js first and fill in the translations
 * 2. Install required packages: npm install node-fetch@2 csv-parser
 * 
 * Usage: node upload-translations.js
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const csv = require('csv-parser');

// Configuration
const config = {
    wpApiUrl: 'https://backend.hotumatur.com/wp-json/wc/v3/products',
    consumerKey: process.env.WC_CONSUMER_KEY || 'ck_f1f4c97f5c4f384a0e8c8e388b5c5e2f8e6f5d4a',
    consumerSecret: process.env.WC_CONSUMER_SECRET || 'cs_5c5a9ef51c3d7c5a9ef51c3d7a5c9ef51c3d7c5a',
    translationsDir: path.join(__dirname, 'translations'),
    basicContentFile: 'product-basic-content.csv',
    attributesFile: 'product-attributes.csv',
    metaDataFile: 'product-meta-data.csv'
};

// Main function
async function uploadTranslations() {
    console.log('Uploading translations to WordPress...');

    try {
        // Read the translated files
        const basicContent = await readCsvFile(path.join(config.translationsDir, config.basicContentFile));
        const attributes = await readCsvFile(path.join(config.translationsDir, config.attributesFile));
        const metaData = await readCsvFile(path.join(config.translationsDir, config.metaDataFile));

        console.log(`Found ${basicContent.length} products with basic content translations`);
        console.log(`Found ${attributes.length} attribute translations`);
        console.log(`Found ${metaData.length} meta data translations`);

        // Group translations by product ID
        const productTranslations = {};

        // Add basic content translations
        basicContent.forEach(item => {
            const productId = item['Product ID'];
            if (!productTranslations[productId]) {
                productTranslations[productId] = {
                    meta_data: []
                };
            }

            // Add name translation
            if (item['Product Name (English Translation)']) {
                productTranslations[productId].meta_data.push({
                    key: 'name_en',
                    value: item['Product Name (English Translation)']
                });
            }

            // Add short description translation
            if (item['Short Description (English Translation)']) {
                productTranslations[productId].meta_data.push({
                    key: 'short_description_en',
                    value: item['Short Description (English Translation)']
                });
            }

            // Add description translation
            if (item['Description (English Translation)']) {
                productTranslations[productId].meta_data.push({
                    key: 'description_en',
                    value: item['Description (English Translation)']
                });
            }
        });

        // Add attribute translations
        attributes.forEach(attr => {
            const productId = attr['Product ID'];
            if (!productTranslations[productId]) {
                productTranslations[productId] = {
                    meta_data: []
                };
            }

            // Add attribute name translation
            if (attr['Attribute Name (English Translation)']) {
                productTranslations[productId].meta_data.push({
                    key: `${attr['Attribute Name (Spanish)']}_en`,
                    value: attr['Attribute Name (English Translation)']
                });
            }

            // Add attribute value translation
            if (attr['Attribute Value (English Translation)']) {
                productTranslations[productId].meta_data.push({
                    key: `attribute_${attr['Attribute Name (Spanish)'].toLowerCase()}_en`,
                    value: attr['Attribute Value (English Translation)']
                });
            }
        });

        // Add meta data translations
        metaData.forEach(meta => {
            const productId = meta['Product ID'];
            if (!productTranslations[productId]) {
                productTranslations[productId] = {
                    meta_data: []
                };
            }

            // Add meta data translation
            if (meta['Meta Value (English Translation)']) {
                productTranslations[productId].meta_data.push({
                    key: `${meta['Meta Key']}_en`,
                    value: meta['Meta Value (English Translation)']
                });
            }
        });

        // Upload translations to WordPress
        const productIds = Object.keys(productTranslations);
        console.log(`Uploading translations for ${productIds.length} products...`);

        for (let i = 0; i < productIds.length; i++) {
            const productId = productIds[i];
            const translations = productTranslations[productId];

            console.log(`Uploading translations for product ${productId} (${i + 1}/${productIds.length})...`);

            // Only upload if there are translations
            if (translations.meta_data.length > 0) {
                await updateProductMetaData(productId, translations);
                console.log(`  Uploaded ${translations.meta_data.length} translations`);
            } else {
                console.log(`  No translations to upload`);
            }

            // Add a small delay to avoid rate limiting
            await delay(500);
        }

        console.log('\nTranslation upload completed!');
        console.log('The translations have been added as meta data to your WordPress products.');
        console.log('You can now use them in your Next.js app.');

    } catch (error) {
        console.error('Error uploading translations:', error);
    }
}

// Helper function to read a CSV file
function readCsvFile(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
}

// Helper function to update product meta data
async function updateProductMetaData(productId, data) {
    const auth = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString('base64');

    try {
        const response = await fetch(
            `${config.wpApiUrl}/${productId}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error updating product ${productId}:`, error.message);
        throw error;
    }
}

// Helper function to create a delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the script
uploadTranslations(); 