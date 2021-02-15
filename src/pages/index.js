import { Box, Flex, Heading, HStack, Text, Button } from "@chakra-ui/react";
import { Link } from "gatsby";
import * as React from "react";

function ConferenceCard({ conference }) {
  return (
    <Box
      p={3}
      border="1px"
      borderColor="gray.200"
      borderRadius="sm"
      shadow="sm"
      mb={2}
    >
      <Flex>
        <Box>
          <HStack mb={2} alignItems="baseline">
            <Heading as="h4" size="sm">
              {conference.shortName.toUpperCase()}
            </Heading>
            <Text fontSize="sm">{conference.longName}</Text>
          </HStack>
          <HStack spacing={2}>
            {conference.years
              .sort((a, b) => b.year - a.year)
              .map(({ year }) => (
                <Link to={`/${conference.shortName}/${year}`} key={year}>
                  <Button colorScheme="blue" variant="link" size="sm">
                    {year}
                  </Button>
                </Link>
              ))}
          </HStack>
        </Box>
      </Flex>
    </Box>
  );
}

export default function IndexPage({ data }) {
  const conferences = data.conferences.nodes;
  const buildDate = data.currentBuildDate.currentDate;
  return (
    <Box as="main" px={1}>
      <Text fontSize="md" mb={3}>
        Displaying {conferences.length} conferences.
      </Text>
      {conferences.map((conference) => (
        <ConferenceCard key={conference.id} conference={conference} />
      ))}
      <Text fontSize="sm">Last updated on {buildDate}.</Text>
    </Box>
  );
}

export const query = graphql`
  query ConferenceQuery {
    conferences: allConference(sort: { order: ASC, fields: shortName }) {
      nodes {
        id
        shortName
        longName
        years {
          year
        }
      }
    }
    currentBuildDate {
      currentDate
    }
  }
`;
