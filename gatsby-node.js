import { resolve } from "path";

async function createConferencePages({ graphql, actions }) {
  const { data } = await graphql(`
    query {
      conferences: allConference {
        nodes {
          id
          shortName
          longName
          years {
            year
            papers {
              name
              citations
              slug
              links
              authors {
                name
                affiliation
              }
            }
          }
        }
      }
    }
  `);
  data.conferences.nodes.forEach((conference) => {
    conference.years.forEach(({ year }) => {
      actions.createPage({
        component: resolve("./src/pages/Conference.js"),
        path: `/${conference.shortName}/${year}`,
        context: {
          conference: conference,
          displayYear: year,
        },
      });
    });
  });
}

export async function createPages(params) {
  await createConferencePages(params);
}
