const rp = require('request-promise');
const moment = require('moment');
const { execSync } = require('child_process');
const data = JSON.parse(execSync('cat ~/.credentials/value'));

async function getWorkspaces() {
  return JSON.parse(
    await rp.get(`https://api.clockify.me/api/v1/workspaces/${data.PROJECT_ID}/projects`, {
      headers: { 'X-Api-Key': data.API_KEY },
    })
  );
}

async function putHours(values) {
  const { projectName, onlyToday, daysWorked, hoursWorked, project } = values;

  if (onlyToday) {
    const day = moment({hour: 9})._d;
    await rp.post(`https://api.clockify.me/api/v1/workspaces/${data.PROJECT_ID}/time-entries`, {
      headers: { 'X-Api-Key': data.API_KEY },
      body: {
        start: day,
        billable: project.billable || false,
        description: '',
        projectId: project.id,
        taskId: null,
        end: moment(day)
            .add(hoursWorked, 'hours')
            .utc()._d,
      },
      json: true,
    });
  } else {
    const days = daysWorked.split('-');
    for (let i = days[0]; i <= days[1]; i++) {
      const day = moment(new Date(moment().year(), moment().month(), i, 9)).utc()._d;
      await rp.post(`https://api.clockify.me/api/v1/workspaces/${data.PROJECT_ID}/time-entries`, {
        headers: { 'X-Api-Key': data.API_KEY },
        body: {
          start: day,
          billable: project.billable || false,
          description: '',
          projectId: project.id,
          taskId: null,
          end: moment(day)
            .add(hoursWorked, 'hours')
            .utc()._d,
        },
        json: true,
      });
    }
  }
}

module.exports = {
  getWorkspaces,
  putHours,
};
