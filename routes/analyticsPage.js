﻿'use strict';
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require("body-parser");
const auth = require('../code/authentication');
const jsonParser = bodyParser.json();

//Connection to DB
const db = require('../code/database');
const connection = db.con;
const loc = require('../code/locale');

//confin in js, if need some not in pug
let configjs = {}

router.get('/getConfig', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(configjs);
});

router.get('/', function (req, res) {
    let config = {
        //route name pun in dom to #pageinfo
        page: "statistics",
        ArticlePost: "#statistics"
    }
    //pug file
    res.render("analyticsPage", getlocale(req, config));
});

router.get('/getTable', function (req, res) {

    auth.check({
        req: req,
        res: res,
        roles: ["SUPERADMIN", "ADMIN", "OPERATOR", "PERFOMER"]
    }, (user) => {
        res.setHeader('Content-Type', 'application/json');
        let lang = req.cookies.lang;

        let date_from = req.query.date_from;
        let date_to = req.query.date_to;
        let id_organization = user.id_organization

        let query = `SELECT status_name, count(statement_journal.id_statement_status) AS number, date_create
        FROM statement_journal INNER JOIN statement_statuses 
        ON statement_journal.id_statement_status = statement_statuses.id_statement_status 
        INNER JOIN users ON statement_journal.id_user = users.id_user
        WHERE date_create BETWEEN ? AND ?`;

        if (user.user_role == "SUPERADMIN")
            query += ' ';
        else
            query += ' AND statement_journal.id_organization = ? ';

        query += ` GROUP BY status_name;`

        connection.query(query, [date_from, date_to, id_organization], function (err, rows, fields) {
            if (err) {
                res.status(400);
                res.send(err);
                return;
            }


            let statys_data = [];
            for (let i = 0; i < rows.length; i++) {
                statys_data[i] = [rows[i].status_name, rows[i].number];
            }
            res.send({
                head: [{
                        title: loc.getWord(lang, "statement_status")
                    },
                    {
                        title: loc.getWord(lang, "amount")
                    }
                ],
                //First MUST! be ID
                body: statys_data
            });
        });
    });

});


module.exports = router;