const mongoose = require('mongoose');
require('dotenv').config();
const Team = require('./models/Team');

const seedTeams = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB for seeding');

    const teams = [
      { name: 'Bug Team', category_handled: 'Bug Report' },
      { name: 'Product Team', category_handled: 'Feature Request' },
      { name: 'Support Team', category_handled: 'Complaint' },
      { name: 'UX Team', category_handled: 'Usability Feedback' },
    ];

    for(let t of teams) {
      const exists = await Team.findOne({ name: t.name });
      if(!exists) {
        await Team.create(t);
        console.log('Created team:', t.name);
      }
    }

    console.log('Seeding complete');
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
};

seedTeams();
