/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

const axios = require("axios");

const fetchPapers = async (
  { actions, createNodeId, createContentDigest },
  { config }
) => {
  const requests = [];
  for (const [shortConferenceName, longConferenceName] of Object.entries(
    config.conferences
  )) {
    const yearsIds = [];
    const currentYear = new Date().getFullYear();
    const years = Array.from(
      { length: currentYear - config.startingYear },
      (_, i) => i + config.startingYear
    );
    for (const year of years) {
      // Fetch papers for conference in said year.
      const papers = await axios
        .get(
          "https://api.labs.cognitive.microsoft.com/academic/v1.0/evaluate",
          {
            headers: {
              "Ocp-Apim-Subscription-Key": config.apiKey,
            },
            params: {
              attributes: `Id,DN,VSN,VFN,C.CN,CC,AA.DAuN,AA.DAfN,S,Ti,D,IA`,
              expr: `AND(COMPOSITE(C.CN='${shortConferenceName}'), Y=${year})`,
              orderBy: `CC:desc`,
              count: config.count,
            },
          }
        )
        .then(async function ({ data }) {
          const { entities } = data;
          const papers = entities.map((entity) => {
            // const abstract_length = entity.IA.IndexLength;
            // let abstract = Array(abstract_length).fill('');
            // for (let [key, value] of Object.entries(entity.IA.InvertedIndex)) {
            //     value.forEach(val => { abstract[value] = key });
            // }
            // abstract = abstract.join(' ');
            const paper = {
              name: entity.DN,
              citations: entity.CC,
              authors: entity.AA.map((author) => ({
                name: author.DAuN,
                affiliation: author.DAfN,
              })),
              links: (entity.S && entity.S.map((link) => link.U)) || [""],
              slug: entity.Ti.split(" ").join("-"),
              date: new Date(entity.D),
            };
            return paper;
          });
          return papers;
        });
      // Create papers.
      const papers_nodes_ids = [];
      for (const paper of papers) {
        const paperMeta = {
          id: createNodeId(`paper-${paper.slug}`),
          parent: null,
          children: [],
          internal: {
            type: "ConferenceYearPaper",
            mediaType: "application/json",
            contentDigest: createContentDigest(paper),
          },
        };
        await actions.createNode({
          ...paper,
          ...paperMeta,
        });
        papers_nodes_ids.push(paperMeta.id);
      }
      // Create conference year realization
      const conferenceYear = { year };
      const conferenceYearMeta = {
        id: createNodeId(`conferenceYear-${shortConferenceName}-${year}`),
        papers___NODE: papers_nodes_ids,
        parent: null,
        children: [],
        internal: {
          type: "ConferenceYear",
          mediaType: "application/json",
          contentDigest: createContentDigest(conferenceYear),
        },
      };
      await actions.createNode({
        ...conferenceYear,
        ...conferenceYearMeta,
      });
      yearsIds.push(conferenceYearMeta.id);
    }
    //Create conference
    const conference = {
      shortName: shortConferenceName,
      longName: longConferenceName,
    };
    const conferenceMeta = {
      id: createNodeId(`conference-${shortConferenceName}`),
      years___NODE: yearsIds,
      parent: null,
      children: [],
      internal: {
        type: "Conference",
        mediaType: "application/json",
        contentDigest: createContentDigest(conference),
      },
    };
    await actions.createNode({
      ...conference,
      ...conferenceMeta,
    });
  }
  return requests;
};

export async function sourceNodes(params, pluginOptions) {
  console.log("Loading microsoft-academic-plugin.");
  await fetchPapers(params, pluginOptions);
  console.log("Loaded microsoft-academic-plugin.");
}
