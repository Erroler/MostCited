import {
  Badge,
  Box,
  CloseButton,
  HStack,
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Link,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Icon,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { navigate } from "gatsby";
import * as React from "react";
import { FaUserFriends, FaBuilding } from "react-icons/fa";

const PaperRow = ({ paper }) => {
  const authors = paper.authors
    .map(({ name }, i) => (i < 2 ? name : null))
    .filter(Boolean)
    .join(", ");

  const authorsString = (
    <span>
      {authors}
      {paper.authors.length > 3 ? (
        <>
          <i>, et al</i>.
        </>
      ) : (
        <></>
      )}
    </span>
  );

  const institutions = paper.authors
    .map(({ affiliation }) => affiliation)
    .filter(Boolean)
    .filter((x, i, a) => a.indexOf(x) == i)
    .filter((_, i) => i < 2)
    .join(", ");

  return (
    <Tr>
      <Td pl="4">
        <Link href={paper.links[0]} fontWeight="600" isExternal>
          <Text display="inline" fontSize="sm">
            {paper.name}
          </Text>
        </Link>
        <HStack mt="2" fontSize="sm">
          <Icon as={FaUserFriends} />
          <Text color={useColorModeValue("blackAlpha.700", "whiteAlpha.700")}>
            {authorsString}
          </Text>
        </HStack>
        <HStack mt="1" fontSize="sm">
          <Icon as={FaBuilding} />
          <Text color={useColorModeValue("blackAlpha.700", "whiteAlpha.700")}>
            {institutions}
          </Text>
        </HStack>
      </Td>
      <Td pr="4" textAlign="center" fontSize="sm">
        {paper.citations}
      </Td>
    </Tr>
  );
};

export default function ConferencePage({
  pageContext: { conference, displayYear },
}) {
  const allPapers = conference.years.filter(
    ({ year }) => year == displayYear
  )[0].papers;
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
  const maxPages = Math.ceil(allPapers.length / itemsPerPage);
  const papers = allPapers.filter(
    (_, i) =>
      i >= (currentPage - 1) * itemsPerPage && i < currentPage * itemsPerPage
  );

  return (
    <Box as="main" px={1}>
      <HStack>
        <Text fontSize="md" mb={0}>
          Showing most cited papers for:{" "}
        </Text>
        <Tag variant="solid" colorScheme="blue" borderRadius="full" size="md">
          <TagLabel>
            {conference.shortName.toUpperCase()} {displayYear}
          </TagLabel>
          <TagCloseButton onClick={() => navigate("/")} />
        </Tag>
      </HStack>
      <Table
        variant="simple"
        mt="4"
        mb="2"
        border="1px"
        borderColor="gray.100"
        borderRadius="sm"
        shadow="sm"
      >
        <Thead>
          <Tr>
            <Th pl="4">Paper</Th>
            <Th pr="4">Citations</Th>
          </Tr>
        </Thead>
        <Tbody>
          {papers.map((paper) => (
            <PaperRow paper={paper} key={paper.id} />
          ))}
        </Tbody>
      </Table>
      <HStack mb="2" justifyContent="flex-end">
        {Array.from(Array(maxPages).keys()).map((page) => {
          return (
            <Button
              colorScheme="blue"
              variant={page + 1 == currentPage ? "solid" : "outline"}
              size="sm"
              ml="1"
              onClick={() => setCurrentPage(page + 1)}
            >
              {page + 1}
            </Button>
          );
        })}
      </HStack>
    </Box>
  );
}
