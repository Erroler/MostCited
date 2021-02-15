require("dotenv").config();

const config = {
  conferences: {
    iclr: "International Conference on Learning Representations",
    nips: "Neural Information Processing Systems",
    icml: "International Conference on Machine Learning",
    cvpr: "Conference on Computer Vision and Pattern Recognition",
    iccv: "International Conference on Computer Vision",
    ijcai: "International Joint Conferences on Artificial Intelligence",
    eccv: "European Conference on Computer Vision",
    colt: "Conference on Learning Theory",
    aaai: "National Conference on Artificial Intelligence",
    pkdd:
      "European Conference on Machine Learning and Principles and Practice of Knowledge Discovery in Databases",
  },
  startingYear: 2013,
  count: 50,
  apiKey: process.env.MICROSOFT_ACADEMIC_API_KEY,
};

module.exports = {
  plugins: [
    {
      resolve: require.resolve(`./microsoft-academic-plugin`),
      options: {
        config,
      },
    },
    "@chakra-ui/gatsby-plugin",
    {
      resolve: `gatsby-plugin-build-date`,
      options: {
        formatAsDateString: true, // boolean, defaults to true - if false API will return unformatted string from new Date()
        formatting: {
          format: "DD/MM/YYYY", // string, defaults to "MM/DD/YYYY" - pass in any acceptable date-and-time format
          utc: false, // boolean, defaults to false - output time as UTC or not, following date-and-time API
        },
      },
    },
  ],
  pathPrefix: process.env.GATSBY_PATH || "/",
};
