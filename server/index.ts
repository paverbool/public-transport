// Import the express in typescript file
import express from 'express';
import cors from 'cors';
import cluster from 'cluster';
import AWS from 'aws-sdk';
import path from "path";
import {filterIsochronesMapbox, FilterIsochronesMapboxParams} from "./utils/filterIsochrones";
import fs from "fs";
import {isochronesUnify} from "./API/isochronesUnify";


// Include the cluster module

function parseKeys(keys?: string | null) {
    try {
        return keys ? JSON.parse(keys) : null;
    } catch (er) {
        console.log(er)
    }
    return null
}

// Code to run if we're in the master process
if (cluster.isPrimary) {

    // Count the machine's CPUs
    const cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for terminating workers
    cluster.on('exit', function (worker: any) {

        // Replace the terminated workers
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();

    });

// Code to run if we're in a worker process
} else {


    AWS.config.region = process.env.REGION

    const sns = new AWS.SNS();
    const ddb = new AWS.DynamoDB();

    const ddbTable = process.env.STARTUP_SIGNUP_TABLE;
    const snsTopic = process.env.NEW_SIGNUP_TOPIC;
    const app: express.Application = express();

    app.use(cors())
    app.use(express.json());

    app.post('/api/signup', function (req, res) {
        var item = {
            'email': {'S': req.body.email},
            'name': {'S': req.body.name},
            'preview': {'S': req.body.previewAccess},
            'theme': {'S': req.body.theme}
        };

        ddb.putItem({
            // @ts-ignore
            'TableName': ddbTable,
            'Item': item,
            'Expected': {email: {Exists: false}}
        }, function (err: any, data: any) {
            if (err) {
                let returnStatus = 500;

                if (err.code === 'ConditionalCheckFailedException') {
                    returnStatus = 409;
                }

                res.status(returnStatus).end();
                console.log('DDB Error: ' + err);
            } else {
                sns.publish({
                    'Message': 'Name: ' + req.body.name + "\r\nEmail: " + req.body.email
                        + "\r\nPreviewAccess: " + req.body.previewAccess
                        + "\r\nTheme: " + req.body.theme,
                    'Subject': 'New user sign up!!!',
                    'TopicArn': snsTopic
                }, function (err: any, data: any) {
                    if (err) {
                        res.status(500).end();
                        console.log('SNS Error: ' + err);
                    } else {
                        res.status(201).end();
                    }
                });
            }
        });
    });


    // Handling '/routes' Request
    app.post<{ city: string; keys: string[] }>('/api/routes', (_req, _res) => {
        const keys = _req.body?.keys as string[] || ["Трамвай", "Швидкісний трамвай", "Автобус", "Метро", "Електричка", "Маршрутка", "Приміський", "Потяги", "Електрички"]
        const city = _req.body.city || 'kharkiv'
        console.log(keys, city)
        const d = JSON.parse(fs.readFileSync(`./server/store/${city}/ROUTES_DATA.json`, "utf8"));

        const response = keys.reduce((acc, k) => {
            let values = d[k];
            if (!values) {
                try {
                    values = JSON.parse(fs.readFileSync(`./server/store/${city}/ROUTES_DATA_${k}.json`, "utf8"))[k];
                } catch (e) {
                    console.log(e)
                }
            }
            return ({...acc, [k]: values});
        }, {})
        _res.send(response);
    });

    app.post('/api/isochrones/unify', async (_req, _res) => {
        const {ids, city, desiredContour} = _req.body;
        _res.send(isochronesUnify(ids, city, desiredContour));
    });

    app.get('/api/buildings/:page', async (_req, _res) => {
        const page = Number(_req.params.page);
        // _res.send(DATA_buildings.slice(page * 1000, (page + 1) * 1000));
        // _res.send(DATA_buildings);
    });

    app.get('/api/spending', async (_req, _res) => {
        // _res.send(DATA_buildings.slice(page * 1000, (page + 1) * 1000));
        // _res.send(DATA_buildings);
    });

    app.post<{ desiredContour: FilterIsochronesMapboxParams, city: string }>('/api/isochones', async (_req, _res) => {
        const ids = _req.body?.ids || {};
        const desiredContour = _req.body?.desiredContour || {all: 6, 'Метро': 10};
        const city = _req.body?.city || 'kharkiv';
        const resp =  filterIsochronesMapbox(ids, desiredContour, city);
        _res.send(resp)
    });

    app.use(express.static(path.join(__dirname, '../')));
    app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, '../index.html'));
    });


    const port = process.env.PORT || 3004;

    const server = app.listen(port, function () {
        console.log('Server running at http://127.0.0.1:' + port + '/');
    });
}
