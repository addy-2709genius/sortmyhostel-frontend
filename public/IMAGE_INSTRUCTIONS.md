# Image Setup Instructions

To use the children image as background for the "Yesterday's Food Wastage" component:

1. Save your image file in this folder (`/public/`) with one of these names:
   - `children-waiting-food.jpg` (recommended)
   - `children-waiting-food.jpeg`
   - `children-waiting-food.png`
   - `children-waiting-food.webp`

2. The component will automatically detect and load the image in any of these formats
3. The image will be used as the background with a semi-transparent overlay for text readability

**Note:** The system automatically tries all formats, so you only need to save the image with one of the names above. The first format that exists will be used.

If you want to use a different filename, update the component file:
- File: `src/components/YesterdayImpact.jsx`
- Update the `baseName` variable in the `loadBackgroundImage` function

