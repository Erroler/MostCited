import { Box } from "@chakra-ui/react";
import * as React from "react";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <Box maxW="xl" mx="auto" px={2} pt={[2, 8, 12]} mb="4">
      <Header />
      {children}
    </Box>
  );
};

export default Layout;
