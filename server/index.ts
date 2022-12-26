// Import the express in typescript file
import express from 'express';
import DATA from './ROUTES_DATA.json';
import ISOCHRONES_DATA from './store/isochrones-metro.json';
import cors from 'cors';
import cluster from 'cluster';
import AWS from 'aws-sdk';
import bodyParser from 'body-parser';


// Include the cluster module

// Code to run if we're in the master process
if (cluster.isMaster) {

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


    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');
    app.use(bodyParser.urlencoded({extended: false}));

    app.get('/', function (req, res) {
        res.render('index', {
            static_path: 'static',
            theme: process.env.THEME || 'flatly',
            flask_debug: process.env.FLASK_DEBUG || 'false'
        });
    });

    app.post('/signup', function (req, res) {
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
    app.get('/routes', (_req, _res) => {
        const response = {
            Трамвай: DATA['Трамвай'],
            Автобус: DATA['Автобус'],
            Тролейбус: DATA['Тролейбус'],
            Метро: DATA['Метро'],
            Маршрутка: DATA['Маршрутка'],
            Приміський: DATA['Приміський'],
        }
        _res.send(response);
    });

// Handling '/routes' Request
    app.get('/buildings/:page', async (_req, _res) => {
        const page = Number(_req.params.page);
        // _res.send(DATA_buildings.slice(page * 1000, (page + 1) * 1000));
        // _res.send(DATA_buildings);
    });

    app.get('/spending', async (_req, _res) => {
        // _res.send(DATA_buildings.slice(page * 1000, (page + 1) * 1000));
        // _res.send(DATA_buildings);
    });

    app.get('/isochones', async (_req, _res) => {
        _res.send(ISOCHRONES_DATA);
    });


    const port = process.env.PORT || 3004;

    const server = app.listen(port, function () {
        console.log('Server running at http://127.0.0.1:' + port + '/');
    });
}

// Uncomment to update isochrones
// getIsochrones();