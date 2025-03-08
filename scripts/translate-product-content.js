/**
 * Translate Product Content Script
 * 
 * This script takes the extracted product content and translates it using Google Translate API.
 * 
 * Prerequisites:
 * 1. Run extract-product-content.js first to generate product-content.json
 * 2. Install required packages: npm install @google-cloud/translate
 * 
 * Usage: 
 * 1. Set up Google Cloud credentials: export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your-project-credentials.json"
 * 2. Run: node translate-product-content.js
 * 
 * Alternatively, you can use a free translation API with limited requests:
 * npm install axios
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios'); // For free translation API

// Configuration
const config = {
    inputFile: path.join(__dirname, 'product-content.json'),
    outputFile: path.join(__dirname, 'translated-product-content.json'),
    sourceLanguage: 'es',
    targetLanguage: 'en',
    // Free translation API (limited requests)
    freeTranslationApiUrl: 'https://translate.googleapis.com/translate_a/single',
    // If you have Google Cloud credentials, set this to true
    useGoogleCloudApi: false
};

// Main function
async function translateProductContent() {
    console.log('Translating product content...');

    try {
        // Read the extracted product content
        const productContent = JSON.parse(fs.readFileSync(config.inputFile, 'utf8'));
        console.log(`Found ${productContent.length} products to translate.`);

        // Translate each product
        for (let i = 0; i < productContent.length; i++) {
            const product = productContent[i];
            console.log(`Translating product ${i + 1}/${productContent.length}: ${product.name}`);

            // Translate product name
            product.translations.name_en = await translateText(product.name);
            console.log(`  Name: ${product.name} -> ${product.translations.name_en}`);

            // Translate product description (in chunks if it's long)
            if (product.description) {
                product.translations.description_en = await translateLongText(product.description);
                console.log(`  Description translated (${product.description.length} chars)`);
            }

            // Translate product short description
            if (product.short_description) {
                product.translations.short_description_en = await translateText(product.short_description);
                console.log(`  Short description: ${product.short_description} -> ${product.translations.short_description_en}`);
            }

            // Translate attributes
            for (let j = 0; j < product.attributes.length; j++) {
                const attr = product.attributes[j];
                const attrTranslation = product.translations.attributes[j];

                // Translate attribute name
                attrTranslation.name_en = await translateText(attr.name);
                console.log(`  Attribute name: ${attr.name} -> ${attrTranslation.name_en}`);

                // Translate attribute options
                if (attr.options) {
                    attrTranslation.options_en = await translateText(attr.options);
                    console.log(`  Attribute value: ${attr.options} -> ${attrTranslation.options_en}`);
                }

                // Add a small delay to avoid rate limiting
                await delay(500);
            }

            // Translate meta data that might contain translatable content
            for (let j = 0; j < product.meta_data.length; j++) {
                const meta = product.meta_data[j];
                const metaTranslation = product.translations.meta_data[j];

                // Only translate string values that look like they contain text (not IDs, etc.)
                if (typeof meta.value === 'string' && meta.value.length > 5 && /[a-zA-Z]/.test(meta.value)) {
                    metaTranslation.value_en = await translateText(meta.value);
                    console.log(`  Meta ${meta.key}: translated (${meta.value.length} chars)`);
                }

                // Add a small delay to avoid rate limiting
                await delay(500);
            }

            // Save progress after each product
            fs.writeFileSync(config.outputFile, JSON.stringify(productContent, null, 2));

            // Add a delay between products to avoid rate limiting
            await delay(1000);
        }

        console.log(`Translation completed and saved to ${config.outputFile}`);
        console.log('Next steps:');
        console.log('1. Review the translations in the output file');
        console.log('2. Run the upload-translations.js script to upload translations to WordPress');

        // Also create a CSV for easier editing in Excel/Google Sheets
        createCsvFile(productContent);

    } catch (error) {
        console.error('Error translating product content:', error);
    }
}

// Helper function to translate text using free Google Translate API
async function translateText(text) {
    if (!text || text.trim() === '') return '';

    try {
        // Use Google Cloud Translation API if configured
        if (config.useGoogleCloudApi) {
            return await translateWithGoogleCloud(text);
        }

        // Otherwise use the free translation API
        const response = await axios.get(config.freeTranslationApiUrl, {
            params: {
                client: 'gtx',
                sl: config.sourceLanguage,
                tl: config.targetLanguage,
                dt: 't',
                q: text
            }
        });

        // Extract the translation from the response
        if (response.data && response.data[0] && response.data[0][0]) {
            return response.data[0][0][0];
        }

        return text; // Return original text if translation failed
    } catch (error) {
        console.error('Translation error:', error.message);
        return text; // Return original text if translation failed
    }
}

// Helper function to translate long text by breaking it into chunks
async function translateLongText(text) {
    if (!text || text.trim() === '') return '';

    // If text is short enough, translate it directly
    if (text.length < 1000) {
        return await translateText(text);
    }

    // Otherwise, break it into paragraphs and translate each one
    const paragraphs = text.split(/\n+/);
    const translatedParagraphs = [];

    for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i].trim();
        if (paragraph) {
            const translatedParagraph = await translateText(paragraph);
            translatedParagraphs.push(translatedParagraph);

            // Add a small delay to avoid rate limiting
            await delay(500);
        }
    }

    return translatedParagraphs.join('\n\n');
}

// Helper function to translate with Google Cloud Translation API
async function translateWithGoogleCloud(text) {
    // This requires setting up Google Cloud credentials
    // and installing @google-cloud/translate
    try {
        const { Translate } = require('@google-cloud/translate').v2;
        const translate = new Translate();

        const [translation] = await translate.translate(text, config.targetLanguage);
        return translation;
    } catch (error) {
        console.error('Google Cloud Translation error:', error.message);
        return text; // Return original text if translation failed
    }
}

// Helper function to create a delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper function to create a CSV file
function createCsvFile(products) {
    const csvFile = path.join(__dirname, 'translated-products.csv');
    let csvContent = 'ID,Name,Name (English),Description,Description (English),Short Description,Short Description (English)\n';

    products.forEach(product => {
        // Escape CSV fields
        const escapeCsv = (text) => `"${(text || '').replace(/"/g, '""')}"`;

        csvContent += [
            product.id,
            escapeCsv(product.name),
            escapeCsv(product.translations.name_en),
            escapeCsv(product.description),
            escapeCsv(product.translations.description_en),
            escapeCsv(product.short_description),
            escapeCsv(product.translations.short_description_en)
        ].join(',') + '\n';
    });

    // Add attributes to CSV
    csvContent += '\n\nAttributes\n';
    csvContent += 'Product ID,Product Name,Attribute Name,Attribute Name (English),Value,Value (English)\n';

    products.forEach(product => {
        product.attributes.forEach((attr, index) => {
            const translation = product.translations.attributes[index];
            const escapeCsv = (text) => `"${(text || '').replace(/"/g, '""')}"`;

            csvContent += [
                product.id,
                escapeCsv(product.name),
                escapeCsv(attr.name),
                escapeCsv(translation.name_en),
                escapeCsv(attr.options),
                escapeCsv(translation.options_en)
            ].join(',') + '\n';
        });
    });

    fs.writeFileSync(csvFile, csvContent);
    console.log(`CSV file created at ${csvFile}`);
}

// Run the script
translateProductContent(); 