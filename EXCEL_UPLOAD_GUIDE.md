# Excel Menu Upload Guide

## How It Works

When you upload an Excel file (.xlsx, .xls, or .csv) through the Admin Dashboard, the system will:

1. **Parse the Excel file** - Extract menu data from the first sheet
2. **Update the menu** - Replace the weekly menu with new data
3. **Preserve feedback** - Keep existing likes, dislikes, and comments for items that still exist
4. **Auto-refresh** - Student view automatically updates to show the new menu

## Expected Excel Format

Your Excel file should follow this structure:

### Row 1: Day Headers
- Column A: Leave empty or use for categories
- Column B onwards: Day names (Monday, Tuesday, Wednesday, etc.)

### Row 2: Dates
- Column A: Leave empty
- Column B onwards: Dates for each day (e.g., 2025-12-15, Dec 15, 12/15/2025)

### Row 3 onwards: Meal Categories and Items
- Column A: Meal category (Breakfast, Lunch, Snacks, Dinner) or food item name
- Column B onwards: Food items for each day

### Example Structure:

```
| Category    | Monday      | Tuesday     | Wednesday   |
|-------------|-------------|-------------|-------------|
| Date        | 2025-12-15  | 2025-12-16  | 2025-12-17  |
| Breakfast   |             |             |             |
| Poha        | Poha        | Veg Upma    | Aloo Paratha|
| Tea/Coffee  | Tea/Coffee  | Tea/Coffee  | Tea/Coffee  |
| Lunch       |             |             |             |
| Dal Tadka   | Dal Tadka   | Dal Makhani | Punjabi Kadhi|
| Roti        | Roti        | Roti        | Roti        |
```

## Features

✅ **Automatic Parsing** - Recognizes days, dates, and meal categories
✅ **Feedback Preservation** - Existing likes/dislikes/comments are kept
✅ **Real-time Updates** - Student view refreshes automatically
✅ **Multiple Formats** - Supports .xlsx, .xls, and .csv files
✅ **Date Recognition** - Handles various date formats

## How to Upload

1. Go to Admin Dashboard
2. Scroll to "Upload Weekly Menu (Excel)" section
3. Click "Choose Excel File" or drag and drop your file
4. Wait for "Menu uploaded successfully!" message
5. The menu will update automatically on the student view

## Notes

- The system matches items by name (case-insensitive)
- New items start with zero likes/dislikes
- Items that no longer exist in the Excel will be removed from the menu
- Dates can be in various formats (YYYY-MM-DD, MM/DD/YYYY, etc.)






