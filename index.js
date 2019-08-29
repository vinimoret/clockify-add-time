#!/usr/bin/env node
require('dotenv').config();
const inquirer = require('inquirer');
const rp = require('request-promise');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
const pkg = require('./package.json');
const { getWorkspaces, putHours } = require('./lib/clockifyRequest');
const { searchProject } = require('./lib/helper');

(async () => {
  const projects = await getWorkspaces();
  const questions = [{ type: 'autocomplete', name: 'projectName', message: 'Choose the project', source: searchProject, pageSize: 10 }, { type: 'confirm', name: 'onlyToday', message: 'Only today?', default: true }];
  const hours = [
    {
      type: 'number',
      name: 'hoursWorked',
      message: 'Hours Worked',
      default: 8,
      validate: function(value) {
        var pass = value.toString().match(/[\d]/i);
        if (pass) {
          return true;
        }
        return 'Please enter a number';
      },
    },
  ];

  const daysWorkedAndHours = [
    {
      type: 'input',
      name: 'daysWorked',
      message: 'Days Worked E.g(27-31)',
      validate: function(value) {
        var pass = value.match(/(\d{1,2}-\d{1,2})/i);
        if (pass) {
          return true;
        }
        return 'Please enter a valid range of days i.e 15-19';
      },
    },
    {
      type: 'number',
      name: 'hoursWorked',
      message: 'Hours worked by day (NOT THE TOTAL SUM)',
      default: 8,
      validate: function(value) {
        var pass = value.toString().match(/[\d]/i);
        if (pass) {
          return true;
        }
        return 'Please enter a number';
      },
    },
  ];
  inquirer.prompt(questions).then(function(answers) {
    if (answers.onlyToday) {
      inquirer.prompt(hours).then(async function(hours) {
        1;
        await putHours({ ...answers, ...hours, project: projects.find(proj => proj.name === answers.projectName) });
        console.log('Done!');
      });
    } else {
      inquirer.prompt(daysWorkedAndHours).then(async function(hoursAndDays) {
        await putHours({ ...answers, ...hoursAndDays, project: projects.find(proj => proj.name === answers.projectName) });
        console.log('Done!');
      });
    }
  });
})();
