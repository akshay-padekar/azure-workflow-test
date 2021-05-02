const mongoose = require('mongoose')
const config = require('config');

mongoose.connect(config.get('mongodb_url'), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

/* Seed enum data */

const { Seeder } = require('mongo-seeding');

const dbConfig = {
    database: config.get('mongodb_url'),
    databaseReconnectTimeout: 10000,
    dropDatabase: false,
    dropCollections: false,
};

const seeder = new Seeder(dbConfig);

const path = require('path');
const collections = seeder.readCollectionsFromPath(path.resolve("seed-data"));

const initData = async(collections) => {
    try {
        await seeder.import(collections);
    } catch (err) {
        if (err && err.writeErrors.length > 0 && err.writeErrors[0].err) {
            if (err.writeErrors[0].err.code !== 11000) {
                console.log(err.writeErrors[0].err);
            }
            else {
                console.log('Seed data already exists!')
            }
        }
        else {
            console.log(err);
        }
    }
}

initData(collections);
