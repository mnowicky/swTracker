const logger = require('./logger');

module.exports = {
    run: function(){
        const Imap = require('imap');
        const {simpleParser} = require('mailparser');
        var logger = require('./logger.js');
        var fs = require('fs'), fileStream;

        const imapConfig = {
            user: "camtracker@apps.wnybusco.com",
            password: "moeSywbYAeGW",
            host: "a2plcpnl0275.prod.iad2.secureserver.net",
            port: 993,
            tls: true
        }

        const getEmails = () => {
            try{
                const imap = new Imap(imapConfig);
                imap.once('ready', () => {
                    imap.openBox('INBOX', false, () => {
                        imap.search(
                            ['ALL', ['SINCE', new Date()]],
                            function(err, results) {
                                if(err) throw err;
                            else if(!results || !results.length){
                                logger.printWriteLine('No results matching search criteria; no new messages.', 2);
                            }
                            else{
                                const f = imap.fetch(results, {bodies: ''});
                                f.on('message', msg => {
                                    msg.on('body', stream => {
                                        simpleParser(stream, async (err, parsed) => {
                                            const {from, subject, text} = parsed;
                                            logger.printWriteLine(JSON.stringify(parsed), 0);

                                        });
                                    });

                                    msg.once('attributes', attrs => {
                                        const {uid} = attrs;
                                        imap.addFlags(uid, ['\\Seen'], () => {
                                            console.log('Marked seen.');
                                        });
                                    });
                                });
                                f.once('error', ex => {
                                    return Promise.reject(ex);
                                });
                                f.once('end', () => {
                                    console.log('Done fetching messages.');
                                });
                            }
                        });
                    });
                });

                imap.once('error', err => {
                    console.log(err);
                });

                imap.once('end', () => {
                    console.log('Connection closed');
                });

                imap.connect();
            } catch (ex) {
                console.log('error.');
            }

        };

        getEmails();
        
    }
}