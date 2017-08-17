/**
 * Created by drouar_b on 15/08/2017.
 */

const debug = require('debug')('universal');
const proxy = require('./proxy');

let universal = {};
universal.cache = {};

universal.stopTranscoder = function (req, res) {
    if (typeof universal.cache[req.query.session] != 'undefined') {
        debug('Stop ' + req.query.session);
        universal.cache[req.query.session].killInstance();
    }
    res.send('');
};

universal.updateTimeout = function (sessionId) {
    if (typeof sessionId != 'undefined' && typeof universal.cache[sessionId] != 'undefined' && universal.cache[sessionId].alive) {
        debug('Ping ' + sessionId);

        if (universal.cache[sessionId].timeout != undefined)
            clearTimeout(universal.cache[sessionId].timeout);

        universal.cache[sessionId].timeout = setTimeout(() => {
            debug(sessionId + ' timed out');
            universal.cache[sessionId].killInstance()
        }, 120000)
    }
};

universal.ping = function (req, res) {
    universal.updateTimeout(req.query.session);
    proxy(req, res);
};

universal.timeline = function (req, res) {
    universal.updateTimeout(req.query["X-Plex-Client-Identifier"]);
    proxy(req, res);
};

module.exports = universal;