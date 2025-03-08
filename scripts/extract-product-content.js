/**
 * Extract Product Content Script
 * 
 * This script extracts all product content from WordPress and saves it to a CSV file
 * for easy manual translation. Run this script with Node.js.
 * 
 * Prerequisites:
 * 1. Install required packages: npm install node-fetch@2 csv-writer
 * 
 * Usage: node extract-product-content.js
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { createObjectCsvWriter } = require('csv-writer');

// Configuration
const config = {
    wpApiUrl: 'https://backend.hotumatur.com/wp-json/wc/v3/products',
    consumerKey: process.env.WC_CONSUMER_KEY || 'ck_f1f4c97f5c4f384a0e8c8e388b5c5e2f8e6f5d4a',
    consumerSecret: process.env.WC_CONSUMER_SECRET || 'cs_5c5a9ef51c3d7c5a9ef51c3d7a5c9ef51c3d7c5a',
    perPage: 100,
    outputDir: path.join(__dirname, 'translations')
};

// Main function
async function extractProductContent() {
    console.log('Extracting product content from WordPress...');

    try {
        // Create output directory if it doesn't exist
        if (!fs.existsSync(config.outputDir)) {
            fs.mkdirSync(config.outputDir, { recursive: true });
        }

        // Fetch all products
        const products = await fetchAllProducts();
        console.log(`Found ${products.length} products.`);

        // Extract product names and descriptions
        await extractBasicContent(products);

        // Extract product attributes
        await extractAttributes(products);

        // Extract meta data
        await extractMetaData(products);

        console.log('Content extraction completed!');
        console.log(`CSV files have been created in the ${config.outputDir} directory.`);
        console.log('\nNext steps:');
        console.log('1. Open the CSV files in Excel or Google Sheets');
        console.log('2. Add translations in the "English Translation" columns');
        console.log('3. Save the files and use them to update WordPress');

    } catch (error) {
        console.error('Error extracting product content:', error);
    }
}

// Helper function to fetch all products
async function fetchAllProducts() {
    const auth = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString('base64');
    let page = 1;
    let allProducts = [];
    let hasMore = true;

    while (hasMore) {
        console.log(`Fetching products page ${page}...`);

        const response = await fetch(
            `${config.wpApiUrl}?per_page=${config.perPage}&page=${page}`,
            {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const products = await response.json();

        if (products.length === 0) {
            hasMore = false;
        } else {
            allProducts = [...allProducts, ...products];
            page++;
        }
    }

    return allProducts;
}

// Extract basic content (names, descriptions)
async function extractBasicContent(products) {
    console.log('Extracting product names and descriptions...');

    const csvWriter = createObjectCsvWriter({
        path: path.join(config.outputDir, 'product-basic-content.csv'),
        header: [
            { id: 'id', title: 'Product ID' },
            { id: 'name', title: 'Product Name (Spanish)' },
            { id: 'name_en', title: 'Product Name (English Translation)' },
            { id: 'short_description', title: 'Short Description (Spanish)' },
            { id: 'short_description_en', title: 'Short Description (English Translation)' },
            { id: 'description', title: 'Description (Spanish)' },
            { id: 'description_en', title: 'Description (English Translation)' }
        ]
    });

    const records = products.map(product => ({
        id: product.id,
        name: product.name,
        name_en: '',
        short_description: stripHtmlTags(product.short_description),
        short_description_en: '',
        description: stripHtmlTags(product.description),
        description_en: ''
    }));

    await csvWriter.writeRecords(records);
    console.log(`Created ${path.join(config.outputDir, 'product-basic-content.csv')}`);

    // Also save the HTML versions for reference
    const htmlCsvWriter = createObjectCsvWriter({
        path: path.join(config.outputDir, 'product-html-content.csv'),
        header: [
            { id: 'id', title: 'Product ID' },
            { id: 'name', title: 'Product Name' },
            { id: 'short_description', title: 'Short Description HTML' },
            { id: 'description', title: 'Description HTML' }
        ]
    });

    const htmlRecords = products.map(product => ({
        id: product.id,
        name: product.name,
        short_description: product.short_description,
        description: product.description
    }));

    await htmlCsvWriter.writeRecords(htmlRecords);
    console.log(`Created ${path.join(config.outputDir, 'product-html-content.csv')}`);
}

// Extract attributes
async function extractAttributes(products) {
    console.log('Extracting product attributes...');

    const attributeRecords = [];

    products.forEach(product => {
        product.attributes.forEach(attr => {
            attributeRecords.push({
                product_id: product.id,
                product_name: product.name,
                attribute_id: attr.id,
                attribute_name: attr.name,
                attribute_name_en: '',
                attribute_value: attr.options.join(', '),
                attribute_value_en: ''
            });
        });
    });

    const csvWriter = createObjectCsvWriter({
        path: path.join(config.outputDir, 'product-attributes.csv'),
        header: [
            { id: 'product_id', title: 'Product ID' },
            { id: 'product_name', title: 'Product Name' },
            { id: 'attribute_id', title: 'Attribute ID' },
            { id: 'attribute_name', title: 'Attribute Name (Spanish)' },
            { id: 'attribute_name_en', title: 'Attribute Name (English Translation)' },
            { id: 'attribute_value', title: 'Attribute Value (Spanish)' },
            { id: 'attribute_value_en', title: 'Attribute Value (English Translation)' }
        ]
    });

    await csvWriter.writeRecords(attributeRecords);
    console.log(`Created ${path.join(config.outputDir, 'product-attributes.csv')}`);
}

// Extract meta data
async function extractMetaData(products) {
    console.log('Extracting product meta data...');

    const metaRecords = [];

    products.forEach(product => {
        product.meta_data.forEach(meta => {
            // Only include meta data that looks like it might need translation
            if (typeof meta.value === 'string' && meta.value.trim() !== '' && meta.value.length > 3) {
                metaRecords.push({
                    product_id: product.id,
                    product_name: product.name,
                    meta_key: meta.key,
                    meta_value: meta.value,
                    meta_value_en: ''
                });
            }
        });
    });

    const csvWriter = createObjectCsvWriter({
        path: path.join(config.outputDir, 'product-meta-data.csv'),
        header: [
            { id: 'product_id', title: 'Product ID' },
            { id: 'product_name', title: 'Product Name' },
            { id: 'meta_key', title: 'Meta Key' },
            { id: 'meta_value', title: 'Meta Value (Spanish)' },
            { id: 'meta_value_en', title: 'Meta Value (English Translation)' }
        ]
    });

    await csvWriter.writeRecords(metaRecords);
    console.log(`Created ${path.join(config.outputDir, 'product-meta-data.csv')}`);
}

// Helper function to strip HTML tags
function stripHtmlTags(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

// Run the script
extractProductContent(); 