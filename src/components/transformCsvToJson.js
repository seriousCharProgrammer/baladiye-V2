import Papa from 'papaparse';

// Function to transform CSV to categorized JSON
const transformCsvToJson = async () => {
  try {
    // Read the CSV file
    const csvContent = await window.fs.readFile('/assets/bourjmoul1.csv', {
      encoding: 'utf8',
    });

    // Parse the CSV data
    const parsedData = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    // Create the categorized structure
    const result = {
      لنا: [], // forUs
      لهم: [], // forThem
      حكومة: [], // Goverment
      أجانب: [], // Foreginers
      غير_معروف: [], // Unknown
    };

    // Categorize each row based on color
    parsedData.data.forEach((row) => {
      // Normalize the color value (case-insensitive comparison)
      const color = row.Color ? row.Color.toLowerCase().trim() : '';

      // Assign each row to its category based on color
      if (color === 'yellow') {
        result.لنا.push(row);
      } else if (color === 'green') {
        result.لهم.push(row);
      } else if (color === 'orange') {
        result.حكومة.push(row);
      } else if (color === 'blue') {
        result.أجانب.push(row);
      } else {
        // White or any other color (including no color) goes to Unknown
        result.غير_معروف.push(row);
      }
    });

    // Convert to JSON string with proper formatting
    return JSON.stringify(result, null, 2);
  } catch (error) {
    console.error('Error processing CSV:', error);
    return JSON.stringify({ error: 'Failed to process CSV file' });
  }
};

// Call the function to get the formatted JSON
const jsonOutput = await transformCsvToJson();

// Output the JSON (you can save this to a file in a real environment)
console.log(jsonOutput);

// Alternatively, you could write this to a file like:
// await fs.writeFile('categorized_data.json', jsonOutput);

// Return statistics about the categorization
const resultObj = JSON.parse(jsonOutput);
return {
  totalRecords: Object.values(resultObj).flat().length,
  categoryCounts: {
    لنا: resultObj.لنا.length,
    لهم: resultObj.لهم.length,
    حكومة: resultObj.حكومة.length,
    أجانب: resultObj.أجانب.length,
    غير_معروف: resultObj.غير_معروف.length,
  },
};
