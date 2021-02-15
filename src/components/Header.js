import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Text,
  useColorMode,
  Link,
} from "@chakra-ui/react";
import { Link as GatsbyLink } from "gatsby";
import React from "react";
import { FaGithub, FaLightbulb, FaMoon } from "react-icons/fa";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  let darkModeIcon;
  if (colorMode === "dark") {
    darkModeIcon = <FaLightbulb />;
  } else {
    darkModeIcon = <FaMoon />;
  }

  return (
    <>
      <GatsbyLink to="/">
        <Heading as="h1" size="4xl" mb={4}>
          Most&nbsp;
          <Text as="span" textColor="blue.500">
            Cited
          </Text>
        </Heading>
      </GatsbyLink>
      <Text fontSize="xl" pl={1} mb={0}>
        A collection of the most cited papers from top conferences.
      </Text>
      <Text fontSize="sm" pl={1} mb={4}>
        Data fetched from{" "}
        <Link href="https://academic.microsoft.com" isExternal fontWeight="600">
          Microsoft Academic
        </Link>
        .
      </Text>
      <HStack spacing={4} mb={4} pl={1}>
        {/* <Box pl={1}>
          <iframe
            src="https://ghbtns.com/github-btn.html?user=twbs&repo=bootstrap&type=star&count=true"
            frameborder="0"
            scrolling="0"
            width="120"
            height="20"
            title="GitHub"
          ></iframe>
        </Box> */}
        <Button
          leftIcon={darkModeIcon}
          variant="outline"
          size="sm"
          onClick={toggleColorMode}
        >
          Dark Mode
        </Button>
        <Button leftIcon={<FaGithub />} variant="outline" size="sm">
          GitHub Repository
        </Button>
      </HStack>
      <Divider mb={4} />
    </>
  );
};

export default Header;
