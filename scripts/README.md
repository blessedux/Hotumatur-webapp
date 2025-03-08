# WordPress Product Translation Scripts

These scripts help you extract, translate, and upload translations for your WooCommerce products. This is a simple alternative to installing a translation plugin like Polylang or WPML.

## Prerequisites

1. Node.js installed on your computer
2. Access to your WordPress site's WooCommerce REST API
3. WooCommerce REST API credentials (consumer key and secret)

## Installation

1. Install the required packages:

```bash
npm install node-fetch@2 csv-writer csv-parser
```

2. Set up your WooCommerce API credentials (optional):

```bash
export WC_CONSUMER_KEY=your_consumer_key
export WC_CONSUMER_SECRET=your_consumer_secret
```

Alternatively, you can edit the scripts and replace the default values with your actual credentials.

## Usage

### Step 1: Extract Product Content

Run the extraction script to get all product content in CSV format:

```bash
node extract-product-content.js
```

This will create several CSV files in the `translations` directory:

- `product-basic-content.csv`: Contains product names, descriptions, and short descriptions
- `product-html-content.csv`: Contains the HTML versions of descriptions (for reference)
- `product-attributes.csv`: Contains product attributes (name and values)
- `product-meta-data.csv`: Contains other meta data that might need translation

### Step 2: Translate the Content

Open the CSV files in Excel, Google Sheets, or any spreadsheet application. Add your translations in the "English Translation" columns.

Tips for translation:

- Focus on the most important content first (names, descriptions, attributes)
- For HTML content, you can refer to the `product-html-content.csv` file to see the original formatting
- You don't need to translate every field - only translate what's important for your site

### Step 3: Upload Translations

Once you've added translations, run the upload script:

```bash
node upload-translations.js
```

This will:

1. Read your translated CSV files
2. Format the translations as meta data
3. Upload the translations to WordPress using the WooCommerce REST API

The translations will be stored as meta data with keys like:

- `name_en` for product names
- `description_en` for product descriptions
- `short_description_en` for short descriptions
- `attribute_name_en` for attribute names
- `attribute_attributename_en` for attribute values

### Step 4: Use the Translations in Your Next.js App

Your Next.js app can now use these translations. The existing code in your app should already be set up to look for these meta data fields.

## Troubleshooting

- **API Authentication Errors**: Make sure your WooCommerce API credentials are correct
- **Rate Limiting**: If you get rate limiting errors, increase the delay in the scripts
- **Missing Translations**: Check that you've filled in the translation columns correctly
- **HTML Formatting Issues**: For HTML content, make sure to preserve HTML tags in your translations

## Advanced Usage

### Adding More Languages

These scripts are set up for Spanish to English translation, but you can modify them to support more languages:

1. Add more columns to the CSV files (e.g., "French Translation")
2. Update the upload script to handle the additional languages
3. Use language codes in the meta keys (e.g., `name_fr`, `description_fr`)

### Automating Translation

If you want to automate translation, you can use the Google Cloud Translation API:

1. Set up a Google Cloud account and enable the Translation API
2. Install the Google Cloud client library: `npm install @google-cloud/translate`
3. Create a service account and download the credentials
4. Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable
5. Create a script that uses the Translation API to translate your content

## License

These scripts are provided as-is, free to use for any purpose.
