const map = require('lodash/map');
const fuzzy = require('fuzzy');
const { getWorkspaces, putHours } = require('./clockifyRequest');

async function searchProject(answers, input) {
  const projects = await getWorkspaces();

  input = input || '';
  return new Promise(function(resolve) {
    setTimeout(function() {
      var fuzzyResult = fuzzy.filter(input, map(projects, 'name'));
      resolve(
        fuzzyResult.map(function(el) {
          return el.original;
        })
      );
    }, 0);
  });
}

module.exports = {
  searchProject,
};
