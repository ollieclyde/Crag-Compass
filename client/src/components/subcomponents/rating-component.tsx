// CustomRating.tsx

import React from "react";
import Rating from "@mui/material/Rating";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Create a default MUI theme
const theme = createTheme();

interface CustomRatingProps {
  avgRating: number | undefined;
}

// Define the component with props using TypeScript
const RatingComponent: React.FC<CustomRatingProps> = ({ avgRating }) => {
  return (
    <ThemeProvider theme={theme}>
      <Rating
        name="customized-rating"
        size={"large"}
        defaultValue={avgRating}
        precision={0.1}
        max={3}
        readOnly
      />
    </ThemeProvider>
  );
};

export default RatingComponent;
